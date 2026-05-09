import type { Metadata } from "next";
import { PackageSearch, Search, SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getCategories, getSuppliers } from "@/lib/marketplace";
import { getProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    supplier?: string;
  }>;
};

export const metadata: Metadata = createMetadata({
  title: "Product Discovery | TMP",
  description:
    "Browse published Turkish supplier products by search, category, supplier, MOQ, price range, and lead time.",
  path: "/products",
});

export const revalidate = 120;

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const query = params.q ?? "";
  const category = params.category ?? "";
  const supplier = params.supplier ?? "";
  const [categories, suppliers, products] = await Promise.all([
    getCategories(locale),
    getSuppliers(locale),
    getProducts({ locale, query, category, supplier }),
  ]);

  return (
    <section className="section-shell">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge>{t.products.badge}</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
            {t.products.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            {t.products.body}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-muted-foreground">
          <span className="font-semibold text-white">{products.length}</span>{" "}
          {t.products.indexed}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[300px_1fr]">
        <aside>
          <Card className="sticky top-24 bg-white/[0.035]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <SlidersHorizontal
                  className="size-4 text-gold-200"
                  aria-hidden="true"
                />
                {t.products.filters}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="q">{t.common.search}</Label>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="q"
                      name="q"
                      className="pl-10"
                      defaultValue={query}
                      placeholder={t.products.searchPlaceholder}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">{t.common.category}</Label>
                  <Select id="category" name="category" defaultValue={category}>
                    <option value="">{t.products.allCategories}</option>
                    {categories.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="supplier">{t.common.supplier}</Label>
                  <Select id="supplier" name="supplier" defaultValue={supplier}>
                    <option value="">{t.products.allSuppliers}</option>
                    {suppliers.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <Button type="submit">{t.common.search}</Button>
              </form>
            </CardContent>
          </Card>
        </aside>

        {products.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                labels={{
                  verified: t.products.verified,
                  moq: t.common.moq,
                  price: t.common.price,
                  leadTime: t.common.leadTime,
                  viewProduct: t.products.viewProduct,
                  quote: t.products.quote,
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white/[0.035]">
            <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
              <PackageSearch
                className="size-10 text-gold-200"
                aria-hidden="true"
              />
              <h2 className="mt-5 text-xl font-semibold text-white">
                {t.products.emptyTitle}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                {t.products.emptyBody}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
