/**
 * Where the product lives. iPhone and iPad install from the public TestFlight beta,
 * Android from the Google Play test; on a computer Pluggers opens in the browser.
 */
export const WEB_APP_URL = "https://app.plggrs.it";
export const APP_STORE_URL = "https://testflight.apple.com/join/p9mmTZrK";
export const PLAY_STORE_URL = "https://play.google.com/apps/testing/it.pluggers.app";

/** The store for this device, or null on a computer. */
export function storeUrlFor(userAgent: string, platform = "", touchPoints = 0): string | null {
  if (/android/i.test(platform) || /android/i.test(userAgent)) return PLAY_STORE_URL;
  // iPadOS asks for the desktop site and says "Macintosh": only the touch screen gives it away.
  if (/iphone|ipad|ipod/i.test(userAgent) || (/macintosh/i.test(userAgent) && touchPoints > 1)) return APP_STORE_URL;
  return null;
}
