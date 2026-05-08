# TMP - Turkiye Market Place

Modern B2B sourcing marketplace foundation connecting European buyers with Turkish suppliers.

## Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui-style components
- Supabase placeholders
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

The app reads suppliers, categories, and RFQs from Supabase when environment
variables are present. Without local Supabase variables, it falls back to the
seed-like mock data in `src/lib/data.ts` so development still works.

## Database

Apply the SQL in `supabase/migrations/20260508000000_initial_marketplace_schema.sql`
to create the marketplace tables, RLS policies, and starter supplier data.
