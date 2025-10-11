// src/hooks/useCsrf.ts
import { useEffect, useState } from 'react';
import { z } from 'zod';

export function useCsrf() {
  const [nonce, setNonce] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    void (async () => {
      try {
        const r = await fetch('/api/csrf', {
          credentials: 'include',
          cache: 'no-store',
          signal: ac.signal,
        });
        if (!r.ok) return;
        const CsrfResponse = z.object({ nonce: z.string() });
        const raw: unknown = await r.json();
        const { nonce } = CsrfResponse.parse(raw);
        setNonce(nonce);
      } catch {}
    })();
    return () => ac.abort();
  }, []);
  return nonce;
}
