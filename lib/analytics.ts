/** GA4 measurement ID of the «Pluggers - plggrs.it» property (public by design). Empty = Google Analytics off. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || "G-HXNSEPDBLD";

/** Meta pixel ID. Empty = pixel off: no Meta script and no request to Meta. Digits only, as it goes into an inline script. */
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";
export const META_PIXEL_ID = /^\d+$/.test(metaPixelId) ? metaPixelId : "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * The page's gtag(), created on first use: Google Analytics and Google Ads share one queue, one gtag.js and these
 * consent defaults (consentState, from the cookie banner). Call it only once a Google tag is allowed to run.
 */
export function startGtag(consent: Record<string, string>) {
  if (window.gtag) return window.gtag;
  const dataLayer = (window.dataLayer ??= []);
  // gtag.js reads its queue as `arguments` objects, not arrays
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  window.gtag("consent", "default", consent);
  window.gtag("js", new Date());
  return window.gtag;
}

/**
 * A Meta pixel event. Does nothing unless the pixel was loaded, that is with the marketing consent.
 * Never pass personal data (name, email, phone): only what the event is.
 */
export function metaEvent(...args: unknown[]) {
  window.fbq?.(...args);
}
