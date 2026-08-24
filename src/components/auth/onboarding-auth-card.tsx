"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Chrome } from "lucide-react";

import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";

type OnboardingAuthCardProps = {
  mode: AuthMode;
  supplierIntent?: boolean;
  nextPath?: string;
  locale: string;
  loginHref: string;
  registerHref: string;
  forgotPasswordHref: string;
  privacyHref: string;
  termsHref: string;
  status?: string;
  labels: {
    accountTitle: string;
    accountBody: string;
    supplierIntentTitle: string;
    supplierIntentBody: string;
    supplierAccountTitle: string;
    supplierAccountBody: string;
    fullName: string;
    email: string;
    workEmail: string;
    password: string;
    fullNamePlaceholder: string;
    emailPlaceholder: string;
    forgotPassword: string;
    login: string;
    createAccount: string;
    supplierLogin: string;
    supplierCreateAccount: string;
    continueWithGoogle: string;
    supplierContinueWithGoogle: string;
    googleHelp: string;
    supplierGoogleHelp: string;
    orEmail: string;
    alreadyAccount: string;
    newToTmp: string;
    missing: string;
    error: string;
    checkEmail: string;
    authRequired: string;
    oauthNotReady: string;
    passwordUpdated: string;
    agreementStart: string;
    agreementTerms: string;
    agreementPrivacy: string;
  };
};

function getStatusCopy(
  status: string | undefined,
  labels: OnboardingAuthCardProps["labels"],
) {
  if (status === "missing") {
    return { tone: "error" as const, copy: labels.missing };
  }

  if (status === "error" || status === "auth-error") {
    return { tone: "error" as const, copy: labels.error };
  }

  if (status === "check-email") {
    return { tone: "success" as const, copy: labels.checkEmail };
  }

  if (status === "auth-required") {
    return { tone: "error" as const, copy: labels.authRequired };
  }

  if (status === "password-updated") {
    return { tone: "success" as const, copy: labels.passwordUpdated };
  }

  if (status === "oauth-error" || status === "oauth-not-ready") {
    return { tone: "error" as const, copy: labels.oauthNotReady };
  }

  return null;
}

export function OnboardingAuthCard({
  mode,
  supplierIntent = false,
  nextPath = "/dashboard",
  locale,
  loginHref,
  registerHref,
  forgotPasswordHref,
  privacyHref,
  termsHref,
  status,
  labels,
}: OnboardingAuthCardProps) {
  const statusMessage = useMemo(
    () => getStatusCopy(status, labels),
    [labels, status],
  );
  const nextQuery = encodeURIComponent(nextPath);
  const googleLabel = supplierIntent
    ? labels.supplierContinueWithGoogle
    : labels.continueWithGoogle;
  const submitLabel = supplierIntent
    ? mode === "register"
      ? labels.supplierCreateAccount
      : labels.supplierLogin
    : mode === "register"
      ? labels.createAccount
      : labels.login;
  const googleHelp = supplierIntent
    ? labels.supplierGoogleHelp
    : labels.googleHelp;
  const intentQuery = supplierIntent ? "&intent=supplier" : "";

  return (
    <Card className="bg-white/[0.035]">
      <CardContent className="p-5 sm:p-6">
        <nav
          className="mb-5 grid grid-cols-2 rounded-md border border-white/10 bg-black/20 p-1"
          aria-label={labels.accountTitle}
        >
          <Link
            href={`${loginHref}?next=${nextQuery}${intentQuery}`}
            aria-current={mode === "login" ? "page" : undefined}
            className={cn(
              "flex min-h-10 items-center justify-center rounded-sm px-3 text-center text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              mode === "login"
                ? "bg-white/[0.1] text-white"
                : "text-muted-foreground hover:text-white",
            )}
          >
            {labels.login}
          </Link>
          <Link
            href={`${registerHref}?next=${nextQuery}${intentQuery}`}
            aria-current={mode === "register" ? "page" : undefined}
            className={cn(
              "flex min-h-10 items-center justify-center rounded-sm px-3 text-center text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              mode === "register"
                ? "bg-white/[0.1] text-white"
                : "text-muted-foreground hover:text-white",
            )}
          >
            {labels.createAccount}
          </Link>
        </nav>

        {supplierIntent && (
          <div className="flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.025] p-3.5 text-sm text-white">
            <Building2
              className="mt-0.5 size-5 text-gold-100"
              aria-hidden="true"
            />
            <span>
              <span className="block font-medium">
                {labels.supplierIntentTitle}
              </span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                {labels.supplierIntentBody}
              </span>
            </span>
          </div>
        )}

        {statusMessage && (
          <div
            role={statusMessage.tone === "success" ? "status" : "alert"}
            className={cn(
              "mt-5 rounded-lg border px-4 py-3 text-sm",
              statusMessage.tone === "success"
                ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
                : "border-destructive/30 bg-destructive/10 text-red-100",
            )}
          >
            {statusMessage.copy}
          </div>
        )}

        <form
          action={signInWithGoogle}
          className={supplierIntent || statusMessage ? "mt-5" : undefined}
        >
          <input type="hidden" name="auth_mode" value={mode} />
          <input type="hidden" name="next" value={nextPath} />
          <input type="hidden" name="locale" value={locale} />
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="w-full"
          >
            <Chrome aria-hidden="true" />
            {googleLabel}
          </Button>
          <p className="mt-2 text-center text-xs leading-5 text-muted-foreground">
            {googleHelp}
          </p>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs uppercase text-muted-foreground">
          <span className="h-px flex-1 bg-white/10" />
          {labels.orEmail}
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form
          action={mode === "register" ? signUpWithEmail : signInWithEmail}
          className="grid gap-4"
        >
          <input type="hidden" name="next" value={nextPath} />
          <input type="hidden" name="locale" value={locale} />
          {mode === "register" && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full_name">{labels.fullName}</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  placeholder={labels.fullNamePlaceholder}
                />
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">
              {mode === "register" ? labels.workEmail : labels.email}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder={labels.emailPlaceholder}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">{labels.password}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={128}
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              placeholder="••••••••"
            />
          </div>

          {mode === "login" && (
            <div className="-mt-2 text-right">
              <Link
                href={forgotPasswordHref}
                className="rounded-sm text-sm text-gold-100 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {labels.forgotPassword}
              </Link>
            </div>
          )}

          <Button type="submit" size="lg">
            {submitLabel}
            <ArrowRight aria-hidden="true" />
          </Button>

          {mode === "register" && (
            <p className="text-center text-xs leading-5 text-muted-foreground">
              {labels.agreementStart}{" "}
              <Link
                href={termsHref}
                className="text-gold-100 underline underline-offset-4 hover:text-white"
              >
                {labels.agreementTerms}
              </Link>{" "}
              <Link
                href={privacyHref}
                className="text-gold-100 underline underline-offset-4 hover:text-white"
              >
                {labels.agreementPrivacy}
              </Link>
            </p>
          )}
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "register" ? labels.alreadyAccount : labels.newToTmp}{" "}
          <Link
            href={
              mode === "register"
                ? `${loginHref}?next=${nextQuery}`
                : `${registerHref}?next=${nextQuery}`
            }
            className="rounded-sm text-gold-100 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {mode === "register" ? labels.login : labels.createAccount}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
