type BadgeEligibility = {
  complimentaryPremium?: boolean;
  verificationStatus: string;
  subscriptionStatus: string;
  expiresAt?: string | null;
};

export function hasActiveVerifiedBadge(
  supplier: BadgeEligibility,
  now = Date.now(),
) {
  if (supplier.verificationStatus !== "verified") {
    return false;
  }

  if (
    !supplier.complimentaryPremium &&
    supplier.subscriptionStatus !== "active"
  ) {
    return false;
  }

  if (!supplier.expiresAt) {
    return true;
  }

  const expiresAt = Date.parse(supplier.expiresAt);

  return Number.isFinite(expiresAt) && expiresAt > now;
}
