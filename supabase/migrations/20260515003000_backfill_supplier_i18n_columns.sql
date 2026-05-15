alter table public.suppliers
  add column if not exists summary_fr text,
  add column if not exists description_fr text,
  add column if not exists tags_fr text[] not null default '{}',
  add column if not exists certifications_fr text[] not null default '{}';

update public.suppliers
set
  summary_fr = coalesce(
    summary_fr,
    case slug
      when 'anatolia-textile-studio' then 'Maille premium, basiques en marque privée et habillement prêt pour l’export.'
      when 'marmara-machinery-works' then 'Composants usinés CNC et assemblages industriels pour acheteurs européens.'
      when 'aegean-homeware-co' then 'Céramique, textiles et articles de maison contemporains pour retailers.'
      when 'izmir-natural-foods' then 'Fruits secs, noix, épices et produits méditerranéens prêts pour le retail.'
      when 'bursa-auto-systems' then 'Pièces aftermarket, faisceaux et capacité fournisseur de rang industriel.'
      when 'istanbul-packaging-lab' then 'Cartons premium, emballages e-commerce, étiquettes et packaging retail.'
      else summary
    end
  ),
  description_fr = coalesce(
    description_fr,
    case slug
      when 'anatolia-textile-studio' then 'Partenaire textile intégré verticalement pour les marques européennes de mode, workwear et essentiels, avec lignes auditées et échantillonnage rapide.'
      when 'marmara-machinery-works' then 'Partenaire de fabrication de précision avec CNC, découpe laser et capacité d’assemblage pour fabricants d’équipements industriels.'
      when 'aegean-homeware-co' then 'Fournisseur homeware orienté design, combinant savoir-faire régional et planification moderne pour retailers boutique et hôtellerie.'
      when 'izmir-natural-foods' then 'Producteur alimentaire orienté export avec sourcing traçable, support étiquetage UE et packaging flexible en marque privée.'
      when 'bursa-auto-systems' then 'Fournisseur automobile avec forte capacité régionale à Bursa pour faisceaux, pièces caoutchouc et composants aftermarket de précision.'
      when 'istanbul-packaging-lab' then 'Partenaire packaging moderne pour e-commerce, cosmétiques et alimentaire, avec prototypage rapide et finitions export soignées.'
      else description
    end
  ),
  tags_fr = case
    when coalesce(array_length(tags_fr, 1), 0) = 0 then tags
    else tags_fr
  end,
  certifications_fr = case
    when coalesce(array_length(certifications_fr, 1), 0) = 0 then certifications
    else certifications_fr
  end;
