import type { Metadata } from "next";
import Link from "next/link";

import { createProduct } from "@/app/actions/products";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductForm } from "@/components/product-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";
import { createMetadata } from "@/lib/seo";

type NewProductPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export const metadata: Metadata = createMetadata({
  title: "Create Product | TMP",
  description: "Create a supplier product listing on TMP.",
  path: "/dashboard/products/new",
});

export default async function NewProductPage({
  searchParams,
}: NewProductPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const labels = t.dashboard.productManager;
  const profile = await getCurrentProfile();
  const categories = await getCategories(locale);
  const statusCopy =
    params.status === "missing"
      ? labels.missing
      : params.status === "error"
        ? labels.error
        : "";

  return (
    <DashboardShell
      eyebrow={labels.eyebrow}
      title={labels.createProduct}
      description={labels.description}
      active="products"
    >
      {profile?.role !== "supplier" ? (
        <Card className="bg-white/[0.035]">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-white">
              {profile ? "Supplier access required" : labels.loginRequired}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {profile
                ? "Buyer accounts cannot create supplier product listings. Continue browsing products or submit a sourcing request instead."
                : labels.loginRequiredBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {profile ? (
                <Button asChild>
                  <Link href="/products">Browse products</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/login?role=supplier">{t.nav.login}</Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/rfq">Create RFQ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {statusCopy && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-red-100">
              {statusCopy}
            </div>
          )}
          <ProductForm
            action={createProduct}
            categories={categories}
            labels={{
              title: labels.createProduct,
              productTitle: labels.productTitle,
              category: labels.category,
              description: labels.productDescription,
              minimumOrderQuantity: labels.minimumOrderQuantity,
              priceMin: labels.priceMin,
              priceMax: labels.priceMax,
              currency: labels.currency,
              leadTime: labels.leadTime,
              images: labels.images,
              imagePlaceholder: labels.imagePlaceholder,
              imageHelp: labels.imageHelp,
              status: labels.status,
              draft: labels.draft,
              published: labels.published,
              archived: labels.archived,
              submit: labels.saveDraft,
              cancel: t.common.cancel,
            }}
          />
        </>
      )}
    </DashboardShell>
  );
}
