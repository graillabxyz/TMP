create or replace function public.is_stripe_webhook_context()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select current_setting('app.stripe_webhook_context', true) = 'true'
$$;

drop trigger if exists suppliers_prevent_approval_field_changes on public.suppliers;

create or replace function public.prevent_supplier_billing_field_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() or public.is_stripe_webhook_context() then
    return new;
  end if;

  if new.verified is distinct from old.verified
    or new.owner_id is distinct from old.owner_id
    or new.display_order is distinct from old.display_order
    or new.stripe_customer_id is distinct from old.stripe_customer_id
    or new.stripe_subscription_id is distinct from old.stripe_subscription_id
    or new.verification_subscription_status is distinct from old.verification_subscription_status
    or new.verification_started_at is distinct from old.verification_started_at
    or new.verification_expires_at is distinct from old.verification_expires_at then
    raise exception 'Only admins or Stripe webhooks can change supplier approval and billing fields.';
  end if;

  if new.verification_status is distinct from old.verification_status
    and not (old.verification_status in ('none', 'rejected') and new.verification_status = 'pending') then
    raise exception 'Suppliers can only submit verification for admin review.';
  end if;

  return new;
end;
$$;

create trigger suppliers_prevent_approval_field_changes
before update on public.suppliers
for each row execute function public.prevent_supplier_billing_field_changes();

create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_settings enable row level security;

revoke all on public.app_settings from public;
revoke all on public.app_settings from anon;
revoke all on public.app_settings from authenticated;

drop policy if exists "Admins can manage app settings" on public.app_settings;
create policy "Admins can manage app settings"
on public.app_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create or replace function public.sync_supplier_stripe_subscription(
  p_webhook_secret text,
  p_supplier_id uuid,
  p_stripe_customer_id text,
  p_stripe_subscription_id text,
  p_stripe_status text,
  p_current_period_end timestamptz default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  configured_secret text;
  mapped_status text;
begin
  select value
  into configured_secret
  from public.app_settings
  where key = 'stripe_webhook_secret';

  if configured_secret is null or configured_secret = '' then
    raise exception 'Stripe webhook sync secret is not configured.';
  end if;

  if p_webhook_secret is distinct from configured_secret then
    raise exception 'Invalid Stripe webhook sync secret.';
  end if;

  mapped_status := case
    when p_stripe_status in ('active', 'trialing') then 'active'
    when p_stripe_status in ('past_due', 'unpaid') then 'past_due'
    when p_stripe_status in ('canceled', 'incomplete_expired') then 'canceled'
    else 'inactive'
  end;

  perform set_config('app.stripe_webhook_context', 'true', true);

  update public.suppliers
  set
    stripe_customer_id = coalesce(nullif(p_stripe_customer_id, ''), stripe_customer_id),
    stripe_subscription_id = coalesce(nullif(p_stripe_subscription_id, ''), stripe_subscription_id),
    verification_subscription_status = mapped_status,
    verification_started_at = case
      when mapped_status = 'active' then coalesce(verification_started_at, now())
      else verification_started_at
    end,
    verification_expires_at = p_current_period_end,
    updated_at = now()
  where id = p_supplier_id;

  if not found then
    raise exception 'Supplier not found for Stripe subscription sync.';
  end if;
end;
$$;

revoke all on function public.sync_supplier_stripe_subscription(
  text,
  uuid,
  text,
  text,
  text,
  timestamptz
) from public;

grant execute on function public.sync_supplier_stripe_subscription(
  text,
  uuid,
  text,
  text,
  text,
  timestamptz
) to anon, authenticated;

comment on function public.sync_supplier_stripe_subscription(
  text,
  uuid,
  text,
  text,
  text,
  timestamptz
) is 'Updates supplier Stripe subscription fields after a verified Stripe webhook. Requires public.app_settings stripe_webhook_secret.';
