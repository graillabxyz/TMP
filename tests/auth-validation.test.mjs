import assert from "node:assert/strict";
import test from "node:test";

import {
  isValidEmail,
  isValidFullName,
  isValidPassword,
} from "../src/lib/auth-validation.ts";

test("accepts ordinary account input", () => {
  assert.equal(isValidEmail("buyer@example.com"), true);
  assert.equal(isValidFullName("A B"), true);
  assert.equal(isValidPassword("correct horse battery staple"), true);
});

test("rejects malformed and oversized email input", () => {
  assert.equal(isValidEmail("not-an-email"), false);
  assert.equal(isValidEmail("a@b"), false);
  assert.equal(isValidEmail(`a@${"b".repeat(250)}.com`), false);
});

test("enforces account field length boundaries", () => {
  assert.equal(isValidFullName("A"), false);
  assert.equal(isValidFullName("A".repeat(101)), false);
  assert.equal(isValidPassword("short"), false);
  assert.equal(isValidPassword("a".repeat(129)), false);
});
