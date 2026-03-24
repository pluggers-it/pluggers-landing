/**
 * Simple in-memory rate limiter for Next.js API routes.
 *
 * Works per-instance (no shared state across Vercel serverless instances),
 * which is acceptable for this use case — it still blocks single-instance
 * floods and automated scripts hitting the same instance repeatedly.
 *
 * Each key (e.g. IP address) gets a sliding window of `maxRequests` within
 * `windowMs` milliseconds.
 */

interface Entry {
  count:     number;
  resetAt:   number;
}

const store = new Map<string, Entry>();

// Evict expired entries periodically to avoid memory leaks.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000);

export interface RateLimitOptions {
  /** Window size in milliseconds. Default: 60 000 (1 min) */
  windowMs?:    number;
  /** Maximum requests per window per key. Default: 20 */
  maxRequests?: number;
}

export interface RateLimitResult {
  allowed:    boolean;
  remaining:  number;
  resetAt:    number;
}

export function rateLimit(
  key: string,
  { windowMs = 60_000, maxRequests = 20 }: RateLimitOptions = {},
): RateLimitResult {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }

  entry.count++;
  const allowed   = entry.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - entry.count);

  return { allowed, remaining, resetAt: entry.resetAt };
}

/**
 * Extracts the best available client IP from request headers.
 * Falls back to "unknown" when running locally without a proxy.
 */
export function getClientIp(req: Request): string {
  const headers = req instanceof Request
    ? Object.fromEntries(req.headers.entries())
    : {};

  return (
    headers["x-forwarded-for"]?.split(",")[0]?.trim() ??
    headers["x-real-ip"] ??
    "unknown"
  );
}
