"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "@/lib/consent";
import { trackScrollDepth } from "@/lib/analytics";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "";

// ── Scroll depth tracker ──────────────────────────────────────────────────────
/**
 * Fires Plausible "Scroll Depth" events at 25 / 50 / 90 % thresholds.
 * Cookie-free — no consent required.
 */
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
 * Loads Microsoft Clarity only after explicit user consent (Clarity uses cookies).
 * Also mounts the cookie-free Plausible scroll depth tracker unconditionally.
 *
 * Note: the Plausible script itself is injected by <PlausibleProvider> in layout.tsx
 * and needs no consent because it is cookie-less and GDPR compliant by default.
 */
export function Analytics() {
  const { analyticsConsent } = useConsent();

  return (
    <>
      {/* Plausible scroll depth — no consent needed (cookie-free) */}
      <ScrollDepthTracker />

      {/* Microsoft Clarity — gated on consent (uses cookies) */}
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
