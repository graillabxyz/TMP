import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Factory,
  FileCheck2,
  Globe2,
  Package,
  Send,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getSupplierBySlug, getSuppliers } from "@/lib/marketplace";
import { createMetadata } from "@/lib/seo";

type SupplierDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const suppliers = await getSuppliers("en");

  return suppliers.map((supplier) => ({
    slug: supplier.slug,
  }));
}

export async function generateMetadata({
  params,
}: SupplierDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supplier = await getSupplierBySlug(slug, "en");

  if (!supplier) {
    return createMetadata({
      title: "Supplier not found | TMP",
      description: "This supplier profile is not available.",
      path: "/suppliers",
    });
  }

  return createMetadata({
    title: `${supplier.name} | TMP Supplier Profile`,
    description: supplier.summary,
    path: `/suppliers/${supplier.slug}`,
  });
}

export default async function SupplierDetailPage({
  params,
}: SupplierDetailPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supplier = await getSupplierBySlug(slug, locale);

  if (!supplier) {
    notFound();
  }

  return (
    <section className="section-shell">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/suppliers">
          <ArrowLeft aria-hidden="true" />
          {t.common.backToSuppliers}
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{supplier.category}</Badge>
            {supplier.verified && (
              <Badge variant="success">
                <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
                {t.common.verifiedSupplier}
              </Badge>
            )}
          </div>
          <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
            {supplier.name}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            {supplier.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Founded",
                localizedLabel: t.supplierDetail.founded,
                value: supplier.yearFounded,
                icon: CalendarDays,
              },
              {
                label: "Team",
                localizedLabel: t.supplierDetail.team,
                value: supplier.employees,
                icon: Users,
              },
              {
                label: "MOQ",
                localizedLabel: t.common.moq,
                value: supplier.moq,
                icon: Package,
              },
              {
                label: "Response",
                localizedLabel: t.common.response,
                value: supplier.responseTime,
                icon: Send,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
                >
                  <Icon className="size-4 text-gold-200" aria-hidden="true" />
                  <p className="mt-4 text-xs text-muted-foreground">
                    {item.localizedLabel}
                  </p>
                  <p className="mt-1 font-semibold text-white">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        <Card className="overflow-hidden bg-white/[0.035]">
          <div className="relative aspect-[4/3]">
            <Image
              src={supplier.image}
              alt={`${supplier.name} facility`}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Factory className="size-4 text-gold-200" aria-hidden="true" />
              {supplier.city}, {supplier.country}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {supplier.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button asChild className="mt-6 w-full" size="lg">
              <Link href="/rfq">
                {t.common.requestQuote}
                <Send aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-gold-200">
                {t.supplierDetail.productCatalog}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">
                {t.supplierDetail.previewProducts}
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {supplier.products.map((product) => (
              <Card
                key={product.name}
                className="overflow-hidden bg-white/[0.035] transition hover:border-gold-300/25"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  <Badge variant="secondary">{product.category}</Badge>
                  <h3 className="mt-4 font-semibold text-white">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t.common.moq}: {product.moq}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-white/[0.035]">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md border border-gold-300/25 bg-gold-300/10">
                <FileCheck2
                  className="size-5 text-gold-100"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-sm text-gold-200">
                  {t.supplierDetail.certifications}
                </p>
                <h2 className="font-semibold text-white">
                  {t.supplierDetail.licenses}
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {supplier.certifications.map((certification) => (
                <div
                  key={certification}
                  className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2
                    className="size-4 text-gold-200"
                    aria-hidden="true"
                  />
                  {certification}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg border border-white/10 bg-charcoal-800 p-4">
              <div className="flex items-center gap-2 text-sm text-white">
                <Globe2 className="size-4 text-gold-200" aria-hidden="true" />
                {t.supplierDetail.exportMarkets}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {supplier.exportMarkets.join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
