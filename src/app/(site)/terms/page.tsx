import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal-document";
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
    <LegalDocument
      badge={t.legal.termsBadge}
      contentsLabel={t.legal.contentsLabel}
      intro={t.legal.termsIntro}
      lastUpdated={t.legal.lastUpdated}
      sections={sections}
      title={t.legal.termsTitle}
    />
  );
}
