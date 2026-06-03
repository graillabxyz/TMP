import { cookies } from "next/headers";

import type { AccountRole, CurrentProfile } from "@/lib/account";

const demoCookieName = "tmp-demo-role";

export function isDemoAuthEnabled() {
  if (process.env.TMP_DEMO_AUTH_BYPASS !== "true") {
    return false;
  }

  if (process.env.NODE_ENV === "production") {
    return process.env.TMP_DEMO_AUTH_ALLOW_PRODUCTION === "true";
  }

  return true;
}

export function isValidDemoToken(token: string | null) {
  const expectedToken = process.env.TMP_DEMO_AUTH_TOKEN;

  return Boolean(expectedToken && token && token === expectedToken);
}

export function getDemoCookieName() {
  return demoCookieName;
}

export async function getDemoRole(): Promise<AccountRole | null> {
  if (!isDemoAuthEnabled()) {
    return null;
  }

  const role = (await cookies()).get(demoCookieName)?.value;

  if (role === "buyer" || role === "supplier") {
    return role;
  }

  return null;
}

export async function getDemoProfile(): Promise<CurrentProfile> {
  const role = await getDemoRole();

  if (!role) {
    return null;
  }

  return {
    id: `demo-${role}`,
    email: `demo-${role}@turkiyemarketplace.org`,
    role,
  };
}
