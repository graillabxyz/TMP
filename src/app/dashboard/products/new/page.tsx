import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createProduct } from "@/app/actions/products";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductForm } from "@/components/product-form";
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
      <ProductForm
        action={createProduct}
        canPublish={profile.role === "supplier" || profile.role === "admin"}
        categories={categories}
        cancelHref={getLocalizedPath(locale, "/dashboard/products")}
        cancelLabel={t.common.cancel}
        locale={locale}
        labels={labels}
        supplierProfileHref={getLocalizedPath(locale, "/dashboard/profile")}
      />
    </DashboardShell>
  );
}
