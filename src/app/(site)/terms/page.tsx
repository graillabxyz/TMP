import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.legal.termsMetadataTitle,
    description: t.legal.termsMetadataDescription,
    path: "/terms",
    locale,
  });
}

export default async function TermsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const sections = t.legal.termsSections;

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-4xl">
        <Badge>{t.legal.termsBadge}</Badge>
        <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
          {t.legal.termsTitle}
        </h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          {t.legal.lastUpdated} {t.legal.termsIntro}
        </p>

        <div className="mt-10 grid gap-5">
          {sections.map(([title, body]) => (
            <section
              key={title}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
            >
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
