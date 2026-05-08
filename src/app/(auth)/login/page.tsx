import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Login | TMP",
  description: "Access your TMP buyer or supplier workspace.",
  path: "/login",
});

export default async function LoginPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="w-full max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm text-gold-200">{t.auth.welcomeBack}</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            {t.auth.loginTitle}
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            {t.auth.loginBody}
          </p>
        </div>
        <Card className="bg-white/[0.035]">
          <CardContent className="p-6 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: t.auth.buyerLogin, icon: ShoppingBag },
                { label: t.auth.supplierLogin, icon: Building2 },
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
              <div className="grid gap-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <Input id="email" type="email" placeholder="you@company.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t.auth.password}</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button type="button" size="lg">
                {t.auth.login}
                <ArrowRight aria-hidden="true" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t.auth.newToTmp}{" "}
              <Link href="/register" className="text-gold-100 hover:text-white">
                {t.auth.createAccount}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
