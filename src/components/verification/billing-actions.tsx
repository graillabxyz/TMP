"use client";

import { useState } from "react";
import { CreditCard, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

type BillingActionsProps = {
  subscribeLabel: string;
  manageLabel: string;
  subscriptionActive: boolean;
};

async function postAndRedirect(path: string) {
  const response = await fetch(path, { method: "POST" });
  const payload = (await response.json()) as { url?: string };

  if (payload.url) {
    window.location.assign(payload.url);
  }
}

export function BillingActions({
  subscribeLabel,
  manageLabel,
  subscriptionActive,
}: BillingActionsProps) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button
        type="button"
        size="lg"
        disabled={loading !== null}
        onClick={async () => {
          setLoading("checkout");
          await postAndRedirect("/api/stripe/create-checkout-session");
        }}
      >
        <CreditCard aria-hidden="true" />
        {loading === "checkout" ? "Preparing..." : subscribeLabel}
      </Button>
      <Button
        type="button"
        size="lg"
        variant="outline"
        disabled={loading !== null || !subscriptionActive}
        onClick={async () => {
          setLoading("portal");
          await postAndRedirect("/api/stripe/customer-portal");
        }}
      >
        <ExternalLink aria-hidden="true" />
        {loading === "portal" ? "Opening..." : manageLabel}
      </Button>
    </div>
  );
}
