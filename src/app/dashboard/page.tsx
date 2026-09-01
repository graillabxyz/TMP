import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FilePenLine,
  PackagePlus,
  ShieldCheck,
  Store,
} from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getSupplierProductWorkspace } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import { getVerificationWorkspace } from "@/lib/verification";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.dashboard.metadataTitle,
    description: t.dashboard.metadataDescription,
    path: "/dashboard",
    locale,
  });
}

export default async function DashboardPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const profile = await getCurrentProfile();
  const dashboardHref = getLocalizedPath(locale, "/dashboard");

  if (!profile) {
    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(dashboardHref)}`,
    );
  }

  const [productWorkspace, verificationWorkspace] = await Promise.all([
    getSupplierProductWorkspace(locale),
    getVerificationWorkspace(),
  ]);
  const products = productWorkspace.products;
  const publishedCount = products.filter(
    (product) => product.status === "published",
  ).length;
  const draftCount = products.filter(
    (product) => product.status === "draft",
  ).length;
  const archivedCount = products.filter(
    (product) => product.status === "archived",
  ).length;
  const isSupplier = profile.role === "supplier" || profile.role === "admin";
  const productsHref = getLocalizedPath(locale, "/dashboard/products");
  const createProductHref = getLocalizedPath(locale, "/dashboard/products/new");
  const profileHref = getLocalizedPath(locale, "/dashboard/profile");
  const verificationHref = getLocalizedPath(
    locale,
    "/dashboard/settings/verification",
  );
  const verificationSupplier = verificationWorkspace.supplier;
  const productLabels = t.dashboard.productManager;

  return (
    <DashboardShell
      eyebrow={
        isSupplier ? t.dashboard.eyebrow : t.dashboard.buyerWorkspace.eyebrow
      }
      title={t.dashboard.title}
      description={
        isSupplier
          ? t.dashboard.description
          : t.dashboard.buyerWorkspace.description
      }
      active="overview"
    >
      <section className="flex flex-col gap-5 rounded-lg border border-gold-300/25 bg-card p-5 shadow-[0_14px_36px_rgba(0,0,0,0.16)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-gold-300/[0.12] text-gold-100">
            {isSupplier ? (
              <Store className="size-5" aria-hidden="true" />
            ) : (
              <FilePenLine className="size-5" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase text-gold-200">
              {t.dashboard.listingOverview}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-white">
              {isSupplier
                ? t.dashboard.supplierCatalogTitle
                : t.dashboard.buyerDraftTitle}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {isSupplier
                ? t.dashboard.supplierCatalogBody
                : t.dashboard.buyerDraftBody}
            </p>
          </div>
        </div>
        <Button asChild className="w-full shrink-0 sm:w-auto">
          <Link href={createProductHref}>
            <PackagePlus aria-hidden="true" />
            {isSupplier ? productLabels.createProduct : productLabels.saveDraft}
          </Link>
        </Button>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 min-[480px]:grid-cols-3">
        {[
          [t.dashboard.publishedProducts, publishedCount],
          [t.dashboard.draftProducts, draftCount],
          [t.dashboard.archivedProducts, archivedCount],
        ].map(([label, value]) => (
          <div key={String(label)} className="bg-card p-4 sm:p-5">
            <p className="text-xs leading-5 text-muted-foreground">
              {String(label)}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-white sm:text-3xl">
              {String(value)}
            </p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
        <section className="workspace-panel overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold text-white">
              {t.dashboard.recentProducts}
            </h2>
            <Link
              href={productsHref}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-100 transition hover:text-gold-50"
            >
              {t.dashboard.viewAllProducts}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          {products.length ? (
            <div className="divide-y divide-white/10">
              {products.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={getLocalizedPath(
                    locale,
                    `/dashboard/products/${product.id}/edit`,
                  )}
                  className="flex min-w-0 items-center gap-3 px-4 py-4 transition hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-5"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-charcoal-800">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <PackagePlus
                        className="absolute inset-0 m-auto size-5 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {product.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {product.categoryName}
                    </p>
                  </div>
                  <Badge
                    variant={
                      product.status === "published" ? "success" : "outline"
                    }
                  >
                    {productLabels[product.status]}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
              <PackagePlus
                className="size-7 text-gold-200"
                aria-hidden="true"
              />
              <p className="mt-3 font-medium text-white">
                {t.dashboard.noProductsYet}
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href={createProductHref}>
                  {t.dashboard.createFirstProduct}
                </Link>
              </Button>
            </div>
          )}
        </section>

        <aside className="grid gap-4">
          {isSupplier ? (
            <section className="workspace-panel p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className="mt-0.5 size-5 shrink-0 text-gold-200"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-xs font-medium uppercase text-gold-200">
                    {t.dashboard.verification}
                  </p>
                  <h2 className="mt-1 font-semibold text-white">
                    {t.dashboard.profileReadiness}
                  </h2>
                </div>
              </div>
              {verificationSupplier && (
                <div className="mt-5 grid gap-3 border-y border-white/10 py-4">
                  <StatusRow
                    label={t.verificationSettings.currentStatus}
                    value={
                      t.verificationSettings.states[
                        verificationSupplier.verificationStatus
                      ]
                    }
                    active={
                      verificationSupplier.verificationStatus === "verified"
                    }
                  />
                  <StatusRow
                    label={t.verificationSettings.subscriptionStatus}
                    value={
                      t.verificationSettings.states[
                        verificationSupplier.subscriptionStatus
                      ]
                    }
                    active={
                      verificationSupplier.subscriptionStatus === "active"
                    }
                  />
                </div>
              )}
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {t.dashboard.optionalVerificationBody}
              </p>
              <Button asChild variant="outline" className="mt-5 w-full">
                <Link href={verificationHref}>{t.dashboard.upgradeCta}</Link>
              </Button>
            </section>
          ) : (
            <section className="workspace-panel p-5">
              <BadgeCheck className="size-5 text-gold-200" aria-hidden="true" />
              <h2 className="mt-3 font-semibold text-white">
                {t.profileSettings.supplierUpgradeTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t.profileSettings.supplierUpgradeBody}
              </p>
              <Button asChild variant="outline" className="mt-5 w-full">
                <Link href={profileHref}>{t.dashboard.freeSupplierAccess}</Link>
              </Button>
            </section>
          )}
        </aside>
      </div>
    </DashboardShell>
  );
}

function StatusRow({
  active,
  label,
  value,
}: {
  active: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3">
      <span className="min-w-0 text-sm leading-5 text-muted-foreground">
        {label}
      </span>
      <Badge variant={active ? "success" : "secondary"}>{value}</Badge>
    </div>
  );
}
