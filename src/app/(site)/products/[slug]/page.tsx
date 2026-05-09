import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, BadgeCheck, Clock3, Factory, Package } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import {
  formatPriceRange,
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/products";
import { createMetadata } from "@/lib/seo";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const locale = await getLocale();
  const { slug } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    return createMetadata({
      title: "Product | TMP",
      description: "TMP product detail.",
      path: `/products/${slug}`,
    });
  }

  return createMetadata({
    title: `${product.title} | TMP`,
    description: product.description,
    path: `/products/${product.slug}`,
  });
}

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({ slug: product.slug }));
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

  return (
    <section className="section-shell">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/products">
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
            <Badge className="absolute left-5 top-5">{product.category}</Badge>
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
              <p className="text-sm text-gold-200">{t.products.supplierInfo}</p>
              <div className="mt-4 flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-md border border-gold-300/25 bg-gold-300/10">
                  <Factory className="size-5 text-gold-100" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">
                    {product.supplierName}
                  </h2>
                  {product.supplierVerified && (
                    <Badge className="mt-2" variant="success">
                      <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
                      {t.products.verified}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">{t.common.moq}</span>
                  <span className="font-medium text-white">
                    {product.moq ? `${product.moq} units` : "On request"}
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
                    {product.leadTime ?? "On request"}
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
                <Link href="/rfq">{t.products.requestQuote}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.035]">
            <CardContent className="grid gap-3 p-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Package className="size-4 text-gold-200" aria-hidden="true" />
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
                labels={{
                  verified: t.products.verified,
                  moq: t.common.moq,
                  price: t.common.price,
                  leadTime: t.common.leadTime,
                  viewProduct: t.products.viewProduct,
                  quote: t.products.quote,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
