import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { DeviceParamList } from '../navigation/DeviceStack';

export default function DayDetail() {
  const { params } = useRoute<RouteProp<DeviceParamList, 'Day'>>();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">
        Day Detail – {params.date} ({params.id})
      </Text>
      <Text>Detail placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});