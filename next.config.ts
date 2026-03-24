import type { NextConfig } from "next";

const securityHeaders = [
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
