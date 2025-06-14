import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Device, DoseEvent } from '../types/models';
import { devices as mockDevices, events as mockEvents } from '../mocks/mockDevices';

interface State {
  devices: Record<string, Device>;
  events: Record<string, DoseEvent[]>; // keyed by deviceId
}

const initialState: State = {
  devices: {},
  events: {},
};

type Action =
  | { type: 'INIT'; payload: State }
  | { type: 'NOOP' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    default:
      return state;
  }
}

const DeviceContext = createContext<readonly [State, React.Dispatch<Action>] | undefined>(undefined);


export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  /* Dev-only bootstrap – runs once on first mount */
  React.useEffect(() => {
    if (__DEV__) {                // global RN flag
      dispatch({ type: 'INIT', payload: { devices: mockDevices, events: mockEvents } });
    }
  }, []);

  const value = React.useMemo(() => [state, dispatch] as const, [state, dispatch]);
  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDeviceContext = () => {
  const ctx = useContext(DeviceContext);
  if (!ctx) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  return ctx;
};