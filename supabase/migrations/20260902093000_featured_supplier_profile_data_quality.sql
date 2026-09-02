-- Keep supplier discovery useful without exposing private RFQ records.
-- The RPC returns public supplier slugs only; RFQ totals never leave Postgres.
create or replace function public.get_featured_supplier_slugs(result_limit integer default 3)
returns table (supplier_slug text)
language sql
stable
security definer
set search_path = ''
as $$
  select s.slug
  from public.suppliers as s
  where exists (
    select 1
    from public.supplier_products as p
    where p.supplier_id = s.id
      and p.status = 'published'
  )
  order by
    (
      s.verification_status = 'verified'
      and s.verification_subscription_status = 'active'
      and (
        s.verification_expires_at is null
        or s.verification_expires_at > now()
      )
    ) desc,
    (
      select count(*)
      from public.rfqs as r
      where r.supplier_id = s.id
    ) desc,
    s.display_order asc,
    s.id asc
  limit least(greatest(coalesce(result_limit, 3), 1), 12);
$$;

revoke all on function public.get_featured_supplier_slugs(integer) from public;
revoke all on function public.get_featured_supplier_slugs(integer) from anon;
revoke all on function public.get_featured_supplier_slugs(integer) from authenticated;
grant execute on function public.get_featured_supplier_slugs(integer) to anon, authenticated, service_role;

comment on function public.get_featured_supplier_slugs(integer) is
  'Returns eligible public supplier slugs ranked by active verification, RFQ volume, and display order.';

-- Store lead time as a machine-readable number of calendar days while keeping
-- the legacy text column temporarily available for a safe rolling deployment.
alter table public.supplier_products
add column if not exists lead_time_days integer;

with parsed as (
  select
    id,
    lower(trim(lead_time)) as normalized,
    regexp_match(lower(trim(lead_time)), '([0-9]+)(?:\s*-\s*([0-9]+))?') as amounts
  from public.supplier_products
  where lead_time is not null
    and trim(lead_time) <> ''
)
update public.supplier_products as product
set lead_time_days = least(
  3650,
  greatest(
    1,
    coalesce(parsed.amounts[2], parsed.amounts[1])::integer
      * case
          when parsed.normalized ~ '(week|semaine|hafta)' then 7
          when parsed.normalized ~ '(month|mois|ay)' then 30
          else 1
        end
  )
)
from parsed
where product.id = parsed.id
  and parsed.amounts is not null
  and product.lead_time_days is null;

alter table public.supplier_products
drop constraint if exists supplier_products_lead_time_days_check;

alter table public.supplier_products
add constraint supplier_products_lead_time_days_check
check (lead_time_days is null or lead_time_days between 1 and 3650);

-- Normalize the Turkish country name at rest and on future supplier writes.
update public.suppliers
set country = 'Türkiye'
where lower(trim(country)) in ('turkey', 'turkiye', 'türkiye');

update public.supplier_accounts
set country = 'Türkiye'
where lower(trim(country)) in ('turkey', 'turkiye', 'türkiye');

alter table public.suppliers
alter column country set default 'Türkiye';

alter table public.supplier_accounts
alter column country set default 'Türkiye';

create or replace function public.normalize_turkiye_supplier_country()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if lower(trim(new.country)) in ('turkey', 'turkiye', 'türkiye') then
    new.country := 'Türkiye';
  end if;

  return new;
end;
$$;

drop trigger if exists normalize_turkiye_country on public.suppliers;
create trigger normalize_turkiye_country
before insert or update of country on public.suppliers
for each row execute function public.normalize_turkiye_supplier_country();

drop trigger if exists normalize_turkiye_country on public.supplier_accounts;
create trigger normalize_turkiye_country
before insert or update of country on public.supplier_accounts
for each row execute function public.normalize_turkiye_supplier_country();

revoke all on function public.normalize_turkiye_supplier_country() from public;
revoke all on function public.normalize_turkiye_supplier_country() from anon;
revoke all on function public.normalize_turkiye_supplier_country() from authenticated;
