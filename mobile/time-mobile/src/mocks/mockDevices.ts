import { Device, DoseEvent, DoseWindow } from '../types/models';
import { formatISO } from 'date-fns';

/*------------------------------------------------------------------
  Helper: “n days ago at HH:mm” → ISO-8601
------------------------------------------------------------------*/
const iso = (daysAgo: number, time: string) => {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(h, m, 0, 0);
  return formatISO(d);
};

/*------------------------------------------------------------------
  1. Devices  (no windows array)
------------------------------------------------------------------*/
export const devices: Record<string, Device> = {
  'D-A0B1': {
    id: 'D-A0B1',
    name: 'Morning Meds',
    notifyStart: true,
    notifyEnd: true,
  },
  'D-F4E3': {
    id: 'D-F4E3',
    name: 'Vitamin D',
    notifyStart: false,
    notifyEnd: false,
  },
};

/*------------------------------------------------------------------
  2. Dose-event history
------------------------------------------------------------------*/
export const events: Record<string, DoseEvent[]> = {
  'D-A0B1': [
    { id: 'e-001', deviceId: 'D-A0B1', timestamp: iso(2, '07:45'), source: 'device' },
    { id: 'e-002', deviceId: 'D-A0B1', timestamp: iso(1, '07:50'), source: 'manual' },
  ],
  'D-F4E3': [
    { id: 'e-010', deviceId: 'D-F4E3', timestamp: iso(1, '20:30'), source: 'device' },
  ],
};

/*------------------------------------------------------------------
  3. Default windows (re-used in schedule seed below)
------------------------------------------------------------------*/
export const defaultWindows: Record<string, DoseWindow[]> = {
  'D-A0B1': [
    { id: 'w-morn', label: 'Breakfast', start: '07:00', end: '09:00', required: 1 },
    { id: 'w-eve',  label: 'Evening',   start: '19:00', end: '21:00', required: 1 },
  ],
  'D-F4E3': [
    { id: 'w-vitd', label: 'Vitamin D', start: '20:00', end: '22:00', required: 1 },
  ],
};