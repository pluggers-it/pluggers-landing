"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type AnalyticsConsent = "granted" | "denied" | null;

const ANALYTICS_KEY = "pluggers_analytics_v1";

// ── Context ───────────────────────────────────────────────────────────────────
interface ConsentContextValue {
  /**
   * Analytics cookie choice.
   * null    = not yet decided (banner is visible)
   * granted = user opted in  (GA4 + Clarity load)
   * denied  = user opted out (no tracking)
   */
  analyticsConsent: AnalyticsConsent;

  /** Accept analytics cookies */
  acceptAll: () => void;

  /** Decline analytics cookies */
  acceptNecessary: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  analyticsConsent: null,
  acceptAll:        () => {},
  acceptNecessary:  () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [analyticsConsent, setAnalyticsConsent] = useState<AnalyticsConsent>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ANALYTICS_KEY) as AnalyticsConsent | null;
    if (stored === "granted" || stored === "denied") setAnalyticsConsent(stored);
  }, []);

  const acceptAll = useCallback(() => {
    localStorage.setItem(ANALYTICS_KEY, "granted");
    setAnalyticsConsent("granted");
  }, []);

  const acceptNecessary = useCallback(() => {
    localStorage.setItem(ANALYTICS_KEY, "denied");
    setAnalyticsConsent("denied");
  }, []);

  return (
    <ConsentContext.Provider value={{ analyticsConsent, acceptAll, acceptNecessary }}>
      {children}
    </ConsentContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useConsent() {
  return useContext(ConsentContext);
}
