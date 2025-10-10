"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentCompleteContent() {
  const searchParams = useSearchParams();
  // Parse Elavon/Converge params
  const invoice = searchParams.get("ssl_invoice_number") || null;
  const amount = searchParams.get("ssl_amount") || null;
  const result = searchParams.get("ssl_result_message") || null;
  const approvalCode = searchParams.get("ssl_approval_code") || null;
  const txnId = searchParams.get("ssl_txn_id") || null;
  const cardType = searchParams.get("ssl_card_short_description") || null;
  const last4 = searchParams.get("ssl_card_number") || null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Complete</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-6">
            Thank you for your payment. Your transaction has been processed successfully.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-green-800 font-semibold mb-2">Payment Details</p>
            <div className="flex flex-col items-center gap-1 text-green-900 text-base">
              {result && <p><strong>Status:</strong> {result}</p>}
              {invoice && <p><strong>Invoice:</strong> <span className="font-mono">{invoice}</span></p>}
              {amount && <p><strong>Amount:</strong> ${amount}</p>}
              {approvalCode && <p><strong>Approval Code:</strong> {approvalCode}</p>}
              {cardType && last4 && <p><strong>Card:</strong> {cardType} ending in {last4.slice(-4)}</p>}
              {txnId && <p className="text-xs text-green-700 mt-2"><strong>Transaction ID:</strong> {txnId}</p>}
            </div>
          </div>
          <div className="text-center">
            <Link href="/" className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Return Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
