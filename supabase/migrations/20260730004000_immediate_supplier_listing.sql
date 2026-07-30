-- Publishing a listing and earning a verified badge are separate marketplace
-- capabilities. Suppliers may publish immediately; verification only controls
-- the badge and paid verification state.
drop policy if exists "Public can read published products" on public.supplier_products;
create policy "Public can read published products"
on public.supplier_products for select
to anon, authenticated
using (status = 'published');

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
