import Link from "next/link";

import { Logo } from "@/components/logo";
import { categories } from "@/lib/data";

const footerLinks = [
  { label: "Suppliers", href: "/suppliers" },
  { label: "Request a quote", href: "/rfq" },
  { label: "Buyer login", href: "/login" },
  { label: "Supplier onboarding", href: "/register" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-charcoal-900">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
              TMP helps European buyers discover, compare, and request quotes
              from export-ready Turkish suppliers.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Marketplace</h3>
            <div className="mt-4 grid gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition hover:text-gold-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Categories</h3>
            <div className="mt-4 grid gap-3">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.slug}
                  href="/suppliers"
                  className="text-sm text-muted-foreground transition hover:text-gold-100"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 TMP. All rights reserved.</p>
          <p>
            Built for sourcing validation, buyer trust, and supplier growth.
          </p>
        </div>
      </div>
    </footer>
  );
}
