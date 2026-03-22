"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ConsentStatus = "granted" | "denied" | null;

const STORAGE_KEY = "pluggers_cookie_consent";

// ── Context ───────────────────────────────────────────────────────────────────
interface ConsentContextValue {
  /** null = not yet decided; "granted" / "denied" = user made a choice */
  consent: ConsentStatus;
  accept: () => void;
  deny: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  consent: null,
  accept: () => {},
  deny: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentStatus>(null);

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentStatus | null;
    if (stored === "granted" || stored === "denied") setConsent(stored);
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "granted");
    setConsent("granted");
  }, []);

  const deny = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "denied");
    setConsent("denied");
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, accept, deny }}>
      {children}
    </ConsentContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useConsent() {
  return useContext(ConsentContext);
}
