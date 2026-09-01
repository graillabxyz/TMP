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
    <div className="w-full max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,.86fr)_minmax(520px,1.14fr)] lg:items-center lg:gap-12 xl:gap-16">
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
            dismissNotification: t.common.dismissNotification,
          }}
        />
      </div>
    </div>
  );
}
