/**
 * Where the product lives. iPhone and iPad install from the public TestFlight beta, Android from
 * Google Play; on a computer Pluggers opens in the browser.
 */
export const WEB_APP_URL = "https://app.plggrs.it";
/** The web app straight on the professional sign-up: the app reads `registrati`. */
export const PRO_SIGNUP_URL = `${WEB_APP_URL}/?registrati=professionista`;
export const APP_STORE_URL = "https://testflight.apple.com/join/p9mmTZrK";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=it.pluggers.app";
/** The anchor of a page's store badges, where links into the web app lead from a computer while it is closed. */
export const STORE_BADGES_ID = "scarica";

/**
 * Whether links open the web app from a computer. While it is false they don't (see `whenClosed` in AppLink),
 * and phones get their store even from a `store={false}` link. Open again since 14/10/2026, with the new
 * client, professional and firm screens.
 */
export const WEB_APP_OPEN: boolean = true;

/** The store for this device, or null when it opens in the browser. */
export function storeUrlFor(userAgent: string, platform = "", touchPoints = 0): string | null {
  if (/android/i.test(platform) || /android/i.test(userAgent)) return PLAY_STORE_URL;
  // iPadOS asks for the desktop site and says "Macintosh": only the touch screen gives it away.
  if (/iphone|ipad|ipod/i.test(userAgent) || (/macintosh/i.test(userAgent) && touchPoints > 1)) return APP_STORE_URL;
  return null;
}

/**
 * Whether anyone can install from Google Play. Until then it is a closed test and the public listing gives 404 to
 * whoever isn't a tester: `preferStore` false links (the professional sign-up) keep Android on the web app.
 */
export const PLAY_STORE_PUBLIC: boolean = false;

/**
 * Where a link into Pluggers leads: the device's store, or `href` on the web app; null when that would be
 * the web app while it is closed. With `preferStore` false a phone gets its store only once anyone can install
 * from it (the App Store, Google Play with PLAY_STORE_PUBLIC), and stays on `href` otherwise, as long as the web app is open.
 */
export function appLinkUrl(
  href: string,
  storeUrl: string | null,
  preferStore = true,
  webAppOpen = WEB_APP_OPEN,
  playPublic = PLAY_STORE_PUBLIC,
): string | null {
  if (storeUrl && (preferStore || !webAppOpen || storeUrl !== PLAY_STORE_URL || playPublic)) return storeUrl;
  return webAppOpen ? href : null;
}

/** Where a link into Pluggers leads, for the click event of the Meta pixel; null for any other link. */
export function appDestination(href: string): "ios" | "android" | "web" | null {
  if (href.startsWith(APP_STORE_URL)) return "ios";
  if (href.startsWith(PLAY_STORE_URL)) return "android";
  if (href.startsWith(`${WEB_APP_URL}/`) || href === WEB_APP_URL) return "web";
  return null;
}

/** The web app with the parameters it reads: `ref`, the invite code, and `p`, the token of an estimate link. */
export function webAppUrl(params: { ref?: string | null; p?: string | null }): string {
  const query = new URLSearchParams();
  if (params.ref) query.set("ref", params.ref);
  if (params.p) query.set("p", params.p);
  return query.size ? `${WEB_APP_URL}/?${query}` : WEB_APP_URL;
}
