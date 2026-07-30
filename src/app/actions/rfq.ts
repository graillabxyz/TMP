"use server";

import { redirect } from "next/navigation";

import {
  createRfqAttachmentPath,
  MAX_RFQ_ATTACHMENT_BYTES,
  RFQ_ATTACHMENTS_BUCKET,
  validateUpload,
} from "@/lib/media";
import { sendRfqNotification } from "@/lib/rfq-notification";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type RfqInsert = Database["public"]["Tables"]["rfqs"]["Insert"];
type RfqMutationTable = {
  insert: (
    payload: RfqInsert,
  ) => Promise<{ error: { message: string } | null }>;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function hasInvalidLength(value: string, maxLength: number) {
  return value.length > maxLength;
}

function isValidOptionalSlug(value: string) {
  return !value || /^[a-z0-9-]{1,120}$/.test(value);
}

function isValidEmail(value: string) {
  return (
    value.length >= 3 &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function hasSpecificProductDetail(value: string, hasCatalogProduct: boolean) {
  const words = value
    .split(/\s+/)
    .filter((word) => /[a-z0-9]/i.test(word) && word.length > 2);
  const hasSpecSignal =
    /[,/()+-]|\b(gsm|mm|cm|kg|pcs|units|oeko|iso|fsc|ce|cotton|aluminum|steel|paper|private label|packaging)\b/i.test(
      value,
    );

  if (hasCatalogProduct) {
    return value.length >= 12 && words.length >= 2;
  }

  return value.length >= 24 && words.length >= 4 && hasSpecSignal;
}

export async function submitRfq(formData: FormData) {
  if (getString(formData, "website")) {
    redirect("/rfq?status=success");
  }

  const productRequest = getString(formData, "product_request");
  const requesterName = getString(formData, "requester_name");
  const submittedRequesterEmail = getString(
    formData,
    "requester_email",
  ).toLowerCase();
  const requesterCompany = getString(formData, "requester_company");
  const categorySlug = getString(formData, "category_slug");
  const quantity = getString(formData, "quantity");
  const destinationCountry = getString(formData, "destination_country");
  const targetTimeline = getString(formData, "target_timeline");
  const notes = getString(formData, "notes");
  const productSlug = getString(formData, "product_slug");
  const supplierSlug = getString(formData, "supplier_slug");
  const hasCatalogProduct = Boolean(
    productSlug || getString(formData, "product_id"),
  );

  if (
    requesterName.length < 2 ||
    requesterName.length > 100 ||
    !isValidEmail(submittedRequesterEmail) ||
    requesterCompany.length > 120 ||
    !productRequest ||
    !quantity ||
    !destinationCountry ||
    hasInvalidLength(productRequest, 180) ||
    hasInvalidLength(quantity, 80) ||
    hasInvalidLength(destinationCountry, 80) ||
    hasInvalidLength(targetTimeline, 120) ||
    hasInvalidLength(notes, 3000) ||
    !isValidOptionalSlug(categorySlug) ||
    !isValidOptionalSlug(productSlug) ||
    !isValidOptionalSlug(supplierSlug)
  ) {
    redirect("/rfq?status=missing");
  }

  if (!hasSpecificProductDetail(productRequest, hasCatalogProduct)) {
    redirect("/rfq?status=specific");
  }

  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;

  try {
    supabase = await createServerSupabaseClient();
  } catch {
    redirect("/rfq?status=config");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/login?next=/rfq&status=auth-required");
  }

  const requesterEmail = user.email.toLowerCase();
  const attachment = formData.get("attachment");
  const attachmentFile =
    attachment instanceof File && attachment.size > 0 ? attachment : null;

  const rfqId = crypto.randomUUID();
  let attachmentPath: string | null = null;
  let attachmentContentType: string | null = null;

  if (attachmentFile) {
    const detected = await validateUpload(attachmentFile, {
      maxBytes: MAX_RFQ_ATTACHMENT_BYTES,
      allowPdf: true,
    });

    if (!detected) {
      redirect("/rfq?status=attachment");
    }

    attachmentContentType = detected.contentType;
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
      redirect("/rfq?status=attachment");
    }
  }

  const payload = {
    id: rfqId,
    product_request: productRequest,
    category_slug: categorySlug || null,
    quantity,
    destination_country: destinationCountry,
    target_timeline: targetTimeline || null,
    notes: notes || null,
    attachment_name: attachmentFile?.name ?? null,
    attachment_size: attachmentFile?.size ?? null,
    attachment_type: attachmentContentType,
    requester_name: requesterName,
    requester_email: requesterEmail,
    requester_company: requesterCompany || null,
    submitter_id: user?.id ?? null,
    attachment_path: attachmentPath,
    product_id: getString(formData, "product_id") || null,
    supplier_id: getString(formData, "supplier_id") || null,
    product_slug: productSlug || null,
    supplier_slug: supplierSlug || null,
    inquiry_type:
      getString(formData, "inquiry_type") === "product" ? "product" : "general",
  } as RfqInsert;
  const notificationInput = {
    rfqId,
    requesterName,
    requesterEmail,
    requesterCompany: requesterCompany || null,
    productRequest,
    categorySlug: categorySlug || null,
    quantity,
    destinationCountry,
    targetTimeline: targetTimeline || null,
    notes: notes || null,
    productSlug: productSlug || null,
    supplierSlug: supplierSlug || null,
    attachmentName: attachmentFile?.name ?? null,
    attachmentSize: attachmentFile?.size ?? null,
    attachmentType: attachmentContentType,
    attachmentUrl: null as string | null,
    inquiryType:
      getString(formData, "inquiry_type") === "product"
        ? ("product" as const)
        : ("general" as const),
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
    redirect("/rfq?status=error");
  }

  let attachmentUrl: string | null = null;

  if (attachmentPath && attachmentFile) {
    const { data, error: signedUrlError } = await supabase.storage
      .from(RFQ_ATTACHMENTS_BUCKET)
      .createSignedUrl(attachmentPath, 60 * 60 * 24 * 7, {
        download: attachmentFile.name,
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
    redirect("/rfq?status=notification");
  }

  redirect("/rfq?status=success");
}
