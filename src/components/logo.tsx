import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export function Logo({ compact = false, className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <span className="relative flex size-10 items-center justify-center rounded-lg border border-gold-300/[0.35] bg-gold-300/10 shadow-glow">
        <span className="absolute size-5 rotate-45 rounded-sm border border-gold-200/80" />
        <span className="absolute size-2 rounded-sm bg-gold-200" />
        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-white" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-base font-semibold text-white">TMP</span>
          <span className="mt-1 text-xs text-muted-foreground">
            Turkiye Market Place
          </span>
        </span>
      )}
    </Link>
  );
}
