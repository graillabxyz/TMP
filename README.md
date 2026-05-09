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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
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
- `20260509000000_auth_onboarding.sql` creates onboarding profiles from
  Supabase Auth users and prepares buyer/supplier role selection for email and
  Google OAuth sign-ins.
- `20260509001000_supplier_verification_subscription.sql` prepares supplier
  verification subscriptions, private verification document records, and
  Stripe-ready billing fields.

Current RLS stance:

- Public can read published categories, verified supplier accounts, and
  published products from verified suppliers.
- Public can insert RFQs only.
- Public cannot select, update, or delete RFQs.
- Public cannot update or delete marketplace records.
- Authenticated suppliers can create, update, archive, and delete only products
  connected to their own supplier profile.
- Supplier approval and verification fields remain admin-only.
- Supplier verification documents are private to the supplier owner and admins.

## Stripe

The supplier verification subscription flow is Stripe-ready but intentionally
runs in placeholder mode until live credentials are configured.

Prepared routes:

```text
/api/stripe/create-checkout-session
/api/stripe/customer-portal
/api/stripe/webhook
```

Once Stripe credentials are available, add `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in Vercel.
The route files are structured for swapping the placeholder JSON responses for
real Checkout Session, Customer Portal, and webhook event handling.

## Google OAuth

The app is wired for Supabase Google OAuth, but Google Console credentials still
need to be created and added in Supabase.

Supabase callback route:

```text
/auth/callback
```

When the Google OAuth client is ready, add the client ID/secret in Supabase Auth
Providers, then configure the Google authorized redirect URI shown by Supabase.
The app passes the selected onboarding role through the callback and upserts a
buyer/supplier profile after Supabase exchanges the OAuth code.
