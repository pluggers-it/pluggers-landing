import { test } from "node:test";
import assert from "node:assert/strict";
import { addToNewsletterList } from "./beehiiv.ts";

test("asks beehiiv for double opt-in and never reactivates an unsubscribed address", async () => {
  const realFetch = globalThis.fetch;
  process.env.BEEHIIV_API_KEY = "test-key";
  process.env.BEEHIIV_PUBLICATION_ID = "pub_test";
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, body: JSON.parse(init.body) };
    return new Response("{}", { status: 201 });
  };
  try {
    assert.equal(await addToNewsletterList("a@b.it"), "ok");
    assert.equal(sent.url, "https://api.beehiiv.com/v2/publications/pub_test/subscriptions");
    assert.equal(sent.body.email, "a@b.it");
    assert.equal(sent.body.double_opt_override, "on");
    assert.equal(sent.body.reactivate_existing, false);
  } finally {
    globalThis.fetch = realFetch;
    delete process.env.BEEHIIV_API_KEY;
    delete process.env.BEEHIIV_PUBLICATION_ID;
  }
});
