import type { Metadata } from "next";

import { OnboardingAuthCard } from "@/components/auth/onboarding-auth-card";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Login | TMP",
  description: "Access your TMP account.",
  path: "/login",
});

type LoginPageProps = {
  searchParams: Promise<{
    intent?: "supplier";
    next?: string;
    role?: "supplier";
    status?: string;
  }>;
};

function getSafeNextPath(value: string | undefined, supplierIntent: boolean) {
  if (value?.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return supplierIntent ? "/dashboard/settings/verification" : "/dashboard";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const supplierIntent =
    params.intent === "supplier" || params.role === "supplier";
  const nextPath = getSafeNextPath(params.next, supplierIntent);

  return (
    <div className="w-full max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm text-gold-200">{t.auth.welcomeBack}</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            {t.auth.loginTitle}
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            {t.auth.loginBody}
          </p>
        </div>
        <OnboardingAuthCard
          mode="login"
          supplierIntent={supplierIntent}
          nextPath={nextPath}
          status={params.status}
          labels={{
            accountTitle: t.auth.accountTitle,
            accountBody: t.auth.accountBody,
            supplierIntentTitle: t.auth.supplierIntentTitle,
            supplierIntentBody: t.auth.supplierIntentBody,
            fullName: t.auth.fullName,
            email: t.auth.email,
            workEmail: t.auth.workEmail,
            password: t.auth.password,
            login: t.auth.login,
            createAccount: t.auth.createAccount,
            continueWithGoogle: t.auth.continueWithGoogle,
            googleHelp: t.auth.googleHelp,
            orEmail: t.auth.orEmail,
            alreadyAccount: t.auth.alreadyAccount,
            newToTmp: t.auth.newToTmp,
            missing: t.auth.status.missing,
            error: t.auth.status.error,
            checkEmail: t.auth.status.checkEmail,
            oauthNotReady: t.auth.status.oauthNotReady,
          }}
        />
      </div>
    </div>
  );
}
