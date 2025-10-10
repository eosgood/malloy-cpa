'use client';

// Declare the global PayWithConverge object for TypeScript
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
    jQuery?: any;
  }
}

import { useState, useRef } from "react";

// Dynamically load the Elavon lightbox script
function useConvergeScript() {
  const loaded = useRef(false);
  if (typeof window !== "undefined" && !loaded.current) {
    // Load jQuery if not present
    if (!window.jQuery && !document.getElementById("jquery-cdn")) {
      const jqueryScript = document.createElement("script");
      jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
      jqueryScript.id = "jquery-cdn";
      jqueryScript.async = true;
      document.body.appendChild(jqueryScript);
      jqueryScript.onload = () => {
        // Now load PayWithConverge.js
        if (!document.getElementById("converge-lightbox-js")) {
          const script = document.createElement("script");
          script.src = "https://api.convergepay.com/hosted-payments/PayWithConverge.js";
          script.id = "converge-lightbox-js";
          script.async = true;
          document.body.appendChild(script);
          loaded.current = true;
        }
      };
      return;
    }
    // If jQuery is already present, just load PayWithConverge.js
    if (!document.getElementById("converge-lightbox-js")) {
      const script = document.createElement("script");
      script.src = "https://api.convergepay.com/hosted-payments/PayWithConverge.js";
      script.id = "converge-lightbox-js";
      script.async = true;
      document.body.appendChild(script);
      loaded.current = true;
    }
  }
}


interface PaymentFormLightboxProps {
  amount?: string;
  invoiceNumber?: string;
}

export default function PaymentFormLightbox({ amount: initialAmount, invoiceNumber }: PaymentFormLightboxProps) {
  useConvergeScript();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [amount, setAmount] = useState(initialAmount || "");
  const [manualInvoiceNumber, setManualInvoiceNumber] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetToken = async (e: React.FormEvent) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Lightbox] handleGetToken called", { amount, invoiceNumber, manualInvoiceNumber });
    }
    e.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");
    setResponse("");
    try {
      // Validate amount
      if (!amount || isNaN(Number(amount)) || parseFloat(amount) <= 0) {
        setError("Please enter a valid payment amount greater than zero.");
        setLoading(false);
        return;
      }
      if (amount.length > 10) {
        setError("Amount is too large.");
        setLoading(false);
        return;
      }

      const finalInvoiceNumber = invoiceNumber || manualInvoiceNumber || undefined;
      if (process.env.NODE_ENV !== "production") {
        console.log("[Lightbox] Requesting token with payload", {
          amount: parseFloat(amount),
          invoiceNumber: finalInvoiceNumber,
        });
      }
      const res = await fetch("/api/elavon/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          invoiceNumber: finalInvoiceNumber,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (process.env.NODE_ENV !== "production") {
          console.error("[Lightbox] API error response", errorText);
        }
        console.error("API error:", errorText);
        throw new Error("Payment system error. Please try again.");
      }

      const data = await res.json();
      if (process.env.NODE_ENV !== "production") {
        console.log("[Lightbox] API response", data);
      }

      if (!data.success || !data.token) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[Lightbox] API response error", data);
        }
        console.error("API response error:", data);
        throw new Error(data.error || "No token returned");
      }

      setToken(data.token);
      if (process.env.NODE_ENV !== "production") {
        console.log("[Lightbox] Token received", data.token);
      }
      setStatus("Token received");
      setError("");
  } catch (err: unknown) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[Lightbox] Payment error", err);
      }
      console.error("Payment error:", err);
  setError(err instanceof Error ? err.message : "Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLightbox = () => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Lightbox] handleOpenLightbox called", { token });
    }
    setStatus("");
    setResponse("");
    setError("");
    if (!token) {
      setError("No transaction token. Please get a token first.");
      return;
    }
    if (typeof window.PayWithConverge === "undefined") {
      setError("Elavon Lightbox script not loaded.");
      return;
    }
    if (process.env.NODE_ENV !== "production") {
      console.log("[Lightbox] Opening PayWithConverge lightbox");
    }
    window.PayWithConverge.open(
      { ssl_txn_auth_token: encodeURIComponent(token) },
      {
        onError: (err: unknown) => {
          if (process.env.NODE_ENV !== "production") {
            console.error("[Lightbox] Lightbox onError", err);
          }
          setStatus("error");
          setResponse(typeof err === "string" ? err : JSON.stringify(err));
        },
        onCancelled: () => {
          if (process.env.NODE_ENV !== "production") {
            console.log("[Lightbox] Lightbox onCancelled");
          }
          setStatus("cancelled");
          setResponse("");
        },
  onDeclined: (resp: Record<string, unknown>) => {
          if (process.env.NODE_ENV !== "production") {
            console.log("[Lightbox] Lightbox onDeclined", resp);
          }
          setStatus("declined");
          setResponse(JSON.stringify(resp, null, 2));
        },
  onApproval: (resp: Record<string, unknown>) => {
          if (process.env.NODE_ENV !== "production") {
            console.log("[Lightbox] Lightbox onApproval", resp);
          }
          setStatus("approval");
          setResponse(JSON.stringify(resp, null, 2));
        },
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Pay with Lightbox</h2>
      <form onSubmit={handleGetToken} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border rounded px-3 py-2" required disabled={!!initialAmount} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number {invoiceNumber ? '' : '(optional)'}</label>
          {invoiceNumber ? (
            <input type="text" value={invoiceNumber} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
          ) : (
            <input type="text" value={manualInvoiceNumber} onChange={e => setManualInvoiceNumber(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="INV-2024-001" />
          )}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400" disabled={loading}>
          {loading ? "Requesting Token..." : "Get Payment Token"}
        </button>
      </form>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Token</label>
        <input type="text" value={token} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" />
      </div>
      <button onClick={handleOpenLightbox} className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-green-400" disabled={!token}>
        Proceed to Payment
      </button>
      <div className="mt-6">
        <div className="text-sm text-gray-700">Transaction Status: <span className="font-semibold">{status}</span></div>
        <div className="text-xs text-gray-600 whitespace-pre-wrap mt-2">{response}</div>
        {error && <div className="mt-2 text-red-600">{error}</div>}
      </div>
    </div>
  );
}
