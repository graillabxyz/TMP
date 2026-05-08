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
  name: string;
  slug: string;
  description: string;
  supplierCount: number;
};
