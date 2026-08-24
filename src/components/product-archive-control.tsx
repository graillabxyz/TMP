"use client";

import { Archive, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { archiveProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";

type ProductArchiveControlProps = {
  cancelLabel: string;
  confirmLabel: string;
  description: string;
  locale: string;
  productId: string;
  productTitle: string;
  title: string;
  triggerLabel: string;
};

export function ProductArchiveControl({
  cancelLabel,
  confirmLabel,
  description,
  locale,
  productId,
  productTitle,
  title,
  triggerLabel,
}: ProductArchiveControlProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled])',
    );
    focusable?.[0]?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="sm"
        className="h-11 flex-1 md:h-9 md:flex-none"
        onClick={() => setOpen(true)}
      >
        <Archive aria-hidden="true" />
        {triggerLabel}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[80] grid items-end bg-black/75 p-3 backdrop-blur-sm sm:place-items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-product-title"
            aria-describedby="archive-product-description"
            className="w-full max-w-md rounded-lg border border-white/10 bg-charcoal-900 p-5 shadow-premium sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2
                  id="archive-product-title"
                  className="text-lg font-semibold text-white"
                >
                  {title}
                </h2>
                <p className="mt-2 break-words text-sm font-medium text-gold-100">
                  {productTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={cancelLabel}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <p
              id="archive-product-description"
              className="mt-4 text-sm leading-6 text-muted-foreground"
            >
              {description}
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {cancelLabel}
              </Button>
              <form action={archiveProduct}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="id" value={productId} />
                <Button type="submit" variant="destructive" className="w-full">
                  <Archive aria-hidden="true" />
                  {confirmLabel}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
