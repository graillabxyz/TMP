drop policy if exists "Accounts can upload product assets" on storage.objects;
drop policy if exists "Accounts can update product assets" on storage.objects;

create policy "Accounts can upload product assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'supplier-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and (storage.foldername(name))[3] = 'products'
  and (
    (storage.foldername(name))[2] = 'drafts'
    or (storage.foldername(name))[2] in (
      select suppliers.id::text
      from public.suppliers
      where suppliers.owner_id = (select auth.uid())
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
    or (storage.foldername(name))[2] in (
      select suppliers.id::text
      from public.suppliers
      where suppliers.owner_id = (select auth.uid())
    )
  )
);
