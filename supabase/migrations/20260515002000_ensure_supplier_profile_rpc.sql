create or replace function public.ensure_supplier_profile(company text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  profile_role text;
  existing_supplier_id uuid;
  company_name text;
  base_slug text;
  inserted_supplier_id uuid;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Authentication required.';
  end if;

  select role into profile_role
  from public.profiles
  where id = current_user_id;

  if profile_role is distinct from 'supplier' then
    raise exception 'Only supplier profiles can create supplier records.';
  end if;

  select id into existing_supplier_id
  from public.suppliers
  where owner_id = current_user_id
  order by created_at asc
  limit 1;

  if existing_supplier_id is not null then
    return existing_supplier_id;
  end if;

  company_name := nullif(trim(coalesce(company, '')), '');
  company_name := coalesce(
    company_name,
    (
      select split_part(coalesce(email, 'supplier'), '@', 1)
      from public.profiles
      where id = current_user_id
    ),
    'Supplier'
  );

  base_slug := regexp_replace(lower(company_name), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  base_slug := coalesce(nullif(base_slug, ''), 'supplier');

  insert into public.suppliers (
    owner_id,
    slug,
    company_name,
    company_name_fr,
    name,
    city,
    country,
    summary,
    summary_fr,
    description,
    description_fr,
    verified,
    year_founded,
    employees,
    export_markets,
    moq,
    response_time,
    image_url,
    tags,
    tags_fr,
    certifications,
    certifications_fr,
    verification_status,
    verification_subscription_status,
    status
  )
  values (
    current_user_id,
    base_slug || '-' || substr(current_user_id::text, 1, 8),
    company_name,
    company_name,
    company_name,
    '',
    'Turkey',
    'Supplier profile in onboarding.',
    'Profil fournisseur en onboarding.',
    'This supplier profile is being prepared for marketplace review.',
    'Ce profil fournisseur est en préparation pour revue marketplace.',
    false,
    extract(year from now())::integer,
    '1-10',
    array[]::text[],
    'On request',
    'Pending',
    '/brand/tmp-logo.webp',
    array[]::text[],
    array[]::text[],
    array[]::text[],
    array[]::text[],
    'none',
    'inactive',
    'draft'
  )
  returning id into inserted_supplier_id;

  return inserted_supplier_id;
end;
$$;

grant execute on function public.ensure_supplier_profile(text) to authenticated;
