export const PRODUCT_LOCAL_DRAFT_VERSION = 1;

export type ProductLocalDraft = {
  version: typeof PRODUCT_LOCAL_DRAFT_VERSION;
  savedAt: string;
  title: string;
  categoryId: string;
  description: string;
  moq: string;
  leadTime: string;
  priceMin: string;
  priceMax: string;
  currency: "EUR" | "USD" | "GBP" | "TRY";
  hadSelectedImages: boolean;
};

const currencies = new Set<ProductLocalDraft["currency"]>([
  "EUR",
  "USD",
  "GBP",
  "TRY",
]);

function isBoundedString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.length <= maxLength;
}

function normalizeLeadTimeDays(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^\d{1,4}$/.test(trimmed)) {
    const days = Number(trimmed);
    return days >= 1 && days <= 3650 ? String(days) : null;
  }

  const normalized = trimmed.toLocaleLowerCase();
  const match = normalized.match(/(\d+)(?:\s*-\s*(\d+))?/);
  if (!match) return null;
  const amount = Number(match[2] ?? match[1]);
  const multiplier = /(week|semaine|hafta)/.test(normalized)
    ? 7
    : /(month|mois|ay)/.test(normalized)
      ? 30
      : 1;
  const days = amount * multiplier;

  return days >= 1 && days <= 3650 ? String(days) : null;
}

export function parseProductLocalDraft(
  serialized: string | null,
): ProductLocalDraft | null {
  if (!serialized) return null;

  try {
    const value = JSON.parse(serialized) as Partial<ProductLocalDraft>;

    if (
      value.version !== PRODUCT_LOCAL_DRAFT_VERSION ||
      !isBoundedString(value.savedAt, 40) ||
      Number.isNaN(Date.parse(value.savedAt)) ||
      !isBoundedString(value.title, 160) ||
      !isBoundedString(value.categoryId, 80) ||
      !isBoundedString(value.description, 5000) ||
      !isBoundedString(value.moq, 24) ||
      normalizeLeadTimeDays(value.leadTime) === null ||
      !isBoundedString(value.priceMin, 32) ||
      !isBoundedString(value.priceMax, 32) ||
      typeof value.currency !== "string" ||
      !currencies.has(value.currency as ProductLocalDraft["currency"]) ||
      typeof value.hadSelectedImages !== "boolean"
    ) {
      return null;
    }

    return {
      ...(value as ProductLocalDraft),
      leadTime: normalizeLeadTimeDays(value.leadTime) ?? "",
    };
  } catch {
    return null;
  }
}

export function hasProductLocalDraftContent(draft: ProductLocalDraft) {
  return Boolean(
    draft.title ||
    draft.categoryId ||
    draft.description ||
    draft.moq ||
    draft.leadTime ||
    draft.priceMin ||
    draft.priceMax ||
    draft.hadSelectedImages,
  );
}
