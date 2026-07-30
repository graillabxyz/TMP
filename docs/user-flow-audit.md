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

1. `QUEUED` Load the homepage from logo, direct URL, and localized URL.
2. `QUEUED` Use desktop and mobile header search; preserve the active locale.
3. `QUEUED` Open, navigate, and naturally close the categories menu by
   selection, outside click, pointer leave, and Escape.
4. `QUEUED` Switch EN/FR/TR from public and dashboard surfaces while preserving
   the current public route and query where appropriate.
5. `QUEUED` Open and close Contact; call and email links use the intended
   administrator details.
6. `QUEUED` Follow primary, buyer-tool, footer, legal, login, join, profile, and
   supplier-upgrade navigation without dead ends or misleading controls.

## Loop 2: Marketplace Discovery

7. `QUEUED` Browse product and supplier indexes with populated results.
8. `QUEUED` Search from the homepage/header and receive the expected product
   results.
9. `QUEUED` Filter products by search, category, and supplier; combine and clear
   filters.
10. `QUEUED` Filter suppliers by search, category, location, verification,
    export market, and capability; combine and clear filters.
11. `QUEUED` Open product details, related products, supplier details, and
    supplier products with correct localized URLs and breadcrumbs.
12. `QUEUED` Start a product-specific or supplier-specific RFQ with trustworthy
    context carried into the request.
13. `QUEUED` Render useful no-results, unavailable-data, and unknown-slug
    states without leaking internal errors.

## Loop 3: Account Entry And Authentication

14. `QUEUED` Register a standard account with email/password and valid profile
    details.
15. `QUEUED` Reject empty, malformed, oversized, weak-password, and duplicate
    registration input without exposing provider details.
16. `QUEUED` Complete email confirmation and land on the intended safe route.
17. `QUEUED` Login with email/password; handle invalid credentials safely.
18. `QUEUED` Start and complete Google OAuth for login and registration.
19. `QUEUED` Preserve valid internal `next` paths and reject external,
    protocol-relative, encoded, and backslash-normalized redirects.
20. `QUEUED` Recover a forgotten password and establish a new session.

## Loop 4: Buyer Account And Session

21. `QUEUED` Anonymous dashboard/profile access redirects to localized login.
22. `QUEUED` An authenticated buyer sees only their profile, email, RFQs, and
    relevant dashboard actions.
23. `QUEUED` Sessions persist across refresh and expire/revoke predictably.
24. `QUEUED` Public and dashboard profile menus open, close, navigate, and sign
    out correctly by pointer and keyboard.
25. `QUEUED` A buyer cannot read or mutate another account's profile, RFQs,
    attachments, supplier, products, or verification documents.

## Loop 5: Supplier Upgrade

26. `QUEUED` A signed-in buyer starts supplier access from Profile with a valid
    business name.
27. `QUEUED` Missing, short, oversized, forged-return, anonymous, and repeated
    supplier-upgrade requests fail safely or remain idempotent.
28. `QUEUED` The upgraded account immediately receives supplier tools without
    receiving a verified badge.
29. `QUEUED` Public and dashboard calls to become a supplier route existing
    accounts to login/Profile rather than creating a second account type.

## Loop 6: Supplier Listings And Media

30. `QUEUED` Create a draft or immediately published listing with valid
    category, description, MOQ, pricing, currency, lead time, and image.
31. `QUEUED` Reject malformed numbers, price inversion, excessive text,
    unsupported currency, missing category/image, spoofed files, and oversized
    uploads.
32. `QUEUED` Edit listing details, replace the image, and clean up only the
    replaced owner-scoped object.
33. `QUEUED` Archive a listing and remove it from public discovery.
34. `QUEUED` A buyer or different supplier cannot create, edit, archive, delete,
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
