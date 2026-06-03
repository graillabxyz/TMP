import type { Metadata } from "next";

import { siteConfig } from "@/lib/constants";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description,
  path,
  image = "/og-image.png",
  keywords = [
    "Turkish suppliers",
    "B2B sourcing",
    "Turkiye marketplace",
    "European buyers",
    "verified suppliers",
    "RFQ marketplace",
  ],
  noIndex = false,
}: MetadataInput): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.fullName,
    creator: siteConfig.fullName,
    publisher: siteConfig.fullName,
    verification: {
      google: "IUInKJicteofYWu3lNPzvDhN4UKwVbU6o7DIY0IbDjE",
    },
    title,
    description,
    keywords,
    icons: {
      icon: [
        {
          url: "/brand/tmp-logo-small.png",
          type: "image/png",
        },
      ],
      apple: "/brand/tmp-logo-small.png",
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.fullName,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
