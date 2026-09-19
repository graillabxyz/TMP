alter table public.suppliers
  add column if not exists complimentary_premium boolean not null default false;

comment on column public.suppliers.complimentary_premium is
  'Server-controlled lifetime premium access. The marketplace owner receives this automatically.';

create or replace function private.enforce_owner_complimentary_premium()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.complimentary_premium := exists (
    select 1
    from auth.users
    where users.id = new.owner_id
      and lower(users.email) = 'o.biyik@outlook.fr'
  );

  return new;
end;
$$;

revoke all on function private.enforce_owner_complimentary_premium()
from public, anon, authenticated, service_role;

drop trigger if exists enforce_owner_complimentary_premium
on public.suppliers;

create trigger enforce_owner_complimentary_premium
before insert or update of owner_id, complimentary_premium
on public.suppliers
for each row
execute function private.enforce_owner_complimentary_premium();

update public.suppliers as supplier
set complimentary_premium = exists (
  select 1
  from auth.users
  where users.id = supplier.owner_id
    and lower(users.email) = 'o.biyik@outlook.fr'
);

drop policy if exists "Authenticated users can insert owned products"
on public.supplier_products;

create policy "Subscribed suppliers can insert owned products"
on public.supplier_products for insert
to authenticated
with check (
  public.is_admin()
  or (
    owner_id = (select auth.uid())
    and supplier_id is not null
    and exists (
      select 1
      from public.suppliers
      where suppliers.id = supplier_products.supplier_id
        and suppliers.owner_id = (select auth.uid())
        and (
          suppliers.verification_subscription_status = 'active'
          or suppliers.complimentary_premium
        )
    )
    and status in ('draft', 'published')
    and cardinality(images) between 1 and 5
    and private.product_images_are_owned_or_unchanged(
      id,
      owner_id,
      supplier_id,
      images
    )
  )
);

drop policy if exists "Authenticated users can update owned products"
on public.supplier_products;

create policy "Subscribed suppliers can update owned products"
on public.supplier_products for update
to authenticated
using (
  public.is_admin()
  or (
    owner_id = (select auth.uid())
    and exists (
      select 1
      from public.suppliers
      where suppliers.id = supplier_products.supplier_id
        and suppliers.owner_id = (select auth.uid())
        and (
          suppliers.verification_subscription_status = 'active'
          or suppliers.complimentary_premium
        )
    )
  )
)
with check (
  public.is_admin()
  or (
    owner_id = (select auth.uid())
    and supplier_id is not null
    and exists (
      select 1
      from public.suppliers
      where suppliers.id = supplier_products.supplier_id
        and suppliers.owner_id = (select auth.uid())
        and (
          suppliers.verification_subscription_status = 'active'
          or suppliers.complimentary_premium
        )
    )
    and status in ('draft', 'published', 'archived')
    and cardinality(images) between 1 and 5
    and private.product_images_are_owned_or_unchanged(
      id,
      owner_id,
      supplier_id,
      images
    )
  )
);

create or replace function public.archive_owned_product(product_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required.';
  end if;

  update public.supplier_products
  set
    status = 'archived',
    updated_at = now()
  where id = product_id
    and owner_id = (select auth.uid());

  if not found then
    raise exception 'Product not found.';
  end if;
end;
$$;

revoke all on function public.archive_owned_product(uuid) from public, anon;
grant execute on function public.archive_owned_product(uuid) to authenticated;

drop policy if exists "Accounts can upload product assets"
on storage.objects;

create policy "Subscribed suppliers can upload product assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'supplier-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
  and (storage.foldername(name))[2] in (
    select suppliers.id::text
    from public.suppliers
    where suppliers.owner_id = (select auth.uid())
      and (
        suppliers.verification_subscription_status = 'active'
        or suppliers.complimentary_premium
      )
  )
);

drop policy if exists "Accounts can update product assets"
on storage.objects;

create policy "Subscribed suppliers can update product assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'supplier-assets'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
)
with check (
  bucket_id = 'supplier-assets'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
  and (storage.foldername(name))[2] in (
    select suppliers.id::text
    from public.suppliers
    where suppliers.owner_id = (select auth.uid())
      and (
        suppliers.verification_subscription_status = 'active'
        or suppliers.complimentary_premium
      )
  )
);

alter table public.suppliers
  add column if not exists stripe_last_event_id text,
  add column if not exists stripe_last_event_created_at timestamptz;

create unique index if not exists suppliers_stripe_customer_id_unique_idx
on public.suppliers (stripe_customer_id)
where stripe_customer_id is not null;

create unique index if not exists suppliers_stripe_subscription_id_unique_idx
on public.suppliers (stripe_subscription_id)
where stripe_subscription_id is not null;

drop function if exists public.sync_supplier_stripe_subscription(
  text,
  uuid,
  text,
  text,
  text,
  timestamptz
);

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
set search_path = ''
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
) from public, anon, authenticated;

grant execute on function public.sync_supplier_stripe_subscription(
  uuid,
  text,
  text,
  text,
  timestamptz,
  text,
  timestamptz
) to service_role;
