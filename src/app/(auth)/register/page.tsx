import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";

import { OnboardingAuthCard } from "@/components/auth/onboarding-auth-card";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getSafeInternalPath } from "@/lib/safe-redirect";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.metadata.registerTitle,
    description: t.metadata.registerDescription,
    path: "/register",
    locale,
  });
}

type RegisterPageProps = {
  searchParams: Promise<{
    intent?: "supplier";
    next?: string;
    role?: "supplier";
    status?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const supplierIntent =
    params.intent === "supplier" || params.role === "supplier";
  const nextPath = getSafeInternalPath(
    params.next,
    supplierIntent ? "/dashboard/profile" : "/dashboard",
  );

  return (
    <div className="w-full max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <Badge>
            <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
            {t.auth.onboarding}
          </Badge>
          <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
            {supplierIntent
              ? t.auth.supplierRegisterTitle
              : t.auth.registerTitle}
          </h1>
          {supplierIntent && (
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              {t.auth.supplierRegisterBody}
            </p>
          )}
          <div className="mt-8 grid gap-3">
            {(supplierIntent
              ? [
                  {
                    label: t.auth.supplierStepAccount,
                    body: t.auth.supplierStepAccountBody,
                  },
                  {
                    label: t.auth.supplierStepUpgrade,
                    body: t.auth.supplierStepUpgradeBody,
                  },
                ]
              : [
                  {
                    label: t.auth.accountPath,
                    body: t.auth.accountPathBody,
                  },
                  {
                    label: t.auth.supplierUpgradePath,
                    body: t.auth.supplierUpgradePathBody,
                  },
                ]
            ).map((item) => (
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

        <OnboardingAuthCard
          mode="register"
          locale={locale}
          loginHref={getLocalizedPath(locale, "/login")}
          registerHref={getLocalizedPath(locale, "/register")}
          forgotPasswordHref={getLocalizedPath(locale, "/forgot-password")}
          supplierIntent={supplierIntent}
          nextPath={nextPath}
          status={params.status}
          labels={{
            accountTitle: t.auth.accountTitle,
            accountBody: t.auth.accountBody,
            supplierIntentTitle: t.auth.supplierIntentTitle,
            supplierIntentBody: t.auth.supplierIntentBody,
            supplierAccountTitle: t.auth.supplierAccountTitle,
            supplierAccountBody: t.auth.supplierAccountBody,
            fullName: t.auth.fullName,
            email: t.auth.email,
            workEmail: t.auth.workEmail,
            password: t.auth.password,
            forgotPassword: t.auth.forgotPassword,
            login: t.auth.login,
            createAccount: t.auth.createAccount,
            supplierLogin: t.auth.supplierLoginCta,
            supplierCreateAccount: t.auth.supplierCreateAccount,
            continueWithGoogle: t.auth.continueWithGoogle,
            supplierContinueWithGoogle: t.auth.supplierContinueWithGoogle,
            googleHelp: t.auth.googleHelp,
            supplierGoogleHelp: t.auth.supplierGoogleHelp,
            orEmail: t.auth.orEmail,
            alreadyAccount: t.auth.alreadyAccount,
            newToTmp: t.auth.newToTmp,
            missing: t.auth.status.missing,
            error: t.auth.status.error,
            checkEmail: t.auth.status.checkEmail,
            oauthNotReady: t.auth.status.oauthNotReady,
            passwordUpdated: t.auth.status.passwordUpdated,
          }}
        />
      </div>
    </div>
  );
}
