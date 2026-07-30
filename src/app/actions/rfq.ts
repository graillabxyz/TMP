"use server";

import { redirect } from "next/navigation";

import {
  createRfqAttachmentPath,
  MAX_RFQ_ATTACHMENT_BYTES,
  RFQ_ATTACHMENTS_BUCKET,
  validateUpload,
} from "@/lib/media";
import { getLocalizedPath, isLocale, type Locale } from "@/lib/i18n";
import { sendRfqNotification } from "@/lib/rfq-notification";
import {
  hasSpecificProductDetail,
  hasSpecificQuantity,
  isValidOptionalRfqSlug,
  isValidRfqEmail,
  isValidRfqUuid,
  isValidSingleLineRfqValue,
  sanitizeRfqAttachmentName,
} from "@/lib/rfq-validation";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type RfqInsert = Database["public"]["Tables"]["rfqs"]["Insert"];
type RfqMutationTable = {
  insert: (
    payload: RfqInsert,
  ) => Promise<{ error: { message: string } | null }>;
};

type RfqContext = {
  categorySlug: string;
  inquiryType: "general" | "product";
  productId: string | null;
  productSlug: string | null;
  supplierId: string | null;
  supplierSlug: string | null;
};

type ProductContextRow = {
  id: string;
  slug: string;
  supplier_id: string;
  category: { slug: string } | null;
  supplier: { slug: string } | null;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getFormLocale(formData: FormData): Locale {
  const locale = getString(formData, "locale");

  return isLocale(locale) ? locale : "en";
}

async function resolveRfqContext({
  categorySlug,
  productSlug,
  supplierSlug,
  supabase,
}: {
  categorySlug: string;
  productSlug: string;
  supplierSlug: string;
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
}): Promise<RfqContext | null> {
  if (productSlug) {
    const { data, error } = await supabase
      .from("supplier_products")
      .select(
        "id, slug, supplier_id, category:categories(slug), supplier:suppliers(slug)",
      )
      .eq("slug", productSlug)
      .eq("status", "published")
      .maybeSingle();
    const product = data as unknown as ProductContextRow | null;

    if (error || !product?.category?.slug || !product.supplier?.slug) {
      if (error) {
        console.error("Unable to resolve RFQ product context", error.message);
      }

      return null;
    }

    return {
      categorySlug: product.category.slug,
      inquiryType: "product",
      productId: product.id,
      productSlug: product.slug,
      supplierId: product.supplier_id,
      supplierSlug: product.supplier.slug,
    };
  }

  let supplierId: string | null = null;
  let canonicalSupplierSlug: string | null = null;

  if (supplierSlug) {
    const { data, error } = await supabase
      .from("suppliers")
      .select("id, slug")
      .eq("slug", supplierSlug)
      .maybeSingle();
    const supplier = data as unknown as { id: string; slug: string } | null;

    if (error || !supplier) {
      if (error) {
        console.error("Unable to resolve RFQ supplier context", error.message);
      }

      return null;
    }

    supplierId = supplier.id;
    canonicalSupplierSlug = supplier.slug;
  }

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("slug")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (categoryError || !category) {
    if (categoryError) {
      console.error("Unable to resolve RFQ category", categoryError.message);
    }

    return null;
  }

  return {
    categorySlug,
    inquiryType: "general",
    productId: null,
    productSlug: null,
    supplierId,
    supplierSlug: canonicalSupplierSlug,
  };
}

export async function submitRfq(formData: FormData) {
  const locale = getFormLocale(formData);
  const rfqPath = getLocalizedPath(locale, "/rfq");
  const statusPath = (status: string) => `${rfqPath}?status=${status}`;

  if (getString(formData, "website")) {
    redirect(statusPath("success"));
  }

  const productRequest = getString(formData, "product_request");
  const requesterName = getString(formData, "requester_name");
  const requesterCompany = getString(formData, "requester_company");
  const categorySlug = getString(formData, "category_slug");
  const quantity = getString(formData, "quantity");
  const destinationCountry = getString(formData, "destination_country");
  const targetTimeline = getString(formData, "target_timeline");
  const notes = getString(formData, "notes");
  const productSlug = getString(formData, "product_slug");
  const supplierSlug = getString(formData, "supplier_slug");
  const requestToken = getString(formData, "request_token");

  if (
    !isValidRfqUuid(requestToken) ||
    !isValidSingleLineRfqValue(requesterName, { min: 2, max: 100 }) ||
    !isValidSingleLineRfqValue(requesterCompany, {
      min: 1,
      max: 120,
      optional: true,
    }) ||
    !isValidSingleLineRfqValue(productRequest, { min: 12, max: 180 }) ||
    !hasSpecificQuantity(quantity) ||
    !isValidSingleLineRfqValue(destinationCountry, { min: 2, max: 80 }) ||
    !isValidSingleLineRfqValue(targetTimeline, {
      min: 1,
      max: 120,
      optional: true,
    }) ||
    notes.length > 3000 ||
    !categorySlug ||
    !isValidOptionalRfqSlug(categorySlug) ||
    !isValidOptionalRfqSlug(productSlug) ||
    !isValidOptionalRfqSlug(supplierSlug)
  ) {
    redirect(statusPath("missing"));
  }

  if (!hasSpecificProductDetail(productRequest, Boolean(productSlug))) {
    redirect(statusPath("specific"));
  }

  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;

  try {
    supabase = await createServerSupabaseClient();
  } catch {
    redirect(statusPath("config"));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isValidRfqEmail(user.email.toLowerCase())) {
    const loginPath = getLocalizedPath(locale, "/login");
    redirect(
      `${loginPath}?status=auth-required&next=${encodeURIComponent(rfqPath)}`,
    );
  }

  const requesterEmail = user.email.toLowerCase();
  const { data: existingRequest, error: existingRequestError } = await supabase
    .from("rfqs")
    .select("id")
    .eq("submitter_id", user.id)
    .eq("request_token", requestToken)
    .maybeSingle();

  if (existingRequestError) {
    console.error(
      "Unable to check RFQ idempotency token",
      existingRequestError.message,
    );
    redirect(statusPath("error"));
  }

  if (existingRequest) {
    redirect(statusPath("success"));
  }

  const context = await resolveRfqContext({
    categorySlug,
    productSlug,
    supplierSlug,
    supabase,
  });

  if (!context) {
    redirect(statusPath("context"));
  }

  const attachment = formData.get("attachment");
  const attachmentFile =
    attachment instanceof File && attachment.size > 0 ? attachment : null;

  const rfqId = crypto.randomUUID();
  let attachmentPath: string | null = null;
  let attachmentContentType: string | null = null;
  let attachmentName: string | null = null;

  if (attachmentFile) {
    const detected = await validateUpload(attachmentFile, {
      maxBytes: MAX_RFQ_ATTACHMENT_BYTES,
      allowPdf: true,
    });

    if (!detected) {
      redirect(statusPath("attachment"));
    }

    attachmentContentType = detected.contentType;
    attachmentName = sanitizeRfqAttachmentName(
      attachmentFile.name,
      detected.extension,
    );
    attachmentPath = createRfqAttachmentPath({
      userId: user.id,
      rfqId,
      extension: detected.extension,
    });
    const { error: uploadError } = await supabase.storage
      .from(RFQ_ATTACHMENTS_BUCKET)
      .upload(attachmentPath, attachmentFile, {
        cacheControl: "3600",
        contentType: detected.contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Unable to upload RFQ attachment", uploadError.message);
      redirect(statusPath("attachment"));
    }
  }

  const payload = {
    id: rfqId,
    request_token: requestToken,
    product_request: productRequest,
    category_slug: context.categorySlug,
    quantity,
    destination_country: destinationCountry,
    target_timeline: targetTimeline || null,
    notes: notes || null,
    attachment_name: attachmentName,
    attachment_size: attachmentFile?.size ?? null,
    attachment_type: attachmentContentType,
    requester_name: requesterName,
    requester_email: requesterEmail,
    requester_company: requesterCompany || null,
    submitter_id: user?.id ?? null,
    attachment_path: attachmentPath,
    product_id: context.productId,
    supplier_id: context.supplierId,
    product_slug: context.productSlug,
    supplier_slug: context.supplierSlug,
    inquiry_type: context.inquiryType,
  } as RfqInsert;
  const notificationInput = {
    rfqId,
    requesterName,
    requesterEmail,
    requesterCompany: requesterCompany || null,
    productRequest,
    categorySlug: context.categorySlug,
    quantity,
    destinationCountry,
    targetTimeline: targetTimeline || null,
    notes: notes || null,
    productSlug: context.productSlug,
    supplierSlug: context.supplierSlug,
    attachmentName,
    attachmentSize: attachmentFile?.size ?? null,
    attachmentType: attachmentContentType,
    attachmentUrl: null as string | null,
    inquiryType: context.inquiryType,
  };

  const rfqMutations = supabase.from("rfqs") as unknown as RfqMutationTable;
  const { error } = await rfqMutations.insert(payload);

  if (error) {
    if (attachmentPath) {
      await supabase.storage
        .from(RFQ_ATTACHMENTS_BUCKET)
        .remove([attachmentPath]);
    }
    console.error("Unable to submit RFQ", error.message);

    const { data: duplicateRequest } = await supabase
      .from("rfqs")
      .select("id")
      .eq("submitter_id", user.id)
      .eq("request_token", requestToken)
      .maybeSingle();

    if (duplicateRequest) {
      redirect(statusPath("success"));
    }

    redirect(statusPath("error"));
  }

  let attachmentUrl: string | null = null;

  if (attachmentPath && attachmentFile) {
    const { data, error: signedUrlError } = await supabase.storage
      .from(RFQ_ATTACHMENTS_BUCKET)
      .createSignedUrl(attachmentPath, 60 * 60 * 24 * 7, {
        download: attachmentName ?? "attachment",
      });

    if (signedUrlError) {
      console.error(
        "Unable to create RFQ attachment review link",
        signedUrlError.message,
      );
    } else {
      attachmentUrl = data.signedUrl;
    }
  }

  try {
    await sendRfqNotification({ ...notificationInput, attachmentUrl });
  } catch (notificationError) {
    console.error("Unable to send RFQ email notification", notificationError);
    redirect(statusPath("notification"));
  }

  redirect(statusPath("success"));
}
