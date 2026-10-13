"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { appDestination } from "@/components/landing/links";
import { META_PIXEL_ID, metaEvent } from "@/lib/analytics";
import { useConsent } from "@/lib/consent";
import { isInvitePath } from "@/lib/invite";

/**
 * Meta pixel, loaded only with the marketing consent of the cookie banner.
 * Events: PageView on every route, Lead from the sign-up form, OpenApp on the links into Pluggers.
 */
export function MetaPixel() {
  const { choice } = useConsent();
  const pathname = usePathname();
  // Invite pages carry the inviter's code and an estimate token in the URL, and every pixel event sends the URL to Meta:
  // the pixel stays off there, and their CSP (next.config.ts) doesn't let the page reach Meta at all.
  const on = Boolean(META_PIXEL_ID) && choice?.marketing === true && !isInvitePath(pathname);

  useEffect(() => {
    if (!on) return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      const destination = link && appDestination(link.href);
      if (destination) metaEvent("trackCustom", "OpenApp", { destination });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [on]);

  if (!on) return null;
  // Meta's base code. After the first PageView the pixel counts App Router route changes by itself, following
  // history.pushState (a second manual PageView would be dropped). autoConfig off: no button texts or page metadata.
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('set','autoConfig',false,'${META_PIXEL_ID}');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
