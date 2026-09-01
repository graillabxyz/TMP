import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";

import { updatePassword } from "@/app/actions/auth";
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
    title: t.auth.resetPasswordTitle,
    description: t.auth.resetPasswordBody,
    path: "/reset-password",
    locale,
  });
}

type ResetPasswordPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const { status } = await searchParams;

  return (
    <div className="w-full max-w-lg">
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex size-11 items-center justify-center rounded-md border border-gold-300/25 bg-gold-300/10 text-gold-100">
            <KeyRound className="size-5" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold text-white">
            {t.auth.resetPasswordTitle}
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {t.auth.resetPasswordBody}
          </p>

          {status && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-red-100"
            >
              {status === "expired"
                ? t.auth.status.resetExpired
                : status === "missing"
                  ? t.auth.status.passwordMismatch
                  : t.auth.status.resetError}
            </div>
          )}

          {status === "expired" ? (
            <Button asChild className="mt-6 w-full" size="lg">
              <Link href={getLocalizedPath(locale, "/forgot-password")}>
                {t.auth.sendResetLink}
              </Link>
            </Button>
          ) : (
            <form action={updatePassword} className="mt-7 grid gap-5">
              <input type="hidden" name="locale" value={locale} />
              <div className="grid gap-2">
                <Label htmlFor="new-password">{t.auth.newPassword}</Label>
                <Input
                  id="new-password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password-confirmation">
                  {t.auth.confirmPassword}
                </Label>
                <Input
                  id="password-confirmation"
                  name="password_confirmation"
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" size="lg">
                {t.auth.updatePassword}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
