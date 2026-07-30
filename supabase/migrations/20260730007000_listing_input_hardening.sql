alter table public.suppliers
  drop constraint if exists suppliers_company_name_length,
  add constraint suppliers_company_name_length
    check (length(trim(company_name)) between 2 and 120);

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
    and cardinality(images) between 1 and 8
  ) not valid;

drop policy if exists "Suppliers can insert own products" on public.supplier_products;
create policy "Suppliers can insert own products"
on public.supplier_products for insert
to authenticated
with check (
  exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.owner_id = auth.uid()
  )
  and cardinality(images) between 1 and 8
  and not exists (
    select 1
    from unnest(images) as image(image_url)
    where image_url not like (
      '%/storage/v1/object/public/supplier-assets/'
      || auth.uid()::text
      || '/'
      || supplier_id::text
      || '/%'
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
      and suppliers.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.owner_id = auth.uid()
  )
  and cardinality(images) between 1 and 8
  and not exists (
    select 1
    from unnest(images) as image(image_url)
    where image_url not like (
      '%/storage/v1/object/public/supplier-assets/'
      || auth.uid()::text
      || '/'
      || supplier_id::text
      || '/%'
    )
  )
);
