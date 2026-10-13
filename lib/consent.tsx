"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

/** What the cookie banner allows on top of the technical cookies. */
export interface CookieChoice {
  /** Google Analytics */
  analytics: boolean;
  /** Meta pixel */
  marketing: boolean;
}

export const ACCEPT_ALL: CookieChoice = { analytics: true, marketing: true };
export const TECHNICAL_ONLY: CookieChoice = { analytics: false, marketing: false };

// v1 only covered statistics: with Meta added everyone is asked again.
const CHOICE_KEY = "pluggers_cookies_v2";

function parseChoice(stored: string | null): CookieChoice | null {
  try {
    const value = JSON.parse(stored ?? "null");
    if (typeof value?.analytics === "boolean" && typeof value?.marketing === "boolean") {
      return { analytics: value.analytics, marketing: value.marketing };
    }
  } catch {}
  return null;
}

const listeners = new Set<() => void>();
const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  return () => void listeners.delete(onChange);
};
const notify = () => listeners.forEach((onChange) => onChange());

// ── Context ───────────────────────────────────────────────────────────────────
interface ConsentContextValue {
  /** null = not decided yet (the banner is visible) */
  choice: CookieChoice | null;

  /** Save a choice from the banner */
  choose: (choice: CookieChoice) => void;

  /** Forget the choice: the banner shows again */
  resetChoice: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  choice:      null,
  choose:      () => {},
  resetChoice: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  // The server renders "no choice"; the stored one takes over after hydration.
  const stored = useSyncExternalStore(subscribe, () => localStorage.getItem(CHOICE_KEY), () => null);
  const choice = useMemo(() => parseChoice(stored), [stored]);

  const choose = useCallback((next: CookieChoice) => {
    localStorage.setItem(CHOICE_KEY, JSON.stringify(next));
    notify();
  }, []);

  const resetChoice = useCallback(() => {
    localStorage.removeItem(CHOICE_KEY);
    // Google Analytics and the Meta pixel keep running until the page reloads: a reload is the clean way to stop them
    if (choice?.analytics || choice?.marketing) window.location.reload();
    else notify();
  }, [choice]);

  return (
    <ConsentContext.Provider value={{ choice, choose, resetChoice }}>
      {children}
    </ConsentContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useConsent() {
  return useContext(ConsentContext);
}
