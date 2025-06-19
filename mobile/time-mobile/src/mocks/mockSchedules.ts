import { ScheduleVersion } from '../types/models';
import { devices, defaultWindows } from './mockDevices';

/*------------------------------------------------------------------
  One schedule version per device, valid from 2025-01-01
------------------------------------------------------------------*/
export const schedules: Record<string, ScheduleVersion[]> = {};

Object.values(devices).forEach((d) => {
  schedules[d.id] = [
    {
      id: `sv-${d.id}-0`,
      deviceId: d.id,
      validFrom: '2025-01-01',       // seed date (≤ today)
      windows: defaultWindows[d.id],
    },
  ];
});