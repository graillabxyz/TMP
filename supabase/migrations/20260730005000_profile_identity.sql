alter table public.profiles
  add column if not exists full_name text,
  drop constraint if exists profiles_full_name_length,
  add constraint profiles_full_name_length
    check (full_name is null or length(trim(full_name)) between 1 and 100);

update public.profiles as profile
set full_name = nullif(
  trim(
    coalesce(
      auth_user.raw_user_meta_data ->> 'full_name',
      auth_user.raw_user_meta_data ->> 'name',
      ''
    )
  ),
  ''
)
from auth.users as auth_user
where auth_user.id = profile.id
  and profile.full_name is null;

create or replace function public.current_auth_email()
returns text
language sql
stable
security definer
set search_path = auth, public
as $$
  select email
  from auth.users
  where id = auth.uid();
$$;

revoke all on function public.current_auth_email() from public;
grant execute on function public.current_auth_email() to authenticated;

create or replace function public.sync_user_profile_identity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    email = coalesce(new.email, ''),
    full_name = nullif(
      trim(
        coalesce(
          new.raw_user_meta_data ->> 'full_name',
          new.raw_user_meta_data ->> 'name',
          ''
        )
      ),
      ''
    ),
    updated_at = now()
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_sync_identity on auth.users;
create trigger on_auth_user_created_sync_identity
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.sync_user_profile_identity();

drop policy if exists "Users can update own non-admin profile" on public.profiles;
create policy "Users can update own non-admin profile"
on public.profiles for update
to authenticated
using (id = auth.uid() and role <> 'admin')
with check (
  id = auth.uid()
  and role in ('buyer', 'supplier')
  and email = public.current_auth_email()
);
