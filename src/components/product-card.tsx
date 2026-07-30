import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPriceRange } from "@/lib/products";
import type { MarketplaceProduct } from "@/types";

type ProductCardProps = {
  product: MarketplaceProduct;
  productHref: string;
  rfqHref: string;
  labels: {
    verified: string;
    moq: string;
    price: string;
    leadTime: string;
    viewProduct: string;
    quote: string;
    requestQuote: string;
    units: string;
    onRequest: string;
  };
};

export function ProductCard({
  product,
  productHref,
  rfqHref,
  labels,
}: ProductCardProps) {
  const price = formatPriceRange(product, labels.quote);
  const moq = product.moq ? `${product.moq} ${labels.units}` : labels.onRequest;

  return (
    <Card className="group overflow-hidden bg-white/[0.03] transition duration-300 focus-within:border-gold-300/45 hover:-translate-y-0.5 hover:border-gold-300/30 hover:bg-white/[0.05]">
      <Link
        href={productHref}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-800">
          <Image
            src={product.images[0] ?? "/brand/tmp-logo.webp"}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <Badge className="absolute left-3 top-3" variant="secondary">
            {product.category}
          </Badge>
          {product.supplierVerified && (
            <Badge className="absolute right-3 top-3" variant="success">
              <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
              {labels.verified}
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4 sm:p-4">
        <p className="line-clamp-1 text-xs text-gold-200">
          {product.supplierName}
        </p>
        <h3 className="mt-1.5 min-h-11 text-base font-semibold leading-[1.4] text-white">
          <Link
            href={productHref}
            className="line-clamp-2 rounded-sm underline-offset-4 transition hover:text-gold-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {product.title}
          </Link>
        </h3>

        <p className="mt-3 text-xs text-muted-foreground">{labels.price}</p>
        <p className="mt-0.5 text-xl font-semibold text-gold-100">{price}</p>

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-3 text-xs">
          <div>
            <p className="text-muted-foreground">{labels.moq}</p>
            <p className="mt-1 truncate font-medium text-white">{moq}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{labels.leadTime}</p>
            <p className="mt-1 truncate font-medium text-white">
              {product.leadTime ?? labels.onRequest}
            </p>
          </div>
        </div>

        <Button asChild className="mt-4 w-full" size="sm">
          <Link
            href={{
              pathname: rfqHref,
              query: {
                product: product.slug,
                supplier: product.supplierSlug,
              },
            }}
          >
            {labels.requestQuote}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
