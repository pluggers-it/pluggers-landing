import { test } from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { analyticsPage, inviteCode, isInvitePath, readInvite } from "./invite.ts";
import { WEB_APP_URL } from "../components/landing/links.ts";

test("accepts codes from the alphabet, uppercased", () => {
  assert.equal(inviteCode("MARC23"), "MARC23");
  assert.equal(inviteCode(" marc23 "), "MARC23");
  assert.equal(inviteCode("XKQ9P7"), "XKQ9P7");
});

test("rejects anything else", () => {
  for (const raw of ["MARC2", "MARC234", "MARI23", "MARIO2", "AB1CD2", "ABIL23", "AB0CD2", "AB-CD2", "..%2F..", "AB%20CD", ""]) {
    assert.equal(inviteCode(raw), null, raw);
  }
});

test("only a 404 drops the code; any other failure keeps it without a name", async () => {
  const realFetch = globalThis.fetch;
  const answer = (status, body) => {
    globalThis.fetch = async () => new Response(JSON.stringify(body), { status });
  };
  try {
    answer(200, { firstName: " Marco " });
    assert.deepEqual(await readInvite("MAR234"), { known: true, firstName: "Marco" });
    answer(200, { firstName: null });
    assert.deepEqual(await readInvite("MAR234"), { known: true });
    answer(404, { error: "Not Found" });
    assert.deepEqual(await readInvite("MAR234"), { known: false });
    answer(429, { error: "Too Many Requests" });
    assert.deepEqual(await readInvite("MAR234"), { known: true });
    globalThis.fetch = async () => { throw new DOMException("timeout", "TimeoutError"); };
    assert.deepEqual(await readInvite("MAR234"), { known: true });
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("Google Analytics gets an invite page's address and referrer without the code and the estimate token", () => {
  assert.equal(isInvitePath("/i/MARC23"), true);
  for (const path of ["/", "/i", "/invito", "/professionisti", "/blog/i-consigli"]) assert.equal(isInvitePath(path), false, path);

  const invite = "https://www.plggrs.it/i/MARC23?p=abcdef0123456789#x";
  assert.deepEqual(analyticsPage(invite, "https://web.whatsapp.com/"), {
    page_location: "https://www.plggrs.it/i/[codice]",
    page_referrer: "https://web.whatsapp.com/",
  });
  // another site keeps only its origin, even when it puts the invite in its own address
  assert.equal(analyticsPage(invite, `https://l.facebook.com/l.php?u=${encodeURIComponent(invite)}`).page_referrer, "https://l.facebook.com/");
  assert.equal(analyticsPage(invite, "android-app://com.whatsapp/").page_referrer, "android-app://com.whatsapp/");
  assert.equal(analyticsPage(invite, "").page_referrer, "");
  // any other page keeps its own address (gtag reads it at each event); coming from an invite, the referrer is cleaned
  assert.deepEqual(analyticsPage("https://www.plggrs.it/professionisti?utm_source=x", invite), {
    page_referrer: "https://www.plggrs.it/i/[codice]",
  });
  assert.equal(analyticsPage("https://www.plggrs.it/", "https://www.plggrs.it/blog").page_referrer, "https://www.plggrs.it/blog");
});

test("an invite page never hands its address to Google behind the site's back", async () => {
  // it leaves only with full page loads (no <Link>, banner included): a client-side move keeps the invite in the
  // tab's history, and Google Analytics reports the address it finds there on Back
  const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
  const page = read("../app/(site)/i/[code]/page.tsx");
  assert.doesNotMatch(page, /from "next\/link"/);
  assert.ok((page.match(/<a href="\/[^"]*"/g) ?? []).length > 0);
  assert.doesNotMatch(read("../components/ConsentGate.tsx"), /from "next\/link"/);

  // no referrer out of it, and no gtag diagnostics, which read the address with the code straight from the page
  const { default: config } = await import("../next.config.ts");
  const invite = (await config.headers()).find((rule) => rule.source === "/i/:path*");
  const header = (key) => invite.headers.find((h) => h.key === key)?.value;
  assert.equal(header("Referrer-Policy"), "no-referrer");
  const csp = Object.fromEntries(header("Content-Security-Policy").split("; ").map((d) => [d.split(" ")[0], d]));
  assert.match(csp["script-src"], /https:\/\/www\.googletagmanager\.com/);
  for (const directive of ["connect-src", "img-src"]) assert.doesNotMatch(csp[directive], /googletagmanager/, directive);
  // nor Meta, whose pixel sends the address with every event and stays off there
  assert.doesNotMatch(header("Content-Security-Policy"), /facebook/);

  // GA reports clicks to other domains with the link's full address: «Apri Pluggers» carries code and token,
  // and stays out of those reports only while the web app is a subdomain of the site
  assert.match(new URL(WEB_APP_URL).hostname, /\.plggrs\.it$/);
});
