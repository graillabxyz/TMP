"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  Chrome,
  ShoppingBag,
} from "lucide-react";

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

type AccountRole = "buyer" | "supplier";
type AuthMode = "login" | "register";

type OnboardingAuthCardProps = {
  mode: AuthMode;
  initialRole?: AccountRole;
  status?: string;
  labels: {
    buyerAccount: string;
    supplierAccount: string;
    buyerBody: string;
    supplierBody: string;
    fullName: string;
    company: string;
    email: string;
    workEmail: string;
    password: string;
    login: string;
    createAccount: string;
    continueWithGoogle: string;
    googleHelp: string;
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

  if (status === "oauth-not-ready") {
    return { tone: "error" as const, copy: labels.oauthNotReady };
  }

  return null;
}

export function OnboardingAuthCard({
  mode,
  initialRole = "buyer",
  status,
  labels,
}: OnboardingAuthCardProps) {
  const [role, setRole] = useState<AccountRole>(initialRole);
  const statusMessage = useMemo(
    () => getStatusCopy(status, labels),
    [labels, status],
  );
  const roleOptions = [
    {
      value: "buyer" as const,
      label: labels.buyerAccount,
      body: labels.buyerBody,
      icon: ShoppingBag,
    },
    {
      value: "supplier" as const,
      label: labels.supplierAccount,
      body: labels.supplierBody,
      icon: Building2,
    },
  ];

  return (
    <Card className="bg-white/[0.035]">
      <CardContent className="p-6 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const selected = role === option.value;

            return (
              <button
                type="button"
                key={option.value}
                onClick={() => setRole(option.value)}
                aria-pressed={selected}
                className={cn(
                  "relative flex min-h-28 items-start gap-3 rounded-lg border p-4 text-left text-sm transition",
                  selected
                    ? "border-gold-300/[0.55] bg-gold-300/[0.12] text-white shadow-glow"
                    : "border-white/10 bg-white/[0.035] text-white hover:border-gold-300/[0.35] hover:bg-white/[0.055]",
                )}
              >
                <Icon
                  className="mt-0.5 size-5 text-gold-100"
                  aria-hidden="true"
                />
                <span>
                  <span className="block font-medium">{option.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {option.body}
                  </span>
                </span>
                {selected && (
                  <span className="text-charcoal-950 absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-gold-300">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
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
          <input type="hidden" name="role" value={role} />
          <Button
            type="submit"
            size="lg"
            variant="secondary"
            className="w-full"
          >
            <Chrome aria-hidden="true" />
            {labels.continueWithGoogle}
          </Button>
          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
            {labels.googleHelp}
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
          <input type="hidden" name="role" value={role} />
          {mode === "register" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="full_name">{labels.fullName}</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  placeholder="Aylin Demir"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">{labels.company}</Label>
                <Input
                  id="company"
                  name="company"
                  required={role === "supplier"}
                  placeholder="Nordic Retail Group"
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
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" size="lg">
            {mode === "register" ? labels.createAccount : labels.login}
            <ArrowRight aria-hidden="true" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "register" ? labels.alreadyAccount : labels.newToTmp}{" "}
          <Link
            href={
              mode === "register"
                ? `/login?role=${role}`
                : `/register?role=${role}`
            }
            className="text-gold-100 hover:text-white"
          >
            {mode === "register" ? labels.login : labels.createAccount}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
