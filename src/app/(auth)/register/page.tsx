import type { Metadata } from "next";
import { BadgeCheck, Check } from "lucide-react";

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
    getLocalizedPath(
      locale,
      supplierIntent ? "/dashboard/profile" : "/dashboard",
    ),
  );

  return (
    <div className="w-full max-w-5xl">
      <div className="grid gap-7 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
        <div>
          <Badge>
            <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
            {t.auth.onboarding}
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {supplierIntent
              ? t.auth.supplierRegisterTitle
              : t.auth.registerTitle}
          </h1>
          {supplierIntent && (
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {t.auth.supplierRegisterBody}
            </p>
          )}
          {!supplierIntent && (
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {t.auth.accountBody}
            </p>
          )}
          <div className="mt-6 hidden gap-3 lg:grid">
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
                className="flex items-start gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-300/15 text-gold-100">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium text-white">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </span>
                </span>
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
          privacyHref={getLocalizedPath(locale, "/privacy")}
          termsHref={getLocalizedPath(locale, "/terms")}
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
            fullNamePlaceholder: t.auth.fullNamePlaceholder,
            emailPlaceholder: t.auth.emailPlaceholder,
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
            authRequired: t.auth.status.authRequired,
            oauthNotReady: t.auth.status.oauthNotReady,
            passwordUpdated: t.auth.status.passwordUpdated,
            agreementStart: t.auth.agreementStart,
            agreementTerms: t.auth.agreementTerms,
            agreementPrivacy: t.auth.agreementPrivacy,
          }}
        />
      </div>
    </div>
  );
}
