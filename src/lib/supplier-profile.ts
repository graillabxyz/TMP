import "server-only";

import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export type OwnedSupplierProfile = {
  id: string;
  slug: string;
  companyName: string;
  categoryId: string;
  city: string;
  country: string;
  summary: string;
  description: string;
  yearFounded: number;
  employees: string;
  exportMarkets: string[];
  tags: string[];
  imageUrl: string;
};

type OwnedSupplierRow = {
  id: string;
  slug: string;
  company_name: string;
  category_id: string | null;
  city: string;
  country: string;
  summary: string;
  description: string;
  year_founded: number;
  employees: string;
  export_markets: string[];
  tags: string[];
  image_url: string;
};

export async function getOwnedSupplierProfile(
  userId: string,
): Promise<OwnedSupplierProfile | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("suppliers")
    .select(
      "id, slug, company_name, category_id, city, country, summary, description, year_founded, employees, export_markets, tags, image_url",
    )
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Unable to load owned supplier profile", error.message);
    return null;
  }
  const supplier = data as unknown as OwnedSupplierRow | null;
  if (!supplier) return null;

  return {
    id: supplier.id,
    slug: supplier.slug,
    companyName: supplier.company_name,
    categoryId: supplier.category_id ?? "",
    city: supplier.city,
    country: supplier.country,
    summary: supplier.summary,
    description: supplier.description,
    yearFounded: supplier.year_founded,
    employees: supplier.employees,
    exportMarkets: supplier.export_markets,
    tags: supplier.tags,
    imageUrl: supplier.image_url,
  };
}
