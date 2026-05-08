import type { Metadata } from "next";
import { FileUp, PackageSearch, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitRfq } from "@/app/actions/rfq";
import { getCategories } from "@/lib/marketplace";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Submit an RFQ | TMP",
  description:
    "Send a structured sourcing request to Turkish suppliers with product, quantity, destination country, and attachment details.",
  path: "/rfq",
});

type RFQPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

const statusMessages = {
  success: "RFQ submitted. Our sourcing team will review it shortly.",
  missing: "Please add a product request, quantity, and destination country.",
  config: "Supabase is not configured for this environment yet.",
  error: "We could not submit the RFQ. Please try again.",
};

export const revalidate = 300;

export default async function RFQPage({ searchParams }: RFQPageProps) {
  const [categories, resolvedSearchParams] = await Promise.all([
    getCategories(),
    searchParams,
  ]);
  const status = resolvedSearchParams?.status;
  const statusMessage =
    status && status in statusMessages
      ? statusMessages[status as keyof typeof statusMessages]
      : null;

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div>
            <Badge>
              <PackageSearch className="mr-1 size-3" aria-hidden="true" />
              Request for quote
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
              Send one sourcing brief. Reach the right Turkish suppliers.
            </h1>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Share the details suppliers need to evaluate fit, prepare pricing,
              and respond with a useful next step.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                "Product specifications",
                "Target quantity and destination",
                "Optional drawings or reference files",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-white/[0.035]">
            <CardContent className="p-6 sm:p-8">
              {statusMessage && (
                <div className="mb-5 rounded-lg border border-gold-300/25 bg-gold-300/[0.08] px-4 py-3 text-sm text-gold-50">
                  {statusMessage}
                </div>
              )}

              <form action={submitRfq} className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="product">Product request</Label>
                  <Input
                    id="product"
                    name="product_request"
                    required
                    placeholder="Organic cotton hoodies, CNC housings..."
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select id="category" name="category_slug" defaultValue="">
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      required
                      placeholder="500 units"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="country">Destination country</Label>
                    <Select
                      id="country"
                      name="destination_country"
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Select country
                      </option>
                      {[
                        "Germany",
                        "Netherlands",
                        "France",
                        "Spain",
                        "Italy",
                        "United Kingdom",
                      ].map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timeline">Target timeline</Label>
                    <Input
                      id="timeline"
                      name="target_timeline"
                      placeholder="Sample in 3 weeks"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes / message</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Share materials, certifications, packaging, Incoterms, and any existing supplier benchmark."
                  />
                </div>

                <label
                  htmlFor="attachment"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gold-300/30 bg-gold-300/[0.05] px-6 py-8 text-center transition hover:bg-gold-300/[0.08]"
                >
                  <FileUp className="size-8 text-gold-100" aria-hidden="true" />
                  <span className="mt-3 text-sm font-medium text-white">
                    Upload attachment
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    Technical drawings, reference images, or spec sheets
                  </span>
                  <input
                    id="attachment"
                    name="attachment"
                    type="file"
                    className="sr-only"
                  />
                </label>

                <Button type="submit" size="lg" className="w-full">
                  Submit RFQ
                  <Send aria-hidden="true" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
