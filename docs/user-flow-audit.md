# TMP User-Flow Audit

Last updated: 2026-07-30

This is the ordered inventory for ten audit-and-edit loops. A loop is complete
only after its reachable flows have been exercised, verified defects have been
fixed, quality gates pass, and any provider-dependent gaps are recorded as
blocked with the exact missing dependency.

Status key:

- `QUEUED`: not exercised in this audit yet.
- `PASS`: behavior and relevant security boundary verified.
- `FIXED`: a defect was found, fixed, and retested.
- `BLOCKED`: requires unavailable provider state, credentials, or production
  configuration.
- `OWNER`: requires a product or business decision.

## Actors And Trust Boundaries

- **Visitor:** public catalog and account entry points; no private data access.
- **Buyer:** authenticated account, dashboard, RFQs, and supplier upgrade.
- **Supplier:** buyer account with supplier tools, owned listings, uploads, and
  optional paid verification.
- **Administrator/providers:** RFQ inbox, Supabase policies/storage, Stripe
  webhooks, email delivery, monitoring, and recovery.

## Loop 1: Global Navigation And Locale

1. `PASS` Load the homepage from logo, direct URL, and localized URL.
2. `PASS` Use desktop and mobile header search; preserve the active locale.
3. `PASS` Open, navigate, and naturally close the categories menu by
   selection, outside click, pointer leave, and Escape.
4. `FIXED` Switch EN/FR/TR from public and dashboard surfaces while preserving
   the current public route and query where appropriate.
5. `PASS` Open and close Contact; call and email links use the intended
   administrator details.
6. `PASS` Follow primary, buyer-tool, footer, legal, login, join, profile, and
   supplier-upgrade navigation without dead ends or misleading controls.

## Loop 2: Marketplace Discovery

7. `PASS` Browse product and supplier indexes with populated results.
8. `PASS` Search from the homepage/header and receive the expected product
   results.
9. `PASS` Filter products by search, category, and supplier; combine and clear
   filters.
10. `FIXED` Filter suppliers by search, category, location, verification,
    export market, and capability; combine and clear filters.
11. `FIXED` Open product details, related products, supplier details, and
    supplier products with correct localized URLs and breadcrumbs.
12. `FIXED` Start a product-specific or supplier-specific RFQ with trustworthy
    context carried into the request.
13. `PASS` Render useful no-results, unavailable-data, and unknown-slug
    states without leaking internal errors.

## Loop 3: Account Entry And Authentication

14. `BLOCKED` Register a standard account with email/password and valid profile
    details.
15. `FIXED` Reject empty, malformed, oversized, weak-password, and duplicate
    registration input without exposing provider details.
16. `BLOCKED` Complete email confirmation and land on the intended safe route.
17. `BLOCKED` Login with email/password; handle invalid credentials safely.
18. `BLOCKED` Start and complete Google OAuth for login and registration.
19. `PASS` Preserve valid internal `next` paths and reject external,
    protocol-relative, encoded, and backslash-normalized redirects.
20. `FIXED` Recover a forgotten password and establish a new session.

## Loop 4: Buyer Account And Session

21. `FIXED` Anonymous dashboard/profile access redirects to localized login.
22. `BLOCKED` An authenticated buyer sees only their profile, email, RFQs, and
    relevant dashboard actions.
23. `BLOCKED` Sessions persist across refresh and expire/revoke predictably.
24. `BLOCKED` Public and dashboard profile menus open, close, navigate, and sign
    out correctly by pointer and keyboard.
25. `BLOCKED` A buyer cannot read or mutate another account's profile, RFQs,
    attachments, supplier, products, or verification documents.

## Loop 5: Supplier Upgrade

26. `BLOCKED` A signed-in buyer starts supplier access from Profile with a valid
    business name.
27. `FIXED` Missing, short, oversized, forged-return, anonymous, and repeated
    supplier-upgrade requests fail safely or remain idempotent.
28. `BLOCKED` The upgraded account immediately receives supplier tools without
    receiving a verified badge.
29. `PASS` Public and dashboard calls to become a supplier route existing
    accounts to login/Profile rather than creating a second account type.

## Loop 6: Supplier Listings And Media

30. `BLOCKED` Create a draft or immediately published listing with valid
    category, description, MOQ, pricing, currency, lead time, and image.
31. `FIXED` Reject malformed numbers, price inversion, excessive text,
    unsupported currency, missing category/image, spoofed files, and oversized
    uploads.
32. `BLOCKED` Edit listing details, replace the image, and clean up only the
    replaced owner-scoped object.
33. `BLOCKED` Archive a listing and remove it from public discovery.
34. `BLOCKED` A buyer or different supplier cannot create, edit, archive, delete,
    reference, or overwrite another supplier's listing or storage path.

## Loop 7: RFQ And Inbox

35. `QUEUED` Submit general and product-context RFQs with specific product,
    quantity, destination, timeline, requester, and optional company details.
36. `QUEUED` Reject vague, malformed, oversized, anonymous, honeypot, stale
    schema, and excessive-frequency RFQs safely.
37. `QUEUED` Accept only signature-validated private attachments within the
    size limit; reject traversal, spoofing, and cross-account access.
38. `QUEUED` Save one owned RFQ, send one idempotent email with reply-to, and
    provide a time-limited attachment review link.
39. `QUEUED` Handle database, storage, email, and signed-link failures without
    duplicate requests, orphaned files, false success, or sensitive logs.

## Loop 8: Verification And Billing

40. `QUEUED` Upload required private verification documents, preserve valid
    existing files, replace owner files safely, and enter pending review.
41. `QUEUED` Keep listing publication independent from verification and show a
    badge only when verification and subscription state permit it.
42. `QUEUED` Start same-origin authenticated Stripe Checkout, return safely,
    and open the correct customer portal.
43. `QUEUED` Reject unsigned/invalid webhooks and synchronize checkout,
    renewal, failed payment, cancellation, duplicate, and out-of-order events
    without cross-supplier mutation.

## Loop 9: Experience, Accessibility, And Failure States

44. `QUEUED` Complete primary flows at 320, 375, 390, 430, 1280, 1440, and
    1920 px without overflow, overlap, clipped copy, or layout shift.
45. `QUEUED` Complete menus, filters, forms, dialogs, and dashboard navigation
    by keyboard with visible focus, logical order, Escape behavior, and useful
    names.
46. `QUEUED` Verify EN/FR/TR copy, validation, success/error states, metadata,
    canonical URLs, alternates, sitemap, robots, structured data, and 404s.
47. `QUEUED` Verify useful loading, empty, validation, offline, provider-error,
    and success feedback without false activity or trust claims.

## Loop 10: Adversarial Regression And Operations

48. `QUEUED` Run tests, typecheck, lint, build, dependency audit, secret scan,
    security-header checks, origin checks, and production runtime review.
49. `QUEUED` Verify database RLS/storage policies and advisors against the
    connected production Supabase project after every migration is applied.
50. `QUEUED` Verify alerting, backup/restore, rollback, key rotation, incident
    ownership, moderation/takedown, deletion, and legal launch decisions.
51. `QUEUED` Rerun all fixed flows and issue a final evidence-based GO/NO-GO
    decision with no unresolved Critical or High security findings.

## Loop Exit Record

Each completed loop will add:

1. Flows exercised and environment used.
2. Defects and severity.
3. Files changed and commit.
4. Verification evidence.
5. Remaining blocked or owner-dependent paths.

### Loop 1

1. **Flows and environment:** Exercised flows 1-6 against the local Next.js
   development server at 390x844 and 1440x900 in EN, FR, and TR. Checked direct
   and logo homepage navigation, desktop/mobile header search, category
   selection and dismissal, locale switching with query strings, Contact, and
   public/auth/legal navigation targets.
2. **Defect:** `Medium` - client-side language changes updated page content but
   left the persistent header, active language control, and document language
   in the previous locale.
3. **Fix:** Locale controls now use route-preserving navigation links and a
   pathname-driven document language synchronizer. Commit `39e3069`.
4. **Evidence:** `/products?q=hoodie&category=packaging` remained on the same
   route/query through EN -> FR -> TR -> EN; header copy, selector state, and
   `<html lang>` agreed after every change. FR desktop search reached
   `/fr/products?q=hoodie`; TR mobile search reached
   `/tr/products?q=havlu`. Category selection reached
   `/tr/products?category=building-materials`; outside click and Escape closed
   the menu. Static review confirms its 450ms pointer-leave delay. Contact
   exposed `tel:+33683024752` and `mailto:o.biyik@outlook.fr` and closed by its
   close control, outside click, and Escape. Nine tests, typecheck, lint, and
   production build passed.
5. **Remaining:** Dashboard locale behavior is rechecked with an authenticated
   session in Loop 4. Provider-backed navigation remains covered by its owning
   later loop.

### Loop 2

1. **Flows and environment:** Exercised flows 7-13 in FR and TR against live
   Supabase-backed catalog data. Tested populated indexes, combined product
   search/category/supplier filters, combined supplier
   search/category/verified/export/low-MOQ filters, clear actions, product and
   supplier details, related/catalog navigation, contextual RFQs, no-results,
   and unknown slugs.
2. **Defects:** `Medium` - verified-directory links emitted
   `verified=true`, but the filter only recognized `verified=1`, leaving the
   control inactive. `High` - supplier profile RFQ links dropped supplier
   context, so a supplier-targeted buyer intent became a general request.
   `Medium` - product details did not link to the supplier and supplier
   profiles offered no path to that supplier's full product catalog.
3. **Fix:** Standardized verified links while accepting the legacy query,
   carried validated supplier context into RFQ presentation and hidden fields,
   stopped forwarding unknown product slugs, and added localized
   product-to-supplier and supplier-to-catalog links. Commit `623b02b`.
4. **Evidence:** A three-filter product query returned one expected hoodie and
   clearing restored 12 listings. A five-filter supplier query returned only
   Laboratoire Packaging Istanbul with all controls checked. Supplier catalog
   navigation returned its two products. Product and supplier RFQs populated
   the expected known slugs; unknown product input was no longer copied into
   the form. FR/TR no-results and unknown product/supplier routes rendered
   localized, non-sensitive states. Tests, typecheck, and lint passed.
5. **Remaining:** RFQ action-side resistance to forged context belongs to Loop
   7. A real provider outage was not induced against the connected project; its
   fail-empty code path was reviewed and the full failure experience is covered
   again in Loop 9.

### Loop 3

1. **Flows and environment:** Exercised flows 14-20 across EN/FR/TR. Tested
   login/register/recovery navigation, malformed field validation, invalid
   credentials, safe and hostile `next` values, callback failure routing,
   Google OAuth launch, unknown-email recovery, reset-session guards, and
   production compilation.
2. **Defects:** `High` - no password recovery or password update journey
   existed. `Medium` - auth links, action errors, and callbacks fell back to
   English routes. `Medium` - server registration accepted malformed email and
   one-character names until Supabase rejected them. `Medium` - supplier auth
   copy incorrectly said monthly verification was required before publishing.
3. **Fix:** Added localized forgot/reset pages and Supabase recovery actions,
   non-enumerating reset responses, authenticated password updates, locale-safe
   action/OAuth callbacks, server validation with unit coverage, an auth-layout
   language selector, and accurate optional-verification copy. Commit
   `6b88cf3`.
4. **Evidence:** Invalid FR credentials returned one generic error. An external
   `next` became `/dashboard`; a missing-code callback with `//evil.example`
   returned `/fr/login?status=auth-error`. Google OAuth reached the configured
   Google consent endpoint with the FR callback and intended internal route.
   Unknown-email TR recovery returned the generic sent state. Twelve tests,
   typecheck, lint, and the 24-route production build passed.
5. **Remaining:** No real account was created during the audit and no inbox was
   used. Valid email/password login, confirmation-link completion, reset-link
   completion, and Google consent completion require test identities and inbox
   access; flows 14, 16, and 18 remain blocked. Flow 20's missing implementation
   is fixed, but its emailed-link completion still needs that provider test.

### Loop 4

1. **Flows and environment:** Exercised anonymous access to every dashboard
   route in TR, reviewed all dashboard profile/session branches, and audited
   checked-in RLS for profiles, RFQs, supplier records, products, supplier
   assets, verification files, and RFQ attachments.
2. **Defects:** `Medium` - localized dashboard roots redirected anonymous users
   to English login. `Medium` - nested product and verification workspaces
   rendered dashboard chrome and denial cards to anonymous visitors instead of
   enforcing one consistent auth boundary. `Medium` - dashboard links, product
   form cancellation, and sign-out failure handling could silently lose locale.
3. **Fix:** Every dashboard entry now redirects before workspace loading to a
   localized login with an exact safe return path; auth-required feedback,
   dashboard links, product cancellation, profile return, and sign-out locale
   are consistent. Commit `61160dd`.
4. **Evidence:** `/tr/dashboard`, Profile, Products, New Product, arbitrary Edit
   Product, and Verification each returned
   `/tr/login?status=auth-required&next=<exact localized route>`. The login
   rendered Turkish auth-required copy. Static policy evidence includes
   `profiles.id = auth.uid()`, `rfqs.submitter_id = auth.uid()`, supplier
   ownership checks, and owner-prefixed private storage paths. Twelve tests,
   typecheck, and lint passed.
5. **Remaining:** A real signed-in buyer and a second adversarial account are
   required to test session refresh/revocation, menu sign-out, and cross-account
   reads/mutations end to end. The Supabase MCP registration exists, but live
   SQL/policy tools are not callable in this running task, so checked-in
   migrations cannot substitute for verifying applied production policy state.

### Loop 5

1. **Flows and environment:** Reviewed and exercised flows 26-29 through public
   EN/FR/TR entry points, anonymous denial paths, server validation, safe return
   handling, profile role RLS, and the `ensure_supplier_profile` RPC.
2. **Defects:** `High` - a transient supplier RPC failure after role promotion
   could leave a buyer marked `supplier` without a supplier record. `Medium` -
   company names accepted control characters. `Medium` - anonymous action and
   public upgrade links could lose locale. `Medium` - verification workspace
   copy still said payment unlocked supplier tools.
3. **Fix:** Upgrade now checks the existing profile, verifies whether an
   ambiguous RPC response actually created the owned supplier, and rolls a
   failed new buyer upgrade back safely. Company validation rejects control
   characters while allowing international names; action/entry locale and
   one-account copy are consistent. Commits `5b0db58`, `a907c27`, and
   `4b2cbcf`.
4. **Evidence:** FR supplier entry points now target
   `/fr/register?next=%2Ffr%2Fdashboard%2Fprofile`. The RPC requires
   `auth.uid()`, checks supplier role, searches by `owner_id`, and returns the
   existing record on repeats. Database constraints keep company names at
   2-120 characters and default verification to `none`/inactive. Thirteen
   tests, typecheck, and lint passed.
5. **Remaining:** Creating a real supplier would modify production user data,
   so the successful buyer-to-supplier transition and immediate supplier UI
   remain blocked pending a designated test account. Live applied RPC/RLS state
   also remains unverified without callable Supabase project tools.

### Loop 6

1. **Flows and environment:** Reviewed flows 30-34 through listing create,
   update, archive, media upload/replacement, public catalog visibility,
   database constraints, and supplier/storage RLS. Exercised signature, file
   type, file size, and owner-path validation with automated tests.
2. **Defects:** `Medium` - listing actions redirected to English routes and
   lost locale. `Medium` - application validation omitted the database's upper
   bounds, so extreme numeric values could trigger an unnecessary upload before
   a generic database failure. `Medium` - archive reported success when the
   submitted product did not exist or was not owned by the supplier. `Low` -
   forged identifiers were not rejected before query/redirect construction.
3. **Fix:** Listing forms now submit locale; all mutation outcomes use localized
   paths; UUIDs, database-aligned MOQ/pricing limits, and browser limits are
   enforced before upload; archive verifies an owned row before mutation.
   Commit `35ed151`.
4. **Evidence:** Upload validation checks JPEG, PNG, and WebP signatures rather
   than MIME metadata, rejects PDF/empty/over-5MB product images, and writes a
   randomized `user/supplier/products` path. Failed inserts remove the new
   object; replacements remove an old object only after decoding it as the same
   owner's supplier path. Insert/update policies repeat supplier ownership and
   owner-prefix checks, while the public catalog reads only published rows.
   Thirteen tests, typecheck, and lint passed.
5. **Remaining:** A designated supplier account is required to create, replace,
   and archive a real listing. A second account plus callable live Supabase
   policy inspection is required to prove cross-supplier denial against the
   deployed project; migration text alone is not treated as live evidence.
