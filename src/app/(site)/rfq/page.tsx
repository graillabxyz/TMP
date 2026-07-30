import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileUp, PackageSearch, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitRfq } from "@/app/actions/rfq";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getCategories } from "@/lib/marketplace";
import { getPlatformActivity } from "@/lib/platform-activity";
import { getProductBySlug } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.rfq.metadataTitle,
    description: t.rfq.metadataDescription,
    path: "/rfq",
    locale,
  });
}

type RFQPageProps = {
  searchParams?: Promise<{
    status?: string;
    product?: string;
    supplier?: string;
  }>;
};

export const revalidate = 300;

export default async function RFQPage({ searchParams }: RFQPageProps) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const activity = getPlatformActivity(locale);
  const [categories, resolvedSearchParams, profile] = await Promise.all([
    getCategories(locale),
    searchParams,
    getCurrentProfile(),
  ]);
  const status = resolvedSearchParams?.status;
  const productSlug = resolvedSearchParams?.product;
  const prefillProduct = productSlug
    ? await getProductBySlug(productSlug, locale)
    : null;
  const statusMessage =
    status && status in t.rfq.status
      ? t.rfq.status[status as keyof typeof t.rfq.status]
      : null;

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div>
            <Badge>
              <PackageSearch className="mr-1 size-3" aria-hidden="true" />
              {t.rfq.badge}
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
              {t.rfq.title}
            </h1>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {t.rfq.body}
            </p>
            <div className="mt-8 grid gap-3">
              {t.rfq.bullets.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
            <Card className="mt-6 bg-white/[0.035]">
              <CardContent className="p-5">
                <p className="text-sm text-gold-200">
                  {activity.rfqExamplesTitle}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {activity.rfqExamplesBody}
                </p>
                <div className="mt-4 grid gap-3">
                  {activity.rfqExamples.map((example) => (
                    <div
                      key={example}
                      className="flex gap-3 rounded-md border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-muted-foreground"
                    >
                      <CheckCircle2
                        className="mt-1 size-4 shrink-0 text-gold-200"
                        aria-hidden="true"
                      />
                      {example}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/[0.035]">
            <CardContent className="p-6 sm:p-8">
              {statusMessage && (
                <div className="mb-5 rounded-lg border border-gold-300/25 bg-gold-300/[0.08] px-4 py-3 text-sm text-gold-50">
                  {statusMessage}
                </div>
              )}

              {!profile && (
                <div className="mb-5 rounded-lg border border-gold-300/25 bg-gold-300/[0.08] px-4 py-3">
                  <p className="font-medium text-white">
                    {t.rfq.signInRequiredTitle}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {t.rfq.signInRequiredBody}
                  </p>
                </div>
              )}

              <form action={submitRfq} className="grid gap-5">
                <fieldset
                  disabled={!profile}
                  className="contents disabled:opacity-60"
                >
                  <div
                    className="absolute -left-[10000px] top-auto size-px overflow-hidden"
                    aria-hidden="true"
                  >
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  {prefillProduct && (
                    <div className="rounded-lg border border-gold-300/25 bg-gold-300/[0.08] p-4 text-sm">
                      <p className="font-medium text-white">
                        {prefillProduct.title}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {prefillProduct.supplierName}
                      </p>
                    </div>
                  )}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="requester_name">
                        {t.rfq.requesterName}
                      </Label>
                      <Input
                        id="requester_name"
                        name="requester_name"
                        required
                        minLength={2}
                        maxLength={100}
                        autoComplete="name"
                        defaultValue={profile?.fullName ?? ""}
                        placeholder={t.rfq.requesterNamePlaceholder}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="requester_email">
                        {t.rfq.requesterEmail}
                      </Label>
                      <Input
                        id="requester_email"
                        name="requester_email"
                        type="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        defaultValue={profile?.email ?? ""}
                        readOnly
                        placeholder={t.rfq.requesterEmailPlaceholder}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="requester_company">
                      {t.rfq.requesterCompany}
                    </Label>
                    <Input
                      id="requester_company"
                      name="requester_company"
                      maxLength={120}
                      autoComplete="organization"
                      placeholder={t.rfq.requesterCompanyPlaceholder}
                    />
                  </div>
                  <input
                    type="hidden"
                    name="inquiry_type"
                    value={prefillProduct ? "product" : "general"}
                  />
                  <input
                    type="hidden"
                    name="product_id"
                    value={prefillProduct?.id ?? ""}
                  />
                  <input
                    type="hidden"
                    name="supplier_slug"
                    value={prefillProduct?.supplierSlug ?? ""}
                  />
                  <input
                    type="hidden"
                    name="supplier_id"
                    value={prefillProduct?.supplierId ?? ""}
                  />
                  <input
                    type="hidden"
                    name="product_slug"
                    value={prefillProduct?.slug ?? productSlug ?? ""}
                  />
                  <div className="grid gap-2">
                    <Label htmlFor="product">{t.rfq.productRequest}</Label>
                    <Input
                      id="product"
                      name="product_request"
                      required
                      minLength={18}
                      maxLength={180}
                      aria-describedby="product-request-help"
                      defaultValue={prefillProduct?.title ?? ""}
                      placeholder={t.rfq.productPlaceholder}
                    />
                    <p
                      id="product-request-help"
                      className="text-xs leading-5 text-muted-foreground"
                    >
                      {t.rfq.productHelp}
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="category">{t.common.category}</Label>
                      <Select
                        id="category"
                        name="category_slug"
                        defaultValue={prefillProduct?.categorySlug ?? ""}
                      >
                        <option value="" disabled>
                          {t.rfq.selectCategory}
                        </option>
                        {categories.map((category) => (
                          <option key={category.slug} value={category.slug}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">{t.rfq.quantity}</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        required
                        placeholder={t.rfq.quantityPlaceholder}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="country">
                        {t.rfq.destinationCountry}
                      </Label>
                      <Select
                        id="country"
                        name="destination_country"
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          {t.rfq.selectCountry}
                        </option>
                        {t.rfq.destinationCountries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="timeline">{t.rfq.timeline}</Label>
                      <Input
                        id="timeline"
                        name="target_timeline"
                        placeholder={t.rfq.timelinePlaceholder}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">{t.rfq.notes}</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder={t.rfq.notesPlaceholder}
                    />
                  </div>

                  {profile ? (
                    <label
                      htmlFor="attachment"
                      className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gold-300/30 bg-gold-300/[0.05] px-6 py-8 text-center transition focus-within:border-gold-300/60 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background hover:border-gold-300/50 hover:bg-gold-300/[0.08]"
                    >
                      <FileUp
                        className="size-8 text-gold-100"
                        aria-hidden="true"
                      />
                      <span className="mt-3 text-sm font-medium text-white">
                        {t.rfq.upload}
                      </span>
                      <span className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
                        {t.rfq.uploadHelp}
                      </span>
                      <input
                        id="attachment"
                        name="attachment"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        className="sr-only"
                      />
                    </label>
                  ) : (
                    <div className="flex min-h-32 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.025] px-6 py-6 text-center">
                      <FileUp
                        className="size-7 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <p className="mt-3 text-sm text-muted-foreground">
                        {t.rfq.uploadSignIn}
                      </p>
                      <Link
                        href="/login?next=/rfq"
                        className="mt-2 text-sm font-medium text-gold-100 underline-offset-4 hover:underline"
                      >
                        {t.nav.login}
                      </Link>
                    </div>
                  )}

                  {profile && (
                    <Button type="submit" size="lg" className="w-full">
                      {t.rfq.submit}
                      <Send aria-hidden="true" />
                    </Button>
                  )}
                </fieldset>
                {!profile && (
                  <Button asChild size="lg" className="w-full">
                    <Link href="/login?next=/rfq">{t.rfq.signInToSubmit}</Link>
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
