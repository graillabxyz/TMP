"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Check, Chrome, UserRound } from "lucide-react";

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
    oauthNotReady: string;
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

  if (status === "oauth-error" || status === "oauth-not-ready") {
    return { tone: "error" as const, copy: labels.oauthNotReady };
  }

  return null;
}

export function OnboardingAuthCard({
  mode,
  supplierIntent = false,
  nextPath = "/dashboard",
  status,
  labels,
}: OnboardingAuthCardProps) {
  const statusMessage = useMemo(
    () => getStatusCopy(status, labels),
    [labels, status],
  );
  const nextQuery = encodeURIComponent(nextPath);
  const accountTitle = supplierIntent
    ? labels.supplierAccountTitle
    : labels.accountTitle;
  const accountBody = supplierIntent
    ? labels.supplierAccountBody
    : labels.accountBody;
  const googleLabel = supplierIntent
    ? labels.supplierContinueWithGoogle
    : labels.continueWithGoogle;
  const googleHelp = supplierIntent
    ? labels.supplierGoogleHelp
    : labels.googleHelp;
  const submitLabel = supplierIntent
    ? mode === "register"
      ? labels.supplierCreateAccount
      : labels.supplierLogin
    : mode === "register"
      ? labels.createAccount
      : labels.login;

  return (
    <Card className="bg-white/[0.035]">
      <CardContent className="p-6 sm:p-8">
        <div className="grid gap-3">
          <div className="relative flex items-start gap-3 rounded-lg border border-gold-300/[0.45] bg-gold-300/[0.1] p-4 text-sm text-white shadow-glow">
            <UserRound
              className="mt-0.5 size-5 text-gold-100"
              aria-hidden="true"
            />
            <span>
              <span className="block font-medium">{accountTitle}</span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                {accountBody}
              </span>
            </span>
            <span className="text-charcoal-950 absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-gold-300">
              <Check className="size-3" aria-hidden="true" />
            </span>
          </div>

          {supplierIntent && (
            <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm text-white">
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
        </div>

        {statusMessage && (
          <div
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

        <form action={signInWithGoogle} className="mt-8">
          <input type="hidden" name="auth_mode" value={mode} />
          <input type="hidden" name="next" value={nextPath} />
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="w-full"
          >
            <Chrome aria-hidden="true" />
            {googleLabel}
          </Button>
          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
            {googleHelp}
          </p>
        </form>

        <div className="my-7 flex items-center gap-3 text-xs uppercase text-muted-foreground">
          <span className="h-px flex-1 bg-white/10" />
          {labels.orEmail}
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form
          action={mode === "register" ? signUpWithEmail : signInWithEmail}
          className="grid gap-5"
        >
          <input type="hidden" name="next" value={nextPath} />
          {mode === "register" && (
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="full_name">{labels.fullName}</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Aylin Demir"
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
              placeholder="you@company.com"
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

          <Button type="submit" size="lg">
            {submitLabel}
            <ArrowRight aria-hidden="true" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "register" ? labels.alreadyAccount : labels.newToTmp}{" "}
          <Link
            href={
              mode === "register"
                ? `/login?next=${nextQuery}`
                : `/register?next=${nextQuery}`
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
