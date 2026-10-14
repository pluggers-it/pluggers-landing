"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import { appLinkUrl, storeUrlFor, WEB_APP_URL } from "./links";

const subscribe = () => () => {};

function deviceStoreUrl() {
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform;
  return storeUrlFor(navigator.userAgent, platform, navigator.maxTouchPoints);
}

/**
 * A link into Pluggers: the store on phones and tablets that have one (see links.ts), the web app otherwise.
 * The server renders the web address and the store one replaces it after hydration.
 * The web app opens in a new tab, so the site stays open behind it.
 * With `store={false}` it always stays on `href`: on iPhone and iPad the universal link opens the app if it is installed.
 * While the web app is closed (WEB_APP_OPEN) it leads to the store on phones, and on computers it is greyed out with «In arrivo».
 */
export function AppLink({ href = WEB_APP_URL, store = true, children, className = "", ...props }: ComponentProps<"a"> & { store?: boolean }) {
  const url = useSyncExternalStore(subscribe, () => appLinkUrl(href, deviceStoreUrl(), store), () => appLinkUrl(href, null, store));
  if (!url) {
    return (
      <a {...props} role="link" aria-disabled="true" className={`${className} pointer-events-none select-none opacity-60 grayscale`}>
        {children}
        <span className="font-medium">
          <span aria-hidden>· </span>In arrivo
        </span>
      </a>
    );
  }
  const web = url === href;
  return (
    <a {...props} className={className} href={url} target={web ? "_blank" : undefined} rel={web ? "noopener noreferrer" : undefined}>
      {children}
      {web && <span className="sr-only"> (si apre in una nuova scheda)</span>}
    </a>
  );
}
