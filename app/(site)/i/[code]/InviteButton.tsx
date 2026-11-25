"use client";

import { useSyncExternalStore } from "react";
import { appLinkUrl, deviceKind, STORE_BADGES_ID } from "@/components/landing/links";
import { StoreBadges } from "@/components/landing/StoreBadges";
import { BTN_PRIMARY } from "@/components/landing/styles";

const subscribe = () => () => {};

function device() {
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform;
  return deviceKind(navigator.userAgent, platform, navigator.maxTouchPoints);
}

/**
 * The invite's way in. The address is the same everywhere: on a phone it opens the app if installed, the store
 * otherwise; on a computer the web app's sign-up. Phones stay in this tab, so the system can hand the link to the app.
 * The iOS store can't pass the code on: on iPhone and iPad the tap copies it first, and the app's sign-up pastes it.
 * While the web app is closed (WEB_APP_OPEN) a computer gets the store badges instead, as AppLink whenClosed="stores".
 */
export function InviteButton({ href, code }: { href: string; code: string | null }) {
  // null on the server, which renders the computer's button: the badges show only once the device is known, so phones never see them.
  const kind = useSyncExternalStore(subscribe, device, () => null);
  const phone = kind === "ios" || kind === "android";
  const copyFirst = kind === "ios" && code !== null;
  const url = phone ? href : appLinkUrl(href, null);

  if (!url) {
    return (
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a href={`#${STORE_BADGES_ID}`} className={`${BTN_PRIMARY} w-full sm:w-auto`}>
          Apri Pluggers
        </a>
        {kind === "computer" && <StoreBadges />}
      </div>
    );
  }
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <a
        href={url}
        target={phone ? undefined : "_blank"}
        rel={phone ? undefined : "noopener noreferrer"}
        // Not awaited: the link has to leave with this same tap, or iOS doesn't open the app.
        onClick={copyFirst ? () => void navigator.clipboard?.writeText(code).catch(() => {}) : undefined}
        className={`${BTN_PRIMARY} w-full sm:w-auto`}
      >
        {copyFirst ? "Copia il codice e scarica" : "Apri Pluggers"}
        {!phone && <span className="sr-only"> (si apre in una nuova scheda)</span>}
      </a>
    </div>
  );
}
