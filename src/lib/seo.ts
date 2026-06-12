import type { Metadata } from "next";

import { siteConfig } from "@/lib/constants";
import {
  defaultLocale,
  getLocalizedPath,
  locales,
  type Locale,
} from "@/lib/i18n";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: readonly string[];
  noIndex?: boolean;
  locale?: Locale;
};

const openGraphLocales: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  tr: "tr_TR",
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
  locale = defaultLocale,
}: MetadataInput): Metadata {
  const canonicalPath = getLocalizedPath(locale, path);
  const url = `${siteConfig.url}${canonicalPath}`;
  const languages = Object.fromEntries(
    locales.map((item) => [
      item,
      `${siteConfig.url}${getLocalizedPath(item, path)}`,
    ]),
  ) as Record<Locale, string>;

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
    keywords: [...keywords],
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
      languages: {
        ...languages,
        "x-default": `${siteConfig.url}${getLocalizedPath(defaultLocale, path)}`,
      },
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
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => openGraphLocales[item]),
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
