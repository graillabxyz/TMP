import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("shared actions accommodate translated labels without losing compact controls", async () => {
  const [buttonSource, searchSource] = await Promise.all([
    source("../src/components/ui/button.tsx"),
    source("../src/components/layout/header-search.tsx"),
  ]);

  assert.doesNotMatch(buttonSource, /whitespace-nowrap/);
  assert.match(buttonSource, /default: "min-h-11/);
  assert.match(searchSource, /h-8 min-h-0/);
  assert.match(searchSource, /size-10 min-h-0/);
});

test("destructive dialogs remain usable on short and mobile viewports", async () => {
  const dialogFiles = [
    "../src/components/product-archive-control.tsx",
    "../src/components/product-row-actions.tsx",
  ];

  for (const file of dialogFiles) {
    const dialogSource = await source(file);
    assert.match(dialogSource, /max-h-\[calc\(100dvh-/);
    assert.match(dialogSource, /overflow-y-auto overscroll-contain/);
    assert.match(dialogSource, /safe-area-inset-bottom/);
  }
});

test("navigation popups are trigger-anchored, width-safe, and keyboard navigable", async () => {
  const menuFiles = [
    "../src/components/product-row-actions.tsx",
    "../src/components/language-toggle.tsx",
    "../src/components/layout/categories-dropdown.tsx",
    "../src/components/layout/profile-dropdown.tsx",
  ];

  for (const file of menuFiles) {
    const menuSource = await source(file);
    assert.match(menuSource, /handleMenuKeyDown/);
    assert.match(menuSource, /calc\(100vw-/);
  }

  const contactSource = await source(
    "../src/components/layout/contact-dropdown.tsx",
  );
  assert.match(contactSource, /\.closest\("header"\)/);
  assert.match(contactSource, /Math\.max\(triggerBottom, headerBottom/);
  assert.match(contactSource, /fixed right-3 top-\[var/);
  assert.match(contactSource, /calc\(100vw-1\.5rem\)/);
});

test("the visual system respects reduced motion preferences", async () => {
  const globalStyles = await source("../src/app/globals.css");

  assert.match(globalStyles, /prefers-reduced-motion: reduce/);
  assert.match(globalStyles, /scroll-behavior: auto/);
});
