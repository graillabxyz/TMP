create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.product_images_are_owned_or_unchanged(
  product_id uuid,
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
      where image_url not like (
        'https://gkydovzspwnwlyfsmgln.supabase.co/storage/v1/object/public/supplier-assets/'
        || (select auth.uid())::text
        || '/'
        || product_supplier_id::text
        || '/products/%'
      )
    )
    or exists (
      select 1
      from public.supplier_products existing_product
      where existing_product.id = product_id
        and existing_product.supplier_id = product_supplier_id
        and existing_product.images = product_images
    );
$$;

revoke all on function private.product_images_are_owned_or_unchanged(uuid, uuid, text[])
from public, anon;
grant execute on function private.product_images_are_owned_or_unchanged(uuid, uuid, text[])
to authenticated;

drop policy if exists "Authenticated users can update allowed products"
on public.supplier_products;

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
    and private.product_images_are_owned_or_unchanged(
      id,
      supplier_id,
      images
    )
  )
);
