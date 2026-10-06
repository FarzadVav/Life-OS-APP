export const LOCALES = ["en", "fa"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fa";

export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "fa";
}
