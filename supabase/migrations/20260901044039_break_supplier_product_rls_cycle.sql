drop policy if exists "Public can read listed suppliers"
on public.suppliers;

create policy "Public can read listed suppliers"
on public.suppliers
for select
to anon, authenticated
using (
  verification_status = 'verified'
  or status = 'published'
);

create or replace function private.publish_supplier_with_product()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if new.status = 'published' and new.supplier_id is not null then
    update public.suppliers
    set
      status = 'published',
      updated_at = now()
    where id = new.supplier_id
      and owner_id = new.owner_id
      and status <> 'published';
  end if;

  return new;
end;
$function$;

revoke all on function private.publish_supplier_with_product()
from public, anon, authenticated;

drop trigger if exists publish_supplier_with_product
on public.supplier_products;

create trigger publish_supplier_with_product
after insert or update of status, supplier_id
on public.supplier_products
for each row
when (
  new.status = 'published'
  and new.supplier_id is not null
)
execute function private.publish_supplier_with_product();

update public.suppliers as supplier
set
  status = 'published',
  updated_at = now()
where supplier.status <> 'published'
  and exists (
    select 1
    from public.supplier_products as product
    where product.supplier_id = supplier.id
      and product.status = 'published'
  );
