"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import { storeUrlFor, WEB_APP_URL } from "./links";

const subscribe = () => () => {};

function deviceStoreUrl() {
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform;
  return storeUrlFor(navigator.userAgent, platform, navigator.maxTouchPoints);
}

/**
 * A link into Pluggers: the store on phones and tablets, the web app on a computer.
 * The server renders the web address and the store one replaces it after hydration.
 */
export function AppLink({ href = WEB_APP_URL, ...props }: ComponentProps<"a">) {
  const url = useSyncExternalStore(subscribe, () => deviceStoreUrl() ?? href, () => href);
  return <a {...props} href={url} />;
}
