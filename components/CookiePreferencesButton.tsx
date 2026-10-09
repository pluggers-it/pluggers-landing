"use client";

import { useConsent } from "@/lib/consent";

/** Shows the cookie banner again, so the choice can be changed as easily as it was given. */
export function CookiePreferencesButton() {
  const { resetChoice } = useConsent();
  return (
    <button
      type="button"
      onClick={resetChoice}
      className="inline-flex min-h-12 items-center font-semibold text-accent-text underline underline-offset-4"
    >
      Modifica le preferenze sui cookie
    </button>
  );
}
