import assert from "node:assert/strict";
import test from "node:test";

import { getSafeInternalPath } from "../src/lib/safe-redirect.ts";

test("preserves valid internal destinations", () => {
  assert.equal(getSafeInternalPath("/dashboard"), "/dashboard");
  assert.equal(
    getSafeInternalPath("/dashboard/profile?tab=billing#plan"),
    "/dashboard/profile?tab=billing#plan",
  );
});

test("rejects external and malformed destinations", () => {
  const invalidDestinations = [
    null,
    "",
    "dashboard",
    "https://example.com",
    "//example.com",
    "///example.com",
    "/\\example.com",
    "/%5c%5cexample.com",
  ];

  for (const destination of invalidDestinations) {
    assert.equal(getSafeInternalPath(destination), "/dashboard");
  }
});

test("uses the caller fallback for rejected destinations", () => {
  assert.equal(getSafeInternalPath("//example.com", "/"), "/");
});
