drop policy if exists "Public can submit rfqs" on public.rfqs;
drop policy if exists "Public can submit validated rfqs" on public.rfqs;
drop policy if exists "Authenticated users can submit validated rfqs" on public.rfqs;
create policy "Authenticated users can submit validated rfqs"
on public.rfqs for insert
to authenticated
with check (
  submitter_id = auth.uid()
  and requester_email = public.current_auth_email()
);
