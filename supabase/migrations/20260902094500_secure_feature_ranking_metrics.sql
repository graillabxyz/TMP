-- Replace the public SECURITY DEFINER ranking RPC with a non-sensitive,
-- denormalized aggregate. Buyers can see popularity order without gaining
-- access to RFQ records or being able to forge their own count.
drop function if exists public.get_featured_supplier_slugs(integer);

alter table public.suppliers
add column if not exists rfq_count bigint not null default 0;

update public.suppliers as supplier
set rfq_count = (
  select count(*)
  from public.rfqs as rfq
  where rfq.supplier_id = supplier.id
);

alter table public.suppliers
drop constraint if exists suppliers_rfq_count_check;

alter table public.suppliers
add constraint suppliers_rfq_count_check check (rfq_count >= 0);

create or replace function public.refresh_supplier_rfq_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op in ('UPDATE', 'DELETE') and old.supplier_id is not null then
    update public.suppliers
    set rfq_count = (
      select count(*)
      from public.rfqs
      where supplier_id = old.supplier_id
    )
    where id = old.supplier_id;
  end if;

  if tg_op in ('INSERT', 'UPDATE') and new.supplier_id is not null then
    update public.suppliers
    set rfq_count = (
      select count(*)
      from public.rfqs
      where supplier_id = new.supplier_id
    )
    where id = new.supplier_id;
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists refresh_supplier_rfq_count on public.rfqs;
create trigger refresh_supplier_rfq_count
after insert or delete or update of supplier_id on public.rfqs
for each row execute function public.refresh_supplier_rfq_count();

create or replace function public.protect_supplier_rfq_count()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated') then
    new.rfq_count := old.rfq_count;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_supplier_rfq_count on public.suppliers;
create trigger protect_supplier_rfq_count
before update of rfq_count on public.suppliers
for each row execute function public.protect_supplier_rfq_count();

revoke all on function public.refresh_supplier_rfq_count() from public;
revoke all on function public.refresh_supplier_rfq_count() from anon;
revoke all on function public.refresh_supplier_rfq_count() from authenticated;
revoke all on function public.protect_supplier_rfq_count() from public;
revoke all on function public.protect_supplier_rfq_count() from anon;
revoke all on function public.protect_supplier_rfq_count() from authenticated;
