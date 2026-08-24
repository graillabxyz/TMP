import Link from "next/link";

import { Logo } from "@/components/logo";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";

export async function SiteFooter() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [categories, profile] = await Promise.all([
    getCategories(locale),
    getCurrentProfile(),
  ]);
  const supplierProfileHref = getLocalizedPath(locale, "/dashboard/profile");
  const supplierUpgradeHref = profile
    ? supplierProfileHref
    : `${getLocalizedPath(locale, "/register")}?next=${encodeURIComponent(
        supplierProfileHref,
      )}&intent=supplier`;
  const footerLinks = [
    { label: t.footer.suppliers, href: getLocalizedPath(locale, "/suppliers") },
    { label: t.footer.rfq, href: getLocalizedPath(locale, "/rfq") },
    { label: t.nav.join, href: getLocalizedPath(locale, "/register") },
    { label: t.footer.contact, href: "mailto:o.biyik@outlook.fr" },
    {
      label: t.footer.supplierOnboarding,
      href: supplierUpgradeHref,
    },
    { label: t.footer.privacy, href: getLocalizedPath(locale, "/privacy") },
    { label: t.footer.terms, href: getLocalizedPath(locale, "/terms") },
  ];

  return (
    <footer className="border-t border-white/10 bg-charcoal-900">
      <div className="container py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_.8fr]">
          <div>
            <Logo href={getLocalizedPath(locale, "/")} />
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
                  className="flex min-h-11 items-center rounded-sm text-sm leading-5 text-muted-foreground transition hover:text-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`${getLocalizedPath(locale, "/suppliers")}?category=${category.slug}`}
                  className="flex min-h-11 items-center rounded-sm text-sm leading-5 text-muted-foreground transition hover:text-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
          <p className="shrink-0">{t.footer.rights}</p>
          <p className="max-w-lg sm:text-right">{t.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
