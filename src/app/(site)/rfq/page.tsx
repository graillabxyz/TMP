import type { Metadata } from "next";
import { FileUp, PackageSearch, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Submit an RFQ | TMP",
  description:
    "Send a structured sourcing request to Turkish suppliers with product, quantity, destination country, and attachment details.",
  path: "/rfq",
});

export default function RFQPage() {
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
              <form className="grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="product">Product request</Label>
                  <Input
                    id="product"
                    placeholder="Organic cotton hoodies, CNC housings..."
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select id="category" defaultValue="">
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
                    <Input id="quantity" placeholder="500 units" />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="country">Destination country</Label>
                    <Select id="country" defaultValue="">
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
                    <Input id="timeline" placeholder="Sample in 3 weeks" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes / message</Label>
                  <Textarea
                    id="notes"
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
                  <input id="attachment" type="file" className="sr-only" />
                </label>

                <Button type="button" size="lg" className="w-full">
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
