import { siteConfig } from "@/lib/constants";
import { defaultLocale, getLocalizedPath, type Locale } from "@/lib/i18n";
import { formatPriceRange } from "@/lib/products";
import type { MarketplaceProduct, Supplier } from "@/types";

function absoluteUrl(pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  return `${siteConfig.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function localizedAbsoluteUrl(locale: Locale, pathOrUrl: string) {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  return absoluteUrl(getLocalizedPath(locale, pathOrUrl));
}

function trimText(value: string, maxLength = 220) {
  return value.length > maxLength
    ? `${value.slice(0, maxLength - 1)}...`
    : value;
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.fullName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/brand/tmp-logo.webp"),
    description: siteConfig.description,
  };
}

export function getWebsiteJsonLd(locale: Locale = defaultLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.fullName,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${localizedAbsoluteUrl(locale, "/products")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function getBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  locale: Locale = defaultLocale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedAbsoluteUrl(locale, item.path),
    })),
  };
}

export function getProductCollectionJsonLd(
  products: MarketplaceProduct[],
  copy: { name: string; description: string } = {
    name: "Turkish supplier products",
    description:
      "Browse published Turkish supplier products for European B2B sourcing.",
  },
  locale: Locale = defaultLocale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: copy.name,
    url: localizedAbsoluteUrl(locale, "/products"),
    description: copy.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.slice(0, 24).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: localizedAbsoluteUrl(locale, `/products/${product.slug}`),
        name: product.title,
      })),
    },
  };
}

export function getSupplierCollectionJsonLd(
  suppliers: Supplier[],
  copy: { name: string; description: string } = {
    name: "Verified Turkish suppliers",
    description:
      "Browse verified Turkish suppliers by category, certifications, MOQ, and export readiness.",
  },
  locale: Locale = defaultLocale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: copy.name,
    url: localizedAbsoluteUrl(locale, "/suppliers"),
    description: copy.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: suppliers.slice(0, 24).map((supplier, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: localizedAbsoluteUrl(locale, `/suppliers/${supplier.slug}`),
        name: supplier.name,
      })),
    },
  };
}

export function getProductJsonLd(
  product: MarketplaceProduct,
  locale: Locale = defaultLocale,
) {
  const hasPrice = product.priceMin !== null || product.priceMax !== null;
  const lowPrice = product.priceMin ?? product.priceMax;
  const highPrice = product.priceMax ?? product.priceMin;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: trimText(product.description),
    image: product.images.map(absoluteUrl),
    url: localizedAbsoluteUrl(locale, `/products/${product.slug}`),
    category: product.category,
    brand: {
      "@type": "Brand",
      name: product.supplierName,
    },
    manufacturer: {
      "@type": "Organization",
      name: product.supplierName,
      url: product.supplierSlug
        ? localizedAbsoluteUrl(locale, `/suppliers/${product.supplierSlug}`)
        : undefined,
    },
    offers: hasPrice
      ? {
          "@type": "AggregateOffer",
          priceCurrency: product.currency,
          lowPrice,
          highPrice,
          offerCount: 1,
          availability: "https://schema.org/InStock",
          url: `${localizedAbsoluteUrl(locale, "/rfq")}?product=${product.slug}`,
        }
      : undefined,
    additionalProperty: [
      product.moq
        ? {
            "@type": "PropertyValue",
            name: "Minimum order quantity",
            value: `${product.moq} units`,
          }
        : null,
      product.leadTime
        ? {
            "@type": "PropertyValue",
            name: "Lead time",
            value: product.leadTime,
          }
        : null,
      {
        "@type": "PropertyValue",
        name: "Pricing model",
        value: formatPriceRange(product),
      },
    ].filter(Boolean),
  };
}

export function getSupplierJsonLd(
  supplier: Supplier,
  locale: Locale = defaultLocale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: supplier.name,
    url: localizedAbsoluteUrl(locale, `/suppliers/${supplier.slug}`),
    image: absoluteUrl(supplier.image),
    description: trimText(supplier.summary || supplier.description),
    address: {
      "@type": "PostalAddress",
      addressLocality: supplier.city,
      addressCountry: supplier.country,
    },
    foundingDate: supplier.yearFounded.toString(),
    knowsAbout: supplier.tags,
    makesOffer: supplier.products.slice(0, 12).map((product) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: product.name,
        category: product.category,
        image: absoluteUrl(product.image),
      },
      eligibleQuantity: product.moq,
    })),
    hasCredential: supplier.certifications.map((certification) => ({
      "@type": "EducationalOccupationalCredential",
      name: certification,
    })),
  };
}
