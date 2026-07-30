import assert from "node:assert/strict";
import test from "node:test";

import { hasActiveVerifiedBadge } from "../src/lib/supplier-verification.ts";

const now = Date.parse("2026-07-30T12:00:00.000Z");

test("requires both approved verification and active membership", () => {
  assert.equal(
    hasActiveVerifiedBadge(
      {
        verificationStatus: "verified",
        subscriptionStatus: "active",
      },
      now,
    ),
    true,
  );
  assert.equal(
    hasActiveVerifiedBadge(
      {
        verificationStatus: "verified",
        subscriptionStatus: "inactive",
      },
      now,
    ),
    false,
  );
  assert.equal(
    hasActiveVerifiedBadge(
      {
        verificationStatus: "pending",
        subscriptionStatus: "active",
      },
      now,
    ),
    false,
  );
});

test("removes an expired badge even when the last webhook still says active", () => {
  assert.equal(
    hasActiveVerifiedBadge(
      {
        verificationStatus: "verified",
        subscriptionStatus: "active",
        expiresAt: "2026-07-31T12:00:00.000Z",
      },
      now,
    ),
    true,
  );
  assert.equal(
    hasActiveVerifiedBadge(
      {
        verificationStatus: "verified",
        subscriptionStatus: "active",
        expiresAt: "2026-07-29T12:00:00.000Z",
      },
      now,
    ),
    false,
  );
  assert.equal(
    hasActiveVerifiedBadge(
      {
        verificationStatus: "verified",
        subscriptionStatus: "active",
        expiresAt: "not-a-date",
      },
      now,
    ),
    false,
  );
});
