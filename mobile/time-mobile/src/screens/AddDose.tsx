// screens/AddDose.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Button, Text, Card, List } from 'react-native-paper';
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { format, formatISO } from 'date-fns';

import { useDeviceContext } from '../contexts/DeviceContext';
import { DoseEvent } from '../types/models';

type RouteParams = { id: string };

export default function AddDose() {
  /* ─── navigation & context ───────────────────────────── */
  const nav =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const [, dispatch] = useDeviceContext();

  const { id: deviceId } = useRoute<{
    key: string;
    name: string;
    params: RouteParams;
  }>().params;

  /* ─── local state ─────────────────────────────────────── */
  const [date, setDate] = React.useState<Date>(new Date());
  const [time, setTime] = React.useState<Date>(new Date());

  const [showDate, setShowDate] = React.useState(false);
  const [showTime, setShowTime] = React.useState(false);

  /* ─── handlers ────────────────────────────────────────── */
  const onDateChange = (e: DateTimePickerEvent, selected?: Date) => {
    if (selected) setDate(selected);
    if (Platform.OS === 'android') setShowDate(false);
  };

  const onTimeChange = (e: DateTimePickerEvent, selected?: Date) => {
    if (selected) setTime(selected);
    if (Platform.OS === 'android') setShowTime(false);
  };

  const buildTimestamp = () => {
    const ts = new Date(date);
    ts.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return formatISO(ts);
  };

  const confirm = () => {
    const event: DoseEvent = {
      id: `e-${Date.now()}`,
      deviceId,
      timestamp: buildTimestamp(),
      source: 'manual',
    };
    dispatch({ type: 'LOG_DOSE', payload: { id: deviceId, event } });
    nav.goBack();
  };

  /* ─── UI ──────────────────────────────────────────────── */
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Log a dose manually" />
        <Card.Content>
          <List.Section>
            <List.Item
              title="Date"
              description={format(date, 'PPP')}
              onPress={() => setShowDate(true)}
            />
            <List.Item
              title="Time"
              description={format(time, 'p')}
              onPress={() => setShowTime(true)}
            />
          </List.Section>
        </Card.Content>
      </Card>

      {/* pickers – rendered only when needed */}
      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.select({ ios: 'inline', android: 'default' })}
          onChange={onDateChange}
        />
      )}

      {showTime && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      <View style={styles.actions}>
        <Button mode="outlined" onPress={() => nav.goBack()} style={styles.btn}>
          Cancel
        </Button>
        <Button mode="contained" onPress={confirm} style={styles.btn}>
          Confirm
        </Button>
      </View>
    </View>
  );
}

/* ─── styles ────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  card: { paddingBottom: 8 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  btn: { flex: 1, marginHorizontal: 4 },
});
