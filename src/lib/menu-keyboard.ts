import type { KeyboardEvent, RefObject } from "react";

type MenuEdge = "first" | "last";

function getMenuItems(menu: HTMLElement | null) {
  return Array.from(
    menu?.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([aria-disabled="true"])',
    ) ?? [],
  );
}

export function focusMenuEdge(
  menuRef: RefObject<HTMLElement | null>,
  edge: MenuEdge,
) {
  window.requestAnimationFrame(() => {
    const items = getMenuItems(menuRef.current);
    const item = edge === "first" ? items[0] : items.at(-1);
    item?.focus();
  });
}

export function handleMenuKeyDown(
  event: KeyboardEvent<HTMLElement>,
  onClose: () => void,
) {
  const items = getMenuItems(event.currentTarget);
  if (!items.length) return;

  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    onClose();
    return;
  }

  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  const currentIndex = items.indexOf(document.activeElement as HTMLElement);
  const nextIndex =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : event.key === "ArrowDown"
          ? currentIndex < 0 || currentIndex === items.length - 1
            ? 0
            : currentIndex + 1
          : currentIndex <= 0
            ? items.length - 1
            : currentIndex - 1;

  items[nextIndex]?.focus();
}
