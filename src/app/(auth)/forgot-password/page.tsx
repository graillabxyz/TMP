import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import { requestPasswordReset } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.auth.forgotPasswordTitle,
    description: t.auth.forgotPasswordBody,
    path: "/forgot-password",
    locale,
  });
}

type ForgotPasswordPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const { status } = await searchParams;
  const loginHref = getLocalizedPath(locale, "/login");

  return (
    <div className="w-full max-w-lg">
      <Card className="bg-white/[0.035]">
        <CardContent className="p-6 sm:p-8">
          <div className="flex size-11 items-center justify-center rounded-md border border-gold-300/25 bg-gold-300/10 text-gold-100">
            <Mail className="size-5" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold text-white">
            {t.auth.forgotPasswordTitle}
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {t.auth.forgotPasswordBody}
          </p>

          {status === "sent" && (
            <div className="mt-5 rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
              {t.auth.status.resetSent}
            </div>
          )}
          {(status === "missing" ||
            status === "error" ||
            status === "auth-error") && (
            <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-red-100">
              {status === "missing"
                ? t.auth.status.invalidEmail
                : t.auth.status.resetError}
            </div>
          )}

          <form action={requestPasswordReset} className="mt-7 grid gap-5">
            <input type="hidden" name="locale" value={locale} />
            <div className="grid gap-2">
              <Label htmlFor="reset-email">{t.auth.email}</Label>
              <Input
                id="reset-email"
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="you@company.com"
              />
            </div>
            <Button type="submit" size="lg">
              {t.auth.sendResetLink}
            </Button>
          </form>

          <Button asChild variant="ghost" className="mt-5 w-full">
            <Link href={loginHref}>
              <ArrowLeft aria-hidden="true" />
              {t.auth.backToLogin}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
