"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type AnalyticsConsent = "granted" | "denied" | null;

const TERMS_KEY     = "pluggers_terms_v1";      // accepted T&C + Privacy
const ANALYTICS_KEY = "pluggers_analytics_v1";  // analytics cookie choice

// ── Context ───────────────────────────────────────────────────────────────────
interface ConsentContextValue {
  /**
   * Has the user accepted Terms + Privacy?
   * null  = not hydrated yet (SSR)
   * false = not accepted (gate is visible)
   * true  = accepted (gate is hidden)
   */
  termsAccepted: boolean | null;

  /**
   * Analytics cookie choice.
   * null    = pending (no explicit decision yet)
   * granted = user opted in
   * denied  = user opted out
   */
  analyticsConsent: AnalyticsConsent;

  /** Accept T&C + Privacy AND grant analytics cookies */
  acceptAll: () => void;

  /** Accept T&C + Privacy, but decline analytics cookies */
  acceptNecessary: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  termsAccepted:    null,
  analyticsConsent: null,
  acceptAll:        () => {},
  acceptNecessary:  () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [termsAccepted,    setTermsAccepted]    = useState<boolean | null>(null);
  const [analyticsConsent, setAnalyticsConsent] = useState<AnalyticsConsent>(null);

  useEffect(() => {
    setTermsAccepted(localStorage.getItem(TERMS_KEY) === "true");
    const stored = localStorage.getItem(ANALYTICS_KEY) as AnalyticsConsent | null;
    if (stored === "granted" || stored === "denied") setAnalyticsConsent(stored);
  }, []);

  const acceptAll = useCallback(() => {
    localStorage.setItem(TERMS_KEY,     "true");
    localStorage.setItem(ANALYTICS_KEY, "granted");
    setTermsAccepted(true);
    setAnalyticsConsent("granted");
  }, []);

  const acceptNecessary = useCallback(() => {
    localStorage.setItem(TERMS_KEY,     "true");
    localStorage.setItem(ANALYTICS_KEY, "denied");
    setTermsAccepted(true);
    setAnalyticsConsent("denied");
  }, []);

  return (
    <ConsentContext.Provider value={{ termsAccepted, analyticsConsent, acceptAll, acceptNecessary }}>
      {children}
    </ConsentContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useConsent() {
  return useContext(ConsentContext);
}
