"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import { appLinkUrl, STORE_BADGES_ID, storeUrlFor, WEB_APP_URL } from "./links";

const subscribe = () => () => {};

function deviceStoreUrl() {
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform;
  return storeUrlFor(navigator.userAgent, platform, navigator.maxTouchPoints);
}

/**
 * What a link into the web app does on a computer while the web app is closed (WEB_APP_OPEN):
 * "soon" greys it out with «In arrivo», "stores" leads to the store badges of the page, "demo" leaves a button that only plays the demo.
 */
type WhenClosed = "soon" | "stores" | "demo";

/**
 * A link into Pluggers: the store on phones and tablets that have one (see links.ts), the web app otherwise.
 * The server renders the computer's version and the store replaces it after hydration.
 * The web app opens in a new tab, so the site stays open behind it.
 * With `store={false}` it always stays on `href`: on iPhone and iPad the universal link opens the app if it is installed.
 * While the web app is closed phones get their store, and computers what `whenClosed` says.
 */
export function AppLink({
  href = WEB_APP_URL,
  store = true,
  whenClosed = "soon",
  children,
  className = "",
  ...props
}: ComponentProps<"a"> & { store?: boolean; whenClosed?: WhenClosed }) {
  const url = useSyncExternalStore(subscribe, () => appLinkUrl(href, deviceStoreUrl(), store), () => appLinkUrl(href, null, store));
  if (!url && whenClosed === "stores") {
    return (
      <a {...props} className={className} href={`#${STORE_BADGES_ID}`}>
        {children}
      </a>
    );
  }
  if (!url && whenClosed === "demo") {
    return (
      <a {...props} className={className}>
        {children}
      </a>
    );
  }
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
