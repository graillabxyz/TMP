import type { Metadata } from "next";
import { FileUp, PackageSearch, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitRfq } from "@/app/actions/rfq";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";
import { getProductBySlug } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Submit an RFQ | TMP",
  description:
    "Send a structured sourcing request to Turkish suppliers with product, quantity, destination country, and attachment details.",
  path: "/rfq",
});

type RFQPageProps = {
  searchParams?: Promise<{
    status?: string;
    product?: string;
    supplier?: string;
  }>;
};

export const revalidate = 300;

export default async function RFQPage({ searchParams }: RFQPageProps) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [categories, resolvedSearchParams] = await Promise.all([
    getCategories(locale),
    searchParams,
  ]);
  const status = resolvedSearchParams?.status;
  const productSlug = resolvedSearchParams?.product;
  const prefillProduct = productSlug
    ? await getProductBySlug(productSlug, locale)
    : null;
  const statusMessage =
    status && status in t.rfq.status
      ? t.rfq.status[status as keyof typeof t.rfq.status]
      : null;

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div>
            <Badge>
              <PackageSearch className="mr-1 size-3" aria-hidden="true" />
              {t.rfq.badge}
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
              {t.rfq.title}
            </h1>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {t.rfq.body}
            </p>
            <div className="mt-8 grid gap-3">
              {t.rfq.bullets.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-white/[0.035]">
            <CardContent className="p-6 sm:p-8">
              {statusMessage && (
                <div className="mb-5 rounded-lg border border-gold-300/25 bg-gold-300/[0.08] px-4 py-3 text-sm text-gold-50">
                  {statusMessage}
                </div>
              )}

              <form action={submitRfq} className="grid gap-5">
                {prefillProduct && (
                  <div className="rounded-lg border border-gold-300/25 bg-gold-300/[0.08] p-4 text-sm">
                    <p className="font-medium text-white">
                      {prefillProduct.title}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {prefillProduct.supplierName}
                    </p>
                  </div>
                )}
                <input
                  type="hidden"
                  name="inquiry_type"
                  value={prefillProduct ? "product" : "general"}
                />
                <input
                  type="hidden"
                  name="product_id"
                  value={prefillProduct?.id ?? ""}
                />
                <input
                  type="hidden"
                  name="supplier_slug"
                  value={prefillProduct?.supplierSlug ?? ""}
                />
                <input
                  type="hidden"
                  name="supplier_id"
                  value={prefillProduct?.supplierId ?? ""}
                />
                <input
                  type="hidden"
                  name="product_slug"
                  value={prefillProduct?.slug ?? productSlug ?? ""}
                />
                <div className="grid gap-2">
                  <Label htmlFor="product">{t.rfq.productRequest}</Label>
                  <Input
                    id="product"
                    name="product_request"
                    required
                    defaultValue={prefillProduct?.title ?? ""}
                    placeholder={t.rfq.productPlaceholder}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="category">{t.common.category}</Label>
                    <Select
                      id="category"
                      name="category_slug"
                      defaultValue={prefillProduct?.categorySlug ?? ""}
                    >
                      <option value="" disabled>
                        {t.rfq.selectCategory}
                      </option>
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">{t.rfq.quantity}</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      required
                      placeholder={t.rfq.quantityPlaceholder}
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="country">{t.rfq.destinationCountry}</Label>
                    <Select
                      id="country"
                      name="destination_country"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        {t.rfq.selectCountry}
                      </option>
                      {[
                        "Germany",
                        "Netherlands",
                        "France",
                        "Spain",
                        "Italy",
                        "United Kingdom",
                      ].map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timeline">{t.rfq.timeline}</Label>
                    <Input
                      id="timeline"
                      name="target_timeline"
                      placeholder={t.rfq.timelinePlaceholder}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">{t.rfq.notes}</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder={t.rfq.notesPlaceholder}
                  />
                </div>

                <label
                  htmlFor="attachment"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gold-300/30 bg-gold-300/[0.05] px-6 py-8 text-center transition hover:bg-gold-300/[0.08]"
                >
                  <FileUp className="size-8 text-gold-100" aria-hidden="true" />
                  <span className="mt-3 text-sm font-medium text-white">
                    {t.rfq.upload}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {t.rfq.uploadHelp}
                  </span>
                  <input
                    id="attachment"
                    name="attachment"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    className="sr-only"
                  />
                </label>

                <Button type="submit" size="lg" className="w-full">
                  {t.rfq.submit}
                  <Send aria-hidden="true" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
