const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const SUPPLIER_EMPLOYEE_RANGES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
] as const;

export type SupplierProfileValues = {
  companyName: string;
  categoryId: string;
  city: string;
  summary: string;
  description: string;
  yearFounded: number;
  employees: (typeof SUPPLIER_EMPLOYEE_RANGES)[number];
  exportMarkets: string[];
  tags: string[];
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseList(value: string, limit: number) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).slice(0, limit);
}

export function validateSupplierProfileInput(formData: FormData): {
  values: SupplierProfileValues | null;
  error: "invalid" | null;
} {
  const companyName = getString(formData, "company_name");
  const categoryId = getString(formData, "category_id");
  const city = getString(formData, "city");
  const summary = getString(formData, "summary");
  const description = getString(formData, "description");
  const employees = getString(formData, "employees");
  const yearFounded = Number(getString(formData, "year_founded"));
  const exportMarkets = parseList(getString(formData, "export_markets"), 12);
  const tags = parseList(getString(formData, "tags"), 12);
  const currentYear = new Date().getFullYear();

  const isValid =
    companyName.length >= 2 &&
    companyName.length <= 120 &&
    uuidPattern.test(categoryId) &&
    city.length >= 2 &&
    city.length <= 100 &&
    summary.length >= 20 &&
    summary.length <= 240 &&
    description.length >= 50 &&
    description.length <= 3000 &&
    Number.isInteger(yearFounded) &&
    yearFounded >= 1800 &&
    yearFounded <= currentYear &&
    SUPPLIER_EMPLOYEE_RANGES.includes(
      employees as SupplierProfileValues["employees"],
    ) &&
    exportMarkets.every((item) => item.length <= 80) &&
    tags.every((item) => item.length <= 40);

  if (!isValid) return { values: null, error: "invalid" };

  return {
    error: null,
    values: {
      companyName,
      categoryId,
      city,
      summary,
      description,
      yearFounded,
      employees: employees as SupplierProfileValues["employees"],
      exportMarkets,
      tags,
    },
  };
}
