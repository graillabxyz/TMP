alter table public.profiles
  add column if not exists complimentary_premium boolean not null default false;

comment on column public.profiles.complimentary_premium is
  'Server-controlled lifetime premium access assigned to the marketplace owner account.';

create or replace function private.enforce_owner_profile_premium()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.complimentary_premium := exists (
    select 1
    from auth.users
    where users.id = new.id
      and lower(users.email) = 'o.biyik@outlook.fr'
  );

  return new;
end;
$$;

revoke all on function private.enforce_owner_profile_premium()
from public, anon, authenticated, service_role;

drop trigger if exists enforce_owner_profile_premium
on public.profiles;

create trigger enforce_owner_profile_premium
before insert or update of id, email, complimentary_premium
on public.profiles
for each row
execute function private.enforce_owner_profile_premium();

update public.profiles as profile
set complimentary_premium = exists (
  select 1
  from auth.users
  where users.id = profile.id
    and lower(users.email) = 'o.biyik@outlook.fr'
);
