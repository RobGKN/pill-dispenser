import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text variant="headlineMedium">Day Detail – {date}</Text>
    </View>
  );
}