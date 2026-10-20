import { test } from "node:test";
import assert from "node:assert/strict";
import { isItalianPhone, splitContact, splitName, validateWaitlist } from "./waitlist.ts";

// What the API passes to validateWaitlist: trimmed fields, "" for what is missing.
const signup = (fields) => ({
  email: "", firstName: "Mario", lastName: "", phone: "", profession: "", city: "10125", region: "", problem: "",
  source: "waitlist", privacyAccepted: true, ...fields,
});
const client = (fields) => signup({ profession: "cliente", ...fields });

test("a client leaves only a phone number", () => {
  assert.equal(validateWaitlist(client({ phone: "333 123 4567" })), null);
  assert.equal(validateWaitlist(client({ phone: "+39 333 1234567", problem: "Il rubinetto perde" })), null);
});

test("a client leaves only an email", () => {
  assert.equal(validateWaitlist(client({ email: "mario@example.com" })), null);
});

test("a client with no contact, a bad email or a number that is not Italian is rejected", () => {
  assert.match(validateWaitlist(client({})), /email o un numero/);
  assert.match(validateWaitlist(client({ email: "mario@" })), /Email non valida/);
  assert.match(validateWaitlist(client({ phone: "+44 7911 123456" })), /telefono non valido/);
  assert.match(validateWaitlist(client({ phone: "12345" })), /telefono non valido/);
  assert.match(validateWaitlist(client({ email: "mario@example.com", problem: "x".repeat(201) })), /200 caratteri/);
});

test("a professional needs a phone number; the email and the surname are optional", () => {
  const pro = (fields) => signup({ profession: "idraulico", ...fields });
  assert.match(validateWaitlist(pro({ email: "mario@example.com" })), /telefono non valido/);
  assert.match(validateWaitlist(pro({})), /telefono non valido/);
  assert.equal(validateWaitlist(pro({ phone: "333 123 4567" })), null);
  assert.equal(validateWaitlist(pro({ phone: "333 123 4567", lastName: "Rossi", email: "mario@example.com" })), null);
  assert.match(validateWaitlist(pro({ phone: "333 123 4567", email: "mario@" })), /Email non valida/);
  assert.match(validateWaitlist(pro({ phone: "333 123 4567", profession: "" })), /professione/);
});

test("the old payloads of the other forms are still accepted", () => {
  const old = {
    email: "mario@example.com", firstName: "Mario", lastName: "Rossi", phone: "+39 333 123 4567",
    profession: "idraulico", city: "Torino", region: "", problem: "", source: "waitlist", privacyAccepted: true,
  };
  assert.equal(validateWaitlist(old), null);
  assert.equal(validateWaitlist({ ...old, source: "newsletter" }), null);
  assert.equal(validateWaitlist({ ...old, phone: "+44 7911 123456" }), null); // foreign numbers were always fine here
  assert.equal(validateWaitlist({ ...old, region: "Piemonte" }), null);
});

test("the newsletter needs the email it subscribes; every sign-up needs the privacy notice and a name and city", () => {
  assert.match(validateWaitlist(signup({ source: "newsletter", profession: "idraulico", phone: "333 123 4567" })), /Email non valida/);
  assert.match(validateWaitlist(client({ phone: "333 123 4567", privacyAccepted: false })), /privacy/);
  assert.match(validateWaitlist(client({ phone: "333 123 4567", privacyAccepted: "true" })), /privacy/);
  assert.match(validateWaitlist(client({ phone: "333 123 4567", firstName: "" })), /nome/);
  assert.match(validateWaitlist(client({ phone: "333 123 4567", city: "" })), /città/);
});

test("«Email o telefono» becomes an email or a phone number, never both, never anything else", () => {
  assert.deepEqual(splitContact(" mario@example.com "), { email: "mario@example.com", phone: "" });
  assert.deepEqual(splitContact("333 123 4567"), { email: "", phone: "333 123 4567" });
  assert.deepEqual(splitContact("011 1234567"), { email: "", phone: "011 1234567" });
  for (const raw of ["", "mario", "mario@", "12345", "+44 7911 123456", "333 123 456 789 01"]) {
    assert.equal(splitContact(raw), null, raw);
  }
});

test("Italian numbers: mobile and landline, with or without the country code", () => {
  for (const ok of ["333 1234567", "333-123-4567", "+39 333 123 4567", "0039 333 1234567", "(011) 123 4567", "011 1234567", "02 12345678"]) {
    assert.ok(isItalianPhone(ok), ok);
  }
  for (const no of ["123 4567890", "+1 202 555 0123", "+39 133 123 4567", "3331234567890123", "abc"]) {
    assert.ok(!isItalianPhone(no), no);
  }
});

test("«Nome e cognome» splits on the first space, and the surname may be empty", () => {
  assert.deepEqual(splitName("Mario Rossi"), { firstName: "Mario", lastName: "Rossi" });
  assert.deepEqual(splitName("  Anna  Maria De Luca "), { firstName: "Anna", lastName: "Maria De Luca" });
  assert.deepEqual(splitName("Mario"), { firstName: "Mario", lastName: "" });
  assert.deepEqual(splitName("  "), { firstName: "", lastName: "" });
});
