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

const platformActivity: Record<Locale, PlatformActivity> = {
  en: {
    pulseEyebrow: "Marketplace pulse",
    pulseTitle: "Active sourcing briefs moving through the TMP desk.",
    pulseBody:
      "Structured requests move from supplier matching to sample discussions and quote follow-up, giving buyers a clearer path from brief to shortlist.",
    stats: [
      { label: "Open buyer briefs", value: "28", detail: "+6 this week" },
      { label: "Supplier replies", value: "74", detail: "last 7 days" },
      {
        label: "Avg. first response",
        value: "16h",
        detail: "verified network",
      },
    ],
    activeBriefsTitle: "Recent buyer briefs",
    activeBriefs: [
      {
        title: "Organic cotton hoodie, 320gsm fleece",
        market: "Germany",
        quantity: "500-1,200 units",
        stage: "Supplier matching",
        updated: "Today",
        categorySlug: "textiles-apparel",
        tags: ["OEKO-TEX", "Private label"],
      },
      {
        title: "FSC rigid cosmetics box with matte lamination",
        market: "France",
        quantity: "2,000 units",
        stage: "Samples requested",
        updated: "Yesterday",
        categorySlug: "packaging",
        tags: ["FSC paper", "Low MOQ"],
      },
      {
        title: "CNC aluminum enclosure, anodized black",
        market: "Italy",
        quantity: "100 units",
        stage: "Quote review",
        updated: "2 days ago",
        categorySlug: "machinery-components",
        tags: ["6061-T6", "Drawing attached"],
      },
    ],
    demandTitle: "Buyer demand",
    demandBody:
      "Current briefs are strongest where buyers include material, quantity, target market, and certification needs.",
    categoryDemand: [
      {
        categorySlug: "textiles-apparel",
        label: "Textiles",
        value: "9 briefs",
        detail: "private label, OEKO-TEX, fast sampling",
      },
      {
        categorySlug: "packaging",
        label: "Packaging",
        value: "6 briefs",
        detail: "FSC cartons, labels, ecommerce mailers",
      },
      {
        categorySlug: "machinery-components",
        label: "Components",
        value: "5 briefs",
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
    productDemandTitle: "Demand signals",
    supplierSignalsTitle: "Supplier signals",
  },
  fr: {
    pulseEyebrow: "Pulse marketplace",
    pulseTitle: "Des briefs sourcing actifs avancent dans le desk TMP.",
    pulseBody:
      "Les demandes structurees passent du matching fournisseur aux echantillons puis au suivi devis, avec un chemin plus clair du brief a la shortlist.",
    stats: [
      {
        label: "Briefs acheteurs ouverts",
        value: "28",
        detail: "+6 cette semaine",
      },
      {
        label: "Reponses fournisseurs",
        value: "74",
        detail: "7 derniers jours",
      },
      {
        label: "Premiere reponse moy.",
        value: "16h",
        detail: "reseau verifie",
      },
    ],
    activeBriefsTitle: "Briefs acheteurs recents",
    activeBriefs: [
      {
        title: "Sweat coton bio, molleton 320gsm",
        market: "Allemagne",
        quantity: "500-1 200 unites",
        stage: "Matching fournisseur",
        updated: "Aujourd'hui",
        categorySlug: "textiles-apparel",
        tags: ["OEKO-TEX", "Marque privee"],
      },
      {
        title: "Boite cosmetique FSC avec pelliculage mat",
        market: "France",
        quantity: "2 000 unites",
        stage: "Echantillons demandes",
        updated: "Hier",
        categorySlug: "packaging",
        tags: ["Papier FSC", "MOQ bas"],
      },
      {
        title: "Boitier aluminium CNC, anodise noir",
        market: "Italie",
        quantity: "100 unites",
        stage: "Revue devis",
        updated: "Il y a 2 jours",
        categorySlug: "machinery-components",
        tags: ["6061-T6", "Plan joint"],
      },
    ],
    demandTitle: "Demande acheteur",
    demandBody:
      "Les briefs les plus efficaces precisent matiere, quantite, marche cible et exigences de certification.",
    categoryDemand: [
      {
        categorySlug: "textiles-apparel",
        label: "Textiles",
        value: "9 briefs",
        detail: "marque privee, OEKO-TEX, echantillonnage rapide",
      },
      {
        categorySlug: "packaging",
        label: "Packaging",
        value: "6 briefs",
        detail: "cartons FSC, etiquettes, mailers ecommerce",
      },
      {
        categorySlug: "machinery-components",
        label: "Composants",
        value: "5 briefs",
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
    productDemandTitle: "Signaux de demande",
    supplierSignalsTitle: "Signaux fournisseur",
  },
};

export function getPlatformActivity(locale: Locale) {
  return platformActivity[locale] ?? platformActivity.en;
}
