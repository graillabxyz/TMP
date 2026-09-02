import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPriceRange } from "@/lib/products";
import type { MarketplaceProduct } from "@/types";

type ProductCardProps = {
  product: MarketplaceProduct;
  productHref: string;
  rfqHref: string;
  headingLevel?: "h2" | "h3";
  labels: {
    verified: string;
    moq: string;
    price: string;
    leadTime: string;
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
  headingLevel = "h3",
  labels,
}: ProductCardProps) {
  const price = formatPriceRange(product, labels.quote);
  const moq = product.moq ? `${product.moq} ${labels.units}` : labels.onRequest;
  const Heading = headingLevel;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition duration-300 focus-within:border-gold-300/45 hover:-translate-y-0.5 hover:border-gold-300/30 hover:bg-secondary/90">
      <Link
        href={productHref}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
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
          <Badge
            className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)]"
            variant="secondary"
          >
            <span className="truncate">{product.category}</span>
          </Badge>
        </div>
      </Link>
      <CardContent className="flex flex-1 flex-col p-5 pb-4">
        <div className="min-h-14">
          <p className="line-clamp-1 text-xs text-gold-200">
            {product.supplierName}
          </p>
          {product.supplierVerified && (
            <Badge className="mt-2 max-w-full" variant="success">
              <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
              <span className="truncate">{labels.verified}</span>
            </Badge>
          )}
        </div>
        <Heading className="mt-2 min-h-11 break-words text-base font-semibold leading-[1.4] text-white">
          <Link
            href={productHref}
            className="line-clamp-2 min-h-11 rounded-sm underline-offset-4 transition hover:text-gold-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {product.title}
          </Link>
        </Heading>

        <p className="mt-3 text-xs text-muted-foreground">{labels.price}</p>
        <p className="mt-0.5 break-words text-xl font-semibold text-gold-100">
          {price}
        </p>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="mt-auto block p-5 pt-0">
        <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
          <div>
            <p className="text-muted-foreground">{labels.moq}</p>
            <p className="mt-1 line-clamp-2 font-medium text-white">{moq}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{labels.leadTime}</p>
            <p className="mt-1 line-clamp-2 font-medium text-white">
              {product.leadTime ?? labels.onRequest}
            </p>
          </div>
        </div>

        <Button asChild className="mt-4 w-full">
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
      </CardFooter>
    </Card>
  );
}
