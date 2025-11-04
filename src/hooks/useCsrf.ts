// src/hooks/useCsrf.ts
import { useEffect, useState } from 'react';
import { z } from 'zod';

export function useCsrf() {
  const [nonce, setNonce] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    const hookId = Math.random().toString(36).substring(2, 10);
    const startTime = Date.now();

    console.log('[useCsrf] Fetching CSRF token', {
      hookId,
      timestamp: new Date().toISOString(),
    });

    void (async () => {
      try {
        const r = await fetch('/api/csrf', {
          credentials: 'include',
          cache: 'no-store',
          signal: ac.signal,
        });

        if (!r.ok) {
          console.error('[useCsrf] CSRF fetch failed', {
            hookId,
            status: r.status,
            statusText: r.statusText,
            durationMs: Date.now() - startTime,
          });
          return;
        }

        const CsrfResponse = z.object({ nonce: z.string() });
        const raw: unknown = await r.json();
        const parsed = await CsrfResponse.safeParseAsync(raw);

        if (!parsed.success) {
          console.error('[useCsrf] Invalid CSRF response format', {
            hookId,
            error: parsed.error.message,
            durationMs: Date.now() - startTime,
          });
          return;
        }

        const { nonce } = parsed.data;
        setNonce(nonce);

        console.log('[useCsrf] CSRF token received', {
          hookId,
          nonceLength: nonce.length,
          durationMs: Date.now() - startTime,
          success: true,
        });
      } catch (error) {
        // Ignore abort errors (component unmounted)
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('[useCsrf] Fetch aborted (component unmounted)', { hookId });
          return;
        }

        console.error('[useCsrf] CSRF fetch error', {
          hookId,
          error: error instanceof Error ? error.message : String(error),
          durationMs: Date.now() - startTime,
        });
      }
    })();

    return () => {
      console.log('[useCsrf] Cleanup - aborting fetch', { hookId });
      ac.abort();
    };
  }, []);

  return nonce;
}
