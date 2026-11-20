export type MembershipSubscription = {
  id: string;
  status: string;
  customer?: string | { id?: string };
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  cancel_at?: number | null;
  metadata?: {
    supplier_id?: string;
    owner_id?: string;
    membership_plan?: string;
  };
  items?: {
    data: Array<{
      quantity?: number;
      current_period_end?: number;
      price: {
        id: string;
        currency?: string;
        unit_amount?: number | null;
        recurring?: { interval?: string; interval_count?: number } | null;
      };
    }>;
  };
};

export function getMembershipDetails(
  subscription: MembershipSubscription,
  prices: { verificationPriceId: string; annualPriceId: string },
) {
  const items = subscription.items?.data ?? [];
  if (items.length !== 1) return null;
  const item = items[0];
  const plan =
    prices.annualPriceId && item.price.id === prices.annualPriceId
      ? "annual"
      : prices.verificationPriceId &&
          item.price.id === prices.verificationPriceId
        ? "monthly"
        : null;
  if (
    !plan ||
    item.quantity !== 1 ||
    item.price.currency !== "eur" ||
    item.price.unit_amount !== (plan === "annual" ? 60000 : 5000) ||
    item.price.recurring?.interval !== (plan === "annual" ? "year" : "month") ||
    item.price.recurring.interval_count !== 1
  )
    return null;
  const periodEnd = item.current_period_end ?? subscription.current_period_end;
  if (!periodEnd || !Number.isFinite(periodEnd) || periodEnd <= 0) return null;
  return {
    plan: plan as "annual" | "monthly",
    periodEnd,
    endsAt: Math.min(periodEnd, subscription.cancel_at ?? periodEnd),
    canceling: Boolean(
      subscription.cancel_at_period_end || subscription.cancel_at,
    ),
    // Neither plan includes a trial. A trial configured manually must not unlock listings.
    accessStatus:
      subscription.status === "trialing" ? "inactive" : subscription.status,
  };
}

export function blocksNewSubscription(status: string) {
  return !["canceled", "incomplete_expired"].includes(status);
}
