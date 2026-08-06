import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock3, Factory, PackagePlus, Search } from "lucide-react";

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
  const buyerSections = [
    {
      title: t.nav.products,
      body: t.products.body,
      icon: Search,
      href: productsHref,
      cta: buyerCopy.browseProducts,
    },
    {
      title: t.nav.suppliers,
      body: t.suppliers.body,
      icon: Factory,
      href: suppliersHref,
      cta: buyerCopy.exploreSuppliers,
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
        <div className="grid gap-6 lg:grid-cols-3">
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-6 sm:grid-cols-2">
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
    </DashboardShell>
  );
}
