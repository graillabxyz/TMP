import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

export function createPublicSupabaseClient() {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return createClient<Database>(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
