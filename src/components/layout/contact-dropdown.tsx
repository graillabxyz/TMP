"use client";

import { Mail, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type ContactDropdownProps = {
  labels: {
    contact: string;
    title: string;
    body: string;
    call: string;
    email: string;
    close: string;
  };
};

const ADMIN_PHONE_DISPLAY = "06 83 02 47 52";
const ADMIN_PHONE_HREF = "tel:+33683024752";
const ADMIN_EMAIL = "o.biyik@outlook.fr";

export function ContactDropdown({ labels }: ContactDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "inline-flex size-11 items-center justify-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background xl:w-auto xl:px-3",
          isOpen && "bg-white/[0.08] text-white",
        )}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={labels.contact}
        title={labels.contact}
        onClick={() => setIsOpen((open) => !open)}
      >
        <Phone className="size-4 text-gold-200" aria-hidden="true" />
        <span className="hidden xl:inline">{labels.contact}</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={labels.title}
          className="fixed left-3 right-3 top-[4.5rem] z-50 overflow-hidden rounded-lg border border-white/[0.12] bg-charcoal-800 shadow-premium sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80"
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3.5">
            <div>
              <p className="font-semibold text-white">{labels.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {labels.body}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={labels.close}
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid gap-1 p-2">
            <a
              href={ADMIN_PHONE_HREF}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-gold-300/10 text-gold-200">
                <Phone className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">
                  {labels.call}
                </span>
                <span className="block font-medium text-white">
                  {ADMIN_PHONE_DISPLAY}
                </span>
              </span>
            </a>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 transition hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-gold-300/10 text-gold-200">
                <Mail className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">
                  {labels.email}
                </span>
                <span className="block truncate font-medium text-white">
                  {ADMIN_EMAIL}
                </span>
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
