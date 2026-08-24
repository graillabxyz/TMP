import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Archive,
  Eye,
  FilePenLine,
  LockKeyhole,
  PackagePlus,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductArchiveControl } from "@/components/product-archive-control";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
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
    locale,
  });
}

function statusVariant(status: string) {
  if (status === "published") return "success" as const;
  if (status === "archived") return "secondary" as const;
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

  if (!profile) {
    const nextPath = getLocalizedPath(locale, "/dashboard/products");
    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(nextPath)}`,
    );
  }

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
  const products = workspace.products;
  const publishedCount = products.filter(
    (product) => product.status === "published",
  ).length;
  const draftCount = products.filter(
    (product) => product.status === "draft",
  ).length;
  const archivedCount = products.filter(
    (product) => product.status === "archived",
  ).length;
  const canPublish = profile.role === "supplier" || profile.role === "admin";
  const createHref = getLocalizedPath(locale, "/dashboard/products/new");
  const profileHref = getLocalizedPath(locale, "/dashboard/profile");
  const summaries: Array<{
    icon: LucideIcon;
    label: string;
    value: number;
  }> = [
    { icon: PackagePlus, label: labels.allListings, value: products.length },
    { icon: Eye, label: labels.publishedListings, value: publishedCount },
    { icon: FilePenLine, label: labels.draftListings, value: draftCount },
    { icon: Archive, label: labels.archivedListings, value: archivedCount },
  ];

  return (
    <DashboardShell
      eyebrow={labels.eyebrow}
      title={labels.title}
      description={labels.description}
      active="products"
    >
      {statusCopy && (
        <div
          role={params.status === "error" ? "alert" : "status"}
          className={
            params.status === "error"
              ? "mb-5 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
              : "mb-5 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
          }
        >
          {statusCopy}
        </div>
      )}

      {!canPublish && (
        <section className="mb-6 flex flex-col gap-4 border-y border-gold-300/20 bg-gold-300/[0.045] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gold-300/10 text-gold-100">
              <LockKeyhole className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-white">
                {labels.draftOnlyNoticeTitle}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                {labels.draftOnlyNoticeBody}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full shrink-0 sm:w-auto">
            <Link href={profileHref}>{labels.addSupplierProfile}</Link>
          </Button>
        </section>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gold-200">
            {workspace.supplier?.name ?? labels.yourDraftWorkspace}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {canPublish ? labels.publishHelp : labels.draftHelp}
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href={createHref}>
            <Plus aria-hidden="true" />
            {labels.createProduct}
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-4">
        {summaries.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-charcoal-900/95 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-muted-foreground">
                {label}
              </p>
              <Icon className="size-4 text-gold-200" aria-hidden="true" />
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-white">
              {value}
            </p>
          </div>
        ))}
      </div>

      {products.length > 0 ? (
        <section className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.025] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">
                    {labels.tableProduct}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {labels.tableCategory}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {labels.tablePricing}
                  </th>
                  <th className="px-4 py-3 font-medium">{labels.status}</th>
                  <th className="px-5 py-3 text-right font-medium">
                    {t.common.action}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-white/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <ProductThumbnail src={product.imageUrl} />
                        <div className="min-w-0">
                          <p className="max-w-md truncate font-medium text-white">
                            {product.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(product.createdAt).toLocaleDateString(
                              locale,
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {product.categoryName}
                    </td>
                    <td className="px-4 py-4 text-white">
                      {formatPriceRange(product, t.products.quote)}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={statusVariant(product.status)}>
                        {labels[product.status]}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <ProductActions
                        archiveLabel={t.common.archive}
                        archiveBody={labels.archiveConfirmBody}
                        archiveConfirmLabel={labels.archiveConfirm}
                        archiveTitle={labels.archiveConfirmTitle}
                        cancelLabel={t.common.cancel}
                        editHref={getLocalizedPath(
                          locale,
                          `/dashboard/products/${product.id}/edit`,
                        )}
                        editLabel={t.common.edit}
                        locale={locale}
                        productId={product.id}
                        productTitle={product.title}
                        status={product.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-white/10 md:hidden">
            {products.map((product) => (
              <article key={product.id} className="p-4">
                <div className="flex gap-3">
                  <ProductThumbnail src={product.imageUrl} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="line-clamp-2 font-medium leading-5 text-white">
                        {product.title}
                      </h2>
                      <Badge variant={statusVariant(product.status)}>
                        {labels[product.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {product.categoryName}
                    </p>
                    <p className="mt-2 text-sm font-medium text-gold-100">
                      {formatPriceRange(product, t.products.quote)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-white/10 pt-3">
                  <ProductActions
                    archiveLabel={t.common.archive}
                    archiveBody={labels.archiveConfirmBody}
                    archiveConfirmLabel={labels.archiveConfirm}
                    archiveTitle={labels.archiveConfirmTitle}
                    cancelLabel={t.common.cancel}
                    editHref={getLocalizedPath(
                      locale,
                      `/dashboard/products/${product.id}/edit`,
                    )}
                    editLabel={t.common.edit}
                    locale={locale}
                    productId={product.id}
                    productTitle={product.title}
                    status={product.status}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-6 flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-md bg-gold-300/10 text-gold-100">
            <PackagePlus className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-white">
            {labels.noProducts}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {labels.noProductsBody}
          </p>
          <Button asChild className="mt-5">
            <Link href={createHref}>
              <Plus aria-hidden="true" />
              {labels.createProduct}
            </Link>
          </Button>
        </section>
      )}
    </DashboardShell>
  );
}

function ProductThumbnail({ src }: { src: string | null }) {
  return (
    <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-white/10 bg-charcoal-800">
      {src ? (
        <Image src={src} alt="" fill className="object-cover" sizes="56px" />
      ) : (
        <PackagePlus
          className="absolute inset-0 m-auto size-5 text-muted-foreground"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

function ProductActions({
  archiveLabel,
  archiveBody,
  archiveConfirmLabel,
  archiveTitle,
  cancelLabel,
  editHref,
  editLabel,
  locale,
  productId,
  productTitle,
  status,
}: {
  archiveLabel: string;
  archiveBody: string;
  archiveConfirmLabel: string;
  archiveTitle: string;
  cancelLabel: string;
  editHref: string;
  editLabel: string;
  locale: string;
  productId: string;
  productTitle: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        asChild
        size="sm"
        variant="outline"
        className="h-11 flex-1 md:h-9 md:flex-none"
      >
        <Link href={editHref}>{editLabel}</Link>
      </Button>
      {status !== "archived" && (
        <ProductArchiveControl
          cancelLabel={cancelLabel}
          confirmLabel={archiveConfirmLabel}
          description={archiveBody}
          locale={locale}
          productId={productId}
          productTitle={productTitle}
          title={archiveTitle}
          triggerLabel={archiveLabel}
        />
      )}
    </div>
  );
}
