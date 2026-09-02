import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  BadgeCheck,
  FileCheck2,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { submitVerificationDocuments } from "@/app/actions/verification";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToastNotice } from "@/components/ui/toast-notice";
import { BillingActions } from "@/components/verification/billing-actions";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { getVerificationWorkspace } from "@/lib/verification";

type VerificationPageProps = {
  searchParams: Promise<{
    status?: string;
    checkout?: string;
    portal?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.verificationSettings.metadataTitle,
    description: t.verificationSettings.metadataDescription,
    path: "/dashboard/settings/verification",
    locale,
  });
}

function badgeVariant(status: string) {
  if (status === "verified" || status === "active") {
    return "success" as const;
  }

  if (status === "pending" || status === "past_due") {
    return "default" as const;
  }

  return "secondary" as const;
}

function getStatusTone(params: Awaited<VerificationPageProps["searchParams"]>) {
  if (
    params.status === "error" ||
    params.status === "document" ||
    params.status === "missing-company" ||
    params.checkout === "error" ||
    params.portal === "error" ||
    params.portal === "missing-customer"
  ) {
    return "error" as const;
  }

  if (
    params.status === "submitted" ||
    params.status === "supplier-started" ||
    params.checkout === "success" ||
    params.checkout === "existing"
  ) {
    return "success" as const;
  }

  return "neutral" as const;
}

export default async function VerificationSettingsPage({
  searchParams,
}: VerificationPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const copy = t.verificationSettings;
  const profile = await getCurrentProfile();

  if (!profile) {
    const nextPath = getLocalizedPath(
      locale,
      "/dashboard/settings/verification",
    );

    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(
        nextPath,
      )}`,
    );
  }

  const workspace = await getVerificationWorkspace(profile.id);
  const supplier = workspace.supplier;
  const documents = workspace.documents;
  const statusMessage =
    params.status === "submitted"
      ? copy.statusSubmitted
      : params.status === "supplier-started"
        ? copy.statusSupplierStarted
        : params.status === "missing-company"
          ? copy.statusMissingCompany
          : params.status === "document"
            ? copy.statusDocumentError
            : params.status === "error"
              ? copy.statusError
              : params.checkout === "placeholder"
                ? copy.checkoutPlaceholder
                : params.checkout === "success"
                  ? copy.checkoutSuccess
                  : params.checkout === "existing"
                    ? copy.checkoutExisting
                    : params.checkout === "cancelled"
                      ? copy.checkoutCancelled
                      : params.checkout === "error"
                        ? copy.checkoutError
                        : params.portal === "placeholder"
                          ? copy.portalPlaceholder
                          : params.portal === "missing-customer"
                            ? copy.portalMissingCustomer
                            : params.portal === "error"
                              ? copy.portalError
                              : "";
  const statusTone = getStatusTone(params);

  return (
    <DashboardShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      active="verification"
    >
      {profile?.role === "buyer" && (
        <Card>
          <CardContent className="p-5 sm:p-7">
            <ShieldCheck className="size-8 text-gold-200" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-white">
              {t.profileSettings.supplierUpgradeTitle}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {t.profileSettings.verifiedLockedBody}
            </p>
            <Button asChild className="mt-6 w-full sm:w-auto">
              <Link href={getLocalizedPath(locale, "/dashboard/profile")}>
                {t.profileSettings.startSupplierUpgrade}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {profile?.role !== "buyer" && (
        <>
          {statusMessage && (
            <ToastNotice
              message={statusMessage}
              dismissLabel={t.common.dismissNotification}
              tone={statusTone === "neutral" ? "info" : statusTone}
            />
          )}

          {workspace.state !== "ready" && (
            <Card>
              <CardContent className="p-5 sm:p-7">
                <ShieldCheck
                  className="size-8 text-gold-200"
                  aria-hidden="true"
                />
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {workspace.state === "unauthenticated"
                    ? copy.loginRequired
                    : copy.missingSupplier}
                </h2>
                {workspace.state !== "unauthenticated" && (
                  <Button asChild className="mt-6 w-full sm:w-auto">
                    <Link href={getLocalizedPath(locale, "/dashboard/profile")}>
                      {copy.openProfile}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {workspace.state === "ready" && supplier && (
            <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
              <div className="grid gap-5">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck
                        className="size-5 text-gold-200"
                        aria-hidden="true"
                      />
                      {copy.overview}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-0 divide-y divide-white/10 pt-0 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:pt-0">
                    <div className="pb-4 sm:pb-0 sm:pr-5">
                      <p className="text-sm text-muted-foreground">
                        {copy.currentStatus}
                      </p>
                      <Badge
                        className="mt-3"
                        variant={badgeVariant(supplier.verificationStatus)}
                      >
                        {copy.states[supplier.verificationStatus]}
                      </Badge>
                    </div>
                    <div className="pt-4 sm:pl-5 sm:pt-0">
                      <p className="text-sm text-muted-foreground">
                        {copy.subscriptionStatus}
                      </p>
                      <Badge
                        className="mt-3"
                        variant={badgeVariant(supplier.subscriptionStatus)}
                      >
                        {copy.states[supplier.subscriptionStatus]}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{copy.benefits}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-x-6 gap-y-0 pt-0 sm:grid-cols-2 sm:pt-0">
                    {copy.benefitItems.map((item, index) => {
                      const icons = [
                        BadgeCheck,
                        ShieldCheck,
                        SearchCheck,
                        Sparkles,
                      ];
                      const Icon = icons[index] ?? BadgeCheck;

                      return (
                        <div
                          key={item}
                          className="flex min-w-0 items-start gap-3 border-b border-white/10 py-3 sm:[&:nth-last-child(-n+2)]:border-b-0"
                        >
                          <Icon
                            className="mt-0.5 size-5 shrink-0 text-gold-100"
                            aria-hidden="true"
                          />
                          <p className="min-w-0 text-sm leading-6 text-muted-foreground">
                            {item}
                          </p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck2
                        className="size-5 text-gold-200"
                        aria-hidden="true"
                      />
                      {copy.documents}
                    </CardTitle>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {copy.documentsBody}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0 sm:pt-0">
                    <form
                      action={submitVerificationDocuments}
                      className="grid gap-4"
                    >
                      <input type="hidden" name="locale" value={locale} />
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="business_license">
                            {copy.businessLicense}
                          </Label>
                          <Input
                            id="business_license"
                            name="business_license"
                            type="file"
                            accept="application/pdf,image/jpeg,image/png,image/webp"
                            required={!documents?.businessLicensePath}
                            aria-describedby="business-license-help"
                            className="h-auto min-h-12 py-2 file:mr-3 file:rounded-sm file:bg-gold-300/10 file:px-3 file:py-2 file:text-gold-100"
                          />
                          <p
                            id="business-license-help"
                            className={cn(
                              "text-xs leading-5",
                              documents?.businessLicensePath
                                ? "text-emerald-300"
                                : "text-muted-foreground",
                            )}
                          >
                            {documents?.businessLicensePath
                              ? copy.documentUploaded
                              : copy.documentRequired}
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="company_registration">
                            {copy.companyRegistration}
                          </Label>
                          <Input
                            id="company_registration"
                            name="company_registration"
                            type="file"
                            accept="application/pdf,image/jpeg,image/png,image/webp"
                            required={!documents?.companyRegistrationPath}
                            aria-describedby="company-registration-help"
                            className="h-auto min-h-12 py-2 file:mr-3 file:rounded-sm file:bg-gold-300/10 file:px-3 file:py-2 file:text-gold-100"
                          />
                          <p
                            id="company-registration-help"
                            className={cn(
                              "text-xs leading-5",
                              documents?.companyRegistrationPath
                                ? "text-emerald-300"
                                : "text-muted-foreground",
                            )}
                          >
                            {documents?.companyRegistrationPath
                              ? copy.documentUploaded
                              : copy.documentRequired}
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="certifications">
                          {copy.certifications}
                        </Label>
                        <Input
                          id="certifications"
                          name="certifications"
                          type="file"
                          accept="application/pdf,image/jpeg,image/png,image/webp"
                          aria-describedby="certifications-help"
                          className="h-auto min-h-12 py-2 file:mr-3 file:rounded-sm file:bg-gold-300/10 file:px-3 file:py-2 file:text-gold-100"
                        />
                        <p
                          id="certifications-help"
                          className={cn(
                            "text-xs leading-5",
                            documents?.certificationsPath
                              ? "text-emerald-300"
                              : "text-muted-foreground",
                          )}
                        >
                          {documents?.certificationsPath
                            ? copy.documentUploaded
                            : copy.documentOptional}
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="notes">{copy.notes}</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          rows={5}
                          maxLength={3000}
                          defaultValue={documents?.notes ?? ""}
                          placeholder={copy.notesPlaceholder}
                        />
                      </div>
                      <Button type="submit" className="w-full sm:w-auto">
                        {copy.submitDocuments}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <aside className="self-start xl:sticky xl:top-32">
                <Card className="overflow-hidden">
                  <CardHeader className="border-b border-white/10 bg-gold-300/[0.08]">
                    <CardTitle>{copy.subscription}</CardTitle>
                    <p className="text-3xl font-semibold text-white">
                      {copy.price}
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {copy.priceNote}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <BillingActions
                      subscribeLabel={copy.subscribe}
                      manageLabel={copy.manage}
                      preparingLabel={copy.preparing}
                      openingLabel={copy.opening}
                      canManageSubscription={Boolean(supplier.stripeCustomerId)}
                      canStartSubscription={
                        supplier.subscriptionStatus !== "active" &&
                        supplier.subscriptionStatus !== "past_due"
                      }
                      dismissNotificationLabel={t.common.dismissNotification}
                      errorLabel={copy.billingActionError}
                      locale={locale}
                    />
                    <div className="mt-5 rounded-lg border border-white/10 bg-charcoal-800 p-4 text-sm leading-6 text-muted-foreground">
                      {copy.subscriptionStatus}:{" "}
                      <span className="font-medium text-white">
                        {copy.states[supplier.subscriptionStatus]}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          )}
        </>
      )}
    </DashboardShell>
  );
}
