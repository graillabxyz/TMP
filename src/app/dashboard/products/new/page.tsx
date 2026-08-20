import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createProduct } from "@/app/actions/products";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductForm } from "@/components/product-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.dashboard.createProductMetadataTitle,
    description: t.dashboard.createProductMetadataDescription,
    path: "/dashboard/products/new",
  });
}

export default async function NewProductPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const labels = t.dashboard.productManager;
  const profile = await getCurrentProfile();

  if (!profile) {
    const nextPath = getLocalizedPath(locale, "/dashboard/products/new");

    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(
        nextPath,
      )}`,
    );
  }

  const categories = await getCategories(locale);

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
              {profile ? labels.supplierAccessRequired : labels.loginRequired}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {profile
                ? labels.supplierAccessCreateBody
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
      ) : (
        <ProductForm
          action={createProduct}
          categories={categories}
          cancelHref={getLocalizedPath(locale, "/dashboard/products")}
          cancelLabel={t.common.cancel}
          locale={locale}
          labels={labels}
        />
      )}
    </DashboardShell>
  );
}
