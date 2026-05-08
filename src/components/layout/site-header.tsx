import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";

export async function SiteHeader() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const nav = [
    { label: t.nav.suppliers, href: "/suppliers" },
    { label: t.nav.rfq, href: "/rfq" },
    { label: t.nav.dashboard, href: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/[0.82] backdrop-blur-xl">
      <div className="container flex h-[4.5rem] min-h-[4.5rem] items-center justify-between gap-4 py-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.08] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">{t.nav.login}</Link>
          </Button>
          <LanguageToggle locale={locale} />
          <Button asChild>
            <Link href="/register">
              {t.nav.join}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
