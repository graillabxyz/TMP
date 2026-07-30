import assert from "node:assert/strict";
import test from "node:test";

import {
  createMediaPath,
  createRfqAttachmentPath,
  isOwnedPrivateMediaPath,
  validateUpload,
} from "../src/lib/media-validation.ts";

function fileFromBytes(bytes, name, type = "application/octet-stream") {
  return new File([Uint8Array.from(bytes)], name, { type });
}

test("detects supported image signatures instead of trusting MIME metadata", async () => {
  const jpeg = fileFromBytes([0xff, 0xd8, 0xff, 0x00], "image.txt");
  const png = fileFromBytes(
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    "image.bin",
  );
  const webp = fileFromBytes(
    [
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42,
      0x50,
    ],
    "image.bin",
  );

  assert.deepEqual(await validateUpload(jpeg, { maxBytes: 100 }), {
    extension: "jpg",
    contentType: "image/jpeg",
  });
  assert.deepEqual(await validateUpload(png, { maxBytes: 100 }), {
    extension: "png",
    contentType: "image/png",
  });
  assert.deepEqual(await validateUpload(webp, { maxBytes: 100 }), {
    extension: "webp",
    contentType: "image/webp",
  });
  assert.equal(
    await validateUpload(fileFromBytes([1, 2, 3], "spoofed.jpg"), {
      maxBytes: 100,
    }),
    null,
  );
});

test("permits PDFs only for document workflows", async () => {
  const pdf = fileFromBytes(
    [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37],
    "document.pdf",
  );

  assert.equal(await validateUpload(pdf, { maxBytes: 100 }), null);
  assert.deepEqual(
    await validateUpload(pdf, { maxBytes: 100, allowPdf: true }),
    {
      extension: "pdf",
      contentType: "application/pdf",
    },
  );
});

test("rejects empty and oversized uploads", async () => {
  const empty = fileFromBytes([], "empty.png");
  const jpeg = fileFromBytes([0xff, 0xd8, 0xff, 0x00], "image.jpg");

  assert.equal(await validateUpload(empty, { maxBytes: 100 }), null);
  assert.equal(await validateUpload(jpeg, { maxBytes: 3 }), null);
});

test("creates owner-scoped randomized media paths", () => {
  const productPath = createMediaPath({
    userId: "user-1",
    supplierId: "supplier-1",
    area: "products",
    extension: "webp",
  });
  const rfqPath = createRfqAttachmentPath({
    userId: "user-1",
    rfqId: "rfq-1",
    extension: "pdf",
  });

  assert.match(
    productPath,
    /^user-1\/supplier-1\/products\/[0-9a-f-]+\.webp$/,
  );
  assert.match(rfqPath, /^user-1\/rfq-1\/[0-9a-f-]+\.pdf$/);
  assert.equal(
    isOwnedPrivateMediaPath({
      path: productPath.replace("/products/", "/verification/"),
      userId: "user-1",
      supplierId: "supplier-1",
      area: "verification",
    }),
    true,
  );
  assert.equal(
    isOwnedPrivateMediaPath({
      path: "user-1/supplier-1/verification/../other.pdf",
      userId: "user-1",
      supplierId: "supplier-1",
      area: "verification",
    }),
    false,
  );
});
