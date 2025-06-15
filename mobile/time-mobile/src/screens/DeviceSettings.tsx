import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  List,
  Switch,
  Card,
  IconButton,
  FAB,
  Divider,
} from 'react-native-paper';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';

import { useDeviceContext } from '../contexts/DeviceContext';
import { Device, DoseWindow } from '../types/models';

type RouteParams = { id: string };

export default function DeviceSettings() {
  /* ─── context & navigation ─────────────────────────────── */
  const [{ devices }, dispatch] = useDeviceContext();
  const { id } = useRoute<{ key: string; name: string; params: RouteParams }>().params;
  const nav = useNavigation<NavigationProp<Record<string, object | undefined>>>();

  const device: Device = devices[id];

  /* ─── local UI state mirrors device props ───────────────── */
  const [notifyStart, setNotifyStart] = React.useState<boolean>(!!(device as any).notifyStart);
  const [notifyEnd, setNotifyEnd]     = React.useState<boolean>(!!(device as any).notifyEnd);

  /* ─── helpers ───────────────────────────────────────────── */
  const updateDevice = (patch: Partial<Device>) =>
    dispatch({ type: 'UPDATE_DEVICE', payload: { id: device.id, patch } });

  const handleToggleStart = () => {
    const next = !notifyStart;
    setNotifyStart(next);
    updateDevice({ notifyStart: next });
  };

  const handleToggleEnd = () => {
    const next = !notifyEnd;
    setNotifyEnd(next);
    updateDevice({ notifyEnd: next });
  };

  const removeWindow = (windowId: string) =>
    dispatch({ type: 'REMOVE_WINDOW', payload: { id: device.id, windowId } });

  /* ─── render dose-window card ───────────────────────────── */
  const renderWindow = ({ item }: { item: DoseWindow }) => (
    <Card style={styles.windowCard}>
      <Card.Title
        title={item.label ?? 'Unnamed window'}
        subtitle={`${item.start} – ${item.end}   •   required ${item.required}`}
        right={(props) => (
          <IconButton
            {...props}
            icon="trash-can-outline"
            onPress={() => removeWindow(item.id)}
          />
        )}
      />
    </Card>
  );

  /* ─── UI ───────────────────────────────────────────────── */
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* notification toggles */}
        <List.Section>
          <List.Subheader>Notifications</List.Subheader>

          <List.Item
            title="Notify at start of each window"
            right={() => (
              <Switch value={notifyStart} onValueChange={handleToggleStart} />
            )}
          />
          <Divider />
          <List.Item
            title="Notify at end if window incomplete"
            right={() => (
              <Switch value={notifyEnd} onValueChange={handleToggleEnd} />
            )}
          />
        </List.Section>

        {/* dose windows */}
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Dose windows
        </Text>

        {device.windows.length === 0 ? (
          <View style={styles.empty}>
            <Text>No windows yet</Text>
          </View>
        ) : (
          <FlatList
            data={device.windows}
            keyExtractor={(w) => w.id}
            renderItem={renderWindow}
            scrollEnabled={false}      // inside ScrollView
          />
        )}
      </ScrollView>

      {/* add window FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => nav.navigate('AddWindow', { id })}
        label="Add window"
      />
    </SafeAreaView>
  );
}

/* ─── styles ─────────────────────────────────────────────── */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, paddingBottom: 120 },
  sectionTitle: { marginBottom: 8, marginTop: 4 },
  windowCard: { marginBottom: 10 },
  empty: { alignItems: 'center', marginVertical: 24 },
  fab: { position: 'absolute', right: 24, bottom: 32 },
});