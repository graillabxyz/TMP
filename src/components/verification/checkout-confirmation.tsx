"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastNotice } from "@/components/ui/toast-notice";

export function CheckoutConfirmation({
  sessionId,
  labels,
}: {
  sessionId: string;
  labels: {
    pending: string;
    active: string;
    delayed: string;
    error: string;
    dismiss: string;
  };
}) {
  const router = useRouter();
  const [state, setState] = useState<
    "pending" | "active" | "delayed" | "error"
  >("pending");
  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    const controller = new AbortController();
    async function check() {
      try {
        const response = await fetch(
          `/api/stripe/checkout-status?session_id=${encodeURIComponent(sessionId)}`,
          {
            cache: "no-store",
            signal: AbortSignal.any([
              controller.signal,
              AbortSignal.timeout(10000),
            ]),
          },
        );
        if (!response.ok) throw new Error("Confirmation unavailable");
        const result = await response.json();
        if (stopped) return;
        if (result.state === "active") {
          setState("active");
          router.refresh();
          return;
        }
        if (result.state === "expired") {
          setState("error");
          return;
        }
        if (++attempts >= 10) {
          setState("delayed");
          return;
        }
        timer = setTimeout(check, 3000);
      } catch {
        if (!stopped) setState("error");
      }
    }
    void check();
    return () => {
      stopped = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [sessionId, router]);
  return (
    <ToastNotice
      message={labels[state]}
      dismissLabel={labels.dismiss}
      autoDismissMs={state === "active" ? 6000 : 0}
      tone={
        state === "active" ? "success" : state === "error" ? "error" : "info"
      }
    />
  );
}
