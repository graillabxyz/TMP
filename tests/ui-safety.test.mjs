import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("shared actions accommodate translated labels without losing compact controls", async () => {
  const [buttonSource, searchSource] = await Promise.all([
    source("../src/components/ui/button.tsx"),
    source("../src/components/layout/header-search.tsx"),
  ]);

  assert.doesNotMatch(buttonSource, /whitespace-nowrap/);
  assert.match(buttonSource, /default: "min-h-11/);
  assert.match(searchSource, /h-8 min-h-0/);
  assert.match(searchSource, /size-10 min-h-0/);
});

test("destructive dialogs remain usable on short and mobile viewports", async () => {
  const dialogFiles = [
    "../src/components/product-archive-control.tsx",
    "../src/components/product-row-actions.tsx",
  ];

  for (const file of dialogFiles) {
    const dialogSource = await source(file);
    assert.match(dialogSource, /max-h-\[calc\(100dvh-/);
    assert.match(dialogSource, /overflow-y-auto overscroll-contain/);
    assert.match(dialogSource, /safe-area-inset-bottom/);
  }
});

test("navigation popups are trigger-anchored, width-safe, and keyboard navigable", async () => {
  const menuFiles = [
    "../src/components/product-row-actions.tsx",
    "../src/components/language-toggle.tsx",
    "../src/components/layout/categories-dropdown.tsx",
    "../src/components/layout/profile-dropdown.tsx",
  ];

  for (const file of menuFiles) {
    const menuSource = await source(file);
    assert.match(menuSource, /handleMenuKeyDown/);
    assert.match(menuSource, /calc\(100vw-/);
  }

  const contactSource = await source(
    "../src/components/layout/contact-dropdown.tsx",
  );
  assert.match(contactSource, /\.closest\("header"\)/);
  assert.match(contactSource, /Math\.max\(triggerBottom, headerBottom/);
  assert.match(contactSource, /fixed right-3 top-\[var/);
  assert.match(contactSource, /calc\(100vw-1\.5rem\)/);
});

test("the visual system respects reduced motion preferences", async () => {
  const globalStyles = await source("../src/app/globals.css");

  assert.match(globalStyles, /prefers-reduced-motion: reduce/);
  assert.match(globalStyles, /scroll-behavior: auto/);
});

test("standalone and media cards keep complete insets and anchored actions", async () => {
  const [cardSource, productCardSource, supplierCardSource, rfqSource] =
    await Promise.all([
      source("../src/components/ui/card.tsx"),
      source("../src/components/product-card.tsx"),
      source("../src/components/supplier-card.tsx"),
      source("../src/app/(site)/rfq/page.tsx"),
    ]);

  assert.match(cardSource, /cn\("p-5 sm:p-6", className\)/);
  assert.doesNotMatch(cardSource, /"p-5 pt-0 sm:p-6 sm:pt-0"/);
  for (const card of [productCardSource, supplierCardSource]) {
    assert.match(card, /<Card className="group flex h-full flex-col/);
    assert.match(
      card,
      /<CardContent className="flex flex-1 flex-col p-5 pb-4">/,
    );
    assert.match(card, /<CardFooter className="mt-auto block p-5 pt-0">/);
    assert.match(card, /line-clamp-2 min-h-11 rounded-sm/);
    assert.match(card, /headingLevel = "h3"/);
  }

  assert.match(rfqSource, /<Card className="self-start border-gold/);
  assert.doesNotMatch(
    rfqSource,
    /<CardContent[^>]*>[\s\S]{0,800}<div className="[^\"]*rounded-lg border border-gold/,
  );
});

test("directory cards and footer sections preserve heading hierarchy", async () => {
  const [productsPage, suppliersPage, footerSource] = await Promise.all([
    source("../src/app/(site)/products/page.tsx"),
    source("../src/app/(site)/suppliers/page.tsx"),
    source("../src/components/layout/site-footer.tsx"),
  ]);

  assert.match(productsPage, /<ProductCard[\s\S]{0,100}headingLevel="h2"/);
  assert.match(suppliersPage, /<SupplierCard[\s\S]{0,100}headingLevel="h2"/);
  assert.doesNotMatch(footerSource, /<h3/);
  assert.match(
    footerSource,
    /<h2 className="text-sm font-semibold text-white">/,
  );
});

test("featured suppliers require products and use a protected aggregate ranking", async () => {
  const [homeSource, marketplaceSource, migrationSource] = await Promise.all([
    source("../src/app/(site)/page.tsx"),
    source("../src/lib/marketplace.ts"),
    source(
      "../supabase/migrations/20260902094500_secure_feature_ranking_metrics.sql",
    ),
  ]);

  assert.match(homeSource, /getFeaturedSuppliers\(locale\)/);
  assert.match(marketplaceSource, /supplier\.products\.length > 0/);
  assert.match(marketplaceSource, /right\.rfqCount - left\.rfqCount/);
  assert.match(marketplaceSource, /Number\(right\.verified\)/);
  assert.match(migrationSource, /from public\.rfqs as rfq/);
  assert.match(migrationSource, /protect_supplier_rfq_count/);
  assert.match(migrationSource, /current_user in \('anon', 'authenticated'\)/);
});

test("homepage recommendations use private activity and RFQ signals", async () => {
  const [homeSource, productsSource, detailSource, migrationSource] =
    await Promise.all([
      source("../src/app/(site)/page.tsx"),
      source("../src/app/(site)/products/page.tsx"),
      source("../src/app/(site)/products/[slug]/page.tsx"),
      source(
        "../supabase/migrations/20260903090000_personalized_marketplace_recommendations.sql",
      ),
    ]);

  assert.match(homeSource, /getRecommendationSignals\(profile\.id\)/);
  assert.match(homeSource, /rankRecommendedProducts/);
  assert.match(productsSource, /kind="search"/);
  assert.match(detailSource, /kind="product_view"/);
  assert.match(migrationSource, /enable row level security/);
  assert.match(migrationSource, /user_id = \(select auth\.uid\(\)\)/);
  assert.match(migrationSource, /offset 200/);
});
