/** Invite links: www.plggrs.it/i/CODE. Codes are made by core-api; the site only looks them up. */

const API = "https://api.plggrs.it/api/v1/referrals/code";

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
