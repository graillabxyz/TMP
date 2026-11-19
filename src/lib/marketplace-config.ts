export const OWNER_CONTACT_EMAIL = "o.biyik@outlook.fr";

export const VERIFIED_SUPPLIER_PLAN = {
  amountCents: 5_000,
  currency: "eur",
  interval: "month",
} as const;

export type MembershipPlan = "monthly" | "annual";

export const ANNUAL_SUPPLIER_PLAN = {
  amountCents: 60_000,
  firstYearAmountCents: 30_000,
  currency: "eur",
  interval: "year",
} as const;

type StripePriceLike = {
  active: boolean;
  currency: string;
  unit_amount: number | null;
  recurring?: {
    interval?: string;
    interval_count?: number;
  } | null;
};

export function isExpectedVerificationPrice(
  price: StripePriceLike,
  plan: MembershipPlan = "monthly",
) {
  const expected =
    plan === "annual" ? ANNUAL_SUPPLIER_PLAN : VERIFIED_SUPPLIER_PLAN;
  return (
    price.active &&
    price.currency.toLowerCase() === expected.currency &&
    price.unit_amount === expected.amountCents &&
    price.recurring?.interval === expected.interval &&
    (price.recurring.interval_count ?? 1) === 1
  );
}

export function isExpectedAnnualCoupon(
  coupon: {
    valid: boolean;
    duration: string;
    percent_off: number | null;
    applies_to?: { products: string[] };
  },
  productId: string,
) {
  return (
    coupon.valid &&
    coupon.duration === "once" &&
    coupon.percent_off === 50 &&
    coupon.applies_to?.products.includes(productId) === true
  );
}
