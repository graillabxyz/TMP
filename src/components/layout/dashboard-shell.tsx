import Link from "next/link";
import {
  BadgeCheck,
  Boxes,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Listings", href: "/dashboard", icon: Boxes },
  { label: "RFQs", href: "/dashboard", icon: BadgeCheck },
  { label: "Messages", href: "/dashboard", icon: MessageSquare },
  { label: "Verification", href: "/dashboard", icon: ShieldCheck },
];

type DashboardShellProps = {
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
  admin?: boolean;
};

export function DashboardShell({
  children,
  eyebrow = "Supplier workspace",
  title,
  description,
  admin = false,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-surface-radial">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-charcoal-900/[0.94] p-6 lg:block">
        <Logo />
        <nav className="mt-10 grid gap-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={`${item.label}-${index}`}
                href={admin ? "/admin" : item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-white/[0.08] hover:text-white",
                  index === 0 && "bg-white/[0.08] text-white",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {admin && index > 1 ? `Admin ${item.label}` : item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="border-b border-white/10 bg-background/80 backdrop-blur-xl">
          <div className="container flex min-h-20 items-center justify-between gap-4 py-5 lg:px-8">
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
        <main className="container py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
