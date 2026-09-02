import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, BadgeCheck, Factory } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import {
  formatLeadTime,
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

        <div className="mb-6 max-w-4xl">
          <Badge>{t.products.productDetails}</Badge>
          <h1 className="page-title break-words">{product.title}</h1>
          <p className="page-description max-w-3xl">{product.description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_400px]">
          <ProductGallery
            category={product.category}
            images={product.images}
            productTitle={product.title}
            viewPhotoLabel={t.products.viewPhoto}
          />

          <aside className="grid gap-5 self-start lg:sticky lg:top-32">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gold-200">
                  {t.products.supplierInfo}
                </p>
                <div className="mt-4 flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-gold-300/25 bg-gold-300/10">
                    <Factory
                      className="size-5 text-gold-100"
                      aria-hidden="true"
                    />
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
                  <div className="flex min-w-0 items-start justify-between gap-4">
                    <span className="text-muted-foreground">
                      {t.common.moq}
                    </span>
                    <span className="min-w-0 text-right font-medium text-white">
                      {product.moq
                        ? `${product.moq} ${t.common.units}`
                        : t.common.onRequest}
                    </span>
                  </div>
                  <div className="flex min-w-0 items-start justify-between gap-4">
                    <span className="text-muted-foreground">
                      {t.common.price}
                    </span>
                    <span className="min-w-0 text-right font-medium text-white">
                      {formatPriceRange(product, t.products.quote)}
                    </span>
                  </div>
                  <div className="flex min-w-0 items-start justify-between gap-4">
                    <span className="text-muted-foreground">
                      {t.common.leadTime}
                    </span>
                    <span className="min-w-0 text-right font-medium text-white">
                      {formatLeadTime(
                        product.leadTimeDays,
                        t.common.days,
                        t.common.onRequest,
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 items-start justify-between gap-4">
                    <span className="text-muted-foreground">
                      {t.common.category}
                    </span>
                    <span className="min-w-0 break-words text-right font-medium text-white">
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
                    quote: t.products.quote,
                    requestQuote: t.products.requestQuote,
                    units: t.common.units,
                    days: t.common.days,
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
