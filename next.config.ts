import type { NextConfig } from "next";

// ── Supabase project URL (used in connect-src) ────────────────────────────────
const SUPABASE_HOST = "zfmcltiraiyxryjfahgw.supabase.co";

/**
 * Content Security Policy
 *
 * script-src rationale:
 *  - 'self'              → Next.js JS bundles served from origin
 *  - 'unsafe-inline'     → required for Next.js inline hydration chunks and
 *                          next-plausible's inline script tag. Nonce-based CSP
 *                          would be stricter but requires Edge Middleware.
 *  - plausible.io        → Plausible Analytics script (cookie-free, GDPR by default)
 *
 * connect-src rationale:
 *  - plausible.io        → Plausible measurement endpoint
 *  - *.supabase.co       → Supabase REST, Auth, Realtime (https + wss)
 *
 * style-src 'unsafe-inline': required by Tailwind CSS v4 and framer-motion.
 * font-src data:             Next.js inlines small fonts as data URIs at build time.
 * img-src blob:              Next.js <Image> uses blob: for local previews.
 * frame-src 'none'           We have no iframes; blocks clickjacking vectors.
 * object-src 'none'          Blocks Flash / legacy plugin execution.
 * base-uri 'self'            Prevents <base href="…"> injection attacks.
 * form-action 'self'         Restricts where forms may POST.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  [
    "connect-src 'self'",
    "https://plausible.io",
    `https://${SUPABASE_HOST}`,
    `wss://${SUPABASE_HOST}`,
  ].join(" "),
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  // Content Security Policy — restricts script/style/connect origins
  { key: "Content-Security-Policy",   value: csp },
  // Prevent embedding in iframes (clickjacking)
  { key: "X-Frame-Options",          value: "SAMEORIGIN" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options",   value: "nosniff" },
  // Enforce HTTPS for 2 years
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Don't send full URL as Referer to third parties
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  // Disable camera/mic/geolocation access
  { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
  // Basic XSS protection (legacy browsers)
  { key: "X-XSS-Protection",         value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  devIndicators: false,

  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // API routes: also prevent caching of sensitive responses
        source: "/api/(.*)",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
