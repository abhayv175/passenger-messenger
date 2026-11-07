import { format, isToday, isValid } from "date-fns";

/**
 * Safely format a date without throwing RangeError on invalid or null/undefined values.
 */
export const formatSafe = (
  date: Date | string | number | null | undefined,
  formatStr: string,
  fallback = ""
): string => {
  if (!date) return fallback;
  try {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    if (!isValid(d)) return fallback;
    return format(d, formatStr);
  } catch {
    return fallback;
  }
};

/**
 * Formats timestamps for conversation lists or chat bubbles:
 * Displays 12-hour time (e.g. 3:45 PM) if today, or "MMM d, p" if earlier.
 */
export const formatMessageTime = (
  date: Date | string | number | null | undefined
): string => {
  if (!date) return "";
  try {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    if (!isValid(d)) return "";
    return isToday(d) ? format(d, "p") : format(d, "MMM d, p");
  } catch {
    return "";
  }
};

/**
 * Formats short time (e.g. 4:20 PM)
 */
export const formatTimeOnly = (
  date: Date | string | number | null | undefined
): string => {
  return formatSafe(date, "p", "");
};

/**
 * Formats pretty calendar date (e.g. Apr 12, 2026)
 */
export const formatDateOnly = (
  date: Date | string | number | null | undefined
): string => {
  return formatSafe(date, "PP", "");
};

