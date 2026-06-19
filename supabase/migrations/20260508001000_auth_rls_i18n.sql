create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'buyer' check (role in ('buyer', 'supplier', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.supplier_categories
  add column if not exists name_fr text,
  add column if not exists description_fr text,
  add column if not exists status text not null default 'published'
    check (status in ('draft', 'published', 'archived'));

update public.supplier_categories
set
  status = 'published',
  name_fr = coalesce(
    name_fr,
    case slug
      when 'textiles-apparel' then 'Textiles et habillement'
      when 'machinery-components' then 'Machines et composants'
      when 'home-living' then 'Maison et art de vivre'
      when 'food-ingredients' then 'Alimentation et ingrédients'
      when 'automotive-parts' then 'Pièces automobiles'
      when 'packaging' then 'Emballage'
      else name
    end
  ),
  description_fr = coalesce(
    description_fr,
    case slug
      when 'textiles-apparel' then 'Vêtements en marque privée, tissus et textiles de maison.'
      when 'machinery-components' then 'CNC, tôlerie, pièces de machines et partenaires d’outillage.'
      when 'home-living' then 'Céramique, décoration, mobilier et produits prêts pour l’hôtellerie.'
      when 'food-ingredients' then 'Produits méditerranéens, denrées sèches et emballages en marque privée.'
      when 'automotive-parts' then 'Composants aftermarket, assemblages et programmes de production.'
      when 'packaging' then 'Cartons retail, mailers, étiquettes et emballages de marque.'
      else description
    end
  );

create table if not exists public.supplier_accounts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  category_id uuid references public.supplier_categories(id) on delete set null,
  slug text not null unique,
  company_name text not null,
  company_name_fr text,
  city text not null,
  country text not null default 'Turkiye',
  summary text not null default '',
  summary_fr text,
  description text not null default '',
  description_fr text,
  verified boolean not null default false,
  year_founded integer,
  employees text not null default '',
  export_markets text[] not null default '{}',
  moq text not null default '',
  response_time text not null default '',
  image_url text not null default '',
  tags text[] not null default '{}',
  tags_fr text[] not null default '{}',
  certifications text[] not null default '{}',
  certifications_fr text[] not null default '{}',
  verification_status text not null default 'draft'
    check (verification_status in ('draft', 'submitted', 'approved', 'published', 'rejected')),
  business_license_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop table if exists public.supplier_products cascade;
create table public.supplier_products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.supplier_accounts(id) on delete cascade,
  title text not null,
  title_fr text,
  description text not null default '',
  description_fr text,
  category text not null default '',
  category_fr text,
  moq text not null default '',
  image_url text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (supplier_id, title)
);

insert into public.supplier_accounts (
  category_id, slug, company_name, company_name_fr, city, country, summary,
  summary_fr, description, description_fr, verified, year_founded, employees,
  export_markets, moq, response_time, image_url, tags, tags_fr, certifications,
  certifications_fr, verification_status, display_order
)
select
  category_id,
  slug,
  name,
  name,
  city,
  country,
  summary,
  case slug
    when 'anatolia-textile-studio' then 'Maille premium, basiques en marque privée et habillement prêt pour l’export.'
    when 'marmara-machinery-works' then 'Composants usinés CNC et assemblages industriels pour acheteurs européens.'
    when 'aegean-homeware-co' then 'Céramique, textiles et articles de maison contemporains pour retailers.'
    when 'izmir-natural-foods' then 'Fruits secs, noix, épices et produits méditerranéens prêts pour le retail.'
    when 'bursa-auto-systems' then 'Pièces aftermarket, faisceaux et capacité fournisseur de rang industriel.'
    when 'istanbul-packaging-lab' then 'Cartons premium, emballages e-commerce, étiquettes et packaging retail.'
    else summary
  end,
  description,
  case slug
    when 'anatolia-textile-studio' then 'Partenaire textile intégré verticalement pour les marques européennes de mode, workwear et essentiels, avec lignes auditées et échantillonnage rapide.'
    when 'marmara-machinery-works' then 'Partenaire de fabrication de précision avec CNC, découpe laser et capacité d’assemblage pour fabricants d’équipements industriels.'
    when 'aegean-homeware-co' then 'Fournisseur homeware orienté design, combinant savoir-faire régional et planification moderne pour retailers boutique et hôtellerie.'
    when 'izmir-natural-foods' then 'Producteur alimentaire orienté export avec sourcing traçable, support étiquetage UE et packaging flexible en marque privée.'
    when 'bursa-auto-systems' then 'Fournisseur automobile avec forte capacité régionale à Bursa pour faisceaux, pièces caoutchouc et composants aftermarket de précision.'
    when 'istanbul-packaging-lab' then 'Partenaire packaging moderne pour e-commerce, cosmétiques et alimentaire, avec prototypage rapide et finitions export soignées.'
    else description
  end,
  verified,
  year_founded,
  employees,
  export_markets,
  moq,
  response_time,
  image_url,
  tags,
  tags,
  certifications,
  certifications,
  'published',
  display_order
from public.suppliers
on conflict (slug) do update
set
  category_id = excluded.category_id,
  company_name = excluded.company_name,
  company_name_fr = excluded.company_name_fr,
  city = excluded.city,
  country = excluded.country,
  summary = excluded.summary,
  summary_fr = excluded.summary_fr,
  description = excluded.description,
  description_fr = excluded.description_fr,
  verified = excluded.verified,
  year_founded = excluded.year_founded,
  employees = excluded.employees,
  export_markets = excluded.export_markets,
  moq = excluded.moq,
  response_time = excluded.response_time,
  image_url = excluded.image_url,
  tags = excluded.tags,
  tags_fr = excluded.tags_fr,
  certifications = excluded.certifications,
  certifications_fr = excluded.certifications_fr,
  verification_status = excluded.verification_status,
  display_order = excluded.display_order;

insert into public.supplier_products (
  supplier_id, title, title_fr, description, description_fr, category,
  category_fr, moq, image_url, status, display_order
)
values
  ((select id from public.supplier_accounts where slug = 'anatolia-textile-studio'), 'Organic cotton hoodie', 'Sweat à capuche en coton biologique', 'Private label organic cotton hoodie ready for EU apparel programs.', 'Sweat à capuche en coton biologique en marque privée pour programmes européens.', 'Apparel', 'Habillement', '500 units', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'published', 10),
  ((select id from public.supplier_accounts where slug = 'anatolia-textile-studio'), 'Ribbed jersey basics', 'Basiques en jersey côtelé', 'Ribbed jersey fabric and basics for essentials collections.', 'Jersey côtelé et basiques pour collections essentielles.', 'Fabric', 'Tissu', '250 kg', 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=900&q=80', 'published', 20),
  ((select id from public.supplier_accounts where slug = 'marmara-machinery-works'), 'CNC aluminum housings', 'Boîtiers aluminium CNC', 'Precision CNC aluminum housings for industrial equipment.', 'Boîtiers aluminium usinés CNC pour équipements industriels.', 'Components', 'Composants', '100 units', 'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=900&q=80', 'published', 10),
  ((select id from public.supplier_accounts where slug = 'marmara-machinery-works'), 'Sheet metal enclosures', 'Coffrets en tôle', 'Custom sheet metal enclosures with export documentation support.', 'Coffrets en tôle sur mesure avec support documentaire export.', 'Industrial', 'Industriel', '75 units', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80', 'published', 20),
  ((select id from public.supplier_accounts where slug = 'aegean-homeware-co'), 'Stoneware dinner set', 'Service de table en grès', 'Contemporary stoneware dinner sets for retail and hospitality.', 'Services de table contemporains en grès pour retail et hôtellerie.', 'Ceramics', 'Céramique', '200 sets', 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80', 'published', 10),
  ((select id from public.supplier_accounts where slug = 'aegean-homeware-co'), 'Cotton hammam towels', 'Serviettes hammam en coton', 'Soft cotton hammam towels for private label home collections.', 'Serviettes hammam en coton pour collections maison en marque privée.', 'Home textile', 'Textile maison', '400 units', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80', 'published', 20),
  ((select id from public.supplier_accounts where slug = 'izmir-natural-foods'), 'Dried fig retail packs', 'Packs retail de figues sèches', 'Traceable dried fig packs for grocery and specialty retail.', 'Packs de figues sèches traçables pour épicerie et retail spécialisé.', 'Food', 'Alimentaire', '1,200 packs', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=80', 'published', 10),
  ((select id from public.supplier_accounts where slug = 'izmir-natural-foods'), 'Mediterranean spice blends', 'Mélanges d’épices méditerranéennes', 'Mediterranean spice blends for foodservice and retail packs.', 'Mélanges d’épices méditerranéennes pour foodservice et retail.', 'Ingredients', 'Ingrédients', '300 kg', 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=900&q=80', 'published', 20),
  ((select id from public.supplier_accounts where slug = 'bursa-auto-systems'), 'Wiring harness assemblies', 'Assemblages de faisceaux électriques', 'Automotive wiring harness assemblies for aftermarket programs.', 'Assemblages de faisceaux électriques pour programmes aftermarket.', 'Automotive', 'Automobile', '500 units', 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80', 'published', 10),
  ((select id from public.supplier_accounts where slug = 'bursa-auto-systems'), 'Rubber vibration mounts', 'Supports antivibratoires en caoutchouc', 'Rubber vibration mounts for automotive and industrial applications.', 'Supports antivibratoires en caoutchouc pour applications auto et industrielles.', 'Parts', 'Pièces', '1,000 units', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80', 'published', 20),
  ((select id from public.supplier_accounts where slug = 'istanbul-packaging-lab'), 'Rigid cosmetics box', 'Boîte rigide cosmétique', 'Premium rigid cosmetics packaging with export-ready finishing.', 'Packaging cosmétique rigide premium avec finitions prêtes pour l’export.', 'Packaging', 'Emballage', '1,000 units', 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80', 'published', 10),
  ((select id from public.supplier_accounts where slug = 'istanbul-packaging-lab'), 'Ecommerce mailer set', 'Set de mailers e-commerce', 'Branded ecommerce mailer sets for modern retail programs.', 'Sets de mailers e-commerce de marque pour programmes retail modernes.', 'Packaging', 'Emballage', '2,500 units', 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80', 'published', 20)
on conflict (supplier_id, title) do update
set
  title_fr = excluded.title_fr,
  description = excluded.description,
  description_fr = excluded.description_fr,
  category = excluded.category,
  category_fr = excluded.category_fr,
  moq = excluded.moq,
  image_url = excluded.image_url,
  status = excluded.status,
  display_order = excluded.display_order;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

create or replace function public.prevent_supplier_account_approval_edits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.verification_status is distinct from old.verification_status
      or new.verified is distinct from old.verified then
      raise exception 'Only admins can change supplier approval fields';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.prevent_supplier_product_status_edits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.status is distinct from old.status then
      raise exception 'Only admins can publish or unpublish listings';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists supplier_accounts_set_updated_at on public.supplier_accounts;
create trigger supplier_accounts_set_updated_at
before update on public.supplier_accounts
for each row execute function public.set_updated_at();

drop trigger if exists supplier_accounts_protect_approval_fields on public.supplier_accounts;
create trigger supplier_accounts_protect_approval_fields
before update on public.supplier_accounts
for each row execute function public.prevent_supplier_account_approval_edits();

drop trigger if exists supplier_products_set_updated_at on public.supplier_products;
create trigger supplier_products_set_updated_at
before update on public.supplier_products
for each row execute function public.set_updated_at();

drop trigger if exists supplier_products_protect_status on public.supplier_products;
create trigger supplier_products_protect_status
before update on public.supplier_products
for each row execute function public.prevent_supplier_product_status_edits();

alter table public.profiles enable row level security;
alter table public.supplier_accounts enable row level security;
alter table public.supplier_products enable row level security;

drop policy if exists "Public can read published suppliers" on public.suppliers;

drop policy if exists "Public can read active categories" on public.supplier_categories;
create policy "Public can read published categories"
on public.supplier_categories for select
to anon, authenticated
using (status = 'published' and is_active = true);

drop policy if exists "Admins can manage categories" on public.supplier_categories;
create policy "Admins can manage categories"
on public.supplier_categories for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published supplier accounts" on public.supplier_accounts;
create policy "Public can read published supplier accounts"
on public.supplier_accounts for select
to anon, authenticated
using (verification_status in ('approved', 'published'));

drop policy if exists "Suppliers can update own account" on public.supplier_accounts;
create policy "Suppliers can update own account"
on public.supplier_accounts for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Admins can manage supplier accounts" on public.supplier_accounts;
create policy "Admins can manage supplier accounts"
on public.supplier_accounts for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published supplier products" on public.supplier_products;
create policy "Public can read published supplier products"
on public.supplier_products for select
to anon, authenticated
using (
  status = 'published'
  and exists (
    select 1
    from public.supplier_accounts
    where supplier_accounts.id = supplier_products.supplier_id
      and supplier_accounts.verification_status in ('approved', 'published')
  )
);

drop policy if exists "Suppliers can insert own products" on public.supplier_products;
create policy "Suppliers can insert own products"
on public.supplier_products for insert
to authenticated
with check (
  exists (
    select 1
    from public.supplier_accounts
    where supplier_accounts.id = supplier_products.supplier_id
      and supplier_accounts.owner_id = auth.uid()
  )
  and status = 'draft'
);

drop policy if exists "Suppliers can update own products" on public.supplier_products;
create policy "Suppliers can update own products"
on public.supplier_products for update
to authenticated
using (
  exists (
    select 1
    from public.supplier_accounts
    where supplier_accounts.id = supplier_products.supplier_id
      and supplier_accounts.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.supplier_accounts
    where supplier_accounts.id = supplier_products.supplier_id
      and supplier_accounts.owner_id = auth.uid()
  )
);

drop policy if exists "Admins can manage supplier products" on public.supplier_products;
create policy "Admins can manage supplier products"
on public.supplier_products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can submit rfqs" on public.rfqs;
create policy "Public can submit rfqs"
on public.rfqs for insert
to anon, authenticated
with check (
  length(trim(product_request)) > 1
  and length(trim(quantity)) > 0
  and length(trim(destination_country)) > 1
);

-- No SELECT, UPDATE, or DELETE policies are defined for rfqs. Public users can
-- insert quote requests only; admins can receive a read/manage policy later.

insert into storage.buckets (id, name, public)
values
  ('supplier-assets', 'supplier-assets', true),
  ('rfq-attachments', 'rfq-attachments', false),
  ('verification-documents', 'verification-documents', false)
on conflict (id) do update
set public = excluded.public;
