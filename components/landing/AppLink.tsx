"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import { storeUrlFor, WEB_APP_URL } from "./links";

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
 */
export function AppLink({ href = WEB_APP_URL, store = true, children, ...props }: ComponentProps<"a"> & { store?: boolean }) {
  const url = useSyncExternalStore(subscribe, () => (store ? deviceStoreUrl() : null) ?? href, () => href);
  const web = url === href;
  return (
    <a {...props} href={url} target={web ? "_blank" : undefined} rel={web ? "noopener noreferrer" : undefined}>
      {children}
      {web && <span className="sr-only"> (si apre in una nuova scheda)</span>}
    </a>
  );
}
