import Link from "next/link";
import {
  ArrowRight,
  Factory,
  Search,
  ShieldCheck,
  Target,
  UserRound,
} from "lucide-react";

import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";

export async function SiteHeader() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [profile, categories] = await Promise.all([
    getCurrentProfile(),
    getCategories(locale),
  ]);
  const primaryNav = [
    { label: t.nav.products, href: "/products" },
    { label: t.nav.suppliers, href: "/suppliers" },
  ];
  const mobileNav = [...primaryNav, { label: t.nav.rfq, href: "/rfq" }];
  const supplierUpgradeHref = profile
    ? "/dashboard/profile"
    : "/register?next=/dashboard/profile";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal-900/[0.94] shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
      <div className="container flex min-h-[4.25rem] items-center justify-between gap-4 py-3">
        <Logo />
        <form
          action="/products"
          className="hidden h-10 min-w-0 max-w-[640px] flex-1 items-center overflow-hidden rounded-md border border-white/[0.12] bg-white/[0.065] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus-within:border-gold-300/50 focus-within:bg-white/[0.105] lg:flex"
        >
          <Search
            className="ml-3 size-4 shrink-0 text-gold-200"
            aria-hidden="true"
          />
          <input
            name="q"
            aria-label={t.common.search}
            placeholder={t.home.headerSearchPlaceholder}
            className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" className="m-1 h-8 rounded-md px-4 text-sm">
            {t.common.search}
          </Button>
        </form>
        <div className="flex items-center gap-2">
          {profile ? (
            <details className="group relative">
              <summary className="inline-flex h-11 cursor-pointer list-none items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                <UserRound
                  className="size-4 text-gold-200"
                  aria-hidden="true"
                />
                {t.dashboard.profile}
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-white/10 bg-charcoal-900 p-2 shadow-premium">
                <p className="truncate px-3 py-2 text-xs text-muted-foreground">
                  {profile.email}
                </p>
                <Link
                  href="/dashboard/profile"
                  className="block rounded-md px-3 py-2 text-sm text-white transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {t.dashboard.profile}
                </Link>
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {t.nav.dashboard}
                </Link>
              </div>
            </details>
          ) : (
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/login">{t.nav.login}</Link>
            </Button>
          )}
          <LanguageToggle locale={locale} />
          {!profile && (
            <Button asChild>
              <Link href="/register">
                {t.nav.join}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <form action="/products" className="container flex pb-3 md:hidden">
        <div className="flex h-10 min-w-0 flex-1 items-center overflow-hidden rounded-md border border-white/15 bg-white/[0.075] text-white shadow-none transition focus-within:border-gold-300/50 focus-within:bg-white/[0.11]">
          <Search
            className="ml-3 size-4 shrink-0 text-gold-200"
            aria-hidden="true"
          />
          <input
            name="q"
            aria-label={t.common.search}
            placeholder={t.home.headerSearchPlaceholder}
            className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" className="m-1 h-8 rounded-md px-3">
            {t.common.search}
          </Button>
        </div>
      </form>
      <div className="hidden border-t border-white/10 bg-black/20 md:block">
        <div className="container flex min-h-10 items-center justify-between gap-4 py-1.5">
          <nav className="flex items-center gap-1" aria-label="Marketplace">
            <details className="group relative">
              <summary className="inline-flex cursor-pointer list-none items-center rounded-md px-3 py-2 text-sm font-medium text-gold-50 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
                {t.common.categories}
              </summary>
              <div className="absolute left-0 top-full z-50 mt-2 w-[340px] overflow-hidden rounded-lg border border-white/10 bg-charcoal-900 shadow-premium">
                <div className="grid max-h-[70vh] gap-1 overflow-y-auto p-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      className="group/item grid gap-1 rounded-md px-3 py-2.5 transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span className="flex items-center justify-between gap-3 text-sm font-medium text-white">
                        {category.name}
                        <ArrowRight
                          className="size-4 text-gold-200 opacity-0 transition group-hover/item:opacity-100"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {category.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </details>
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Buyer tools"
          >
            <Link
              href="/rfq"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Target className="size-4 text-gold-200" aria-hidden="true" />
              {t.nav.rfq}
            </Link>
            <Link
              href="/suppliers?verified=true"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ShieldCheck
                className="size-4 text-gold-200"
                aria-hidden="true"
              />
              {t.common.verifiedSupplier}
            </Link>
            {!profile && (
              <Link
                href={supplierUpgradeHref}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Factory className="size-4 text-gold-200" aria-hidden="true" />
                {t.home.applySupplier}
              </Link>
            )}
          </nav>
        </div>
      </div>
      <nav className="border-t border-white/10 md:hidden" aria-label="Mobile">
        <div className="container flex items-center gap-1 py-2">
          {mobileNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 rounded-md px-2 py-3 text-center text-xs font-medium text-muted-foreground transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
