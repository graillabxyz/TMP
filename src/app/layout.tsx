import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo";

import "./globals.css";

export const metadata: Metadata = createMetadata({
  title: "TMP | Turkiye Market Place",
  description:
    "A premium B2B sourcing marketplace connecting European buyers with verified Turkish suppliers.",
  path: "/",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
