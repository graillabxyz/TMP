import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BadgeCheck,
  Clock3,
  FileText,
  Inbox,
  LineChart,
  PackagePlus,
  Search,
} from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";
import { getVerificationWorkspace } from "@/lib/verification";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.dashboard.metadataTitle,
    description: t.dashboard.metadataDescription,
    path: "/dashboard",
  });
}

export default async function DashboardPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const profile = await getCurrentProfile();
  const dashboardHref = getLocalizedPath(locale, "/dashboard");
  const productsHref = getLocalizedPath(locale, "/products");
  const suppliersHref = getLocalizedPath(locale, "/suppliers");
  const rfqHref = getLocalizedPath(locale, "/rfq");
  const verificationHref = getLocalizedPath(
    locale,
    "/dashboard/settings/verification",
  );

  if (!profile) {
    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(
        dashboardHref,
      )}`,
    );
  }

  const role = profile.role;
  const buyerCopy = t.dashboard.buyerWorkspace;
  const verificationWorkspace = await getVerificationWorkspace();
  const verificationSupplier = verificationWorkspace.supplier;
  const supplierMetrics = [
    { label: t.dashboard.metrics[0], value: "18", icon: PackagePlus },
    { label: t.dashboard.metrics[1], value: "7", icon: Inbox },
    { label: t.dashboard.metrics[2], value: "24", icon: Search },
    { label: t.dashboard.metrics[3], value: "72%", icon: BadgeCheck },
  ];
  const buyerMetrics = [
    { label: buyerCopy.metrics[0], value: "3", icon: FileText },
    { label: buyerCopy.metrics[1], value: "8", icon: Search },
    { label: buyerCopy.metrics[2], value: "5", icon: Inbox },
    { label: buyerCopy.metrics[3], value: "14", icon: PackagePlus },
  ];
  const buyerSections = [
    {
      title: buyerCopy.savedSuppliers,
      body: buyerCopy.savedSuppliersBody,
      icon: Search,
      href: suppliersHref,
      cta: buyerCopy.exploreSuppliers,
    },
    {
      title: buyerCopy.productInquiries,
      body: buyerCopy.productInquiriesBody,
      icon: Inbox,
      href: productsHref,
      cta: buyerCopy.browseProducts,
    },
    {
      title: t.dashboard.nextActions,
      body: buyerCopy.nextActionsBody,
      icon: Clock3,
      href: rfqHref,
      cta: buyerCopy.createRfq,
    },
  ];
  const supplierSections = [
    {
      title: t.dashboard.listings,
      body: t.dashboard.listingsBody,
      icon: PackagePlus,
      href: getLocalizedPath(locale, "/dashboard/products"),
      cta: t.dashboard.manageProducts,
    },
    {
      title: t.dashboard.productInquiries,
      body: t.dashboard.productInquiriesBody,
      icon: Inbox,
      href: getLocalizedPath(locale, "/dashboard/products"),
      cta: t.dashboard.reviewProducts,
    },
    {
      title: t.dashboard.nextActions,
      body: t.dashboard.nextActionsBody,
      icon: Clock3,
      href: verificationHref,
      cta: t.dashboard.upgradeCta,
    },
  ];

  if (role !== "supplier") {
    return (
      <DashboardShell
        eyebrow={buyerCopy.eyebrow}
        title={t.dashboard.title}
        description={buyerCopy.description}
        active="overview"
      >
        <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-muted-foreground">
          <Badge className="mr-2 align-middle" variant="outline">
            {t.dashboard.previewData}
          </Badge>
          {t.dashboard.previewBody}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {buyerMetrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <Card key={metric.label} className="bg-white/[0.035]">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {metric.label}
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-white">
                        {metric.value}
                      </p>
                    </div>
                    <div className="flex size-11 items-center justify-center rounded-md border border-gold-300/25 bg-gold-300/10">
                      <Icon
                        className="size-5 text-gold-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
          <Card id="rfqs" className="scroll-mt-24 bg-white/[0.035]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gold-200">{t.dashboard.rfqs}</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">
                    {buyerCopy.activeRequests}
                  </h2>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={rfqHref}>{buyerCopy.createRfq}</Link>
                </Button>
              </div>
              <div className="mt-6 grid gap-3">
                {buyerCopy.requestRows.map(([request, status, replies]) => (
                  <div
                    key={request}
                    className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[1fr_160px_120px] sm:items-center"
                  >
                    <p className="font-medium text-white">{request}</p>
                    <p className="text-sm text-muted-foreground">{status}</p>
                    <Badge variant="secondary">{replies}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.035]">
            <CardContent className="p-6">
              <p className="text-sm text-gold-200">{buyerCopy.discovery}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                {buyerCopy.continueSourcing}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {buyerCopy.discoveryBody}
              </p>
              <div className="mt-6 grid gap-3">
                <Button asChild>
                  <Link href={productsHref}>{buyerCopy.browseProducts}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={suppliersHref}>{buyerCopy.exploreSuppliers}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {buyerSections.map((section) => {
            const Icon = section.icon;

            return (
              <Card key={section.title} className="bg-white/[0.035]">
                <CardContent className="p-6">
                  <Icon className="size-5 text-gold-100" aria-hidden="true" />
                  <h2 className="mt-4 font-semibold text-white">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {section.body}
                  </p>
                  <Button asChild className="mt-5 w-full" variant="outline">
                    <Link href={section.href}>{section.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      eyebrow={t.dashboard.eyebrow}
      title={t.dashboard.title}
      description={t.dashboard.description}
      active="overview"
    >
      <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm leading-6 text-muted-foreground">
        <Badge className="mr-2 align-middle" variant="outline">
          {t.dashboard.previewData}
        </Badge>
        {t.dashboard.previewBody}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {supplierMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label} className="bg-white/[0.035]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {metric.value}
                    </p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-md border border-gold-300/25 bg-gold-300/10">
                    <Icon className="size-5 text-gold-100" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <Card id="rfqs" className="scroll-mt-24 bg-white/[0.035]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gold-200">{t.dashboard.rfqs}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  {t.dashboard.recentRequests}
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {t.dashboard.supplierRequestRows.map(
                ([product, country, quantity, status], index) => (
                  <div
                    key={product}
                    className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[1fr_120px_120px_auto] sm:items-center"
                  >
                    <p className="font-medium text-white">{product}</p>
                    <p className="text-sm text-muted-foreground">{country}</p>
                    <p className="text-sm text-muted-foreground">{quantity}</p>
                    <Badge variant={index === 0 ? "default" : "secondary"}>
                      {status}
                    </Badge>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.035]">
          <CardContent className="p-6">
            <p className="text-sm text-gold-200">{t.dashboard.verification}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {t.dashboard.profileReadiness}
            </h2>
            {verificationSupplier && (
              <div className="mt-5 grid gap-3 rounded-lg border border-gold-300/20 bg-gold-300/[0.08] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {t.verificationSettings.currentStatus}
                  </span>
                  <Badge
                    variant={
                      verificationSupplier.verificationStatus === "verified"
                        ? "success"
                        : "secondary"
                    }
                  >
                    {
                      t.verificationSettings.states[
                        verificationSupplier.verificationStatus
                      ]
                    }
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {t.verificationSettings.subscriptionStatus}
                  </span>
                  <Badge
                    variant={
                      verificationSupplier.subscriptionStatus === "active"
                        ? "success"
                        : "secondary"
                    }
                  >
                    {
                      t.verificationSettings.states[
                        verificationSupplier.subscriptionStatus
                      ]
                    }
                  </Badge>
                </div>
              </div>
            )}
            <div className="mt-6 grid gap-4">
              {t.dashboard.readinessRows.map(([item, status], index) => (
                <div key={item} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item}</span>
                  <Badge
                    variant={
                      index === 0 || index === 2 ? "success" : "secondary"
                    }
                  >
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-lg border border-white/10 bg-charcoal-800 p-4">
              <div className="flex items-center gap-2 text-sm text-white">
                <LineChart
                  className="size-4 text-gold-200"
                  aria-hidden="true"
                />
                {t.dashboard.buyerActivity}
              </div>
              <div className="mt-5 flex h-24 items-end gap-2">
                {[36, 52, 42, 66, 58, 82, 74].map((height, index) => (
                  <div
                    key={`${height}-${index}`}
                    className="flex-1 rounded-t bg-gold-300/70"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <h3 className="font-semibold text-white">
                {t.dashboard.upgradeTitle}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t.dashboard.upgradeBody}
              </p>
              <Button asChild className="mt-4 w-full" variant="outline">
                <Link href={verificationHref}>{t.dashboard.upgradeCta}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {supplierSections.map((section) => {
          const Icon = section.icon;

          return (
            <Card key={section.title} className="bg-white/[0.035]">
              <CardContent className="p-6">
                <Icon className="size-5 text-gold-100" aria-hidden="true" />
                <h2 className="mt-4 font-semibold text-white">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {section.body}
                </p>
                <Button asChild className="mt-5 w-full" variant="outline">
                  <Link href={section.href}>{section.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}
