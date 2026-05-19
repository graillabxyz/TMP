alter table public.rfqs
  add column if not exists product_id uuid references public.supplier_products(id) on delete set null,
  add column if not exists supplier_id uuid references public.suppliers(id) on delete set null,
  add column if not exists product_slug text,
  add column if not exists supplier_slug text,
  add column if not exists inquiry_type text not null default 'general'
    check (inquiry_type in ('general', 'product'));

create index if not exists rfqs_product_id_idx on public.rfqs (product_id);
create index if not exists rfqs_supplier_id_idx on public.rfqs (supplier_id);
create index if not exists rfqs_inquiry_type_idx on public.rfqs (inquiry_type);
