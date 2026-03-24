"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "@/lib/consent";
import { trackScrollDepth } from "@/lib/analytics";

const GA_ID      = process.env.NEXT_PUBLIC_GA_ID      ?? "";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "";

// ── Scroll depth tracker ──────────────────────────────────────────────────────
function ScrollDepthTracker() {
  useEffect(() => {
    const thresholds: Array<25 | 50 | 90> = [25, 50, 90];
    const fired = new Set<number>();
    let ticking = false;

    function check() {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const scrollable = scrollHeight - clientHeight;
      if (scrollable <= 0) return;

      const pct = Math.round((scrollTop / scrollable) * 100);

      for (const t of thresholds) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackScrollDepth(t);
        }
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        check();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    // Also check on mount in case the page is already scrolled (e.g. after accept)
    check();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}

// ── Main component ────────────────────────────────────────────────────────────
/**
 * Conditionally loads GA4 and Clarity scripts only after explicit user consent.
 * Rendered in the root layout — outputs nothing until consent === "granted".
 */
export function Analytics() {
  const { analyticsConsent } = useConsent();

  if (analyticsConsent !== "granted") return null;

  return (
    <>
      {/* ── Scroll depth tracker ── */}
      <ScrollDepthTracker />

      {/* ── Google Analytics 4 ── */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              send_page_view: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `}</Script>
        </>
      )}

      {/* ── Microsoft Clarity ── */}
      {CLARITY_ID && (
        <Script id="clarity-init" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `}</Script>
      )}
    </>
  );
}
