// ───────────────────────────────────────
// file: app/index.tsx  (Home screen placeholder)

import React from 'react';
import { View } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="headlineMedium">Home Screen</Text>
      <Link href="/add-disp" asChild>
        <FAB icon="plus" style={{ position: 'absolute', bottom: 16, right: 16 }} />
      </Link>
    </View>
  );
}