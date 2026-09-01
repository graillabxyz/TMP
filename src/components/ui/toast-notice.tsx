"use client";

import * as React from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "warning" | "info";

type ToastNoticeProps = {
  message: React.ReactNode;
  dismissLabel: string;
  tone?: ToastTone;
  autoDismissMs?: number;
  className?: string;
  onDismiss?: () => void;
};

const toneStyles: Record<ToastTone, string> = {
  success: "border-emerald-400/35 text-emerald-50",
  error: "border-red-400/40 text-red-100",
  warning: "border-gold-300/40 text-gold-50",
  info: "border-white/[0.14] text-white",
};

const iconStyles: Record<ToastTone, string> = {
  success: "text-emerald-300",
  error: "text-red-300",
  warning: "text-gold-200",
  info: "text-gold-200",
};

const toneIcons = {
  success: CheckCircle2,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
};

export const ToastNotice = React.forwardRef<HTMLDivElement, ToastNoticeProps>(
  (
    {
      message,
      dismissLabel,
      tone = "info",
      autoDismissMs,
      className,
      onDismiss,
    },
    ref,
  ) => {
    const [visible, setVisible] = React.useState(Boolean(message));
    const Icon = toneIcons[tone];
    const dismissAfter =
      autoDismissMs ?? (tone === "error" ? 0 : tone === "warning" ? 8000 : 6000);

    React.useEffect(() => {
      setVisible(Boolean(message));
    }, [message]);

    React.useEffect(() => {
      if (!visible || dismissAfter <= 0) return;

      const timer = window.setTimeout(() => setVisible(false), dismissAfter);
      return () => window.clearTimeout(timer);
    }, [dismissAfter, visible]);

    if (!visible || !message) return null;

    return (
      <div className="pointer-events-none fixed right-3 top-3 z-[100] w-[calc(100%-1.5rem)] max-w-sm sm:right-5 sm:top-5">
        <div
          ref={ref}
          role={tone === "error" ? "alert" : "status"}
          aria-live={tone === "error" ? "assertive" : "polite"}
          tabIndex={-1}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-lg border bg-charcoal-800/95 p-4 text-sm shadow-[0_18px_48px_rgba(0,0,0,0.3)] outline-none backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 focus-visible:ring-2 focus-visible:ring-ring",
            toneStyles[tone],
            className,
          )}
        >
          <Icon
            className={cn("mt-0.5 size-5 shrink-0", iconStyles[tone])}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1 font-medium leading-5">{message}</div>
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              onDismiss?.();
            }}
            className="-mr-2 -mt-2 flex size-10 shrink-0 items-center justify-center rounded-md text-current opacity-65 transition hover:bg-white/[0.08] hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={dismissLabel}
            title={dismissLabel}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  },
);

ToastNotice.displayName = "ToastNotice";
