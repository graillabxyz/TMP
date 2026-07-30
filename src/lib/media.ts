import { getSupabaseConfig } from "@/lib/supabase/env";

export const SUPPLIER_ASSETS_BUCKET = "supplier-assets";
export const VERIFICATION_DOCUMENTS_BUCKET = "verification-documents";
export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_VERIFICATION_DOCUMENT_BYTES = 10 * 1024 * 1024;

type SupportedFile = {
  extension: "jpg" | "png" | "webp" | "pdf";
  contentType: "image/jpeg" | "image/png" | "image/webp" | "application/pdf";
};

function matches(bytes: Uint8Array, signature: number[], offset = 0) {
  return signature.every((value, index) => bytes[offset + index] === value);
}

async function detectFileType(file: File): Promise<SupportedFile | null> {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  if (matches(bytes, [0xff, 0xd8, 0xff])) {
    return { extension: "jpg", contentType: "image/jpeg" };
  }

  if (matches(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { extension: "png", contentType: "image/png" };
  }

  if (
    matches(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    matches(bytes, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return { extension: "webp", contentType: "image/webp" };
  }

  if (matches(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) {
    return { extension: "pdf", contentType: "application/pdf" };
  }

  return null;
}

export async function validateUpload(
  file: File,
  options: { maxBytes: number; allowPdf?: boolean },
) {
  if (file.size === 0 || file.size > options.maxBytes) {
    return null;
  }

  const detected = await detectFileType(file);

  if (!detected || (!options.allowPdf && detected.extension === "pdf")) {
    return null;
  }

  return detected;
}

export function createMediaPath({
  userId,
  supplierId,
  area,
  extension,
}: {
  userId: string;
  supplierId: string;
  area: "products" | "verification";
  extension: SupportedFile["extension"];
}) {
  return `${userId}/${supplierId}/${area}/${crypto.randomUUID()}.${extension}`;
}

export function getOwnedMediaPath({
  url,
  bucket,
  userId,
  supplierId,
}: {
  url: string;
  bucket: string;
  userId: string;
  supplierId: string;
}) {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const supabaseHost = new URL(config.url).host;
    const marker = `/storage/v1/object/public/${bucket}/`;

    if (parsed.host !== supabaseHost || !parsed.pathname.startsWith(marker)) {
      return null;
    }

    const path = decodeURIComponent(parsed.pathname.slice(marker.length));
    const [pathUserId, pathSupplierId] = path.split("/");

    return pathUserId === userId && pathSupplierId === supplierId ? path : null;
  } catch {
    return null;
  }
}

export function isOwnedPrivateMediaPath({
  path,
  userId,
  supplierId,
  area,
}: {
  path: string | null;
  userId: string;
  supplierId: string;
  area: "products" | "verification";
}) {
  return Boolean(
    path?.startsWith(`${userId}/${supplierId}/${area}/`) &&
    !path.includes("..") &&
    path.split("/").length === 4,
  );
}
