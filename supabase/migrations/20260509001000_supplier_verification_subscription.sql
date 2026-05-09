drop trigger if exists suppliers_prevent_approval_field_changes on public.suppliers;

alter table public.suppliers
  drop constraint if exists suppliers_verification_status_check;

update public.suppliers
set verification_status = case
  when verification_status in ('approved', 'published') then 'verified'
  when verification_status = 'rejected' then 'rejected'
  when verification_status = 'pending' then 'pending'
  else 'none'
end;

alter table public.suppliers
  alter column verification_status set default 'none',
  add constraint suppliers_verification_status_check
    check (verification_status in ('none', 'pending', 'verified', 'rejected')),
  add column if not exists verification_subscription_status text not null default 'inactive'
    check (verification_subscription_status in ('inactive', 'active', 'past_due', 'canceled')),
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists verification_started_at timestamptz,
  add column if not exists verification_expires_at timestamptz;

create table if not exists public.supplier_verification_documents (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null unique references public.suppliers(id) on delete cascade,
  business_license_url text,
  company_registration_url text,
  certifications_url text,
  notes text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists supplier_verification_documents_set_updated_at on public.supplier_verification_documents;
create trigger supplier_verification_documents_set_updated_at
before update on public.supplier_verification_documents
for each row execute function public.set_updated_at();

create or replace function public.supplier_owns_verification_document(document_supplier_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.suppliers
    where suppliers.id = document_supplier_id
      and suppliers.owner_id = auth.uid()
  )
$$;

create or replace function public.prevent_supplier_billing_field_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
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

alter table public.supplier_verification_documents enable row level security;

drop policy if exists "Suppliers can read own verification documents" on public.supplier_verification_documents;
create policy "Suppliers can read own verification documents"
on public.supplier_verification_documents for select
to authenticated
using (public.supplier_owns_verification_document(supplier_id));

drop policy if exists "Suppliers can insert own verification documents" on public.supplier_verification_documents;
create policy "Suppliers can insert own verification documents"
on public.supplier_verification_documents for insert
to authenticated
with check (public.supplier_owns_verification_document(supplier_id));

drop policy if exists "Suppliers can update own verification documents" on public.supplier_verification_documents;
create policy "Suppliers can update own verification documents"
on public.supplier_verification_documents for update
to authenticated
using (public.supplier_owns_verification_document(supplier_id))
with check (public.supplier_owns_verification_document(supplier_id));

drop policy if exists "Admins can manage verification documents" on public.supplier_verification_documents;
create policy "Admins can manage verification documents"
on public.supplier_verification_documents for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read approved suppliers" on public.suppliers;
create policy "Public can read verified suppliers"
on public.suppliers for select
to anon, authenticated
using (verification_status = 'verified');

drop policy if exists "Public can read published products" on public.supplier_products;
create policy "Public can read published products"
on public.supplier_products for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.verification_status = 'verified'
  )
);
