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
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The current MVP uses mock data only. Supabase helpers are included under `src/lib/supabase` for future integration.
