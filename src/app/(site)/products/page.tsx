import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronDown,
  PackageSearch,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveDetails } from "@/components/ui/responsive-details";
import { Select } from "@/components/ui/select";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getCategories, getSuppliers } from "@/lib/marketplace";
import { getPlatformActivity } from "@/lib/platform-activity";
import { getProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { getProductCollectionJsonLd } from "@/lib/structured-data";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    supplier?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.products.metadataTitle,
    description: t.products.metadataDescription,
    path: "/products",
    keywords: t.products.seoKeywords,
    locale,
  });
}

export const revalidate = 120;

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const activity = getPlatformActivity(locale);
  const query = params.q ?? "";
  const category = params.category ?? "";
  const supplier = params.supplier ?? "";
  const [categories, suppliers, products] = await Promise.all([
    getCategories(locale),
    getSuppliers(locale),
    getProducts({ locale, query, category, supplier }),
  ]);
  const productsHref = getLocalizedPath(locale, "/products");
  const rfqHref = getLocalizedPath(locale, "/rfq");

  return (
    <>
      <JsonLd
        data={getProductCollectionJsonLd(
          products,
          {
            name: t.products.metadataTitle,
            description: t.products.metadataDescription,
          },
          locale,
        )}
      />
      <section className="section-shell">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="page-intro">
            <Badge>{t.products.badge}</Badge>
            <h1 className="page-title">{t.products.title}</h1>
            <p className="page-description">{t.products.body}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-muted-foreground">
            <span className="font-semibold text-white">{products.length}</span>{" "}
            {products.length === 1
              ? t.products.indexedSingular
              : t.products.indexed}
          </div>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="grid gap-4 self-start lg:sticky lg:top-24">
            <ResponsiveDetails className="group">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between rounded-md border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-white transition hover:border-gold-300/30 hover:bg-white/[0.05] lg:hidden">
                <span className="flex items-center gap-2">
                  <SlidersHorizontal
                    className="size-4 text-gold-200"
                    aria-hidden="true"
                  />
                  {t.products.filters}
                </span>
                <ChevronDown
                  className="size-4 text-muted-foreground transition group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="mt-3 hidden group-open:block lg:mt-0 lg:block">
                <Card className="bg-white/[0.035]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <SlidersHorizontal
                        className="size-4 text-gold-200"
                        aria-hidden="true"
                      />
                      {t.products.filters}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="q">{t.common.search}</Label>
                        <div className="relative">
                          <Search
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <Input
                            id="q"
                            name="q"
                            className="pl-10"
                            defaultValue={query}
                            placeholder={t.products.searchPlaceholder}
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
                          <option value="">{t.products.allCategories}</option>
                          {categories.map((item) => (
                            <option key={item.slug} value={item.slug}>
                              {item.name}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="supplier">{t.common.supplier}</Label>
                        <Select
                          id="supplier"
                          name="supplier"
                          defaultValue={supplier}
                        >
                          <option value="">{t.products.allSuppliers}</option>
                          {suppliers.map((item) => (
                            <option key={item.slug} value={item.slug}>
                              {item.name}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="grid grid-cols-[1fr_auto] gap-2">
                        <Button type="submit">{t.common.search}</Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={productsHref}>
                            {t.common.clearFilters}
                          </Link>
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </ResponsiveDetails>
            <Card className="hidden bg-white/[0.035] lg:block">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <TrendingUp
                    className="size-4 text-gold-200"
                    aria-hidden="true"
                  />
                  {activity.demandTitle}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {activity.demandBody}
                </p>
                <div className="mt-5 grid gap-3">
                  {activity.categoryDemand.map((item) => (
                    <Link
                      key={item.categorySlug}
                      href={`${productsHref}?category=${item.categorySlug}`}
                      className="rounded-md border border-white/10 bg-white/[0.035] p-3 transition hover:border-gold-300/35 hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-white">
                          {item.label}
                        </span>
                        <Badge variant="secondary">{item.value}</Badge>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {item.detail}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  productHref={getLocalizedPath(
                    locale,
                    `/products/${product.slug}`,
                  )}
                  rfqHref={rfqHref}
                  labels={{
                    verified: t.products.verified,
                    moq: t.common.moq,
                    price: t.common.price,
                    leadTime: t.common.leadTime,
                    viewProduct: t.products.viewProduct,
                    quote: t.products.quote,
                    requestQuote: t.products.requestQuote,
                    units: t.common.units,
                    onRequest: t.common.onRequest,
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
                  {t.products.emptyTitle}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  {t.products.emptyBody}
                </p>
                <Button asChild className="mt-6" variant="outline">
                  <Link href={productsHref}>{t.common.clearFilters}</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
