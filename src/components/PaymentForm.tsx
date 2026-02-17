'use client';

import Script from 'next/script';

import { useCallback, useState, useMemo } from 'react';
import { getConvergeApiBaseUrl } from '@/config/converge';
import { useCsrf } from '@/hooks/useCsrf';

// ---- Ambient types (move to src/types/converge.d.ts if you prefer) ----
interface PayWithConverge {
  open: (
    options: { ssl_txn_auth_token: string },
    handlers: {
      onError: (err: unknown) => void;
      onCancelled: () => void;
      onDeclined: (resp: Record<string, unknown>) => void;
      onApproval: (resp: Record<string, unknown>) => void;
    }
  ) => void;
}

declare global {
  interface Window {
    PayWithConverge?: PayWithConverge;
  }
}

type PaymentResultStatus = '' | 'error' | 'cancelled' | 'declined' | 'approval';

type CreateSessionResponse = { success: true; token: string } | { success: false; error?: string };

interface PaymentFormProps {
  invoiceNumber?: string;
  amount?: string;
  email?: string;
  csrf: string; // Now guaranteed to be present
}

export function PaymentFormContent({
  invoiceNumber,
  amount: initialAmount,
  email: initialEmail,
  csrf,
}: PaymentFormProps) {
  const [jqLoaded, setJqLoaded] = useState(false);
  const [convergeLoaded, setConvergeLoaded] = useState(false);
  const [statusResponse, setStatusResponse] = useState<[PaymentResultStatus, string]>(['', '']);
  const status = statusResponse[0];
  const response = statusResponse[1];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState(initialAmount || '');
  const [manualInvoiceNumber, setManualInvoiceNumber] = useState('');
  const [manualEmail, setManualEmail] = useState(initialEmail || '');

  // We prefill the email input with the `email` prop but keep it editable in state

  // Fetch token and open lightbox
  const handleProcessPayment = useCallback(async () => {
    setLoading(true);
    setError('');
    setStatusResponse(['', '']);
    try {
      const numericAmount = parseFloat(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        setError('Please enter a valid payment amount greater than zero.');
        return;
      }
      if (amount.length > 10) {
        setError('Amount is too large.');
        return;
      }

      const finalInvoiceNumber = invoiceNumber || manualInvoiceNumber || undefined;
      const res = await fetch('/api/elavon/create-session', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'x-csrf': csrf },
        body: JSON.stringify({
          amount: numericAmount,
          invoiceNumber: finalInvoiceNumber,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Payment system error. Please try again.');
      }
      const data = (await res.json()) as CreateSessionResponse;
      if (!('success' in data) || !data.success || !('token' in data) || !data.token) {
        throw new Error((data as { error?: string }).error || 'No token returned');
      }
      // Open lightbox if loaded
      if (!window.PayWithConverge) {
        setError('Elavon Lightbox script not loaded.');
        return;
      }
      window.PayWithConverge.open(
        { ssl_txn_auth_token: data.token },
        {
          onError: (err: unknown) => {
            setStatusResponse(['error', typeof err === 'string' ? err : JSON.stringify(err)]);
          },
          onCancelled: () => {
            setStatusResponse(['cancelled', '']);
          },
          onDeclined: (resp: Record<string, unknown>) => {
            setStatusResponse(['declined', JSON.stringify(resp)]);
          },
          onApproval: (resp: Record<string, unknown>) => {
            setStatusResponse(['approval', JSON.stringify(resp)]);

            // Send payment approval email (fire and forget)
            fetch('/api/email/payment/approval', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'x-csrf': csrf,
              },
              body: JSON.stringify({
                invoiceId: invoiceNumber || manualInvoiceNumber,
                amount: parseFloat(amount),
                email: manualEmail,
              }),
            }).catch((err) => {
              console.error('Failed to send approval email:', err);
              // Don't block user experience if email fails
            });
          },
        }
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  }, [amount, invoiceNumber, manualInvoiceNumber, manualEmail, csrf]);

  const isContinueButtonEnabled = useMemo(() => {
    return (
      !loading &&
      convergeLoaded &&
      !!amount &&
      parseFloat(amount) > 0 &&
      !!(invoiceNumber || manualInvoiceNumber) &&
      !!manualEmail
    );
  }, [loading, convergeLoaded, amount, invoiceNumber, manualInvoiceNumber, manualEmail]);

  // Show loading placeholder until CSRF token is ready
  if (!csrf) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 text-sky-600 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-slate-600">Loading secure payment form...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1) jQuery first */}
      <Script
        id="jquery-cdn"
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="afterInteractive"
        onLoad={() => setJqLoaded(true)}
      />

      {/* 2) Converge only after jQuery is present */}
      {jqLoaded && (
        <Script
          id="converge-lightbox-js"
          src={`${getConvergeApiBaseUrl()}hosted-payments/PayWithConverge.js`}
          strategy="afterInteractive"
          onLoad={() => setConvergeLoaded(true)}
        />
      )}

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
              Payment Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                $
              </span>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Invoice Number */}
          <div>
            <label
              htmlFor="invoiceNumberField"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Invoice Number
            </label>
            {invoiceNumber ? (
              <div className="w-full px-4 py-3 bg-sky-50 border border-slate-300 rounded-lg text-slate-700">
                #{invoiceNumber}
              </div>
            ) : (
              <input
                type="text"
                id="invoiceNumberField"
                value={manualInvoiceNumber}
                onChange={(e) => setManualInvoiceNumber(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900"
                placeholder="INV-2024-001"
                required
              />
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="emailField" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="emailField"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-slate-900"
              placeholder="you@email.com"
              required
            />
          </div>
        </div>

        {/* Invoice Number Display */}
        {(invoiceNumber || manualInvoiceNumber) && (
          <div className="bg-sky-50 p-4 rounded-lg border border-sky-200">
            <p className="text-sm text-slate-600">Invoice Number:</p>
            <p className="font-semibold text-slate-900">#{invoiceNumber || manualInvoiceNumber}</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Payment result / status UI (driven by Converge callbacks) */}
        {status && (
          <div className="mt-4">
            {status === 'approval' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-green-800 font-semibold mb-2">Payment Approved</h4>
                <p className="text-green-700 mb-2">Thank you — your payment was approved.</p>
              </div>
            )}

            {status === 'declined' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-yellow-800 font-semibold mb-2">Payment Declined</h4>
                <p className="text-yellow-700 mb-2">The payment was declined by the issuer.</p>
                <p className="text-sm text-slate-600">
                  You can try again or contact your card issuer.
                </p>
              </div>
            )}

            {status === 'cancelled' && (
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <h4 className="text-slate-900 font-semibold mb-2">Payment Cancelled</h4>
                <p className="text-slate-700">You cancelled the payment process.</p>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-red-800 font-semibold mb-2">Payment Error</h4>
                <p className="text-red-700">{response || 'An unexpected error occurred.'}</p>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            disabled={!isContinueButtonEnabled}
            onClick={() => {
              void handleProcessPayment();
            }}
            className="w-full bg-sky-800 hover:bg-sky-700 disabled:bg-sky-600 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:cursor-not-allowed"
            title={!convergeLoaded ? 'Loading payment SDK…' : undefined}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Continue to Secure Payment${amount ? ` ($${amount})` : ''}`
            )}
          </button>
        </div>
      </div>
      <div className="text-center text-sm text-slate-500 mt-6">
        <p>🔒 Your payment information is encrypted and secure</p>
      </div>
    </>
  );
}

// Wrapper component that handles CSRF token fetching
interface PaymentFormWrapperProps {
  invoiceNumber?: string;
  amount?: string;
  email?: string;
}

export default function PaymentForm({ invoiceNumber, amount, email }: PaymentFormWrapperProps) {
  const csrf = useCsrf();

  // Show loading placeholder until CSRF token is available
  if (!csrf) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Skeleton loader for payment form */}
          <div className="space-y-3">
            <div className="h-4 bg-sky-200 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-sky-100 rounded animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-sky-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-sky-100 rounded animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-sky-200 rounded w-16 animate-pulse"></div>
            <div className="h-10 bg-sky-100 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-12 bg-sky-200 rounded animate-pulse"></div>
        <div className="text-center text-sm text-slate-500">
          <p>Loading payment form...</p>
        </div>
      </div>
    );
  }

  // Render the actual form once CSRF is available
  return (
    <PaymentFormContent invoiceNumber={invoiceNumber} amount={amount} email={email} csrf={csrf} />
  );
}
