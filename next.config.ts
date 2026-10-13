import type { NextConfig } from "next";

// ── Supabase project URL (used in connect-src) ────────────────────────────────
const SUPABASE_HOST = "zfmcltiraiyxryjfahgw.supabase.co";

/**
 * Content Security Policy
 *
 * script-src 'unsafe-inline': required for Next.js inline hydration chunks.
 *                             Nonce-based CSP would be stricter but requires Edge Middleware.
 * style-src 'unsafe-inline':  required by Tailwind CSS v4 and framer-motion.
 * font-src data:              Next.js inlines small fonts as data URIs at build time.
 * img-src blob:               Next.js <Image> uses blob: for local previews.
 * connect-src *.supabase.co:  Supabase REST, Auth, Realtime (https + wss).
 * connect.facebook.net, www.facebook.com: Meta pixel (script, then events), loaded only with the marketing consent.
 * frame-src 'none':           No iframes — blocks clickjacking vectors.
 * object-src 'none':          Blocks Flash / legacy plugin execution.
 * base-uri 'self':            Prevents <base href="…"> injection attacks.
 * form-action 'self':         Restricts where forms may POST.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com",
  [
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com",
    `https://${SUPABASE_HOST}`,
    `wss://${SUPABASE_HOST}`,
  ].join(" "),
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/**
 * Invite pages (/i/CODE?p=TOKEN) reach Google only to load gtag.js and send Analytics hits, whose address and
 * referrer the site cleans: gtag's own diagnostics to www.googletagmanager.com read the address, code included.
 * They never reach Meta: the pixel sends the address with every event, so it stays off there.
 */
const inviteCsp = csp
  .replace(/ https:\/\/(connect|www)\.facebook\.(net|com)/g, "")
  .split("; ")
  .map((directive) => (directive.startsWith("script-src") ? directive : directive.replace(" https://www.googletagmanager.com", "")))
  .join("; ");

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
  { key: "X-XSS-Protection",         value: "0" },
];

const nextConfig: NextConfig = {
  devIndicators: false,

  // The apex must move permanently to www (308). Vercel's own domain redirect, if set to 307, runs first and wins.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "plggrs.it" }],
        destination: "https://www.plggrs.it/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Invite pages: no referrer at all, so the next page never gets their address
        source: "/i/:path*",
        headers: [
          { key: "Content-Security-Policy", value: inviteCsp },
          { key: "Referrer-Policy",         value: "no-referrer" },
        ],
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
