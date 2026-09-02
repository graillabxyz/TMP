import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowUpRight, Building2, Save, UsersRound } from "lucide-react";

import { updateSupplierProfile } from "@/app/actions/supplier-profile";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToastNotice } from "@/components/ui/toast-notice";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";
import { createMetadata } from "@/lib/seo";
import { getOwnedSupplierProfile } from "@/lib/supplier-profile";
import { SUPPLIER_EMPLOYEE_RANGES } from "@/lib/supplier-profile-input";

type SupplierProfilePageProps = {
  searchParams: Promise<{ status?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = getDictionary(locale).profileSettings;

  return createMetadata({
    title: copy.supplierProfileMetadataTitle,
    description: copy.supplierProfileMetadataDescription,
    path: "/dashboard/profile/supplier",
    locale,
  });
}

export default async function SupplierProfilePage({
  searchParams,
}: SupplierProfilePageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const copy = t.profileSettings;
  const profile = await getCurrentProfile();
  const profileHref = getLocalizedPath(locale, "/dashboard/profile");

  if (!profile) {
    const nextPath = getLocalizedPath(locale, "/dashboard/profile/supplier");
    redirect(
      `${getLocalizedPath(locale, "/login")}?status=auth-required&next=${encodeURIComponent(nextPath)}`,
    );
  }
  if (profile.role !== "supplier" && profile.role !== "admin") {
    redirect(profileHref);
  }

  const [supplier, categories] = await Promise.all([
    getOwnedSupplierProfile(profile.id),
    getCategories(locale),
  ]);
  if (!supplier) redirect(`${profileHref}?status=error`);

  const publicProfileHref = getLocalizedPath(
    locale,
    `/suppliers/${supplier.slug}`,
  );
  const statusMessage =
    params.status === "saved"
      ? copy.supplierProfileSaved
      : params.status === "invalid"
        ? copy.supplierProfileInvalid
        : params.status === "error"
          ? copy.supplierProfileError
          : "";

  return (
    <DashboardShell
      eyebrow={copy.supplierProfileEyebrow}
      title={copy.supplierProfileTitle}
      description={copy.supplierProfileDescription}
      active="profile"
    >
      {statusMessage && (
        <ToastNotice
          message={statusMessage}
          dismissLabel={t.common.dismissNotification}
          tone={params.status === "saved" ? "success" : "error"}
        />
      )}

      <form action={updateSupplierProfile} className="mx-auto w-full max-w-6xl">
        <input type="hidden" name="locale" value={locale} />

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={publicProfileHref} target="_blank">
              {copy.publicProfile}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            <Save aria-hidden="true" />
            {copy.saveSupplierProfile}
          </Button>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <section className="workspace-panel p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <Building2
                className="mt-0.5 size-5 shrink-0 text-gold-200"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {copy.profileBasics}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {copy.profileBasicsBody}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="company_name">{copy.companyName}</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  required
                  minLength={2}
                  maxLength={120}
                  defaultValue={supplier.companyName}
                  autoComplete="organization"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="category_id">{copy.category}</Label>
                  <Select
                    id="category_id"
                    name="category_id"
                    required
                    defaultValue={supplier.categoryId}
                  >
                    <option value="" disabled>
                      {copy.selectCategory}
                    </option>
                    {categories.map((category) => (
                      <option key={category.slug} value={category.id ?? ""}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">{copy.city}</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    minLength={2}
                    maxLength={100}
                    defaultValue={supplier.city}
                    autoComplete="address-level2"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country">{copy.country}</Label>
                <Input id="country" value="Türkiye" disabled />
                <p className="text-xs leading-5 text-muted-foreground">
                  {copy.countryHelp}
                </p>
              </div>

              <div className="grid gap-2">
                <div className="flex items-end justify-between gap-4">
                  <Label htmlFor="summary">{copy.summary}</Label>
                  <span className="text-xs text-muted-foreground">20-240</span>
                </div>
                <Input
                  id="summary"
                  name="summary"
                  required
                  minLength={20}
                  maxLength={240}
                  defaultValue={supplier.summary}
                  placeholder={copy.summaryPlaceholder}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">{copy.supplierDescription}</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  minLength={50}
                  maxLength={3000}
                  rows={8}
                  defaultValue={supplier.description}
                  placeholder={copy.supplierDescriptionPlaceholder}
                  className="min-h-48 resize-y"
                />
              </div>
            </div>
          </section>

          <section className="workspace-panel p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <UsersRound
                className="mt-0.5 size-5 shrink-0 text-gold-200"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {copy.companyDetails}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {copy.companyDetailsBody}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="year_founded">{copy.yearFounded}</Label>
                  <Input
                    id="year_founded"
                    name="year_founded"
                    type="number"
                    inputMode="numeric"
                    min="1800"
                    max={new Date().getFullYear()}
                    required
                    defaultValue={supplier.yearFounded}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employees">{copy.employees}</Label>
                  <Select
                    id="employees"
                    name="employees"
                    required
                    defaultValue={supplier.employees}
                  >
                    {SUPPLIER_EMPLOYEE_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="export_markets">{copy.exportMarkets}</Label>
                <Input
                  id="export_markets"
                  name="export_markets"
                  maxLength={500}
                  defaultValue={supplier.exportMarkets.join(", ")}
                  placeholder={copy.exportMarketsPlaceholder}
                />
                <p className="text-xs text-muted-foreground">
                  {copy.commaSeparatedHelp}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tags">{copy.tags}</Label>
                <Input
                  id="tags"
                  name="tags"
                  maxLength={500}
                  defaultValue={supplier.tags.join(", ")}
                  placeholder={copy.tagsPlaceholder}
                />
                <p className="text-xs text-muted-foreground">
                  {copy.commaSeparatedHelp}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost" className="w-full sm:w-auto">
            <Link href={profileHref}>{t.common.cancel}</Link>
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            <Save aria-hidden="true" />
            {copy.saveSupplierProfile}
          </Button>
        </div>
      </form>
    </DashboardShell>
  );
}
