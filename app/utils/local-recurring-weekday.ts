import railsTimeZones from './rails-time-zones';

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function localRecurringWeekday(
  weekday: string,
  startTime: string | null | undefined,
  sourceTimeZone: string | null | undefined,
  targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
): string {
  const index = weekdays.indexOf(weekday);
  if (index === -1 || !startTime || !sourceTimeZone) return weekday;

  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return weekday;

  try {
    const sourceDay = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      timeZone: railsTimeZones[sourceTimeZone] || sourceTimeZone,
    }).format(date);
    const localDay = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      timeZone: railsTimeZones[targetTimeZone] || targetTimeZone,
    }).format(date);

    // The date on startTime may be unrelated to the recurrence. Apply only
    // the timezone's weekday shift to the stored recurring weekday.
    const shift = weekdays.indexOf(localDay) - weekdays.indexOf(sourceDay);
    return weekdays[(index + shift + 7) % 7] ?? weekday;
  } catch (error) {
    if (error instanceof RangeError) return weekday;
    throw error;
  }
}
