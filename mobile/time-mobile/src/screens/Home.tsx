import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Text, Card, FAB, IconButton } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { useDeviceContext } from '../contexts/DeviceContext';
import { Device } from '../types/models';           // ← adjust import path if needed

export default function Home() {
  // loosely-typed nav keeps things simple while you wire flows
  const nav =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();

  const [state] = useDeviceContext();
  const devices = React.useMemo<Device[]>(
    () => Object.values(state.devices),
    [state.devices],
  );

  /* ---------- render one card per dispenser ---------- */
  const renderItem = ({ item }: { item: Device }) => (
    <Card
      style={styles.card}
      onPress={() =>
        nav.navigate('Device', {
          screen: 'Summary',
          params: { id: item.id },
        })
      }>
      <Card.Title title={item.name} subtitle={item.id} />
    </Card>
  );

  /* ---------- render ---------- */
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="home-circle" size={48} disabled />
        <Text variant="headlineLarge">Home</Text>
      </View>

      {/* List or empty state */}
      {devices.length === 0 ? (
        <View style={styles.empty}>
          <Text variant="titleMedium">No dispensers yet</Text>
          <Text>Add one with the button below</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(d) => d.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Extended FAB */}
      <FAB
        icon="plus"
        label="Add device"
        onPress={() => nav.navigate('AddDisp')}
        style={styles.fab}
      />
    </SafeAreaView>
  );
}

/* ---------- styles ---------- */
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fafafa' },

  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },

  list: { paddingHorizontal: 16, paddingBottom: 120 },
  card: { marginBottom: 12 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: width * 0.46, // extended FAB feels balanced
  },
});
