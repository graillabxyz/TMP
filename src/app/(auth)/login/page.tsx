import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Login | TMP",
  description: "Access your TMP buyer or supplier workspace.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <div className="w-full max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm text-gold-200">Welcome back</p>
          <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
            Continue sourcing with a clearer supplier pipeline.
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Buyers manage RFQs and saved suppliers. Suppliers track profile
            readiness, inbound requests, and verification progress.
          </p>
        </div>
        <Card className="bg-white/[0.035]">
          <CardContent className="p-6 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Buyer login", icon: ShoppingBag },
                { label: "Supplier login", icon: Building2 },
              ].map((path) => {
                const Icon = path.icon;

                return (
                  <button
                    type="button"
                    key={path.label}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-left text-sm text-white transition hover:border-gold-300/[0.35] hover:bg-white/[0.055]"
                  >
                    <Icon className="size-5 text-gold-100" aria-hidden="true" />
                    {path.label}
                  </button>
                );
              })}
            </div>

            <form className="mt-8 grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button type="button" size="lg">
                Login
                <ArrowRight aria-hidden="true" />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              New to TMP?{" "}
              <Link href="/register" className="text-gold-100 hover:text-white">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
