import { ScheduleVersion } from '../types/models';

export function scheduleForDate(
  schedules: Record<string, ScheduleVersion[]>,
  deviceId: string,
  date: string, // "YYYY-MM-DD"
): ScheduleVersion | null {
  const list = schedules[deviceId] ?? [];
  // latest version whose validFrom <= date
  return (
    list
      .filter((v) => v.validFrom <= date)
      .sort((a, b) => {
        const byDate = b.validFrom.localeCompare(a.validFrom);
        if (byDate) return byDate;
        return (b.createdAt ?? 0) - (a.createdAt ?? 0);
      })[0] || null
  );
}