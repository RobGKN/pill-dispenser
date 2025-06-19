// screens/DeviceSettings.tsx
import React, { useState } from 'react';
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
  Dialog,
  Portal,
  TextInput,
  Button,
} from 'react-native-paper';
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { format } from 'date-fns';
import uuid from 'react-native-uuid';

import { useDeviceContext } from '../contexts/DeviceContext';
import { Device, DoseWindow, ScheduleVersion } from '../types/models';
import { scheduleForDate } from '../utils/scheduleHelpers';

type Params = { id: string };

export default function DeviceSettings() {
  /* context & navigation */
  const [{ devices, schedules }, dispatch] = useDeviceContext();
  const { id } = useRoute<{ key: string; name: string; params: Params }>().params;
  const nav =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();

  const device: Device = devices[id];

  /* today's schedule for editing */
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const currentSched = scheduleForDate(schedules, id, todayStr)!;

  const [draftWindows, setDraftWindows] = useState<DoseWindow[]>(
    currentSched.windows,
  );
  const [notifyStart, setNotifyStart] = useState(
    Boolean((device as any).notifyStart),
  );
  const [notifyEnd, setNotifyEnd] = useState(
    Boolean((device as any).notifyEnd),
  );

  /* --- helpers --------------------------------------------------- */
  const updateDevice = (patch: Partial<Device>) =>
    dispatch({ type: 'UPDATE_DEVICE', payload: { id: device.id, patch } });

  const removeWindow = (windowId: string) =>
    setDraftWindows((prev) => prev.filter((w) => w.id !== windowId));

  const persistSchedule = () => {
    const newVersion: ScheduleVersion = {
      id: `sv-${Date.now()}`,
      deviceId: id,
      validFrom: todayStr,            // === immediate effect
      windows: draftWindows,
      createdAt: Date.now()
    };
    dispatch({ type: 'ADD_SCHEDULE_VERSION', payload: newVersion });
    updateDevice({ notifyStart, notifyEnd });
    nav.goBack();
  };

  const hasChanges =
    notifyStart !== Boolean((device as any).notifyStart) ||
    notifyEnd !== Boolean((device as any).notifyEnd) ||
    JSON.stringify(draftWindows) !== JSON.stringify(currentSched.windows);

  /* --- dialog state --------------------------------------------- */
  const [showDlg, setShowDlg] = useState(false);
  const [dlgLabel, setDlgLabel] = useState('');
  const [dlgStart, setDlgStart] = useState('07:00');
  const [dlgEnd, setDlgEnd] = useState('09:00');
  const [dlgReq, setDlgReq] = useState('1');

  const addWindow = () => {
    setDraftWindows((prev) => [
      ...prev,
      {
        id: uuid.v4().toString(),
        label: dlgLabel || undefined,
        start: dlgStart,
        end: dlgEnd,
        required: Number(dlgReq) || 1,
      },
    ]);
    setDlgLabel('');
    setDlgStart('07:00');
    setDlgEnd('09:00');
    setDlgReq('1');
    setShowDlg(false);
  };

  /* --- UI -------------------------------------------------------- */
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* toggles */}
        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          <List.Item
            title="Notify at start of each window"
            right={() => (
              <Switch value={notifyStart} onValueChange={setNotifyStart} />
            )}
          />
          <Divider />
          <List.Item
            title="Notify at end if window incomplete"
            right={() => (
              <Switch value={notifyEnd} onValueChange={setNotifyEnd} />
            )}
          />
        </List.Section>

        {/* windows list */}
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Dose windows
        </Text>
        {draftWindows.length === 0 ? (
          <View style={styles.empty}>
            <Text>No windows yet</Text>
          </View>
        ) : (
          <FlatList
            data={draftWindows}
            keyExtractor={(w) => w.id}
            renderItem={({ item }) => (
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
            )}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* FABs */}
      <FAB icon="plus" style={styles.fabAdd} onPress={() => setShowDlg(true)} />
      {hasChanges && (
        <FAB
          icon="content-save"
          style={styles.fabSave}
          onPress={persistSchedule}
        />
      )}

      {/* add-window dialog */}
      <Portal>
        <Dialog visible={showDlg} onDismiss={() => setShowDlg(false)}>
          <Dialog.Title>New dose window</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Label" value={dlgLabel} onChangeText={setDlgLabel} />
            <TextInput label="Start (HH:mm)" value={dlgStart} onChangeText={setDlgStart} />
            <TextInput label="End (HH:mm)" value={dlgEnd} onChangeText={setDlgEnd} />
            <TextInput
              label="Required doses"
              value={dlgReq}
              keyboardType="numeric"
              onChangeText={setDlgReq}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDlg(false)}>Cancel</Button>
            <Button onPress={addWindow}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

/* --- styles ------------------------------------------------------ */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, paddingBottom: 160 },
  sectionTitle: { marginBottom: 8, marginTop: 4 },
  windowCard: { marginBottom: 10 },
  empty: { alignItems: 'center', marginVertical: 24 },
  fabAdd: { position: 'absolute', right: 24, bottom: 32 },
  fabSave: { position: 'absolute', right: 24, bottom: 96 },
});
