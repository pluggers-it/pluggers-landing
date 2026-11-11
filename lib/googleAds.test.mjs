import { test } from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { adsOn, consentState, conversionTarget, parseAdsId, parseConversionLabel } from "./googleAds.ts";

const ID = "AW-123456789";
const ACCEPTED = { analytics: true, marketing: true };

test("only a well-formed AW- ID or label gets through: they end up in a script URL and an event", () => {
  assert.equal(parseAdsId(` ${ID} `), ID);
  for (const raw of [undefined, "", "AW-", "G-HXNSEPDBLD", "AW-12x", "AW-1'); alert(1)//", "aw-123", "AW-123/abc"]) {
    assert.equal(parseAdsId(raw), "", String(raw));
  }
  assert.equal(parseConversionLabel("AbC-d_Ef12"), "AbC-d_Ef12");
  for (const raw of [undefined, "", "ab cd", "a/b", "x'});alert(1)//"]) assert.equal(parseConversionLabel(raw), "", String(raw));
});

test("Google Ads runs only with an ID, the marketing consent and outside invite pages", () => {
  assert.equal(adsOn(ID, ACCEPTED, false), true);
  assert.equal(adsOn("", ACCEPTED, false), false, "no ID");
  assert.equal(adsOn(ID, null, false), false, "no choice yet");
  assert.equal(adsOn(ID, { analytics: true, marketing: false }, false), false, "statistics only");
  assert.equal(adsOn(ID, { analytics: false, marketing: false }, false), false, "technical only");
  assert.equal(adsOn(ID, ACCEPTED, true), false, "invite page");
});

test("the conversion needs both the ID and the label", () => {
  assert.equal(conversionTarget(ID, "AbC-d_Ef12"), `${ID}/AbC-d_Ef12`);
  assert.equal(conversionTarget(ID, ""), "");
  assert.equal(conversionTarget("", "AbC-d_Ef12"), "");
});

test("consent mode grants advertising only to a running Google Ads, never personalised ads", () => {
  // without Google Ads (no ID, no marketing consent, invite page): what Google Analytics always had
  assert.deepEqual(consentState(true, false), { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
  assert.deepEqual(consentState(false, true), { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied", analytics_storage: "denied" });
  assert.deepEqual(consentState(true, true), { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "denied", analytics_storage: "granted" });
});

test("the tag component wires those rules, and nothing else loads or sends Google Ads", () => {
  const source = readFileSync(new URL("../components/Analytics.tsx", import.meta.url), "utf8");
  // the decision comes from adsOn() with the banner's choice and the invite check
  assert.match(source, /const ads = adsOn\(GOOGLE_ADS_ID, choice, isInvitePath\(pathname\)\)/);
  // the Ads destination is configured only when it is on
  assert.match(source, /if \(ads && !configured\.current\.ads\) \{[^}]*gtag\("config", GOOGLE_ADS_ID\)/);
  // the conversion: on, with a target, on /grazie, once
  assert.match(source, /if \(ads && target && pathname === GRAZIE_PATH && takeConversion\(\)\)/);
  assert.match(source, /send_to: target/);
  // the script is loaded from the ID only when Google Ads is on, and the destination is configured in one place
  assert.match(source, /analytics \? GA_MEASUREMENT_ID : ads \? GOOGLE_ADS_ID : ""/);
  assert.equal(source.match(/gtag\("config", GOOGLE_ADS_ID\)/g).length, 1);
  assert.equal(source.match(/"event", "conversion"/g).length, 1);
});
