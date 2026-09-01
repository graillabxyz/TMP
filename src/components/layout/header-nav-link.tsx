"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type HeaderNavLinkProps = {
  activeClassName: string;
  children: ReactNode;
  className: string;
  href: string;
  matchNested?: boolean;
};

export function HeaderNavLink({
  activeClassName,
  children,
  className,
  href,
  matchNested = true,
}: HeaderNavLinkProps) {
  const pathname = usePathname();
  const active =
    pathname === href || (matchNested && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      className={cn(className, active && activeClassName)}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
