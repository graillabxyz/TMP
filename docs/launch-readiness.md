# TMP Launch Readiness

Use this checklist before opening TMP publicly.

## Code And Deployment

- Merge and deploy the latest `main` branch to Vercel production.
- Confirm `NEXT_PUBLIC_SITE_URL=https://www.turkiyemarketplace.org` in Vercel
  production.
- Confirm production pages return `200`:
  - `/`
  - `/products`
  - `/suppliers`
  - `/rfq`
  - `/privacy`
  - `/terms`
- Confirm `/robots.txt` disallows private routes and `/sitemap.xml` only lists
  public marketplace pages.
- Keep `TMP_DEMO_AUTH_BYPASS=false` and
  `TMP_DEMO_AUTH_ALLOW_PRODUCTION=false` for public launch.

## Supabase

- Apply all migrations in `supabase/migrations/` in order.
- Confirm RLS is enabled on marketplace tables.
- Confirm public access is limited to:
  - published products from verified suppliers
  - verified suppliers
  - categories
  - RFQ inserts only
- Confirm RFQs are not publicly selectable.
- Confirm verification documents are private to supplier owners and admins.
- Set the Stripe webhook sync secret after applying the Stripe migration:

```sql
insert into public.app_settings (key, value)
values ('stripe_webhook_secret', 'replace_with_live_webhook_secret')
on conflict (key)
do update set value = excluded.value, updated_at = now();
```

## Stripe

- Rotate any live Stripe secret key that was shared outside Stripe/Vercel.
- Create or confirm the Verified Supplier recurring monthly price:
  - amount: `1 EUR`
  - interval: monthly
- Set Vercel production variables:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_VERIFICATION_PRICE_ID`
  - `STRIPE_WEBHOOK_SECRET`
- Create a Stripe webhook endpoint for:
  - `https://www.turkiyemarketplace.org/api/stripe/webhook`
- Subscribe to at least:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Test checkout with a supplier account and confirm Supabase updates:
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `verification_subscription_status`
  - `verification_expires_at`
- Test customer portal after checkout.

## Auth

- Confirm Google OAuth redirect URLs in Supabase include:
  - `https://www.turkiyemarketplace.org/auth/callback`
  - local callback URL for development
- Confirm Google Console authorized domains include:
  - `turkiyemarketplace.org`
- Test buyer Google signup lands in buyer dashboard.
- Test supplier Google signup creates a supplier profile and lands on
  verification settings.
- Test email auth only after email provider settings are final. Supabase default
  email can work for testing, but production email deliverability should use a
  configured SMTP provider.

## UX Smoke Test

- Search products by keyword and category.
- Open a product detail page and submit a product-context RFQ.
- Submit a general RFQ.
- Switch English/French and confirm page copy changes.
- Register as buyer and confirm supplier-only actions are hidden.
- Register as supplier and confirm product posting, edit, archive, and
  verification settings are reachable.
- Check mobile viewport for:
  - homepage hero
  - products filters
  - RFQ form
  - login/register role selection
  - dashboard/sidebar behavior

## SEO

- Confirm `NEXT_PUBLIC_SITE_URL=https://www.turkiyemarketplace.org`.
- Submit `https://www.turkiyemarketplace.org/sitemap.xml` in Google Search
  Console after the production deploy.
- Confirm Google Search Console can reach
  `https://www.turkiyemarketplace.org/google4512b4078a82adb8.html`.
- Confirm the homepage includes the Google site verification meta tag.
- Inspect `/robots.txt` and confirm private routes are disallowed.
- Use Google Rich Results Test on:
  - `/`
  - `/products`
  - one product detail page
  - `/suppliers`
  - one supplier detail page
- Verify public detail pages have:
  - one clear `h1`
  - canonical URL
  - Open Graph image
  - JSON-LD structured data
- Treat English as the primary SEO language for this launch. If French organic
  search becomes a priority, move from cookie-based language switching to
  URL-based routes such as `/fr/products`.

## Legal And Trust

- Review privacy policy and terms before public launch.
- Add a real support/contact channel before announcing.
- Decide whether the marketplace is accepting RFQs manually by email,
  dashboard review, or admin exports during the MVP period.
