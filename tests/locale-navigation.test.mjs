import assert from "node:assert/strict";
import test from "node:test";

import { getLocaleHref } from "../src/lib/locale-navigation.ts";

test("adds and replaces locale prefixes while preserving query parameters", () => {
  const query = new URLSearchParams("q=hoodie&category=packaging");

  assert.equal(
    getLocaleHref("/products", query, "fr"),
    "/fr/products?q=hoodie&category=packaging",
  );
  assert.equal(
    getLocaleHref("/fr/products", query, "tr"),
    "/tr/products?q=hoodie&category=packaging",
  );
  assert.equal(
    getLocaleHref("/tr/products", query, "en"),
    "/products?q=hoodie&category=packaging",
  );
});

test("handles localized home routes without adding a trailing slash", () => {
  const query = new URLSearchParams();

  assert.equal(getLocaleHref("/", query, "tr"), "/tr");
  assert.equal(getLocaleHref("/tr", query, "fr"), "/fr");
  assert.equal(getLocaleHref("/fr", query, "en"), "/");
});
