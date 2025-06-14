// file: app/[id]/_layout.tsx  (Nested stack for a device)

import React from 'react';
import { Stack } from 'expo-router';

export default function DeviceLayout() {
  return <Stack screenOptions={{ headerShown: true }} />;
}
