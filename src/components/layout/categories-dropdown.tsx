"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { focusMenuEdge, handleMenuKeyDown } from "@/lib/menu-keyboard";
import type { Category } from "@/types";

type CategoriesDropdownProps = {
  baseHref: string;
  categories: Category[];
  label: string;
};

const CLOSE_DELAY_MS = 450;

export function CategoriesDropdown({
  baseHref,
  categories,
  label,
}: CategoriesDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function closeSoon() {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => clearCloseTimer, []);

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={clearCloseTimer}
      onPointerLeave={closeSoon}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          clearCloseTimer();
          setOpen((current) => !current);
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          clearCloseTimer();
          setOpen(true);
          focusMenuEdge(menuRef, event.key === "ArrowDown" ? "first" : "last");
        }}
        className="inline-flex cursor-pointer list-none items-center rounded-md px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.07] hover:text-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {label}
      </button>
      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          onKeyDown={(event) =>
            handleMenuKeyDown(event, () => {
              clearCloseTimer();
              setOpen(false);
              triggerRef.current?.focus();
            })
          }
          className="absolute left-0 top-full z-50 mt-2 w-[min(340px,calc(100vw-1.5rem))] rounded-lg border border-white/[0.12] bg-charcoal-800 shadow-premium"
        >
          <div className="grid max-h-[min(70dvh,36rem)] gap-1 overflow-y-auto overscroll-contain p-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`${baseHref}?category=${category.slug}`}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="group/item grid gap-1 rounded-md px-3 py-2.5 transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex items-center justify-between gap-3 text-sm font-medium text-white">
                  {category.name}
                  <ArrowRight
                    className="size-4 shrink-0 text-gold-200 opacity-0 transition group-hover/item:opacity-100 group-focus-visible/item:opacity-100"
                    aria-hidden="true"
                  />
                </span>
                <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {category.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
