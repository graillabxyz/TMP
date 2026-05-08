export const siteConfig = {
  name: "TMP",
  fullName: "Turkiye Market Place",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "A premium B2B sourcing marketplace connecting European buyers with verified Turkish suppliers.",
  nav: [
    { label: "Suppliers", href: "/suppliers" },
    { label: "RFQ", href: "/rfq" },
    { label: "Dashboard", href: "/dashboard" },
  ],
};
