# TMP - Turkiye Market Place

Modern B2B sourcing marketplace foundation connecting European buyers with Turkish suppliers.

## Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui-style components
- Supabase public client + RLS-backed marketplace data
- Vercel-ready metadata, robots, and sitemap

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` when Supabase credentials are ready.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

The app reads suppliers, categories, published products, dashboard product
workspace data, and RFQ inserts from Supabase when environment variables are
present. Without local Supabase variables, the original supplier/category pages
fall back to the seed-like mock data in `src/lib/data.ts`; product discovery
expects Supabase data.

The app intentionally uses the publishable key only. Do not add service-role or
admin keys to the frontend project; database access should be controlled with
Supabase Row Level Security policies.

## Database

Apply the SQL migrations in order from `supabase/migrations/`.

- `20260508000000_initial_marketplace_schema.sql` creates the base marketplace seed.
- `20260508001000_auth_rls_i18n.sql` adds the ownership-ready `profiles` and
  `supplier_accounts` model, bilingual fields, storage buckets, and the RLS
  direction for public reads/RFQ inserts.
- `20260508002000_product_marketplace.sql` adds the MVP product marketplace
  tables and policies for supplier-owned product creation plus public product
  discovery.

Current RLS stance:

- Public can read published categories, approved/published supplier accounts,
  and published products.
- Public can insert RFQs only.
- Public cannot select, update, or delete RFQs.
- Public cannot update or delete marketplace records.
- Authenticated suppliers can create, update, archive, and delete only products
  connected to their own supplier profile.
- Supplier approval and verification fields remain admin-only.
