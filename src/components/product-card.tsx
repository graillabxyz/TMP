import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Clock3, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPriceRange } from "@/lib/products";
import type { MarketplaceProduct } from "@/types";

type ProductCardProps = {
  product: MarketplaceProduct;
  labels: {
    verified: string;
    moq: string;
    price: string;
    leadTime: string;
    viewProduct: string;
    quote: string;
  };
};

export function ProductCard({ product, labels }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-gold-300/30 hover:bg-white/[0.055]">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-800">
          <Image
            src={product.images[0] ?? "/brand/tmp-logo.webp"}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <Badge className="absolute left-4 top-4" variant="secondary">
            {product.category}
          </Badge>
        </div>
      </Link>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-gold-200">{product.supplierName}</p>
            <h3 className="mt-2 line-clamp-2 min-h-12 text-lg font-semibold leading-6 text-white">
              {product.title}
            </h3>
          </div>
          <Link
            href={`/products/${product.slug}`}
            aria-label={`${labels.viewProduct}: ${product.title}`}
            className="shrink-0 rounded-md border border-white/10 p-2 text-muted-foreground transition hover:border-gold-300/40 hover:text-gold-100"
          >
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>

        {product.supplierVerified && (
          <Badge className="mt-4" variant="success">
            <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
            {labels.verified}
          </Badge>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm">
          <div>
            <p className="text-muted-foreground">{labels.moq}</p>
            <p className="mt-1 font-medium text-white">
              {product.moq ? `${product.moq} units` : "On request"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">{labels.price}</p>
            <p className="mt-1 font-medium text-white">
              {formatPriceRange(product, labels.quote)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          {product.leadTime ? (
            <Clock3 className="size-4 text-gold-200" aria-hidden="true" />
          ) : (
            <Package className="size-4 text-gold-200" aria-hidden="true" />
          )}
          {product.leadTime ?? labels.leadTime}
        </div>
      </CardContent>
    </Card>
  );
}
