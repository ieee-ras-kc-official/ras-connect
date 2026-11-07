// Compare calendar dates in the event's timezone; never infer a year from free text.
export function isEventPassed(date: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(date || "") || Number.isNaN(Date.parse(date))) return false;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
  return date.slice(0, 10) < today;
}
export function formatEventDate(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(date || "") || Number.isNaN(Date.parse(date))) return "Date to be confirmed";
  return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}
