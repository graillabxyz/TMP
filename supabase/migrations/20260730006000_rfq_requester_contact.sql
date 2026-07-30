alter table public.rfqs
  add column if not exists requester_name text,
  add column if not exists requester_email text,
  add column if not exists requester_company text;

alter table public.rfqs
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
  ) not valid;

comment on column public.rfqs.requester_email is
  'Reply-to address supplied by the RFQ requester. Private under RFQ RLS.';
