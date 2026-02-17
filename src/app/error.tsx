'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[ErrorBoundary]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Something went wrong</h2>
        <p className="text-slate-600 mb-6">
          An unexpected error occurred. Please try again or contact us if the problem persists.
        </p>
        <button
          onClick={reset}
          className="inline-block bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
