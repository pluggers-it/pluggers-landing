/** Invite links: www.plggrs.it/i/CODE. Codes are made by core-api; the site only looks them up. */

const API = "https://api.plggrs.it/api/v1/referrals/code";

/** An invite page: its address carries the inviter's code and often an estimate token. */
export function isInvitePath(pathname: string): boolean {
  return pathname.startsWith("/i/");
}

/**
 * What Google Analytics gets in place of the page's own address and referrer, so nothing of an invite reaches it:
 * an invite page without its code and token, another site reduced to its origin (what browsers send anyway).
 * The address only on invite pages: gtag keeps it for every later event, and other pages move client-side.
 */
export function analyticsPage(href: string, referrer: string): { page_location?: string; page_referrer: string } {
  const page = new URL(href);
  const clean = (url: URL) => (isInvitePath(url.pathname) ? `${url.origin}/i/[codice]` : url.href);
  const from = referrer ? new URL(referrer) : null;
  return {
    ...(isInvitePath(page.pathname) && { page_location: clean(page) }),
    page_referrer: !from ? "" : from.origin === page.origin ? clean(from) : `${from.protocol}//${from.host}/`,
  };
}

/** 6 characters, uppercase letters and digits without the look-alikes 0, O, 1, I, L. */
const CODE = /^[A-HJKMNP-Z2-9]{6}$/;

/** The code as typed in the link, uppercased; null if it can't be one. */
export function inviteCode(raw: string): string | null {
  const code = raw.trim().toUpperCase();
  return CODE.test(code) ? code : null;
}

/**
 * `known: false` only when core-api says the code doesn't exist: then the link
 * opens the app without it. If the lookup fails, the code is kept and the page
 * just doesn't show a name.
 */
export async function readInvite(code: string): Promise<{ known: boolean; firstName?: string }> {
  try {
    const res = await fetch(`${API}/${code}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(2500),
    });
    if (res.status === 404) return { known: false };
    if (!res.ok) return { known: true };
    const { firstName } = (await res.json()) as { firstName?: unknown };
    const name = typeof firstName === "string" ? firstName.trim().slice(0, 40) : "";
    return name ? { known: true, firstName: name } : { known: true };
  } catch {
    return { known: true };
  }
}
