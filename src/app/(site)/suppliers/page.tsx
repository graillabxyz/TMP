import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch, Radio, Search, SlidersHorizontal } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { SupplierCard } from "@/components/supplier-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getCategories, getSuppliers } from "@/lib/marketplace";
import { getPlatformActivity } from "@/lib/platform-activity";
import { createMetadata } from "@/lib/seo";
import { slugify } from "@/lib/slug";
import { getSupplierCollectionJsonLd } from "@/lib/structured-data";
import type { Supplier } from "@/types";

type SuppliersPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    verified?: string;
    eu?: string;
    low_moq?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.suppliers.title,
    description: t.suppliers.body,
    path: "/suppliers",
    keywords: t.supplierDetail.seoKeywords,
    locale,
  });
}

export const revalidate = 300;

function supplierMatchesQuery(supplier: Supplier, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    supplier.name,
    supplier.city,
    supplier.country,
    supplier.category,
    supplier.summary,
    ...supplier.tags,
    ...supplier.certifications,
    ...supplier.exportMarkets,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export default async function SuppliersPage({
  searchParams,
}: SuppliersPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const activity = getPlatformActivity(locale);
  const query = (params.q ?? "").trim();
  const normalizedQuery = query.toLowerCase();
  const category = params.category ?? "";
  const verifiedOnly = params.verified === "1";
  const euExportOnly = params.eu === "1";
  const lowMoqOnly = params.low_moq === "1";
  const [categories, suppliers] = await Promise.all([
    getCategories(locale),
    getSuppliers(locale),
  ]);
  const productsHref = getLocalizedPath(locale, "/products");
  const suppliersHref = getLocalizedPath(locale, "/suppliers");
  const selectedCategory = categories.find((item) => item.slug === category);
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesCategory =
      !selectedCategory ||
      supplier.category === selectedCategory.name ||
      slugify(supplier.category) === selectedCategory.slug;
    const matchesVerified = !verifiedOnly || supplier.verified;
    const matchesEuExport = !euExportOnly || supplier.exportMarkets.length > 0;
    const matchesLowMoq =
      !lowMoqOnly ||
      supplier.tags.some((tag) => {
        const normalizedTag = tag.toLowerCase();

        return (
          normalizedTag.includes("low moq") ||
          normalizedTag.includes("düşük moq")
        );
      });

    return (
      supplierMatchesQuery(supplier, normalizedQuery) &&
      matchesCategory &&
      matchesVerified &&
      matchesEuExport &&
      matchesLowMoq
    );
  });

  return (
    <>
      <JsonLd
        data={getSupplierCollectionJsonLd(
          filteredSuppliers,
          {
            name: t.suppliers.title,
            description: t.suppliers.body,
          },
          locale,
        )}
      />
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
            <span className="font-semibold text-white">
              {filteredSuppliers.length}
            </span>{" "}
            {filteredSuppliers.length === 1
              ? t.suppliers.indexedSingular
              : t.suppliers.indexed}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[290px_1fr]">
          <aside className="grid gap-4 self-start lg:sticky lg:top-24">
            <Card className="bg-white/[0.035]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <SlidersHorizontal
                    className="size-4 text-gold-200"
                    aria-hidden="true"
                  />
                  {t.suppliers.filters}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="supplier-search">
                      {t.suppliers.search}
                    </Label>
                    <div className="relative">
                      <Search
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        id="supplier-search"
                        name="q"
                        className="pl-10"
                        defaultValue={query}
                        placeholder={t.suppliers.searchPlaceholder}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">{t.common.category}</Label>
                    <Select
                      id="category"
                      name="category"
                      defaultValue={category}
                    >
                      <option value="">{t.suppliers.allCategories}</option>
                      {categories.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="grid gap-3">
                    <Label>{t.suppliers.verification}</Label>
                    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-muted-foreground transition focus-within:border-gold-300/45 hover:border-gold-300/35 hover:bg-white/[0.055]">
                      <input
                        type="checkbox"
                        name="verified"
                        value="1"
                        defaultChecked={verifiedOnly}
                        className="size-4 rounded border-white/20 bg-transparent accent-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      />
                      {t.suppliers.checks[0]}
                    </label>
                    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-muted-foreground transition focus-within:border-gold-300/45 hover:border-gold-300/35 hover:bg-white/[0.055]">
                      <input
                        type="checkbox"
                        name="eu"
                        value="1"
                        defaultChecked={euExportOnly}
                        className="size-4 rounded border-white/20 bg-transparent accent-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      />
                      {t.suppliers.checks[1]}
                    </label>
                    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-muted-foreground transition focus-within:border-gold-300/45 hover:border-gold-300/35 hover:bg-white/[0.055]">
                      <input
                        type="checkbox"
                        name="low_moq"
                        value="1"
                        defaultChecked={lowMoqOnly}
                        className="size-4 rounded border-white/20 bg-transparent accent-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      />
                      {t.suppliers.checks[2]}
                    </label>
                  </div>

                  <div className="grid gap-3">
                    <Button type="submit">{t.common.search}</Button>
                    <Button asChild variant="ghost">
                      <Link href={suppliersHref}>{t.common.clearFilters}</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card className="bg-white/[0.035]">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Radio className="size-4 text-gold-200" aria-hidden="true" />
                  {activity.activeBriefsTitle}
                </div>
                <div className="mt-4 grid gap-3">
                  {activity.activeBriefs.slice(0, 2).map((brief) => (
                    <Link
                      key={`${brief.title}-${brief.market}`}
                      href={`${productsHref}?category=${brief.categorySlug}`}
                      className="rounded-md border border-white/10 bg-white/[0.035] p-3 transition hover:border-gold-300/35 hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <p className="text-sm font-medium leading-5 text-white">
                        {brief.title}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {brief.market} / {brief.quantity}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs text-gold-200">
                          {brief.updated}
                        </span>
                        <Badge variant="secondary">{brief.stage}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {filteredSuppliers.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredSuppliers.map((supplier) => (
                <SupplierCard
                  key={supplier.slug}
                  supplier={supplier}
                  supplierHref={getLocalizedPath(
                    locale,
                    `/suppliers/${supplier.slug}`,
                  )}
                  labels={{
                    verified: t.common.verified,
                    moq: t.common.moq,
                    response: t.common.response,
                    viewSupplier: t.suppliers.viewSupplier,
                  }}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-white/[0.035]">
              <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <PackageSearch
                  className="size-10 text-gold-200"
                  aria-hidden="true"
                />
                <h2 className="mt-5 text-xl font-semibold text-white">
                  {t.suppliers.emptyTitle}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  {t.suppliers.emptyBody}
                </p>
                <Button asChild className="mt-6" variant="outline">
                  <Link href={suppliersHref}>{t.common.clearFilters}</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
