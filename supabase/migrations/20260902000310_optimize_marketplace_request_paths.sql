create index if not exists categories_parent_id_idx
on public.categories (parent_id);

create index if not exists rfqs_category_slug_idx
on public.rfqs (category_slug);

create index if not exists supplier_accounts_category_id_idx
on public.supplier_accounts (category_id);

create index if not exists supplier_accounts_owner_id_idx
on public.supplier_accounts (owner_id);

create index if not exists suppliers_category_id_idx
on public.suppliers (category_id);

create unique index if not exists suppliers_owner_id_unique_idx
on public.suppliers (owner_id)
where owner_id is not null;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check (
  id = (select auth.uid())
  and role in ('buyer', 'supplier')
);

drop policy if exists "Users can update own non-admin profile" on public.profiles;
create policy "Users can update own non-admin profile"
on public.profiles for update
to authenticated
using (
  id = (select auth.uid())
  and role <> 'admin'
)
with check (
  id = (select auth.uid())
  and role in ('buyer', 'supplier')
);

drop policy if exists "Suppliers can read own supplier profile" on public.suppliers;
create policy "Suppliers can read own supplier profile"
on public.suppliers for select
to authenticated
using (owner_id = (select auth.uid()));

drop policy if exists "Suppliers can update own supplier profile" on public.suppliers;
create policy "Suppliers can update own supplier profile"
on public.suppliers for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

drop policy if exists "Suppliers can update own account" on public.supplier_accounts;
create policy "Suppliers can update own account"
on public.supplier_accounts for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));
