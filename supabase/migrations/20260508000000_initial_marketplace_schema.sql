create extension if not exists pgcrypto;

create table if not exists public.supplier_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  supplier_count integer not null default 0,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.supplier_categories(id) on delete set null,
  slug text not null unique,
  name text not null,
  city text not null,
  country text not null default 'Turkiye',
  summary text not null,
  description text not null,
  verified boolean not null default false,
  year_founded integer not null,
  employees text not null,
  export_markets text[] not null default '{}',
  moq text not null,
  response_time text not null,
  image_url text not null,
  tags text[] not null default '{}',
  certifications text[] not null default '{}',
  status text not null default 'published' check (status in ('draft', 'pending', 'published', 'archived')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  name text not null,
  category text not null,
  moq text not null,
  image_url text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (supplier_id, name)
);

create table if not exists public.rfqs (
  id uuid primary key default gen_random_uuid(),
  product_request text not null,
  category_slug text references public.supplier_categories(slug) on delete set null,
  quantity text not null,
  destination_country text not null,
  target_timeline text,
  notes text,
  attachment_name text,
  attachment_size integer,
  attachment_type text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'matched', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists supplier_categories_set_updated_at on public.supplier_categories;
create trigger supplier_categories_set_updated_at
before update on public.supplier_categories
for each row execute function public.set_updated_at();

drop trigger if exists suppliers_set_updated_at on public.suppliers;
create trigger suppliers_set_updated_at
before update on public.suppliers
for each row execute function public.set_updated_at();

drop trigger if exists supplier_products_set_updated_at on public.supplier_products;
create trigger supplier_products_set_updated_at
before update on public.supplier_products
for each row execute function public.set_updated_at();

drop trigger if exists rfqs_set_updated_at on public.rfqs;
create trigger rfqs_set_updated_at
before update on public.rfqs
for each row execute function public.set_updated_at();

alter table public.supplier_categories enable row level security;
alter table public.suppliers enable row level security;
alter table public.supplier_products enable row level security;
alter table public.rfqs enable row level security;

drop policy if exists "Public can read active categories" on public.supplier_categories;
create policy "Public can read active categories"
on public.supplier_categories for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read published suppliers" on public.suppliers;
create policy "Public can read published suppliers"
on public.suppliers for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Public can read published supplier products" on public.supplier_products;
create policy "Public can read published supplier products"
on public.supplier_products for select
to anon, authenticated
using (
  exists (
    select 1
    from public.suppliers
    where suppliers.id = supplier_products.supplier_id
      and suppliers.status = 'published'
  )
);

drop policy if exists "Public can submit rfqs" on public.rfqs;
create policy "Public can submit rfqs"
on public.rfqs for insert
to anon, authenticated
with check (
  length(trim(product_request)) > 1
  and length(trim(quantity)) > 0
  and length(trim(destination_country)) > 1
);

insert into public.supplier_categories (name, slug, description, supplier_count, display_order)
values
  ('Textiles & Apparel', 'textiles-apparel', 'Private label garments, fabrics, and home textiles.', 132, 10),
  ('Machinery & Components', 'machinery-components', 'CNC, sheet metal, machinery parts, and tooling partners.', 74, 20),
  ('Home & Living', 'home-living', 'Ceramics, decor, furniture, and hospitality-ready goods.', 91, 30),
  ('Food & Ingredients', 'food-ingredients', 'Mediterranean foods, dry goods, and private label packs.', 68, 40),
  ('Automotive Parts', 'automotive-parts', 'Aftermarket components, assemblies, and production programs.', 46, 50),
  ('Packaging', 'packaging', 'Retail cartons, mailers, labels, and branded packaging.', 58, 60)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  supplier_count = excluded.supplier_count,
  display_order = excluded.display_order,
  is_active = true;

insert into public.suppliers (
  category_id, slug, name, city, summary, description, verified, year_founded,
  employees, export_markets, moq, response_time, image_url, tags, certifications,
  status, display_order
)
values
  (
    (select id from public.supplier_categories where slug = 'textiles-apparel'),
    'anatolia-textile-studio',
    'Anatolia Textile Studio',
    'Istanbul',
    'Premium knitwear, private label basics, and export-ready apparel.',
    'A vertically integrated textile partner serving European fashion, workwear, and essentials brands with audited production lines and rapid sampling.',
    true,
    2014,
    '120-250',
    array['Germany', 'Netherlands', 'France'],
    '300 units',
    'Under 12h',
    'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1200&q=80',
    array['Private label', 'OEKO-TEX', 'Knitwear'],
    array['OEKO-TEX Standard 100', 'ISO 9001', 'BSCI audit'],
    'published',
    10
  ),
  (
    (select id from public.supplier_categories where slug = 'machinery-components'),
    'marmara-machinery-works',
    'Marmara Machinery Works',
    'Kocaeli',
    'CNC-machined components and industrial assemblies for EU buyers.',
    'Precision manufacturing partner with CNC, laser cutting, and assembly capacity for industrial equipment manufacturers.',
    true,
    2009,
    '80-120',
    array['Italy', 'Austria', 'Poland'],
    'Project based',
    'Under 24h',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    array['CNC', 'ISO 9001', 'Custom tooling'],
    array['ISO 9001', 'CE documentation support', 'EN 1090 partner'],
    'published',
    20
  ),
  (
    (select id from public.supplier_categories where slug = 'home-living'),
    'aegean-homeware-co',
    'Aegean Homeware Co.',
    'Izmir',
    'Ceramics, textiles, and contemporary home goods for retailers.',
    'Design-led homeware supplier combining regional craft with modern production planning for boutique retailers and hospitality groups.',
    true,
    2017,
    '35-80',
    array['Spain', 'Denmark', 'Sweden'],
    '150 sets',
    'Under 18h',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    array['Ceramics', 'Hospitality', 'Design-led'],
    array['Food contact compliance', 'Sedex member', 'REACH support'],
    'published',
    30
  ),
  (
    (select id from public.supplier_categories where slug = 'food-ingredients'),
    'izmir-natural-foods',
    'Izmir Natural Foods',
    'Izmir',
    'Dried fruits, nuts, spices, and retail-ready Mediterranean goods.',
    'Export-focused food producer with traceable sourcing, EU labeling support, and flexible private label packaging for grocery buyers.',
    false,
    2012,
    '60-110',
    array['Belgium', 'United Kingdom', 'Czechia'],
    '1 pallet',
    'Under 24h',
    'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1200&q=80',
    array['Private label', 'Retail packs', 'Traceable'],
    array['BRCGS pending', 'Halal', 'Organic lines available'],
    'published',
    40
  ),
  (
    (select id from public.supplier_categories where slug = 'automotive-parts'),
    'bursa-auto-systems',
    'Bursa Auto Systems',
    'Bursa',
    'Aftermarket parts, wiring assemblies, and tier supplier capacity.',
    'Automotive supplier with strong Bursa-region capacity for wiring, rubber parts, and precision aftermarket component programs.',
    true,
    2006,
    '250-500',
    array['Romania', 'Germany', 'Hungary'],
    'Program based',
    'Under 24h',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80',
    array['IATF path', 'Aftermarket', 'Assemblies'],
    array['ISO 9001', 'IATF 16949 roadmap', 'PPAP support'],
    'published',
    50
  ),
  (
    (select id from public.supplier_categories where slug = 'packaging'),
    'istanbul-packaging-lab',
    'Istanbul Packaging Lab',
    'Istanbul',
    'Premium cartons, ecommerce mailers, labels, and retail packaging.',
    'Modern packaging partner for ecommerce, cosmetics, and food brands needing fast prototyping and polished export-ready finishing.',
    false,
    2019,
    '25-60',
    array['France', 'Ireland', 'Portugal'],
    '1,000 units',
    'Under 8h',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    array['FSC paper', 'Low MOQ', 'Rapid samples'],
    array['FSC materials available', 'ISO 14001 roadmap'],
    'published',
    60
  )
on conflict (slug) do update
set
  category_id = excluded.category_id,
  name = excluded.name,
  city = excluded.city,
  summary = excluded.summary,
  description = excluded.description,
  verified = excluded.verified,
  year_founded = excluded.year_founded,
  employees = excluded.employees,
  export_markets = excluded.export_markets,
  moq = excluded.moq,
  response_time = excluded.response_time,
  image_url = excluded.image_url,
  tags = excluded.tags,
  certifications = excluded.certifications,
  status = excluded.status,
  display_order = excluded.display_order;

insert into public.supplier_products (supplier_id, name, category, moq, image_url, display_order)
values
  ((select id from public.suppliers where slug = 'anatolia-textile-studio'), 'Organic cotton hoodie', 'Apparel', '500 units', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 10),
  ((select id from public.suppliers where slug = 'anatolia-textile-studio'), 'Ribbed jersey basics', 'Fabric', '250 kg', 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=900&q=80', 20),
  ((select id from public.suppliers where slug = 'marmara-machinery-works'), 'CNC aluminum housings', 'Components', '100 units', 'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=900&q=80', 10),
  ((select id from public.suppliers where slug = 'marmara-machinery-works'), 'Sheet metal enclosures', 'Industrial', '75 units', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80', 20),
  ((select id from public.suppliers where slug = 'aegean-homeware-co'), 'Stoneware dinner set', 'Ceramics', '200 sets', 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80', 10),
  ((select id from public.suppliers where slug = 'aegean-homeware-co'), 'Cotton hammam towels', 'Home textile', '400 units', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80', 20),
  ((select id from public.suppliers where slug = 'izmir-natural-foods'), 'Dried fig retail packs', 'Food', '1,200 packs', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=80', 10),
  ((select id from public.suppliers where slug = 'izmir-natural-foods'), 'Mediterranean spice blends', 'Ingredients', '300 kg', 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=900&q=80', 20),
  ((select id from public.suppliers where slug = 'bursa-auto-systems'), 'Wiring harness assemblies', 'Automotive', '500 units', 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80', 10),
  ((select id from public.suppliers where slug = 'bursa-auto-systems'), 'Rubber vibration mounts', 'Parts', '1,000 units', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80', 20),
  ((select id from public.suppliers where slug = 'istanbul-packaging-lab'), 'Rigid cosmetics box', 'Packaging', '1,000 units', 'https://images.unsplash.com/photo-1607344645866-009c320f75c4?auto=format&fit=crop&w=900&q=80', 10),
  ((select id from public.suppliers where slug = 'istanbul-packaging-lab'), 'Ecommerce mailer set', 'Packaging', '2,500 units', 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80', 20)
on conflict (supplier_id, name) do update
set
  category = excluded.category,
  moq = excluded.moq,
  image_url = excluded.image_url,
  display_order = excluded.display_order;
