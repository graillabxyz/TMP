import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const popupFiles = [
  "../src/components/product-row-actions.tsx",
  "../src/components/language-toggle.tsx",
  "../src/components/layout/categories-dropdown.tsx",
  "../src/components/layout/contact-dropdown.tsx",
  "../src/components/layout/profile-dropdown.tsx",
];

test("custom popup panels do not clip their contents", async () => {
  for (const file of popupFiles) {
    const source = await readFile(new URL(file, import.meta.url), "utf8");
    const popupClasses = Array.from(
      source.matchAll(
        /role="(?:menu|dialog)"[\s\S]{0,320}?className="([^"]+)"/g,
      ),
      (match) => match[1],
    );

    assert.ok(popupClasses.length > 0, `Expected a popup panel in ${file}`);
    for (const className of popupClasses) {
      assert.doesNotMatch(
        className,
        /overflow-(?:hidden|clip)/,
        `Popup panel clips its contents in ${file}`,
      );
    }
  }
});

test("product action menus can escape the product list surface", async () => {
  const pageSource = await readFile(
    new URL("../src/app/dashboard/products/page.tsx", import.meta.url),
    "utf8",
  );
  const actionSource = await readFile(
    new URL("../src/components/product-row-actions.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(
    pageSource,
    /workspace-panel mt-6 overflow-(?:hidden|clip)/,
  );
  assert.match(actionSource, /absolute bottom-full right-0 z-\[60\]/);
});
