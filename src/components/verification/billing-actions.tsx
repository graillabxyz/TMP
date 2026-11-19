"use client";

import { useState } from "react";
import { CreditCard, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToastNotice } from "@/components/ui/toast-notice";
import type { Locale } from "@/lib/i18n";
import type { MembershipPlan } from "@/lib/marketplace-config";

type BillingActionsProps = {
  subscribeLabel: string;
  manageLabel: string;
  preparingLabel: string;
  openingLabel: string;
  canManageSubscription: boolean;
  canStartSubscription: boolean;
  errorLabel: string;
  dismissNotificationLabel: string;
  locale: Locale;
  supplierReady: boolean;
  annualAvailable: boolean;
  annualOffer: boolean;
  pricing: {
    monthly: string;
    annual: string;
    price: string;
    priceNote: string;
    annualPrice: string;
    annualRenewalPrice: string;
    annualNote: string;
    annualRenewalNote: string;
    annualSaving: string;
    billingPeriod: string;
  };
};

async function postAndRedirect(
  path: string,
  locale: Locale,
  plan: MembershipPlan,
  annualOffer: boolean,
) {
  const response = await fetch(`${path}?locale=${locale}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, annualOffer }),
  });
  const payload = (await response.json()) as { message?: string; url?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? "Unable to open Stripe billing.");
  }

  if (payload.url) {
    window.location.assign(payload.url);

    return;
  }

  throw new Error(payload.message ?? "Stripe did not return a billing URL.");
}

export function BillingActions({
  subscribeLabel,
  manageLabel,
  preparingLabel,
  openingLabel,
  canManageSubscription,
  canStartSubscription,
  errorLabel,
  dismissNotificationLabel,
  locale,
  supplierReady,
  annualAvailable,
  annualOffer,
  pricing,
}: BillingActionsProps) {
  const [plan, setPlan] = useState<MembershipPlan>("monthly");
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function openBilling(path: string, nextLoading: "checkout" | "portal") {
    setError(null);
    setLoading(nextLoading);

    try {
      await postAndRedirect(path, locale, plan, annualOffer);
    } catch {
      setError(errorLabel);
      setLoading(null);
    }
  }

  return (
    <div className="grid min-w-0 gap-3">
      {canStartSubscription && (
        <fieldset className="min-w-0 space-y-4" disabled={loading !== null}>
          <legend className="sr-only">{pricing.billingPeriod}</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["monthly", "annual"] as const).map((option) => (
              <label
                key={option}
                className={`flex min-h-11 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${plan === option ? "border-gold-300 bg-gold-300/10 text-gold-100" : "border-white/15 text-muted-foreground"} ${option === "annual" && !annualAvailable ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <input
                  type="radio"
                  name="membership-plan"
                  value={option}
                  checked={plan === option}
                  disabled={option === "annual" && !annualAvailable}
                  onChange={() => setPlan(option)}
                  className="accent-gold-300"
                />
                {pricing[option]}
              </label>
            ))}
          </div>
          <div className="space-y-2 pb-2">
            <p className="text-xl font-semibold text-white">
              {plan === "monthly"
                ? pricing.price
                : annualOffer
                  ? pricing.annualPrice
                  : pricing.annualRenewalPrice}
            </p>
            {plan === "annual" && annualOffer && (
              <p className="text-sm font-medium text-gold-200">
                {pricing.annualSaving}
              </p>
            )}
            <p className="text-sm leading-6 text-muted-foreground">
              {plan === "monthly"
                ? pricing.priceNote
                : annualOffer
                  ? pricing.annualNote
                  : pricing.annualRenewalNote}
            </p>
          </div>
        </fieldset>
      )}
      <div
        className={
          canStartSubscription && canManageSubscription
            ? "grid min-w-0 gap-3 xl:grid-cols-2"
            : "grid min-w-0 gap-3"
        }
      >
        {canStartSubscription && (
          <Button
            type="button"
            size="lg"
            className="h-auto min-h-12 min-w-0 whitespace-normal py-3 text-center leading-5"
            disabled={loading !== null || !supplierReady}
            onClick={() =>
              openBilling("/api/stripe/create-checkout-session", "checkout")
            }
          >
            <CreditCard aria-hidden="true" />
            {loading === "checkout" ? preparingLabel : subscribeLabel}
          </Button>
        )}
        {canManageSubscription && (
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="h-auto min-h-12 min-w-0 whitespace-normal py-3 text-center leading-5"
            disabled={loading !== null || !canManageSubscription}
            onClick={() => openBilling("/api/stripe/customer-portal", "portal")}
          >
            <ExternalLink aria-hidden="true" />
            {loading === "portal" ? openingLabel : manageLabel}
          </Button>
        )}
      </div>
      {error && (
        <ToastNotice
          message={error}
          dismissLabel={dismissNotificationLabel}
          tone="error"
        />
      )}
    </div>
  );
}
