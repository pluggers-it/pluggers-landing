/**
 * Thin wrapper around window.gtag.
 * Safe to call even if GA4 has not loaded yet — it simply no-ops.
 */

// ── Global type augmentation ──────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clarity: (...args: any[]) => void;
  }
}

export type GTagEventParams = Record<string, string | number | boolean | undefined>;

/**
 * Fires a GA4 custom event.
 * No-op when gtag is not yet initialised (i.e. before consent).
 */
export function trackEvent(eventName: string, params?: GTagEventParams) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

/** Convenience: fire scroll_depth with the reached percentage threshold. */
export function trackScrollDepth(percent: 25 | 50 | 90) {
  trackEvent("scroll_depth", { percent, page: window.location.pathname });
}

/** Fired the first time the user interacts with a specific form. */
export function trackFormStart(formName: string) {
  trackEvent("form_start", { form_name: formName });
}

/** Fired on successful form submission. */
export function trackFormSubmit(formName: string) {
  trackEvent("form_submit", { form_name: formName });
}
