"use client";

import { useSyncExternalStore } from "react";
import { deviceKind } from "@/components/landing/links";
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
 */
export function InviteButton({ href, code }: { href: string; code: string | null }) {
  const kind = useSyncExternalStore(subscribe, device, () => "computer" as const);
  const computer = kind === "computer";
  const copyFirst = kind === "ios" && code !== null;

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <a
        href={href}
        target={computer ? "_blank" : undefined}
        rel={computer ? "noopener noreferrer" : undefined}
        // Not awaited: the link has to leave with this same tap, or iOS doesn't open the app.
        onClick={copyFirst ? () => void navigator.clipboard?.writeText(code).catch(() => {}) : undefined}
        className={`${BTN_PRIMARY} w-full sm:w-auto`}
      >
        {copyFirst ? "Copia il codice e scarica" : "Apri Pluggers"}
        {computer && <span className="sr-only"> (si apre in una nuova scheda)</span>}
      </a>
    </div>
  );
}
