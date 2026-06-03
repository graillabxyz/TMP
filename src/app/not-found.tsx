import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found | TMP",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-radial px-6">
      <div className="max-w-md text-center">
        <p className="text-sm text-gold-200">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          This route is still being sourced.
        </h1>
        <p className="mt-4 text-muted-foreground">
          The page may have moved, or it is waiting for the next marketplace
          sprint.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </main>
  );
}
