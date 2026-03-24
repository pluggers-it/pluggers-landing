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
    check();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}

// ── Main component ────────────────────────────────────────────────────────────
/**
 * Google Analytics 4 with Consent Mode v2 (EEA / GDPR compliant).
 *
 * Architecture:
 *  1. layout.tsx sets gtag consent defaults to "denied" via an inline <script>
 *     that executes synchronously before gtag.js loads.
 *  2. This component always loads gtag.js (required for Consent Mode v2 to work).
 *  3. A useEffect watches analyticsConsent and calls gtag('consent','update',…)
 *     whenever the user makes or changes a choice — no cookies are ever set
 *     until analyticsConsent === "granted".
 *  4. Clarity and the scroll tracker are gated strictly on "granted".
 *
 * GDPR guarantee: analytics_storage remains "denied" (no cookies, no
 * identifiable data) unless the user explicitly clicks "Accetta".
 */
export function Analytics() {
  const { analyticsConsent } = useConsent();

  // Propagate consent changes to Google Consent Mode v2
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;
    if (analyticsConsent === null) return; // still reading localStorage — keep default "denied"

    window.gtag("consent", "update", {
      analytics_storage:  analyticsConsent,  // "granted" | "denied"
      ad_storage:         "denied",          // we don't run ads — always denied
      ad_user_data:       "denied",
      ad_personalization: "denied",
    });
  }, [analyticsConsent]);

  return (
    <>
      {/* Scroll depth tracker — active only after explicit consent */}
      {analyticsConsent === "granted" && <ScrollDepthTracker />}

      {/* ── Google Analytics 4 ──────────────────────────────────────────────────
       *  Loaded unconditionally so Consent Mode v2 signals reach Google.
       *  No cookies are placed while analytics_storage === "denied".
       */}
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
              send_page_view:  true,
              cookie_flags:    'SameSite=None;Secure'
            });
          `}</Script>
        </>
      )}

      {/* ── Microsoft Clarity — strictly gated on consent ── */}
      {CLARITY_ID && analyticsConsent === "granted" && (
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
