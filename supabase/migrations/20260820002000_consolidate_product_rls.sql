drop policy if exists "Admins can manage supplier products" on public.supplier_products;
drop policy if exists "Public can read published products" on public.supplier_products;
drop policy if exists "Suppliers can read own products" on public.supplier_products;
drop policy if exists "Suppliers can insert own products" on public.supplier_products;
drop policy if exists "Suppliers can update own products" on public.supplier_products;
drop policy if exists "Suppliers can delete own products" on public.supplier_products;

create policy "Anonymous users can read published products"
on public.supplier_products for select
to anon
using (status = 'published');

create policy "Authenticated users can read allowed products"
on public.supplier_products for select
to authenticated
using (
  status = 'published'
  or public.is_admin()
  or exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.owner_id = (select auth.uid())
  )
);

create policy "Authenticated users can insert allowed products"
on public.supplier_products for insert
to authenticated
with check (
  public.is_admin()
  or (
    exists (
      select 1
      from public.suppliers
      where suppliers.id = supplier_products.supplier_id
        and suppliers.owner_id = (select auth.uid())
    )
    and cardinality(images) between 1 and 5
    and not exists (
      select 1
      from unnest(images) as image(image_url)
      where image_url not like (
        'https://gkydovzspwnwlyfsmgln.supabase.co/storage/v1/object/public/supplier-assets/'
        || (select auth.uid())::text
        || '/'
        || supplier_id::text
        || '/products/%'
      )
    )
  )
);

create policy "Authenticated users can update allowed products"
on public.supplier_products for update
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.owner_id = (select auth.uid())
  )
)
with check (
  public.is_admin()
  or (
    exists (
      select 1
      from public.suppliers
      where suppliers.id = supplier_products.supplier_id
        and suppliers.owner_id = (select auth.uid())
    )
    and cardinality(images) between 1 and 5
    and not exists (
      select 1
      from unnest(images) as image(image_url)
      where image_url not like (
        'https://gkydovzspwnwlyfsmgln.supabase.co/storage/v1/object/public/supplier-assets/'
        || (select auth.uid())::text
        || '/'
        || supplier_id::text
        || '/products/%'
      )
    )
  )
);

create policy "Authenticated users can delete allowed products"
on public.supplier_products for delete
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.owner_id = (select auth.uid())
  )
);
