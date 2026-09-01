"use client";

import Link from "next/link";
import {
  Archive,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { archiveProduct, deleteProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";

type ConfirmAction = "archive" | "delete";

type ProductRowActionsProps = {
  archiveBody: string;
  archiveConfirmLabel: string;
  archiveLabel: string;
  archiveTitle: string;
  cancelLabel: string;
  deleteBody: string;
  deleteConfirmLabel: string;
  deleteLabel: string;
  deleteTitle: string;
  editHref: string;
  editLabel: string;
  locale: string;
  menuLabel: string;
  productId: string;
  productTitle: string;
  status: string;
  viewHref: string | null;
  viewLabel: string;
};

export function ProductRowActions({
  archiveBody,
  archiveConfirmLabel,
  archiveLabel,
  archiveTitle,
  cancelLabel,
  deleteBody,
  deleteConfirmLabel,
  deleteLabel,
  deleteTitle,
  editHref,
  editLabel,
  locale,
  menuLabel,
  productId,
  productTitle,
  status,
  viewHref,
  viewLabel,
}: ProductRowActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function closeMenu(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }

    function closeMenuWithKeyboard(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuTriggerRef.current?.focus();
    }

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeMenuWithKeyboard);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenuWithKeyboard);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!confirmAction) return;

    const previousOverflow = document.body.style.overflow;
    const menuTrigger = menuTriggerRef.current;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      "button:not([disabled]), [href], input:not([disabled])",
    );
    focusable?.[0]?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setConfirmAction(null);
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
      menuTrigger?.focus();
    };
  }, [confirmAction]);

  const isDelete = confirmAction === "delete";
  const ConfirmIcon = isDelete ? Trash2 : Archive;
  const title = isDelete ? deleteTitle : archiveTitle;
  const description = isDelete ? deleteBody : archiveBody;
  const confirmLabel = isDelete ? deleteConfirmLabel : archiveConfirmLabel;
  const formAction = isDelete ? deleteProduct : archiveProduct;

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-11 flex-1 md:h-9 md:flex-none"
        >
          <Link href={editHref}>
            <Pencil aria-hidden="true" />
            {editLabel}
          </Link>
        </Button>
        <div ref={menuRef} className="relative">
          <Button
            ref={menuTriggerRef}
            type="button"
            size="icon"
            variant="ghost"
            className="size-11 md:size-9"
            aria-label={menuLabel}
            title={menuLabel}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MoreHorizontal aria-hidden="true" />
          </Button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute bottom-full right-0 z-[60] mb-2 w-52 rounded-md border border-white/[0.12] bg-charcoal-800 p-1.5 shadow-premium"
            >
              {viewHref && (
                <Link
                  href={viewHref}
                  role="menuitem"
                  target="_blank"
                  className="flex min-h-10 items-center gap-2.5 rounded px-3 py-2 text-sm text-white transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  {viewLabel}
                </Link>
              )}
              {status !== "archived" && (
                <button
                  type="button"
                  role="menuitem"
                  className="flex min-h-10 w-full items-center gap-2.5 rounded px-3 py-2 text-left text-sm text-white transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmAction("archive");
                  }}
                >
                  <Archive className="size-4" aria-hidden="true" />
                  {archiveLabel}
                </button>
              )}
              <button
                type="button"
                role="menuitem"
                className="flex min-h-10 w-full items-center gap-2.5 rounded px-3 py-2 text-left text-sm text-red-200 transition hover:bg-red-500/10 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmAction("delete");
                }}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                {deleteLabel}
              </button>
            </div>
          )}
        </div>
      </div>

      {confirmAction && (
        <div
          className="fixed inset-0 z-[80] grid items-end bg-black/75 p-3 backdrop-blur-sm sm:place-items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setConfirmAction(null);
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-action-title"
            aria-describedby="product-action-description"
            className="w-full max-w-md rounded-lg border border-white/[0.12] bg-charcoal-800 p-5 shadow-premium sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2
                  id="product-action-title"
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
                onClick={() => setConfirmAction(null)}
                className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={cancelLabel}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <p
              id="product-action-description"
              className="mt-4 text-sm leading-6 text-muted-foreground"
            >
              {description}
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmAction(null)}
              >
                {cancelLabel}
              </Button>
              <form action={formAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="id" value={productId} />
                <Button type="submit" variant="destructive" className="w-full">
                  <ConfirmIcon aria-hidden="true" />
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
