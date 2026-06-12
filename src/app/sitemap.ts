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
  const localizedRoutes = routes.flatMap((route) =>
    locales.map((locale) => getLocalizedPath(locale, route || "/")),
  );

  return localizedRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
