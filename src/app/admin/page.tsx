import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Clock, ShieldCheck, UserCheck } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { getSuppliers } from "@/lib/marketplace";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Admin | TMP",
  description: "TMP admin approval and verification queue placeholder.",
  path: "/admin",
});

export const revalidate = 300;

export default async function AdminPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const suppliers = await getSuppliers(locale);
  const approvalRows = suppliers.slice(0, 5).map((supplier, index) => ({
    ...supplier,
    status: index % 2 === 0 ? "Verification review" : "Awaiting documents",
    risk: index % 3 === 0 ? "Medium" : "Low",
  }));

  return (
    <DashboardShell
      admin
      eyebrow={t.admin.eyebrow}
      title={t.admin.title}
      description={t.admin.description}
    >
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { label: t.admin.pendingApprovals, value: "14", icon: Clock },
          { label: t.admin.verifiedSuppliers, value: "328", icon: BadgeCheck },
          { label: t.admin.queuedChecks, value: "9", icon: ShieldCheck },
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
              <p className="text-sm text-gold-200">{t.admin.approvalTable}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                {t.admin.queue}
              </h2>
            </div>
            <Button variant="outline" size="sm">
              {t.common.export}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/10 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">{t.admin.supplier}</th>
                  <th className="px-6 py-4 font-medium">{t.common.category}</th>
                  <th className="px-6 py-4 font-medium">{t.common.location}</th>
                  <th className="px-6 py-4 font-medium">{t.common.status}</th>
                  <th className="px-6 py-4 font-medium">{t.admin.risk}</th>
                  <th className="px-6 py-4 font-medium">{t.common.action}</th>
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
                        {t.common.review}
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
            <p className="text-sm text-gold-200">{t.admin.queue}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {t.admin.documentChecks}
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
            <p className="text-sm text-gold-200">{t.admin.controls}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {t.admin.notes}
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {t.admin.notesBody}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
