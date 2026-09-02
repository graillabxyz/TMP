import assert from "node:assert/strict";
import test from "node:test";

import { normalizeSupplierCountry } from "../src/lib/country.ts";
import { validateSupplierProfileInput } from "../src/lib/supplier-profile-input.ts";

const categoryId = "a84cc4b1-1c3f-4c19-a087-4d4d4535305b";

function profileForm(overrides = {}) {
  const values = {
    company_name: "Anatolia Components",
    category_id: categoryId,
    city: "Bursa",
    summary: "Precision components for export-focused industrial buyers.",
    description:
      "We manufacture CNC and sheet metal components for European machinery buyers with documented quality controls.",
    year_founded: "2012",
    employees: "51-200",
    export_markets: "Germany, France, Germany",
    tags: "CNC, Sheet metal, ISO 9001",
    ...overrides,
  };
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

test("accepts and normalizes structured supplier profile details", () => {
  const result = validateSupplierProfileInput(profileForm());

  assert.equal(result.error, null);
  assert.equal(result.values?.yearFounded, 2012);
  assert.deepEqual(result.values?.exportMarkets, ["Germany", "France"]);
  assert.deepEqual(result.values?.tags, ["CNC", "Sheet metal", "ISO 9001"]);
});

test("rejects incomplete or forged supplier profile values", () => {
  const result = validateSupplierProfileInput(
    profileForm({
      category_id: "not-a-category",
      description: "Too short",
      employees: "10000+",
      year_founded: "2200",
    }),
  );

  assert.equal(result.error, "invalid");
  assert.equal(result.values, null);
});

test("standardizes common Turkish country spellings", () => {
  for (const country of [
    "Turkey",
    "Turkiye",
    "Türkiye",
    "TURKIYE",
    " türkiye ",
  ]) {
    assert.equal(normalizeSupplierCountry(country), "Türkiye");
  }
  assert.equal(normalizeSupplierCountry("France"), "France");
});
