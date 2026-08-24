revoke all on function public.current_user_role()
from public, anon, authenticated, service_role;
grant execute on function public.current_user_role() to authenticated;

revoke all on function public.ensure_supplier_profile(text)
from public, anon, authenticated, service_role;
grant execute on function public.ensure_supplier_profile(text) to authenticated;

revoke all on function public.handle_new_user_profile()
from public, anon, authenticated, service_role;

revoke all on function public.is_admin()
from public, anon, authenticated, service_role;
grant execute on function public.is_admin() to authenticated;

revoke all on function public.is_stripe_webhook_context()
from public, anon, authenticated, service_role;

revoke all on function public.prevent_supplier_account_approval_edits()
from public, anon, authenticated, service_role;

revoke all on function public.prevent_supplier_approval_field_changes()
from public, anon, authenticated, service_role;

revoke all on function public.prevent_supplier_billing_field_changes()
from public, anon, authenticated, service_role;

revoke all on function public.supplier_owns_verification_document(uuid)
from public, anon, authenticated, service_role;
grant execute on function public.supplier_owns_verification_document(uuid)
to authenticated;

revoke all on function public.sync_supplier_stripe_subscription(
  text,
  uuid,
  text,
  text,
  text,
  timestamptz
)
from public, anon, authenticated, service_role;
grant execute on function public.sync_supplier_stripe_subscription(
  text,
  uuid,
  text,
  text,
  text,
  timestamptz
)
to service_role;
