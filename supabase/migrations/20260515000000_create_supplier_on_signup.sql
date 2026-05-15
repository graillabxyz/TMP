create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
  company text;
  base_slug text;
begin
  requested_role := coalesce(new.raw_user_meta_data ->> 'role', 'buyer');

  if requested_role not in ('buyer', 'supplier') then
    requested_role := 'buyer';
  end if;

  company := nullif(trim(coalesce(new.raw_user_meta_data ->> 'company', '')), '');
  company := coalesce(company, split_part(coalesce(new.email, 'supplier'), '@', 1));
  base_slug := regexp_replace(lower(company), '[^a-z0-9]+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  base_slug := coalesce(nullif(base_slug, ''), 'supplier');

  insert into public.profiles (id, email, role)
  values (new.id, coalesce(new.email, ''), requested_role)
  on conflict (id) do update
  set
    email = excluded.email,
    role = case
      when public.profiles.role = 'admin' then public.profiles.role
      else excluded.role
    end,
    updated_at = now();

  if requested_role = 'supplier' then
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
    select
      new.id,
      base_slug || '-' || substr(new.id::text, 1, 8),
      company,
      company,
      company,
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
    where not exists (
      select 1
      from public.suppliers
      where suppliers.owner_id = new.id
    );
  end if;

  return new;
end;
$$;
