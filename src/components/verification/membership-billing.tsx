import { BillingActions } from "@/components/verification/billing-actions";
import { Badge } from "@/components/ui/badge";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { isAnnualOfferEligible } from "@/lib/stripe/api";
import { getStripeConfig } from "@/lib/stripe/config";

export async function MembershipBilling({
  locale,
  complimentary,
  supplier,
}: {
  locale: Locale;
  complimentary: boolean;
  supplier: {
    stripeCustomerId: string | null;
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
