import Link from "next/link";
import Image from "next/image";
import {
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
  Utensils,
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
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import {
  getCategories,
  getFeaturedSuppliers,
  getSuppliers,
} from "@/lib/marketplace";
import { getLandingHeroImage } from "@/lib/site-assets";
import { getOrganizationJsonLd, getWebsiteJsonLd } from "@/lib/structured-data";

export const revalidate = 300;

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [categories, suppliers, featuredSuppliers, profile, heroImage] =
    await Promise.all([
      getCategories(locale),
      getSuppliers(locale),
      getFeaturedSuppliers(locale),
      getCurrentProfile(),
      getLandingHeroImage(),
    ]);
  const productsHref = getLocalizedPath(locale, "/products");
  const rfqHref = getLocalizedPath(locale, "/rfq");
  const suppliersHref = getLocalizedPath(locale, "/suppliers");
  const supplierProfileHref = getLocalizedPath(locale, "/dashboard/profile");
  const supplierUpgradeHref = profile
    ? supplierProfileHref
    : `${getLocalizedPath(locale, "/register")}?next=${encodeURIComponent(
        supplierProfileHref,
      )}&intent=supplier`;
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
  const businessToolIcons = [Target, Trophy];

  return (
    <>
      <JsonLd data={[getOrganizationJsonLd(), getWebsiteJsonLd(locale)]} />
      <section className="relative isolate overflow-hidden">
        <Image
          src={heroImage}
          alt={t.home.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[72%_center] md:object-center"
        />
        <div className="from-black/72 via-black/58 absolute inset-0 -z-10 bg-gradient-to-b to-background" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.68),rgba(0,0,0,.38)_52%,rgba(0,0,0,.62))]" />
        <div className="container flex min-h-[52svh] items-center py-10 sm:min-h-[56svh] sm:py-12 lg:min-h-[560px]">
          <div className="w-full max-w-4xl animate-fade-up">
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
              id="marketplace-hero-search"
              action={productsHref}
              className="mt-8 max-w-4xl rounded-md border border-gold-300/40 bg-[#f4efe3]/[0.98] p-2 shadow-[0_20px_55px_rgba(0,0,0,0.32)]"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-charcoal-600"
                    aria-hidden="true"
                  />
                  <Input
                    name="q"
                    aria-label={t.common.search}
                    className="border-transparent bg-white/45 pl-10 text-charcoal-900 shadow-none placeholder:text-charcoal-600 hover:border-gold-300/35 focus-visible:border-gold-300 focus-visible:ring-gold-300 focus-visible:ring-offset-gold-50"
                    placeholder={t.home.searchPlaceholder}
                  />
                </div>
                <Select
                  name="category"
                  aria-label={t.common.category}
                  defaultValue=""
                  className="border-charcoal-900/10 bg-white/55 text-charcoal-900 shadow-none hover:border-gold-300/35 focus-visible:ring-offset-gold-50 [&_option]:bg-white [&_option]:text-charcoal-900"
                  iconClassName="text-charcoal-600"
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
              {categories.slice(0, 3).map((item) => (
                <Link
                  key={item.slug}
                  href={`${productsHref}?category=${item.slug}`}
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-white/15 bg-white/[0.08] px-3 py-2 text-white transition hover:border-gold-300/45 hover:text-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-card/45">
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
              {t.home.businessTools.slice(0, 2).map((tool, index) => {
                const Icon = businessToolIcons[index] ?? Target;
                const href =
                  index === 0
                    ? rfqHref
                    : index === 1
                      ? `${suppliersHref}?verified=1`
                      : productsHref;

                return (
                  <Link
                    key={tool}
                    href={href}
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-white transition hover:border-gold-300/35 hover:bg-white/[0.075] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Icon className="size-4 text-gold-200" aria-hidden="true" />
                    {tool}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
            <div className="workspace-panel p-4">
              <p className="font-semibold text-white">
                {t.home.categoriesForYou}
              </p>
              <div className="mt-4 grid gap-1">
                {categories.slice(0, 6).map((category) => {
                  const Icon = categoryIconMap[category.slug] ?? Factory;

                  return (
                    <Link
                      key={category.slug}
                      href={`${productsHref}?category=${category.slug}`}
                      className="group flex min-h-11 items-center justify-between gap-3 rounded-md px-2 py-2.5 text-sm text-muted-foreground transition hover:bg-white/[0.055] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                  className="group overflow-hidden rounded-lg border border-white/10 bg-card shadow-[0_14px_36px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:border-gold-300/35 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                  <div className="flex min-w-0 items-center justify-between gap-3 p-4 text-xs text-muted-foreground">
                    <span className="min-w-0 truncate">{product.category}</span>
                    <span className="shrink-0 text-gold-200">
                      {product.moq}
                    </span>
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
              supplierHref={getLocalizedPath(
                locale,
                `/suppliers/${supplier.slug}`,
              )}
              labels={{
                verified: t.common.verified,
                moq: t.common.moq,
                response: t.common.response,
                viewSupplier: t.suppliers.viewSupplier,
                imageAlt: t.suppliers.imageAlt,
              }}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-card/35">
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
                  {category.supplierCount > 0 && (
                    <span className="rounded-md border border-gold-300/25 bg-gold-300/10 px-2.5 py-1 text-sm text-gold-100">
                      {category.supplierCount}
                    </span>
                  )}
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
                className="transition hover:border-gold-300/25 hover:bg-secondary/80"
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

      <section className="border-y border-gold-300/20 bg-gold-300/[0.07]">
        <div className="section-shell">
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
