alter table public.rfqs
  add column if not exists submitter_id uuid references auth.users(id) on delete set null,
  add column if not exists attachment_path text;

alter table public.rfqs
  drop constraint if exists rfqs_public_input_lengths,
  add constraint rfqs_public_input_lengths check (
    length(trim(product_request)) between 12 and 180
    and length(trim(quantity)) between 1 and 80
    and length(trim(destination_country)) between 2 and 80
    and (target_timeline is null or length(target_timeline) <= 120)
    and (notes is null or length(notes) <= 3000)
    and (product_slug is null or product_slug ~ '^[a-z0-9-]{1,120}$')
    and (supplier_slug is null or supplier_slug ~ '^[a-z0-9-]{1,120}$')
  ) not valid,
  drop constraint if exists rfqs_attachment_integrity,
  add constraint rfqs_attachment_integrity check (
    (
      attachment_path is null
      and attachment_name is null
      and attachment_size is null
      and attachment_type is null
    )
    or (
      submitter_id is not null
      and attachment_path is not null
      and attachment_path like submitter_id::text || '/%'
      and attachment_name is not null
      and attachment_size between 1 and 10485760
      and attachment_type in (
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp'
      )
    )
  ) not valid;

create index if not exists rfqs_submitter_id_idx on public.rfqs (submitter_id);

drop policy if exists "Public can submit rfqs" on public.rfqs;
create policy "Public can submit validated rfqs"
on public.rfqs for insert
to anon, authenticated
with check (
  (
    auth.uid() is null
    and submitter_id is null
    and attachment_path is null
  )
  or (
    auth.uid() is not null
    and submitter_id = auth.uid()
  )
);

drop policy if exists "Users can read own rfqs" on public.rfqs;
create policy "Users can read own rfqs"
on public.rfqs for select
to authenticated
using (submitter_id = auth.uid());

drop policy if exists "Admins can manage rfqs" on public.rfqs;
create policy "Admins can manage rfqs"
on public.rfqs for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'rfq-attachments',
  'rfq-attachments',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read own rfq attachments" on storage.objects;
create policy "Users can read own rfq attachments"
on storage.objects for select
to authenticated
using (
  bucket_id = 'rfq-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can upload own rfq attachments" on storage.objects;
create policy "Users can upload own rfq attachments"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'rfq-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own rfq attachments" on storage.objects;
create policy "Users can delete own rfq attachments"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'rfq-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Admins can manage rfq attachments" on storage.objects;
create policy "Admins can manage rfq attachments"
on storage.objects for all
to authenticated
using (
  bucket_id = 'rfq-attachments'
  and public.is_admin()
)
with check (
  bucket_id = 'rfq-attachments'
  and public.is_admin()
);
