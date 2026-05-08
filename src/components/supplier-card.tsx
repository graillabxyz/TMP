import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BadgeCheck, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Supplier } from "@/types";

type SupplierCardProps = {
  supplier: Supplier;
};

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <Card className="group overflow-hidden bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-white/[0.055]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={supplier.image}
          alt={`${supplier.name} production preview`}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {supplier.verified && (
          <Badge className="absolute left-4 top-4" variant="success">
            <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
            Verified
          </Badge>
        )}
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gold-200">{supplier.category}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              {supplier.name}
            </h3>
          </div>
          <Link
            href={`/suppliers/${supplier.slug}`}
            aria-label={`View ${supplier.name}`}
            className="rounded-md border border-white/10 p-2 text-muted-foreground transition hover:border-gold-300/40 hover:text-gold-100"
          >
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {supplier.summary}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 text-gold-200" aria-hidden="true" />
          {supplier.city}, {supplier.country}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {supplier.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm">
          <div>
            <p className="text-muted-foreground">MOQ</p>
            <p className="mt-1 font-medium text-white">{supplier.moq}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Response</p>
            <p className="mt-1 font-medium text-white">
              {supplier.responseTime}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
