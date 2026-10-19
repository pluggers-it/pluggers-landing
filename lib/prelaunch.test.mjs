import { test } from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { appInStores, originPage, prelaunchPrefill } from "./prelaunch.ts";
import { APP_STORE_URL, PLAY_STORE_URL, PRELAUNCH_PATH, PRO_SIGNUP_URL, WEB_APP_URL, appLinkUrl, prelaunchUrl } from "../components/landing/links.ts";

const config = (ui) => ({ config: { payments: { gateway: "mock" }, ui }, is_admin: false });

test("only app_negli_store set to true in the admin panel opens the stores; anything else, or no answer, is pre-launch", async () => {
  const realFetch = globalThis.fetch;
  const answer = (status, body) => {
    globalThis.fetch = async () => new Response(typeof body === "string" ? body : JSON.stringify(body), { status });
  };
  try {
    answer(200, config({ app_negli_store: true, vies_check: false }));
    assert.equal(await appInStores(), true);
    answer(200, config({ app_negli_store: false }));
    assert.equal(await appInStores(), false);
    answer(200, config({ vies_check: false }));
    assert.equal(await appInStores(), false);
    answer(200, config({ app_negli_store: "true" }));
    assert.equal(await appInStores(), false);
    answer(200, { config: {} });
    assert.equal(await appInStores(), false);
    answer(200, "null");
    assert.equal(await appInStores(), false);
    answer(200, "<html>");
    assert.equal(await appInStores(), false);
    answer(500, { error: "Internal Server Error" });
    assert.equal(await appInStores(), false);
    globalThis.fetch = async () => { throw new DOMException("timeout", "TimeoutError"); };
    assert.equal(await appInStores(), false);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("before launch every link into Pluggers leads to the pre-registration, with the page it came from", () => {
  assert.equal(PRELAUNCH_PATH, "/preiscrizione");
  // header, «Apri Pluggers», store badges, the demo button: the web app's home
  assert.equal(prelaunchUrl("/"), "/preiscrizione?da=%2F");
  assert.equal(prelaunchUrl("/torino/idraulico", WEB_APP_URL), "/preiscrizione?da=%2Ftorino%2Fidraulico");
  // «Iscriviti come professionista»
  assert.equal(prelaunchUrl("/professionisti", PRO_SIGNUP_URL), "/preiscrizione?da=%2Fprofessionisti&ruolo=pro");
  for (const url of [prelaunchUrl("/"), prelaunchUrl("/", PRO_SIGNUP_URL)]) {
    assert.ok(!url.includes(WEB_APP_URL) && !url.includes(APP_STORE_URL) && !url.includes(PLAY_STORE_URL), url);
  }
});

test("after launch the links are the stores and the web app, as before", () => {
  assert.equal(appLinkUrl(WEB_APP_URL, null), WEB_APP_URL);
  assert.equal(appLinkUrl(WEB_APP_URL, APP_STORE_URL), APP_STORE_URL);
  assert.equal(appLinkUrl(WEB_APP_URL, PLAY_STORE_URL), PLAY_STORE_URL);
  assert.equal(appLinkUrl(PRO_SIGNUP_URL, null, false), PRO_SIGNUP_URL);
});

test("the form starts from the link: the role it names or the page suggests, and a Turin page's trade", () => {
  const params = (da, ruolo) => new URLSearchParams(prelaunchUrl(da, ruolo === "pro" ? PRO_SIGNUP_URL : undefined).split("?")[1]);
  const prefill = (da, ruolo) => prelaunchPrefill(Object.fromEntries(params(da, ruolo)));

  assert.deepEqual(prefill("/torino/idraulico"), { role: "cliente", tradeSlug: "idraulico", page: "/torino/idraulico" });
  assert.deepEqual(prefill("/torino/idraulico", "pro"), { role: "pro", tradeSlug: "idraulico", page: "/torino/idraulico" });
  assert.deepEqual(prefill("/torino"), { role: "cliente", tradeSlug: null, page: "/torino" });
  assert.deepEqual(prefill("/clienti"), { role: "cliente", tradeSlug: null, page: "/clienti" });
  assert.deepEqual(prefill("/professionisti"), { role: "pro", tradeSlug: null, page: "/professionisti" });
  assert.deepEqual(prefill("/"), { role: null, tradeSlug: null, page: "/" });
  assert.deepEqual(prefill("/blog/norme-caldaie"), { role: null, tradeSlug: null, page: "/blog/norme-caldaie" });
  assert.deepEqual(prelaunchPrefill({ ruolo: "cliente" }), { role: "cliente", tradeSlug: null, page: "" });
  assert.deepEqual(prelaunchPrefill({ da: ["/a", "/b"], ruolo: ["pro"] }), { role: null, tradeSlug: null, page: "" });
  assert.deepEqual(prelaunchPrefill({}), { role: null, tradeSlug: null, page: "" });
});

test("the stored page is a path of the site, never another address or an invite's code", () => {
  assert.equal(originPage("/torino/fabbro"), "/torino/fabbro");
  assert.equal(originPage(" /chi-siamo "), "/chi-siamo");
  assert.equal(originPage("/i/MARC23"), "/i/[codice]");
  for (const raw of ["https://example.com/", "//example.com", "torino", "/a?b=c", "/a#b", "/<script>", `/${"a".repeat(120)}`, "", null, 42, {}]) {
    assert.equal(originPage(raw), "", String(raw));
  }
});

test("invite pages and estimate links stay as they are: straight to the web app with code and token", () => {
  const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
  const invite = read("../app/(site)/i/[code]/page.tsx");
  assert.match(invite, /webAppUrl\(\{ ref: code, p:/);
  assert.doesNotMatch(invite, /AppLink|StoreBadges|prelaunch|preiscrizione/);
});
