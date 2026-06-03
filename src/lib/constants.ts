import { getAppOrigin } from "@/lib/app-url";

export const siteConfig = {
  name: "TMP",
  fullName: "Turkiye Market Place",
  url: getAppOrigin(),
  description:
    "A premium B2B sourcing marketplace connecting European buyers with verified Turkish suppliers.",
  nav: [
    { label: "Suppliers", href: "/suppliers" },
    { label: "RFQ", href: "/rfq" },
    { label: "Dashboard", href: "/dashboard" },
  ],
};
