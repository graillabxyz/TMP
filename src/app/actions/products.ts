"use server";

import { redirect } from "next/navigation";

import { getLocalizedPath, isLocale, type Locale } from "@/lib/i18n";
import {
  createMediaPath,
  getOwnedMediaPath,
  MAX_PRODUCT_IMAGE_BYTES,
  SUPPLIER_ASSETS_BUCKET,
  validateUpload,
} from "@/lib/media";
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
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getFormLocale(formData: FormData): Locale {
  const locale = getString(formData, "locale");

  return isLocale(locale) ? locale : "en";
}

function isUuid(value: string) {
  return uuidPattern.test(value);
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
  options: { integer?: boolean; min?: number; max?: number } = {},
) {
  const value = getString(formData, key);

  if (!value) {
    return false;
  }

  const numeric = Number(value);

  return (
    !Number.isFinite(numeric) ||
    numeric < (options.min ?? Number.NEGATIVE_INFINITY) ||
    numeric > (options.max ?? Number.POSITIVE_INFINITY) ||
    Boolean(options.integer && !Number.isInteger(numeric))
  );
}

function getCurrency(formData: FormData) {
  const currency = getString(formData, "currency") || "EUR";

  return allowedCurrencies.has(currency) ? currency : null;
}

function hasInvalidProductDetails(formData: FormData) {
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const leadTime = getString(formData, "lead_time");
  const priceMin = getNumber(formData, "price_min");
  const priceMax = getNumber(formData, "price_max");

  return (
    title.length < 3 ||
    title.length > 160 ||
    description.length < 20 ||
    description.length > 5000 ||
    leadTime.length > 120 ||
    hasInvalidNumber(formData, "moq", {
      integer: true,
      min: 1,
      max: 1_000_000_000,
    }) ||
    hasInvalidNumber(formData, "price_min", {
      min: 0,
      max: 1_000_000_000_000,
    }) ||
    hasInvalidNumber(formData, "price_max", {
      min: 0,
      max: 1_000_000_000_000,
    }) ||
    (priceMin !== null && priceMax !== null && priceMin > priceMax) ||
    getCurrency(formData) === null
  );
}

function getStatus(formData: FormData): ProductStatus | null {
  const status = getString(formData, "status");

  return ["draft", "published", "archived"].includes(status)
    ? (status as ProductStatus)
    : null;
}

function getFile(formData: FormData, key: string) {
  const value = formData.get(key);

  return value instanceof File && value.size > 0 ? value : null;
}

async function getCurrentSupplierContext() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, supplierId: null, userId: null };
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

  return {
    supabase,
    supplierId: supplier?.id ?? null,
    userId: user.id,
  };
}

async function uploadProductImage({
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
    maxBytes: MAX_PRODUCT_IMAGE_BYTES,
  });

  if (!detected) {
    return null;
  }

  const path = createMediaPath({
    userId,
    supplierId,
    area: "products",
    extension: detected.extension,
  });
  const { error } = await supabase.storage
    .from(SUPPLIER_ASSETS_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: detected.contentType,
      upsert: false,
    });

  if (error) {
    console.error("Unable to upload product image", error.message);
    return null;
  }

  return {
    path,
    url: supabase.storage.from(SUPPLIER_ASSETS_BUCKET).getPublicUrl(path).data
      .publicUrl,
  };
}

async function removeProductImage(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  path: string | null,
) {
  if (!path) {
    return;
  }

  const { error } = await supabase.storage
    .from(SUPPLIER_ASSETS_BUCKET)
    .remove([path]);

  if (error) {
    console.error("Unable to remove replaced product image", error.message);
  }
}

export async function createProduct(formData: FormData) {
  const locale = getFormLocale(formData);
  const productsPath = getLocalizedPath(locale, "/dashboard/products");
  const newProductPath = getLocalizedPath(locale, "/dashboard/products/new");
  const title = getString(formData, "title");
  const categoryId = getString(formData, "category_id");
  const description = getString(formData, "description");
  const status = getStatus(formData);
  const currency = getCurrency(formData);

  if (
    !title ||
    !isUuid(categoryId) ||
    !description ||
    !status ||
    !currency ||
    hasInvalidProductDetails(formData)
  ) {
    redirect(`${newProductPath}?status=missing`);
  }

  const { supabase, supplierId, userId } = await getCurrentSupplierContext();

  if (!supplierId || !userId) {
    redirect(`${productsPath}?status=supplier-missing`);
  }

  const imageFile = getFile(formData, "image");

  if (!imageFile) {
    redirect(`${newProductPath}?status=image`);
  }

  const uploadedImage = await uploadProductImage({
    file: imageFile,
    supplierId,
    supabase,
    userId,
  });

  if (!uploadedImage) {
    redirect(`${newProductPath}?status=image`);
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
    images: [uploadedImage.url],
    status,
  };

  const productMutations = supabase.from(
    "supplier_products",
  ) as unknown as SupplierProductsMutationTable;
  const { error } = await productMutations.insert(payload);

  if (error) {
    await removeProductImage(supabase, uploadedImage.path);
    console.error("Unable to create product", error.message);
    redirect(`${newProductPath}?status=error`);
  }

  redirect(`${productsPath}?status=created`);
}

export async function updateProduct(formData: FormData) {
  const locale = getFormLocale(formData);
  const productId = getString(formData, "id");
  const productsPath = getLocalizedPath(locale, "/dashboard/products");
  const editProductPath = isUuid(productId)
    ? getLocalizedPath(locale, `/dashboard/products/${productId}/edit`)
    : productsPath;
  const title = getString(formData, "title");
  const categoryId = getString(formData, "category_id");
  const description = getString(formData, "description");
  const status = getStatus(formData);
  const currency = getCurrency(formData);

  if (
    !isUuid(productId) ||
    !title ||
    !isUuid(categoryId) ||
    !description ||
    !status ||
    !currency ||
    hasInvalidProductDetails(formData)
  ) {
    redirect(`${editProductPath}?status=missing`);
  }

  const { supabase, supplierId, userId } = await getCurrentSupplierContext();

  if (!supplierId || !userId) {
    redirect(`${productsPath}?status=supplier-missing`);
  }

  const { data: existingData, error: existingError } = await supabase
    .from("supplier_products")
    .select("images")
    .eq("id", productId)
    .eq("supplier_id", supplierId)
    .maybeSingle();
  const existingProduct = existingData as { images: string[] } | null;

  if (existingError || !existingProduct) {
    if (existingError) {
      console.error("Unable to load existing product", existingError.message);
    }
    redirect(`${editProductPath}?status=error`);
  }

  const imageFile = getFile(formData, "image");
  const uploadedImage = imageFile
    ? await uploadProductImage({
        file: imageFile,
        supplierId,
        supabase,
        userId,
      })
    : null;

  if (imageFile && !uploadedImage) {
    redirect(`${editProductPath}?status=image`);
  }

  const currentImageUrl = existingProduct.images[0] ?? null;
  const nextImages = uploadedImage
    ? [uploadedImage.url]
    : existingProduct.images;

  if (nextImages.length === 0) {
    redirect(`${editProductPath}?status=image`);
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
    images: nextImages,
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
    await removeProductImage(supabase, uploadedImage?.path ?? null);
    console.error("Unable to update product", error.message);
    redirect(`${editProductPath}?status=error`);
  }

  if (uploadedImage && currentImageUrl) {
    const previousPath = getOwnedMediaPath({
      url: currentImageUrl,
      bucket: SUPPLIER_ASSETS_BUCKET,
      userId,
      supplierId,
    });

    await removeProductImage(supabase, previousPath);
  }

  redirect(`${productsPath}?status=updated`);
}

export async function archiveProduct(formData: FormData) {
  const locale = getFormLocale(formData);
  const productId = getString(formData, "id");
  const productsPath = getLocalizedPath(locale, "/dashboard/products");

  const { supabase, supplierId } = await getCurrentSupplierContext();

  if (!isUuid(productId) || !supplierId) {
    redirect(`${productsPath}?status=error`);
  }

  const { data: ownedProduct, error: ownedProductError } = await supabase
    .from("supplier_products")
    .select("id")
    .eq("id", productId)
    .eq("supplier_id", supplierId)
    .maybeSingle();

  if (ownedProductError || !ownedProduct) {
    if (ownedProductError) {
      console.error(
        "Unable to verify product before archive",
        ownedProductError.message,
      );
    }

    redirect(`${productsPath}?status=error`);
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
    redirect(`${productsPath}?status=error`);
  }

  redirect(`${productsPath}?status=archived`);
}
