import { getSupabaseConfig } from "@/lib/supabase/env";

export {
  createMediaPath,
  createRfqAttachmentPath,
  isOwnedPrivateMediaPath,
  validateUpload,
} from "@/lib/media-validation";

export const SUPPLIER_ASSETS_BUCKET = "supplier-assets";
export const VERIFICATION_DOCUMENTS_BUCKET = "verification-documents";
export const RFQ_ATTACHMENTS_BUCKET = "rfq-attachments";
export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_PRODUCT_IMAGES = 5;
export const MAX_VERIFICATION_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const MAX_RFQ_ATTACHMENT_BYTES = 10 * 1024 * 1024;

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
