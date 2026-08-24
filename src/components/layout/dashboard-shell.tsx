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
import { ProfileDropdown } from "@/components/layout/profile-dropdown";
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
      <header className="sticky top-0 z-50 border-b border-white/10 bg-charcoal-900/[0.94] shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
        <div className="container flex min-h-[4.25rem] items-center justify-between gap-4 py-3">
          <Logo href={getLocalizedPath(locale, "/")} />
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
          <div className="flex items-center gap-1 sm:gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href={productsHref}>{t.nav.products}</Link>
            </Button>
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
        <form action={productsHref} className="container flex pb-3 md:hidden">
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
        <div className="border-t border-white/10 bg-black/20">
          <nav
            className="container flex min-h-10 items-center gap-1 overflow-x-auto py-1.5"
            aria-label="Dashboard"
          >
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={item.id === active ? "page" : undefined}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    item.id === active && "bg-white/[0.08] text-white",
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
      <main className="container py-6 sm:py-8 lg:py-10">
        <div className="mb-5 border-b border-white/10 pb-5">
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
