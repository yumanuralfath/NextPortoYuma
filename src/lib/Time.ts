export function toLocalDateStringIso(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60 * 1000;
  const localISOTime = new Date(date.getTime() - tzOffset).toISOString();
  return localISOTime.split("T")[0]; // YYYY-MM-DD
}

export function humanReadableDate(isoDateString: string): string {
  const cleaned = isoDateString.replace(/\.(\d{3})\d+/, ".$1");
  const date = new Date(cleaned);

  return date.toLocaleString("id-ID", {
    weekday: "long", // Minggu
    year: "numeric", // 2025
    month: "long", // Juni
    day: "numeric", // 15
    hour: "2-digit", // 03
    minute: "2-digit", // 59
    second: "2-digit", // 22
    timeZoneName: "short",
    hour12: false,
  });
}
