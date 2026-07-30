import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { curatedProductMedia } from "../src/data/curated-product-media.ts";
import {
  repairKnownSeedImage,
  repairKnownSeedImages,
} from "../src/lib/media-fallbacks.ts";

test("keeps the app fallback and migration catalogs identical", async () => {
  const migrationCatalog = JSON.parse(
    await readFile(
      new URL("../src/data/curated-product-media.json", import.meta.url),
      "utf8",
    ),
  );

  assert.deepEqual(migrationCatalog, curatedProductMedia);
});

test("uses a curated image for a known showcase product", () => {
  const source = repairKnownSeedImage(
    "https://project.supabase.co/storage/v1/object/public/supplier-assets/old.jpg",
    "cnc-aluminum-housings",
  );

  assert.match(source, /photo-1666634157070-6fd830fb5672/);
});

test("does not replace user or unknown product media", () => {
  const source =
    "https://project.supabase.co/storage/v1/object/public/supplier-assets/user.jpg";

  assert.equal(repairKnownSeedImage(source, "customer-listing"), source);
  assert.deepEqual(repairKnownSeedImages([source], "customer-listing"), [
    source,
  ]);
});

test("repairs the historical broken rigid-box seed URL", () => {
  assert.match(
    repairKnownSeedImage(
      "https://images.unsplash.com/photo-1607344645866-example",
    ),
    /photo-1607082350899-7e105aa886ae/,
  );
});
