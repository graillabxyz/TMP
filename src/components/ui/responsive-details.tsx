"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ResponsiveDetailsProps = React.DetailsHTMLAttributes<HTMLDetailsElement>;

export function ResponsiveDetails({
  children,
  className,
  ...props
}: ResponsiveDetailsProps) {
  const detailsRef = React.useRef<HTMLDetailsElement>(null);

  React.useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const syncOpenState = () => {
      if (detailsRef.current) {
        detailsRef.current.open = media.matches;
      }
    };

    syncOpenState();
    media.addEventListener("change", syncOpenState);

    return () => media.removeEventListener("change", syncOpenState);
  }, []);

  return (
    <details ref={detailsRef} className={cn(className)} {...props}>
      {children}
    </details>
  );
}
