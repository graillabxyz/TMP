alter table public.suppliers
  add column if not exists stripe_last_event_id text,
  add column if not exists stripe_last_event_created_at timestamptz;

create unique index if not exists suppliers_stripe_customer_id_unique_idx
on public.suppliers (stripe_customer_id)
where stripe_customer_id is not null;

create unique index if not exists suppliers_stripe_subscription_id_unique_idx
on public.suppliers (stripe_subscription_id)
where stripe_subscription_id is not null;

select set_config('app.stripe_webhook_context', 'true', true);

update public.suppliers
set
  verification_subscription_status = 'active',
  verification_started_at = coalesce(verification_started_at, now()),
  verified = true,
  updated_at = now()
where verification_status = 'verified'
  and verification_subscription_status = 'inactive';

drop function if exists public.sync_supplier_stripe_subscription(
  text,
  uuid,
  text,
  text,
  text,
  timestamptz
);

delete from public.app_settings
where key = 'stripe_webhook_secret';

create or replace function public.prevent_supplier_billing_field_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() or public.is_stripe_webhook_context() then
    new.verified := (
      new.verification_status = 'verified'
      and new.verification_subscription_status = 'active'
      and (
        new.verification_expires_at is null
        or new.verification_expires_at > now()
      )
    );
    return new;
  end if;

  if new.verified is distinct from old.verified
    or new.owner_id is distinct from old.owner_id
    or new.display_order is distinct from old.display_order
    or new.stripe_customer_id is distinct from old.stripe_customer_id
    or new.stripe_subscription_id is distinct from old.stripe_subscription_id
    or new.stripe_last_event_id is distinct from old.stripe_last_event_id
    or new.stripe_last_event_created_at is distinct from old.stripe_last_event_created_at
    or new.verification_subscription_status is distinct from old.verification_subscription_status
    or new.verification_started_at is distinct from old.verification_started_at
    or new.verification_expires_at is distinct from old.verification_expires_at then
    raise exception 'Only admins or Stripe webhooks can change supplier approval and billing fields.';
  end if;

  if new.verification_status is distinct from old.verification_status
    and not (
      old.verification_status in ('none', 'rejected')
      and new.verification_status = 'pending'
    ) then
    raise exception 'Suppliers can only submit verification for admin review.';
  end if;

  new.verified := (
    new.verification_status = 'verified'
    and new.verification_subscription_status = 'active'
    and (
      new.verification_expires_at is null
      or new.verification_expires_at > now()
    )
  );

  return new;
end;
$$;

create or replace function public.sync_supplier_stripe_subscription(
  p_supplier_id uuid,
  p_stripe_customer_id text,
  p_stripe_subscription_id text,
  p_stripe_status text,
  p_current_period_end timestamptz,
  p_event_id text,
  p_event_created_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_event_created_at timestamptz;
  current_event_id text;
  mapped_status text;
begin
  if p_event_id is null
    or trim(p_event_id) = ''
    or p_event_created_at is null then
    raise exception 'Stripe event identity is required.';
  end if;

  select
    stripe_last_event_created_at,
    stripe_last_event_id
  into
    current_event_created_at,
    current_event_id
  from public.suppliers
  where id = p_supplier_id
  for update;

  if not found then
    raise exception 'Supplier not found for Stripe subscription sync.';
  end if;

  if current_event_id = p_event_id then
    return;
  end if;

  if current_event_created_at is not null
    and current_event_created_at > p_event_created_at then
    return;
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
    stripe_customer_id = coalesce(
      nullif(p_stripe_customer_id, ''),
      stripe_customer_id
    ),
    stripe_subscription_id = coalesce(
      nullif(p_stripe_subscription_id, ''),
      stripe_subscription_id
    ),
    stripe_last_event_id = p_event_id,
    stripe_last_event_created_at = p_event_created_at,
    verification_subscription_status = mapped_status,
    verification_started_at = case
      when mapped_status = 'active' then coalesce(verification_started_at, now())
      else verification_started_at
    end,
    verification_expires_at = p_current_period_end,
    updated_at = now()
  where id = p_supplier_id;
end;
$$;

revoke all on function public.sync_supplier_stripe_subscription(
  uuid,
  text,
  text,
  text,
  timestamptz,
  text,
  timestamptz
) from public;

revoke execute on function public.sync_supplier_stripe_subscription(
  uuid,
  text,
  text,
  text,
  timestamptz,
  text,
  timestamptz
) from anon, authenticated;

grant execute on function public.sync_supplier_stripe_subscription(
  uuid,
  text,
  text,
  text,
  timestamptz,
  text,
  timestamptz
) to service_role;

comment on function public.sync_supplier_stripe_subscription(
  uuid,
  text,
  text,
  text,
  timestamptz,
  text,
  timestamptz
) is 'Synchronizes verified Stripe subscription events through the server-only service role and ignores duplicate or older events.';
