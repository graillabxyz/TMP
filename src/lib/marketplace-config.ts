export const OWNER_CONTACT_EMAIL = "o.biyik@outlook.fr";

export const VERIFIED_SUPPLIER_PLAN = {
  amountCents: 5_000,
  currency: "eur",
  interval: "month",
} as const;

type StripePriceLike = {
  active: boolean;
  currency: string;
  unit_amount: number | null;
  recurring?: {
    interval?: string;
  } | null;
};

export function isExpectedVerificationPrice(price: StripePriceLike) {
  return (
    price.active &&
    price.currency.toLowerCase() === VERIFIED_SUPPLIER_PLAN.currency &&
    price.unit_amount === VERIFIED_SUPPLIER_PLAN.amountCents &&
    price.recurring?.interval === VERIFIED_SUPPLIER_PLAN.interval
  );
}
