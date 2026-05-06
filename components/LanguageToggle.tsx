"use client";

import { Locale, useI18n } from "@/lib/i18n";

const LABELS: Record<Locale, string> = {
  mn: "MN",
  en: "EN",
};

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const next: Locale = locale === "mn" ? "en" : "mn";
  return (
    <button
      onClick={() => setLocale(next)}
      title={`Switch to ${LABELS[next]}`}
      className="rounded-md border border-line px-2 py-1 text-[11px] font-semibold text-muted transition hover:border-muted hover:text-ink"
    >
      {LABELS[locale]} → {LABELS[next]}
    </button>
  );
}
