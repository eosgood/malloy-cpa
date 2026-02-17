'use client';

/**
 * Catches errors thrown in the root layout itself.
 * Must render its own <html>/<body> because the root layout is unavailable.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('[GlobalError]', error);

  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <div className="min-h-screen flex items-center justify-center px-6 bg-white">
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
      </body>
    </html>
  );
}
