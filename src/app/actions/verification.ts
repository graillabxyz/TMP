"use server";

import { redirect } from "next/navigation";

import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type VerificationDocumentInsert =
  Database["public"]["Tables"]["supplier_verification_documents"]["Insert"];
type VerificationDocumentUpdate =
  Database["public"]["Tables"]["supplier_verification_documents"]["Update"];
type SupplierUpdate = Database["public"]["Tables"]["suppliers"]["Update"];
type MutationError = { message: string } | null;
type SupplierMutationTable = {
  update: (payload: SupplierUpdate) => {
    eq: (column: string, value: string) => Promise<{ error: MutationError }>;
  };
};
type DocumentMutationTable = {
  upsert: (
    payload: VerificationDocumentInsert & VerificationDocumentUpdate,
  ) => Promise<{ error: MutationError }>;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

async function getSupplierId() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, supplierId: null };
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  const supplier = data as unknown as { id: string } | null;

  if (error) {
    console.error("Unable to load verification supplier", error.message);
  }

  return { supabase, supplierId: supplier?.id ?? null };
}

export async function submitVerificationDocuments(formData: FormData) {
  const { supabase, supplierId } = await getSupplierId();

  if (!supplierId) {
    redirect("/dashboard/settings/verification?status=supplier-missing");
  }

  const documentMutations = supabase.from(
    "supplier_verification_documents",
  ) as unknown as DocumentMutationTable;
  const { error: documentError } = await documentMutations.upsert({
    supplier_id: supplierId,
    business_license_url: getString(formData, "business_license_url") || null,
    company_registration_url:
      getString(formData, "company_registration_url") || null,
    certifications_url: getString(formData, "certifications_url") || null,
    notes: getString(formData, "notes") || null,
    submitted_at: new Date().toISOString(),
  });

  if (documentError) {
    console.error(
      "Unable to submit verification documents",
      documentError.message,
    );
    redirect("/dashboard/settings/verification?status=error");
  }

  const supplierMutations = supabase.from(
    "suppliers",
  ) as unknown as SupplierMutationTable;
  const { error: supplierError } = await supplierMutations
    .update({ verification_status: "pending" })
    .eq("id", supplierId);

  if (supplierError) {
    console.error("Unable to mark verification pending", supplierError.message);
    redirect("/dashboard/settings/verification?status=error");
  }

  redirect("/dashboard/settings/verification?status=submitted");
}
