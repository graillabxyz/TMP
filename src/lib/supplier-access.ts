type AccountRole = "buyer" | "supplier" | "admin";
type VerificationSubscriptionStatus =
  | "inactive"
  | "active"
  | "past_due"
  | "canceled";

export type SupplierProductAccess = {
  supplierId: string | null;
  role: AccountRole;
  subscriptionStatus: VerificationSubscriptionStatus | null;
  complimentaryPremium: boolean;
};

export function hasSupplierProductAccess(access: SupplierProductAccess) {
  if (!access.supplierId) return false;

  if (access.role === "admin") return true;

  return Boolean(
    access.role === "supplier" &&
    (access.subscriptionStatus === "active" || access.complimentaryPremium),
  );
}
