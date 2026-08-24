"use client";

import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  category: string;
  images: string[];
  productTitle: string;
  viewPhotoLabel: string;
};

export function ProductGallery({
  category,
  images,
  productTitle,
  viewPhotoLabel,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? "/brand/tmp-logo.webp";

  return (
    <div>
      <div className="relative aspect-[16/11] overflow-hidden rounded-lg border border-white/10 bg-charcoal-800 shadow-premium">
        <Image
          src={activeImage}
          alt={productTitle}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <Badge className="absolute left-4 top-4 max-w-[calc(100%-2rem)] sm:left-5 sm:top-5 sm:max-w-[calc(100%-2.5rem)]">
          <span className="truncate">{category}</span>
        </Badge>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2" role="list">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${viewPhotoLabel} ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border bg-charcoal-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300",
                index === activeIndex
                  ? "border-gold-300 ring-1 ring-gold-300"
                  : "border-white/10 hover:border-white/30",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
