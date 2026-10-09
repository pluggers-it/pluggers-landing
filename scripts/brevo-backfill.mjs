// One-off: puts everyone who already signed up to the newsletter (waitlist, source = newsletter)
// into the Brevo list. New sign-ups go there on their own (lib/brevo.ts).
// NEXT_PUBLIC_SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… BREVO_API_KEY=… BREVO_LIST_ID=… node scripts/brevo-backfill.mjs
const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: sk, BREVO_API_KEY: bk, BREVO_LIST_ID: list } = process.env;
if (!url || !sk || !bk || !list) throw new Error("servono NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BREVO_API_KEY e BREVO_LIST_ID");
const r = await fetch(`${url}/rest/v1/waitlist?select=email,first_name,last_name&source=eq.newsletter`, { headers: { apikey: sk, Authorization: `Bearer ${sk}` } });
const rows = await r.json();
let ok = 0;
for (const row of rows) {
  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": bk, "content-type": "application/json" },
    body: JSON.stringify({ email: row.email, listIds: [Number(list)], updateEnabled: true }),
  });
  if (res.ok || res.status === 204) ok++;
  else console.error(row.email.replace(/(.).*@/, "$1…@"), res.status, (await res.text()).slice(0, 120));
}
console.log(`${ok} su ${rows.length} iscritti nella lista Brevo ${list}`);
