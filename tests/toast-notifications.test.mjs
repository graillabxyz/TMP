import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const transientNotificationFiles = [
  "../src/app/(auth)/forgot-password/page.tsx",
  "../src/app/(auth)/reset-password/page.tsx",
  "../src/app/(site)/rfq/page.tsx",
  "../src/app/dashboard/products/page.tsx",
  "../src/app/dashboard/profile/page.tsx",
  "../src/app/dashboard/settings/verification/page.tsx",
  "../src/components/auth/onboarding-auth-card.tsx",
  "../src/components/product-form.tsx",
  "../src/components/verification/billing-actions.tsx",
];

test("transient app notifications use the shared toast surface", async () => {
  for (const file of transientNotificationFiles) {
    const source = await readFile(new URL(file, import.meta.url), "utf8");

    assert.match(source, /<ToastNotice\b/, `Missing ToastNotice in ${file}`);
  }
});

test("the shared toast is fixed and cannot change page layout", async () => {
  const source = await readFile(
    new URL("../src/components/ui/toast-notice.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /pointer-events-none fixed right-3 top-3/);
  assert.match(source, /z-\[100\]/);
  assert.match(source, /max-w-sm/);
  assert.doesNotMatch(source, /\babsolute\b/);
});
