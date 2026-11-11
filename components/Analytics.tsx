"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { GA_MEASUREMENT_ID, startGtag } from "@/lib/analytics";
import { useConsent } from "@/lib/consent";
import { GRAZIE_PATH, takeConversion } from "@/lib/grazie";
import { GOOGLE_ADS_CONVERSION_LABEL, GOOGLE_ADS_ID, adsOn, consentState, conversionTarget } from "@/lib/googleAds";
import { analyticsPage, isInvitePath } from "@/lib/invite";

/**
 * The Google tag: Google Analytics 4 with the statistics consent of the cookie banner, Google Ads with the marketing
 * one (and only if NEXT_PUBLIC_GOOGLE_ADS_ID is set). One gtag.js serves both. gtag takes the address and referrer
 * of Analytics from analyticsPage(), so on an invite page Google never gets the code or the estimate token; there
 * Google Ads stays off and next.config.ts also blocks gtag's diagnostics, which read the address on their own.
 * The Ads conversion goes out once, when /grazie opens after the sign-up form.
 */
export function Analytics() {
  const { choice } = useConsent();
  const pathname = usePathname();
  const analytics = Boolean(GA_MEASUREMENT_ID) && choice?.analytics === true;
  const ads = adsOn(GOOGLE_ADS_ID, choice, isInvitePath(pathname));
  const configured = useRef({ analytics: false, ads: false });

  useEffect(() => {
    if (!analytics && !ads) return;
    const gtag = startGtag(consentState(analytics, ads));
    if (analytics && !configured.current.analytics) {
      configured.current.analytics = true;
      gtag("config", GA_MEASUREMENT_ID, analyticsPage(location.href, document.referrer));
    }
    if (ads && !configured.current.ads) {
      configured.current.ads = true;
      gtag("config", GOOGLE_ADS_ID);
    }
  }, [analytics, ads]);

  // After the effect above, so the Ads destination is configured before its conversion. With the marketing consent
  // given on /grazie itself, it goes out then.
  useEffect(() => {
    const target = conversionTarget(GOOGLE_ADS_ID, GOOGLE_ADS_CONVERSION_LABEL);
    if (ads && target && pathname === GRAZIE_PATH && takeConversion()) {
      window.gtag?.("event", "conversion", { send_to: target });
    }
  }, [ads, pathname]);

  const tag = analytics ? GA_MEASUREMENT_ID : ads ? GOOGLE_ADS_ID : "";
  return tag ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${tag}`} strategy="afterInteractive" /> : null;
}
