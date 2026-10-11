/**
 * Newsletter sign-ups go straight into the beehiiv publication the newsletter is sent from, so a
 * new subscriber gets the next issue without anyone exporting anything (Gianmarco, 9/10/2026).
 * Always with double opt-in: anyone can type any address in the form, so beehiiv first sends a
 * confirmation email and the address is subscribed only once its owner confirms.
 * Off until BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID are set on Vercel.
 */
export async function addToNewsletterList(email: string): Promise<"ok" | "off" | "error"> {
  const key = process.env.BEEHIIV_API_KEY?.trim();
  const pub = process.env.BEEHIIV_PUBLICATION_ID?.trim();
  if (!key || !pub) return "off";
  try {
    const r = await fetch(`https://api.beehiiv.com/v2/publications/${pub}/subscriptions`, {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        email,
        double_opt_override: "on",
        // Only for someone knowingly coming back (beehiiv docs): from a form anyone can fill, an address
        // that unsubscribed stays unsubscribed.
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: "plggrs.it",
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (r.ok) return "ok";
    console.error("[beehiiv] subscriber not added:", r.status, (await r.text()).slice(0, 300));
    return "error";
  } catch (e) {
    console.error("[beehiiv] subscriber not added:", e instanceof Error ? e.message : e);
    return "error";
  }
}
