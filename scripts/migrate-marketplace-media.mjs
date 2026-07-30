import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const allowedSourceHosts = new Set(["images.unsplash.com"]);
const maxBytes = 10 * 1024 * 1024;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL and server-only SUPABASE_SERVICE_ROLE_KEY are required.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function extensionFor(contentType) {
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return null;
}

function isSupabaseUrl(value) {
  try {
    return new URL(value).host === new URL(supabaseUrl).host;
  } catch {
    return false;
  }
}

async function downloadApprovedImage(sourceUrl) {
  const parsed = new URL(sourceUrl);

  if (
    parsed.protocol !== "https:" ||
    !allowedSourceHosts.has(parsed.hostname)
  ) {
    throw new Error(`Refusing unapproved media source: ${parsed.hostname}`);
  }

  const response = await fetch(sourceUrl, { redirect: "follow" });

  if (!response.ok) {
    throw new Error(`Unable to download ${sourceUrl}: ${response.status}`);
  }

  const contentType = response.headers.get("content-type")?.split(";")[0] ?? "";
  const extension = extensionFor(contentType);
  const bytes = new Uint8Array(await response.arrayBuffer());

  if (!extension || bytes.byteLength === 0 || bytes.byteLength > maxBytes) {
    throw new Error(`Unsupported or oversized image: ${sourceUrl}`);
  }

  return { bytes, contentType, extension };
}

async function uploadPublicImage(bucket, path, image) {
  const { error } = await supabase.storage.from(bucket).upload(path, image.bytes, {
    cacheControl: "31536000",
    contentType: image.contentType,
    upsert: true,
  });

  if (error) throw error;

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function migrateSupplierImages() {
  const { data, error } = await supabase
    .from("suppliers")
    .select("id, slug, image_url");

  if (error) throw error;

  for (const supplier of data ?? []) {
    if (!supplier.image_url || isSupabaseUrl(supplier.image_url)) continue;

    const image = await downloadApprovedImage(supplier.image_url);
    const path = `catalog/${supplier.id}/cover.${image.extension}`;
    const publicUrl = await uploadPublicImage("supplier-assets", path, image);
    const { error: updateError } = await supabase
      .from("suppliers")
      .update({ image_url: publicUrl })
      .eq("id", supplier.id);

    if (updateError) throw updateError;
    console.info(`Migrated supplier image: ${supplier.slug}`);
  }
}

async function migrateProductImages() {
  const { data, error } = await supabase
    .from("supplier_products")
    .select("id, slug, images");

  if (error) throw error;

  for (const product of data ?? []) {
    const sourceUrl = product.images?.[0];

    if (!sourceUrl || isSupabaseUrl(sourceUrl)) continue;

    const image = await downloadApprovedImage(sourceUrl);
    const path = `catalog/products/${product.id}/primary.${image.extension}`;
    const publicUrl = await uploadPublicImage("supplier-assets", path, image);
    const { error: updateError } = await supabase
      .from("supplier_products")
      .update({ images: [publicUrl] })
      .eq("id", product.id);

    if (updateError) throw updateError;
    console.info(`Migrated product image: ${product.slug}`);
  }
}

async function migrateLandingHero() {
  const heroBytes = await readFile(
    resolve(process.cwd(), "public/images/istanbul-hero.jpg"),
  );
  const path = "landing/istanbul-hero.jpg";
  const { error: uploadError } = await supabase.storage
    .from("site-assets")
    .upload(path, heroBytes, {
      cacheControl: "31536000",
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { error: updateError } = await supabase.from("site_assets").upsert({
    key: "landing-hero",
    bucket: "site-assets",
    path,
    alt: "Istanbul skyline, Bosphorus, and Galata Tower at night",
    alt_fr: "Skyline d’Istanbul, Bosphore et tour de Galata de nuit",
    alt_tr: "Gece İstanbul silüeti, Boğaz ve Galata Kulesi",
    ready: true,
  });

  if (updateError) throw updateError;
  console.info("Migrated landing hero.");
}

await migrateSupplierImages();
await migrateProductImages();
await migrateLandingHero();
console.info("Marketplace media migration complete.");
