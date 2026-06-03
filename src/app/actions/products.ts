"use server";

import { redirect } from "next/navigation";

import { getDemoRole } from "@/lib/demo-session";
import { slugify } from "@/lib/slug";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProductInsert, ProductUpdate } from "@/lib/products";

type ProductStatus = "draft" | "published" | "archived";
type MutationError = { message: string } | null;
type MutationResult = Promise<{ error: MutationError }>;
type FilterBuilder = {
  eq: (column: string, value: string) => FilterBuilder;
} & PromiseLike<{ error: MutationError }>;
type SupplierProductsMutationTable = {
  insert: (payload: ProductInsert) => MutationResult;
  update: (payload: ProductUpdate) => FilterBuilder;
};

const allowedCurrencies = new Set(["EUR", "USD", "GBP", "TRY"]);

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const numeric = Number(value);

  return Number.isFinite(numeric) ? numeric : null;
}

function hasInvalidNumber(
  formData: FormData,
  key: string,
  options: { integer?: boolean; min?: number } = {},
) {
  const value = getString(formData, key);

  if (!value) {
    return false;
  }

  const numeric = Number(value);

  return (
    !Number.isFinite(numeric) ||
    numeric < (options.min ?? Number.NEGATIVE_INFINITY) ||
    Boolean(options.integer && !Number.isInteger(numeric))
  );
}

function getCurrency(formData: FormData) {
  const currency = getString(formData, "currency") || "EUR";

  return allowedCurrencies.has(currency) ? currency : null;
}

function hasInvalidUrl(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol !== "https:" && url.protocol !== "http:";
  } catch {
    return true;
  }
}

function hasInvalidProductDetails(formData: FormData) {
  const priceMin = getNumber(formData, "price_min");
  const priceMax = getNumber(formData, "price_max");

  return (
    hasInvalidNumber(formData, "moq", { integer: true, min: 1 }) ||
    hasInvalidNumber(formData, "price_min", { min: 0 }) ||
    hasInvalidNumber(formData, "price_max", { min: 0 }) ||
    (priceMin !== null && priceMax !== null && priceMin > priceMax) ||
    getCurrency(formData) === null ||
    hasInvalidUrl(formData, "image_url")
  );
}

function getStatus(formData: FormData): ProductStatus | null {
  const status = getString(formData, "status");

  return ["draft", "published", "archived"].includes(status)
    ? (status as ProductStatus)
    : null;
}

function getImages(formData: FormData) {
  const imageUrl = getString(formData, "image_url");

  return imageUrl ? [imageUrl] : [];
}

async function getCurrentSupplierId() {
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
    console.error("Unable to load product owner supplier", error.message);
  }

  return { supabase, supplierId: supplier?.id ?? null };
}

export async function createProduct(formData: FormData) {
  const title = getString(formData, "title");
  const categoryId = getString(formData, "category_id");
  const description = getString(formData, "description");
  const status = getStatus(formData);
  const currency = getCurrency(formData);

  if (
    !title ||
    !categoryId ||
    !description ||
    !status ||
    !currency ||
    hasInvalidProductDetails(formData)
  ) {
    redirect("/dashboard/products/new?status=missing");
  }

  if ((await getDemoRole()) === "supplier") {
    redirect("/dashboard/products?status=created");
  }

  const { supabase, supplierId } = await getCurrentSupplierId();

  if (!supplierId) {
    redirect("/dashboard/products?status=supplier-missing");
  }

  const payload: ProductInsert = {
    supplier_id: supplierId,
    category_id: categoryId,
    title,
    slug: `${slugify(title)}-${Date.now().toString(36)}`,
    description,
    price_min: getNumber(formData, "price_min"),
    price_max: getNumber(formData, "price_max"),
    currency,
    moq: getNumber(formData, "moq"),
    lead_time: getString(formData, "lead_time") || null,
    images: getImages(formData),
    status,
  };

  const productMutations = supabase.from(
    "supplier_products",
  ) as unknown as SupplierProductsMutationTable;
  const { error } = await productMutations.insert(payload);

  if (error) {
    console.error("Unable to create product", error.message);
    redirect("/dashboard/products/new?status=error");
  }

  redirect("/dashboard/products?status=created");
}

export async function updateProduct(formData: FormData) {
  const productId = getString(formData, "id");
  const title = getString(formData, "title");
  const categoryId = getString(formData, "category_id");
  const description = getString(formData, "description");
  const status = getStatus(formData);
  const currency = getCurrency(formData);

  if (
    !productId ||
    !title ||
    !categoryId ||
    !description ||
    !status ||
    !currency ||
    hasInvalidProductDetails(formData)
  ) {
    redirect(`/dashboard/products/${productId}/edit?status=missing`);
  }

  if ((await getDemoRole()) === "supplier") {
    redirect("/dashboard/products?status=updated");
  }

  const { supabase, supplierId } = await getCurrentSupplierId();

  if (!supplierId) {
    redirect("/dashboard/products?status=supplier-missing");
  }

  const payload: ProductUpdate = {
    category_id: categoryId,
    title,
    description,
    price_min: getNumber(formData, "price_min"),
    price_max: getNumber(formData, "price_max"),
    currency,
    moq: getNumber(formData, "moq"),
    lead_time: getString(formData, "lead_time") || null,
    images: getImages(formData),
    status,
    updated_at: new Date().toISOString(),
  };

  const productMutations = supabase.from(
    "supplier_products",
  ) as unknown as SupplierProductsMutationTable;
  const { error } = await productMutations
    .update(payload)
    .eq("id", productId)
    .eq("supplier_id", supplierId);

  if (error) {
    console.error("Unable to update product", error.message);
    redirect(`/dashboard/products/${productId}/edit?status=error`);
  }

  redirect("/dashboard/products?status=updated");
}

export async function archiveProduct(formData: FormData) {
  const productId = getString(formData, "id");

  if ((await getDemoRole()) === "supplier") {
    redirect("/dashboard/products?status=archived");
  }

  const { supabase, supplierId } = await getCurrentSupplierId();

  if (!productId || !supplierId) {
    redirect("/dashboard/products?status=error");
  }

  const productMutations = supabase.from(
    "supplier_products",
  ) as unknown as SupplierProductsMutationTable;
  const { error } = await productMutations
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", productId)
    .eq("supplier_id", supplierId);

  if (error) {
    console.error("Unable to archive product", error.message);
    redirect("/dashboard/products?status=error");
  }

  redirect("/dashboard/products?status=archived");
}
