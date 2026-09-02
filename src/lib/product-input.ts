export const PRODUCT_CURRENCIES = ["EUR", "USD", "GBP", "TRY"] as const;
export const PRODUCT_STATUSES = ["draft", "published"] as const;

export type ProductField =
  | "title"
  | "category_id"
  | "description"
  | "moq"
  | "lead_time"
  | "price_min"
  | "price_max"
  | "currency"
  | "status"
  | "images";

export type ProductErrorCode =
  | "required"
  | "titleLength"
  | "descriptionLength"
  | "integer"
  | "number"
  | "priceRange"
  | "invalidOption";

export type ProductInputValues = {
  title: string;
  categoryId: string;
  description: string;
  moq: number | null;
  leadTimeDays: number | null;
  priceMin: number | null;
  priceMax: number | null;
  currency: (typeof PRODUCT_CURRENCIES)[number];
  status: (typeof PRODUCT_STATUSES)[number];
};

export type ProductFieldErrors = Partial<
  Record<
    ProductField,
    ProductErrorCode | "imageRequired" | "imageInvalid" | "imageCount"
  >
>;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function parseOptionalNumber(
  formData: FormData,
  key: ProductField,
  errors: ProductFieldErrors,
  options: { integer?: boolean; min: number; max: number },
) {
  const raw = getString(formData, key);

  if (!raw) {
    return null;
  }

  const value = Number(raw);
  if (
    !Number.isFinite(value) ||
    value < options.min ||
    value > options.max ||
    (options.integer && !Number.isInteger(value))
  ) {
    errors[key] = options.integer ? "integer" : "number";
    return null;
  }

  return value;
}

export function validateProductInput(formData: FormData): {
  values: ProductInputValues | null;
  errors: ProductFieldErrors;
} {
  const errors: ProductFieldErrors = {};
  const title = getString(formData, "title");
  const categoryId = getString(formData, "category_id");
  const description = getString(formData, "description");
  const currency = getString(formData, "currency") || "EUR";
  const status = getString(formData, "status") || "draft";

  if (title.length < 3 || title.length > 160) {
    errors.title = title ? "titleLength" : "required";
  }
  if (!uuidPattern.test(categoryId)) {
    errors.category_id = "required";
  }
  if (description.length < 20 || description.length > 5000) {
    errors.description = description ? "descriptionLength" : "required";
  }
  const moq = parseOptionalNumber(formData, "moq", errors, {
    integer: true,
    min: 1,
    max: 1_000_000_000,
  });
  const leadTimeDays = parseOptionalNumber(formData, "lead_time", errors, {
    integer: true,
    min: 1,
    max: 3650,
  });
  const priceMin = parseOptionalNumber(formData, "price_min", errors, {
    min: 0,
    max: 1_000_000_000_000,
  });
  const priceMax = parseOptionalNumber(formData, "price_max", errors, {
    min: 0,
    max: 1_000_000_000_000,
  });

  if (priceMin !== null && priceMax !== null && priceMin > priceMax) {
    errors.price_max = "priceRange";
  }
  if (
    !PRODUCT_CURRENCIES.includes(currency as ProductInputValues["currency"])
  ) {
    errors.currency = "invalidOption";
  }
  if (!PRODUCT_STATUSES.includes(status as ProductInputValues["status"])) {
    errors.status = "invalidOption";
  }

  if (Object.keys(errors).length > 0) {
    return { values: null, errors };
  }

  return {
    errors,
    values: {
      title,
      categoryId,
      description,
      moq,
      leadTimeDays,
      priceMin,
      priceMax,
      currency: currency as ProductInputValues["currency"],
      status: status as ProductInputValues["status"],
    },
  };
}

export function isUuid(value: string) {
  return uuidPattern.test(value);
}
