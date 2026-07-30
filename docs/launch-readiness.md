# TMP Launch Readiness

Last verified: 2026-07-30

Status key:

- `PASS`: verified against code, build output, or the live service.
- `BLOCKED`: launch must wait for this item.
- `PENDING`: not yet tested or needs a real account/provider workflow.
- `OWNER`: requires a business or account-owner decision.

## Launch Decision

**Current decision: NO-GO for unrestricted public signup.**

The latest production deployment is healthy and the application has passed its
local quality gates. Public launch remains blocked by unapplied Supabase
migrations/media migration and missing RFQ email delivery configuration. Real
auth and Stripe subscription workflows must be exercised after those blockers
are cleared.

## 1. Code, Supply Chain, And Deployment

- [x] `PASS` Latest `main` commit deployed successfully to Vercel production.
- [x] `PASS` TypeScript typecheck passes.
- [x] `PASS` ESLint passes with zero warnings.
- [x] `PASS` Next.js production build passes.
- [x] `PASS` Full production and development dependency audit reports zero
      vulnerabilities.
- [x] `PASS` CI runs install, production audit, tests, typecheck, lint, and
      build.
- [x] `PASS` Seven focused regression tests cover internal redirect
      sanitization, upload signatures, PDF restrictions, size limits, randomized
      media paths, and private-path ownership checks.
- [x] `PASS` Runtime is pinned to Node 24.
- [x] `PASS` Security headers are present on the public domain.
- [x] `PASS` Marketplace images render without depending on Vercel image
      optimization quota; all homepage images loaded successfully after scrolling.
- [x] `PASS` Preview deployments require Vercel authentication; the custom
      production domain remains publicly reachable.
- [ ] `PENDING` Confirm branch protection requires the CI workflow before merge.
- [ ] `PENDING` Run one documented Vercel rollback drill.

## 2. Supabase Schema, RLS, And Storage

- [x] `PASS` Live anonymous reads expose categories and marketplace listings,
      while RFQs, profiles, and verification documents are not anonymously
      selectable.
- [ ] `BLOCKED` Apply every migration in `supabase/migrations/` in timestamp
      order. Live schema inspection shows the 2026-07-30 launch migrations are not
      applied.
- [ ] `BLOCKED` Run `npm run migrate:media` with the production service role key
      after the schema migrations.
- [ ] `BLOCKED` Confirm the Istanbul hero, supplier media, and product media are
      served from Supabase Storage rather than third-party seed URLs.
- [ ] `BLOCKED` Confirm authenticated RFQ insert policy requires
      `submitter_id = auth.uid()` and the authenticated email.
- [ ] `BLOCKED` Confirm supplier listing policies permit immediate publishing
      only by the owning account.
- [ ] `BLOCKED` Confirm supplier image paths are scoped to the authenticated
      owner and supplier.
- [ ] `BLOCKED` Confirm verification files use a private bucket and signed URLs.
- [ ] `BLOCKED` Configure the server-only `SUPABASE_SERVICE_ROLE_KEY` for the
      Stripe webhook and confirm the sync RPC is executable only by `service_role`.
- [ ] `PENDING` Run Supabase database and security advisors after migrations;
      resolve all errors and review warnings.
- [ ] `PENDING` Verify Point-in-Time Recovery or scheduled backups and perform a
      test restore into a non-production project.

## 3. Authentication And Authorization

- [x] `PASS` Demo authentication bypass code and routes have been removed.
- [x] `PASS` Protected server actions re-check the authenticated user.
- [x] `PASS` Profile email is designed to remain synchronized with auth email.
- [x] `PASS` Anonymous users are directed to sign in before submitting an RFQ.
- [x] `PASS` A localized sign-out action is available from both public and
      dashboard profile menus.
- [x] `PASS` Login, registration, OAuth callback, sign-out, and supplier-upgrade
      return paths share one internal-only redirect validator. Production tests
      reject protocol-relative and backslash-normalized external destinations.
- [ ] `PENDING` Create a real email/password account and verify confirmation,
      login, logout, reset password, and session persistence.
- [ ] `PENDING` Test Google OAuth callback and authorized-domain configuration.
- [ ] `PENDING` Verify a buyer cannot create/edit listings, access another
      account, or read private RFQs/documents.
- [ ] `PENDING` Upgrade one buyer to supplier, publish immediately, and verify
      only that supplier can edit/archive its listing.
- [ ] `PENDING` Configure production SMTP for Supabase Auth and test delivery.
- [ ] `OWNER` Decide whether email confirmation is mandatory before marketplace
      actions.

## 4. RFQ And Marketplace Workflows

- [x] `PASS` RFQs collect actionable quantity, category, destination, timing,
      specification, and requester identity.
- [x] `PASS` RFQ file types and sizes are validated, with private attachment
      storage defined in migrations.
- [x] `PASS` Email requests include a reply-to address and idempotency key.
- [x] `PASS` The application fails closed when required authenticated RFQ
      columns are absent instead of inserting an ownerless legacy record.
- [ ] `BLOCKED` Configure `RESEND_API_KEY`, `RFQ_NOTIFICATION_FROM`, and
      `RFQ_NOTIFICATION_TO` in Vercel production. A live test saved the RFQ but
      logged `Missing RFQ email notification environment variables`.
- [ ] `BLOCKED` Submit a real authenticated RFQ and confirm it arrives in the
      sourcing inbox with correct reply-to, content, and attachment access.
- [ ] `PENDING` Verify product search, category filters, product detail, supplier
      detail, and empty states against migrated Supabase data.
- [ ] `PENDING` Verify create, edit, publish, archive, image upload, and ownership
      denial for supplier listings.
- [ ] `PENDING` Add an operational workflow for reviewing and responding to RFQs.
- [ ] `OWNER` Set the RFQ response owner and service-level target.

## 5. Stripe And Verified Membership

- [x] `PASS` Production has enough Stripe configuration for the checkout endpoint
      to return `auth-required` instead of configuration failure.
- [x] `PASS` The webhook endpoint rejects unsigned requests.
- [x] `PASS` Checkout and portal endpoints reject requests without the exact
      production `Origin`, while same-origin unauthenticated requests return the
      intended login path.
- [x] `PASS` Public verified badges require both approved verification and an
      active, unexpired membership in application logic.
- [ ] `BLOCKED` Replace the EUR 1 test price with the approved production price
      before charging real customers.
- [ ] `PENDING` Complete a Stripe test-mode checkout with a supplier account.
- [ ] `PENDING` Confirm webhook events update customer, subscription, status, and
      expiry fields in Supabase.
- [ ] `PENDING` Test cancellation, failed payment, renewal, duplicate webhook,
      and customer portal behavior.
- [ ] `PENDING` Confirm the paid membership controls only the verified badge,
      not listing publication.
- [ ] `OWNER` Approve price, tax/VAT treatment, refund terms, invoice wording,
      and whether Stripe must be live on day one.

## 6. UI, Accessibility, Localization, And SEO

- [x] `PASS` English, French, and Turkish route infrastructure exists.
- [x] `PASS` Sitemap, robots rules, canonical metadata, language alternates, and
      structured data are implemented for public routes.
- [x] `PASS` Public links and JSON-LD retain `/fr` and `/tr` prefixes.
- [x] `PASS` Robots rules block private, auth, and account routes in all three
      languages.
- [x] `PASS` Major public routes have exactly one `h1`, no duplicate IDs, named
      visible buttons, labeled visible fields, and alternative text on every image.
- [x] `PASS` Core public routes have no horizontal overflow at 320 px.
- [x] `PASS` English, French, and Turkish headings, buttons, labels, legal copy,
      and auth copy were crawled on the core route set.
- [x] `PASS` Header category menu closes on outside click and Escape.
- [x] `PASS` Ten primary public routes were checked at 1280, 1440, and 1920
      widths with no horizontal overflow, duplicate IDs, unnamed visible buttons,
      missing image alternative text, or invalid primary heading counts.
- [x] `PASS` The same ten public routes were checked at 320, 375, 390, and 430
      widths with the same result, for a 70-page responsive matrix.
- [ ] `PENDING` Keyboard-only review for header menus, filters, forms, dialogs,
      dashboard navigation, and focus visibility.
- [ ] `PENDING` Automated accessibility scan plus manual label, heading,
      contrast, zoom, and screen-reader spot checks.
- [x] `PASS` All 12 product and 6 supplier detail pages were crawled at 390 px;
      every visible image loaded, every page had one `h1`, and none overflowed or
      rendered a not-found state. The known legacy seed image is repaired at read
      time while the production data migration remains pending.
- [ ] `PENDING` Validate loading, empty, validation, error, offline, and success
      states for every primary workflow.
- [ ] `PENDING` Run Lighthouse on home, products, suppliers, RFQ, login, and one
      detail page; investigate scores below 90 for accessibility, best practices,
      and SEO.
- [ ] `OWNER` Submit sitemap and review indexing in Google Search Console.

## 7. Operations, Privacy, And Abuse

- [x] `PASS` A public support contact is available in the site header.
- [x] `PASS` Recent production runtime errors can be queried through Vercel.
- [ ] `BLOCKED` Configure production error alerting for server errors, failed
      RFQ email, failed webhooks, and authentication spikes.
- [ ] `PENDING` Add rate limiting or abuse controls to auth-adjacent actions,
      uploads, RFQs, and costly endpoints.
- [ ] `PENDING` Define image/file moderation, supplier takedown, account
      suspension, and data deletion procedures.
- [ ] `PENDING` Review log output to ensure it excludes secrets, tokens,
      document URLs, and unnecessary personal data.
- [ ] `PENDING` Document database backup, Vercel rollback, secret rotation,
      incident response, and owner contacts.
- [ ] `OWNER` Have qualified counsel review privacy policy, terms, cookies,
      supplier verification claims, marketplace liability, and GDPR obligations.
- [ ] `OWNER` Confirm the business has consent, retention, deletion, and
      data-subject-request procedures before collecting real user data.

## Required Go-Live Evidence

Launch can move to `GO` only when:

1. Every `BLOCKED` item above is resolved.
2. A real buyer and supplier account complete the full production workflow.
3. An RFQ reaches the sourcing inbox and receives a reply.
4. A supplier listing publishes with Supabase-hosted media and ownership denial
   is verified from a second account.
5. Stripe is either fully tested with the approved price or explicitly disabled
   for launch.
6. Backup/rollback, monitoring, and legal owner checks are signed off.
7. No Critical or High security findings remain open.
