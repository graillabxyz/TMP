"use client";

import Link from "next/link";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { signOut } from "@/app/actions/auth";

type ProfileDropdownProps = {
  email: string;
  label: string;
  signOutLabel: string;
  signOutHref: string;
  locale: string;
  items: Array<{
    href: string;
    label: string;
  }>;
};

export function ProfileDropdown({
  email,
  label,
  signOutLabel,
  signOutHref,
  locale,
  items,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

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
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-4"
      >
        <UserRound className="size-4 text-gold-200" aria-hidden="true" />
        <span className="hidden sm:inline">{label}</span>
        <ChevronDown
          className={`hidden size-4 transition-transform sm:block ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-lg border border-white/10 bg-charcoal-900 p-2 shadow-premium"
        >
          <p className="truncate px-3 py-2 text-xs text-muted-foreground">
            {email}
          </p>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm text-white transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {item.label}
            </Link>
          ))}
          <div className="my-1 border-t border-white/10" />
          <form action={signOut}>
            <input type="hidden" name="next" value={signOutHref} />
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              role="menuitem"
              className="flex min-h-11 w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <LogOut className="size-4 text-gold-200" aria-hidden="true" />
              {signOutLabel}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
