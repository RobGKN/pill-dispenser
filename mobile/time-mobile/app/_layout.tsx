// ───────────────────────────────────────
// file: app/_layout.tsx

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../src/constants/theme';
import { DeviceProvider } from '../src/contexts/DeviceContext';


console.log('SafeAreaProvider:', typeof SafeAreaProvider);
console.log('PaperProvider:', typeof PaperProvider);
console.log('Slot:', typeof Slot);
console.log('DeviceProvider:', typeof DeviceProvider);


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <DeviceProvider>
          <StatusBar style="auto" />
          {/* Expo Router outlet */}
          <Slot />
        </DeviceProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}