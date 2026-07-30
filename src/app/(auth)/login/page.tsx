import type { Metadata } from "next";

import { OnboardingAuthCard } from "@/components/auth/onboarding-auth-card";
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
    <div className="w-full max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm text-gold-200">{t.auth.welcomeBack}</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            {supplierIntent ? t.auth.supplierLoginTitle : t.auth.loginTitle}
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            {supplierIntent ? t.auth.supplierLoginBody : t.auth.loginBody}
          </p>
        </div>
        <OnboardingAuthCard
          mode="login"
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
            authRequired: t.auth.status.authRequired,
            oauthNotReady: t.auth.status.oauthNotReady,
            passwordUpdated: t.auth.status.passwordUpdated,
          }}
        />
      </div>
    </div>
  );
}
