import Link from "next/link";
import type { Metadata } from "next";
import { PackagePlus, Plus, ShieldAlert } from "lucide-react";

import { archiveProduct } from "@/app/actions/products";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { formatPriceRange, getSupplierProductWorkspace } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

type DashboardProductsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.dashboard.productMetadataTitle,
    description: t.dashboard.productMetadataDescription,
    path: "/dashboard/products",
  });
}

function statusVariant(status: string) {
  if (status === "published") {
    return "success" as const;
  }

  if (status === "archived") {
    return "secondary" as const;
  }

  return "outline" as const;
}

export default async function DashboardProductsPage({
  searchParams,
}: DashboardProductsPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const labels = t.dashboard.productManager;
  const profile = await getCurrentProfile();
  const workspace = await getSupplierProductWorkspace(locale);
  const statusCopy =
    params.status === "created"
      ? labels.successCreate
      : params.status === "updated"
        ? labels.successUpdate
        : params.status === "archived"
          ? labels.successArchive
          : params.status === "error"
            ? labels.error
            : "";

  return (
    <DashboardShell
      eyebrow={labels.eyebrow}
      title={labels.title}
      description={labels.description}
      active="products"
    >
      {statusCopy && (
        <div className="mb-5 rounded-lg border border-gold-300/20 bg-gold-300/10 px-4 py-3 text-sm text-gold-50">
          {statusCopy}
        </div>
      )}

      {profile?.role === "buyer" && (
        <Card className="bg-white/[0.035]">
          <CardContent className="p-8">
            <ShieldAlert className="size-8 text-gold-200" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-white">
              {labels.supplierAccessRequired}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {labels.supplierAccessBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/products">{labels.browseProducts}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/profile">{t.common.goToProfile}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {profile?.role !== "buyer" && workspace.state === "unauthenticated" && (
        <Card className="bg-white/[0.035]">
          <CardContent className="p-8">
            <ShieldAlert className="size-8 text-gold-200" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-white">
              {labels.loginRequired}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {labels.loginRequiredBody}
            </p>
            <Button asChild className="mt-6">
              <Link href="/login?next=/dashboard/products">
                {t.nav.login}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {profile?.role !== "buyer" && workspace.state === "missing-supplier" && (
        <Card className="bg-white/[0.035]">
          <CardContent className="p-8">
            <ShieldAlert className="size-8 text-gold-200" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-white">
              {labels.supplierMissing}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {labels.supplierMissingBody}
            </p>
          </CardContent>
        </Card>
      )}

      {profile?.role !== "buyer" && workspace.state === "ready" && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {workspace.supplier?.name}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                {labels.title}
              </h2>
            </div>
            <Button asChild>
              <Link href="/dashboard/products/new">
                <Plus aria-hidden="true" />
                {labels.createProduct}
              </Link>
            </Button>
          </div>

          {workspace.products.length > 0 ? (
            <Card className="mt-6 overflow-hidden bg-white/[0.035]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b border-white/10 text-muted-foreground">
                    <tr>
                      <th className="px-5 py-4 font-medium">
                        {labels.tableProduct}
                      </th>
                      <th className="px-5 py-4 font-medium">
                        {labels.tableCategory}
                      </th>
                      <th className="px-5 py-4 font-medium">
                        {labels.tablePricing}
                      </th>
                      <th className="px-5 py-4 font-medium">{labels.status}</th>
                      <th className="px-5 py-4 font-medium">
                        {t.common.action}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {workspace.products.map((product) => (
                      <tr key={product.id} className="align-middle">
                        <td className="px-5 py-4">
                          <p className="font-medium text-white">
                            {product.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {product.categoryName}
                        </td>
                        <td className="px-5 py-4 text-white">
                          {formatPriceRange(product, t.products.quote)}
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={statusVariant(product.status)}>
                            {labels[product.status]}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Button asChild size="sm" variant="outline">
                              <Link
                                href={`/dashboard/products/${product.id}/edit`}
                              >
                                {t.common.edit}
                              </Link>
                            </Button>
                            {product.status !== "archived" && (
                              <form action={archiveProduct}>
                                <input
                                  type="hidden"
                                  name="id"
                                  value={product.id}
                                />
                                <Button
                                  type="submit"
                                  size="sm"
                                  variant="secondary"
                                >
                                  {t.common.archive}
                                </Button>
                              </form>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="mt-6 bg-white/[0.035]">
              <CardContent className="p-8">
                <PackagePlus
                  className="size-8 text-gold-200"
                  aria-hidden="true"
                />
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {labels.noProducts}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                  {labels.noProductsBody}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </DashboardShell>
  );
}
