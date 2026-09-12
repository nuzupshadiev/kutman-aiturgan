import { translations, type Language } from "@/data/translations";

/**
 * Kyrgyzstan runs on a fixed UTC+06:00 with no daylight saving, so the event
 * instant is exact without a timezone database. Date-only strings are never
 * handed to `new Date(...)` directly: that parses them as UTC and can show the
 * previous day for viewers west of Greenwich.
 */
const BISHKEK_UTC_OFFSET_MINUTES = 6 * 60;

export interface CalendarDate {
  year: number;
  /** 1–12 */
  month: number;
  day: number;
}

export function parseIsoDate(isoDate: string): CalendarDate {
  const [year, month, day] = isoDate.split("-").map(Number);
  return { year, month, day };
}

function parseTime(startTime: string): { hours: number; minutes: number } {
  const [hours, minutes] = startTime.split(":").map(Number);
  return { hours: hours || 0, minutes: minutes || 0 };
}

/** The event instant, anchored to Asia/Bishkek. */
export function eventTimestamp(isoDate: string, startTime: string): number {
  const { year, month, day } = parseIsoDate(isoDate);
  const { hours, minutes } = parseTime(startTime);
  return Date.UTC(year, month - 1, day, hours, minutes) - BISHKEK_UTC_OFFSET_MINUTES * 60_000;
}

const pad = (value: number) => String(value).padStart(2, "0");

/** `17:00` — normalised, so a stray `9:5` still prints as a time. */
export function formatTime(startTime: string): string {
  const { hours, minutes } = parseTime(startTime);
  return `${pad(hours)}:${pad(minutes)}`;
}

/** `18 сентября 2027` / `18-сентябрь, 2027-жыл` */
export function longDate(isoDate: string, language: Language): string {
  const { year, month, day } = parseIsoDate(isoDate);
  const name = translations.calendar.monthsGenitive[language][month - 1];
  return language === "ru" ? `${day} ${name} ${year}` : `${day}-${name}, ${year}-жыл`;
}

const weekdayIndex = (isoDate: string) => {
  const { year, month, day } = parseIsoDate(isoDate);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
};

export function weekdayName(isoDate: string, language: Language): string {
  return translations.calendar.weekdays[language][weekdayIndex(isoDate)];
}

/** `Суббота, 18 сентября 2027` — the weekday and the date in one line. */
export function weekdayWithDate(isoDate: string, language: Language): string {
  const weekday = weekdayName(isoDate, language);
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${longDate(isoDate, language)}`;
}

/** The month's name on its own — the calendar's heading. */
export function monthName(isoDate: string, language: Language): string {
  const { month } = parseIsoDate(isoDate);
  return translations.calendar.months[language][month - 1];
}

/**
 * The event's month laid out as calendar weeks, Monday first, with `null` for
 * the cells before the 1st and after the last day.
 *
 * Built entirely from `Date.UTC`, so the grid cannot slide by a day for a
 * viewer west of Greenwich the way a locally-parsed date-only string would.
 */
export function monthWeeks(isoDate: string): Array<Array<number | null>> {
  const { year, month } = parseIsoDate(isoDate);
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const lead = (firstWeekday + 6) % 7;
  const dayCount = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const cells: Array<number | null> = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: dayCount }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: Array<Array<number | null>> = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }
  return weeks;
}

/**
 * The calendar week the wedding day falls in, Monday first — the single strip
 * of seven this design prints, rather than a whole month.
 */
export function weekOfDate(isoDate: string): Array<number | null> {
  const { day } = parseIsoDate(isoDate);
  const weeks = monthWeeks(isoDate);
  return weeks.find((week) => week.includes(day)) ?? weeks[0];
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
}

export function countdownParts(target: number, now: number): CountdownParts {
  const remaining = Math.max(0, target - now);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    finished: remaining === 0,
  };
}
