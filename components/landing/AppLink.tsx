"use client";

import { useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useInStores } from "./InStores";
import { appLinkUrl, prelaunchUrl, STORE_BADGES_ID, storeUrlFor, WEB_APP_URL } from "./links";

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
 * With `store={false}` a phone gets its store only once anyone can install from it (see `appLinkUrl`), and stays on `href` otherwise.
 * While the web app is closed phones get their store, and computers what `whenClosed` says.
 * With `computerOnly` it shows on computers only: phones and tablets with a store render nothing.
 * Until the app is in the stores every device gets the pre-registration, with the `beforeLaunch` label if given.
 */
export function AppLink({
  href = WEB_APP_URL,
  store = true,
  whenClosed = "soon",
  computerOnly = false,
  beforeLaunch,
  children,
  className = "",
  ...props
}: ComponentProps<"a"> & { store?: boolean; whenClosed?: WhenClosed; computerOnly?: boolean; beforeLaunch?: ReactNode }) {
  const storeUrl = useSyncExternalStore(subscribe, deviceStoreUrl, () => null);
  const inStores = useInStores();
  const pathname = usePathname();
  if (!inStores) {
    return (
      <a {...props} className={className} href={prelaunchUrl(pathname, href)}>
        {beforeLaunch ?? children}
      </a>
    );
  }
  if (computerOnly && storeUrl) return null;
  const url = appLinkUrl(href, storeUrl, store);
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
