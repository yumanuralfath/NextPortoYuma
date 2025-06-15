export function toLocalDateStringIso(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60 * 1000;
  const localISOTime = new Date(date.getTime() - tzOffset).toISOString();
  return localISOTime.split("T")[0]; // YYYY-MM-DD
}
