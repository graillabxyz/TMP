import type { Locale } from "@/lib/i18n";

type ActivityBrief = {
  title: string;
  market: string;
  quantity: string;
  stage: string;
  updated: string;
  categorySlug: string;
  tags: string[];
};

type PlatformActivity = {
  pulseEyebrow: string;
  pulseTitle: string;
  pulseBody: string;
  stats: { label: string; value: string; detail: string }[];
  activeBriefsTitle: string;
  activeBriefs: ActivityBrief[];
  demandTitle: string;
  demandBody: string;
  categoryDemand: {
    categorySlug: string;
    label: string;
    value: string;
    detail: string;
  }[];
  rfqExamplesTitle: string;
  rfqExamplesBody: string;
  rfqExamples: string[];
  productDemandTitle: string;
  supplierSignalsTitle: string;
};

type PlatformCounts = {
  categories: number;
  suppliers: number;
  products: number;
};

const platformActivity: Record<Locale, PlatformActivity> = {
  en: {
    pulseEyebrow: "How sourcing works",
    pulseTitle: "Structured briefs help suppliers respond with useful quotes.",
    pulseBody:
      "These examples show how a request can move from supplier matching to samples and quote review when buyers include the right details.",
    stats: [
      { label: "Product categories", value: "0", detail: "Browse the catalog" },
      { label: "Listed suppliers", value: "0", detail: "Public profiles" },
      {
        label: "Published products",
        value: "0",
        detail: "Available listings",
      },
    ],
    activeBriefsTitle: "Sourcing brief examples",
    activeBriefs: [
      {
        title: "Organic cotton hoodie, 320gsm fleece",
        market: "Germany",
        quantity: "500-1,200 units",
        stage: "Supplier matching",
        updated: "Example",
        categorySlug: "textiles-apparel",
        tags: ["OEKO-TEX", "Private label"],
      },
      {
        title: "FSC rigid cosmetics box with matte lamination",
        market: "France",
        quantity: "2,000 units",
        stage: "Samples requested",
        updated: "Example",
        categorySlug: "packaging",
        tags: ["FSC paper", "Low MOQ"],
      },
      {
        title: "CNC aluminum enclosure, anodized black",
        market: "Italy",
        quantity: "100 units",
        stage: "Quote review",
        updated: "Example",
        categorySlug: "machinery-components",
        tags: ["6061-T6", "Drawing attached"],
      },
    ],
    demandTitle: "Common sourcing needs",
    demandBody:
      "Useful briefs include material, quantity, target market, and certification needs.",
    categoryDemand: [
      {
        categorySlug: "textiles-apparel",
        label: "Textiles",
        value: "Example",
        detail: "private label, OEKO-TEX, fast sampling",
      },
      {
        categorySlug: "packaging",
        label: "Packaging",
        value: "Example",
        detail: "FSC cartons, labels, ecommerce mailers",
      },
      {
        categorySlug: "machinery-components",
        label: "Components",
        value: "Example",
        detail: "CNC, sheet metal, assembly programs",
      },
    ],
    rfqExamplesTitle: "Strong request examples",
    rfqExamplesBody:
      "Specific briefs get routed faster because suppliers can judge fit immediately.",
    rfqExamples: [
      "Organic cotton hoodie, 320gsm fleece, OEKO-TEX, private label, 500 pcs",
      "CNC aluminum enclosure, 6061-T6, anodized black, drawing attached, 100 pcs",
      "FSC rigid cosmetics box, 2,000 units, matte lamination, France delivery",
    ],
    productDemandTitle: "Related brief examples",
    supplierSignalsTitle: "Relevant brief examples",
  },
  fr: {
    pulseEyebrow: "Fonctionnement du sourcing",
    pulseTitle:
      "Des briefs structurés aident les fournisseurs à répondre utilement.",
    pulseBody:
      "Ces exemples montrent comment une demande peut passer du matching aux échantillons puis à la revue des devis quand les détails sont complets.",
    stats: [
      {
        label: "Catégories produits",
        value: "0",
        detail: "Parcourir le catalogue",
      },
      {
        label: "Fournisseurs listés",
        value: "0",
        detail: "Profils publics",
      },
      {
        label: "Produits publiés",
        value: "0",
        detail: "Annonces disponibles",
      },
    ],
    activeBriefsTitle: "Exemples de briefs sourcing",
    activeBriefs: [
      {
        title: "Sweat coton bio, molleton 320gsm",
        market: "Allemagne",
        quantity: "500-1 200 unites",
        stage: "Matching fournisseur",
        updated: "Exemple",
        categorySlug: "textiles-apparel",
        tags: ["OEKO-TEX", "Marque privee"],
      },
      {
        title: "Boite cosmetique FSC avec pelliculage mat",
        market: "France",
        quantity: "2 000 unites",
        stage: "Echantillons demandes",
        updated: "Exemple",
        categorySlug: "packaging",
        tags: ["Papier FSC", "MOQ bas"],
      },
      {
        title: "Boitier aluminium CNC, anodise noir",
        market: "Italie",
        quantity: "100 unites",
        stage: "Revue devis",
        updated: "Exemple",
        categorySlug: "machinery-components",
        tags: ["6061-T6", "Plan joint"],
      },
    ],
    demandTitle: "Besoins sourcing fréquents",
    demandBody:
      "Les briefs utiles précisent matière, quantité, marché cible et exigences de certification.",
    categoryDemand: [
      {
        categorySlug: "textiles-apparel",
        label: "Textiles",
        value: "Exemple",
        detail: "marque privee, OEKO-TEX, echantillonnage rapide",
      },
      {
        categorySlug: "packaging",
        label: "Packaging",
        value: "Exemple",
        detail: "cartons FSC, etiquettes, mailers ecommerce",
      },
      {
        categorySlug: "machinery-components",
        label: "Composants",
        value: "Exemple",
        detail: "CNC, tolerie, programmes d'assemblage",
      },
    ],
    rfqExamplesTitle: "Exemples de demandes solides",
    rfqExamplesBody:
      "Les briefs specifiques sont routes plus vite car les fournisseurs peuvent juger l'adequation immediatement.",
    rfqExamples: [
      "Sweat coton bio, molleton 320gsm, OEKO-TEX, marque privee, 500 pcs",
      "Boitier aluminium CNC, 6061-T6, anodise noir, plan joint, 100 pcs",
      "Boite cosmetique FSC, 2 000 unites, pelliculage mat, livraison France",
    ],
    productDemandTitle: "Exemples de briefs associés",
    supplierSignalsTitle: "Exemples de briefs pertinents",
  },
  tr: {
    pulseEyebrow: "Tedarik süreci",
    pulseTitle:
      "Yapılandırılmış talepler, tedarikçilerin faydalı teklifler vermesini sağlar.",
    pulseBody:
      "Bu örnekler, doğru ayrıntılar verildiğinde bir talebin tedarikçi eşleştirmeden numune ve teklif incelemesine nasıl ilerleyebileceğini gösterir.",
    stats: [
      { label: "Ürün kategorisi", value: "0", detail: "Kataloğa göz atın" },
      {
        label: "Listelenen tedarikçi",
        value: "0",
        detail: "Herkese açık profiller",
      },
      {
        label: "Yayınlanan ürün",
        value: "0",
        detail: "Mevcut ilanlar",
      },
    ],
    activeBriefsTitle: "Tedarik talebi örnekleri",
    activeBriefs: [
      {
        title: "Organik pamuk hoodie, 320gsm polar",
        market: "Almanya",
        quantity: "500-1.200 adet",
        stage: "Tedarikçi eşleştirme",
        updated: "Örnek",
        categorySlug: "textiles-apparel",
        tags: ["OEKO-TEX", "Private label"],
      },
      {
        title: "Mat laminasyonlu FSC sert kozmetik kutusu",
        market: "Fransa",
        quantity: "2.000 adet",
        stage: "Numune istendi",
        updated: "Örnek",
        categorySlug: "packaging",
        tags: ["FSC kağıt", "Düşük MOQ"],
      },
      {
        title: "CNC alüminyum gövde, siyah anodize",
        market: "İtalya",
        quantity: "100 adet",
        stage: "Teklif inceleme",
        updated: "Örnek",
        categorySlug: "machinery-components",
        tags: ["6061-T6", "Çizim eklendi"],
      },
    ],
    demandTitle: "Yaygın tedarik ihtiyaçları",
    demandBody:
      "Faydalı talepler malzeme, miktar, hedef pazar ve sertifika ihtiyaçlarını içerir.",
    categoryDemand: [
      {
        categorySlug: "textiles-apparel",
        label: "Tekstil",
        value: "Örnek",
        detail: "private label, OEKO-TEX, hızlı numune",
      },
      {
        categorySlug: "packaging",
        label: "Ambalaj",
        value: "Örnek",
        detail: "FSC kartonlar, etiketler, e-ticaret kargo poşetleri",
      },
      {
        categorySlug: "machinery-components",
        label: "Komponentler",
        value: "Örnek",
        detail: "CNC, sac metal, montaj programları",
      },
    ],
    rfqExamplesTitle: "Güçlü talep örnekleri",
    rfqExamplesBody:
      "Spesifik brief'ler daha hızlı yönlendirilir çünkü tedarikçiler uygunluğu hemen değerlendirebilir.",
    rfqExamples: [
      "Organik pamuk hoodie, 320gsm polar, OEKO-TEX, private label, 500 adet",
      "CNC alüminyum gövde, 6061-T6, siyah anodize, çizim eklendi, 100 adet",
      "FSC sert kozmetik kutusu, 2.000 adet, mat laminasyon, Fransa teslimat",
    ],
    productDemandTitle: "İlgili talep örnekleri",
    supplierSignalsTitle: "Uygun talep örnekleri",
  },
};

export function getPlatformActivity(locale: Locale, counts?: PlatformCounts) {
  const activity = platformActivity[locale] ?? platformActivity.en;

  if (!counts) {
    return activity;
  }

  return {
    ...activity,
    stats: activity.stats.map((stat, index) => ({
      ...stat,
      value: String(
        [counts.categories, counts.suppliers, counts.products][index] ?? 0,
      ),
    })),
  };
}
