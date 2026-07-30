import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/constants";
import { getLocalizedPath, locales } from "@/lib/i18n";

export default function robots(): MetadataRoute.Robots {
  const localizedPrivateRoutes = locales.flatMap((locale) => [
    getLocalizedPath(locale, "/dashboard/"),
    getLocalizedPath(locale, "/login"),
    getLocalizedPath(locale, "/register"),
  ]);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", ...localizedPrivateRoutes],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
