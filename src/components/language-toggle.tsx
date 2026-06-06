import { setLocale } from "@/app/actions/locale";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  locale: Locale;
};

export function LanguageToggle({ locale }: LanguageToggleProps) {
  return (
    <form
      action={setLocale}
      className="grid grid-cols-2 rounded-md border border-white/10 bg-white/[0.04] p-1"
      aria-label="Language"
    >
      {(["en", "fr"] as const).map((option) => (
        <button
          key={option}
          type="submit"
          name="locale"
          value={option}
          className={cn(
            "min-h-8 rounded-sm px-2.5 py-1 text-xs font-medium uppercase text-muted-foreground transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            locale === option && "bg-gold-300 text-charcoal-900",
          )}
          aria-pressed={locale === option}
        >
          {option}
        </button>
      ))}
    </form>
  );
}
