import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { DeviceParamList } from '../navigation/DeviceStack';

export default function DeviceSummary() {
  const { params } = useRoute<RouteProp<DeviceParamList, 'Summary'>>();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Summary – {params.id}</Text>
      <Text>Device overview placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
