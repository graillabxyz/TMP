import Link from "next/link";
import type { Metadata } from "next";
import { House } from "lucide-react";

import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const homeHref = getLocalizedPath(locale, "/");

  return (
    <main className="min-h-screen bg-surface-radial">
      <div className="container flex min-h-screen flex-col">
        <header className="flex min-w-0 items-center justify-between gap-2 py-5 sm:py-6">
          <Logo href={homeHref} />
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageToggle locale={locale} label={t.common.language} />
            <Button
              asChild
              variant="ghost"
              aria-label={t.nav.backHome}
              className="size-11 px-0 sm:w-auto sm:px-4"
            >
              <Link href={homeHref}>
                <House className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t.nav.backHome}</span>
              </Link>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center py-10">
          {children}
        </div>
      </div>
    </main>
  );
}
