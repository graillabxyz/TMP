const turkiyeAliases = new Set(["turkey", "turkiye", "türkiye"]);

export function normalizeSupplierCountry(country: string) {
  const normalized = country.trim();

  return turkiyeAliases.has(normalized.toLowerCase()) ? "Türkiye" : normalized;
}
