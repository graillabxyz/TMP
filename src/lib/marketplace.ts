import {
  categories as mockCategories,
  suppliers as mockSuppliers,
} from "@/lib/data";
import {
  localizedArray,
  localizedValue,
  type Locale,
  defaultLocale,
} from "@/lib/i18n";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Category, ProductPreview, Supplier } from "@/types";

type CategoryRow = {
  name: string;
  name_fr: string | null;
  slug: string;
  description: string;
  description_fr: string | null;
  supplier_count: number;
};

type SupplierProductRow = {
  title: string;
  title_fr: string | null;
  category: string;
  category_fr: string | null;
  moq: string;
  image_url: string;
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
  category:
    | { name: string; name_fr: string | null }
    | { name: string; name_fr: string | null }[]
    | null;
  products: SupplierProductRow[] | null;
};

function normalizeCategory(row: CategoryRow, locale: Locale): Category {
  return {
    name: localizedValue(locale, row.name, row.name_fr),
    slug: row.slug,
    description: localizedValue(locale, row.description, row.description_fr),
    supplierCount: row.supplier_count,
  };
}

function normalizeProduct(
  row: SupplierProductRow,
  locale: Locale,
): ProductPreview {
  return {
    name: localizedValue(locale, row.title, row.title_fr),
    category: localizedValue(locale, row.category, row.category_fr),
    moq: row.moq,
    image: row.image_url,
  };
}

function getCategoryName(
  locale: Locale,
  category: SupplierRow["category"],
  fallback = "General sourcing",
) {
  if (Array.isArray(category)) {
    const firstCategory = category[0];

    return firstCategory
      ? localizedValue(locale, firstCategory.name, firstCategory.name_fr)
      : fallback;
  }

  return category
    ? localizedValue(locale, category.name, category.name_fr)
    : fallback;
}

function normalizeSupplier(row: SupplierRow, locale: Locale): Supplier {
  return {
    slug: row.slug,
    name: localizedValue(locale, row.company_name, row.company_name_fr),
    city: row.city,
    country: row.country,
    category: getCategoryName(locale, row.category),
    summary: localizedValue(locale, row.summary, row.summary_fr),
    description: localizedValue(locale, row.description, row.description_fr),
    verified: row.verified,
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
}

export async function getCategories(
  locale: Locale = defaultLocale,
): Promise<Category[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return mockCategories;
  }

  const { data, error } = await supabase
    .from("supplier_categories")
    .select("name, name_fr, slug, description, description_fr, supplier_count")
    .eq("is_active", true)
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (error || !data?.length) {
    if (error) {
      console.error("Unable to load Supabase categories", error.message);
    }

    return mockCategories;
  }

  return data.map((category) => normalizeCategory(category, locale));
}

export async function getSuppliers(
  locale: Locale = defaultLocale,
): Promise<Supplier[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return mockSuppliers;
  }

  const { data, error } = await supabase
    .from("supplier_accounts")
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
        category:supplier_categories(name, name_fr),
        products:supplier_products(title, title_fr, category, category_fr, moq, image_url)
      `,
    )
    .in("verification_status", ["approved", "published"])
    .order("display_order", { ascending: true })
    .order("display_order", {
      ascending: true,
      referencedTable: "supplier_products",
    });

  if (error || !data?.length) {
    if (error) {
      console.error("Unable to load Supabase suppliers", error.message);
    }

    return mockSuppliers;
  }

  return (data as unknown as SupplierRow[]).map((supplier) =>
    normalizeSupplier(supplier, locale),
  );
}

export async function getSupplierBySlug(
  slug: string,
  locale: Locale = defaultLocale,
) {
  const suppliers = await getSuppliers(locale);

  return suppliers.find((supplier) => supplier.slug === slug) ?? null;
}
