import Link from "next/link";
import type { Metadata } from "next";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return {
    title: t.notFound.metadataTitle,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function NotFound() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-col bg-charcoal-950">
      <header className="container py-5 sm:py-6">
        <Logo href={getLocalizedPath(locale, "/")} />
      </header>
      <div className="container flex flex-1 items-center justify-center py-16">
        <div className="max-w-lg text-center">
          <p className="text-sm font-semibold text-gold-200">404</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            {t.notFound.title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            {t.notFound.body}
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:justify-center">
            <Button asChild>
              <Link href={getLocalizedPath(locale, "/")}>
                {t.notFound.cta}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={getLocalizedPath(locale, "/products")}>
                {t.notFound.browseCatalog}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
