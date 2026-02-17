// src/hooks/useCsrf.ts
//
// Singleton CSRF token fetcher. No matter how many components call useCsrf(),
// only ONE network request is in-flight at a time. Includes retry with
// exponential backoff (3 attempts).
//
import { useEffect, useState } from 'react';
import { z } from 'zod';

const CsrfResponse = z.object({ nonce: z.string() });

// ── Module-level singleton state ──────────────────────────────────
let cachedNonce: string | null = null;
let inflight: Promise<string | null> | null = null;
const subscribers = new Set<(nonce: string | null) => void>();

function notify(nonce: string | null) {
  cachedNonce = nonce;
  for (const cb of subscribers) cb(nonce);
}

async function fetchWithRetry(signal?: AbortSignal): Promise<string | null> {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const r = await fetch('/api/csrf', {
        credentials: 'include',
        cache: 'no-store',
        signal,
      });

      if (r.status === 429) {
        const retryAfter = parseInt(r.headers.get('Retry-After') ?? '2', 10);
        await new Promise((res) => setTimeout(res, retryAfter * 1000));
        continue;
      }

      if (!r.ok) {
        console.error('[useCsrf] Fetch failed', { status: r.status, attempt });
        if (attempt < MAX_RETRIES) {
          await new Promise((res) => setTimeout(res, 1000 * attempt));
          continue;
        }
        return null;
      }

      const raw: unknown = await r.json();
      const parsed = CsrfResponse.safeParse(raw);
      if (!parsed.success) {
        console.error('[useCsrf] Invalid response format');
        return null;
      }

      return parsed.data.nonce;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return null;
      console.error('[useCsrf] Fetch error', {
        attempt,
        error: err instanceof Error ? err.message : String(err),
      });
      if (attempt < MAX_RETRIES) {
        await new Promise((res) => setTimeout(res, 1000 * attempt));
      }
    }
  }

  return null;
}

function ensureToken(signal?: AbortSignal): Promise<string | null> {
  if (cachedNonce) return Promise.resolve(cachedNonce);
  if (inflight) return inflight;

  inflight = fetchWithRetry(signal).then((nonce) => {
    inflight = null;
    notify(nonce);
    return nonce;
  });

  return inflight;
}

/**
 * Call from any component that needs the CSRF nonce for `x-csrf` headers.
 * Returns `null` until the token is available. Only one network request
 * is made regardless of how many components call this hook.
 */
export function useCsrf(): string | null {
  const [nonce, setNonce] = useState<string | null>(cachedNonce);

  useEffect(() => {
    subscribers.add(setNonce);

    if (cachedNonce && !nonce) {
      setNonce(cachedNonce);
    }

    const ac = new AbortController();
    void ensureToken(ac.signal);

    return () => {
      subscribers.delete(setNonce);
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- singleton: runs once on mount, nonce updates via subscriber
  }, []);

  return nonce;
}

/**
 * Force-refresh the CSRF token (e.g. after a POST).
 * Returns the new nonce, or null on failure.
 */
export async function refreshCsrf(): Promise<string | null> {
  cachedNonce = null;
  inflight = null;
  const nonce = await fetchWithRetry();
  notify(nonce);
  return nonce;
}
