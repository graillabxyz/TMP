import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Register | TMP",
  description: "Create a buyer or supplier account on TMP.",
  path: "/register",
});

export default async function RegisterPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="w-full max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <Badge>
            <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
            {t.auth.onboarding}
          </Badge>
          <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
            {t.auth.registerTitle}
          </h1>
          <div className="mt-8 grid gap-3">
            {[
              {
                label: t.auth.buyerPath,
                body: t.auth.buyerPathBody,
              },
              {
                label: t.auth.supplierPath,
                body: t.auth.supplierPathBody,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
              >
                <p className="font-medium text-white">{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-white/[0.035]">
          <CardContent className="p-6 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: t.auth.buyerAccount, icon: ShoppingBag },
                { label: t.auth.supplierAccount, icon: Building2 },
              ].map((path) => {
                const Icon = path.icon;

                return (
                  <button
                    type="button"
                    key={path.label}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-left text-sm text-white transition hover:border-gold-300/[0.35] hover:bg-white/[0.055]"
                  >
                    <Icon className="size-5 text-gold-100" aria-hidden="true" />
                    {path.label}
                  </button>
                );
              })}
            </div>

            <form className="mt-8 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t.auth.fullName}</Label>
                  <Input id="name" placeholder="Aylin Demir" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">{t.auth.company}</Label>
                  <Input id="company" placeholder="Nordic Retail Group" />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t.auth.workEmail}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">{t.auth.primaryRole}</Label>
                  <Select id="role" defaultValue="">
                    <option value="" disabled>
                      {t.auth.selectRole}
                    </option>
                    <option value="buyer">{t.auth.buyer}</option>
                    <option value="supplier">{t.auth.supplier}</option>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t.auth.password}</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button type="button" size="lg">
                {t.auth.createAccount}
                <ArrowRight aria-hidden="true" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t.auth.alreadyAccount}{" "}
              <Link href="/login" className="text-gold-100 hover:text-white">
                {t.auth.login}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
