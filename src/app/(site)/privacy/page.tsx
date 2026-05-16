import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy | TMP",
  description:
    "Privacy policy for TMP, a B2B sourcing marketplace connecting European buyers with Turkish suppliers.",
  path: "/privacy",
});

const sections = [
  {
    title: "Information We Collect",
    body: "TMP may collect account details, company information, RFQ submissions, supplier profile content, product listings, verification materials, contact details, and basic usage data needed to operate the marketplace.",
  },
  {
    title: "How We Use Information",
    body: "We use information to provide marketplace access, route RFQs, manage supplier listings, support verification workflows, improve the product, prevent abuse, and communicate service updates.",
  },
  {
    title: "Authentication",
    body: "TMP uses Supabase Auth and may offer Google sign-in. When you authenticate with Google, we receive the account information required to create or access your TMP profile, such as email address and basic profile details.",
  },
  {
    title: "Suppliers And Buyers",
    body: "Published supplier and product information may be visible publicly. RFQs and verification documents are intended to remain private and are protected by database access controls.",
  },
  {
    title: "Service Providers",
    body: "We use third-party providers such as Supabase, Vercel, Google, and future payment providers to host, authenticate, secure, analyze, and operate the service.",
  },
  {
    title: "Data Retention",
    body: "We keep information while it is needed for marketplace operations, legal requirements, security, and legitimate business purposes. Users may request updates or deletion where applicable.",
  },
  {
    title: "Contact",
    body: "For privacy questions or data requests, contact the TMP team through the official marketplace contact channel. A dedicated privacy inbox may be added as the company setup matures.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="section-shell">
      <div className="mx-auto max-w-4xl">
        <Badge>Privacy</Badge>
        <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          Last updated: May 16, 2026. This policy explains how TMP handles
          information while building a trusted B2B sourcing marketplace.
        </p>

        <div className="mt-10 grid gap-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
            >
              <h2 className="text-lg font-semibold text-white">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
