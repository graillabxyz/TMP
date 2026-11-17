import { mkdir, writeFile } from "node:fs/promises";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";

nextEnv.loadEnvConfig(process.cwd());
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
const seedSlugs = new Set([
  "anatolia-textile-studio",
  "marmara-machinery-works",
  "aegean-homeware-co",
  "izmir-natural-foods",
  "bursa-auto-systems",
  "bursa-building-materials",
  "istanbul-packaging-lab",
]);
async function rows(table) {
  const { data, error } = await client.from(table).select("*");
  if (error) throw error;
  if (data.length >= 1000)
    throw new Error(`Pagination required before cleaning ${table}`);
  return data;
}
const suppliers = await rows("suppliers");
const products = await rows("supplier_products");
const accounts = await rows("supplier_accounts");
const rfqs = await rows("rfqs");
const demoSuppliers = suppliers.filter(
  (row) => !row.owner_id && seedSlugs.has(row.slug),
);
const supplierIds = new Set(demoSuppliers.map((row) => row.id));
if (products.some((row) => supplierIds.has(row.supplier_id) && row.owner_id)) {
  throw new Error(
    "A demo supplier has user-owned products; manual review required.",
  );
}
const targets = {
  rfqs: rfqs.filter((row) =>
    /smoke test|launch test only/i.test(
      `${row.product_request} ${row.notes ?? ""}`,
    ),
  ),
  supplier_products: products.filter(
    (row) => !row.owner_id && supplierIds.has(row.supplier_id),
  ),
  suppliers: demoSuppliers,
  supplier_accounts: accounts.filter(
    (row) => !row.owner_id && seedSlugs.has(row.slug),
  ),
};
console.log(
  Object.fromEntries(
    Object.entries(targets).map(([table, data]) => [table, data.length]),
  ),
);
if (!process.argv.includes("--apply")) process.exit(0);

await mkdir(".vercel/cleanup-backups", { recursive: true, mode: 0o700 });
const backup = `.vercel/cleanup-backups/demo-${Date.now()}.json`;
await writeFile(backup, JSON.stringify(targets, null, 2), { mode: 0o600 });
console.log(`Recovery snapshot: ${backup}`);
for (const [table, data] of Object.entries(targets)) {
  if (!data.length) continue;
  let query = client
    .from(table)
    .delete()
    .in(
      "id",
      data.map((row) => row.id),
    );
  if (table !== "rfqs") query = query.is("owner_id", null);
  const { error } = await query;
  if (error) throw error;
}
// Historical category counters were seeded marketing numbers, not aggregates.
const remainingSuppliers = await rows("suppliers");
for (const category of await rows("supplier_categories")) {
  const count = remainingSuppliers.filter(
    (row) => row.category_id === category.id,
  ).length;
  const { error } = await client
    .from("supplier_categories")
    .update({ supplier_count: count })
    .eq("id", category.id);
  if (error) throw error;
}
for (const [table, data] of Object.entries(targets)) {
  const ids = new Set(data.map((row) => row.id));
  if ((await rows(table)).some((row) => ids.has(row.id)))
    throw new Error(`Cleanup incomplete: ${table}`);
}
for (const supplier of suppliers.filter((row) => row.owner_id)) {
  if (!remainingSuppliers.some((row) => row.id === supplier.id))
    throw new Error("Real supplier missing after cleanup");
}
console.log("Verified: demo records removed; real suppliers preserved.");
