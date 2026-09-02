import assert from "node:assert/strict";
import test from "node:test";

import { validateProductInput } from "../src/lib/product-input.ts";

const categoryId = "a84cc4b1-1c3f-4c19-a087-4d4d4535305b";

function validProduct(overrides = {}) {
  const values = {
    title: "Heavyweight organic cotton hoodie",
    category_id: categoryId,
    description:
      "A 320 gsm organic cotton hoodie available in custom colors and sizes.",
    moq: "100",
    lead_time: "21",
    price_min: "18.50",
    price_max: "24.00",
    currency: "EUR",
    status: "published",
    ...overrides,
  };
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

test("accepts a complete product listing", () => {
  const result = validateProductInput(validProduct());

  assert.deepEqual(result.errors, {});
  assert.equal(result.values?.moq, 100);
  assert.equal(result.values?.leadTimeDays, 21);
  assert.equal(result.values?.priceMin, 18.5);
  assert.equal(result.values?.status, "published");
});

test("allows optional commercial terms to be omitted", () => {
  const result = validateProductInput(
    validProduct({ moq: "", lead_time: "", price_min: "", price_max: "" }),
  );

  assert.equal(result.values?.moq, null);
  assert.equal(result.values?.leadTimeDays, null);
  assert.equal(result.values?.priceMin, null);
  assert.equal(result.values?.priceMax, null);
});

test("returns precise errors for vague or malformed listing details", () => {
  const result = validateProductInput(
    validProduct({
      title: "x",
      category_id: "not-a-category",
      description: "Too short",
      moq: "1.5",
      lead_time: "3-4 weeks",
      price_min: "30",
      price_max: "20",
      currency: "BTC",
    }),
  );

  assert.deepEqual(result.errors, {
    title: "titleLength",
    category_id: "required",
    description: "descriptionLength",
    moq: "integer",
    lead_time: "integer",
    price_max: "priceRange",
    currency: "invalidOption",
  });
  assert.equal(result.values, null);
});

test("rejects forged product status values", () => {
  const result = validateProductInput(validProduct({ status: "featured" }));

  assert.equal(result.errors.status, "invalidOption");
  assert.equal(result.values, null);
});
