import assert from "node:assert/strict";
import test from "node:test";

import {
  hasSpecificProductDetail,
  hasSpecificQuantity,
  isValidOptionalRfqSlug,
  isValidRfqEmail,
  isValidRfqUuid,
  isValidSingleLineRfqValue,
  sanitizeRfqAttachmentName,
} from "../src/lib/rfq-validation.ts";

test("validates RFQ identifiers, slugs, and authenticated email shapes", () => {
  assert.equal(isValidRfqUuid("1c6d8b9f-451e-4ae2-9fca-2cc996d5680a"), true);
  assert.equal(isValidRfqUuid("../../products"), false);
  assert.equal(isValidOptionalRfqSlug("organic-cotton-hoodie"), true);
  assert.equal(isValidOptionalRfqSlug("Organic Cotton"), false);
  assert.equal(isValidRfqEmail("buyer@example.com"), true);
  assert.equal(
    isValidRfqEmail("buyer@example.com\r\nBcc:x@example.com"),
    false,
  );
});

test("requires useful multilingual product and quantity detail", () => {
  assert.equal(hasSpecificProductDetail("hoodies", false), false);
  assert.equal(
    hasSpecificProductDetail(
      "Organik pamuk hoodie, 320gsm polar, OEKO-TEX, 500 adet",
      false,
    ),
    true,
  );
  assert.equal(
    hasSpecificProductDetail(
      "Boîte cosmétique FSC, 2 000 unités, pelliculage mat",
      false,
    ),
    true,
  );
  assert.equal(hasSpecificQuantity("many"), false);
  assert.equal(hasSpecificQuantity("500 adet"), true);
  assert.equal(hasSpecificQuantity("2 000 unités"), true);
});

test("rejects controls in single-line fields and normalizes attachment names", () => {
  assert.equal(
    isValidSingleLineRfqValue("Aylin Demir", { min: 2, max: 100 }),
    true,
  );
  assert.equal(
    isValidSingleLineRfqValue("Aylin\nBcc", { min: 2, max: 100 }),
    false,
  );
  assert.equal(
    sanitizeRfqAttachmentName("../../drawing\r\n.pdf", "pdf"),
    "drawing.pdf",
  );
  assert.equal(sanitizeRfqAttachmentName("\u0000", "png"), "attachment.png");
});
