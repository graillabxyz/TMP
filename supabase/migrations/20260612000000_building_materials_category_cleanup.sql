do $$
declare
  old_category_id uuid;
  new_category_id uuid;
begin
  select id into old_category_id
  from public.categories
  where slug = 'automotive-parts';

  select id into new_category_id
  from public.categories
  where slug = 'building-materials';

  if old_category_id is not null and new_category_id is null then
    update public.categories
    set
      slug = 'building-materials',
      name = 'Building Materials',
      name_fr = 'Matériaux de bâtiments',
      description = 'Construction materials, fixtures, surfaces, and fit-out supply.',
      description_fr = 'Matériaux de construction, équipements, surfaces et approvisionnement fit-out.',
      updated_at = now()
    where id = old_category_id;

    new_category_id := old_category_id;
  elsif new_category_id is not null then
    update public.supplier_products
    set category_id = new_category_id
    where category_id = old_category_id;

    update public.suppliers
    set category_id = new_category_id
    where category_id = old_category_id;

    delete from public.categories
    where id = old_category_id;

    update public.categories
    set
      name = 'Building Materials',
      name_fr = 'Matériaux de bâtiments',
      description = 'Construction materials, fixtures, surfaces, and fit-out supply.',
      description_fr = 'Matériaux de construction, équipements, surfaces et approvisionnement fit-out.',
      updated_at = now()
    where id = new_category_id;
  end if;

  update public.supplier_products
  set
    slug = case
      when
        slug = 'wiring-harness-assemblies'
        and not exists (
          select 1
          from public.supplier_products product_slug_check
          where product_slug_check.slug = 'aluminum-window-profile-sets'
        )
        then 'aluminum-window-profile-sets'
      when
        slug = 'rubber-vibration-mounts'
        and not exists (
          select 1
          from public.supplier_products product_slug_check
          where product_slug_check.slug = 'thermal-insulation-boards'
        )
        then 'thermal-insulation-boards'
      else slug
    end,
    title = case slug
      when 'wiring-harness-assemblies' then 'Aluminum window profile sets'
      when 'rubber-vibration-mounts' then 'Thermal insulation boards'
      else title
    end,
    title_fr = case slug
      when 'wiring-harness-assemblies' then 'Sets de profilés aluminium pour fenêtres'
      when 'rubber-vibration-mounts' then 'Panneaux d’isolation thermique'
      else title_fr
    end,
    description = case slug
      when 'wiring-harness-assemblies' then 'Export-ready aluminum profile sets for window and facade programs.'
      when 'rubber-vibration-mounts' then 'Thermal insulation boards for construction and fit-out supply programs.'
      else description
    end,
    description_fr = case slug
      when 'wiring-harness-assemblies' then 'Sets de profilés aluminium prêts pour l’export pour programmes fenêtres et façades.'
      when 'rubber-vibration-mounts' then 'Panneaux d’isolation thermique pour programmes de construction et fit-out.'
      else description_fr
    end,
    category_id = coalesce(new_category_id, category_id),
    updated_at = now()
  where slug in ('wiring-harness-assemblies', 'rubber-vibration-mounts');
end $$;

do $$
declare
  old_category_id uuid;
  new_category_id uuid;
begin
  select id into old_category_id
  from public.supplier_categories
  where slug = 'automotive-parts';

  select id into new_category_id
  from public.supplier_categories
  where slug = 'building-materials';

  if old_category_id is not null and new_category_id is null then
    update public.rfqs
    set category_slug = 'building-materials'
    where category_slug = 'automotive-parts';

    update public.supplier_categories
    set
      slug = 'building-materials',
      name = 'Building Materials',
      name_fr = 'Matériaux de bâtiments',
      description = 'Construction materials, fixtures, surfaces, and fit-out supply.',
      description_fr = 'Matériaux de construction, équipements, surfaces et approvisionnement fit-out.',
      updated_at = now()
    where id = old_category_id;
  elsif new_category_id is not null then
    update public.suppliers
    set category_id = new_category_id
    where category_id = old_category_id;

    update public.rfqs
    set category_slug = 'building-materials'
    where category_slug = 'automotive-parts';

    delete from public.supplier_categories
    where id = old_category_id;

    update public.supplier_categories
    set
      name = 'Building Materials',
      name_fr = 'Matériaux de bâtiments',
      description = 'Construction materials, fixtures, surfaces, and fit-out supply.',
      description_fr = 'Matériaux de construction, équipements, surfaces et approvisionnement fit-out.',
      updated_at = now()
    where id = new_category_id;
  end if;
end $$;

update public.suppliers
set
  slug = case
    when
      slug = 'bursa-auto-systems'
      and not exists (
        select 1
        from public.suppliers supplier_slug_check
        where supplier_slug_check.slug = 'bursa-building-materials'
      )
      then 'bursa-building-materials'
    else slug
  end,
  company_name = case
    when slug = 'bursa-auto-systems' then 'Bursa Building Materials'
    else company_name
  end,
  company_name_fr = case
    when slug = 'bursa-auto-systems' then 'Matériaux de bâtiments Bursa'
    else company_name_fr
  end,
  summary = case
    when slug = 'bursa-auto-systems' then 'Facade systems, insulation, fixtures, and fit-out material supply.'
    else summary
  end,
  summary_fr = case
    when slug = 'bursa-auto-systems' then 'Systèmes de façade, isolation, équipements et approvisionnement de matériaux fit-out.'
    else summary_fr
  end,
  description = case
    when slug = 'bursa-auto-systems' then 'Building materials supplier with Bursa-region capacity for aluminum profiles, insulation boards, hardware, and export-ready fit-out programs.'
    else description
  end,
  description_fr = case
    when slug = 'bursa-auto-systems' then 'Fournisseur de matériaux de construction dans la région de Bursa pour profilés aluminium, panneaux isolants, quincaillerie et programmes fit-out prêts pour l’export.'
    else description_fr
  end,
  updated_at = now()
where slug = 'bursa-auto-systems';
