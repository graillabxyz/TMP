import { BillingActions } from "@/components/verification/billing-actions";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import {
  isAnnualOfferEligible,
  retrieveStripeSubscription,
} from "@/lib/stripe/api";
import { getStripeConfig } from "@/lib/stripe/config";
import { getMembershipDetails } from "@/lib/stripe/membership";

export async function MembershipBilling({
  locale,
  complimentary,
  supplier,
}: {
  locale: Locale;
  complimentary: boolean;
  supplier: {
    stripeCustomerId: string | null;
    stripeSubscriptionId?: string | null;
    subscriptionStatus: "active" | "inactive" | "past_due" | "canceled";
  } | null;
}) {
  const t = getDictionary(locale);
  const copy = t.verificationSettings;
  if (complimentary) {
    return (
      <div className="space-y-3">
        <Badge variant="success">{copy.states.lifetime}</Badge>
        <p className="text-sm leading-6 text-muted-foreground">
          {copy.complimentaryNote}
        </p>
      </div>
    );
  }

  const canStart =
    !supplier || !["active", "past_due"].includes(supplier.subscriptionStatus);
  const config = getStripeConfig();
  let annualAvailable = Boolean(config.annualPriceId && config.annualCouponId);
  let annualOffer = true;
  let billingDetails = null;
  if (supplier?.stripeSubscriptionId) {
    try {
      billingDetails = getMembershipDetails(
        await retrieveStripeSubscription(supplier.stripeSubscriptionId),
        config,
      );
    } catch {
      console.error("Unable to load membership billing details.");
    }
  }
  if (canStart && annualAvailable) {
    try {
      annualOffer = await isAnnualOfferEligible(supplier?.stripeCustomerId);
    } catch {
      annualAvailable = false;
    }
  }
  return (
    <div className="space-y-4">
      {supplier && (
        <Badge
          variant={
            supplier.subscriptionStatus === "active" ? "success" : "secondary"
          }
        >
          {copy.states[supplier.subscriptionStatus]}
        </Badge>
      )}
      {!canStart && (
        <div className="space-y-2 text-sm leading-6">
          {billingDetails ? (
            <>
              <p className="font-medium text-white">
                {copy.currentPlan}: {copy[billingDetails.plan]}
              </p>
              <p className="text-muted-foreground">
                {billingDetails.canceling ? copy.accessEnds : copy.renewsOn}:{" "}
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: "medium",
                }).format(new Date(billingDetails.endsAt * 1000))}
              </p>
              <p className="text-muted-foreground">{copy.manageBillingNote}</p>
            </>
          ) : (
            <p className="text-muted-foreground">
              {copy.billingDetailsUnavailable}
            </p>
          )}
        </div>
      )}
      {!supplier && (
        <p className="text-sm leading-6 text-muted-foreground">
          {copy.missingSupplier}
        </p>
      )}
      {canStart && !annualAvailable && (
        <p className="text-sm leading-6 text-muted-foreground">
          {copy.annualUnavailable}
        </p>
      )}
      <BillingActions
        subscribeLabel={copy.subscribe}
        manageLabel={copy.manage}
        preparingLabel={copy.preparing}
        openingLabel={copy.opening}
        canManageSubscription={Boolean(supplier?.stripeCustomerId)}
        canStartSubscription={canStart}
        supplierReady={Boolean(supplier)}
        annualAvailable={annualAvailable}
        annualOffer={annualOffer}
        pricing={copy}
        errorLabel={copy.billingActionError}
        dismissNotificationLabel={t.common.dismissNotification}
        locale={locale}
      />
    </div>
  );
}
