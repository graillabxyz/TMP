import type { Metadata } from "next";

import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = createMetadata({
  title: "TMP | Turkiye Market Place",
  description:
    "A premium B2B sourcing marketplace connecting European buyers with verified Turkish suppliers.",
  path: "/",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="dark">
      <body>{children}</body>
    </html>
  );
}
