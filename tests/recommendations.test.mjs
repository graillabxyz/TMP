import assert from "node:assert/strict";
import test from "node:test";

import { rankRecommendedProducts } from "../src/lib/recommendations.ts";

const now = Date.parse("2026-09-03T00:00:00Z");

function product(overrides) {
  return {
    id: crypto.randomUUID(),
    slug: "marketplace-product",
    title: "Marketplace product",
    description: "Export-ready marketplace listing",
    category: "Packaging",
    categorySlug: "packaging",
    supplierName: "Supplier",
    supplierId: crypto.randomUUID(),
    supplierSlug: "supplier",
    supplierVerified: false,
    priceMin: null,
    priceMax: null,
    currency: "EUR",
    moq: null,
    leadTimeDays: null,
    images: ["/brand/tmp-logo.webp"],
    status: "published",
    createdAt: "2026-09-01T00:00:00Z",
    ...overrides,
  };
}

test("an RFQ for a product is the strongest recommendation signal", () => {
  const fallback = product({ id: crypto.randomUUID(), title: "First item" });
  const requested = product({
    id: crypto.randomUUID(),
    title: "Organic cotton hoodie",
    category: "Textiles & Apparel",
    categorySlug: "textiles-apparel",
  });

  const ranked = rankRecommendedProducts(
    [fallback, requested],
    [
      {
        kind: "rfq",
        productId: requested.id,
        createdAt: "2026-09-02T00:00:00Z",
      },
    ],
    now,
  );

  assert.equal(ranked[0].id, requested.id);
});

test("search terms and category filters rank matching listings first", () => {
  const packaging = product({ title: "Rigid cosmetics box" });
  const machinery = product({
    title: "CNC aluminum enclosure",
    description: "Precision machined industrial component",
    category: "Machinery & Components",
    categorySlug: "machinery-components",
  });

  const ranked = rankRecommendedProducts(
    [packaging, machinery],
    [
      {
        kind: "search",
        query: "precision machinery",
        categorySlug: "machinery-components",
        createdAt: "2026-09-02T00:00:00Z",
      },
    ],
    now,
  );

  assert.equal(ranked[0].id, machinery.id);
});

test("recommendation matching preserves Turkish characters", () => {
  const packaging = product({ title: "Rigid cosmetics box" });
  const food = product({
    title: "Soğuk sıkım zeytinyağı",
    description: "İzmir'den organik gıda üretimi",
    category: "Gıda ve Malzemeler",
    categorySlug: "food-ingredients",
  });

  const ranked = rankRecommendedProducts(
    [packaging, food],
    [
      {
        kind: "search",
        query: "zeytinyağı",
        createdAt: "2026-09-02T00:00:00Z",
      },
    ],
    now,
  );

  assert.equal(ranked[0].id, food.id);
});

test("recent activity has more influence than stale activity", () => {
  const recent = product({ id: crypto.randomUUID(), title: "Recent view" });
  const stale = product({ id: crypto.randomUUID(), title: "Stale views" });

  const ranked = rankRecommendedProducts(
    [stale, recent],
    [
      {
        kind: "product_view",
        productId: stale.id,
        createdAt: "2025-01-01T00:00:00Z",
      },
      {
        kind: "product_view",
        productId: recent.id,
        createdAt: "2026-09-02T00:00:00Z",
      },
    ],
    now,
  );

  assert.equal(ranked[0].id, recent.id);
});
