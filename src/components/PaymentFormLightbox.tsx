'use client';

import Script from 'next/script';
import { useCallback, useState, type FormEvent } from 'react';
import { getConvergeApiBaseUrl } from '@/config/converge';

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

interface PaymentFormLightboxProps {
  amount?: string;
  invoiceNumber?: string;
}

type CreateSessionResponse = { success: true; token: string } | { success: false; error?: string };

export default function PaymentFormLightbox({
  amount: initialAmount,
  invoiceNumber,
}: PaymentFormLightboxProps) {
  const [jqLoaded, setJqLoaded] = useState(false);
  const [convergeLoaded, setConvergeLoaded] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [amount, setAmount] = useState(initialAmount ?? '');
  const [manualInvoiceNumber, setManualInvoiceNumber] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetToken = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setStatus('');

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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: numericAmount,
            invoiceNumber: finalInvoiceNumber,
            // firstName, lastName, // include if your API wants these
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || 'Payment system error. Please try again.');
        }

        const data: CreateSessionResponse = await res.json();
        if (!('success' in data) || !data.success || !('token' in data) || !data.token) {
          throw new Error((data as { error?: string }).error || 'No token returned');
        }

        setToken(data.token);
        setStatus('Token received');
        setError('');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Payment initialization failed');
      } finally {
        setLoading(false);
      }
    },
    [amount, invoiceNumber, manualInvoiceNumber]
  );

  const handleOpenLightbox = useCallback(() => {
    setStatus('');
    setResponse('');
    setError('');

    if (!token) {
      setError('No transaction token. Please get a token first.');
      return;
    }
    if (!window.PayWithConverge) {
      setError('Elavon Lightbox script not loaded.');
      return;
    }

    window.PayWithConverge.open(
      // Use raw token unless Converge docs say to encode.
      { ssl_txn_auth_token: token },
      {
        onError: (err: unknown) => {
          setStatus('error');
          setResponse(typeof err === 'string' ? err : JSON.stringify(err));
        },
        onCancelled: () => {
          setStatus('cancelled');
          setResponse('');
        },
        onDeclined: (resp: Record<string, unknown>) => {
          setStatus('declined');
          setResponse(JSON.stringify(resp, null, 2));
        },
        onApproval: (resp: Record<string, unknown>) => {
          setStatus('approval');
          setResponse(JSON.stringify(resp, null, 2));
        },
      }
    );
  }, [token]);

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

      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Pay with Lightbox</h2>

        <form onSubmit={handleGetToken} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              disabled={!!initialAmount}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number {invoiceNumber ? '' : '(optional)'}
            </label>
            {invoiceNumber ? (
              <input
                type="text"
                value={invoiceNumber}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100"
              />
            ) : (
              <input
                type="text"
                value={manualInvoiceNumber}
                onChange={(e) => setManualInvoiceNumber(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="INV-2024-001"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? 'Requesting Token...' : 'Get Payment Token'}
          </button>
        </form>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Token</label>
          <input
            type="text"
            value={token}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <button
          onClick={handleOpenLightbox}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-green-400"
          disabled={!token || !convergeLoaded}
          title={!convergeLoaded ? 'Loading payment SDK…' : undefined}
        >
          Proceed to Payment
        </button>

        <div className="mt-6">
          <div className="text-sm text-gray-700">
            Transaction Status: <span className="font-semibold">{status}</span>
          </div>
          <div className="text-xs text-gray-600 whitespace-pre-wrap mt-2">{response}</div>
          {error && <div className="mt-2 text-red-600">{error}</div>}
        </div>
      </div>
    </>
  );
}
