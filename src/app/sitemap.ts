import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants";
import { suppliers } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/suppliers",
    "/rfq",
    "/login",
    "/register",
    "/dashboard",
    "/admin",
    ...suppliers.map((supplier) => `/suppliers/${supplier.slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
