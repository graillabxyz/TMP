-- Bring this project's RFQ table in line with the authenticated submission
-- contract already used by the application before deriving private signals.
alter table public.rfqs
  add column if not exists submitter_id uuid references auth.users(id) on delete set null,
  add column if not exists requester_name text,
  add column if not exists requester_email text,
  add column if not exists requester_company text,
  add column if not exists attachment_path text,
  add column if not exists request_token uuid;

update public.rfqs
set request_token = gen_random_uuid()
where request_token is null;

alter table public.rfqs
  alter column request_token set default gen_random_uuid(),
  alter column request_token set not null,
  drop constraint if exists rfqs_requester_contact,
  add constraint rfqs_requester_contact check (
    requester_name is not null
    and length(trim(requester_name)) between 2 and 100
    and requester_email is not null
    and length(trim(requester_email)) between 3 and 254
    and requester_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and (
      requester_company is null
      or length(trim(requester_company)) between 1 and 120
    )
  ) not valid,
  drop constraint if exists rfqs_public_input_lengths,
  add constraint rfqs_public_input_lengths check (
    length(trim(product_request)) between 12 and 180
    and length(trim(quantity)) between 1 and 80
    and length(trim(destination_country)) between 2 and 80
    and (target_timeline is null or length(target_timeline) <= 120)
    and (notes is null or length(notes) <= 3000)
    and (product_slug is null or product_slug ~ '^[a-z0-9-]{1,120}$')
    and (supplier_slug is null or supplier_slug ~ '^[a-z0-9-]{1,120}$')
  ) not valid;

create index if not exists rfqs_submitter_created_at_idx
on public.rfqs (submitter_id, created_at desc);

create unique index if not exists rfqs_submitter_request_token_unique_idx
on public.rfqs (submitter_id, request_token);

create or replace function public.enforce_rfq_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  hourly_count integer;
  daily_count integer;
begin
  if new.submitter_id is null then
    raise exception 'An authenticated requester is required.';
  end if;

  select
    count(*) filter (where created_at >= now() - interval '1 hour'),
    count(*) filter (where created_at >= now() - interval '24 hours')
  into hourly_count, daily_count
  from public.rfqs
  where submitter_id = new.submitter_id
    and created_at >= now() - interval '24 hours';

  if hourly_count >= 5 or daily_count >= 20 then
    raise exception 'RFQ submission limit reached. Please try again later.';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_rfq_rate_limit() from public;
revoke all on function public.enforce_rfq_rate_limit() from anon;
revoke all on function public.enforce_rfq_rate_limit() from authenticated;

drop trigger if exists rfqs_enforce_rate_limit on public.rfqs;
create trigger rfqs_enforce_rate_limit
before insert on public.rfqs
for each row execute function public.enforce_rfq_rate_limit();

drop policy if exists "Public can submit rfqs" on public.rfqs;
drop policy if exists "Public can submit validated rfqs" on public.rfqs;
drop policy if exists "Authenticated users can submit validated rfqs" on public.rfqs;
create policy "Authenticated users can submit validated rfqs"
on public.rfqs for insert
to authenticated
with check (
  submitter_id = (select auth.uid())
  and lower(requester_email) = lower((select auth.jwt()) ->> 'email')
);

create table if not exists public.marketplace_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null check (activity_type in ('search', 'product_view')),
  query text,
  category_slug text references public.categories(slug) on delete set null,
  product_id uuid references public.supplier_products(id) on delete set null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint marketplace_activity_query_length check (
    query is null or length(query) between 1 and 120
  ),
  constraint marketplace_activity_shape check (
    (activity_type = 'search' and (query is not null or category_slug is not null))
    or (activity_type = 'product_view' and product_id is not null)
  )
);

alter table public.marketplace_activity enable row level security;

revoke all on table public.marketplace_activity from anon;
revoke all on table public.marketplace_activity from authenticated;
grant select, insert on table public.marketplace_activity to authenticated;

drop policy if exists "Users can read own marketplace activity" on public.marketplace_activity;
create policy "Users can read own marketplace activity"
on public.marketplace_activity for select
to authenticated
using (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

drop policy if exists "Users can record own marketplace activity" on public.marketplace_activity;
create policy "Users can record own marketplace activity"
on public.marketplace_activity for insert
to authenticated
with check (
  (select auth.uid()) is not null
  and user_id = (select auth.uid())
);

create index if not exists marketplace_activity_user_recent_idx
on public.marketplace_activity (user_id, created_at desc);

create index if not exists marketplace_activity_category_slug_idx
on public.marketplace_activity (category_slug);

create index if not exists marketplace_activity_product_id_idx
on public.marketplace_activity (product_id);

create index if not exists marketplace_activity_supplier_id_idx
on public.marketplace_activity (supplier_id);

create or replace function public.prune_marketplace_activity_history()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.marketplace_activity
  where id in (
    select id
    from public.marketplace_activity
    where user_id = new.user_id
    order by created_at desc, id desc
    offset 200
  );

  return new;
end;
$$;

revoke all on function public.prune_marketplace_activity_history() from public;
revoke all on function public.prune_marketplace_activity_history() from anon;
revoke all on function public.prune_marketplace_activity_history() from authenticated;

drop trigger if exists marketplace_activity_prune_history on public.marketplace_activity;
create trigger marketplace_activity_prune_history
after insert on public.marketplace_activity
for each row execute function public.prune_marketplace_activity_history();

grant select on table public.rfqs to authenticated;

drop policy if exists "Users can read own rfqs" on public.rfqs;
create policy "Users can read own rfqs"
on public.rfqs for select
to authenticated
using (
  (select auth.uid()) is not null
  and submitter_id = (select auth.uid())
);
