/* ===== Time-series data models ===== */

export interface DoseWindow {
  id: string;
  label?: string;
  start: string;      // "HH:mm"
  end: string;        // "HH:mm"
  required: number;   // doses needed in the window
}

export interface Device {
  id: string;
  name: string;
  /** user preferences */
  notifyStart?: boolean;
  notifyEnd?: boolean;
}

export interface DoseEvent {
  id: string;
  deviceId: string;
  timestamp: string;          // ISO-8601 local time
  source: 'manual' | 'device';
}

export interface ScheduleVersion {
  id: string;                 // UUID
  deviceId: string;
  validFrom: string;          // "YYYY-MM-DD" (local)
  windows: DoseWindow[];
  createdAt: number;
}
