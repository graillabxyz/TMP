"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getLocalizedPath, isLocale, type Locale } from "@/lib/i18n";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { validateSupplierProfileInput } from "@/lib/supplier-profile-input";
import type { Database } from "@/types/database";

type SupplierUpdate = Database["public"]["Tables"]["suppliers"]["Update"];
type MutationError = { message: string } | null;
type SupplierMutationTable = {
  update: (payload: SupplierUpdate) => {
    eq: (column: string, value: string) => Promise<{ error: MutationError }>;
  };
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateSupplierProfile(formData: FormData) {
  const rawLocale = getString(formData, "locale");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const profilePath = getLocalizedPath(locale, "/dashboard/profile/supplier");
  const parsed = validateSupplierProfileInput(formData);

  if (!parsed.values) redirect(`${profilePath}?status=invalid`);

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(profilePath)}`,
    );
  }

  const values = parsed.values;
  const payload: SupplierUpdate = {
    category_id: values.categoryId,
    company_name: values.companyName,
    name: values.companyName,
    city: values.city,
    country: "Türkiye",
    summary: values.summary,
    description: values.description,
    year_founded: values.yearFounded,
    employees: values.employees,
    export_markets: values.exportMarkets,
    tags: values.tags,
    updated_at: new Date().toISOString(),
  };
  const supplierMutations = supabase.from(
    "suppliers",
  ) as unknown as SupplierMutationTable;
  const { error } = await supplierMutations
    .update(payload)
    .eq("owner_id", user.id);

  if (error) {
    console.error("Unable to update supplier profile", error.message);
    redirect(`${profilePath}?status=error`);
  }

  revalidatePath("/");
  revalidatePath("/suppliers");
  revalidatePath("/suppliers/[slug]", "page");
  revalidatePath(profilePath);
  redirect(`${profilePath}?status=saved`);
}
