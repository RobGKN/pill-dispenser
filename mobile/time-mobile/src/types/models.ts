export interface DoseWindow {
  id: string;
  label?: string;
  start: string;  // "HH:mm"
  end: string;    // "HH:mm"
  required: number;
}

export interface Device {
  id: string;
  name: string;
  notify: boolean;
  windows: DoseWindow[];
}

export interface DoseEvent {
  id: string;
  deviceId: string;
  timestamp: string;      // ISO‑8601 local time
  source: 'manual' | 'device';
}