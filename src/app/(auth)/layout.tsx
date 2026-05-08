import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-surface-radial">
      <div className="container flex min-h-screen flex-col">
        <header className="flex items-center justify-between py-6">
          <Logo />
          <Button asChild variant="ghost">
            <Link href="/">Back home</Link>
          </Button>
        </header>
        <div className="flex flex-1 items-center justify-center py-10">
          {children}
        </div>
      </div>
    </main>
  );
}
