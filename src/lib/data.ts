import type { Category, Supplier } from "@/types";

export const heroImage =
  "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=2200&q=85";

export const suppliers: Supplier[] = [
  {
    slug: "anatolia-textile-studio",
    name: "Anatolia Textile Studio",
    city: "Istanbul",
    country: "Turkiye",
    category: "Textiles & Apparel",
    summary:
      "Premium knitwear, private label basics, and export-ready apparel.",
    description:
      "A vertically integrated textile partner serving European fashion, workwear, and essentials brands with audited production lines and rapid sampling.",
    verified: true,
    yearFounded: 2014,
    employees: "120-250",
    exportMarkets: ["Germany", "Netherlands", "France"],
    moq: "300 units",
    responseTime: "Under 12h",
    image:
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1200&q=80",
    tags: ["Private label", "OEKO-TEX", "Knitwear"],
    certifications: ["OEKO-TEX Standard 100", "ISO 9001", "BSCI audit"],
    products: [
      {
        name: "Organic cotton hoodie",
        category: "Apparel",
        moq: "500 units",
        image:
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Ribbed jersey basics",
        category: "Fabric",
        moq: "250 kg",
        image:
          "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    slug: "marmara-machinery-works",
    name: "Marmara Machinery Works",
    city: "Kocaeli",
    country: "Turkiye",
    category: "Machinery & Components",
    summary: "CNC-machined components and industrial assemblies for EU buyers.",
    description:
      "Precision manufacturing partner with CNC, laser cutting, and assembly capacity for industrial equipment manufacturers.",
    verified: true,
    yearFounded: 2009,
    employees: "80-120",
    exportMarkets: ["Italy", "Austria", "Poland"],
    moq: "Project based",
    responseTime: "Under 24h",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
    tags: ["CNC", "ISO 9001", "Custom tooling"],
    certifications: ["ISO 9001", "CE documentation support", "EN 1090 partner"],
    products: [
      {
        name: "CNC aluminum housings",
        category: "Components",
        moq: "100 units",
        image:
          "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Sheet metal enclosures",
        category: "Industrial",
        moq: "75 units",
        image:
          "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    slug: "aegean-homeware-co",
    name: "Aegean Homeware Co.",
    city: "Izmir",
    country: "Turkiye",
    category: "Home & Living",
    summary: "Ceramics, textiles, and contemporary home goods for retailers.",
    description:
      "Design-led homeware supplier combining regional craft with modern production planning for boutique retailers and hospitality groups.",
    verified: true,
    yearFounded: 2017,
    employees: "35-80",
    exportMarkets: ["Spain", "Denmark", "Sweden"],
    moq: "150 sets",
    responseTime: "Under 18h",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    tags: ["Ceramics", "Hospitality", "Design-led"],
    certifications: [
      "Food contact compliance",
      "Sedex member",
      "REACH support",
    ],
    products: [
      {
        name: "Stoneware dinner set",
        category: "Ceramics",
        moq: "200 sets",
        image:
          "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Cotton hammam towels",
        category: "Home textile",
        moq: "400 units",
        image:
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    slug: "izmir-natural-foods",
    name: "Izmir Natural Foods",
    city: "Izmir",
    country: "Turkiye",
    category: "Food & Ingredients",
    summary:
      "Dried fruits, nuts, spices, and retail-ready Mediterranean goods.",
    description:
      "Export-focused food producer with traceable sourcing, EU labeling support, and flexible private label packaging for grocery buyers.",
    verified: false,
    yearFounded: 2012,
    employees: "60-110",
    exportMarkets: ["Belgium", "United Kingdom", "Czechia"],
    moq: "1 pallet",
    responseTime: "Under 24h",
    image:
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1200&q=80",
    tags: ["Private label", "Retail packs", "Traceable"],
    certifications: ["BRCGS pending", "Halal", "Organic lines available"],
    products: [
      {
        name: "Dried fig retail packs",
        category: "Food",
        moq: "1,200 packs",
        image:
          "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Mediterranean spice blends",
        category: "Ingredients",
        moq: "300 kg",
        image:
          "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    slug: "bursa-auto-systems",
    name: "Bursa Auto Systems",
    city: "Bursa",
    country: "Turkiye",
    category: "Automotive Parts",
    summary:
      "Aftermarket parts, wiring assemblies, and tier supplier capacity.",
    description:
      "Automotive supplier with strong Bursa-region capacity for wiring, rubber parts, and precision aftermarket component programs.",
    verified: true,
    yearFounded: 2006,
    employees: "250-500",
    exportMarkets: ["Romania", "Germany", "Hungary"],
    moq: "Program based",
    responseTime: "Under 24h",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80",
    tags: ["IATF path", "Aftermarket", "Assemblies"],
    certifications: ["ISO 9001", "IATF 16949 roadmap", "PPAP support"],
    products: [
      {
        name: "Wiring harness assemblies",
        category: "Automotive",
        moq: "500 units",
        image:
          "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Rubber vibration mounts",
        category: "Parts",
        moq: "1,000 units",
        image:
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    slug: "istanbul-packaging-lab",
    name: "Istanbul Packaging Lab",
    city: "Istanbul",
    country: "Turkiye",
    category: "Packaging",
    summary:
      "Premium cartons, ecommerce mailers, labels, and retail packaging.",
    description:
      "Modern packaging partner for ecommerce, cosmetics, and food brands needing fast prototyping and polished export-ready finishing.",
    verified: false,
    yearFounded: 2019,
    employees: "25-60",
    exportMarkets: ["France", "Ireland", "Portugal"],
    moq: "1,000 units",
    responseTime: "Under 8h",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    tags: ["FSC paper", "Low MOQ", "Rapid samples"],
    certifications: ["FSC materials available", "ISO 14001 roadmap"],
    products: [
      {
        name: "Rigid cosmetics box",
        category: "Packaging",
        moq: "1,000 units",
        image:
          "https://images.unsplash.com/photo-1607344645866-009c320f75c4?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "Ecommerce mailer set",
        category: "Packaging",
        moq: "2,500 units",
        image:
          "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
];

export const categories: Category[] = [
  {
    name: "Textiles & Apparel",
    slug: "textiles-apparel",
    description: "Private label garments, fabrics, and home textiles.",
    supplierCount: 132,
  },
  {
    name: "Machinery & Components",
    slug: "machinery-components",
    description: "CNC, sheet metal, machinery parts, and tooling partners.",
    supplierCount: 74,
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Ceramics, decor, furniture, and hospitality-ready goods.",
    supplierCount: 91,
  },
  {
    name: "Food & Ingredients",
    slug: "food-ingredients",
    description: "Mediterranean foods, dry goods, and private label packs.",
    supplierCount: 68,
  },
  {
    name: "Automotive Parts",
    slug: "automotive-parts",
    description: "Aftermarket components, assemblies, and production programs.",
    supplierCount: 46,
  },
  {
    name: "Packaging",
    slug: "packaging",
    description: "Retail cartons, mailers, labels, and branded packaging.",
    supplierCount: 58,
  },
];

export const trustMetrics = [
  { label: "Supplier categories", value: "24" },
  { label: "EU buyer markets", value: "18" },
  { label: "Avg. RFQ response", value: "16h" },
];
