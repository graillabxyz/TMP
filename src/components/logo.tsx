import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  className?: string;
  href?: string;
};

export function Logo({ compact = false, className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex min-w-0 items-center gap-3", className)}
    >
      <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gold-300/[0.35] bg-gold-300/10 shadow-glow">
        <Image
          src="/brand/tmp-logo.webp"
          alt="TMP logo"
          fill
          sizes="40px"
          className="object-cover"
          priority
        />
      </span>
      {!compact && (
        <span className="flex h-10 min-w-0 flex-col justify-center gap-1 max-[380px]:hidden">
          <span className="text-base font-semibold leading-5 text-white">
            TMP
          </span>
          <span className="whitespace-nowrap text-xs leading-4 text-muted-foreground">
            Turkiye Market Place
          </span>
        </span>
      )}
    </Link>
  );
}
