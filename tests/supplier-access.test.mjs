import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  isExpectedVerificationPrice,
  OWNER_CONTACT_EMAIL,
  VERIFIED_SUPPLIER_PLAN,
} from "../src/lib/marketplace-config.ts";
import { hasSupplierProductAccess } from "../src/lib/supplier-access.ts";
import { hasActiveVerifiedBadge } from "../src/lib/supplier-verification.ts";

test("only active, complimentary, or admin accounts can manage products", () => {
  const baseAccess = {
    supplierId: "8a56d8f4-58a0-4d79-96ec-bbe8f581a0ca",
    role: "supplier",
    complimentaryPremium: false,
  };

  assert.equal(
    hasSupplierProductAccess({ ...baseAccess, subscriptionStatus: "inactive" }),
    false,
  );
  assert.equal(
    hasSupplierProductAccess({ ...baseAccess, subscriptionStatus: "active" }),
    true,
  );
  assert.equal(
    hasSupplierProductAccess({
      ...baseAccess,
      subscriptionStatus: "inactive",
      complimentaryPremium: true,
    }),
    true,
  );
  assert.equal(
    hasSupplierProductAccess({
      ...baseAccess,
      role: "admin",
      supplierId: null,
      subscriptionStatus: null,
    }),
    false,
  );
  assert.equal(
    hasSupplierProductAccess({
      ...baseAccess,
      role: "admin",
      subscriptionStatus: null,
    }),
    true,
  );
});

test("complimentary premium still requires verification for the public badge", () => {
  assert.equal(
    hasActiveVerifiedBadge({
      complimentaryPremium: true,
      verificationStatus: "pending",
      subscriptionStatus: "inactive",
    }),
    false,
  );
  assert.equal(
    hasActiveVerifiedBadge({
      complimentaryPremium: true,
      verificationStatus: "verified",
      subscriptionStatus: "inactive",
    }),
    true,
  );
});

test("the configured verification plan is exactly EUR 50 monthly", () => {
  assert.equal(OWNER_CONTACT_EMAIL, "o.biyik@outlook.fr");
  assert.deepEqual(VERIFIED_SUPPLIER_PLAN, {
    amountCents: 5_000,
    currency: "eur",
    interval: "month",
  });
  assert.equal(
    isExpectedVerificationPrice({
      active: true,
      currency: "eur",
      unit_amount: 5_000,
      recurring: { interval: "month" },
    }),
    true,
  );
  assert.equal(
    isExpectedVerificationPrice({
      active: true,
      currency: "eur",
      unit_amount: 100,
      recurring: { interval: "month" },
    }),
    false,
  );
});

test("database policies enforce the paid product boundary", async () => {
  const migration = await readFile(
    new URL(
      "../supabase/migrations/20260920120000_paid_supplier_product_access.sql",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(migration, /Subscribed suppliers can insert owned products/);
  assert.match(
    migration,
    /verification_subscription_status = 'active'[\s\S]*complimentary_premium/,
  );
  assert.match(migration, /Subscribed suppliers can upload product assets/);
  assert.match(migration, /archive_owned_product/);
  assert.match(migration, /lower\(users\.email\) = 'o\.biyik@outlook\.fr'/);
});
