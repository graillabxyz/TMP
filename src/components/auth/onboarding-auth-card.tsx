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
import { ToastNotice } from "@/components/ui/toast-notice";
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
  supplierLabels?: {
    continueWithGoogle: string;
    createAccount: string;
    googleHelp: string;
    intentBody: string;
    intentTitle: string;
    login: string;
  };
  labels: {
    accountTitle: string;
    fullName: string;
    email: string;
    workEmail: string;
    password: string;
    fullNamePlaceholder: string;
    emailPlaceholder: string;
    forgotPassword: string;
    login: string;
    createAccount: string;
    continueWithGoogle: string;
    googleHelp: string;
    orEmail: string;
    missing: string;
    error: string;
    checkEmail: string;
    authRequired: string;
    oauthNotReady: string;
    passwordUpdated: string;
    agreementStart: string;
    agreementTerms: string;
    agreementPrivacy: string;
    dismissNotification: string;
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
  supplierLabels,
  labels,
}: OnboardingAuthCardProps) {
  const statusMessage = useMemo(
    () => getStatusCopy(status, labels),
    [labels, status],
  );
  const nextQuery = encodeURIComponent(nextPath);
  const supplierCopy = supplierIntent ? supplierLabels : undefined;
  const googleLabel = supplierCopy
    ? supplierCopy.continueWithGoogle
    : labels.continueWithGoogle;
  const submitLabel = supplierCopy
    ? mode === "register"
      ? supplierCopy.createAccount
      : supplierCopy.login
    : mode === "register"
      ? labels.createAccount
      : labels.login;
  const googleHelp = supplierCopy
    ? supplierCopy.googleHelp
    : labels.googleHelp;
  const intentQuery = supplierIntent ? "&intent=supplier" : "";

  return (
    <Card className="border-white/[0.12] bg-card shadow-[0_20px_56px_rgba(0,0,0,0.22)]">
      <CardContent className="p-5 sm:p-7 lg:p-8">
        {supplierCopy && (
          <div className="flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.025] p-3.5 text-sm text-white">
            <Building2
              className="mt-0.5 size-5 text-gold-100"
              aria-hidden="true"
            />
            <span>
              <span className="block font-medium">
                {supplierCopy.intentTitle}
              </span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                {supplierCopy.intentBody}
              </span>
            </span>
          </div>
        )}

        {statusMessage && (
          <ToastNotice
            message={statusMessage.copy}
            dismissLabel={labels.dismissNotification}
            tone={statusMessage.tone}
          />
        )}

        <form
          action={signInWithGoogle}
          className={supplierCopy ? "mt-5" : undefined}
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

        <div className="mt-5 flex items-center gap-3 text-xs uppercase text-muted-foreground">
          <span className="h-px flex-1 bg-white/10" />
          {labels.orEmail}
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <nav
          className="mx-auto mt-3 grid w-full max-w-sm grid-cols-2 rounded-md border border-white/10 bg-charcoal-950/45 p-1"
          aria-label={labels.accountTitle}
        >
          <Link
            href={`${loginHref}?next=${nextQuery}${intentQuery}`}
            aria-current={mode === "login" ? "page" : undefined}
            className={cn(
              "flex min-h-10 items-center justify-center rounded-sm px-3 text-center text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm",
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
              "flex min-h-10 items-center justify-center rounded-sm px-3 text-center text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm",
              mode === "register"
                ? "bg-white/[0.1] text-white"
                : "text-muted-foreground hover:text-white",
            )}
          >
            {labels.createAccount}
          </Link>
        </nav>

        <form
          action={mode === "register" ? signUpWithEmail : signInWithEmail}
          className="mt-5 grid gap-4"
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
      </CardContent>
    </Card>
  );
}
