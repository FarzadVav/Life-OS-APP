export const TEHRAN_TIMEZONE = "Asia/Tehran";

const persianDateFormatter = new Intl.DateTimeFormat(
  "fa-IR-u-ca-persian-nu-latn",
  {
    timeZone: TEHRAN_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
);

const tehranTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TEHRAN_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/**
 * Parses an input into a valid Date object, handling strings (including YYYY-MM-DD safely) and dates.
 */
export function parseToDate(
  value: Date | string | number | null | undefined,
): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    // Pure calendar date YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const d = new Date(`${trimmed}T12:00:00Z`);
      return isNaN(d.getTime()) ? null : d;
    }

    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/**
 * Formats a Date or date string to Persian (Solar Hijri) calendar based on Asia/Tehran,
 * displaying with English characters in YYYY/MM/DD format (e.g. 1405/07/14).
 */
export function formatPersianDate(
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
    const parts = persianDateFormatter.formatToParts(date);
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

    return persianDateFormatter.format(date);
  } catch {
    return typeof value === "string" ? value : fallback;
  }
}

/**
 * Alias for formatPersianDate.
 */
export const formatDate = formatPersianDate;

/**
 * Formats a time based on Asia/Tehran in HH:mm 24-hour format with English characters.
 */
export function formatTime(
  value: Date | string | number | null | undefined,
  fallback = "",
): string {
  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    // Already in HH:mm format
    if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
      const [h, m] = trimmed.split(":");
      return `${h.padStart(2, "0")}:${m}`;
    }
  }

  const date = parseToDate(value);
  if (!date) {
    return typeof value === "string" ? value : fallback;
  }

  try {
    return tehranTimeFormatter.format(date);
  } catch {
    return typeof value === "string" ? value : fallback;
  }
}

/**
 * Formats date and time together based on Asia/Tehran.
 * e.g. "1405/07/14 16:30"
 */
export function formatDateTime(
  value: Date | string | number | null | undefined,
  separator = " ",
  fallback = "",
): string {
  const d = formatPersianDate(value);
  const t = formatTime(value);

  if (!d && !t) {
    return fallback;
  }
  if (!d) {
    return t;
  }
  if (!t) {
    return d;
  }

  return `${d}${separator}${t}`;
}

/**
 * Parses deadline / form date string to Date object. Returns null if invalid or time string.
 */
export function parseDate(date: string | null | undefined): Date | null {
  if (!date || date.includes(":")) {
    return null;
  }

  return new Date(`${date}T00:00:00`);
}

/**
 * Serializes a Date object to YYYY-MM-DD string for form inputs and storage.
 */
export function serializeDate(date: Date | null | undefined): string {
  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Returns current time in Asia/Tehran formatted as HH:mm.
 */
export function getDefaultTime(): string {
  return formatTime(new Date());
}

/**
 * Formats a deadline for tasks/todos based on whether it is daily or upcoming date.
 */
export function formatDeadline(
  deadline: string | null | undefined,
  isDaily = false,
): string {
  if (!deadline) {
    return "";
  }

  if (isDaily || (deadline.includes(":") && !deadline.includes("-"))) {
    return `To ${deadline}`;
  }

  return formatPersianDate(deadline);
}
