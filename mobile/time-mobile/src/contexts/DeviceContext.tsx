// contexts/DeviceContext.tsx
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
} from 'react';

import { Device, DoseEvent, DoseWindow } from '../types/models';
import { devices as mockDevices, events as mockEvents } from '../mocks/mockDevices';

/* ─── state shape ──────────────────────────────────────────────── */
interface State {
  devices: Record<string, Device>;
  events:  Record<string, DoseEvent[]>;          // keyed by deviceId
}

const initialState: State = { devices: {}, events: {} };

/* ─── actions ──────────────────────────────────────────────────── */
type InitAction          = { type: 'INIT';          payload: State };
type AddDeviceAction     = { type: 'ADD_DEVICE';    payload: Device };
type UpdateDeviceAction  = { type: 'UPDATE_DEVICE'; payload: { id: string; patch: Partial<Device> } };
type RemoveWindowAction  = { type: 'REMOVE_WINDOW'; payload: { id: string; windowId: string } };
type AddWindowAction     = { type: 'ADD_WINDOW';    payload: { id: string; window: DoseWindow } };
type LogDoseAction       = { type: 'LOG_DOSE';      payload: { id: string; event: DoseEvent } };
type NoopAction          = { type: 'NOOP' };

type Action =
  | InitAction
  | AddDeviceAction
  | UpdateDeviceAction
  | RemoveWindowAction
  | AddWindowAction
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

    case 'REMOVE_WINDOW': {
      const { id, windowId } = action.payload;
      const device = state.devices[id];
      return {
        ...state,
        devices: {
          ...state.devices,
          [id]: {
            ...device,
            windows: device.windows.filter((w) => w.id !== windowId),
          },
        },
      };
    }

    case 'ADD_WINDOW': {
      const { id, window } = action.payload;
      const device = state.devices[id];
      return {
        ...state,
        devices: {
          ...state.devices,
          [id]: { ...device, windows: [...device.windows, window] },
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
      dispatch({ type: 'INIT', payload: { devices: mockDevices, events: mockEvents } });
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
