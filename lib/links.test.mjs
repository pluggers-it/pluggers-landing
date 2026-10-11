import { test } from "node:test";
import assert from "node:assert/strict";
import { ANDROID_STORE_OPEN, APP_STORE_URL, PLAY_STORE_URL, storeUrlFor } from "../components/landing/links.ts";

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

test("Android gets Google Play only once it is open to everyone, the web app until then", () => {
  const android = ANDROID_STORE_OPEN ? PLAY_STORE_URL : null;
  assert.equal(storeUrlFor(ANDROID), android);
  assert.equal(storeUrlFor(WINDOWS, "Android"), android);
  if (ANDROID_STORE_OPEN) assert.match(PLAY_STORE_URL, /^https:\/\/play\.google\.com\//);
  else assert.equal(PLAY_STORE_URL, null);
});

