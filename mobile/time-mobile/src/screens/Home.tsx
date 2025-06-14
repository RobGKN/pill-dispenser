import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const nav = useNavigation();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Home Screen</Text>

      <FAB
        icon="plus"
        onPress={() => nav.navigate('AddDisp' as never)}
        style={styles.fab}
        accessibilityLabel="Add new dispenser"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', bottom: 24, right: 24 },
});
