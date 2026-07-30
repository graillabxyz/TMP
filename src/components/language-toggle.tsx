"use client";

import { usePathname, useSearchParams } from "next/navigation";

import type { Locale } from "@/lib/i18n";
import { getLocaleHref } from "@/lib/locale-navigation";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  locale: Locale;
  label: string;
};

export function LanguageToggle({ locale, label }: LanguageToggleProps) {
  const options = ["en", "fr", "tr"] as const;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <>
      <details className="group relative sm:hidden">
        <summary
          aria-label={`${label}: ${locale.toUpperCase()}`}
          className="inline-flex h-10 min-w-12 cursor-pointer list-none items-center justify-center rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold uppercase text-white transition hover:border-gold-300/35 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden"
        >
          {locale}
        </summary>
        <div
          className="absolute right-0 top-full z-50 mt-2 hidden min-w-28 gap-1 rounded-lg border border-white/10 bg-charcoal-900 p-1.5 shadow-premium group-open:grid"
          aria-label={label}
        >
          {options.map((option) => (
            <a
              key={option}
              href={getLocaleHref(pathname, searchParams, option)}
              className={cn(
                "min-h-9 rounded-md px-3 py-1.5 text-left text-sm font-medium uppercase text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                locale === option && "bg-gold-300 text-charcoal-900",
              )}
              aria-current={locale === option ? "page" : undefined}
            >
              {option}
            </a>
          ))}
        </div>
      </details>
      <nav
        className="hidden grid-cols-3 rounded-md border border-white/10 bg-white/[0.04] p-1 sm:grid"
        aria-label={label}
      >
        {options.map((option) => (
          <a
            key={option}
            href={getLocaleHref(pathname, searchParams, option)}
            className={cn(
              "flex min-h-8 items-center justify-center rounded-sm px-2.5 py-1 text-xs font-medium uppercase text-muted-foreground transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              locale === option && "bg-gold-300 text-charcoal-900",
            )}
            aria-current={locale === option ? "page" : undefined}
          >
            {option}
          </a>
        ))}
      </nav>
    </>
  );
}
