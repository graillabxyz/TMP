import { defaultLocale, localizedValue, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { repairKnownSeedImages } from "@/lib/media-fallbacks";
import { hasActiveVerifiedBadge } from "@/lib/supplier-verification";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getCategoryOverride,
  getCategorySlugOverride,
  getProductOverride,
  getProductSlugOverride,
  getSupplierNameOverride,
  getSupplierSlugOverride,
} from "@/lib/translation-overrides";
import type { MarketplaceProduct } from "@/types";
import type { Database } from "@/types/database";

type ProductStatus = "draft" | "published" | "archived";

type PublicProductRow = {
  id: string;
  slug: string;
  title: string;
  title_fr: string | null;
  description: string;
  description_fr: string | null;
  price_min: number | null;
  price_max: number | null;
  currency: string;
  moq: number | null;
  lead_time: string | null;
  images: string[];
  status: ProductStatus;
  created_at: string;
  category: { name: string; name_fr: string | null; slug: string } | null;
  supplier: {
    id: string;
    company_name: string;
    company_name_fr: string | null;
    slug: string;
    verified: boolean;
    verification_status: "none" | "pending" | "verified" | "rejected";
    verification_subscription_status:
      | "inactive"
      | "active"
      | "past_due"
      | "canceled";
    verification_expires_at: string | null;
  } | null;
};

export type DashboardProduct = {
  id: string;
  title: string;
  slug: string;
  status: ProductStatus;
  categoryName: string;
  moq: number | null;
  priceMin: number | null;
  priceMax: number | null;
  currency: string;
  imageUrl: string | null;
  createdAt: string;
};

function fallbackImage(images: string[], productSlug: string) {
  return images.length > 0
    ? repairKnownSeedImages(images, productSlug)
    : ["/brand/tmp-logo.webp"];
}

function getSafeSearchPattern(query?: string) {
  const cleanQuery = query
    ?.trim()
    .replace(/[,%_.*()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 80);

  return cleanQuery ? `%${cleanQuery}%` : "";
}

function normalizeProduct(
  product: PublicProductRow,
  locale: Locale,
): MarketplaceProduct {
  const t = getDictionary(locale);
  const productOverride = getProductOverride(locale, product.slug);
  const categoryOverride = getCategoryOverride(locale, product.category?.slug);

  return {
    id: product.id,
    slug: getProductSlugOverride(product.slug),
    title:
      productOverride?.title ??
      localizedValue(locale, product.title, product.title_fr),
    description:
      productOverride?.description ??
      localizedValue(locale, product.description, product.description_fr),
    category: product.category
      ? (productOverride?.category ??
        categoryOverride?.name ??
        localizedValue(locale, product.category.name, product.category.name_fr))
      : t.common.uncategorized,
    categorySlug: getCategorySlugOverride(product.category?.slug),
    supplierName: product.supplier
      ? (getSupplierNameOverride(locale, product.supplier.slug) ??
        localizedValue(
          locale,
          product.supplier.company_name,
          product.supplier.company_name_fr,
        ))
      : t.common.supplier,
    supplierId: product.supplier?.id ?? null,
    supplierSlug: getSupplierSlugOverride(product.supplier?.slug),
    supplierVerified: product.supplier
      ? hasActiveVerifiedBadge({
          verificationStatus: product.supplier.verification_status,
          subscriptionStatus: product.supplier.verification_subscription_status,
          expiresAt: product.supplier.verification_expires_at,
        })
      : false,
    priceMin: product.price_min,
    priceMax: product.price_max,
    currency: product.currency,
    moq: product.moq,
    leadTime: product.lead_time,
    images: fallbackImage(product.images, product.slug),
    status: product.status,
    createdAt: product.created_at,
  };
}

export function formatPriceRange(
  product: Pick<MarketplaceProduct, "priceMin" | "priceMax" | "currency">,
  fallback = "Quote",
) {
  if (product.priceMin === null && product.priceMax === null) {
    return fallback;
  }

  const formatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency: product.currency,
    maximumFractionDigits: 0,
  });

  if (product.priceMin !== null && product.priceMax !== null) {
    return `${formatter.format(product.priceMin)}-${formatter.format(product.priceMax)}`;
  }

  return formatter.format(product.priceMin ?? product.priceMax ?? 0);
}

export async function getProducts({
  locale = defaultLocale,
  query,
  category,
  supplier,
}: {
  locale?: Locale;
  query?: string;
  category?: string;
  supplier?: string;
} = {}) {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return [];
  }

  let request = supabase
    .from("supplier_products")
    .select(
      `
        id,
        slug,
        title,
        title_fr,
        description,
        description_fr,
        price_min,
        price_max,
        currency,
        moq,
        lead_time,
        images,
        status,
        created_at,
        category:categories(name, name_fr, slug),
        supplier:suppliers(id, company_name, company_name_fr, slug, verified, verification_status, verification_subscription_status, verification_expires_at)
      `,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const searchPattern = getSafeSearchPattern(query);

  if (searchPattern) {
    request = request.or(
      `title.ilike.${searchPattern},description.ilike.${searchPattern}`,
    );
  }

  const { data, error } = await request;

  if (error || !data) {
    if (error) {
      console.error("Unable to load Supabase products", error.message);
    }

    return [];
  }

  return (data as unknown as PublicProductRow[])
    .map((product) => normalizeProduct(product, locale))
    .filter((product) => !category || product.categorySlug === category)
    .filter((product) => !supplier || product.supplierSlug === supplier);
}

export async function getProductBySlug(
  slug: string,
  locale: Locale = defaultLocale,
) {
  const products = await getProducts({ locale });

  return products.find((product) => product.slug === slug) ?? null;
}

export async function getRelatedProducts(
  product: MarketplaceProduct,
  locale: Locale = defaultLocale,
) {
  const products = await getProducts({
    locale,
    supplier: product.supplierSlug,
  });

  return products
    .filter((relatedProduct) => relatedProduct.id !== product.id)
    .slice(0, 3);
}

export async function getSupplierProductWorkspace(locale: Locale) {
  const t = getDictionary(locale);

  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;

  try {
    supabase = await createServerSupabaseClient();
  } catch (error) {
    console.error("Supabase server client is not configured", error);

    return {
      state: "unauthenticated" as const,
      supplier: null,
      products: [] as DashboardProduct[],
    };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      state: "unauthenticated" as const,
      supplier: null,
      products: [] as DashboardProduct[],
    };
  }

  const { data: supplierData, error: supplierError } = await supabase
    .from("suppliers")
    .select("id, company_name, company_name_fr, slug")
    .eq("owner_id", user.id)
    .maybeSingle();
  const supplier = supplierData as unknown as {
    id: string;
    company_name: string;
    company_name_fr: string | null;
    slug: string;
  } | null;

  if (supplierError) {
    console.error("Unable to load supplier workspace", supplierError.message);
  }

  const { data, error } = await supabase
    .from("supplier_products")
    .select(
      `
        id,
        slug,
        title,
        title_fr,
        status,
        moq,
        price_min,
        price_max,
        currency,
        images,
        created_at,
        category:categories(name, name_fr, slug)
      `,
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load supplier products", error.message);
  }

  return {
    state: "ready" as const,
    supplier: supplier
      ? {
          id: supplier.id,
          name: localizedValue(
            locale,
            supplier.company_name,
            supplier.company_name_fr,
          ),
          slug: supplier.slug,
        }
      : null,
    products: (
      (data ?? []) as unknown as Array<{
        id: string;
        slug: string;
        title: string;
        title_fr: string | null;
        status: ProductStatus;
        moq: number | null;
        price_min: number | null;
        price_max: number | null;
        currency: string;
        images: string[];
        created_at: string;
        category: { name: string; name_fr: string | null; slug: string } | null;
      }>
    ).map((product) => ({
      id: product.id,
      slug: product.slug,
      title:
        getProductOverride(locale, product.slug)?.title ??
        localizedValue(locale, product.title, product.title_fr),
      status: product.status,
      categoryName: product.category
        ? (getCategoryOverride(locale, product.category.slug)?.name ??
          localizedValue(
            locale,
            product.category.name,
            product.category.name_fr,
          ))
        : t.common.uncategorized,
      moq: product.moq,
      priceMin: product.price_min,
      priceMax: product.price_max,
      currency: product.currency,
      imageUrl: product.images[0] ?? null,
      createdAt: product.created_at,
    })),
  };
}

export async function getEditableProduct(productId: string) {
  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;

  try {
    supabase = await createServerSupabaseClient();
  } catch (error) {
    console.error("Supabase server client is not configured", error);

    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("supplier_products")
    .select("*")
    .eq("id", productId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load editable product", error.message);
  }

  return data;
}

export type ProductInsert =
  Database["public"]["Tables"]["supplier_products"]["Insert"];
export type ProductUpdate =
  Database["public"]["Tables"]["supplier_products"]["Update"];
