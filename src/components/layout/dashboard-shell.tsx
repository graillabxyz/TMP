import Link from "next/link";
import {
  BadgeCheck,
  FileText,
  LayoutDashboard,
  PackagePlus,
  Search,
  ShieldCheck,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { getCurrentProfile, type AccountRole } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  active?: "overview" | "products" | "rfqs" | "verification";
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
  const supplierNavItems = [
    {
      id: "overview",
      label: t.dashboard.overview,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "products",
      label: t.dashboard.products,
      href: "/dashboard/products",
      icon: PackagePlus,
    },
    {
      id: "rfqs",
      label: t.dashboard.rfqs,
      href: "/dashboard#rfqs",
      icon: BadgeCheck,
    },
    {
      id: "verification",
      label: t.dashboard.verification,
      href: "/dashboard/settings/verification",
      icon: ShieldCheck,
    },
  ];
  const buyerNavItems = [
    {
      id: "overview",
      label: t.dashboard.overview,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "rfqs",
      label: t.dashboard.rfqs,
      href: "/dashboard#rfqs",
      icon: FileText,
    },
    {
      id: "suppliers",
      label: t.nav.suppliers,
      href: "/suppliers",
      icon: Search,
    },
  ];
  const navItems = role === "supplier" ? supplierNavItems : buyerNavItems;

  return (
    <div className="min-h-screen bg-surface-radial">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-charcoal-900/[0.94] p-6 lg:block">
        <Logo />
        <nav className="mt-10 grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={item.id === active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  item.id === active && "bg-white/[0.08] text-white",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="border-b border-white/10 bg-background/80 backdrop-blur-xl">
          <div className="flex min-h-20 w-full items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
            <div className="lg:hidden">
              <Logo compact />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gold-200">{eyebrow}</p>
              <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </header>
        <main className="w-full px-4 py-8 sm:px-6 lg:px-8 xl:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
