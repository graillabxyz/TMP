"use client";

import { useEffect } from "react";

import { recordMarketplaceActivity } from "@/app/actions/marketplace-activity";

type MarketplaceActivityTrackerProps = {
  kind: "search" | "product_view";
  query?: string;
  productId?: string;
  supplierId?: string | null;
  categorySlug?: string | null;
};

export function MarketplaceActivityTracker({
  kind,
  query,
  productId,
  supplierId,
  categorySlug,
}: MarketplaceActivityTrackerProps) {
  useEffect(() => {
    const input =
      kind === "search"
        ? { kind, query, categorySlug: categorySlug ?? undefined }
        : productId
          ? { kind, productId, supplierId, categorySlug }
          : null;

    if (!input) {
      return;
    }

    const fingerprint = `tmp-marketplace-activity:${JSON.stringify(input)}`;

    try {
      const previous = Number(sessionStorage.getItem(fingerprint) ?? 0);

      if (Date.now() - previous < 5 * 60 * 1000) {
        return;
      }

      sessionStorage.setItem(fingerprint, String(Date.now()));
    } catch {
      // Activity tracking remains optional when browser storage is unavailable.
    }

    void recordMarketplaceActivity(input);
  }, [categorySlug, kind, productId, query, supplierId]);

  return null;
}
