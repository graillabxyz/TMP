"use server";

import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type MarketplaceActivityInsert =
  Database["public"]["Tables"]["marketplace_activity"]["Insert"];
type MarketplaceActivityMutationTable = {
  insert: (
    payload: MarketplaceActivityInsert,
  ) => Promise<{ error: { message: string } | null }>;
};

type MarketplaceActivityInput =
  | {
      kind: "search";
      query?: string;
      categorySlug?: string;
    }
  | {
      kind: "product_view";
      productId: string;
      supplierId?: string | null;
      categorySlug?: string | null;
    };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function cleanQuery(value: string | undefined) {
  const query = value?.trim().replace(/\s+/g, " ").slice(0, 120) ?? "";

  return query.length >= 2 ? query : null;
}

function cleanSlug(value: string | null | undefined) {
  const slug = value?.trim().slice(0, 100) ?? "";

  return SLUG_PATTERN.test(slug) ? slug : null;
}

export async function recordMarketplaceActivity(
  input: MarketplaceActivityInput,
) {
  let supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;

  try {
    supabase = await createServerSupabaseClient();
  } catch {
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  if (input.kind === "search") {
    const query = cleanQuery(input.query);
    const categorySlug = cleanSlug(input.categorySlug);

    if (!query && !categorySlug) {
      return;
    }

    const activityMutations = supabase.from(
      "marketplace_activity",
    ) as unknown as MarketplaceActivityMutationTable;
    const { error } = await activityMutations.insert({
      user_id: user.id,
      activity_type: "search",
      query,
      category_slug: categorySlug,
    });

    if (error) {
      console.error("Unable to record marketplace search", error.message);
    }

    return;
  }

  if (!UUID_PATTERN.test(input.productId)) {
    return;
  }

  const supplierId =
    input.supplierId && UUID_PATTERN.test(input.supplierId)
      ? input.supplierId
      : null;
  const activityMutations = supabase.from(
    "marketplace_activity",
  ) as unknown as MarketplaceActivityMutationTable;
  const { error } = await activityMutations.insert({
    user_id: user.id,
    activity_type: "product_view",
    query: null,
    category_slug: cleanSlug(input.categorySlug),
    product_id: input.productId,
    supplier_id: supplierId,
  });

  if (error) {
    console.error("Unable to record marketplace product view", error.message);
  }
}
