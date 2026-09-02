/**
 * Checks if a date string represents a date in the past (before today).
 * Sets the event date boundary to the very end of that day (23:59:59.999)
 * to avoid archiving the event prematurely on the day it occurs.
 */
export function isEventPassed(dateStr: string): boolean {
  if (!dateStr) return false;

  const cleanedStr = dateStr.replace(/(\d+)(st|nd|rd|th)/gi, "$1");
  const parsedDate = Date.parse(cleanedStr);
  if (isNaN(parsedDate)) {
    // If date format is non-standard or custom range, do not auto-archive
    return false;
  }

  const eventDate = new Date(parsedDate);
  eventDate.setHours(23, 59, 59, 999);

  const today = new Date();
  return eventDate < today;
}
