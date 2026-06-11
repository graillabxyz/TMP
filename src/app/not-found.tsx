import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";

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
    <main className="flex min-h-screen items-center justify-center bg-surface-radial px-6">
      <div className="max-w-md text-center">
        <p className="text-sm text-gold-200">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          {t.notFound.title}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t.notFound.body}
        </p>
        <Button asChild className="mt-8">
          <Link href="/">{t.notFound.cta}</Link>
        </Button>
      </div>
    </main>
  );
}
