"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderSearchProps = {
  action: string;
  label: string;
  placeholder: string;
  submitLabel: string;
  variant: "desktop" | "mobile";
};

function isLocalizedHome(pathname: string) {
  return pathname === "/" || pathname === "/fr" || pathname === "/tr";
}

export function HeaderSearch({
  action,
  label,
  placeholder,
  submitLabel,
  variant,
}: HeaderSearchProps) {
  const pathname = usePathname();
  const onHomePage = isLocalizedHome(pathname);
  const [heroSearchVisible, setHeroSearchVisible] = useState(onHomePage);

  useEffect(() => {
    if (!onHomePage) {
      setHeroSearchVisible(false);
      return;
    }

    const heroSearch = document.getElementById("marketplace-hero-search");

    if (!heroSearch) {
      setHeroSearchVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setHeroSearchVisible(entry.isIntersecting),
      {
        rootMargin: "-76px 0px 0px 0px",
        threshold: 0,
      },
    );

    observer.observe(heroSearch);
    return () => observer.disconnect();
  }, [onHomePage]);

  const showHeaderSearch = !onHomePage || !heroSearchVisible;

  if (variant === "desktop") {
    return (
      <div className="hidden min-w-0 max-w-[640px] flex-1 lg:block">
        <form
          action={action}
          aria-hidden={!showHeaderSearch}
          inert={!showHeaderSearch}
          className={cn(
            "flex h-10 min-w-0 items-center overflow-hidden rounded-md border border-white/[0.12] bg-white/[0.065] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 focus-within:border-gold-300/50 focus-within:bg-white/[0.105]",
            showHeaderSearch
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-1 opacity-0",
          )}
        >
          <Search
            className="ml-3 size-4 shrink-0 text-gold-200"
            aria-hidden="true"
          />
          <input
            name="q"
            aria-label={label}
            placeholder={placeholder}
            className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" className="m-1 h-8 rounded-md px-4 text-sm">
            {submitLabel}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "container grid transition-[grid-template-rows,opacity,padding] duration-300 lg:hidden",
        showHeaderSearch
          ? "grid-rows-[1fr] pb-1.5 opacity-100"
          : "grid-rows-[0fr] pb-0 opacity-0",
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <form
          action={action}
          aria-hidden={!showHeaderSearch}
          inert={!showHeaderSearch}
          className="flex h-11 min-w-0 items-center overflow-hidden rounded-md border border-white/15 bg-white/[0.075] text-white shadow-none transition focus-within:border-gold-300/50 focus-within:bg-white/[0.11]"
        >
          <Search
            className="ml-3 size-4 shrink-0 text-gold-200"
            aria-hidden="true"
          />
          <input
            name="q"
            aria-label={label}
            placeholder={placeholder}
            className="h-11 min-w-0 flex-1 bg-transparent px-3 text-base text-white outline-none placeholder:text-muted-foreground sm:text-sm"
          />
          <Button
            type="submit"
            aria-label={label}
            className="m-0.5 size-8 shrink-0 rounded-md p-0"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </form>
      </div>
    </div>
  );
}
