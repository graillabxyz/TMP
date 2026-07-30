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
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_VERIFICATION_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
RFQ_NOTIFICATION_FROM=
RFQ_NOTIFICATION_TO=
```

The app reads suppliers, categories, published products, dashboard product
workspace data, and RFQ inserts from Supabase when environment variables are
present. Marketplace records do not silently fall back to a second mock catalog;
an unavailable database returns an empty result and logs the query failure.

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
- `20260603000000_stripe_subscription_sync_rpc.sql` adds the narrow Stripe
  webhook RPC that syncs subscription status after a verified Stripe event.
- `20260612000000_building_materials_category_cleanup.sql` aligns the former
  automotive seed/category data with the current Building Materials category.
- `20260730000000_secure_marketplace_media.sql` applies bucket limits and
  owner-scoped Storage RLS for supplier assets and private verification files.
- `20260730001000_private_verification_document_paths.sql` stores private object
  paths instead of public verification-document URLs.
- `20260730002000_secure_rfq_submissions.sql` hardens RFQ constraints and adds
  authenticated private attachments with owner/admin Storage RLS.
- `20260730003000_site_assets.sql` adds the public site-asset registry and
  protected site media bucket.
- `20260730004000_immediate_supplier_listing.sql` separates immediate supplier
  listing publication from the paid verified badge.
- `20260730005000_profile_identity.sql` synchronizes account name and email with
  Supabase Auth and prevents profile email changes through the public API.
- `20260730006000_rfq_requester_contact.sql` stores private requester contact
  details for replyable RFQ notifications.
- `20260730007000_listing_input_hardening.sql` constrains supplier/product input
  lengths, prices, currencies, image counts, and owner-scoped image URLs.
- `20260730008000_repair_seed_media.sql` repairs the one unavailable seed image
  before the media migration.
- `20260730009000_require_authenticated_rfqs.sql` requires an authenticated
  account for every RFQ.
- `20260730010000_rfq_rate_limit.sql` enforces per-account hourly and daily RFQ
  limits inside the database.

Current RLS stance:

- Public can read categories, listed supplier profiles, and published products.
- Suppliers can publish listings immediately; verification controls only the
  paid verified badge.
- Only authenticated users can insert RFQs, and the requester email and owner ID
  must match Supabase Auth.
- Public cannot select, update, or delete RFQs.
- Public cannot update or delete marketplace records.
- Authenticated suppliers can create, update, archive, and delete only products
  connected to their own supplier profile.
- Supplier approval and verification fields remain admin-only.
- Supplier verification documents are private to the supplier owner and admins.
- Supplier media writes are restricted to the authenticated owner path.
- RFQ attachments require authentication and are private to their submitter and
  admins.

### One-time media migration

After applying all migrations, migrate the existing external seed images and the
landing hero into Supabase Storage:

```bash
SUPABASE_SERVICE_ROLE_KEY=server-only-key npm run migrate:media
```

The script accepts existing remote images only from the approved Unsplash seed
host, uploads them to project Storage, updates supplier/product rows, uploads the
landing hero, and marks the hero database record ready. It is idempotent.

`SUPABASE_SERVICE_ROLE_KEY` is for this trusted local/admin migration only. Never
prefix it with `NEXT_PUBLIC_`, commit it, or add it to browser code.

## RFQ Email Routing

Authenticated RFQs are inserted into Supabase and then routed to the configured
team inbox with Resend. Set these variables in production:

```bash
RESEND_API_KEY=
RFQ_NOTIFICATION_FROM=TMP RFQ <rfq@your-domain.com>
RFQ_NOTIFICATION_TO=sourcing@your-domain.com
```

In production, missing RFQ email variables cause the RFQ action to report a
notification error after saving the request. In development, the email send is
skipped so the form can be tested without Resend credentials.

## Stripe

The supplier verification subscription flow creates live Stripe Checkout
Sessions when server-side Stripe variables are configured. Keep all Stripe
secrets in Vercel or `.env.local`; never commit live keys.

Prepared routes:

```text
/api/stripe/create-checkout-session
/api/stripe/customer-portal
/api/stripe/webhook
```

Required Vercel variables:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_VERIFICATION_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

`STRIPE_VERIFICATION_PRICE_ID` should be the recurring monthly Price ID for the
Verified Supplier subscription. The current `1 EUR` amount is test pricing only.
The webhook route verifies Stripe signatures and syncs subscription status back
to Supabase through a narrow security-definer RPC. No Supabase service-role key
is required.

After applying the Stripe sync migration, set the same webhook secret in
Supabase before testing live webhooks:

```sql
insert into public.app_settings (key, value)
values ('stripe_webhook_secret', 'whsec_replace_with_your_real_webhook_secret')
on conflict (key)
do update set value = excluded.value, updated_at = now();
```

## Google OAuth

The app uses Supabase Google OAuth for login and registration. Google provider
credentials are configured in Supabase Auth, not in the Next.js environment.

Setup checklist: `docs/google-oauth-setup.md`.

Supabase callback route:

```text
/auth/callback
```

The app creates one TMP account by default. Supplier access is added later from
the authenticated profile page, where the user enters basic business details and
can start the verification subscription.

## Multilingual SEO

English uses the canonical unprefixed routes, while French and Turkish are
available through locale-prefixed routes such as `/fr/products` and
`/tr/products`. Metadata emits language alternates for English, French, Turkish,
and `x-default`.

## Launch

Public launch checklist: `docs/launch-readiness.md`.
