import type { Metadata } from "next";

import { OnboardingAuthCard } from "@/components/auth/onboarding-auth-card";
import { OnboardingIntro } from "@/components/auth/onboarding-intro";
import { getDictionary } from "@/lib/dictionary";
import { getLocale, getLocalizedPath } from "@/lib/i18n";
import { getSafeInternalPath } from "@/lib/safe-redirect";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return createMetadata({
    title: t.metadata.loginTitle,
    description: t.metadata.loginDescription,
    path: "/login",
    locale,
  });
}

type LoginPageProps = {
  searchParams: Promise<{
    intent?: "supplier";
    next?: string;
    role?: "supplier";
    status?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
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
    <div className="w-full max-w-5xl self-start">
      <div className="grid gap-7 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
        <OnboardingIntro
          eyebrow={
            supplierIntent ? t.auth.supplierAccount : t.auth.buyerAccount
          }
          title={
            supplierIntent
              ? t.auth.supplierRegisterTitle
              : t.auth.registerTitle
          }
          body={
            supplierIntent ? t.auth.supplierRegisterBody : t.auth.accountBody
          }
          items={
            supplierIntent
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
          }
        />
        <OnboardingAuthCard
          mode="login"
          locale={locale}
          loginHref={getLocalizedPath(locale, "/login")}
          registerHref={getLocalizedPath(locale, "/register")}
          forgotPasswordHref={getLocalizedPath(locale, "/forgot-password")}
          privacyHref={getLocalizedPath(locale, "/privacy")}
          termsHref={getLocalizedPath(locale, "/terms")}
          supplierIntent={supplierIntent}
          nextPath={nextPath}
          status={params.status}
          supplierLabels={
            supplierIntent
              ? {
                  continueWithGoogle: t.auth.supplierContinueWithGoogle,
                  createAccount: t.auth.supplierCreateAccount,
                  googleHelp: t.auth.supplierGoogleHelp,
                  intentBody: t.auth.supplierIntentBody,
                  intentTitle: t.auth.supplierIntentTitle,
                  login: t.auth.supplierLoginCta,
                }
              : undefined
          }
          labels={{
            accountTitle: t.auth.accountTitle,
            fullName: t.auth.fullName,
            email: t.auth.email,
            workEmail: t.auth.workEmail,
            password: t.auth.password,
            fullNamePlaceholder: t.auth.fullNamePlaceholder,
            emailPlaceholder: t.auth.emailPlaceholder,
            forgotPassword: t.auth.forgotPassword,
            login: t.auth.login,
            createAccount: t.auth.createAccount,
            continueWithGoogle: t.auth.continueWithGoogle,
            googleHelp: t.auth.googleHelp,
            orEmail: t.auth.orEmail,
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
