import { fallbackHeroImage } from "@/lib/site-data";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

type SiteAssetRow = {
  bucket: string;
  path: string;
};

export async function getLandingHeroImage() {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return fallbackHeroImage;
  }

  const { data, error } = await supabase
    .from("site_assets")
    .select("bucket, path")
    .eq("key", "landing-hero")
    .eq("ready", true)
    .maybeSingle();
  const asset = data as unknown as SiteAssetRow | null;

  if (error || !asset) {
    if (error && !error.message.includes("site_assets")) {
      console.error("Unable to load landing hero asset", error.message);
    }

    return fallbackHeroImage;
  }

  return supabase.storage.from(asset.bucket).getPublicUrl(asset.path).data
    .publicUrl;
}
