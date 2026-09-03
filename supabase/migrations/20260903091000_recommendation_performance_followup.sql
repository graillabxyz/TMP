create index if not exists marketplace_activity_category_slug_idx
on public.marketplace_activity (category_slug);

create index if not exists marketplace_activity_product_id_idx
on public.marketplace_activity (product_id);

create index if not exists marketplace_activity_supplier_id_idx
on public.marketplace_activity (supplier_id);

drop policy if exists "Authenticated users can submit validated rfqs" on public.rfqs;
create policy "Authenticated users can submit validated rfqs"
on public.rfqs for insert
to authenticated
with check (
  submitter_id = (select auth.uid())
  and lower(requester_email) = lower((select auth.jwt()) ->> 'email')
);
