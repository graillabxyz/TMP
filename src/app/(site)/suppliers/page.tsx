import type { Metadata } from "next";
import { Search, SlidersHorizontal } from "lucide-react";

import { SupplierCard } from "@/components/supplier-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getCategories, getSuppliers } from "@/lib/marketplace";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Verified Turkish Suppliers | TMP",
  description:
    "Browse export-ready Turkish suppliers by category, verification status, MOQ, and European export experience.",
  path: "/suppliers",
});

export const revalidate = 300;

export default async function SuppliersPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [categories, suppliers] = await Promise.all([
    getCategories(locale),
    getSuppliers(locale),
  ]);

  return (
    <section className="section-shell">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge>{t.suppliers.badge}</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
            {t.suppliers.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            {t.suppliers.body}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-muted-foreground">
          <span className="font-semibold text-white">{suppliers.length}</span>{" "}
          {t.suppliers.indexed}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[290px_1fr]">
        <aside>
          <Card className="sticky top-24 bg-white/[0.035]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <SlidersHorizontal
                  className="size-4 text-gold-200"
                  aria-hidden="true"
                />
                {t.suppliers.filters}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="supplier-search">{t.suppliers.search}</Label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="supplier-search"
                    className="pl-10"
                    placeholder={t.suppliers.searchPlaceholder}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">{t.common.category}</Label>
                <Select id="category" defaultValue="all">
                  <option value="all">{t.suppliers.allCategories}</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-3">
                <Label>{t.suppliers.verification}</Label>
                {t.suppliers.checks.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-muted-foreground"
                  >
                    <input
                      type="checkbox"
                      className="size-4 rounded border-white/20 bg-transparent accent-gold-300"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.slug}
              supplier={supplier}
              labels={{
                verified: t.common.verified,
                moq: t.common.moq,
                response: t.common.response,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
