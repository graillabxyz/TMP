import { BadgeCheck, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type OnboardingIntroProps = {
  body: string;
  eyebrow: string;
  items: Array<{
    body: string;
    label: string;
  }>;
  title: string;
};

export function OnboardingIntro({
  body,
  eyebrow,
  items,
  title,
}: OnboardingIntroProps) {
  return (
    <div className="max-w-xl lg:py-4">
      <Badge>
        <BadgeCheck className="mr-1 size-3" aria-hidden="true" />
        {eyebrow}
      </Badge>
      <h1 className="mt-5 max-w-lg text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[2.5rem]">
        {title}
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
        {body}
      </p>
      <div className="mt-7 hidden gap-4 lg:grid">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0"
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-300/15 text-gold-100">
              <Check className="size-3" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-medium text-white">
                {item.label}
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                {item.body}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
