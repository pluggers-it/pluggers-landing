"use client";

import { createContext, useContext } from "react";

// false without the provider: pre-launch is the safe side.
const InStores = createContext(false);

/** Whether the app is in the stores (`appInStores`), read once by the root layout for every link into Pluggers. */
export function InStoresProvider({ value, children }: { value: boolean; children: React.ReactNode }) {
  return <InStores value={value}>{children}</InStores>;
}

export function useInStores() {
  return useContext(InStores);
}
