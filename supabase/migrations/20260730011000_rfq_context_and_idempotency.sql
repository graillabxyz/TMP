alter table public.rfqs
  add column if not exists request_token uuid;

update public.rfqs
set request_token = gen_random_uuid()
where request_token is null;

alter table public.rfqs
  alter column request_token set default gen_random_uuid(),
  alter column request_token set not null,
  drop constraint if exists rfqs_attachment_name_safety,
  add constraint rfqs_attachment_name_safety check (
    attachment_name is null
    or (
      length(trim(attachment_name)) between 1 and 180
      and attachment_name !~ '[[:cntrl:]]'
    )
  ) not valid;

create unique index if not exists rfqs_submitter_request_token_unique_idx
on public.rfqs (submitter_id, request_token);

alter table public.rfqs
  drop constraint if exists rfqs_category_slug_fkey;

alter table public.rfqs
  add constraint rfqs_category_slug_fkey
  foreign key (category_slug)
  references public.categories(slug)
  on delete set null
  not valid;

create or replace function public.enforce_rfq_context_integrity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actual_category_slug text;
  actual_product_slug text;
  actual_supplier_id uuid;
  actual_supplier_slug text;
begin
  if new.category_slug is null or not exists (
    select 1
    from public.categories
    where categories.slug = new.category_slug
  ) then
    raise exception 'A current marketplace category is required.';
  end if;

  if new.product_id is not null then
    select
      supplier_products.slug,
      supplier_products.supplier_id,
      suppliers.slug,
      categories.slug
    into
      actual_product_slug,
      actual_supplier_id,
      actual_supplier_slug,
      actual_category_slug
    from public.supplier_products
    join public.suppliers
      on suppliers.id = supplier_products.supplier_id
    left join public.categories
      on categories.id = supplier_products.category_id
    where supplier_products.id = new.product_id
      and supplier_products.status = 'published';

    if not found
      or actual_category_slug is null
      or new.inquiry_type is distinct from 'product'
      or new.product_slug is distinct from actual_product_slug
      or new.supplier_id is distinct from actual_supplier_id
      or new.supplier_slug is distinct from actual_supplier_slug
      or new.category_slug is distinct from actual_category_slug then
      raise exception 'RFQ product context does not match a published listing.';
    end if;
  elsif new.product_slug is not null or new.inquiry_type = 'product' then
    raise exception 'RFQ product context is incomplete.';
  end if;

  if new.product_id is null and new.supplier_id is not null then
    select suppliers.slug
    into actual_supplier_slug
    from public.suppliers
    where suppliers.id = new.supplier_id
      and (
        suppliers.verification_status = 'verified'
        or suppliers.status = 'published'
        or exists (
          select 1
          from public.supplier_products
          where supplier_products.supplier_id = suppliers.id
            and supplier_products.status = 'published'
        )
      );

    if not found or new.supplier_slug is distinct from actual_supplier_slug then
      raise exception 'RFQ supplier context does not match a listed supplier.';
    end if;
  elsif new.product_id is null
    and new.supplier_id is null
    and new.supplier_slug is not null then
    raise exception 'RFQ supplier context is incomplete.';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_rfq_context_integrity() from public;

drop trigger if exists rfqs_enforce_context_integrity on public.rfqs;
create trigger rfqs_enforce_context_integrity
before insert or update of
  product_id,
  supplier_id,
  product_slug,
  supplier_slug,
  inquiry_type,
  category_slug
on public.rfqs
for each row execute function public.enforce_rfq_context_integrity();
