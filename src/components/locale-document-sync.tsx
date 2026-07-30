"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function LocaleDocumentSync() {
  const pathname = usePathname();

  useEffect(() => {
    const localeSegment = pathname.split("/")[1];
    const locale =
      localeSegment === "fr" || localeSegment === "tr" ? localeSegment : "en";

    document.documentElement.lang = locale;
  }, [pathname]);

  return null;
}
