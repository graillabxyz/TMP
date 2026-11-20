export function getStripeConfig() {
  return {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    secretKey: process.env.STRIPE_SECRET_KEY ?? "",
    verificationPriceId: process.env.STRIPE_VERIFICATION_PRICE_ID ?? "",
    annualPriceId: process.env.STRIPE_ANNUAL_PRICE_ID ?? "",
    annualCouponId: process.env.STRIPE_ANNUAL_COUPON_ID ?? "",
    portalConfigurationId: process.env.STRIPE_PORTAL_CONFIGURATION_ID ?? "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  };
}

export function isStripeServerConfigured() {
  const config = getStripeConfig();

  return Boolean(config.secretKey && config.verificationPriceId);
}
