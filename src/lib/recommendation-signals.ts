import "server-only";

import { cache } from "react";

import type { RecommendationSignal } from "@/lib/recommendations";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

type ActivityRow = {
  activity_type: "search" | "product_view";
  query: string | null;
  category_slug: string | null;
  product_id: string | null;
  supplier_id: string | null;
  created_at: string;
};

type RfqRow = {
  product_request: string;
  category_slug: string | null;
  product_id: string | null;
  supplier_id: string | null;
  created_at: string;
};

export const getRecommendationSignals = cache(async (userId: string) => {
  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;

  try {
    supabase = await createServerSupabaseClient();
  } catch {
    return [] as RecommendationSignal[];
  }

  const [activityResult, rfqResult] = await Promise.all([
    supabase
      .from("marketplace_activity")
      .select(
        "activity_type, query, category_slug, product_id, supplier_id, created_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("rfqs")
      .select(
        "product_request, category_slug, product_id, supplier_id, created_at",
      )
      .eq("submitter_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (activityResult.error) {
    console.error(
      "Unable to load private marketplace activity",
      activityResult.error.message,
    );
  }

  if (rfqResult.error) {
    console.error(
      "Unable to load private RFQ history",
      rfqResult.error.message,
    );
  }

  const activitySignals = ((activityResult.data ?? []) as ActivityRow[]).map(
    (activity): RecommendationSignal => ({
      kind: activity.activity_type,
      query: activity.query,
      categorySlug: activity.category_slug,
      productId: activity.product_id,
      supplierId: activity.supplier_id,
      createdAt: activity.created_at,
    }),
  );
  const rfqSignals = ((rfqResult.data ?? []) as RfqRow[]).map(
    (rfq): RecommendationSignal => ({
      kind: "rfq",
      query: rfq.product_request,
      categorySlug: rfq.category_slug,
      productId: rfq.product_id,
      supplierId: rfq.supplier_id,
      createdAt: rfq.created_at,
    }),
  );

  return [...rfqSignals, ...activitySignals];
});
