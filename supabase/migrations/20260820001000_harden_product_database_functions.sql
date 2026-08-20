alter function public.set_updated_at()
  set search_path = pg_catalog, public;

revoke execute on function public.prevent_supplier_product_status_edits()
from public, anon, authenticated;
