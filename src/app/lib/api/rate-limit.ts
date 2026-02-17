/**
 * Simple in-memory sliding-window rate limiter.
 *
 * On Vercel serverless each instance has its own Map, so limits are
 * per-isolate rather than global — still effective against single-origin
 * abuse and script-kiddie attacks. For stricter global limits, swap in
 * Upstash Redis or Vercel KV.
 */

type RateLimitEntry = {
  tokens: number;
  lastRefill: number;
};

type RateLimitConfig = {
  /** Max requests allowed in the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
};

const buckets = new Map<string, RateLimitEntry>();

// Periodic cleanup to prevent memory leaks (every 60 s)
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, entry] of buckets) {
    if (now - entry.lastRefill > windowMs * 2) {
      buckets.delete(key);
    }
  }
}

/**
 * Check whether a request is within the rate limit.
 *
 * @param key   Unique identifier (e.g. "ip:route")
 * @param config  Rate limit configuration
 * @returns `{ allowed, remaining, retryAfterSeconds }` — if `allowed` is
 *          false the caller should return 429.
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  cleanup(windowMs);

  let entry = buckets.get(key);

  if (!entry) {
    entry = { tokens: config.limit - 1, lastRefill: now };
    buckets.set(key, entry);
    return { allowed: true, remaining: entry.tokens, retryAfterSeconds: 0 };
  }

  // Refill tokens based on elapsed time
  const elapsed = now - entry.lastRefill;
  const refill = Math.floor((elapsed / windowMs) * config.limit);

  if (refill > 0) {
    entry.tokens = Math.min(config.limit, entry.tokens + refill);
    entry.lastRefill = now;
  }

  if (entry.tokens > 0) {
    entry.tokens -= 1;
    return { allowed: true, remaining: entry.tokens, retryAfterSeconds: 0 };
  }

  // Denied — calculate retry-after
  const retryAfterSeconds = Math.ceil((windowMs - elapsed) / 1000);
  return { allowed: false, remaining: 0, retryAfterSeconds };
}
