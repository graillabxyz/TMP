create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_fr text,
  slug text not null unique,
  description text not null default '',
  description_fr text,
  parent_id uuid references public.categories(id) on delete set null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.categories (
  id, name, name_fr, slug, description, description_fr, display_order
)
select
  id,
  name,
  name_fr,
  slug,
  description,
  description_fr,
  display_order
from public.supplier_categories
on conflict (slug) do update
set
  name = excluded.name,
  name_fr = excluded.name_fr,
  description = excluded.description,
  description_fr = excluded.description_fr,
  display_order = excluded.display_order;

alter table public.suppliers
  add column if not exists owner_id uuid references auth.users(id) on delete set null,
  add column if not exists company_name text,
  add column if not exists company_name_fr text,
  add column if not exists verification_status text not null default 'pending'
    check (verification_status in ('pending', 'approved', 'published', 'rejected')),
  add column if not exists logo_url text;

create unique index if not exists suppliers_owner_id_unique_idx
on public.suppliers (owner_id)
where owner_id is not null;

update public.suppliers
set
  company_name = coalesce(company_name, name),
  company_name_fr = coalesce(company_name_fr, name),
  verification_status = case
    when status = 'published' then 'approved'
    when status = 'archived' then 'rejected'
    else 'pending'
  end,
  country = coalesce(country, 'Turkey');

alter table public.suppliers
  alter column company_name set not null,
  alter column country set default 'Turkey';

alter table public.suppliers drop constraint if exists suppliers_category_id_fkey;
alter table public.suppliers
  add constraint suppliers_category_id_fkey
  foreign key (category_id) references public.categories(id) on delete set null;

drop table if exists public.supplier_products cascade;
create table public.supplier_products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  title_fr text,
  slug text not null unique,
  description text not null,
  description_fr text,
  price_min numeric,
  price_max numeric,
  currency text not null default 'EUR',
  moq integer,
  lead_time text,
  images text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists supplier_products_supplier_id_idx
on public.supplier_products (supplier_id);

create index if not exists supplier_products_category_id_idx
on public.supplier_products (category_id);

create index if not exists supplier_products_status_idx
on public.supplier_products (status);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists supplier_products_set_updated_at on public.supplier_products;
create trigger supplier_products_set_updated_at
before update on public.supplier_products
for each row execute function public.set_updated_at();

create or replace function public.prevent_supplier_approval_field_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.verification_status is distinct from old.verification_status
    or new.verified is distinct from old.verified
    or new.owner_id is distinct from old.owner_id
    or new.display_order is distinct from old.display_order then
    raise exception 'Only admins can change supplier approval fields.';
  end if;

  return new;
end;
$$;

drop trigger if exists suppliers_prevent_approval_field_changes on public.suppliers;
create trigger suppliers_prevent_approval_field_changes
before update on public.suppliers
for each row execute function public.prevent_supplier_approval_field_changes();

insert into public.supplier_products (
  supplier_id, category_id, title, title_fr, slug, description, description_fr,
  price_min, price_max, currency, moq, lead_time, images, status
)
values
  ((select id from public.suppliers where slug = 'anatolia-textile-studio'), (select id from public.categories where slug = 'textiles-apparel'), 'Organic cotton hoodie', 'Sweat à capuche en coton biologique', 'organic-cotton-hoodie', 'Private label organic cotton hoodie ready for EU apparel programs.', 'Sweat à capuche en coton biologique en marque privée pour programmes européens.', 18, 32, 'EUR', 500, '3-5 weeks', array['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80'], 'published'),
  ((select id from public.suppliers where slug = 'anatolia-textile-studio'), (select id from public.categories where slug = 'textiles-apparel'), 'Ribbed jersey basics', 'Basiques en jersey côtelé', 'ribbed-jersey-basics', 'Ribbed jersey fabric and basics for essentials collections.', 'Jersey côtelé et basiques pour collections essentielles.', 4, 9, 'EUR', 250, '2-4 weeks', array['https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=900&q=80'], 'published'),
  ((select id from public.suppliers where slug = 'marmara-machinery-works'), (select id from public.categories where slug = 'machinery-components'), 'CNC aluminum housings', 'Boîtiers aluminium CNC', 'cnc-aluminum-housings', 'Precision CNC aluminum housings for industrial equipment.', 'Boîtiers aluminium usinés CNC pour équipements industriels.', 24, 68, 'EUR', 100, '4-7 weeks', array['https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=900&q=80'], 'published'),
  ((select id from public.suppliers where slug = 'marmara-machinery-works'), (select id from public.categories where slug = 'machinery-components'), 'Sheet metal enclosures', 'Coffrets en tôle', 'sheet-metal-enclosures', 'Custom sheet metal enclosures with export documentation support.', 'Coffrets en tôle sur mesure avec support documentaire export.', 32, 90, 'EUR', 75, '5-8 weeks', array['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80'], 'published'),
  ((select id from public.suppliers where slug = 'aegean-homeware-co'), (select id from public.categories where slug = 'home-living'), 'Stoneware dinner set', 'Service de table en grès', 'stoneware-dinner-set', 'Contemporary stoneware dinner sets for retail and hospitality.', 'Services de table contemporains en grès pour retail et hôtellerie.', 12, 28, 'EUR', 200, '3-6 weeks', array['https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80'], 'published'),
  ((select id from public.suppliers where slug = 'aegean-homeware-co'), (select id from public.categories where slug = 'home-living'), 'Cotton hammam towels', 'Serviettes hammam en coton', 'cotton-hammam-towels', 'Soft cotton hammam towels for private label home collections.', 'Serviettes hammam en coton pour collections maison en marque privée.', 5, 14, 'EUR', 400, '2-5 weeks', array['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80'], 'published'),
  ((select id from public.suppliers where slug = 'izmir-natural-foods'), (select id from public.categories where slug = 'food-ingredients'), 'Dried fig retail packs', 'Packs retail de figues sèches', 'dried-fig-retail-packs', 'Traceable dried fig packs for grocery and specialty retail.', 'Packs de figues sèches traçables pour épicerie et retail spécialisé.', 2, 6, 'EUR', 1200, '2-4 weeks', array['https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=80'], 'published'),
  ((select id from public.suppliers where slug = 'izmir-natural-foods'), (select id from public.categories where slug = 'food-ingredients'), 'Mediterranean spice blends', 'Mélanges d’épices méditerranéennes', 'mediterranean-spice-blends', 'Mediterranean spice blends for foodservice and retail packs.', 'Mélanges d’épices méditerranéennes pour foodservice et retail.', 3, 8, 'EUR', 300, '2-4 weeks', array['https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=900&q=80'], 'published'),
  ((select id from public.suppliers where slug = 'bursa-auto-systems'), (select id from public.categories where slug = 'automotive-parts'), 'Wiring harness assemblies', 'Assemblages de faisceaux électriques', 'wiring-harness-assemblies', 'Automotive wiring harness assemblies for aftermarket programs.', 'Assemblages de faisceaux électriques pour programmes aftermarket.', 16, 48, 'EUR', 500, '5-9 weeks', array['https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80'], 'published'),
  ((select id from public.suppliers where slug = 'bursa-auto-systems'), (select id from public.categories where slug = 'automotive-parts'), 'Rubber vibration mounts', 'Supports antivibratoires en caoutchouc', 'rubber-vibration-mounts', 'Rubber vibration mounts for automotive and industrial applications.', 'Supports antivibratoires en caoutchouc pour applications auto et industrielles.', 4, 15, 'EUR', 1000, '4-8 weeks', array['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80'], 'published'),
  ((select id from public.suppliers where slug = 'istanbul-packaging-lab'), (select id from public.categories where slug = 'packaging'), 'Rigid cosmetics box', 'Boîte rigide cosmétique', 'rigid-cosmetics-box', 'Premium rigid cosmetics packaging with export-ready finishing.', 'Packaging cosmétique rigide premium avec finitions prêtes pour l’export.', 1, 4, 'EUR', 1000, '3-5 weeks', array['https://images.unsplash.com/photo-1607344645866-009c320f75c4?auto=format&fit=crop&w=900&q=80'], 'published'),
  ((select id from public.suppliers where slug = 'istanbul-packaging-lab'), (select id from public.categories where slug = 'packaging'), 'Ecommerce mailer set', 'Set de mailers e-commerce', 'ecommerce-mailer-set', 'Branded ecommerce mailer sets for modern retail programs.', 'Sets de mailers e-commerce de marque pour programmes retail modernes.', 0.6, 2.5, 'EUR', 2500, '2-4 weeks', array['https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80'], 'published')
on conflict (slug) do update
set
  supplier_id = excluded.supplier_id,
  category_id = excluded.category_id,
  title = excluded.title,
  title_fr = excluded.title_fr,
  description = excluded.description,
  description_fr = excluded.description_fr,
  price_min = excluded.price_min,
  price_max = excluded.price_max,
  currency = excluded.currency,
  moq = excluded.moq,
  lead_time = excluded.lead_time,
  images = excluded.images,
  status = excluded.status;

alter table public.categories enable row level security;
alter table public.suppliers enable row level security;
alter table public.supplier_products enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
on public.categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published suppliers" on public.suppliers;
drop policy if exists "Public can read approved suppliers" on public.suppliers;
create policy "Public can read approved suppliers"
on public.suppliers for select
to anon, authenticated
using (verification_status in ('approved', 'published'));

drop policy if exists "Suppliers can read own supplier profile" on public.suppliers;
create policy "Suppliers can read own supplier profile"
on public.suppliers for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "Suppliers can update own supplier profile" on public.suppliers;
create policy "Suppliers can update own supplier profile"
on public.suppliers for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Admins can manage suppliers" on public.suppliers;
create policy "Admins can manage suppliers"
on public.suppliers for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published supplier products" on public.supplier_products;
drop policy if exists "Public can read published products" on public.supplier_products;
create policy "Public can read published products"
on public.supplier_products for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.verification_status in ('approved', 'published')
  )
);

drop policy if exists "Suppliers can read own products" on public.supplier_products;
create policy "Suppliers can read own products"
on public.supplier_products for select
to authenticated
using (
  exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.owner_id = auth.uid()
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
      and suppliers.owner_id = auth.uid()
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
      and suppliers.owner_id = auth.uid()
  )
);

drop policy if exists "Admins can manage supplier products" on public.supplier_products;
create policy "Admins can manage supplier products"
on public.supplier_products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
