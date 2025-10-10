'use client';

// Helper: Check if running in client/browser
const isClient = () => typeof window !== 'undefined';

import { useState, useCallback } from 'react';
import type { CreateSessionResponse } from '@/types/elavon';

interface PaymentFormProps {
  invoiceNumber?: string;
  amount?: string;
}

export default function PaymentForm({ invoiceNumber, amount: initialAmount }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [amount, setAmount] = useState(initialAmount || '');
  const [manualInvoiceNumber, setManualInvoiceNumber] = useState('');

  // Function to redirect to Converge hosted payment page, adaptive for mobile/desktop
  const redirectToConvergeHostedPage = (token: string) => {
    // User agent detection for mobile browsers (esp. iOS/Safari)
    const isMobile =
      typeof window !== 'undefined' &&
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // iOS Safari detection (for extra reliability)
    const isIOS =
      typeof window !== 'undefined' &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !('MSStream' in window);
    // Use _self for mobile/iOS, _blank for desktop
    const target = isMobile || isIOS ? '_self' : '_blank';

    // Create a form to POST to Converge hosted payment page
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://api.convergepay.com/hosted-payments/';
    form.encType = 'application/x-www-form-urlencoded';
    form.target = target;

    // Add the token as a hidden input
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'ssl_txn_auth_token';
    tokenInput.value = token;
    form.appendChild(tokenInput);

    // Add form to body, submit it, then remove it
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Basic validation
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Please enter a valid payment amount');
      }

      // Determine the final invoice number to use
      const finalInvoiceNumber = invoiceNumber || manualInvoiceNumber || undefined;

      // Call our API to create payment session
      const response = await fetch('/api/elavon/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          invoiceNumber: finalInvoiceNumber,
        }),
      });

      const data: CreateSessionResponse = await response.json();

      if (!data.success || !data.token) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      // Successfully received token from backend
      console.log(
        'Payment session created successfully, token received:',
        data.token.substring(0, 20) + '...'
      );

      // Clear any previous errors and redirect to Converge hosted payment page
      setError('');

      // Redirect to Converge hosted payment page
      redirectToConvergeHostedPage(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Payment Amount *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              id="amount"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* Invoice Number */}
        <div>
          <label
            htmlFor="invoiceNumberField"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Invoice Number {!invoiceNumber && '(optional)'}
          </label>
          {invoiceNumber ? (
            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              #{invoiceNumber}
            </div>
          ) : (
            <input
              type="text"
              id="invoiceNumberField"
              value={manualInvoiceNumber}
              onChange={(e) => setManualInvoiceNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="INV-2024-001"
            />
          )}
        </div>
      </div>

      {/* Invoice Number Display */}
      {(invoiceNumber || manualInvoiceNumber) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Invoice Number:</p>
          <p className="font-semibold text-gray-900">#{invoiceNumber || manualInvoiceNumber}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
        >
          {isLoading ? (
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

      <div className="text-center text-sm text-gray-500">
        <p>🔒 Your payment information is encrypted and secure</p>
      </div>
    </form>
  );
}
