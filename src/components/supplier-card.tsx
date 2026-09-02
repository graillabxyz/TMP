import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Supplier } from "@/types";

type SupplierCardProps = {
  supplier: Supplier;
  supplierHref: string;
  labels: {
    verified: string;
    moq: string;
    response: string;
    viewSupplier: string;
    imageAlt: string;
  };
};

export function SupplierCard({
  supplier,
  supplierHref,
  labels,
}: SupplierCardProps) {
  return (
    <Card className="group overflow-hidden transition duration-300 focus-within:border-gold-300/45 hover:-translate-y-0.5 hover:border-gold-300/30 hover:bg-secondary/90">
      <Link
        href={supplierHref}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        aria-label={`${labels.viewSupplier}: ${supplier.name}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={supplier.image}
            alt={labels.imageAlt.replace("{supplier}", supplier.name)}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {supplier.verified && (
            <Badge className="absolute left-3 top-3" variant="success">
              <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
              {labels.verified}
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-1 text-xs text-gold-200">
              {supplier.category}
            </p>
            <h3 className="mt-1.5 min-h-11 break-words text-base font-semibold leading-[1.4] text-white">
              <Link
                href={supplierHref}
                className="rounded-sm underline-offset-4 transition hover:text-gold-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {supplier.name}
              </Link>
            </h3>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
          {supplier.summary}
        </p>
        <div className="mt-3 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <MapPin
            className="size-4 shrink-0 text-gold-200"
            aria-hidden="true"
          />
          <span className="truncate">
            {supplier.city}, {supplier.country}
          </span>
        </div>
        <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">
          {supplier.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} className="max-w-full" variant="secondary">
              <span className="truncate">{tag}</span>
            </Badge>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-3 text-xs">
          <div>
            <p className="text-muted-foreground">{labels.moq}</p>
            <p className="mt-1 line-clamp-2 font-medium text-white">
              {supplier.moq}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">{labels.response}</p>
            <p className="mt-1 line-clamp-2 font-medium text-white">
              {supplier.responseTime}
            </p>
          </div>
        </div>
        <Button asChild className="mt-4 w-full" variant="outline">
          <Link href={supplierHref}>
            {labels.viewSupplier}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
