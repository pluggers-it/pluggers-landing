/**
 * Where the product lives. iPhone and iPad install from the public TestFlight beta;
 * on a computer, and on Android until Google Play opens, Pluggers opens in the browser.
 */
export const WEB_APP_URL = "https://app.plggrs.it";
export const APP_STORE_URL = "https://testflight.apple.com/join/p9mmTZrK";

/**
 * Google Play is a closed test without a public group: only the testers can install from it.
 * While this is false Android goes to the web app and no Google Play link is shown; set it to
 * true once anyone can install.
 */
export const ANDROID_STORE_OPEN: boolean = false;
export const PLAY_STORE_URL: string | null = ANDROID_STORE_OPEN ? "https://play.google.com/apps/testing/it.pluggers.app" : null;

/** The store for this device, or null when it opens in the browser. */
export function storeUrlFor(userAgent: string, platform = "", touchPoints = 0): string | null {
  if (/android/i.test(platform) || /android/i.test(userAgent)) return PLAY_STORE_URL;
  // iPadOS asks for the desktop site and says "Macintosh": only the touch screen gives it away.
  if (/iphone|ipad|ipod/i.test(userAgent) || (/macintosh/i.test(userAgent) && touchPoints > 1)) return APP_STORE_URL;
  return null;
}

