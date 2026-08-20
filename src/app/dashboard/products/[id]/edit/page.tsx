import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { updateProduct } from "@/app/actions/products";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductForm } from "@/components/product-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";
import { getEditableProduct } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
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
}: EditProductPageProps) {
  const locale = await getLocale();
  const { id } = await params;
  const t = getDictionary(locale);
  const labels = t.dashboard.productManager;
  const profile = await getCurrentProfile();

  if (!profile) {
    const nextPath = getLocalizedPath(locale, `/dashboard/products/${id}/edit`);

    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(
        nextPath,
      )}`,
    );
  }

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
              {profile
                ? labels.supplierAccessEditBody
                : labels.loginRequiredBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {profile ? (
                <Button asChild>
                  <Link href={getLocalizedPath(locale, "/products")}>
                    {labels.browseProducts}
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline">
                <Link href={getLocalizedPath(locale, "/dashboard/profile")}>
                  {t.common.goToProfile}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  const [categories, product] = await Promise.all([
    getCategories(locale),
    getEditableProduct(id),
  ]);
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
      <ProductForm
        action={updateProduct}
        categories={categories}
        cancelHref={getLocalizedPath(locale, "/dashboard/products")}
        cancelLabel={t.common.cancel}
        locale={locale}
        product={product}
        labels={labels}
      />
    </DashboardShell>
  );
}
