export type ProductPreview = {
  name: string;
  category: string;
  moq: string;
  image: string;
};

export type Supplier = {
  slug: string;
  name: string;
  city: string;
  country: string;
  category: string;
  summary: string;
  description: string;
  verified: boolean;
  rfqCount: number;
  yearFounded: number;
  employees: string;
  exportMarkets: string[];
  moq: string;
  responseTime: string;
  image: string;
  tags: string[];
  certifications: string[];
  products: ProductPreview[];
};

export type Category = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  supplierCount: number;
};

export type MarketplaceProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  supplierName: string;
  supplierId: string | null;
  supplierSlug: string;
  supplierVerified: boolean;
  priceMin: number | null;
  priceMax: number | null;
  currency: string;
  moq: number | null;
  leadTimeDays: number | null;
  images: string[];
  status: "draft" | "published" | "archived";
  createdAt: string;
};
