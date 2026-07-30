"use server";

import { redirect } from "next/navigation";

import {
  createMediaPath,
  isOwnedPrivateMediaPath,
  MAX_VERIFICATION_DOCUMENT_BYTES,
  validateUpload,
  VERIFICATION_DOCUMENTS_BUCKET,
} from "@/lib/media";
import { getSafeInternalPath } from "@/lib/safe-redirect";
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
  return getSafeInternalPath(
    getString(formData, "return_to"),
    "/dashboard/settings/verification",
  );
}

async function getSupplierId() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      supplierId: null,
      userId: null,
      verificationStatus: null,
    };
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
    userId: user.id,
    verificationStatus: supplier?.verification_status ?? null,
  };
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);

  return value instanceof File && value.size > 0 ? value : null;
}

async function uploadVerificationFile({
  file,
  supplierId,
  supabase,
  userId,
}: {
  file: File;
  supplierId: string;
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
  userId: string;
}) {
  const detected = await validateUpload(file, {
    maxBytes: MAX_VERIFICATION_DOCUMENT_BYTES,
    allowPdf: true,
  });

  if (!detected) {
    return null;
  }

  const path = createMediaPath({
    userId,
    supplierId,
    area: "verification",
    extension: detected.extension,
  });
  const { error } = await supabase.storage
    .from(VERIFICATION_DOCUMENTS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: detected.contentType,
      upsert: false,
    });

  if (error) {
    console.error("Unable to upload verification document", error.message);
    return null;
  }

  return path;
}

async function removeVerificationFiles(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  paths: string[],
) {
  if (paths.length === 0) {
    return;
  }

  const { error } = await supabase.storage
    .from(VERIFICATION_DOCUMENTS_BUCKET)
    .remove(paths);

  if (error) {
    console.error("Unable to remove verification documents", error.message);
  }
}

export async function startSupplierProfile(formData: FormData) {
  const returnPath = getReturnPath(formData);

  const company = getString(formData, "company");

  if (company.length < 2 || company.length > 120) {
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
  const { supabase, supplierId, userId, verificationStatus } =
    await getSupplierId();

  if (!supplierId || !userId) {
    redirect("/dashboard/settings/verification?status=supplier-missing");
  }

  const notes = getString(formData, "notes");

  if (notes.length > 3000) {
    redirect("/dashboard/settings/verification?status=document");
  }

  const { data: existingData, error: existingError } = await supabase
    .from("supplier_verification_documents")
    .select(
      "business_license_path, company_registration_path, certifications_path",
    )
    .eq("supplier_id", supplierId)
    .maybeSingle();
  const existing = existingData as {
    business_license_path: string | null;
    company_registration_path: string | null;
    certifications_path: string | null;
  } | null;

  if (existingError) {
    console.error(
      "Unable to load existing verification documents",
      existingError.message,
    );
    redirect("/dashboard/settings/verification?status=error");
  }

  const businessLicenseFile = getFile(formData, "business_license");
  const companyRegistrationFile = getFile(formData, "company_registration");
  const certificationsFile = getFile(formData, "certifications");
  const uploadedPaths: string[] = [];

  const businessLicenseUpload = businessLicenseFile
    ? await uploadVerificationFile({
        file: businessLicenseFile,
        supplierId,
        supabase,
        userId,
      })
    : null;

  if (businessLicenseFile && !businessLicenseUpload) {
    redirect("/dashboard/settings/verification?status=document");
  }

  if (businessLicenseUpload) {
    uploadedPaths.push(businessLicenseUpload);
  }

  const companyRegistrationUpload = companyRegistrationFile
    ? await uploadVerificationFile({
        file: companyRegistrationFile,
        supplierId,
        supabase,
        userId,
      })
    : null;

  if (companyRegistrationFile && !companyRegistrationUpload) {
    await removeVerificationFiles(supabase, uploadedPaths);
    redirect("/dashboard/settings/verification?status=document");
  }

  if (companyRegistrationUpload) {
    uploadedPaths.push(companyRegistrationUpload);
  }

  const certificationsUpload = certificationsFile
    ? await uploadVerificationFile({
        file: certificationsFile,
        supplierId,
        supabase,
        userId,
      })
    : null;

  if (certificationsFile && !certificationsUpload) {
    await removeVerificationFiles(supabase, uploadedPaths);
    redirect("/dashboard/settings/verification?status=document");
  }

  if (certificationsUpload) {
    uploadedPaths.push(certificationsUpload);
  }

  const businessLicensePath =
    businessLicenseUpload ?? existing?.business_license_path ?? null;
  const companyRegistrationPath =
    companyRegistrationUpload ?? existing?.company_registration_path ?? null;
  const certificationsPath =
    certificationsUpload ?? existing?.certifications_path ?? null;

  if (!businessLicensePath || !companyRegistrationPath) {
    await removeVerificationFiles(supabase, uploadedPaths);
    redirect("/dashboard/settings/verification?status=document");
  }

  const documentMutations = supabase.from(
    "supplier_verification_documents",
  ) as unknown as DocumentMutationTable;
  const { error: documentError } = await documentMutations.upsert({
    supplier_id: supplierId,
    business_license_url: null,
    company_registration_url: null,
    certifications_url: null,
    business_license_path: businessLicensePath,
    company_registration_path: companyRegistrationPath,
    certifications_path: certificationsPath,
    notes: notes || null,
    submitted_at: new Date().toISOString(),
  });

  if (documentError) {
    await removeVerificationFiles(supabase, uploadedPaths);
    console.error(
      "Unable to submit verification documents",
      documentError.message,
    );
    redirect("/dashboard/settings/verification?status=error");
  }

  const replacedPaths = [
    businessLicenseUpload ? existing?.business_license_path : null,
    companyRegistrationUpload ? existing?.company_registration_path : null,
    certificationsUpload ? existing?.certifications_path : null,
  ].filter(
    (path): path is string =>
      Boolean(path) &&
      isOwnedPrivateMediaPath({
        path: path ?? null,
        userId,
        supplierId,
        area: "verification",
      }),
  );

  await removeVerificationFiles(supabase, replacedPaths);

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
