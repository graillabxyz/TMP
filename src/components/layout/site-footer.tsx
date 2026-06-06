import Link from "next/link";

import { Logo } from "@/components/logo";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";

export async function SiteFooter() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const categories = await getCategories(locale);
  const footerLinks = [
    { label: t.footer.suppliers, href: "/suppliers" },
    { label: t.footer.rfq, href: "/rfq" },
    { label: t.footer.buyerLogin, href: "/login" },
    {
      label: t.footer.supplierOnboarding,
      href: "/register?intent=supplier&next=/dashboard/settings/verification",
    },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ];

  return (
    <footer className="border-t border-white/10 bg-charcoal-900">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
              {t.footer.intro}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t.common.marketplace}
            </h3>
            <div className="mt-4 grid gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-sm text-sm text-muted-foreground transition hover:text-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t.common.categories}
            </h3>
            <div className="mt-4 grid gap-3">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.slug}
                  href={`/suppliers?category=${category.slug}`}
                  className="rounded-sm text-sm text-muted-foreground transition hover:text-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.rights}</p>
          <p>{t.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
