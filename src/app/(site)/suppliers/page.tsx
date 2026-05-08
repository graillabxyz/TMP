import type { Metadata } from "next";
import { Search, SlidersHorizontal } from "lucide-react";

import { SupplierCard } from "@/components/supplier-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createMetadata } from "@/lib/seo";
import { categories, suppliers } from "@/lib/data";

export const metadata: Metadata = createMetadata({
  title: "Verified Turkish Suppliers | TMP",
  description:
    "Browse export-ready Turkish suppliers by category, verification status, MOQ, and European export experience.",
  path: "/suppliers",
});

export default function SuppliersPage() {
  return (
    <section className="section-shell">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge>Supplier directory</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">
            Search Turkish suppliers built for European sourcing teams.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
            Compare verified status, categories, export markets, minimum order
            quantities, and response speed before sending an RFQ.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-muted-foreground">
          <span className="font-semibold text-white">{suppliers.length}</span>{" "}
          suppliers indexed
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[290px_1fr]">
        <aside>
          <Card className="sticky top-24 bg-white/[0.035]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <SlidersHorizontal
                  className="size-4 text-gold-200"
                  aria-hidden="true"
                />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="supplier-search">Search</Label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="supplier-search"
                    className="pl-10"
                    placeholder="Textile, CNC, packaging"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select id="category" defaultValue="all">
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-3">
                <Label>Verification</Label>
                {["Verified suppliers", "EU export experience", "Low MOQ"].map(
                  (item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-muted-foreground"
                    >
                      <input
                        type="checkbox"
                        className="size-4 rounded border-white/20 bg-transparent accent-gold-300"
                      />
                      {item}
                    </label>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.slug} supplier={supplier} />
          ))}
        </div>
      </div>
    </section>
  );
}
