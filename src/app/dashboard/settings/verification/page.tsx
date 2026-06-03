import Link from "next/link";
import type { Metadata } from "next";
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
import { BillingActions } from "@/components/verification/billing-actions";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";
import { getVerificationWorkspace } from "@/lib/verification";

type VerificationPageProps = {
  searchParams: Promise<{
    status?: string;
    checkout?: string;
    portal?: string;
  }>;
};

export const metadata: Metadata = createMetadata({
  title: "Verification Settings | TMP",
  description: "Manage TMP supplier verification and billing settings.",
  path: "/dashboard/settings/verification",
});

function badgeVariant(status: string) {
  if (status === "verified" || status === "active") {
    return "success" as const;
  }

  if (status === "pending" || status === "past_due") {
    return "default" as const;
  }

  return "secondary" as const;
}

export default async function VerificationSettingsPage({
  searchParams,
}: VerificationPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const copy = t.verificationSettings;
  const profile = await getCurrentProfile();
  const workspace = await getVerificationWorkspace();
  const supplier = workspace.supplier;
  const documents = workspace.documents;
  const statusMessage =
    params.status === "submitted"
      ? copy.statusSubmitted
      : params.status === "error"
        ? copy.statusError
        : params.checkout === "placeholder"
          ? copy.checkoutPlaceholder
          : params.checkout === "success"
            ? copy.checkoutSuccess
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

  return (
    <DashboardShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      active="verification"
    >
      {profile?.role === "buyer" && (
        <Card className="bg-white/[0.035]">
          <CardContent className="p-8">
            <ShieldCheck className="size-8 text-gold-200" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-white">
              Supplier access required
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Verification settings are only available to supplier profiles.
              Buyer accounts can browse verified suppliers and submit RFQs.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/suppliers">Explore suppliers</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/rfq">Create RFQ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {profile?.role !== "buyer" && (
        <>
          {statusMessage && (
            <div className="mb-6 rounded-lg border border-gold-300/20 bg-gold-300/10 px-4 py-3 text-sm text-gold-50">
              {statusMessage}
            </div>
          )}

          {workspace.state !== "ready" && (
            <Card className="bg-white/[0.035]">
              <CardContent className="p-8">
                <ShieldCheck
                  className="size-8 text-gold-200"
                  aria-hidden="true"
                />
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {workspace.state === "unauthenticated"
                    ? copy.loginRequired
                    : copy.missingSupplier}
                </h2>
                {workspace.state === "unauthenticated" && (
                  <Button asChild className="mt-6">
                    <Link href="/login?role=supplier">{t.nav.login}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {workspace.state === "ready" && supplier && (
            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="grid gap-6">
            <Card className="bg-white/[0.035]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck
                    className="size-5 text-gold-200"
                    aria-hidden="true"
                  />
                  {copy.overview}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
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
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
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

            <Card className="bg-white/[0.035]">
              <CardHeader>
                <CardTitle>{copy.benefits}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
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
                      className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
                    >
                      <Icon
                        className="size-5 text-gold-100"
                        aria-hidden="true"
                      />
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {item}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-white/[0.035]">
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
              <CardContent>
                <form
                  action={submitVerificationDocuments}
                  className="grid gap-5"
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="business_license_url">
                        {copy.businessLicense}
                      </Label>
                      <Input
                        id="business_license_url"
                        name="business_license_url"
                        type="url"
                        placeholder="https://..."
                        defaultValue={documents?.businessLicenseUrl ?? ""}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="company_registration_url">
                        {copy.companyRegistration}
                      </Label>
                      <Input
                        id="company_registration_url"
                        name="company_registration_url"
                        type="url"
                        placeholder="https://..."
                        defaultValue={documents?.companyRegistrationUrl ?? ""}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="certifications_url">
                      {copy.certifications}
                    </Label>
                    <Input
                      id="certifications_url"
                      name="certifications_url"
                      type="url"
                      placeholder="https://..."
                      defaultValue={documents?.certificationsUrl ?? ""}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">{copy.notes}</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      rows={5}
                      defaultValue={documents?.notes ?? ""}
                    />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto">
                    {copy.submitDocuments}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <aside className="self-start lg:sticky lg:top-24">
            <Card className="overflow-hidden bg-white/[0.035]">
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
                  canManageSubscription={Boolean(supplier.stripeCustomerId)}
                  errorLabel={copy.billingActionError}
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
