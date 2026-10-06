import {
  formatDateTime,
  formatPersianDate,
  formatTime,
  parseToDate,
  TEHRAN_TIMEZONE,
} from "../utils";
import { Locale } from "./config";

const gregorianDateFormatter = new Intl.DateTimeFormat(
  "en-GB-u-ca-gregory-nu-latn",
  {
    timeZone: TEHRAN_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
);

/**
 * Formats a Date for Gregorian calendar, e.g. 2026/10/06.
 */
export function formatGregorianDate(
  value: Date | string | number | null | undefined,
  fallback = "",
): string {
  if (!value) {
    return fallback;
  }

  const date = parseToDate(value);
  if (!date) {
    return typeof value === "string" ? value : fallback;
  }

  try {
    const parts = gregorianDateFormatter.formatToParts(date);
    let year = "";
    let month = "";
    let day = "";

    for (const part of parts) {
      if (part.type === "year") {
        year = part.value;
      } else if (part.type === "month") {
        month = part.value.padStart(2, "0");
      } else if (part.type === "day") {
        day = part.value.padStart(2, "0");
      }
    }

    if (year && month && day) {
      return `${year}/${month}/${day}`;
    }

    return gregorianDateFormatter.format(date);
  } catch {
    return typeof value === "string" ? value : fallback;
  }
}

/**
 * Locale-aware date formatter: Gregorian for English, Jalali (Persian) for Persian.
 */
export function formatDateForLocale(
  locale: Locale,
  value: Date | string | number | null | undefined,
  fallback = "",
): string {
  return locale === "fa"
    ? formatPersianDate(value, fallback)
    : formatGregorianDate(value, fallback);
}

export function formatDateTimeForLocale(
  locale: Locale,
  value: Date | string | number | null | undefined,
  separator = " ",
  fallback = "",
): string {
  if (locale === "fa") {
    return formatDateTime(value, separator, fallback);
  }

  const date = formatGregorianDate(value);
  const time = formatTime(value);

  if (!date && !time) {
    return fallback;
  }
  if (!date) {
    return time;
  }
  if (!time) {
    return date;
  }

  return `${date}${separator}${time}`;
}

export function formatDeadlineForLocale(
  locale: Locale,
  deadline: string | null | undefined,
  isDaily = false,
  toLabel = "To",
): string {
  if (!deadline) {
    return "";
  }

  if (isDaily || (deadline.includes(":") && !deadline.includes("-"))) {
    return `${toLabel} ${deadline}`;
  }

  return formatDateForLocale(locale, deadline);
}

export { formatTime };
export type { Locale };
