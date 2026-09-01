import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  iconClassName?: string;
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, iconClassName, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "peer flex h-11 w-full cursor-pointer appearance-none rounded-md border border-input bg-black/20 py-2 pl-3 pr-12 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] transition hover:border-gold-300/35 focus-visible:border-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm [&_option]:bg-charcoal-800 [&_option]:text-white",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition peer-focus-visible:text-gold-200 peer-disabled:opacity-50",
            iconClassName,
          )}
          aria-hidden="true"
        />
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
