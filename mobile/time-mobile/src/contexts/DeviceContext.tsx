import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { Device, DoseEvent } from '../types/models';

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

const DeviceContext = createContext<[State, React.Dispatch<Action>] | undefined>(undefined);

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const value = useReducer(reducer, initialState);
  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDeviceContext = () => {
  const ctx = useContext(DeviceContext);
  if (!ctx) {
    throw new Error('useDeviceContext must be used within a DeviceProvider');
  }
  return ctx;
};