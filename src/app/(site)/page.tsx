import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Factory,
  Globe2,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { SupplierCard } from "@/components/supplier-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { heroImage, trustMetrics } from "@/lib/data";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getCategories, getSuppliers } from "@/lib/marketplace";

export const revalidate = 300;

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [categories, suppliers] = await Promise.all([
    getCategories(locale),
    getSuppliers(locale),
  ]);
  const featuredSuppliers = suppliers
    .filter((supplier) => supplier.verified)
    .slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Image
          src={heroImage}
          alt="Modern manufacturing floor for Turkish export suppliers"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/70 to-background" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(216,174,70,0.22),transparent_32rem)]" />

        <div className="container flex min-h-[88svh] flex-col justify-center py-16 sm:py-20">
          <div className="max-w-4xl animate-fade-up">
            <Badge>
              <Sparkles className="mr-1 size-3" aria-hidden="true" />
              {t.home.badge}
            </Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold text-white sm:text-6xl lg:text-7xl">
              {t.home.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.78] sm:text-xl">
              {t.home.subtitle}
            </p>

            <form
              action="/products"
              className="mt-9 max-w-4xl rounded-lg border border-white/[0.15] bg-black/[0.42] p-3 shadow-premium backdrop-blur-xl"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gold-200"
                    aria-hidden="true"
                  />
                  <Input
                    name="q"
                    className="pl-10"
                    placeholder={t.home.searchPlaceholder}
                  />
                </div>
                <Select name="category" defaultValue="">
                  <option value="">{t.home.allCategories}</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <Button type="submit" size="lg">
                  {t.home.startSourcing}
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </form>

            <div className="mt-9 grid max-w-3xl grid-cols-3 gap-3">
              {trustMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-white/10 bg-white/[0.055] p-4 backdrop-blur-md"
                >
                  <p className="text-2xl font-semibold text-white">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {t.home.trustMetrics[index]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-gold-200">{t.home.featuredSuppliers}</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
              {t.home.featuredTitle}
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/suppliers">{t.home.exploreSuppliers}</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredSuppliers.map((supplier) => (
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
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm text-gold-200">
                {t.home.featuredCategories}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                {t.home.categoriesTitle}
              </h2>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              {t.home.categoriesBody}
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                href={`/products?category=${category.slug}`}
                key={category.slug}
                className="group rounded-lg border border-white/10 bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-gold-300/[0.35] hover:bg-white/[0.055]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">
                      {category.name}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <span className="rounded-md border border-gold-300/25 bg-gold-300/10 px-2.5 py-1 text-sm text-gold-100">
                    {category.supplierCount}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: t.home.benefitVerificationTitle,
              body: t.home.benefitVerificationBody,
            },
            {
              icon: Globe2,
              title: t.home.benefitEuropeTitle,
              body: t.home.benefitEuropeBody,
            },
            {
              icon: Factory,
              title: t.home.benefitGrowthTitle,
              body: t.home.benefitGrowthBody,
            },
          ].map((benefit) => {
            const Icon = benefit.icon;

            return (
              <Card
                key={benefit.title}
                className="bg-white/[0.035] transition hover:border-gold-300/25"
              >
                <CardContent className="p-6">
                  <div className="flex size-11 items-center justify-center rounded-md border border-gold-300/25 bg-gold-300/10 text-gold-100">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {benefit.body}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="section-shell pt-0">
        <div className="relative overflow-hidden rounded-lg border border-gold-300/20 bg-gold-300/[0.08] p-8 shadow-glow sm:p-10 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-px bg-gold-line" />
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Badge variant="outline">
                <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
                {t.home.verificationBadge}
              </Badge>
              <h2 className="mt-5 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
                {t.home.verificationTitle}
              </h2>
              <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                {t.home.verificationItems.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2
                      className="size-4 text-gold-200"
                      aria-hidden="true"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">
                {t.home.applySupplier}
                <Building2 aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
