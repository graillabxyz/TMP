import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  Cog,
  Factory,
  Globe2,
  Package,
  Search,
  ShieldCheck,
  Shirt,
  Sparkles,
  Target,
  Trophy,
  Truck,
  Utensils,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { SupplierCard } from "@/components/supplier-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getCurrentProfile } from "@/lib/account";
import { heroImage, trustMetrics } from "@/lib/data";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getCategories, getSuppliers } from "@/lib/marketplace";
import { getPlatformActivity } from "@/lib/platform-activity";
import { getOrganizationJsonLd, getWebsiteJsonLd } from "@/lib/structured-data";

export const revalidate = 300;

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const activity = getPlatformActivity(locale);
  const [categories, suppliers, profile] = await Promise.all([
    getCategories(locale),
    getSuppliers(locale),
    getCurrentProfile(),
  ]);
  const productsHref = getLocalizedPath(locale, "/products");
  const rfqHref = getLocalizedPath(locale, "/rfq");
  const suppliersHref = getLocalizedPath(locale, "/suppliers");
  const supplierUpgradeHref = profile
    ? getLocalizedPath(locale, "/dashboard/profile")
    : `${getLocalizedPath(locale, "/register")}?next=/dashboard/profile`;
  const featuredSuppliers = suppliers
    .filter((supplier) => supplier.verified)
    .slice(0, 3);
  const categoryIconMap: Record<string, LucideIcon> = {
    "textiles-apparel": Shirt,
    "machinery-components": Cog,
    "home-living": Building2,
    "food-ingredients": Utensils,
    "automotive-parts": Building2,
    "building-materials": Building2,
    packaging: Package,
  };
  const previewProducts = suppliers.flatMap((supplier) =>
    supplier.products.map((product) => ({
      ...product,
      supplierName: supplier.name,
      supplierSlug: supplier.slug,
    })),
  );
  const frequentlySearched = previewProducts.slice(0, 3);
  const recommendedProducts = previewProducts.slice(3, 8);
  const businessToolIcons = [Target, Trophy, WandSparkles];

  return (
    <>
      <JsonLd data={[getOrganizationJsonLd(), getWebsiteJsonLd()]} />
      <section className="relative isolate overflow-hidden">
        <Image
          src={heroImage}
          alt={t.home.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[72%_center] opacity-90 md:object-center"
        />
        <div className="from-black/88 via-black/72 absolute inset-0 -z-10 bg-gradient-to-b to-background" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.78),rgba(0,0,0,.52)_52%,rgba(0,0,0,.76))]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_24%_28%,rgba(216,174,70,0.19),transparent_30rem)]" />

        <div className="container grid min-h-[52svh] gap-8 py-10 sm:min-h-[56svh] sm:py-12 lg:min-h-[560px] lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div className="max-w-4xl animate-fade-up">
            <Badge>
              <Sparkles className="mr-1 size-3" aria-hidden="true" />
              {t.home.badge}
            </Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)] sm:text-5xl">
              {t.home.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/[0.88] drop-shadow-[0_1px_16px_rgba(0,0,0,0.55)] sm:text-lg">
              {t.home.subtitle}
            </p>

            <form
              action={productsHref}
              className="mt-8 max-w-4xl rounded-md border border-gold-300/35 bg-gold-50/[0.98] p-2 shadow-premium"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-charcoal-600"
                    aria-hidden="true"
                  />
                  <Input
                    name="q"
                    className="border-transparent bg-white/45 pl-10 text-charcoal-900 shadow-none placeholder:text-charcoal-600 hover:border-gold-300/35 focus-visible:border-gold-300 focus-visible:ring-gold-300 focus-visible:ring-offset-gold-50"
                    placeholder={t.home.searchPlaceholder}
                  />
                </div>
                <Select
                  name="category"
                  defaultValue=""
                  className="border-charcoal-900/10 bg-white/55 text-charcoal-900 shadow-none hover:border-gold-300/35 focus-visible:ring-offset-gold-50 [&_option]:bg-white [&_option]:text-charcoal-900"
                >
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

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/70">
              <span>{t.home.popularSearches}</span>
              {activity.categoryDemand.map((item) => (
                <Link
                  key={item.categorySlug}
                  href={`${productsHref}?category=${item.categorySlug}`}
                  className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-2 text-white transition hover:border-gold-300/45 hover:text-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
              {trustMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="rounded-md border border-white/10 bg-background/45 p-4 backdrop-blur-md"
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

          <aside className="hidden rounded-lg border border-white/10 bg-background/70 p-5 shadow-premium backdrop-blur-xl lg:block">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Activity className="size-4 text-gold-200" aria-hidden="true" />
                {t.home.liveBoard}
              </div>
              <Badge variant="secondary">{activity.stats[0]?.detail}</Badge>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {activity.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-md border border-white/10 bg-white/[0.04] p-3"
                >
                  <p className="text-lg font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-2">
              {activity.activeBriefs.slice(0, 3).map((brief) => (
                <Link
                  key={`${brief.title}-${brief.market}`}
                  href={`${productsHref}?category=${brief.categorySlug}`}
                  className="rounded-md border border-white/10 bg-white/[0.035] p-3 transition hover:border-gold-300/35 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 text-sm font-medium leading-5 text-white">
                      {brief.title}
                    </p>
                    <span className="shrink-0 text-[11px] text-gold-200">
                      {brief.updated}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {brief.market} / {brief.quantity}
                  </p>
                </Link>
              ))}
            </div>
            <Button asChild className="mt-5 w-full">
              <Link href={rfqHref}>
                {t.common.requestQuote}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </aside>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.018))]">
        <div className="container py-10 sm:py-12 lg:py-14">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-gold-200">
                {t.home.marketplaceWelcome}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {t.home.recommendedForBusiness}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {t.home.businessTools.map((tool, index) => {
                const Icon = businessToolIcons[index] ?? Target;
                const href =
                  index === 0
                    ? "/rfq"
                    : index === 1
                      ? "/suppliers?verified=true"
                      : "/products";

                return (
                  <Link
                    key={tool}
                    href={href}
                    className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-white transition hover:border-gold-300/35 hover:bg-white/[0.075] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Icon className="size-4 text-gold-200" aria-hidden="true" />
                    {tool}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr_290px]">
            <div className="rounded-lg border border-white/10 bg-background/70 p-4 shadow-premium">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">
                  {t.home.categoriesForYou}
                </p>
                <ChevronRight
                  className="size-4 text-gold-200"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-4 grid gap-1">
                {categories.slice(0, 6).map((category) => {
                  const Icon = categoryIconMap[category.slug] ?? Factory;

                  return (
                    <Link
                      key={category.slug}
                      href={`${productsHref}?category=${category.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-md px-2 py-2.5 text-sm text-muted-foreground transition hover:bg-white/[0.055] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon
                          className="size-4 shrink-0 text-gold-200"
                          aria-hidden="true"
                        />
                        <span className="truncate">{category.name}</span>
                      </span>
                      <ChevronRight
                        className="size-4 shrink-0 opacity-45 transition group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {frequentlySearched.map((product) => (
                <Link
                  key={`${product.supplierSlug}-${product.name}`}
                  href={`${productsHref}?q=${encodeURIComponent(product.name)}`}
                  className="group overflow-hidden rounded-lg border border-white/10 bg-background/70 shadow-premium transition hover:-translate-y-0.5 hover:border-gold-300/35 hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="p-4">
                    <p className="text-sm font-semibold text-white">
                      {t.home.frequentlySearched}
                    </p>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {product.name}
                    </p>
                  </div>
                  <div className="relative mx-4 aspect-square overflow-hidden rounded-md bg-white/[0.92]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4 text-xs text-muted-foreground">
                    <span>{product.category}</span>
                    <span className="text-gold-200">{product.moq}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="rounded-lg border border-white/10 bg-background/70 p-5 shadow-premium">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Activity className="size-4 text-gold-200" aria-hidden="true" />
                {activity.activeBriefsTitle}
              </div>
              <div className="mt-4 grid gap-3">
                {activity.activeBriefs.slice(0, 2).map((brief) => (
                  <Link
                    key={`${brief.title}-${brief.market}`}
                    href={`${productsHref}?category=${brief.categorySlug}`}
                    className="rounded-md border border-white/10 bg-white/[0.035] p-3 transition hover:border-gold-300/35 hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <p className="line-clamp-2 text-sm font-medium text-white">
                      {brief.title}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {brief.market} / {brief.quantity}
                    </p>
                  </Link>
                ))}
              </div>
              <Button asChild className="mt-5 w-full" variant="outline">
                <Link href={rfqHref}>
                  {t.common.requestQuote}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="h-px w-16 bg-white/10" />
              {t.home.recommendedForBusiness}
              <span className="h-px w-16 bg-white/10" />
            </div>
            <div className="mt-4 grid gap-5 rounded-lg border border-gold-300/20 bg-[linear-gradient(135deg,rgba(216,174,70,.14),rgba(255,255,255,.035))] p-5 shadow-glow lg:grid-cols-[.78fr_1.22fr] lg:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Truck className="size-5 text-gold-200" aria-hidden="true" />
                  <h3 className="text-2xl font-semibold text-white">
                    {t.home.guaranteedTitle}
                  </h3>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-white/80">
                  {t.home.guaranteedItems.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2
                        className="size-4 text-gold-200"
                        aria-hidden="true"
                      />
                      {item}
                    </div>
                  ))}
                </div>
                <Button asChild className="mt-5" variant="outline">
                  <Link href={productsHref}>{t.home.exploreNow}</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {recommendedProducts.map((product) => (
                  <Link
                    key={`${product.supplierSlug}-${product.name}`}
                    href={`${productsHref}?q=${encodeURIComponent(product.name)}`}
                    className="group min-w-0 rounded-md border border-white/10 bg-background/55 p-2 transition hover:border-gold-300/30 hover:bg-background/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-md bg-white">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 12vw, (min-width: 640px) 28vw, 45vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm font-medium leading-5 text-white">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-gold-200">{product.moq}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div>
              <p className="flex items-center gap-2 text-sm text-gold-200">
                <Activity className="size-4" aria-hidden="true" />
                {activity.pulseEyebrow}
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
                {activity.pulseTitle}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                {activity.pulseBody}
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {activity.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-white/10 bg-card p-4"
                  >
                    <p className="text-2xl font-semibold text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-xs text-gold-200">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <p className="text-sm font-medium text-white">
                {activity.activeBriefsTitle}
              </p>
              {activity.activeBriefs.map((brief) => (
                <Link
                  key={`${brief.title}-${brief.market}`}
                  href={`${productsHref}?category=${brief.categorySlug}`}
                  className="rounded-lg border border-white/10 bg-card p-4 transition hover:border-gold-300/35 hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium text-white">{brief.title}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {brief.market} / {brief.quantity}
                      </p>
                    </div>
                    <Badge variant="secondary">{brief.stage}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gold-200">
                      {brief.updated}
                    </span>
                    {brief.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Link>
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
            <Link href={suppliersHref}>{t.home.exploreSuppliers}</Link>
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
                viewSupplier: t.suppliers.viewSupplier,
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
                href={`${productsHref}?category=${category.slug}`}
                key={category.slug}
                className="group rounded-lg border border-white/10 bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-gold-300/[0.35] hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
              <Link href={supplierUpgradeHref}>
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
