import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Clock, ShieldCheck, UserCheck } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { suppliers } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Admin | TMP",
  description: "TMP admin approval and verification queue placeholder.",
  path: "/admin",
});

export default function AdminPage() {
  const approvalRows = suppliers.slice(0, 5).map((supplier, index) => ({
    ...supplier,
    status: index % 2 === 0 ? "Verification review" : "Awaiting documents",
    risk: index % 3 === 0 ? "Medium" : "Low",
  }));

  return (
    <DashboardShell
      admin
      eyebrow="Admin console"
      title="Supplier approvals"
      description="Review supplier applications, verification status, documents, and marketplace readiness."
    >
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { label: "Pending approvals", value: "14", icon: Clock },
          { label: "Verified suppliers", value: "328", icon: BadgeCheck },
          { label: "Queued checks", value: "9", icon: ShieldCheck },
        ].map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label} className="bg-white/[0.035]">
              <CardContent className="p-5">
                <Icon className="size-5 text-gold-100" aria-hidden="true" />
                <p className="mt-5 text-sm text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {metric.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 overflow-hidden bg-white/[0.035]">
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 p-6">
            <div>
              <p className="text-sm text-gold-200">Approval table</p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Supplier verification queue
              </h2>
            </div>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/10 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Supplier</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Risk</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {approvalRows.map((supplier) => (
                  <tr
                    key={supplier.slug}
                    className="border-b border-white/10 transition hover:bg-white/[0.035]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={supplier.image}
                          alt={supplier.name}
                          width={40}
                          height={40}
                          className="size-10 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium text-white">
                            {supplier.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {supplier.responseTime}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {supplier.category}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {supplier.city}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{supplier.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          supplier.risk === "Low" ? "success" : "default"
                        }
                      >
                        {supplier.risk}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm">
                        <UserCheck aria-hidden="true" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/[0.035]">
          <CardContent className="p-6">
            <p className="text-sm text-gold-200">Verification queue</p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Document checks
            </h2>
            <div className="mt-6 grid gap-3">
              {["Tax registration", "Factory audit", "EU references"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-muted-foreground"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.035]">
          <CardContent className="p-6">
            <p className="text-sm text-gold-200">Marketplace controls</p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Approval notes
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              Keep reviewer notes close to approval decisions, verification
              evidence, category quality, and supplier readiness signals.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
