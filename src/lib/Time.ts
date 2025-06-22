export function toLocalDateStringIso(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60 * 1000;
  const localISOTime = new Date(date.getTime() - tzOffset).toISOString();
  return localISOTime.split("T")[0]; // YYYY-MM-DD
}

export function humanReadableDate(isoDateString: string): string {
  const cleaned = isoDateString.replace(/\.(\d{3})\d+/, ".$1");
  const date = new Date(cleaned);

  return date.toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    hour12: false,
  });
}

export function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const isLastDayOfMonth = (date: Date) => {
  const day = new Date(date);
  day.setDate(day.getDate() + 1);
  return day.getDate() === 1;
};

export const isTodaySunday = new Date().getDay() === 0;

export const toLocalIsoString = (date: Date): string => {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
    2,
    "0"
  )}-${`${date.getDate()}`.padStart(2, "0")}`;
};

export const getFormattedMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return `${year}-${month + 2}`;
};
