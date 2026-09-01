import Link from "next/link";
import {
  BadgeCheck,
  FileText,
  LayoutDashboard,
  PackagePlus,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { ContactDropdown } from "@/components/layout/contact-dropdown";
import { HeaderSearch } from "@/components/layout/header-search";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import { getCurrentProfile, type AccountRole } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  active?: "overview" | "products" | "rfqs" | "profile" | "verification";
};

export async function DashboardShell({
  children,
  eyebrow,
  title,
  description,
  active = "overview",
}: DashboardShellProps) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const profile = await getCurrentProfile();
  const role: AccountRole = profile?.role ?? "buyer";
  const productsHref = getLocalizedPath(locale, "/products");
  const dashboardHref = getLocalizedPath(locale, "/dashboard");
  const profileHref = getLocalizedPath(locale, "/dashboard/profile");
  const verificationHref = getLocalizedPath(
    locale,
    "/dashboard/settings/verification",
  );
  const supplierNavItems = [
    {
      id: "overview",
      label: t.dashboard.overview,
      href: dashboardHref,
      icon: LayoutDashboard,
    },
    {
      id: "products",
      label: t.dashboard.products,
      href: getLocalizedPath(locale, "/dashboard/products"),
      icon: PackagePlus,
    },
    {
      id: "rfqs",
      label: t.dashboard.rfqs,
      href: `${dashboardHref}#rfqs`,
      icon: BadgeCheck,
    },
    {
      id: "profile",
      label: t.dashboard.profile,
      href: profileHref,
      icon: UserRound,
    },
    {
      id: "verification",
      label: t.dashboard.verification,
      href: verificationHref,
      icon: ShieldCheck,
    },
  ];
  const buyerNavItems = [
    {
      id: "overview",
      label: t.dashboard.overview,
      href: dashboardHref,
      icon: LayoutDashboard,
    },
    {
      id: "products",
      label: t.dashboard.products,
      href: getLocalizedPath(locale, "/dashboard/products"),
      icon: PackagePlus,
    },
    {
      id: "rfqs",
      label: t.dashboard.rfqs,
      href: `${dashboardHref}#rfqs`,
      icon: FileText,
    },
    {
      id: "suppliers",
      label: t.nav.suppliers,
      href: getLocalizedPath(locale, "/suppliers"),
      icon: Search,
    },
    {
      id: "profile",
      label: t.dashboard.profile,
      href: profileHref,
      icon: UserRound,
    },
  ];
  const navItems = role === "buyer" ? buyerNavItems : supplierNavItems;

  return (
    <div className="min-h-screen bg-surface-radial">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-gold-300 px-4 py-2 text-sm font-semibold text-charcoal-950 shadow-premium transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white"
      >
        {t.common.skipToContent}
      </a>
      <header className="sticky top-0 z-50 border-b border-white/[0.11] bg-charcoal-900/95 shadow-[0_8px_28px_rgba(0,0,0,0.18)] backdrop-blur-xl">
        <div className="container flex min-h-14 items-center justify-between gap-2 py-2 sm:min-h-[4.25rem] sm:gap-4 sm:py-3">
          <Logo className="min-w-0" href={getLocalizedPath(locale, "/")} />
          <HeaderSearch
            action={productsHref}
            label={t.common.search}
            placeholder={t.home.headerSearchPlaceholder}
            submitLabel={t.common.search}
            variant="desktop"
          />
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href={productsHref}>{t.nav.products}</Link>
            </Button>
            <LanguageToggle locale={locale} label={t.common.language} />
            <ContactDropdown labels={t.contact} />
            {profile ? (
              <ProfileDropdown
                email={profile.email}
                locale={locale}
                label={t.dashboard.profile}
                signOutLabel={t.nav.logout}
                signOutHref={getLocalizedPath(locale, "/")}
                items={[
                  {
                    href: profileHref,
                    label: t.dashboard.profile,
                  },
                  {
                    href: dashboardHref,
                    label: t.nav.dashboard,
                  },
                  {
                    href: verificationHref,
                    label: t.verificationSettings.subscription,
                  },
                ]}
              />
            ) : (
              <Button asChild variant="ghost">
                <Link href={getLocalizedPath(locale, "/login")}>
                  {t.nav.login}
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
        <div className="border-t border-white/[0.08] bg-charcoal-950/55">
          <nav
            className="container flex min-h-10 items-center gap-1 overflow-x-auto py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={t.nav.dashboard}
          >
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={item.id === active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    item.id === active &&
                      "bg-white/[0.1] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
                  )}
                >
                  <Icon className="size-4 text-gold-200" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main id="main-content" className="container py-8 sm:py-10 lg:py-12">
        <div className="mb-6 border-b border-white/10 pb-6">
          <p className="text-sm text-gold-200">{eyebrow}</p>
          <h1 className="mt-1.5 text-2xl font-semibold leading-tight text-white sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}
