/**
 * Thin wrapper around window.plausible (provided by next-plausible with taggedEvents={true}).
 * Safe to call even before the Plausible script has loaded — it simply no-ops.
 * Cookie-free and GDPR compliant by default; no consent check required.
 */

// ── Global type augmentation ──────────────────────────────────────────────────
declare global {
  interface Window {
    plausible: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clarity: (...args: any[]) => void;
  }
}

export type PlausibleEventProps = Record<string, string | number | boolean>;

/**
 * Fires a Plausible custom event.
 * No-op when window.plausible is not yet initialised.
 */
export function trackEvent(eventName: string, props?: PlausibleEventProps) {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;
  window.plausible(eventName, { props });
}

/** Fired when the user scrolls past a depth threshold (25 / 50 / 90 %). */
export function trackScrollDepth(percent: 25 | 50 | 90) {
  trackEvent("Scroll Depth", { percent, page: window.location.pathname });
}

/** Fired the first time the user interacts with a specific form. */
export function trackFormStart(formName: string) {
  trackEvent("Form Start", { form_name: formName });
}

/** Fired on successful form submission. */
export function trackFormSubmit(formName: string) {
  trackEvent("Form Submit", { form_name: formName });
}
