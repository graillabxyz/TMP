import type { Metadata } from "next";

import { createProduct } from "@/app/actions/products";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductForm } from "@/components/product-form";
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
    >
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
    </DashboardShell>
  );
}
