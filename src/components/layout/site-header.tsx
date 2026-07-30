import Link from "next/link";
import { ArrowRight, Factory, Search, ShieldCheck, Target } from "lucide-react";

import { CategoriesDropdown } from "@/components/layout/categories-dropdown";
import { ContactDropdown } from "@/components/layout/contact-dropdown";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";
import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";

export async function SiteHeader() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [profile, categories] = await Promise.all([
    getCurrentProfile(),
    getCategories(locale),
  ]);
  const homeHref = getLocalizedPath(locale, "/");
  const productsHref = getLocalizedPath(locale, "/products");
  const suppliersHref = getLocalizedPath(locale, "/suppliers");
  const primaryNav = [
    { label: t.nav.products, href: productsHref },
    { label: t.nav.suppliers, href: suppliersHref },
  ];
  const mobileNav = [
    ...primaryNav,
    { label: t.nav.rfq, href: getLocalizedPath(locale, "/rfq") },
  ];
  const supplierUpgradeHref = profile
    ? getLocalizedPath(locale, "/dashboard/profile")
    : `${getLocalizedPath(locale, "/register")}?next=/dashboard/profile`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal-900/[0.94] shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
      <div className="container flex min-h-14 items-center justify-between gap-2 py-2 sm:min-h-[4.25rem] sm:gap-4 sm:py-3">
        <Logo className="min-w-0" href={homeHref} />
        <form
          action={productsHref}
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
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageToggle locale={locale} />
          <ContactDropdown labels={t.contact} />
          {profile ? (
            <ProfileDropdown
              email={profile.email}
              label={t.dashboard.profile}
              signOutLabel={t.nav.logout}
              signOutHref={homeHref}
              items={[
                {
                  href: getLocalizedPath(locale, "/dashboard/profile"),
                  label: t.dashboard.profile,
                },
                {
                  href: getLocalizedPath(locale, "/dashboard"),
                  label: t.nav.dashboard,
                },
              ]}
            />
          ) : (
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href={getLocalizedPath(locale, "/login")}>
                {t.nav.login}
              </Link>
            </Button>
          )}
          {!profile && (
            <Button
              asChild
              className="h-10 shrink-0 px-3 text-sm sm:h-11 sm:px-4"
            >
              <Link href={getLocalizedPath(locale, "/register")}>
                <span className="hidden sm:inline">{t.nav.join}</span>
                <span className="sm:hidden">{t.nav.joinShort}</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <form action={productsHref} className="container flex pb-1.5 md:hidden">
        <div className="flex h-9 min-w-0 flex-1 items-center overflow-hidden rounded-md border border-white/15 bg-white/[0.075] text-white shadow-none transition focus-within:border-gold-300/50 focus-within:bg-white/[0.11]">
          <Search
            className="ml-3 size-4 shrink-0 text-gold-200"
            aria-hidden="true"
          />
          <input
            name="q"
            aria-label={t.common.search}
            placeholder={t.home.headerSearchPlaceholder}
            className="h-9 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            aria-label={t.common.search}
            className="m-0.5 size-8 shrink-0 rounded-md p-0"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </form>
      <div className="hidden border-t border-white/10 bg-black/20 md:block">
        <div className="container flex min-h-10 items-center justify-between gap-4 py-1.5">
          <nav className="flex items-center gap-1" aria-label="Marketplace">
            <CategoriesDropdown
              baseHref={productsHref}
              categories={categories}
              label={t.common.categories}
            />
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
              href={getLocalizedPath(locale, "/rfq")}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Target className="size-4 text-gold-200" aria-hidden="true" />
              {t.nav.rfq}
            </Link>
            <Link
              href={`${suppliersHref}?verified=true`}
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
        <div className="container flex items-center gap-1 py-1.5">
          {mobileNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 rounded-md px-2 py-2.5 text-center text-xs font-medium text-muted-foreground transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
