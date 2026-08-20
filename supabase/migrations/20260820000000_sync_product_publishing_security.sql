-- Keep product publishing, image storage, and RLS aligned with the supplier UI.
update storage.buckets
set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'supplier-assets';

alter table public.supplier_products
  drop constraint if exists supplier_products_public_input,
  add constraint supplier_products_public_input check (
    length(trim(title)) between 3 and 160
    and length(trim(description)) between 20 and 5000
    and (lead_time is null or length(trim(lead_time)) between 1 and 120)
    and (moq is null or moq between 1 and 1000000000)
    and (price_min is null or price_min between 0 and 1000000000000)
    and (price_max is null or price_max between 0 and 1000000000000)
    and (price_min is null or price_max is null or price_min <= price_max)
    and currency in ('EUR', 'USD', 'GBP', 'TRY')
    and cardinality(images) between 1 and 5
  ) not valid;

alter table public.supplier_products
  validate constraint supplier_products_public_input;

create index if not exists supplier_products_status_created_at_idx
on public.supplier_products (status, created_at desc);

drop policy if exists "Public can read published supplier products" on public.supplier_products;
drop policy if exists "Public can read published products" on public.supplier_products;
create policy "Public can read published products"
on public.supplier_products for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Suppliers can read own products" on public.supplier_products;
create policy "Suppliers can read own products"
on public.supplier_products for select
to authenticated
using (
  exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.owner_id = (select auth.uid())
  )
);

drop policy if exists "Suppliers can insert own products" on public.supplier_products;
create policy "Suppliers can insert own products"
on public.supplier_products for insert
to authenticated
with check (
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
);

drop policy if exists "Suppliers can update own products" on public.supplier_products;
create policy "Suppliers can update own products"
on public.supplier_products for update
to authenticated
using (
  exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.owner_id = (select auth.uid())
  )
)
with check (
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
);

drop policy if exists "Suppliers can delete own products" on public.supplier_products;
create policy "Suppliers can delete own products"
on public.supplier_products for delete
to authenticated
using (
  exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.owner_id = (select auth.uid())
  )
);

drop policy if exists "Public can read approved suppliers" on public.suppliers;
drop policy if exists "Public can read verified suppliers" on public.suppliers;
drop policy if exists "Public can read listed suppliers" on public.suppliers;
create policy "Public can read listed suppliers"
on public.suppliers for select
to anon, authenticated
using (
  verification_status = 'verified'
  or status = 'published'
  or exists (
    select 1
    from public.supplier_products
    where supplier_products.supplier_id = suppliers.id
      and supplier_products.status = 'published'
  )
);

drop policy if exists "Public can read supplier assets" on storage.objects;
create policy "Public can read supplier assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'supplier-assets');

drop policy if exists "Suppliers can upload own assets" on storage.objects;
create policy "Suppliers can upload own assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'supplier-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = (select auth.uid())
      and suppliers.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "Suppliers can update own assets" on storage.objects;
create policy "Suppliers can update own assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'supplier-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
)
with check (
  bucket_id = 'supplier-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = (select auth.uid())
      and suppliers.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "Suppliers can delete own assets" on storage.objects;
create policy "Suppliers can delete own assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'supplier-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = (select auth.uid())
      and suppliers.id::text = (storage.foldername(name))[2]
  )
);
