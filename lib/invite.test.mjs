import { test } from "node:test";
import assert from "node:assert/strict";
import { inviteCode } from "./invite.ts";

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
