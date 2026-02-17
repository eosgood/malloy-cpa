// src/lib/api/protect-lite.ts
//
// CSRF Protection Configuration:
// - By default, CSRF is ENABLED for all POST/PUT/PATCH/DELETE requests
// - To disable CSRF globally, set environment variable: CSRF_ENABLED=false
// - To disable CSRF for a specific route, pass { csrf: false } to withProtection()
//
// Example usage:
//   export const POST = withProtection(handler); // CSRF enabled
//   export const POST = withProtection(handler, { csrf: false }); // CSRF disabled for this route
//
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { headers, cookies } from 'next/headers';
import crypto from 'node:crypto';
import { rateLimit } from './rate-limit';

export type ProtectOptions = {
  // If you also keep your own session cookie, enforce it here
  requireSessionCookie?: { name: string; mustMatch?: (value: string) => boolean };
  sameOrigin?: boolean; // default true for non-GET
  csrf?: boolean; // default true for non-GET
  allowGetWithoutOrigin?: boolean; // default true
  /** Rate limit config. Set to false to disable. Default: 20 req / 60 s per IP. */
  rateLimit?: { limit: number; windowSeconds: number } | false;
};

function isSameOriginRequired(method: string, opts: ProtectOptions) {
  if (opts.sameOrigin === false) return false;
  if (method === 'GET') return !(opts.allowGetWithoutOrigin ?? true);
  return true; // enforce for non-GET
}

async function checkSameOrigin(): Promise<boolean> {
  const h = await headers();
  const origin = h.get('origin');
  const host = h.get('host');
  // Debug: log origin/host for diagnostics (do not log secrets)
  // This helps detect proxy/origin mismatches in production
  // (temporary - remove once issue is resolved)
  console.debug('[protect] checkSameOrigin', { origin, host });
  if (!origin) return false;
  try {
    return new URL(origin).host === host;
  } catch (err) {
    console.debug('[protect] checkSameOrigin parse error', { origin, host, err: String(err) });
    return false;
  }
}

async function verifyCsrf(): Promise<boolean> {
  const c = await cookies();
  const nonce = c.get('csrf_nonce')?.value ?? '';
  const sig = c.get('csrf_sig')?.value ?? '';
  const headerNonce = (await headers()).get('x-csrf') ?? '';

  console.log('[protect] verifyCsrf - values', {
    cookieNoncePreview: nonce ? `${nonce.substring(0, 8)}...` : '[missing]',
    cookieSigPreview: sig ? `${sig.substring(0, 8)}...` : '[missing]',
    headerNoncePreview: headerNonce ? `${headerNonce.substring(0, 8)}...` : '[missing]',
    nonceMatch: headerNonce === nonce,
  });

  if (!nonce || !sig || headerNonce !== nonce) {
    console.error('[protect] verifyCsrf failed - presence', {
      hasCookieNonce: !!nonce,
      hasCookieSig: !!sig,
      headerNonceValue: headerNonce ? '[present]' : '[missing]',
      nonceMatch: headerNonce === nonce,
    });
    return false;
  }

  const secret = process.env.CSRF_SECRET;
  if (!secret) throw new Error('CSRF_SECRET not set');

  const expected = crypto.createHmac('sha256', secret).update(nonce).digest('hex');
  try {
    const isValid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
    if (!isValid) {
      console.error('[protect] CSRF signature mismatch');
    }
    return isValid;
  } catch (err) {
    console.error('[protect] CSRF timingSafeEqual failed', {
      error: err instanceof Error ? err.message : String(err),
    });
    return false;
  }
}

export type Tools = {
  ok: <T>(data: T, init?: ResponseInit) => Response;
  badRequest: (msg?: string) => Response;
  forbidden: (msg?: string) => Response;
  unauthorized: (msg?: string) => Response;
};

type RouteHandler = (
  req: Request,
  ctx: Record<string, unknown>,
  t: Tools
) => Promise<Response> | Response;

export function withProtection(handler: RouteHandler, options: ProtectOptions = {}) {
  const opts: ProtectOptions = { sameOrigin: true, csrf: true, ...options };

  return async (req: Request, ctx: Record<string, unknown>) => {
    const method = req.method.toUpperCase();
    const tools: Tools = {
      ok: (data, init) => NextResponse.json(data, init),
      badRequest: (msg = 'Bad Request') => NextResponse.json({ error: msg }, { status: 400 }),
      unauthorized: (msg = 'Unauthorized') => NextResponse.json({ error: msg }, { status: 401 }),
      forbidden: (msg = 'Forbidden') => NextResponse.json({ error: msg }, { status: 403 }),
    };

    // Rate limiting (default: 20 req / 60 s per IP per route)
    if (opts.rateLimit !== false) {
      const h = await headers();
      const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
      const route = new URL(req.url).pathname;
      const rl = rateLimit(`${ip}:${route}`, opts.rateLimit ?? { limit: 20, windowSeconds: 60 });
      if (!rl.allowed) {
        return NextResponse.json(
          { error: 'Too many requests' },
          {
            status: 429,
            headers: { 'Retry-After': String(rl.retryAfterSeconds) },
          }
        );
      }
    }

    // Optional: enforce your own session cookie
    if (opts.requireSessionCookie) {
      const { name, mustMatch } = opts.requireSessionCookie;
      const val = (await cookies()).get(name)?.value;
      if (!val || (mustMatch && !mustMatch(val))) {
        return tools.unauthorized();
      }
    }

    // Same-origin (default: enforce for non-GET)
    if (isSameOriginRequired(method, opts) && !(await checkSameOrigin())) {
      // Log request headers for debugging origin mismatch
      const h = await headers();
      const origin = h.get('origin');
      const host = h.get('host');
      console.error('[protect] same-origin failed', { method, origin, host });
      return tools.forbidden('Forbidden (origin)');
    }

    // CSRF (default: enforce for non-GET)
    // Check if CSRF is enabled via environment variable (defaults to true for security)
    const csrfEnabled = process.env.CSRF_ENABLED !== 'false';
    const needsCsrf = (opts.csrf ?? true) && method !== 'GET';

    if (csrfEnabled && needsCsrf && !(await verifyCsrf())) {
      return tools.forbidden('Forbidden (csrf)');
    }

    return handler(req, ctx, tools);
  };
}
