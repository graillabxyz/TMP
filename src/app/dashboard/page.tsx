import type { Metadata } from "next";
import {
  BadgeCheck,
  Clock3,
  Inbox,
  LineChart,
  MessageSquare,
  PackagePlus,
} from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Dashboard | TMP",
  description: "TMP supplier dashboard placeholder.",
  path: "/dashboard",
});

export default async function DashboardPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const metrics = [
    { label: t.dashboard.metrics[0], value: "18", icon: PackagePlus },
    { label: t.dashboard.metrics[1], value: "7", icon: Inbox },
    { label: t.dashboard.metrics[2], value: "12", icon: MessageSquare },
    { label: t.dashboard.metrics[3], value: "72%", icon: BadgeCheck },
  ];

  return (
    <DashboardShell
      eyebrow={t.dashboard.eyebrow}
      title={t.dashboard.title}
      description={t.dashboard.description}
    >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label} className="bg-white/[0.035]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {metric.value}
                    </p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-md border border-gold-300/25 bg-gold-300/10">
                    <Icon className="size-5 text-gold-100" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <Card className="bg-white/[0.035]">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gold-200">{t.dashboard.rfqs}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  {t.dashboard.recentRequests}
                </h2>
              </div>
              <Button variant="outline" size="sm">
                {t.dashboard.viewAll}
              </Button>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                ["Organic cotton basics", "Germany", "500 units", "New"],
                ["Rigid cosmetics boxes", "France", "2,000 units", "Review"],
                ["CNC aluminum housing", "Italy", "100 units", "Quoted"],
              ].map(([product, country, quantity, status]) => (
                <div
                  key={product}
                  className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[1fr_120px_120px_auto] sm:items-center"
                >
                  <p className="font-medium text-white">{product}</p>
                  <p className="text-sm text-muted-foreground">{country}</p>
                  <p className="text-sm text-muted-foreground">{quantity}</p>
                  <Badge variant={status === "New" ? "default" : "secondary"}>
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.035]">
          <CardContent className="p-6">
            <p className="text-sm text-gold-200">{t.dashboard.verification}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {t.dashboard.profileReadiness}
            </h2>
            <div className="mt-6 grid gap-4">
              {[
                ["Company documents", "Complete"],
                ["Certifications", "Needs review"],
                ["Factory photos", "Complete"],
                ["Export references", "Pending"],
              ].map(([item, status]) => (
                <div key={item} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item}</span>
                  <Badge
                    variant={status === "Complete" ? "success" : "secondary"}
                  >
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-lg border border-white/10 bg-charcoal-800 p-4">
              <div className="flex items-center gap-2 text-sm text-white">
                <LineChart
                  className="size-4 text-gold-200"
                  aria-hidden="true"
                />
                {t.dashboard.buyerActivity}
              </div>
              <div className="mt-5 flex h-24 items-end gap-2">
                {[36, 52, 42, 66, 58, 82, 74].map((height, index) => (
                  <div
                    key={`${height}-${index}`}
                    className="flex-1 rounded-t bg-gold-300/70"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {[
          { title: t.dashboard.listings, icon: PackagePlus },
          { title: t.dashboard.messages, icon: MessageSquare },
          { title: t.dashboard.nextActions, icon: Clock3 },
        ].map((section) => {
          const Icon = section.icon;

          return (
            <Card key={section.title} className="bg-white/[0.035]">
              <CardContent className="p-6">
                <Icon className="size-5 text-gold-100" aria-hidden="true" />
                <h2 className="mt-4 font-semibold text-white">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {t.dashboard.placeholder}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}
