alter table public.supplier_verification_documents
  add column if not exists business_license_path text,
  add column if not exists company_registration_path text,
  add column if not exists certifications_path text;

alter table public.supplier_verification_documents
  drop constraint if exists supplier_verification_documents_notes_length,
  add constraint supplier_verification_documents_notes_length
    check (notes is null or length(notes) <= 3000);

comment on column public.supplier_verification_documents.business_license_path is
  'Private verification-documents bucket object path. Never expose as a public URL.';
comment on column public.supplier_verification_documents.company_registration_path is
  'Private verification-documents bucket object path. Never expose as a public URL.';
comment on column public.supplier_verification_documents.certifications_path is
  'Private verification-documents bucket object path. Never expose as a public URL.';
