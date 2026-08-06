import Link from "next/link";
import { Factory, ShieldCheck, Target } from "lucide-react";

import { CategoriesDropdown } from "@/components/layout/categories-dropdown";
import { ContactDropdown } from "@/components/layout/contact-dropdown";
import { HeaderSearch } from "@/components/layout/header-search";
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
  const supplierProfileHref = getLocalizedPath(locale, "/dashboard/profile");
  const supplierUpgradeHref = profile
    ? supplierProfileHref
    : `${getLocalizedPath(locale, "/register")}?next=${encodeURIComponent(
        supplierProfileHref,
      )}`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal-900/[0.94] shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
      <div className="container flex min-h-14 items-center justify-between gap-2 py-2 sm:min-h-[4.25rem] sm:gap-4 sm:py-3">
        <Logo className="min-w-0" href={homeHref} />
        <HeaderSearch
          action={productsHref}
          label={t.common.search}
          placeholder={t.home.headerSearchPlaceholder}
          submitLabel={t.common.search}
          variant="desktop"
        />
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageToggle locale={locale} label={t.common.language} />
          <ContactDropdown labels={t.contact} />
          {profile && (
            <ProfileDropdown
              email={profile.email}
              locale={locale}
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
          )}
          {!profile && (
            <Button
              asChild
              className="h-10 shrink-0 px-3 text-sm sm:h-11 sm:px-4"
            >
              <Link href={getLocalizedPath(locale, "/register")}>
                <span className="hidden sm:inline">{t.nav.join}</span>
                <span className="sm:hidden">{t.nav.joinShort}</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
      <HeaderSearch
        action={productsHref}
        label={t.common.search}
        placeholder={t.home.headerSearchPlaceholder}
        submitLabel={t.common.search}
        variant="mobile"
      />
      <div className="hidden border-t border-white/10 bg-black/20 md:block">
        <div className="container flex min-h-10 items-center justify-between gap-4 py-1.5">
          <nav
            className="flex items-center gap-1"
            aria-label={t.common.marketplaceNavigation}
          >
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
            aria-label={t.common.buyerToolsNavigation}
          >
            <Link
              href={getLocalizedPath(locale, "/rfq")}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Target className="size-4 text-gold-200" aria-hidden="true" />
              {t.nav.rfq}
            </Link>
            <Link
              href={`${suppliersHref}?verified=1`}
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
      <nav
        className="border-t border-white/10 md:hidden"
        aria-label={t.common.mobileNavigation}
      >
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
