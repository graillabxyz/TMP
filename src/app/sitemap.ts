import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants";
import { getLocalizedPath, locales } from "@/lib/i18n";
import { getSuppliers } from "@/lib/marketplace";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [suppliers, products] = await Promise.all([
    getSuppliers(),
    getProducts(),
  ]);
  const routes = [
    "",
    "/products",
    "/suppliers",
    "/rfq",
    "/privacy",
    "/terms",
    ...products.map((product) => `/products/${product.slug}`),
    ...suppliers.map((supplier) => `/suppliers/${supplier.slug}`),
  ];
  return routes.flatMap((route) => {
    const path = route || "/";
    const languages = Object.fromEntries(
      locales.map((locale) => [
        locale,
        `${siteConfig.url}${getLocalizedPath(locale, path)}`,
      ]),
    );

    return locales.map((locale) => ({
      url: `${siteConfig.url}${getLocalizedPath(locale, path)}`,
      changeFrequency:
        route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: {
          ...languages,
          "x-default": `${siteConfig.url}${getLocalizedPath("en", path)}`,
        },
      },
    }));
  });
}
