import { getDictionary } from "@/lib/dictionary";
import {
  localizedArray,
  localizedValue,
  type Locale,
  defaultLocale,
} from "@/lib/i18n";
import { repairKnownSeedImage } from "@/lib/media-fallbacks";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import {
  getCategoryOverride,
  getCategorySlugOverride,
  getProductOverride,
  getSupplierNameOverride,
  getSupplierSlugOverride,
} from "@/lib/translation-overrides";
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
  slug: string | null;
  moq: number | null;
  images: string[];
  category: { name: string; name_fr: string | null; slug: string } | null;
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
    | { name: string; name_fr: string | null; slug: string }
    | { name: string; name_fr: string | null; slug: string }[]
    | null;
  products: SupplierProductRow[] | null;
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
  >
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
  },
  "marmara-machinery-works": {
    name: "Marmara Makine Atölyesi",
    country: "Türkiye",
    category: "Makine ve Komponentler",
    summary:
      "AB alıcıları için CNC işlenmiş komponentler ve endüstriyel montajlar.",
    description:
      "Endüstriyel ekipman üreticileri için CNC, lazer kesim ve montaj kapasitesine sahip hassas üretim partneri.",
    exportMarkets: ["İtalya", "Avusturya", "Polonya"],
    moq: "Proje bazlı",
    responseTime: "24 saatten kısa",
    tags: ["CNC", "ISO 9001", "Özel takım"],
    certifications: [
      "ISO 9001",
      "CE dokümantasyon desteği",
      "EN 1090 partneri",
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
  },
  "izmir-natural-foods": {
    name: "İzmir Doğal Gıdalar",
    country: "Türkiye",
    category: "Gıda ve İçerikler",
    summary:
      "Kuru meyve, kuruyemiş, baharat ve perakendeye hazır Akdeniz ürünleri.",
    description:
      "İzlenebilir tedarik, AB etiket desteği ve market alıcıları için esnek private label ambalaj sunan ihracat odaklı gıda üreticisi.",
    exportMarkets: ["Belçika", "Birleşik Krallık", "Çekya"],
    moq: "1 palet",
    responseTime: "24 saatten kısa",
    tags: ["Private label", "Perakende paketler", "İzlenebilir"],
    certifications: ["BRCGS beklemede", "Helal", "Organik hatlar mevcut"],
  },
  "bursa-building-materials": {
    name: "Bursa Yapı Malzemeleri",
    country: "Türkiye",
    category: "Yapı Malzemeleri",
    summary:
      "Cephe sistemleri, yalıtım, armatürler ve fit-out malzeme tedariki.",
    description:
      "Alüminyum profiller, yalıtım levhaları, hırdavat ve ihracata hazır fit-out programları için Bursa bölgesi kapasitesine sahip yapı malzemeleri tedarikçisi.",
    exportMarkets: ["Romanya", "Almanya", "Macaristan"],
    moq: "1 konteyner",
    responseTime: "24 saatten kısa",
    tags: ["Cephe sistemleri", "Fit-out tedariki", "Konteyner yükleri"],
    certifications: [
      "ISO 9001",
      "CE işaretli hatlar",
      "Yangına dayanımlı seçenekler",
    ],
  },
  "bursa-auto-systems": {
    name: "Bursa Yapı Malzemeleri",
    country: "Türkiye",
    category: "Yapı Malzemeleri",
    summary:
      "Cephe sistemleri, yalıtım, armatürler ve fit-out malzeme tedariki.",
    description:
      "Alüminyum profiller, yalıtım levhaları, hırdavat ve ihracata hazır fit-out programları için Bursa bölgesi kapasitesine sahip yapı malzemeleri tedarikçisi.",
    exportMarkets: ["Romanya", "Almanya", "Macaristan"],
    moq: "1 konteyner",
    responseTime: "24 saatten kısa",
    tags: ["Cephe sistemleri", "Fit-out tedariki", "Konteyner yükleri"],
    certifications: [
      "ISO 9001",
      "CE işaretli hatlar",
      "Yangına dayanımlı seçenekler",
    ],
  },
  "istanbul-packaging-lab": {
    name: "İstanbul Ambalaj Laboratuvarı",
    country: "Türkiye",
    category: "Ambalaj",
    summary:
      "Premium kutular, e-ticaret kargo paketleri, etiketler ve perakende ambalaj.",
    description:
      "Hızlı prototipleme ve ihracata hazır kaliteli finisaj isteyen e-ticaret, kozmetik ve gıda markaları için modern ambalaj partneri.",
    exportMarkets: ["Fransa", "İrlanda", "Portekiz"],
    moq: "1.000 adet",
    responseTime: "8 saatten kısa",
    tags: ["FSC kağıt", "Düşük MOQ", "Hızlı numune"],
    certifications: ["FSC malzeme mevcut", "ISO 14001 yol haritası"],
  },
};

function normalizeCategory(row: CategoryRow, locale: Locale): Category {
  const override = getCategoryOverride(locale, row.slug);

  return {
    id: row.id,
    name: override?.name ?? localizedValue(locale, row.name, row.name_fr),
    slug: getCategorySlugOverride(row.slug),
    description:
      override?.description ??
      localizedValue(locale, row.description, row.description_fr),
    supplierCount: row.supplier_count ?? 0,
  };
}

function normalizeProduct(
  row: SupplierProductRow,
  locale: Locale,
): ProductPreview {
  const t = getDictionary(locale);
  const productOverride = getProductOverride(locale, row.slug);
  const categoryOverride = getCategoryOverride(locale, row.category?.slug);

  return {
    name:
      productOverride?.title ?? localizedValue(locale, row.title, row.title_fr),
    category: row.category
      ? (productOverride?.category ??
        categoryOverride?.name ??
        localizedValue(locale, row.category.name, row.category.name_fr))
      : t.common.product,
    moq: row.moq ? `${row.moq} ${t.common.units}` : t.common.onRequest,
    image: row.images[0]
      ? repairKnownSeedImage(row.images[0])
      : "/brand/tmp-logo.webp",
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
      ? (getCategoryOverride(locale, firstCategory.slug)?.name ??
          localizedValue(locale, firstCategory.name, firstCategory.name_fr))
      : fallback;
  }

  return category
    ? (getCategoryOverride(locale, category.slug)?.name ??
        localizedValue(locale, category.name, category.name_fr))
    : fallback;
}

function normalizeSupplier(row: SupplierRow, locale: Locale): Supplier {
  const supplier = {
    slug: getSupplierSlugOverride(row.slug),
    name:
      getSupplierNameOverride(locale, row.slug) ??
      localizedValue(locale, row.company_name, row.company_name_fr),
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

  if (locale === "tr" && trSupplierCopy[row.slug]) {
    return {
      ...supplier,
      ...trSupplierCopy[row.slug],
    };
  }

  return supplier;
}

export async function getCategories(
  locale: Locale = defaultLocale,
): Promise<Category[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    console.error("Supabase is not configured; categories are unavailable.");
    return [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, name_fr, slug, description, description_fr")
    .order("display_order", { ascending: true });

  if (error || !data?.length) {
    if (error) {
      console.error("Unable to load Supabase categories", error.message);
    }

    return [];
  }

  return data.map((category) => normalizeCategory(category, locale));
}

export async function getSuppliers(
  locale: Locale = defaultLocale,
): Promise<Supplier[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    console.error("Supabase is not configured; suppliers are unavailable.");
    return [];
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
        category:categories(name, name_fr, slug),
        products:supplier_products(title, title_fr, slug, moq, images, category:categories(name, name_fr, slug))
      `,
    )
    .order("display_order", { ascending: true })
    .limit(3, { referencedTable: "supplier_products" });

  if (error || !data?.length) {
    if (error) {
      console.error("Unable to load Supabase suppliers", error.message);
    }

    return [];
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
