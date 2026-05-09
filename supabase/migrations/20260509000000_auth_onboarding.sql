create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
begin
  requested_role := coalesce(new.raw_user_meta_data ->> 'role', 'buyer');

  if requested_role not in ('buyer', 'supplier') then
    requested_role := 'buyer';
  end if;

  insert into public.profiles (id, email, role)
  values (new.id, coalesce(new.email, ''), requested_role)
  on conflict (id) do update
  set
    email = excluded.email,
    role = case
      when public.profiles.role = 'admin' then public.profiles.role
      else excluded.role
    end,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_profile on auth.users;
create trigger on_auth_user_created_create_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid() and role in ('buyer', 'supplier'));

drop policy if exists "Users can update own non-admin profile" on public.profiles;
create policy "Users can update own non-admin profile"
on public.profiles for update
to authenticated
using (id = auth.uid() and role <> 'admin')
with check (id = auth.uid() and role in ('buyer', 'supplier'));
