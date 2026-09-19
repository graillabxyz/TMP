import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { updateProduct } from "@/app/actions/products";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductForm } from "@/components/product-form";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";
import { getEditableProduct } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { hasSupplierProductAccess } from "@/lib/supplier-access";
import { getVerificationWorkspace } from "@/lib/verification";

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
    locale,
  });
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const locale = await getLocale();
  const { id } = await params;
  const t = getDictionary(locale);
  const labels = t.dashboard.productManager;
  const profilePromise = getCurrentProfile();
  const categoriesPromise = getCategories(locale);
  const profile = await profilePromise;

  if (!profile) {
    const nextPath = getLocalizedPath(locale, `/dashboard/products/${id}/edit`);

    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(
        nextPath,
      )}`,
    );
  }

  const workspace = await getVerificationWorkspace(profile.id);
  const supplier = workspace.supplier;
  const canManageProducts = hasSupplierProductAccess({
    supplierId: supplier?.id ?? null,
    role: profile.role,
    subscriptionStatus: supplier?.subscriptionStatus ?? null,
    complimentaryPremium: supplier?.complimentaryPremium ?? false,
  });

  if (!canManageProducts) {
    redirect(
      `${getLocalizedPath(locale, "/dashboard/settings/verification")}?status=product-access-required`,
    );
  }

  const [categories, product] = await Promise.all([
    categoriesPromise,
    getEditableProduct(id, profile.id),
  ]);
  if (!product) {
    notFound();
  }

  return (
    <DashboardShell
      eyebrow={labels.eyebrow}
      title={labels.editProduct}
      description={labels.editDescription}
      active="products"
    >
      <ProductForm
        accountId={profile.id}
        action={updateProduct}
        canPublish
        categories={categories}
        cancelHref={getLocalizedPath(locale, "/dashboard/products")}
        cancelLabel={t.common.cancel}
        locale={locale}
        product={product}
        labels={labels}
        supplierProfileHref={getLocalizedPath(locale, "/dashboard/profile")}
      />
    </DashboardShell>
  );
}
