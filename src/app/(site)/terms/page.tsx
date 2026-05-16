import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service | TMP",
  description:
    "Terms of service for TMP, a B2B sourcing marketplace for European buyers and Turkish suppliers.",
  path: "/terms",
});

const sections = [
  {
    title: "Marketplace Role",
    body: "TMP provides a digital marketplace for sourcing discovery, RFQ submission, supplier profiles, and product listings. TMP is not automatically a party to buyer-supplier transactions unless a separate written agreement says otherwise.",
  },
  {
    title: "Accounts",
    body: "Users are responsible for accurate account information, authorized access to their company profile, and keeping login credentials secure. Buyer and supplier access may differ based on role and verification status.",
  },
  {
    title: "Supplier Listings",
    body: "Suppliers are responsible for keeping product listings, company details, certifications, pricing ranges, lead times, and minimum order quantities accurate and lawful.",
  },
  {
    title: "RFQs",
    body: "Buyers are responsible for submitting accurate sourcing requirements. RFQ responses, pricing, samples, contracts, logistics, customs, and payments are handled between the buyer and supplier unless TMP later offers managed services.",
  },
  {
    title: "Verification",
    body: "Verification features are designed to increase buyer trust, but they do not guarantee supplier performance, product quality, regulatory compliance, or transaction outcomes. Final verification decisions remain subject to TMP review.",
  },
  {
    title: "Acceptable Use",
    body: "Users may not submit fraudulent, illegal, infringing, abusive, misleading, or harmful content, and may not attempt to bypass marketplace security, Row Level Security, or access controls.",
  },
  {
    title: "Changes",
    body: "TMP may update these terms as the marketplace evolves. Continued use of the service after updates means the user accepts the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <section className="section-shell">
      <div className="mx-auto max-w-4xl">
        <Badge>Terms</Badge>
        <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          Last updated: May 16, 2026. These terms outline the baseline rules for
          using TMP during the marketplace MVP and validation phase.
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
