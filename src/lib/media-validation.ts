export type SupportedFile = {
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

export function createRfqAttachmentPath({
  userId,
  rfqId,
  extension,
}: {
  userId: string;
  rfqId: string;
  extension: SupportedFile["extension"];
}) {
  return `${userId}/${rfqId}/${crypto.randomUUID()}.${extension}`;
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
