import Link from "next/link";
import type { Metadata } from "next";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionary";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <main className="min-h-screen bg-surface-radial">
      <div className="container flex min-h-screen flex-col">
        <header className="flex items-center justify-between py-6">
          <Logo />
          <Button asChild variant="ghost">
            <Link href="/">{t.nav.backHome}</Link>
          </Button>
        </header>
        <div className="flex flex-1 items-center justify-center py-10">
          {children}
        </div>
      </div>
    </main>
  );
}
