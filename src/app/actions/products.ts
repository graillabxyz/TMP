"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";

import type { ProductFormState } from "@/lib/product-form-state";
import { isUuid, validateProductInput } from "@/lib/product-input";
import { getLocalizedPath, isLocale, type Locale } from "@/lib/i18n";
import {
  createMediaPath,
  getOwnedMediaPath,
  MAX_PRODUCT_IMAGE_BYTES,
  MAX_PRODUCT_IMAGES,
  SUPPLIER_ASSETS_BUCKET,
  validateUpload,
} from "@/lib/media";
import { slugify } from "@/lib/slug";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProductInsert, ProductUpdate } from "@/lib/products";

type MutationError = { code?: string; message: string } | null;
type MutationResult = Promise<{ error: MutationError }>;
type FilterBuilder = {
  eq: (column: string, value: string) => FilterBuilder;
} & PromiseLike<{ error: MutationError }>;
type SupplierProductsMutationTable = {
  delete: () => FilterBuilder;
  insert: (payload: ProductInsert) => MutationResult;
  update: (payload: ProductUpdate) => FilterBuilder;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getFormLocale(formData: FormData): Locale {
  const locale = getString(formData, "locale");
  return isLocale(locale) ? locale : "en";
}

function getImageFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

async function getCurrentProductContext() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      canPublish: false,
      supabase,
      supplierId: null,
      userId: null,
    };
  }

  const [{ data, error }, { data: profileData, error: profileError }] =
    await Promise.all([
      supabase
        .from("suppliers")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle(),
      supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
    ]);
  const supplier = data as unknown as { id: string } | null;
  const profile = profileData as unknown as {
    role: "buyer" | "supplier" | "admin";
  } | null;

  if (error) {
    console.error("Unable to load product owner supplier", error.message);
  }
  if (profileError) {
    console.error("Unable to load product owner profile", profileError.message);
  }

  return {
    canPublish:
      Boolean(supplier?.id) &&
      (profile?.role === "supplier" || profile?.role === "admin"),
    supabase,
    supplierId: supplier?.id ?? null,
    userId: user.id,
  };
}

async function getAuthenticatedProductContext() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    supabase,
    userId: user?.id ?? null,
  };
}

async function removeProductImages(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  paths: string[],
) {
  if (paths.length === 0) return;

  const { error } = await supabase.storage
    .from(SUPPLIER_ASSETS_BUCKET)
    .remove(paths);

  if (error) {
    console.error("Unable to remove product images", error.message);
  }
}

function getProductImagePaths({
  images,
  supplierId,
  userId,
}: {
  images: string[];
  supplierId: string | null;
  userId: string;
}) {
  const supplierFolders = [supplierId, "drafts"].filter(
    (folder, index, folders): folder is string =>
      Boolean(folder) && folders.indexOf(folder) === index,
  );

  return images
    .map((url) => {
      for (const folder of supplierFolders) {
        const path = getOwnedMediaPath({
          url,
          bucket: SUPPLIER_ASSETS_BUCKET,
          userId,
          supplierId: folder,
        });
        if (path) return path;
      }

      return null;
    })
    .filter((path): path is string => Boolean(path));
}

async function uploadProductImages({
  files,
  supplierId,
  supabase,
  userId,
}: {
  files: File[];
  supplierId: string;
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
  userId: string;
}) {
  const validatedFiles = await Promise.all(
    files.map(async (file) => ({
      detected: await validateUpload(file, {
        maxBytes: MAX_PRODUCT_IMAGE_BYTES,
      }),
      file,
    })),
  );
  const readyFiles = validatedFiles.flatMap(({ detected, file }) =>
    detected ? [{ detected, file }] : [],
  );

  if (readyFiles.length !== files.length) return null;

  const uploads = await Promise.all(
    readyFiles.map(async ({ detected, file }) => {
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

      return {
        error,
        path,
        url: error
          ? ""
          : supabase.storage.from(SUPPLIER_ASSETS_BUCKET).getPublicUrl(path)
              .data.publicUrl,
      };
    }),
  );
  const failedUpload = uploads.find((upload) => upload.error);

  if (failedUpload) {
    console.error(
      "Unable to upload product image",
      failedUpload.error?.message,
    );
    await removeProductImages(
      supabase,
      uploads.filter((upload) => !upload.error).map((upload) => upload.path),
    );
    return null;
  }

  return uploads.map(({ path, url }) => ({ path, url }));
}

function invalidState(
  fieldErrors: NonNullable<ProductFormState["fieldErrors"]>,
): ProductFormState {
  return { status: "error", formError: "invalid", fieldErrors };
}

export async function createProduct(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const locale = getFormLocale(formData);
  const productsPath = getLocalizedPath(locale, "/dashboard/products");
  const parsed = validateProductInput(formData);

  if (!parsed.values) return invalidState(parsed.errors);

  const { canPublish, supabase, supplierId, userId } =
    await getCurrentProductContext();
  if (!userId) {
    const nextPath = getLocalizedPath(locale, "/dashboard/products/new");
    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(nextPath)}`,
    );
  }
  if (parsed.values.status === "published" && !canPublish) {
    return { status: "error", formError: "supplierRequired" };
  }

  const imageFiles = getImageFiles(formData);
  if (imageFiles.length === 0) {
    return invalidState({ images: "imageRequired" });
  }
  if (imageFiles.length > MAX_PRODUCT_IMAGES) {
    return invalidState({ images: "imageCount" });
  }

  const uploadedImages = await uploadProductImages({
    files: imageFiles,
    supplierId: supplierId ?? "drafts",
    supabase,
    userId,
  });

  if (!uploadedImages) {
    return {
      status: "error",
      formError: "image",
      fieldErrors: { images: "imageInvalid" },
    };
  }

  const values = parsed.values;
  const payload: ProductInsert = {
    owner_id: userId,
    supplier_id: supplierId,
    category_id: values.categoryId,
    title: values.title,
    slug: `${slugify(values.title)}-${Date.now().toString(36)}`,
    description: values.description,
    price_min: values.priceMin,
    price_max: values.priceMax,
    currency: values.currency,
    moq: values.moq,
    lead_time: values.leadTime,
    images: uploadedImages.map((image) => image.url),
    status: values.status,
  };

  const productMutations = supabase.from(
    "supplier_products",
  ) as unknown as SupplierProductsMutationTable;
  const { error } = await productMutations.insert(payload);

  if (error) {
    await removeProductImages(
      supabase,
      uploadedImages.map((image) => image.path),
    );
    console.error("Unable to create product", error.message);
    if (error.code === "23503") {
      return {
        status: "error",
        formError: "category",
        fieldErrors: { category_id: "invalidOption" },
      };
    }
    return { status: "error", formError: "save" };
  }

  return {
    status: "success",
    redirectTo: `${productsPath}?status=created`,
  };
}

export async function updateProduct(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const locale = getFormLocale(formData);
  const productId = getString(formData, "id");
  const productsPath = getLocalizedPath(locale, "/dashboard/products");
  const parsed = validateProductInput(formData);

  if (!isUuid(productId)) {
    return { status: "error", formError: "notFound" };
  }
  if (!parsed.values) return invalidState(parsed.errors);

  const { canPublish, supabase, supplierId, userId } =
    await getCurrentProductContext();
  if (!userId) {
    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(productsPath)}`,
    );
  }
  if (parsed.values.status === "published" && !canPublish) {
    return { status: "error", formError: "supplierRequired" };
  }

  const { data: existingData, error: existingError } = await supabase
    .from("supplier_products")
    .select("images, supplier_id")
    .eq("id", productId)
    .eq("owner_id", userId)
    .maybeSingle();
  const existingProduct = existingData as {
    images: string[];
    supplier_id: string | null;
  } | null;

  if (existingError || !existingProduct) {
    if (existingError) {
      console.error("Unable to load existing product", existingError.message);
    }
    return { status: "error", formError: "notFound" };
  }

  const imageFiles = getImageFiles(formData);
  if (imageFiles.length > MAX_PRODUCT_IMAGES) {
    return invalidState({ images: "imageCount" });
  }

  const uploadedImages = imageFiles.length
    ? await uploadProductImages({
        files: imageFiles,
        supplierId: supplierId ?? "drafts",
        supabase,
        userId,
      })
    : [];

  if (imageFiles.length && !uploadedImages) {
    return {
      status: "error",
      formError: "image",
      fieldErrors: { images: "imageInvalid" },
    };
  }

  const nextImages = uploadedImages?.length
    ? uploadedImages.map((image) => image.url)
    : existingProduct.images;
  if (nextImages.length === 0) {
    return invalidState({ images: "imageRequired" });
  }

  const values = parsed.values;
  const payload: ProductUpdate = {
    owner_id: userId,
    supplier_id: supplierId ?? existingProduct.supplier_id,
    category_id: values.categoryId,
    title: values.title,
    description: values.description,
    price_min: values.priceMin,
    price_max: values.priceMax,
    currency: values.currency,
    moq: values.moq,
    lead_time: values.leadTime,
    images: nextImages,
    status: values.status,
    updated_at: new Date().toISOString(),
  };

  const productMutations = supabase.from(
    "supplier_products",
  ) as unknown as SupplierProductsMutationTable;
  const { error } = await productMutations
    .update(payload)
    .eq("id", productId)
    .eq("owner_id", userId);

  if (error) {
    await removeProductImages(
      supabase,
      (uploadedImages ?? []).map((image) => image.path),
    );
    console.error("Unable to update product", error.message);
    if (error.code === "23503") {
      return {
        status: "error",
        formError: "category",
        fieldErrors: { category_id: "invalidOption" },
      };
    }
    return { status: "error", formError: "save" };
  }

  if (uploadedImages?.length) {
    const previousPaths = getProductImagePaths({
      images: existingProduct.images,
      supplierId: existingProduct.supplier_id,
      userId,
    });
    after(() => removeProductImages(supabase, previousPaths));
  }

  return {
    status: "success",
    redirectTo: `${productsPath}?status=updated`,
  };
}

export async function deleteProduct(formData: FormData) {
  const locale = getFormLocale(formData);
  const productId = getString(formData, "id");
  const productsPath = getLocalizedPath(locale, "/dashboard/products");
  const { supabase, userId } = await getAuthenticatedProductContext();

  if (!isUuid(productId) || !userId) {
    redirect(`${productsPath}?status=error`);
  }

  const { data, error: productError } = await supabase
    .from("supplier_products")
    .select("images, supplier_id")
    .eq("id", productId)
    .eq("owner_id", userId)
    .maybeSingle();
  const product = data as {
    images: string[];
    supplier_id: string | null;
  } | null;

  if (productError || !product) {
    if (productError) {
      console.error(
        "Unable to load product before deletion",
        productError.message,
      );
    }
    redirect(`${productsPath}?status=error`);
  }

  const productMutations = supabase.from(
    "supplier_products",
  ) as unknown as SupplierProductsMutationTable;
  const { error } = await productMutations
    .delete()
    .eq("id", productId)
    .eq("owner_id", userId);

  if (error) {
    console.error("Unable to delete product", error.message);
    redirect(`${productsPath}?status=error`);
  }

  const imagePaths = getProductImagePaths({
    images: product.images,
    supplierId: product.supplier_id,
    userId,
  });
  after(() => removeProductImages(supabase, imagePaths));

  redirect(`${productsPath}?status=deleted`);
}

export async function archiveProduct(formData: FormData) {
  const locale = getFormLocale(formData);
  const productId = getString(formData, "id");
  const productsPath = getLocalizedPath(locale, "/dashboard/products");
  const { supabase, userId } = await getAuthenticatedProductContext();

  if (!isUuid(productId) || !userId) {
    redirect(`${productsPath}?status=error`);
  }

  const { data: ownedProduct, error: ownedProductError } = await supabase
    .from("supplier_products")
    .select("id")
    .eq("id", productId)
    .eq("owner_id", userId)
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
    .eq("owner_id", userId);

  if (error) {
    console.error("Unable to archive product", error.message);
    redirect(`${productsPath}?status=error`);
  }

  redirect(`${productsPath}?status=archived`);
}
