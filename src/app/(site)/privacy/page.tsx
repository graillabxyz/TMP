import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal-document";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.legal.privacyMetadataTitle,
    description: t.legal.privacyMetadataDescription,
    path: "/privacy",
    locale,
  });
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const sections = t.legal.privacySections;

  return (
    <LegalDocument
      badge={t.legal.privacyBadge}
      contentsLabel={t.legal.contentsLabel}
      intro={t.legal.privacyIntro}
      lastUpdated={t.legal.lastUpdated}
      sections={sections}
      title={t.legal.privacyTitle}
    />
  );
}
