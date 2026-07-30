update public.supplier_products
set
  images = array[
    'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=900&q=80'
  ],
  updated_at = now()
where slug = 'rigid-cosmetics-box'
  and images[1] like 'https://images.unsplash.com/photo-1607344645866-%';
