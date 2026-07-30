import type { Locale } from "@/lib/i18n";

type CategoryOverride = {
  name: string;
  description: string;
};

type ProductOverride = {
  title: string;
  description: string;
  category?: string;
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

const productOverrides: Record<
  Locale,
  Record<string, ProductOverride | undefined>
> = {
  en: {
    "wiring-harness-assemblies": {
      title: "Aluminum window profile sets",
      description:
        "Export-ready aluminum profile sets for window and facade programs.",
      category: "Building Materials",
    },
    "rubber-vibration-mounts": {
      title: "Thermal insulation boards",
      description:
        "Thermal insulation boards for construction and fit-out supply programs.",
      category: "Building Materials",
    },
    "aluminum-window-profile-sets": {
      title: "Aluminum window profile sets",
      description:
        "Export-ready aluminum profile sets for window and facade programs.",
      category: "Building Materials",
    },
    "thermal-insulation-boards": {
      title: "Thermal insulation boards",
      description:
        "Thermal insulation boards for construction and fit-out supply programs.",
      category: "Building Materials",
    },
  },
  fr: {
    "wiring-harness-assemblies": {
      title: "Sets de profilés aluminium pour fenêtres",
      description:
        "Sets de profilés aluminium prêts pour l’export pour programmes fenêtres et façades.",
      category: "Matériaux de bâtiments",
    },
    "rubber-vibration-mounts": {
      title: "Panneaux d’isolation thermique",
      description:
        "Panneaux d’isolation thermique pour programmes de construction et fit-out.",
      category: "Matériaux de bâtiments",
    },
    "aluminum-window-profile-sets": {
      title: "Sets de profilés aluminium pour fenêtres",
      description:
        "Sets de profilés aluminium prêts pour l’export pour programmes fenêtres et façades.",
      category: "Matériaux de bâtiments",
    },
    "thermal-insulation-boards": {
      title: "Panneaux d’isolation thermique",
      description:
        "Panneaux d’isolation thermique pour programmes de construction et fit-out.",
      category: "Matériaux de bâtiments",
    },
  },
  tr: {
    "organic-cotton-hoodie": {
      title: "Organik pamuk hoodie",
      description:
        "AB giyim programları için hazır private label organik pamuk hoodie.",
      category: "Tekstil ve Giyim",
    },
    "ribbed-jersey-basics": {
      title: "Ribana jarse basics",
      description:
        "Essentials koleksiyonları için ribana jarse kumaş ve basics.",
      category: "Tekstil ve Giyim",
    },
    "cnc-aluminum-housings": {
      title: "CNC alüminyum gövdeler",
      description:
        "Endüstriyel ekipman için hassas CNC işlenmiş alüminyum gövdeler.",
      category: "Makine ve Komponentler",
    },
    "sheet-metal-enclosures": {
      title: "Sac metal muhafazalar",
      description:
        "İhracat dokümantasyon desteğiyle özel sac metal muhafazalar.",
      category: "Makine ve Komponentler",
    },
    "stoneware-dinner-set": {
      title: "Stoneware yemek takımı",
      description:
        "Perakende ve hospitality için çağdaş stoneware yemek takımları.",
      category: "Ev ve Yaşam",
    },
    "cotton-hammam-towels": {
      title: "Pamuk hamam havluları",
      description:
        "Private label ev koleksiyonları için yumuşak pamuk hamam havluları.",
      category: "Ev ve Yaşam",
    },
    "dried-fig-retail-packs": {
      title: "Kuru incir perakende paketleri",
      description:
        "Market ve özel perakende için izlenebilir kuru incir paketleri.",
      category: "Gıda ve İçerikler",
    },
    "mediterranean-spice-blends": {
      title: "Akdeniz baharat karışımları",
      description:
        "Foodservice ve perakende paketleri için Akdeniz baharat karışımları.",
      category: "Gıda ve İçerikler",
    },
    "wiring-harness-assemblies": {
      title: "Alüminyum pencere profil setleri",
      description:
        "Pencere ve cephe programları için ihracata hazır alüminyum profil setleri.",
      category: "Yapı Malzemeleri",
    },
    "rubber-vibration-mounts": {
      title: "Isı yalıtım levhaları",
      description:
        "İnşaat ve fit-out tedarik programları için ısı yalıtım levhaları.",
      category: "Yapı Malzemeleri",
    },
    "aluminum-window-profile-sets": {
      title: "Alüminyum pencere profil setleri",
      description:
        "Pencere ve cephe programları için ihracata hazır alüminyum profil setleri.",
      category: "Yapı Malzemeleri",
    },
    "thermal-insulation-boards": {
      title: "Isı yalıtım levhaları",
      description:
        "İnşaat ve fit-out tedarik programları için ısı yalıtım levhaları.",
      category: "Yapı Malzemeleri",
    },
    "rigid-cosmetics-box": {
      title: "Sert kozmetik kutusu",
      description: "İhracata hazır finisajlı premium sert kozmetik ambalajı.",
      category: "Ambalaj",
    },
    "ecommerce-mailer-set": {
      title: "E-ticaret kargo paketi seti",
      description:
        "Modern perakende programları için markalı e-ticaret kargo paketi setleri.",
      category: "Ambalaj",
    },
  },
};

const productSlugOverrides: Record<string, string | undefined> = {
  "wiring-harness-assemblies": "aluminum-window-profile-sets",
  "rubber-vibration-mounts": "thermal-insulation-boards",
};

const supplierNameOverrides: Record<
  Locale,
  Record<string, string | undefined>
> = {
  en: {
    "bursa-auto-systems": "Bursa Building Materials",
  },
  fr: {
    "anatolia-textile-studio": "Atelier Textile Anatolie",
    "marmara-machinery-works": "Atelier Machines Marmara",
    "aegean-homeware-co": "Maison Aegean",
    "izmir-natural-foods": "Aliments Naturels Izmir",
    "bursa-auto-systems": "Matériaux de bâtiments Bursa",
    "bursa-building-materials": "Matériaux de bâtiments Bursa",
    "istanbul-packaging-lab": "Laboratoire Packaging Istanbul",
  },
  tr: {
    "anatolia-textile-studio": "Anadolu Tekstil Stüdyosu",
    "marmara-machinery-works": "Marmara Makine Atölyesi",
    "aegean-homeware-co": "Ege Ev Ürünleri",
    "izmir-natural-foods": "İzmir Doğal Gıdalar",
    "bursa-auto-systems": "Bursa Yapı Malzemeleri",
    "bursa-building-materials": "Bursa Yapı Malzemeleri",
    "istanbul-packaging-lab": "İstanbul Ambalaj Laboratuvarı",
  },
};

const supplierSlugOverrides: Record<string, string | undefined> = {
  "bursa-auto-systems": "bursa-building-materials",
};

export function getCategorySlugOverride(slug?: string | null) {
  return slug ? (categorySlugOverrides[slug] ?? slug) : "";
}

export function getCategoryOverride(locale: Locale, slug?: string | null) {
  return slug ? categoryOverrides[locale][slug] : undefined;
}

export function getProductSlugOverride(slug?: string | null) {
  return slug ? (productSlugOverrides[slug] ?? slug) : "";
}

export function getProductOverride(locale: Locale, slug?: string | null) {
  return slug ? productOverrides[locale][slug] : undefined;
}

export function getSupplierSlugOverride(slug?: string | null) {
  return slug ? (supplierSlugOverrides[slug] ?? slug) : "";
}

export function getSupplierNameOverride(locale: Locale, slug?: string | null) {
  return slug ? supplierNameOverrides[locale][slug] : undefined;
}
