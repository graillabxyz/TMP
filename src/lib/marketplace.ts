import {
  categories as mockCategories,
  suppliers as mockSuppliers,
} from "@/lib/data";
import { getDictionary } from "@/lib/dictionary";
import {
  localizedArray,
  localizedValue,
  type Locale,
  defaultLocale,
} from "@/lib/i18n";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Category, ProductPreview, Supplier } from "@/types";

type CategoryRow = {
  id: string;
  name: string;
  name_fr: string | null;
  slug: string;
  description: string;
  description_fr: string | null;
  supplier_count?: number;
};

type SupplierProductRow = {
  title: string;
  title_fr: string | null;
  moq: number | null;
  images: string[];
  category: { name: string; name_fr: string | null } | null;
};

type SupplierRow = {
  slug: string;
  company_name: string;
  company_name_fr: string | null;
  city: string;
  country: string;
  summary: string;
  summary_fr: string | null;
  description: string;
  description_fr: string | null;
  verified: boolean;
  year_founded: number | null;
  employees: string;
  export_markets: string[];
  moq: string;
  response_time: string;
  image_url: string;
  tags: string[];
  tags_fr: string[];
  certifications: string[];
  certifications_fr: string[];
  verification_status: "none" | "pending" | "verified" | "rejected";
  category:
    | { name: string; name_fr: string | null }
    | { name: string; name_fr: string | null }[]
    | null;
  products: SupplierProductRow[] | null;
};

const trCategoryCopy: Record<string, Pick<Category, "name" | "description">> = {
  "textiles-apparel": {
    name: "Tekstil ve Giyim",
    description: "Private label giyim, kumaşlar ve ev tekstili.",
  },
  "machinery-components": {
    name: "Makine ve Komponentler",
    description: "CNC, sac metal, makine parçaları ve kalıp takımı iş ortakları.",
  },
  "home-living": {
    name: "Ev ve Yaşam",
    description: "Seramik, dekor, mobilya ve hospitality odaklı ürünler.",
  },
  "food-ingredients": {
    name: "Gıda ve İçerikler",
    description: "Akdeniz gıdaları, kuru ürünler ve private label paketler.",
  },
  "building-materials": {
    name: "Yapı Malzemeleri",
    description: "İnşaat malzemeleri, armatürler, yüzeyler ve fit-out tedariki.",
  },
  packaging: {
    name: "Ambalaj",
    description: "Perakende kutuları, kargo paketleri, etiketler ve markalı ambalaj.",
  },
};

const trSupplierCopy: Record<
  string,
  Partial<
    Pick<
      Supplier,
      | "name"
      | "country"
      | "category"
      | "summary"
      | "description"
      | "exportMarkets"
      | "moq"
      | "responseTime"
      | "tags"
      | "certifications"
    >
  > & { products?: ProductPreview[] }
> = {
  "anatolia-textile-studio": {
    name: "Anadolu Tekstil Stüdyosu",
    country: "Türkiye",
    category: "Tekstil ve Giyim",
    summary:
      "Premium triko, private label basics ve ihracata hazır giyim üretimi.",
    description:
      "Denetlenmiş üretim hatları ve hızlı numune kapasitesiyle Avrupa moda, iş giyimi ve basic markalarına hizmet veren dikey entegre tekstil partneri.",
    exportMarkets: ["Almanya", "Hollanda", "Fransa"],
    moq: "300 adet",
    responseTime: "12 saatten kısa",
    tags: ["Private label", "OEKO-TEX", "Triko"],
    certifications: ["OEKO-TEX Standard 100", "ISO 9001", "BSCI denetimi"],
    products: [
      {
        name: "Organik pamuk hoodie",
        category: "Giyim",
        moq: "500 adet",
        image:
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Ribana jarse basics",
        category: "Kumaş",
        moq: "250 kg",
        image:
          "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  "marmara-machinery-works": {
    name: "Marmara Makine Atölyesi",
    country: "Türkiye",
    category: "Makine ve Komponentler",
    summary: "AB alıcıları için CNC işlenmiş komponentler ve endüstriyel montajlar.",
    description:
      "Endüstriyel ekipman üreticileri için CNC, lazer kesim ve montaj kapasitesine sahip hassas üretim partneri.",
    exportMarkets: ["İtalya", "Avusturya", "Polonya"],
    moq: "Proje bazlı",
    responseTime: "24 saatten kısa",
    tags: ["CNC", "ISO 9001", "Özel takım"],
    certifications: ["ISO 9001", "CE dokümantasyon desteği", "EN 1090 partneri"],
    products: [
      {
        name: "CNC alüminyum gövdeler",
        category: "Komponentler",
        moq: "100 adet",
        image:
          "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Sac metal muhafazalar",
        category: "Endüstriyel",
        moq: "75 adet",
        image:
          "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  "aegean-homeware-co": {
    name: "Ege Ev Ürünleri",
    country: "Türkiye",
    category: "Ev ve Yaşam",
    summary: "Perakendeciler için seramik, tekstil ve çağdaş ev ürünleri.",
    description:
      "Bölgesel zanaatı modern üretim planlamasıyla birleştiren, butik perakende ve hospitality gruplarına yönelik tasarım odaklı ev ürünleri tedarikçisi.",
    exportMarkets: ["İspanya", "Danimarka", "İsveç"],
    moq: "150 set",
    responseTime: "18 saatten kısa",
    tags: ["Seramik", "Hospitality", "Tasarım odaklı"],
    certifications: ["Gıda temas uyumu", "Sedex üyesi", "REACH desteği"],
    products: [
      {
        name: "Stoneware yemek takımı",
        category: "Seramik",
        moq: "200 set",
        image:
          "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Pamuk hamam havluları",
        category: "Ev tekstili",
        moq: "400 adet",
        image:
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  "izmir-natural-foods": {
    name: "İzmir Doğal Gıdalar",
    country: "Türkiye",
    category: "Gıda ve İçerikler",
    summary: "Kuru meyve, kuruyemiş, baharat ve perakendeye hazır Akdeniz ürünleri.",
    description:
      "İzlenebilir tedarik, AB etiket desteği ve market alıcıları için esnek private label ambalaj sunan ihracat odaklı gıda üreticisi.",
    exportMarkets: ["Belçika", "Birleşik Krallık", "Çekya"],
    moq: "1 palet",
    responseTime: "24 saatten kısa",
    tags: ["Private label", "Perakende paketler", "İzlenebilir"],
    certifications: ["BRCGS beklemede", "Helal", "Organik hatlar mevcut"],
    products: [
      {
        name: "Kuru incir perakende paketleri",
        category: "Gıda",
        moq: "1.200 paket",
        image:
          "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Akdeniz baharat karışımları",
        category: "İçerikler",
        moq: "300 kg",
        image:
          "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  "bursa-building-materials": {
    name: "Bursa Yapı Malzemeleri",
    country: "Türkiye",
    category: "Yapı Malzemeleri",
    summary: "Cephe sistemleri, yalıtım, armatürler ve fit-out malzeme tedariki.",
    description:
      "Alüminyum profiller, yalıtım levhaları, hırdavat ve ihracata hazır fit-out programları için Bursa bölgesi kapasitesine sahip yapı malzemeleri tedarikçisi.",
    exportMarkets: ["Romanya", "Almanya", "Macaristan"],
    moq: "1 konteyner",
    responseTime: "24 saatten kısa",
    tags: ["Cephe sistemleri", "Fit-out tedariki", "Konteyner yükleri"],
    certifications: ["ISO 9001", "CE işaretli hatlar", "Yangına dayanımlı seçenekler"],
    products: [
      {
        name: "Alüminyum pencere profil setleri",
        category: "Yapı Malzemeleri",
        moq: "1 konteyner",
        image:
          "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Isı yalıtım levhaları",
        category: "İnşaat",
        moq: "20 palet",
        image:
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  "istanbul-packaging-lab": {
    name: "İstanbul Ambalaj Laboratuvarı",
    country: "Türkiye",
    category: "Ambalaj",
    summary: "Premium kutular, e-ticaret kargo paketleri, etiketler ve perakende ambalaj.",
    description:
      "Hızlı prototipleme ve ihracata hazır kaliteli finisaj isteyen e-ticaret, kozmetik ve gıda markaları için modern ambalaj partneri.",
    exportMarkets: ["Fransa", "İrlanda", "Portekiz"],
    moq: "1.000 adet",
    responseTime: "8 saatten kısa",
    tags: ["FSC kağıt", "Düşük MOQ", "Hızlı numune"],
    certifications: ["FSC malzeme mevcut", "ISO 14001 yol haritası"],
    products: [
      {
        name: "Sert kozmetik kutusu",
        category: "Ambalaj",
        moq: "1.000 adet",
        image:
          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "E-ticaret kargo paketi seti",
        category: "Ambalaj",
        moq: "2.500 adet",
        image:
          "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
};

function localizeMockCategories(locale: Locale) {
  if (locale !== "tr") {
    return mockCategories;
  }

  return mockCategories.map((category) => ({
    ...category,
    ...trCategoryCopy[category.slug],
  }));
}

function localizeMockSuppliers(locale: Locale) {
  if (locale !== "tr") {
    return mockSuppliers;
  }

  return mockSuppliers.map((supplier) => ({
    ...supplier,
    ...trSupplierCopy[supplier.slug],
    products: trSupplierCopy[supplier.slug]?.products ?? supplier.products,
  }));
}

function normalizeCategory(row: CategoryRow, locale: Locale): Category {
  return {
    id: row.id,
    name: localizedValue(locale, row.name, row.name_fr),
    slug: row.slug,
    description: localizedValue(locale, row.description, row.description_fr),
    supplierCount: row.supplier_count ?? 0,
  };
}

function normalizeProduct(
  row: SupplierProductRow,
  locale: Locale,
): ProductPreview {
  const t = getDictionary(locale);

  return {
    name: localizedValue(locale, row.title, row.title_fr),
    category: row.category
      ? localizedValue(locale, row.category.name, row.category.name_fr)
      : t.common.product,
    moq: row.moq ? `${row.moq} ${t.common.units}` : t.common.onRequest,
    image: row.images[0] ?? "/brand/tmp-logo.webp",
  };
}

function getCategoryName(
  locale: Locale,
  category: SupplierRow["category"],
  fallback = getDictionary(locale).common.generalSourcing,
) {
  if (Array.isArray(category)) {
    const firstCategory = category[0];

    return firstCategory
      ? localizedValue(locale, firstCategory.name, firstCategory.name_fr)
      : fallback;
  }

  return category
    ? localizedValue(locale, category.name, category.name_fr)
    : fallback;
}

function normalizeSupplier(row: SupplierRow, locale: Locale): Supplier {
  return {
    slug: row.slug,
    name: localizedValue(locale, row.company_name, row.company_name_fr),
    city: row.city,
    country: row.country,
    category: getCategoryName(locale, row.category),
    summary: localizedValue(locale, row.summary, row.summary_fr),
    description: localizedValue(locale, row.description, row.description_fr),
    verified: row.verified || row.verification_status === "verified",
    yearFounded: row.year_founded ?? new Date().getFullYear(),
    employees: row.employees,
    exportMarkets: row.export_markets,
    moq: row.moq,
    responseTime: row.response_time,
    image: row.image_url,
    tags: localizedArray(locale, row.tags, row.tags_fr),
    certifications: localizedArray(
      locale,
      row.certifications,
      row.certifications_fr,
    ),
    products: (row.products ?? []).map((product) =>
      normalizeProduct(product, locale),
    ),
  };
}

export async function getCategories(
  locale: Locale = defaultLocale,
): Promise<Category[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return localizeMockCategories(locale);
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, name_fr, slug, description, description_fr")
    .order("display_order", { ascending: true });

  if (error || !data?.length) {
    if (error) {
      console.error("Unable to load Supabase categories", error.message);
    }

    return localizeMockCategories(locale);
  }

  return data.map((category) => normalizeCategory(category, locale));
}

export async function getSuppliers(
  locale: Locale = defaultLocale,
): Promise<Supplier[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return localizeMockSuppliers(locale);
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select(
      `
        slug,
        company_name,
        company_name_fr,
        city,
        country,
        summary,
        summary_fr,
        description,
        description_fr,
        verified,
        year_founded,
        employees,
        export_markets,
        moq,
        response_time,
        image_url,
        tags,
        tags_fr,
        certifications,
        certifications_fr,
        verification_status,
        category:categories(name, name_fr),
        products:supplier_products(title, title_fr, moq, images, category:categories(name, name_fr))
      `,
    )
    .eq("verification_status", "verified")
    .order("display_order", { ascending: true })
    .limit(3, { referencedTable: "supplier_products" });

  if (error || !data?.length) {
    if (error) {
      console.error("Unable to load Supabase suppliers", error.message);
    }

    return localizeMockSuppliers(locale);
  }

  return (data as unknown as SupplierRow[]).map((supplier) =>
    normalizeSupplier(supplier, locale),
  );
}

export async function getSupplierBySlug(
  slug: string,
  locale: Locale = defaultLocale,
) {
  const suppliers = await getSuppliers(locale);

  return suppliers.find((supplier) => supplier.slug === slug) ?? null;
}
