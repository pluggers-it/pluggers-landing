"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie } from "lucide-react";
import { useConsent } from "@/lib/consent";

/**
 * Non-blocking cookie consent banner.
 *
 * - Visible at the bottom only when the user hasn't made a cookie choice yet.
 * - Does NOT block access to the site (GDPR Art. 7 — consent must be freely given).
 * - Privacy Policy + T&C acceptance is handled at form level (waitlist/newsletter).
 * - "Accetta" → consent granted.  "Solo tecnici" → consent denied.
 */
export function ConsentGate() {
  const { analyticsConsent, acceptAll, acceptNecessary } = useConsent();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Show it from the frame after hydration, once the stored choice has been read.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Don't render during SSR or once a choice has been made
  // the QR page is held up to someone else's camera
  if (!mounted || analyticsConsent !== null || pathname === "/qr") return null;

  // CSS entrance instead of framer-motion: keeps the animation library off every page but the home.
  return (
      <div
        className="consent-in fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2"
        role="dialog"
        aria-label="Preferenze cookie"
        aria-live="polite"
      >
        <div
          className="flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] p-5 sm:flex-row sm:items-center sm:gap-5"
          style={{
            background: "var(--surface)",
            boxShadow: "0 24px 48px -24px rgba(23,21,26,0.35)",
          }}
        >
          {/* Icon */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "var(--accent-soft)" }}
          >
            <Cookie className="h-5 w-5 text-[var(--accent-text)]" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="font-sans text-sm font-semibold leading-snug">
              Utilizziamo i cookie
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-muted)]">
              Usiamo cookie tecnici necessari al funzionamento del sito.{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 transition hover:text-[var(--color-foreground)]"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={acceptNecessary}
              className="h-11 rounded-full border border-[var(--line)] px-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--page)]"
            >
              Solo tecnici
            </button>
            <button
              onClick={acceptAll}
              className="h-11 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
            >
              Accetta
            </button>
          </div>
        </div>
      </div>
  );
}
