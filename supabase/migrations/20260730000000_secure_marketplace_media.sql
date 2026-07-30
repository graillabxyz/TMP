insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'supplier-assets',
    'supplier-assets',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'verification-documents',
    'verification-documents',
    false,
    10485760,
    array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = auth.uid()
      and suppliers.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "Suppliers can update own assets" on storage.objects;
create policy "Suppliers can update own assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'supplier-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = auth.uid()
      and suppliers.id::text = (storage.foldername(name))[2]
  )
)
with check (
  bucket_id = 'supplier-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = auth.uid()
      and suppliers.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "Suppliers can delete own assets" on storage.objects;
create policy "Suppliers can delete own assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'supplier-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = auth.uid()
      and suppliers.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "Suppliers can read own verification files" on storage.objects;
create policy "Suppliers can read own verification files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'verification-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = auth.uid()
      and suppliers.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "Suppliers can upload own verification files" on storage.objects;
create policy "Suppliers can upload own verification files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'verification-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = auth.uid()
      and suppliers.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "Suppliers can update own verification files" on storage.objects;
create policy "Suppliers can update own verification files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'verification-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = auth.uid()
      and suppliers.id::text = (storage.foldername(name))[2]
  )
)
with check (
  bucket_id = 'verification-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = auth.uid()
      and suppliers.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "Suppliers can delete own verification files" on storage.objects;
create policy "Suppliers can delete own verification files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'verification-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.suppliers
    where suppliers.owner_id = auth.uid()
      and suppliers.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "Admins can manage verification files" on storage.objects;
create policy "Admins can manage verification files"
on storage.objects for all
to authenticated
using (
  bucket_id = 'verification-documents'
  and public.is_admin()
)
with check (
  bucket_id = 'verification-documents'
  and public.is_admin()
);
