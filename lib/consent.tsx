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
   * Cookie choice.
   * null    = not yet decided (banner is visible)
   * granted = user opted in
   * denied  = user opted out
   */
  analyticsConsent: AnalyticsConsent;

  /** Accept cookies */
  acceptAll: () => void;

  /** Decline optional cookies */
  acceptNecessary: () => void;

  /** Forget the choice: the banner shows again */
  resetChoice: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  analyticsConsent: null,
  acceptAll:        () => {},
  acceptNecessary:  () => {},
  resetChoice:      () => {},
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

  const resetChoice = useCallback(() => {
    localStorage.removeItem(ANALYTICS_KEY);
    // GA keeps running until the page reloads: a reload is the clean way to stop it
    if (analyticsConsent === "granted") window.location.reload();
    else setAnalyticsConsent(null);
  }, [analyticsConsent]);

  return (
    <ConsentContext.Provider value={{ analyticsConsent, acceptAll, acceptNecessary, resetChoice }}>
      {children}
    </ConsentContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useConsent() {
  return useContext(ConsentContext);
}
