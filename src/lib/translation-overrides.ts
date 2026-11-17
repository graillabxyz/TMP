import type { Locale } from "@/lib/i18n";

type CategoryOverride = {
  name: string;
  description: string;
};

const categoryOverrides: Record<
  Locale,
  Record<string, CategoryOverride | undefined>
> = {
  en: {
    "automotive-parts": {
      name: "Building Materials",
      description:
        "Construction materials, fixtures, surfaces, and fit-out supply.",
    },
  },
  fr: {
    "automotive-parts": {
      name: "Matériaux de bâtiments",
      description:
        "Matériaux de construction, équipements, surfaces et approvisionnement fit-out.",
    },
    "building-materials": {
      name: "Matériaux de bâtiments",
      description:
        "Matériaux de construction, équipements, surfaces et approvisionnement fit-out.",
    },
  },
  tr: {
    "textiles-apparel": {
      name: "Tekstil ve Giyim",
      description: "Private label giyim, kumaşlar ve ev tekstili.",
    },
    "machinery-components": {
      name: "Makine ve Komponentler",
      description:
        "CNC, sac metal, makine parçaları ve kalıp takımı iş ortakları.",
    },
    "home-living": {
      name: "Ev ve Yaşam",
      description: "Seramik, dekor, mobilya ve hospitality odaklı ürünler.",
    },
    "food-ingredients": {
      name: "Gıda ve İçerikler",
      description: "Akdeniz gıdaları, kuru ürünler ve private label paketler.",
    },
    "automotive-parts": {
      name: "Yapı Malzemeleri",
      description:
        "İnşaat malzemeleri, armatürler, yüzeyler ve fit-out tedariki.",
    },
    "building-materials": {
      name: "Yapı Malzemeleri",
      description:
        "İnşaat malzemeleri, armatürler, yüzeyler ve fit-out tedariki.",
    },
    packaging: {
      name: "Ambalaj",
      description:
        "Perakende kutuları, kargo paketleri, etiketler ve markalı ambalaj.",
    },
  },
};

const categorySlugOverrides: Record<string, string | undefined> = {
  "automotive-parts": "building-materials",
};

export function getCategorySlugOverride(slug?: string | null) {
  return slug ? (categorySlugOverrides[slug] ?? slug) : "";
}

export function getCategoryOverride(locale: Locale, slug?: string | null) {
  return slug ? categoryOverrides[locale][slug] : undefined;
}
