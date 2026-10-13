"use client";

import { useEffect } from "react";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { useConsent } from "@/lib/consent";
import { analyticsPage } from "@/lib/invite";

/**
 * Google Analytics 4, loaded only after «Accetta» on the cookie banner. gtag takes the address and referrer from
 * analyticsPage(), so on an invite page Google never gets the code or the estimate token; there next.config.ts
 * also blocks gtag's diagnostics, which read the address on their own.
 */
export function Analytics() {
  const { analyticsConsent } = useConsent();
  const on = Boolean(GA_MEASUREMENT_ID) && analyticsConsent === "granted";

  useEffect(() => {
    if (!on) return;
    const w = window as unknown as { dataLayer?: unknown[] };
    const dataLayer = (w.dataLayer ??= []);
    // gtag.js reads its queue as `arguments` objects, not arrays
    const gtag: (...args: unknown[]) => void = function () {
      // eslint-disable-next-line prefer-rest-params
      dataLayer.push(arguments);
    };
    gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, analyticsPage(location.href, document.referrer));
  }, [on]);

  return on ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" /> : null;
}
