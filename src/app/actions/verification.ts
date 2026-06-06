"use server";

import { redirect } from "next/navigation";

import { getDemoRole } from "@/lib/demo-session";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type VerificationDocumentInsert =
  Database["public"]["Tables"]["supplier_verification_documents"]["Insert"];
type VerificationDocumentUpdate =
  Database["public"]["Tables"]["supplier_verification_documents"]["Update"];
type SupplierUpdate = Database["public"]["Tables"]["suppliers"]["Update"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
type SupplierVerificationStatus =
  Database["public"]["Tables"]["suppliers"]["Row"]["verification_status"];
type MutationError = { message: string } | null;
type SupplierMutationTable = {
  update: (payload: SupplierUpdate) => {
    eq: (column: string, value: string) => Promise<{ error: MutationError }>;
  };
};
type ProfileMutationTable = {
  update: (payload: ProfileUpdate) => {
    eq: (column: string, value: string) => Promise<{ error: MutationError }>;
  };
};
type DocumentMutationTable = {
  upsert: (
    payload: VerificationDocumentInsert & VerificationDocumentUpdate,
  ) => Promise<{ error: MutationError }>;
};
type SupplierProfileRpcClient = {
  rpc: (
    functionName: "ensure_supplier_profile",
    args: { company: string | null },
  ) => Promise<{ error: MutationError }>;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getReturnPath(formData: FormData) {
  const value = getString(formData, "return_to");

  return value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/dashboard/settings/verification";
}

async function getSupplierId() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, supplierId: null, verificationStatus: null };
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select("id, verification_status")
    .eq("owner_id", user.id)
    .maybeSingle();
  const supplier = data as unknown as {
    id: string;
    verification_status: SupplierVerificationStatus;
  } | null;

  if (error) {
    console.error("Unable to load verification supplier", error.message);
  }

  return {
    supabase,
    supplierId: supplier?.id ?? null,
    verificationStatus: supplier?.verification_status ?? null,
  };
}

export async function startSupplierProfile(formData: FormData) {
  const returnPath = getReturnPath(formData);

  if ((await getDemoRole()) === "supplier") {
    redirect(`${returnPath}?status=supplier-started`);
  }

  const company = getString(formData, "company");

  if (!company) {
    redirect(`${returnPath}?status=missing-company`);
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(returnPath)}&status=missing`);
  }

  const profileMutations = supabase.from(
    "profiles",
  ) as unknown as ProfileMutationTable;
  const { error: profileError } = await profileMutations
    .update({ role: "supplier" })
    .eq("id", user.id);

  if (profileError) {
    console.error(
      "Unable to upgrade profile to supplier",
      profileError.message,
    );
    redirect(`${returnPath}?status=error`);
  }

  const supplierProfileRpc = supabase as unknown as SupplierProfileRpcClient;
  const { error: supplierError } = await supplierProfileRpc.rpc(
    "ensure_supplier_profile",
    { company },
  );

  if (supplierError) {
    console.error("Unable to start supplier profile", supplierError.message);
    redirect(`${returnPath}?status=error`);
  }

  redirect(`${returnPath}?status=supplier-started`);
}

export async function submitVerificationDocuments(formData: FormData) {
  if ((await getDemoRole()) === "supplier") {
    redirect("/dashboard/settings/verification?status=submitted");
  }

  const { supabase, supplierId, verificationStatus } = await getSupplierId();

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

  if (verificationStatus !== "verified") {
    const supplierMutations = supabase.from(
      "suppliers",
    ) as unknown as SupplierMutationTable;
    const { error: supplierError } = await supplierMutations
      .update({ verification_status: "pending" })
      .eq("id", supplierId);

    if (supplierError) {
      console.error(
        "Unable to mark verification pending",
        supplierError.message,
      );
      redirect("/dashboard/settings/verification?status=error");
    }
  }

  redirect("/dashboard/settings/verification?status=submitted");
}
