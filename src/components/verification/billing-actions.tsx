"use client";

import { useState } from "react";
import { CreditCard, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

type BillingActionsProps = {
  subscribeLabel: string;
  manageLabel: string;
  preparingLabel: string;
  openingLabel: string;
  canManageSubscription: boolean;
  canStartSubscription: boolean;
  errorLabel: string;
  locale: Locale;
};

async function postAndRedirect(path: string, locale: Locale) {
  const response = await fetch(`${path}?locale=${locale}`, { method: "POST" });
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
  locale,
}: BillingActionsProps) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function openBilling(path: string, nextLoading: "checkout" | "portal") {
    setError(null);
    setLoading(nextLoading);

    try {
      await postAndRedirect(path, locale);
    } catch {
      setError(errorLabel);
      setLoading(null);
    }
  }

  return (
    <div className="grid min-w-0 gap-3">
      <div
        className={canStartSubscription ? "grid min-w-0 gap-3 xl:grid-cols-2" : "grid min-w-0 gap-3"}
      >
        {canStartSubscription && (
          <Button
            type="button"
            size="lg"
            className="h-auto min-h-12 min-w-0 whitespace-normal py-3 text-center leading-5"
            disabled={loading !== null}
            onClick={() =>
              openBilling("/api/stripe/create-checkout-session", "checkout")
            }
          >
            <CreditCard aria-hidden="true" />
            {loading === "checkout" ? preparingLabel : subscribeLabel}
          </Button>
        )}
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
      </div>
      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-100">
          {error}
        </p>
      )}
    </div>
  );
}
