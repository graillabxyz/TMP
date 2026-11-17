import { getDictionary } from "@/lib/dictionary";
import { cache } from "react";
import { normalizeSupplierCountry } from "@/lib/country";
import {
  localizedArray,
  localizedValue,
  type Locale,
  defaultLocale,
} from "@/lib/i18n";
import { hasActiveVerifiedBadge } from "@/lib/supplier-verification";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import {
  getCategoryOverride,
  getCategorySlugOverride,
} from "@/lib/translation-overrides";
import type { Category, ProductPreview, Supplier } from "@/types";

type CategoryRow = {
  id: string;
  name: string;
  name_fr: string | null;
  slug: string;
  description: string;
  description_fr: string | null;
  supplier_count?: number;
};

type SupplierProductRow = {
  title: string;
  title_fr: string | null;
  slug: string | null;
  moq: number | null;
  images: string[];
  category: { name: string; name_fr: string | null; slug: string } | null;
};

type SupplierRow = {
  slug: string;
  company_name: string;
  company_name_fr: string | null;
  city: string;
  country: string;
  summary: string;
  summary_fr: string | null;
  description: string;
  description_fr: string | null;
  verified: boolean;
  rfq_count: number;
  year_founded: number | null;
  employees: string;
  export_markets: string[];
  moq: string;
  response_time: string;
  image_url: string;
  tags: string[];
  tags_fr: string[];
  certifications: string[];
  certifications_fr: string[];
  verification_status: "none" | "pending" | "verified" | "rejected";
  verification_subscription_status:
    | "inactive"
    | "active"
    | "past_due"
    | "canceled";
  complimentary_premium: boolean;
  verification_expires_at: string | null;
  category:
    | { name: string; name_fr: string | null; slug: string }
    | { name: string; name_fr: string | null; slug: string }[]
    | null;
  products: SupplierProductRow[] | null;
};

function normalizeCategory(row: CategoryRow, locale: Locale): Category {
  const override = getCategoryOverride(locale, row.slug);

  return {
    id: row.id,
    name: override?.name ?? localizedValue(locale, row.name, row.name_fr),
    slug: getCategorySlugOverride(row.slug),
    description:
      override?.description ??
      localizedValue(locale, row.description, row.description_fr),
    supplierCount: row.supplier_count ?? 0,
  };
}

function normalizeProduct(
  row: SupplierProductRow,
  locale: Locale,
): ProductPreview {
  const t = getDictionary(locale);
  const categoryOverride = getCategoryOverride(locale, row.category?.slug);

  return {
    name: localizedValue(locale, row.title, row.title_fr),
    category: row.category
      ? (categoryOverride?.name ??
        localizedValue(locale, row.category.name, row.category.name_fr))
      : t.common.product,
    moq: row.moq ? `${row.moq} ${t.common.units}` : t.common.onRequest,
    image: row.images[0] ?? "/brand/tmp-logo.webp",
  };
}

function getCategoryName(
  locale: Locale,
  category: SupplierRow["category"],
  fallback = getDictionary(locale).common.generalSourcing,
) {
  if (Array.isArray(category)) {
    const firstCategory = category[0];

    return firstCategory
      ? (getCategoryOverride(locale, firstCategory.slug)?.name ??
          localizedValue(locale, firstCategory.name, firstCategory.name_fr))
      : fallback;
  }

  return category
    ? (getCategoryOverride(locale, category.slug)?.name ??
        localizedValue(locale, category.name, category.name_fr))
    : fallback;
}

function normalizeSupplier(row: SupplierRow, locale: Locale): Supplier {
  const supplier = {
    slug: row.slug,
    name: localizedValue(locale, row.company_name, row.company_name_fr),
    city: row.city,
    country: normalizeSupplierCountry(row.country),
    category: getCategoryName(locale, row.category),
    summary: localizedValue(locale, row.summary, row.summary_fr),
    description: localizedValue(locale, row.description, row.description_fr),
    verified: hasActiveVerifiedBadge({
      complimentaryPremium: row.complimentary_premium,
      verificationStatus: row.verification_status,
      subscriptionStatus: row.verification_subscription_status,
      expiresAt: row.verification_expires_at,
    }),
    rfqCount: row.rfq_count,
    yearFounded: row.year_founded ?? new Date().getFullYear(),
    employees: row.employees,
    exportMarkets: row.export_markets,
    moq: row.moq,
    responseTime: row.response_time,
    image: row.image_url,
    tags: localizedArray(locale, row.tags, row.tags_fr),
    certifications: localizedArray(
      locale,
      row.certifications,
      row.certifications_fr,
    ),
    products: (row.products ?? []).map((product) =>
      normalizeProduct(product, locale),
    ),
  };

  return supplier;
}

export const getCategories = cache(async function getCategories(
  locale: Locale = defaultLocale,
): Promise<Category[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    console.error("Supabase is not configured; categories are unavailable.");
    return [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, name_fr, slug, description, description_fr")
    .order("display_order", { ascending: true });

  if (error || !data?.length) {
    if (error) {
      console.error("Unable to load Supabase categories", error.message);
    }

    return [];
  }

  return data.map((category) => normalizeCategory(category, locale));
});

export const getSupplierOptions = cache(async function getSupplierOptions(
  locale: Locale = defaultLocale,
) {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    console.error(
      "Supabase is not configured; supplier options are unavailable.",
    );
    return [];
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select("slug, company_name, company_name_fr")
    .order("display_order", { ascending: true });

  if (error || !data) {
    if (error) {
      console.error("Unable to load Supabase supplier options", error.message);
    }

    return [];
  }

  return data.map((supplier) => ({
    slug: supplier.slug,
    name: localizedValue(
      locale,
      supplier.company_name,
      supplier.company_name_fr,
    ),
  }));
});

export const getSuppliers = cache(async function getSuppliers(
  locale: Locale = defaultLocale,
): Promise<Supplier[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    console.error("Supabase is not configured; suppliers are unavailable.");
    return [];
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select(
      `
        slug,
        company_name,
        company_name_fr,
        city,
        country,
        summary,
        summary_fr,
        description,
        description_fr,
        verified,
        rfq_count,
        year_founded,
        employees,
        export_markets,
        moq,
        response_time,
        image_url,
        tags,
        tags_fr,
        certifications,
        certifications_fr,
        verification_status,
        verification_subscription_status,
        complimentary_premium,
        verification_expires_at,
        category:categories(name, name_fr, slug),
        products:supplier_products(title, title_fr, slug, moq, images, category:categories(name, name_fr, slug))
      `,
    )
    .order("display_order", { ascending: true })
    .limit(3, { referencedTable: "supplier_products" });

  if (error || !data?.length) {
    if (error) {
      console.error("Unable to load Supabase suppliers", error.message);
    }

    return [];
  }

  return (data as unknown as SupplierRow[]).map((supplier) =>
    normalizeSupplier(supplier, locale),
  );
});

export const getFeaturedSuppliers = cache(async function getFeaturedSuppliers(
  locale: Locale = defaultLocale,
  limit = 3,
): Promise<Supplier[]> {
  const suppliers = await getSuppliers(locale);
  const eligibleSuppliers = suppliers.filter(
    (supplier) => supplier.products.length > 0,
  );

  if (eligibleSuppliers.length === 0) return [];

  return eligibleSuppliers
    .toSorted(
      (left, right) =>
        Number(right.verified) - Number(left.verified) ||
        right.rfqCount - left.rfqCount,
    )
    .slice(0, limit);
});

export async function getSupplierBySlug(
  slug: string,
  locale: Locale = defaultLocale,
) {
  const suppliers = await getSuppliers(locale);

  return suppliers.find((supplier) => supplier.slug === slug) ?? null;
}
