import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { updateProduct } from "@/app/actions/products";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductForm } from "@/components/product-form";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";
import { getEditableProduct } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

export const metadata: Metadata = createMetadata({
  title: "Edit Product | TMP",
  description: "Edit a TMP supplier product listing.",
  path: "/dashboard/products",
});

export default async function EditProductPage({
  params,
  searchParams,
}: EditProductPageProps) {
  const locale = await getLocale();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const t = getDictionary(locale);
  const labels = t.dashboard.productManager;
  const [categories, product] = await Promise.all([
    getCategories(locale),
    getEditableProduct(id),
  ]);
  const statusCopy =
    query.status === "missing"
      ? labels.missing
      : query.status === "error"
        ? labels.error
        : "";

  if (!product) {
    notFound();
  }

  return (
    <DashboardShell
      eyebrow={labels.eyebrow}
      title={labels.editProduct}
      description={labels.description}
    >
      {statusCopy && (
        <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-red-100">
          {statusCopy}
        </div>
      )}
      <ProductForm
        action={updateProduct}
        categories={categories}
        product={product}
        labels={{
          title: labels.editProduct,
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
          submit: labels.updateProduct,
          cancel: t.common.cancel,
        }}
      />
    </DashboardShell>
  );
}
