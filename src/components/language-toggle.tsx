"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/lib/i18n";
import { getLocaleHref } from "@/lib/locale-navigation";
import { focusMenuEdge, handleMenuKeyDown } from "@/lib/menu-keyboard";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  locale: Locale;
  label: string;
};

export function LanguageToggle({ locale, label }: LanguageToggleProps) {
  const options = ["en", "fr", "tr"] as const;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <div ref={rootRef} className="relative sm:hidden">
        <button
          ref={triggerRef}
          type="button"
          aria-label={`${label}: ${locale.toUpperCase()}`}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            event.preventDefault();
            setOpen(true);
            focusMenuEdge(
              menuRef,
              event.key === "ArrowDown" ? "first" : "last",
            );
          }}
          className="inline-flex h-11 min-w-14 items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold uppercase text-white transition hover:border-gold-300/35 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {locale}
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>
        {open && (
          <div
            ref={menuRef}
            role="menu"
            onKeyDown={(event) =>
              handleMenuKeyDown(event, () => {
                setOpen(false);
                triggerRef.current?.focus();
              })
            }
            className="absolute right-0 top-full z-50 mt-2 grid w-[min(8rem,calc(100vw-1.5rem))] gap-1 rounded-lg border border-white/[0.12] bg-charcoal-800 p-1.5 shadow-premium"
            aria-label={label}
          >
            {options.map((option) => (
              <a
                key={option}
                href={getLocaleHref(pathname, searchParams, option)}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-11 items-center rounded-md px-3 text-left text-sm font-medium uppercase text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  locale === option && "bg-gold-300 text-charcoal-900",
                )}
                aria-current={locale === option ? "page" : undefined}
              >
                {option}
              </a>
            ))}
          </div>
        )}
      </div>
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
