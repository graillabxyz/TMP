import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export type VerificationStatus = "none" | "pending" | "verified" | "rejected";
export type VerificationSubscriptionStatus =
  | "inactive"
  | "active"
  | "past_due"
  | "canceled";

export type VerificationWorkspace = {
  state: "unauthenticated" | "missing-supplier" | "ready";
  supplier: {
    id: string;
    name: string;
    verificationStatus: VerificationStatus;
    subscriptionStatus: VerificationSubscriptionStatus;
    verificationStartedAt: string | null;
    verificationExpiresAt: string | null;
  } | null;
  documents: {
    businessLicenseUrl: string | null;
    companyRegistrationUrl: string | null;
    certificationsUrl: string | null;
    notes: string | null;
    submittedAt: string | null;
  } | null;
};

type SupplierRow = {
  id: string;
  company_name: string;
  verification_status: VerificationStatus;
  verification_subscription_status: VerificationSubscriptionStatus;
  verification_started_at: string | null;
  verification_expires_at: string | null;
};

type DocumentRow = {
  business_license_url: string | null;
  company_registration_url: string | null;
  certifications_url: string | null;
  notes: string | null;
  submitted_at: string | null;
};

export async function getVerificationWorkspace(): Promise<VerificationWorkspace> {
  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;

  try {
    supabase = await createServerSupabaseClient();
  } catch (error) {
    console.error("Supabase server client is not configured", error);

    return { state: "unauthenticated", supplier: null, documents: null };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { state: "unauthenticated", supplier: null, documents: null };
  }

  const { data: supplierData, error: supplierError } = await supabase
    .from("suppliers")
    .select(
      "id, company_name, verification_status, verification_subscription_status, verification_started_at, verification_expires_at",
    )
    .eq("owner_id", user.id)
    .maybeSingle();
  const supplier = supplierData as unknown as SupplierRow | null;

  if (supplierError || !supplier) {
    if (supplierError) {
      console.error(
        "Unable to load verification supplier",
        supplierError.message,
      );
    }

    return { state: "missing-supplier", supplier: null, documents: null };
  }

  const { data: documentData, error: documentError } = await supabase
    .from("supplier_verification_documents")
    .select(
      "business_license_url, company_registration_url, certifications_url, notes, submitted_at",
    )
    .eq("supplier_id", supplier.id)
    .maybeSingle();
  const documents = documentData as unknown as DocumentRow | null;

  if (documentError) {
    console.error(
      "Unable to load verification documents",
      documentError.message,
    );
  }

  return {
    state: "ready",
    supplier: {
      id: supplier.id,
      name: supplier.company_name,
      verificationStatus: supplier.verification_status,
      subscriptionStatus: supplier.verification_subscription_status,
      verificationStartedAt: supplier.verification_started_at,
      verificationExpiresAt: supplier.verification_expires_at,
    },
    documents: documents
      ? {
          businessLicenseUrl: documents.business_license_url,
          companyRegistrationUrl: documents.company_registration_url,
          certificationsUrl: documents.certifications_url,
          notes: documents.notes,
          submittedAt: documents.submitted_at,
        }
      : null,
  };
}
