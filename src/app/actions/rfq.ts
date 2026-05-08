"use server";

import { redirect } from "next/navigation";

import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function submitRfq(formData: FormData) {
  const productRequest = getString(formData, "product_request");
  const quantity = getString(formData, "quantity");
  const destinationCountry = getString(formData, "destination_country");

  if (!productRequest || !quantity || !destinationCountry) {
    redirect("/rfq?status=missing");
  }

  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    redirect("/rfq?status=config");
  }

  const attachment = formData.get("attachment");
  const attachmentFile =
    attachment instanceof File && attachment.size > 0 ? attachment : null;

  const payload: Database["public"]["Tables"]["rfqs"]["Insert"] = {
    product_request: productRequest,
    category_slug: getString(formData, "category_slug") || null,
    quantity,
    destination_country: destinationCountry,
    target_timeline: getString(formData, "target_timeline") || null,
    notes: getString(formData, "notes") || null,
    attachment_name: attachmentFile?.name ?? null,
    attachment_size: attachmentFile?.size ?? null,
    attachment_type: attachmentFile?.type ?? null,
  };

  const { error } = await supabase.from("rfqs").insert(payload);

  if (error) {
    console.error("Unable to submit RFQ", error.message);
    redirect("/rfq?status=error");
  }

  redirect("/rfq?status=success");
}
