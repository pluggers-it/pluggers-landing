/** GA4 measurement ID of the «Pluggers - plggrs.it» property (public by design). Empty = Google Analytics off. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || "G-HXNSEPDBLD";

/** Meta pixel ID. Empty = pixel off: no Meta script and no request to Meta. Digits only, as it goes into an inline script. */
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? "";
export const META_PIXEL_ID = /^\d+$/.test(metaPixelId) ? metaPixelId : "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * A Meta pixel event. Does nothing unless the pixel was loaded, that is with the marketing consent.
 * Never pass personal data (name, email, phone): only what the event is.
 */
export function metaEvent(...args: unknown[]) {
  window.fbq?.(...args);
}
