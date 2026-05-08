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
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Dashboard | TMP",
  description: "TMP supplier dashboard placeholder.",
  path: "/dashboard",
});

export default function DashboardPage() {
  const metrics = [
    { label: "Active listings", value: "18", icon: PackagePlus },
    { label: "Open RFQs", value: "7", icon: Inbox },
    { label: "Unread messages", value: "12", icon: MessageSquare },
    { label: "Verification", value: "72%", icon: BadgeCheck },
  ];

  return (
    <DashboardShell
      title="Dashboard"
      description="Track supplier visibility, inbound RFQs, buyer conversations, and verification readiness."
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
                <p className="text-sm text-gold-200">RFQs</p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Recent buyer requests
                </h2>
              </div>
              <Button variant="outline" size="sm">
                View all
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
            <p className="text-sm text-gold-200">Verification</p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Profile readiness
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
                Buyer activity
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
          { title: "Listings", icon: PackagePlus },
          { title: "Messages", icon: MessageSquare },
          { title: "Next actions", icon: Clock3 },
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
                  Keep upcoming work visible as listings, buyer conversations,
                  and verification tasks move through the pipeline.
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}
