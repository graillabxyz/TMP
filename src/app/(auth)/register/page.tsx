import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";

import { OnboardingAuthCard } from "@/components/auth/onboarding-auth-card";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Register | TMP",
  description: "Create a buyer or supplier account on TMP.",
  path: "/register",
});

type RegisterPageProps = {
  searchParams: Promise<{
    role?: "buyer" | "supplier";
    status?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const locale = await getLocale();
  const params = await searchParams;
  const t = getDictionary(locale);
  const initialRole = params.role === "supplier" ? "supplier" : "buyer";

  return (
    <div className="w-full max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <Badge>
            <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
            {t.auth.onboarding}
          </Badge>
          <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
            {t.auth.registerTitle}
          </h1>
          <div className="mt-8 grid gap-3">
            {[
              {
                label: t.auth.buyerPath,
                body: t.auth.buyerPathBody,
              },
              {
                label: t.auth.supplierPath,
                body: t.auth.supplierPathBody,
              },
            ].map((item) => (
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
          initialRole={initialRole}
          status={params.status}
          labels={{
            buyerAccount: t.auth.buyerAccount,
            supplierAccount: t.auth.supplierAccount,
            buyerBody: t.auth.buyerPathBody,
            supplierBody: t.auth.supplierPathBody,
            fullName: t.auth.fullName,
            company: t.auth.company,
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
