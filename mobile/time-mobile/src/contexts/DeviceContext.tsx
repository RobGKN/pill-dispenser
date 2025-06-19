// contexts/DeviceContext.tsx
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
} from 'react';

import { Device, DoseEvent, ScheduleVersion } from '../types/models';
import { devices as mockDevices, events as mockEvents } from '../mocks/mockDevices';
import { schedules as mockSchedules } from '../mocks/mockSchedules';

/* ─── state shape ──────────────────────────────────────────────── */
interface State {
  devices: Record<string, Device>;
  schedules: Record<string, ScheduleVersion[]>;
  events:  Record<string, DoseEvent[]>;          // keyed by deviceId
}

const initialState: State = { devices: {}, events: {}, schedules: {} };

/* ─── actions ──────────────────────────────────────────────────── */
type InitAction          = { type: 'INIT';          payload: State };
type AddDeviceAction     = { type: 'ADD_DEVICE';    payload: Device };
type UpdateDeviceAction  = { type: 'UPDATE_DEVICE'; payload: { id: string; patch: Partial<Device> } };
type AddScheduleVersionAction  = { type: 'ADD_SCHEDULE_VERSION'; payload: ScheduleVersion }
type UpdateScheduleVersionAction  = { type: 'UPDATE_SCHEDULE_VERSION'; payload: ScheduleVersion }
type LogDoseAction       = { type: 'LOG_DOSE';      payload: { id: string; event: DoseEvent } };
type NoopAction          = { type: 'NOOP' };

type Action =
  | InitAction
  | AddDeviceAction
  | UpdateDeviceAction
  | AddScheduleVersionAction
  | UpdateScheduleVersionAction
  | LogDoseAction
  | NoopAction;

/* ─── reducer ──────────────────────────────────────────────────── */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT':
      return action.payload;

    case 'ADD_DEVICE':
      return {
        ...state,
        devices: { ...state.devices, [action.payload.id]: action.payload },
      };

    case 'UPDATE_DEVICE': {
      const { id, patch } = action.payload;
      return {
        ...state,
        devices: {
          ...state.devices,
          [id]: { ...state.devices[id], ...patch },
        },
      };
    }

    case 'ADD_SCHEDULE_VERSION': {
      const v = action.payload;
      return {
        ...state,
        schedules: {
          ...state.schedules,
          [v.deviceId]: [...(state.schedules[v.deviceId] ?? []), v].sort(
            (a, b) => a.validFrom.localeCompare(b.validFrom),
          ),
        },
      };
    }

    case 'LOG_DOSE': {
      const { id, event } = action.payload;
      const list = state.events[id] ?? [];
      return {
        ...state,
        events: { ...state.events, [id]: [...list, event] },
      };
    }

    case 'NOOP':
    default:
      return state;
  }
}

/* ─── context setup ─────────────────────────────────────────────── */
type DeviceCtx = readonly [State, React.Dispatch<Action>];
const DeviceContext = createContext<DeviceCtx | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  /* dev-only mock bootstrap */
  useEffect(() => {
    if (__DEV__) {
      dispatch({
        type: 'INIT',
        payload: {
          devices: mockDevices,
          schedules: mockSchedules,   // <-- new
          events: mockEvents,
        },
      });
    }
  }, []);

  const value = useMemo(() => [state, dispatch] as const, [state, dispatch]);

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

export function useDeviceContext(): DeviceCtx {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error('useDeviceContext must be inside <DeviceProvider>');
  return ctx;
}
