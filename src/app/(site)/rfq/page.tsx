import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, PackageSearch, Send } from "lucide-react";

import { RfqAttachmentField } from "@/components/rfq-attachment-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToastNotice } from "@/components/ui/toast-notice";
import { submitRfq } from "@/app/actions/rfq";
import { getCurrentProfile } from "@/lib/account";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getCategories, getSupplierBySlug } from "@/lib/marketplace";
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
  const [categories, resolvedSearchParams, profile] = await Promise.all([
    getCategories(locale),
    searchParams,
    getCurrentProfile(),
  ]);
  const status = resolvedSearchParams?.status;
  const productSlug = resolvedSearchParams?.product;
  const supplierSlug = resolvedSearchParams?.supplier;
  const requestToken = crypto.randomUUID();
  const prefillProduct = productSlug
    ? await getProductBySlug(productSlug, locale)
    : null;
  const prefillSupplier =
    !prefillProduct && supplierSlug
      ? await getSupplierBySlug(supplierSlug, locale)
      : null;
  const statusMessage =
    status && status in t.rfq.status
      ? t.rfq.status[status as keyof typeof t.rfq.status]
      : null;
  const authHref = `${getLocalizedPath(locale, "/register")}?next=${encodeURIComponent(
    getLocalizedPath(locale, "/rfq"),
  )}`;
  const statusIsSuccess = status === "success";

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-7 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
          <div>
            <Badge>
              <PackageSearch className="mr-1 size-3" aria-hidden="true" />
              {t.rfq.badge}
            </Badge>
            <h1 className="page-title">{t.rfq.title}</h1>
            <p className="page-description">{t.rfq.body}</p>
            <div className="mt-6 grid gap-3">
              {t.rfq.bullets.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 border-b border-white/[0.08] pb-3 text-sm leading-6 text-muted-foreground last:border-0 last:pb-0"
                >
                  <CheckCircle2
                    className="mt-1 size-4 shrink-0 text-gold-200"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {!profile ? (
            <Card className="self-start border-gold-300/20 bg-gold-300/[0.045]">
              <CardContent className="p-6 sm:p-8">
                <div className="flex size-11 items-center justify-center rounded-md border border-gold-300/25 bg-gold-300/10 text-gold-100">
                  <PackageSearch className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-semibold leading-tight text-white">
                  {t.rfq.signInRequiredTitle}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  {t.rfq.signInRequiredBody}
                </p>
                <Button asChild size="lg" className="mt-6 w-full sm:w-auto">
                  <Link href={authHref}>{t.rfq.signInToSubmit}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="self-start">
              <CardContent className="p-5 sm:p-6">
                {statusMessage && (
                  <ToastNotice
                    message={statusMessage}
                    dismissLabel={t.common.dismissNotification}
                    tone={statusIsSuccess ? "success" : "error"}
                  />
                )}

                <form action={submitRfq} className="grid gap-4">
                  <input type="hidden" name="locale" value={locale} />
                  <input
                    type="hidden"
                    name="request_token"
                    value={requestToken}
                  />
                  <fieldset className="contents">
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
                    {(prefillProduct || prefillSupplier) && (
                      <div className="rounded-lg border border-gold-300/25 bg-gold-300/[0.08] p-4 text-sm">
                        <p className="font-medium text-white">
                          {prefillProduct?.title ?? prefillSupplier?.name}
                        </p>
                        {prefillProduct && (
                          <p className="mt-1 text-muted-foreground">
                            {prefillProduct.supplierName}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2">
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
                      name="supplier_slug"
                      value={
                        prefillProduct?.supplierSlug ??
                        prefillSupplier?.slug ??
                        ""
                      }
                    />
                    <input
                      type="hidden"
                      name="product_slug"
                      value={prefillProduct?.slug ?? ""}
                    />
                    <div className="grid gap-2">
                      <Label htmlFor="product">{t.rfq.productRequest}</Label>
                      <Input
                        id="product"
                        name="product_request"
                        required
                        minLength={12}
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="category">{t.common.category}</Label>
                        <Select
                          id="category"
                          name="category_slug"
                          defaultValue={prefillProduct?.categorySlug ?? ""}
                          required
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
                          maxLength={80}
                          placeholder={t.rfq.quantityPlaceholder}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
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
                          maxLength={120}
                          placeholder={t.rfq.timelinePlaceholder}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="notes">{t.rfq.notes}</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        maxLength={3000}
                        placeholder={t.rfq.notesPlaceholder}
                      />
                    </div>

                    <RfqAttachmentField
                      help={t.rfq.uploadHelp}
                      label={t.rfq.upload}
                      selectedLabel={t.rfq.attachmentSelected}
                    />

                    <Button type="submit" size="lg" className="w-full">
                      {t.rfq.submit}
                      <Send aria-hidden="true" />
                    </Button>
                  </fieldset>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
