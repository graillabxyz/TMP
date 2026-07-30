import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  Factory,
  FileText,
  Package,
  TrendingUp,
} from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getPlatformActivity } from "@/lib/platform-activity";
import {
  formatPriceRange,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { getBreadcrumbJsonLd, getProductJsonLd } from "@/lib/structured-data";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const { slug } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    return createMetadata({
      title: t.products.detailFallbackTitle,
      description: t.products.detailFallbackDescription,
      path: `/products/${slug}`,
      locale,
    });
  }

  return createMetadata({
    title: `${product.title} ${t.products.metadataFromSupplier} ${product.supplierName} | TMP`,
    description: `${product.description} ${t.products.metadataMoq}: ${
      product.moq
        ? `${product.moq} ${t.common.units}`
        : t.common.onRequest.toLowerCase()
    }. ${t.common.supplier}: ${product.supplierName}.`,
    path: `/products/${product.slug}`,
    image: product.images[0],
    locale,
    keywords: [
      product.title,
      product.category,
      product.supplierName,
      ...t.products.detailSeoKeywords,
    ],
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const locale = await getLocale();
  const { slug } = await params;
  const t = getDictionary(locale);
  const activity = getPlatformActivity(locale);
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product, locale);
  const productsHref = getLocalizedPath(locale, "/products");
  const rfqHref = getLocalizedPath(locale, "/rfq");
  const supplierHref = getLocalizedPath(
    locale,
    `/suppliers/${product.supplierSlug}`,
  );
  const relevantBriefs = activity.activeBriefs
    .filter((brief) => brief.categorySlug === product.categorySlug)
    .slice(0, 2);
  const demandBriefs = relevantBriefs.length
    ? relevantBriefs
    : activity.activeBriefs.slice(0, 2);

  return (
    <>
      <JsonLd
        data={[
          getProductJsonLd(product, locale),
          getBreadcrumbJsonLd(
            [
              { name: t.common.home, path: "/" },
              { name: t.nav.products, path: "/products" },
              { name: product.title, path: `/products/${product.slug}` },
            ],
            locale,
          ),
        ]}
      />
      <section className="section-shell">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={productsHref}>
            <ArrowLeft aria-hidden="true" />
            {t.products.backToProducts}
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_420px]">
          <div>
            <div className="relative aspect-[16/11] overflow-hidden rounded-lg border border-white/10 bg-charcoal-800 shadow-premium">
              <Image
                src={product.images[0] ?? "/brand/tmp-logo.webp"}
                alt={product.title}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <Badge className="absolute left-5 top-5">
                {product.category}
              </Badge>
            </div>

            <div className="mt-8">
              <Badge>{t.products.productDetails}</Badge>
              <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
                {product.title}
              </h1>
              <p className="mt-5 text-base leading-8 text-muted-foreground">
                {product.description}
              </p>
            </div>
          </div>

          <aside className="grid gap-5 self-start lg:sticky lg:top-24">
            <Card className="bg-white/[0.035]">
              <CardContent className="p-6">
                <p className="text-sm text-gold-200">
                  {t.products.supplierInfo}
                </p>
                <div className="mt-4 flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-gold-300/25 bg-gold-300/10">
                    <Factory className="size-5 text-gold-100" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">
                      <Link
                        href={supplierHref}
                        className="rounded-sm underline-offset-4 transition hover:text-gold-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {product.supplierName}
                      </Link>
                    </h2>
                    {product.supplierVerified && (
                      <Badge className="mt-2" variant="success">
                        <BadgeCheck
                          className="mr-1 size-3"
                          aria-hidden="true"
                        />
                        {t.products.verified}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {t.common.moq}
                    </span>
                    <span className="font-medium text-white">
                      {product.moq
                        ? `${product.moq} ${t.common.units}`
                        : t.common.onRequest}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {t.common.price}
                    </span>
                    <span className="font-medium text-white">
                      {formatPriceRange(product, t.products.quote)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {t.common.leadTime}
                    </span>
                    <span className="font-medium text-white">
                      {product.leadTime ?? t.common.onRequest}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {t.common.category}
                    </span>
                    <span className="font-medium text-white">
                      {product.category}
                    </span>
                  </div>
                </div>

                <Button asChild className="mt-7 w-full">
                  <Link
                    href={{
                      pathname: rfqHref,
                      query: {
                        product: product.slug,
                        supplier: product.supplierSlug,
                      },
                    }}
                  >
                    {t.products.requestQuote}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.035]">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <TrendingUp
                    className="size-4 text-gold-200"
                    aria-hidden="true"
                  />
                  {activity.productDemandTitle}
                </div>
                <div className="mt-4 grid gap-3">
                  {demandBriefs.map((brief) => (
                    <div
                      key={`${brief.title}-${brief.market}`}
                      className="rounded-md border border-white/10 bg-white/[0.035] p-3"
                    >
                      <div className="flex items-start gap-3">
                        <FileText
                          className="mt-0.5 size-4 shrink-0 text-gold-200"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-sm font-medium leading-5 text-white">
                            {brief.title}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {brief.market} / {brief.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-xs text-gold-200">
                          {brief.updated}
                        </span>
                        <Badge variant="secondary">{brief.stage}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.035]">
              <CardContent className="grid gap-3 p-5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Package
                    className="size-4 text-gold-200"
                    aria-hidden="true"
                  />
                  {product.category}
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="size-4 text-gold-200" aria-hidden="true" />
                  {product.leadTime ?? t.common.leadTime}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-semibold text-white">
              {t.products.related}
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  productHref={getLocalizedPath(
                    locale,
                    `/products/${item.slug}`,
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
          </div>
        )}
      </section>
    </>
  );
}
