/**
 * The thank-you page after the sign-up form. Nothing links to it: the form sends people there and leaves a flag in
 * sessionStorage, and /grazie sends anyone without the flag to the home. That is no protection (the address is
 * public), it only keeps the page, which Google Ads counts as a sign-up, from being found by chance.
 */
export const GRAZIE_PATH = "/grazie";

/** Never indexed: out of the sitemap, with noindex (not a robots.txt Disallow, which would hide the noindex). */
export const GRAZIE_ROBOTS = { index: false, follow: false } as const;

const FLAG = "pluggers_iscritto";

type Store = Pick<Storage, "getItem" | "setItem">;

/** Marks this tab as having just signed up. False if the browser refuses to store it: then the form keeps its in-page thanks. */
export function markSignedUp(store: Store = sessionStorage): boolean {
  try {
    store.setItem(FLAG, "1");
    return true;
  } catch {
    return false;
  }
}

export function hasSignedUp(store: Store = sessionStorage): boolean {
  try {
    return store.getItem(FLAG) !== null;
  } catch {
    return false;
  }
}

/** True once per sign-up: the conversion goes out the first time, not on a reload of /grazie. */
export function takeConversion(store: Store = sessionStorage): boolean {
  try {
    if (store.getItem(FLAG) !== "1") return false;
    store.setItem(FLAG, "sent");
    return true;
  } catch {
    return false;
  }
}
