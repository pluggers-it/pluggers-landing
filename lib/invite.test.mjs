import { test } from "node:test";
import assert from "node:assert/strict";
import { inviteCode, readInvite } from "./invite.ts";

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
