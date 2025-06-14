// screens/Home.tsx
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, FAB } from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useDeviceContext } from '../contexts/DeviceContext';


export default function Home() {
  const nav = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const [state] = useDeviceContext();                     // ← global mock data
  const devices = React.useMemo(
    () => Object.values(state.devices),
    [state.devices],
  );

  /* ---------- render one card per dispenser ---------- */
  const renderItem = ({ item }: { item: typeof devices[number] }) => (
    <Card
      style={styles.card}
      onPress={() =>
        nav.navigate(
          'Device',                              // outer route
          { screen: 'Summary', params: { id: item.id } },
        )
      }>
      <Card.Title title={item.name} subtitle={item.id} />
    </Card>
  );

  return (
    <View style={styles.container}>
      {devices.length === 0 ? (
        <View style={styles.empty}>
          <Text variant="titleMedium">No dispensers yet</Text>
          <Text>Add one with the + button below</Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(d) => d.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

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
  container: { flex: 1 },
  list:      { padding: 16 },
  card:      { marginBottom: 12 },
  empty:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab:       { position: 'absolute', bottom: 24, right: 24 },
});
