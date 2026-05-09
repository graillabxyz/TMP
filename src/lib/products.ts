import { defaultLocale, localizedValue, type Locale } from "@/lib/i18n";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
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
    company_name: string;
    company_name_fr: string | null;
    slug: string;
    verified: boolean;
    verification_status: "none" | "pending" | "verified" | "rejected";
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
  createdAt: string;
};

function fallbackImage(images: string[]) {
  return images.length > 0 ? images : ["/brand/tmp-logo.webp"];
}

function normalizeProduct(
  product: PublicProductRow,
  locale: Locale,
): MarketplaceProduct {
  return {
    id: product.id,
    slug: product.slug,
    title: localizedValue(locale, product.title, product.title_fr),
    description: localizedValue(
      locale,
      product.description,
      product.description_fr,
    ),
    category: product.category
      ? localizedValue(locale, product.category.name, product.category.name_fr)
      : "Uncategorized",
    categorySlug: product.category?.slug ?? "",
    supplierName: product.supplier
      ? localizedValue(
          locale,
          product.supplier.company_name,
          product.supplier.company_name_fr,
        )
      : "Supplier",
    supplierSlug: product.supplier?.slug ?? "",
    supplierVerified:
      product.supplier?.verified ||
      product.supplier?.verification_status === "verified",
    priceMin: product.price_min,
    priceMax: product.price_max,
    currency: product.currency,
    moq: product.moq,
    leadTime: product.lead_time,
    images: fallbackImage(product.images),
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
        supplier:suppliers(company_name, company_name_fr, slug, verified, verification_status)
      `,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const cleanQuery = query?.trim().replaceAll(",", " ");

  if (cleanQuery) {
    request = request.or(
      `title.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%`,
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

  if (supplierError || !supplier) {
    if (supplierError) {
      console.error("Unable to load supplier workspace", supplierError.message);
    }

    return {
      state: "missing-supplier" as const,
      supplier: null,
      products: [] as DashboardProduct[],
    };
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
        created_at,
        category:categories(name, name_fr)
      `,
    )
    .eq("supplier_id", supplier.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load supplier products", error.message);
  }

  return {
    state: "ready" as const,
    supplier: {
      id: supplier.id,
      name: localizedValue(
        locale,
        supplier.company_name,
        supplier.company_name_fr,
      ),
      slug: supplier.slug,
    },
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
        created_at: string;
        category: { name: string; name_fr: string | null } | null;
      }>
    ).map((product) => ({
      id: product.id,
      slug: product.slug,
      title: localizedValue(locale, product.title, product.title_fr),
      status: product.status,
      categoryName: product.category
        ? localizedValue(
            locale,
            product.category.name,
            product.category.name_fr,
          )
        : "Uncategorized",
      moq: product.moq,
      priceMin: product.price_min,
      priceMax: product.price_max,
      currency: product.currency,
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

  const { data, error } = await supabase
    .from("supplier_products")
    .select("*")
    .eq("id", productId)
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
