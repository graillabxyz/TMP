"use server";

import { redirect } from "next/navigation";

import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

const maxAttachmentSize = 10 * 1024 * 1024;

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

export async function submitRfq(formData: FormData) {
  const productRequest = getString(formData, "product_request");
  const categorySlug = getString(formData, "category_slug");
  const quantity = getString(formData, "quantity");
  const destinationCountry = getString(formData, "destination_country");
  const targetTimeline = getString(formData, "target_timeline");
  const notes = getString(formData, "notes");
  const productSlug = getString(formData, "product_slug");
  const supplierSlug = getString(formData, "supplier_slug");

  if (
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

  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    redirect("/rfq?status=config");
  }

  const attachment = formData.get("attachment");
  const attachmentFile =
    attachment instanceof File && attachment.size > 0 ? attachment : null;

  if (attachmentFile && attachmentFile.size > maxAttachmentSize) {
    redirect("/rfq?status=error");
  }

  const basePayload: Database["public"]["Tables"]["rfqs"]["Insert"] = {
    product_request: productRequest,
    category_slug: categorySlug || null,
    quantity,
    destination_country: destinationCountry,
    target_timeline: targetTimeline || null,
    notes: notes || null,
    attachment_name: attachmentFile?.name ?? null,
    attachment_size: attachmentFile?.size ?? null,
    attachment_type: attachmentFile?.type ?? null,
  };
  const payload: Database["public"]["Tables"]["rfqs"]["Insert"] = {
    ...basePayload,
    product_id: getString(formData, "product_id") || null,
    supplier_id: getString(formData, "supplier_id") || null,
    product_slug: productSlug || null,
    supplier_slug: supplierSlug || null,
    inquiry_type: getString(formData, "inquiry_type") === "product"
      ? "product"
      : "general",
  };

  const { error } = await supabase.from("rfqs").insert(payload);

  if (error) {
    if (
      error.message.includes("product_id") ||
      error.message.includes("inquiry_type") ||
      error.message.includes("supplier_id")
    ) {
      const { error: fallbackError } = await supabase
        .from("rfqs")
        .insert(basePayload);

      if (!fallbackError) {
        redirect("/rfq?status=success");
      }
    }

    console.error("Unable to submit RFQ", error.message);
    redirect("/rfq?status=error");
  }

  redirect("/rfq?status=success");
}
