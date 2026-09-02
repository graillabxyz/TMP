"use client";

import { Archive, LoaderCircle, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type ProductMutationSubmitProps = {
  action: "archive" | "delete";
  label: string;
};

export function ProductMutationSubmit({
  action,
  label,
}: ProductMutationSubmitProps) {
  const { pending } = useFormStatus();
  const Icon = action === "delete" ? Trash2 : Archive;

  return (
    <Button
      type="submit"
      variant={action === "delete" ? "destructive" : "default"}
      className="w-full"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : (
        <Icon aria-hidden="true" />
      )}
      {label}
    </Button>
  );
}
