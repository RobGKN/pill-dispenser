import { Device, DoseEvent, DoseWindow } from '../types/models';
import { formatISO } from 'date-fns';

/* ──────────────────────────────────────────────────────────────
   Small helper: create an ISO-8601 timestamp “n days ago at HH:mm”
   ────────────────────────────────────────────────────────────── */
const iso = (daysAgo: number, time: string) => {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(h, m, 0, 0);
  return formatISO(d);         // e.g. "2025-06-12T08:15:00+10:00"
};

/* ──────────────────────────────────────────────────────────────
   1.  DEVICE LIST  (keyed by id for O(1) lookups)
   ────────────────────────────────────────────────────────────── */
export const devices: Record<string, Device> = {
  'D-A0B1': {
    id: 'D-A0B1',
    name: 'Morning Meds',
    notify: true,
    windows: [
      { id: 'w-breakfast', label: 'Breakfast', start: '07:00', end: '09:00', required: 1 },
      { id: 'w-evening',   label: 'Evening',   start: '19:00', end: '21:00', required: 1 },
    ],
  },

  'D-F4E3': {
    id: 'D-F4E3',
    name: 'Vitamin D',
    notify: false,              // user disabled reminders
    windows: [
      { id: 'w-night', start: '20:00', end: '22:00', required: 1 },
    ],
  },
};

/* ──────────────────────────────────────────────────────────────
   2.  DOSE-EVENT HISTORY  (array per device)
   ────────────────────────────────────────────────────────────── */
export const events: Record<string, DoseEvent[]> = {
  'D-A0B1': [
    { id: 'e-001', deviceId: 'D-A0B1', timestamp: iso(2, '08:03'), source: 'device' },
    { id: 'e-002', deviceId: 'D-A0B1', timestamp: iso(1, '08:15'), source: 'manual' },
  ],

  'D-F4E3': [
    { id: 'e-010', deviceId: 'D-F4E3', timestamp: iso(1, '20:30'), source: 'device' },
  ],
};