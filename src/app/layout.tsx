import type { Metadata } from "next";

import { LocaleDocumentSync } from "@/components/locale-document-sync";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.metadata.rootTitle,
    description: t.metadata.rootDescription,
    path: "/",
    locale,
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="dark">
      <body>
        <LocaleDocumentSync />
        {children}
      </body>
    </html>
  );
}
