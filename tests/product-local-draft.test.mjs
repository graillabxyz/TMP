import assert from "node:assert/strict";
import test from "node:test";

import {
  hasProductLocalDraftContent,
  parseProductLocalDraft,
  PRODUCT_LOCAL_DRAFT_VERSION,
} from "../src/lib/product-local-draft.ts";

const draft = {
  version: PRODUCT_LOCAL_DRAFT_VERSION,
  savedAt: "2026-09-01T04:45:00.000Z",
  title: "Organic cotton shirt",
  categoryId: "textiles",
  description: "A detailed organic cotton product description.",
  moq: "100",
  leadTime: "28",
  priceMin: "8.50",
  priceMax: "12.00",
  currency: "EUR",
  hadSelectedImages: true,
};

test("restores a valid local product draft", () => {
  assert.deepEqual(parseProductLocalDraft(JSON.stringify(draft)), draft);
  assert.equal(hasProductLocalDraftContent(draft), true);
});

test("converts an older text lead time into calendar days", () => {
  const restored = parseProductLocalDraft(
    JSON.stringify({ ...draft, leadTime: "2-4 weeks" }),
  );

  assert.equal(restored?.leadTime, "28");
});

test("rejects corrupt, unsupported, and oversized local drafts", () => {
  assert.equal(parseProductLocalDraft("not-json"), null);
  assert.equal(
    parseProductLocalDraft(JSON.stringify({ ...draft, version: 2 })),
    null,
  );
  assert.equal(
    parseProductLocalDraft(
      JSON.stringify({ ...draft, description: "x".repeat(5001) }),
    ),
    null,
  );
});

test("does not retain an untouched empty create form", () => {
  assert.equal(
    hasProductLocalDraftContent({
      ...draft,
      title: "",
      categoryId: "",
      description: "",
      moq: "",
      leadTime: "",
      priceMin: "",
      priceMax: "",
      hadSelectedImages: false,
    }),
    false,
  );
});
