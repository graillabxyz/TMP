alter table public.supplier_products
  add column if not exists owner_id uuid references public.profiles(id) on delete cascade;

update public.supplier_products product
set owner_id = supplier.owner_id
from public.suppliers supplier
where supplier.id = product.supplier_id
  and product.owner_id is null
  and supplier.owner_id is not null;

alter table public.supplier_products
  alter column supplier_id drop not null,
  drop constraint if exists supplier_products_publish_requires_supplier,
  add constraint supplier_products_publish_requires_supplier check (
    status <> 'published' or supplier_id is not null
  );

create index if not exists supplier_products_owner_status_created_at_idx
on public.supplier_products (owner_id, status, created_at desc);

drop policy if exists "Admins can manage supplier products" on public.supplier_products;
drop policy if exists "Public can read published products" on public.supplier_products;
drop policy if exists "Anonymous users can read published products" on public.supplier_products;
drop policy if exists "Suppliers can read own products" on public.supplier_products;
drop policy if exists "Authenticated users can read allowed products" on public.supplier_products;
drop policy if exists "Suppliers can insert own products" on public.supplier_products;
drop policy if exists "Authenticated users can insert allowed products" on public.supplier_products;
drop policy if exists "Suppliers can update own products" on public.supplier_products;
drop policy if exists "Authenticated users can update allowed products" on public.supplier_products;
drop policy if exists "Suppliers can delete own products" on public.supplier_products;
drop policy if exists "Authenticated users can delete allowed products" on public.supplier_products;

drop function if exists private.product_images_are_owned_or_unchanged(uuid, uuid, text[]);

create or replace function private.product_images_are_owned_or_unchanged(
  product_id uuid,
  product_owner_id uuid,
  product_supplier_id uuid,
  product_images text[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    not exists (
      select 1
      from unnest(product_images) as image(image_url)
      where not (
        image_url like (
          'https://gkydovzspwnwlyfsmgln.supabase.co/storage/v1/object/public/supplier-assets/'
          || product_owner_id::text
          || '/drafts/products/%'
        )
        or (
          product_supplier_id is not null
          and image_url like (
            'https://gkydovzspwnwlyfsmgln.supabase.co/storage/v1/object/public/supplier-assets/'
            || product_owner_id::text
            || '/'
            || product_supplier_id::text
            || '/products/%'
          )
        )
      )
    )
    or exists (
      select 1
      from public.supplier_products existing_product
      where existing_product.id = product_id
        and existing_product.owner_id is not distinct from product_owner_id
        and existing_product.images = product_images
    );
$$;

revoke all on function private.product_images_are_owned_or_unchanged(uuid, uuid, uuid, text[])
from public, anon;
grant execute on function private.product_images_are_owned_or_unchanged(uuid, uuid, uuid, text[])
to authenticated;

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
  or owner_id = (select auth.uid())
);

create policy "Authenticated users can insert owned products"
on public.supplier_products for insert
to authenticated
with check (
  public.is_admin()
  or (
    owner_id = (select auth.uid())
    and (
      supplier_id is null
      or exists (
        select 1
        from public.suppliers
        where suppliers.id = supplier_products.supplier_id
          and suppliers.owner_id = (select auth.uid())
      )
    )
    and (
      status = 'draft'
      or (
        status = 'published'
        and supplier_id is not null
        and exists (
          select 1
          from public.suppliers
          where suppliers.id = supplier_products.supplier_id
            and suppliers.owner_id = (select auth.uid())
        )
      )
    )
    and cardinality(images) between 1 and 5
    and private.product_images_are_owned_or_unchanged(
      id,
      owner_id,
      supplier_id,
      images
    )
  )
);

create policy "Authenticated users can update owned products"
on public.supplier_products for update
to authenticated
using (
  public.is_admin()
  or owner_id = (select auth.uid())
)
with check (
  public.is_admin()
  or (
    owner_id = (select auth.uid())
    and (
      supplier_id is null
      or exists (
        select 1
        from public.suppliers
        where suppliers.id = supplier_products.supplier_id
          and suppliers.owner_id = (select auth.uid())
      )
    )
    and (
      status = 'draft'
      or (
        status = 'published'
        and supplier_id is not null
        and exists (
          select 1
          from public.suppliers
          where suppliers.id = supplier_products.supplier_id
            and suppliers.owner_id = (select auth.uid())
        )
      )
      or status = 'archived'
    )
    and cardinality(images) between 1 and 5
    and private.product_images_are_owned_or_unchanged(
      id,
      owner_id,
      supplier_id,
      images
    )
  )
);

create policy "Authenticated users can delete owned products"
on public.supplier_products for delete
to authenticated
using (
  public.is_admin()
  or owner_id = (select auth.uid())
);

drop policy if exists "Suppliers can upload own assets" on storage.objects;
drop policy if exists "Suppliers can update own assets" on storage.objects;
drop policy if exists "Suppliers can delete own assets" on storage.objects;
drop policy if exists "Accounts can upload product assets" on storage.objects;
drop policy if exists "Accounts can update product assets" on storage.objects;
drop policy if exists "Accounts can delete product assets" on storage.objects;

create policy "Accounts can upload product assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'supplier-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
  and (
    (storage.foldername(name))[2] = 'drafts'
    or exists (
      select 1
      from public.suppliers
      where suppliers.owner_id = (select auth.uid())
        and suppliers.id::text = (storage.foldername(name))[2]
    )
  )
);

create policy "Accounts can update product assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'supplier-assets'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
)
with check (
  bucket_id = 'supplier-assets'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
  and (
    (storage.foldername(name))[2] = 'drafts'
    or exists (
      select 1
      from public.suppliers
      where suppliers.owner_id = (select auth.uid())
        and suppliers.id::text = (storage.foldername(name))[2]
    )
  )
);

create policy "Accounts can delete product assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'supplier-assets'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
);
