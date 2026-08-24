"use client";

import { CheckCircle2, FileUp } from "lucide-react";
import { useState } from "react";

type RfqAttachmentFieldProps = {
  help: string;
  label: string;
  selectedLabel: string;
};

export function RfqAttachmentField({
  help,
  label,
  selectedLabel,
}: RfqAttachmentFieldProps) {
  const [fileName, setFileName] = useState("");

  return (
    <label
      htmlFor="attachment"
      className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gold-300/30 bg-gold-300/[0.04] px-5 py-5 text-center transition focus-within:border-gold-300/60 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background hover:border-gold-300/50 hover:bg-gold-300/[0.07]"
    >
      <FileUp className="size-6 text-gold-100" aria-hidden="true" />
      <span className="mt-3 text-sm font-medium text-white">{label}</span>
      <span className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
        {help}
      </span>
      <input
        id="attachment"
        name="attachment"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        className="sr-only"
        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
      />
      {fileName && (
        <span
          className="mt-3 inline-flex max-w-full items-center gap-2 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100"
          aria-live="polite"
        >
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 truncate">
            {selectedLabel}: {fileName}
          </span>
        </span>
      )}
    </label>
  );
}
