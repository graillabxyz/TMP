import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BadgeCheck, Building2, CreditCard, UserRound } from "lucide-react";

import { startSupplierProfile } from "@/app/actions/verification";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastNotice } from "@/components/ui/toast-notice";
import { BillingActions } from "@/components/verification/billing-actions";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";
import { getVerificationWorkspace } from "@/lib/verification";

type ProfilePageProps = {
  searchParams: Promise<{ status?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.profileSettings.metadataTitle,
    description: t.profileSettings.metadataDescription,
    path: "/dashboard/profile",
    locale,
  });
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const copy = t.profileSettings;
  const verificationCopy = t.verificationSettings;
  const profile = await getCurrentProfile();
  const productsHref = getLocalizedPath(locale, "/dashboard/products");
  const verificationHref = getLocalizedPath(
    locale,
    "/dashboard/settings/verification",
  );
  const supplierDetailsHref = getLocalizedPath(
    locale,
    "/dashboard/profile/supplier",
  );

  if (!profile) {
    const nextPath = getLocalizedPath(locale, "/dashboard/profile");

    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(
        nextPath,
      )}`,
    );
  }

  const workspace = await getVerificationWorkspace(profile.id);
  const supplier = workspace.supplier;
  const isSupplier = profile.role === "supplier" || profile.role === "admin";
  const statusMessage =
    params.status === "supplier-started"
      ? verificationCopy.statusSupplierStarted
      : params.status === "missing-company"
        ? verificationCopy.statusMissingCompany
        : params.status === "error"
          ? verificationCopy.statusError
          : "";

  return (
    <DashboardShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      active="profile"
    >
      {statusMessage && (
        <ToastNotice
          message={statusMessage}
          dismissLabel={t.common.dismissNotification}
          tone={params.status === "supplier-started" ? "success" : "error"}
        />
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[.85fr_1.15fr]">
        <div className="grid gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound
                  className="size-5 text-gold-200"
                  aria-hidden="true"
                />
                {copy.accountTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-white/10 pt-0 sm:pt-0">
              <div className="flex flex-col gap-1 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm text-muted-foreground">{copy.email}</p>
                <p className="break-all font-medium text-white">
                  {profile.email}
                </p>
              </div>
              <div className="flex flex-col gap-2 py-3 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm text-muted-foreground">
                  {copy.accountType}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white">
                    {isSupplier ? copy.supplierAccount : copy.buyerAccount}
                  </p>
                  {isSupplier && (
                    <Badge variant="outline">{copy.supplierEnabled}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck
                  className="size-5 text-gold-200"
                  aria-hidden="true"
                />
                {copy.verifiedTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 sm:pt-0">
              <p className="text-sm leading-6 text-muted-foreground">
                {isSupplier ? copy.verifiedBody : copy.verifiedLockedBody}
              </p>
              <div className="mt-4 border-y border-white/10 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">
                      {verificationCopy.subscription}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {verificationCopy.price}
                    </p>
                  </div>
                  {supplier ? (
                    <Badge
                      variant={
                        supplier.subscriptionStatus === "active"
                          ? "success"
                          : "secondary"
                      }
                    >
                      {verificationCopy.states[supplier.subscriptionStatus]}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {verificationCopy.states.none}
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {verificationCopy.priceNote}
                </p>
              </div>
              <div className="mt-4 grid gap-2">
                {supplier ? (
                  <BillingActions
                    subscribeLabel={verificationCopy.subscribe}
                    manageLabel={verificationCopy.manage}
                    preparingLabel={verificationCopy.preparing}
                    openingLabel={verificationCopy.opening}
                    canManageSubscription={Boolean(supplier.stripeCustomerId)}
                    canStartSubscription={
                      supplier.subscriptionStatus !== "active" &&
                      supplier.subscriptionStatus !== "past_due"
                    }
                    dismissNotificationLabel={t.common.dismissNotification}
                    errorLabel={verificationCopy.billingActionError}
                    locale={locale}
                  />
                ) : (
                  <Button disabled variant="outline">
                    <CreditCard aria-hidden="true" />
                    {verificationCopy.subscribe}
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  className="w-full whitespace-normal text-center leading-5"
                >
                  <Link href={verificationHref}>
                    {copy.verificationSettings}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="self-start">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5 text-gold-200" aria-hidden="true" />
              {isSupplier ? copy.supplierReadyTitle : copy.supplierUpgradeTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 sm:pt-0">
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {isSupplier ? copy.supplierReadyBody : copy.supplierUpgradeBody}
            </p>
            {isSupplier ? (
              <div className="mt-5 grid gap-3 rounded-md border border-gold-300/20 bg-gold-300/[0.06] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {verificationCopy.currentStatus}
                  </span>
                  <Badge
                    variant={
                      supplier?.verificationStatus === "verified"
                        ? "success"
                        : "secondary"
                    }
                  >
                    {supplier
                      ? verificationCopy.states[supplier.verificationStatus]
                      : verificationCopy.states.none}
                  </Badge>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={supplierDetailsHref}>
                      {copy.editSupplierProfile}
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href={productsHref}>{copy.manageProducts}</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form
                action={startSupplierProfile}
                className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end"
              >
                <input
                  type="hidden"
                  name="return_to"
                  value={getLocalizedPath(locale, "/dashboard/profile")}
                />
                <input type="hidden" name="locale" value={locale} />
                <div className="grid gap-2">
                  <Label htmlFor="company">{copy.businessName}</Label>
                  <Input
                    id="company"
                    name="company"
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="organization"
                    placeholder={copy.businessNamePlaceholder}
                  />
                </div>
                <Button type="submit" className="w-full lg:w-auto">
                  {copy.startSupplierUpgrade}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
