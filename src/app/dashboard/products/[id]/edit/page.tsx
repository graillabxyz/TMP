import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProduct } from "@/app/actions/products";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductForm } from "@/components/product-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";
import { getEditableProduct } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.dashboard.editProductMetadataTitle,
    description: t.dashboard.editProductMetadataDescription,
    path: "/dashboard/products",
  });
}

export default async function EditProductPage({
  params,
  searchParams,
}: EditProductPageProps) {
  const locale = await getLocale();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const t = getDictionary(locale);
  const labels = t.dashboard.productManager;
  const profile = await getCurrentProfile();

  if (profile?.role !== "supplier") {
    return (
      <DashboardShell
        eyebrow={labels.eyebrow}
        title={labels.editProduct}
        description={labels.description}
        active="products"
      >
        <Card className="bg-white/[0.035]">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-white">
              {profile ? labels.supplierAccessRequired : labels.loginRequired}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {profile ? labels.supplierAccessEditBody : labels.loginRequiredBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {profile ? (
                <Button asChild>
                  <Link href="/products">{labels.browseProducts}</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/login?next=/dashboard/products">
                    {t.nav.login}
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/dashboard/profile">{t.common.goToProfile}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  const [categories, product] = await Promise.all([
    getCategories(locale),
    getEditableProduct(id, locale),
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
      active="products"
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
          leadTimePlaceholder: labels.leadTimePlaceholder,
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
