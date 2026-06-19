"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => {
          clearCloseTimer();
          setOpen((current) => !current);
        }}
        className="inline-flex cursor-pointer list-none items-center rounded-md px-3 py-2 text-sm font-medium text-gold-50 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {label}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-[340px] overflow-hidden rounded-lg border border-white/10 bg-charcoal-900 shadow-premium"
        >
          <div className="grid max-h-[70vh] gap-1 overflow-y-auto p-2">
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
                    className="size-4 text-gold-200 opacity-0 transition group-hover/item:opacity-100"
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
