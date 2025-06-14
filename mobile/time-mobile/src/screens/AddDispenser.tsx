import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function AddDispenser() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Add Dispenser Wizard</Text>
      <Text>Coming soon…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
