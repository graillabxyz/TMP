create table if not exists public.site_assets (
  key text primary key,
  bucket text not null,
  path text not null,
  alt text not null default '',
  alt_fr text,
  alt_tr text,
  ready boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_assets_key_format check (key ~ '^[a-z0-9-]{1,80}$'),
  constraint site_assets_path_safety check (
    path <> ''
    and path not like '/%'
    and path not like '%..%'
  )
);

drop trigger if exists site_assets_set_updated_at on public.site_assets;
create trigger site_assets_set_updated_at
before update on public.site_assets
for each row execute function public.set_updated_at();

alter table public.site_assets enable row level security;

drop policy if exists "Public can read ready site assets" on public.site_assets;
create policy "Public can read ready site assets"
on public.site_assets for select
to anon, authenticated
using (ready = true);

drop policy if exists "Admins can manage site assets" on public.site_assets;
create policy "Admins can manage site assets"
on public.site_assets for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.site_assets (
  key,
  bucket,
  path,
  alt,
  alt_fr,
  alt_tr,
  ready
)
values (
  'landing-hero',
  'site-assets',
  'landing/istanbul-hero.jpg',
  'Istanbul skyline, Bosphorus, and Galata Tower at night',
  'Skyline d’Istanbul, Bosphore et tour de Galata de nuit',
  'Gece İstanbul silüeti, Boğaz ve Galata Kulesi',
  false
)
on conflict (key) do nothing;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-assets',
  'site-assets',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site assets" on storage.objects;
create policy "Public can read site assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'site-assets');

drop policy if exists "Admins can manage site asset files" on storage.objects;
create policy "Admins can manage site asset files"
on storage.objects for all
to authenticated
using (
  bucket_id = 'site-assets'
  and public.is_admin()
)
with check (
  bucket_id = 'site-assets'
  and public.is_admin()
);
