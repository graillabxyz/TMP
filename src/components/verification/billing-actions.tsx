"use client";

import { useState } from "react";
import { CreditCard, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

type BillingActionsProps = {
  subscribeLabel: string;
  manageLabel: string;
  canManageSubscription: boolean;
  errorLabel: string;
};

async function postAndRedirect(path: string) {
  const response = await fetch(path, { method: "POST" });
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
  canManageSubscription,
  errorLabel,
}: BillingActionsProps) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function openBilling(path: string, nextLoading: "checkout" | "portal") {
    setError(null);
    setLoading(nextLoading);

    try {
      await postAndRedirect(path);
    } catch {
      setError(errorLabel);
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          size="lg"
          disabled={loading !== null}
          onClick={() =>
            openBilling("/api/stripe/create-checkout-session", "checkout")
          }
        >
          <CreditCard aria-hidden="true" />
          {loading === "checkout" ? "Preparing..." : subscribeLabel}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          disabled={loading !== null || !canManageSubscription}
          onClick={() => openBilling("/api/stripe/customer-portal", "portal")}
        >
          <ExternalLink aria-hidden="true" />
          {loading === "portal" ? "Opening..." : manageLabel}
        </Button>
      </div>
      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-100">
          {error}
        </p>
      )}
    </div>
  );
}
