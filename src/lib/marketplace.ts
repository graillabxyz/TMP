import {
  categories as mockCategories,
  suppliers as mockSuppliers,
} from "@/lib/data";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Category, ProductPreview, Supplier } from "@/types";

type CategoryRow = {
  name: string;
  slug: string;
  description: string;
  supplier_count: number;
};

type SupplierProductRow = {
  name: string;
  category: string;
  moq: string;
  image_url: string;
};

type SupplierRow = {
  slug: string;
  name: string;
  city: string;
  country: string;
  summary: string;
  description: string;
  verified: boolean;
  year_founded: number;
  employees: string;
  export_markets: string[];
  moq: string;
  response_time: string;
  image_url: string;
  tags: string[];
  certifications: string[];
  category: { name: string } | { name: string }[] | null;
  products: SupplierProductRow[] | null;
};

function normalizeCategory(row: CategoryRow): Category {
  return {
    name: row.name,
    slug: row.slug,
    description: row.description,
    supplierCount: row.supplier_count,
  };
}

function normalizeProduct(row: SupplierProductRow): ProductPreview {
  return {
    name: row.name,
    category: row.category,
    moq: row.moq,
    image: row.image_url,
  };
}

function getCategoryName(
  category: SupplierRow["category"],
  fallback = "General sourcing",
) {
  if (Array.isArray(category)) {
    return category[0]?.name ?? fallback;
  }

  return category?.name ?? fallback;
}

function normalizeSupplier(row: SupplierRow): Supplier {
  return {
    slug: row.slug,
    name: row.name,
    city: row.city,
    country: row.country,
    category: getCategoryName(row.category),
    summary: row.summary,
    description: row.description,
    verified: row.verified,
    yearFounded: row.year_founded,
    employees: row.employees,
    exportMarkets: row.export_markets,
    moq: row.moq,
    responseTime: row.response_time,
    image: row.image_url,
    tags: row.tags,
    certifications: row.certifications,
    products: (row.products ?? []).map(normalizeProduct),
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return mockCategories;
  }

  const { data, error } = await supabase
    .from("supplier_categories")
    .select("name, slug, description, supplier_count")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error || !data?.length) {
    if (error) {
      console.error("Unable to load Supabase categories", error.message);
    }

    return mockCategories;
  }

  return data.map(normalizeCategory);
}

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return mockSuppliers;
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select(
      `
        slug,
        name,
        city,
        country,
        summary,
        description,
        verified,
        year_founded,
        employees,
        export_markets,
        moq,
        response_time,
        image_url,
        tags,
        certifications,
        category:supplier_categories(name),
        products:supplier_products(name, category, moq, image_url)
      `,
    )
    .eq("status", "published")
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

  return (data as unknown as SupplierRow[]).map(normalizeSupplier);
}

export async function getSupplierBySlug(slug: string) {
  const suppliers = await getSuppliers();

  return suppliers.find((supplier) => supplier.slug === slug) ?? null;
}
