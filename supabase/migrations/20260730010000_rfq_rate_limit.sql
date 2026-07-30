create index if not exists rfqs_submitter_created_at_idx
on public.rfqs (submitter_id, created_at desc);

create or replace function public.enforce_rfq_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
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

drop trigger if exists rfqs_enforce_rate_limit on public.rfqs;
create trigger rfqs_enforce_rate_limit
before insert on public.rfqs
for each row execute function public.enforce_rfq_rate_limit();
