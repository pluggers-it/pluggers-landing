"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { useConsent } from "@/lib/consent";
import { isInvitePath } from "@/lib/invite";

/** Google Analytics 4, loaded only after «Accetta» on the cookie banner, and never on invite pages. */
export function Analytics() {
  const { analyticsConsent } = useConsent();
  const pathname = usePathname();
  if (!GA_MEASUREMENT_ID || analyticsConsent !== "granted" || isInvitePath(pathname)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
