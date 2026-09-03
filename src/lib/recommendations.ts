import type { MarketplaceProduct } from "@/types";

export type RecommendationSignal = {
  kind: "search" | "product_view" | "rfq";
  createdAt: string;
  query?: string | null;
  categorySlug?: string | null;
  productId?: string | null;
  supplierId?: string | null;
};

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function queryMatchesProduct(query: string, product: MarketplaceProduct) {
  const terms = normalize(query)
    .split(" ")
    .filter((term) => term.length >= 2);

  if (terms.length === 0) {
    return false;
  }

  const productText = normalize(
    [
      product.title,
      product.description,
      product.category,
      product.categorySlug,
      product.supplierName,
    ].join(" "),
  );

  return terms.some((term) => productText.includes(term));
}

function recencyWeight(createdAt: string, now: number) {
  const timestamp = Date.parse(createdAt);

  if (!Number.isFinite(timestamp)) {
    return 0.25;
  }

  const ageInDays = Math.max(0, now - timestamp) / 86_400_000;

  return Math.max(0.25, 1 / (1 + ageInDays / 30));
}

function scoreSignal(
  product: MarketplaceProduct,
  signal: RecommendationSignal,
) {
  const productMatch = signal.productId === product.id;
  const supplierMatch =
    Boolean(signal.supplierId) && signal.supplierId === product.supplierId;
  const categoryMatch =
    Boolean(signal.categorySlug) &&
    signal.categorySlug === product.categorySlug;
  const queryMatch = Boolean(
    signal.query && queryMatchesProduct(signal.query, product),
  );

  if (signal.kind === "rfq") {
    return (
      (productMatch ? 24 : 0) +
      (supplierMatch ? 9 : 0) +
      (categoryMatch ? 11 : 0) +
      (queryMatch ? 6 : 0)
    );
  }

  if (signal.kind === "product_view") {
    return (
      (productMatch ? 12 : 0) +
      (supplierMatch ? 4 : 0) +
      (categoryMatch ? 6 : 0)
    );
  }

  return (categoryMatch ? 7 : 0) + (queryMatch ? 8 : 0);
}

export function rankRecommendedProducts(
  products: MarketplaceProduct[],
  signals: RecommendationSignal[],
  now = Date.now(),
) {
  return products
    .map((product, index) => ({
      product,
      index,
      score: signals.reduce(
        (total, signal) =>
          total +
          scoreSignal(product, signal) * recencyWeight(signal.createdAt, now),
        0,
      ),
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ product }) => product);
}
