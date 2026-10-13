import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_STORE_URL, PLAY_STORE_URL, PRO_SIGNUP_URL, WEB_APP_OPEN, WEB_APP_URL, appDestination, appLinkUrl, deviceKind, storeUrlFor, webAppUrl } from "../components/landing/links.ts";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const IPAD_DESKTOP_MODE = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15";
const ANDROID = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36";
const WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";

test("iPhone and iPad get TestFlight, computers the web app", () => {
  assert.equal(storeUrlFor(IPHONE), APP_STORE_URL);
  assert.equal(storeUrlFor(IPAD_DESKTOP_MODE, "", 5), APP_STORE_URL);
  assert.equal(storeUrlFor(IPAD_DESKTOP_MODE, "", 0), null);
  assert.equal(storeUrlFor(WINDOWS, "Windows", 10), null);
});

test("Android gets the public Google Play listing", () => {
  assert.equal(PLAY_STORE_URL, "https://play.google.com/store/apps/details?id=it.pluggers.app");
  assert.equal(storeUrlFor(ANDROID), PLAY_STORE_URL);
  assert.equal(storeUrlFor(WINDOWS, "Android"), PLAY_STORE_URL);
});

test("while the web app is closed, computers get no link and phones the store, even from a store={false} link", () => {
  assert.equal(appLinkUrl(WEB_APP_URL, null, true, false), null);
  assert.equal(appLinkUrl(PRO_SIGNUP_URL, null, false, false), null);
  assert.equal(appLinkUrl(WEB_APP_URL, APP_STORE_URL, true, false), APP_STORE_URL);
  assert.equal(appLinkUrl(PRO_SIGNUP_URL, PLAY_STORE_URL, false, false), PLAY_STORE_URL);
});

test("once the web app is open, computers get it and store={false} links stay on it", () => {
  assert.equal(appLinkUrl(WEB_APP_URL, null, true, true), WEB_APP_URL);
  assert.equal(appLinkUrl(WEB_APP_URL, APP_STORE_URL, true, true), APP_STORE_URL);
  assert.equal(appLinkUrl(PRO_SIGNUP_URL, APP_STORE_URL, false, true), PRO_SIGNUP_URL);
});

test("the web app is closed for now", () => {
  assert.equal(WEB_APP_OPEN, false);
});

test("the invite link goes to /invito with the invite code and the estimate token", () => {
  assert.equal(webAppUrl({}), `${WEB_APP_URL}/invito`);
  assert.equal(webAppUrl({ ref: null, p: null }), `${WEB_APP_URL}/invito`);
  assert.equal(webAppUrl({ ref: "MARC23" }), `${WEB_APP_URL}/invito?ref=MARC23`);
  assert.equal(webAppUrl({ ref: "MARC23", p: "abcdef0123456789" }), `${WEB_APP_URL}/invito?ref=MARC23&p=abcdef0123456789`);
});

test("the invite button tells iPhone and iPad, Android and computers apart", () => {
  assert.equal(deviceKind(IPHONE), "ios");
  assert.equal(deviceKind(IPAD_DESKTOP_MODE, "", 5), "ios");
  assert.equal(deviceKind(IPAD_DESKTOP_MODE, "", 0), "computer");
  assert.equal(deviceKind(ANDROID), "android");
  assert.equal(deviceKind(WINDOWS, "Android"), "android");
  assert.equal(deviceKind(WINDOWS, "Windows", 10), "computer");
});

test("the professional sign-up link opens the web app on the registration", () => {
  assert.equal(PRO_SIGNUP_URL, `${WEB_APP_URL}/?registrati=professionista`);
});

test("the pixel tells the ways into Pluggers apart and ignores every other link", () => {
  assert.equal(appDestination(APP_STORE_URL), "ios");
  assert.equal(appDestination("https://app.plggrs.it/"), "web");
  assert.equal(appDestination(PRO_SIGNUP_URL), "web");
  if (PLAY_STORE_URL) assert.equal(appDestination(PLAY_STORE_URL), "android");
  assert.equal(appDestination("https://app.plggrs.it.example.com/"), null);
  assert.equal(appDestination("https://www.plggrs.it/privacy"), null);
});
