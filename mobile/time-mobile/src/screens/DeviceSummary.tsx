// screens/DeviceSummary.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  parseISO,
  isAfter,
} from 'date-fns';

import { scheduleForDate } from '../utils/scheduleHelpers';
import { useDeviceContext } from '../contexts/DeviceContext';
import { DoseEvent } from '../types/models';

/* ---------- helpers ---------- */
function getNextDose(schedule: { windows: any[] }) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const sorted = [...schedule.windows].sort(
    (a, b) =>
      Number(a.start.split(':')[0]) * 60 +
      Number(a.start.split(':')[1]) -
      (Number(b.start.split(':')[0]) * 60 + Number(b.start.split(':')[1])),
  );

  for (const w of sorted) {
    const [h, m] = w.start.split(':').map(Number);
    if (h * 60 + m >= nowMin) return w.start;
  }
  return `${sorted[0].start} (tomorrow)`;
}

function buildCalendarMarks(events: DoseEvent[], windows: any[]) {
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const grouped: Record<string, DoseEvent[]> = {};
  events.forEach((e) => {
    const d = format(parseISO(e.timestamp), 'yyyy-MM-dd');
    (grouped[d] ??= []).push(e);
  });

  const marks: Record<string, any> = {};
  days.forEach((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const todaysEvents = grouped[dateStr] ?? [];
    const met = todaysEvents.length >= windows.length;

    marks[dateStr] = {
      selected: false,
      marked: true,
      dotColor: met
        ? '#34c759'
        : todaysEvents.length > 0
        ? '#ffcc00'
        : isAfter(day, new Date())
        ? '#9e9e9e'
        : '#ff3b30',
    };
  });
  return marks;
}

/* ---------- screen ---------- */
export default function DeviceSummary() {
  const route = useRoute(); // { id }
  const nav =
    useNavigation<NavigationProp<{ DayDetail: { id: string; date: string }; AddDose: { id: string }; Device: { screen: string; params: { id: string } } }>>();
  
    if (!route.params) {
      return (
        <View style={styles.center}>
          <Text>Missing device id. Use Home → select a dispenser.</Text>
          <Button onPress={() => nav.goBack()}>Go back</Button>
        </View>
      );
    }

  /* context */
  const [{ devices, schedules, events }] = useDeviceContext();
  const device = devices[route.params.id];

  /* resolve today's schedule */
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaySchedule = scheduleForDate(schedules, device.id, todayStr)!;

  const eventArr = events[device.id] ?? [];

  /* derived */
  const nextDose = getNextDose(todaySchedule);
  const marks = React.useMemo(
    () => buildCalendarMarks(eventArr, todaySchedule.windows),
    [eventArr, todaySchedule.windows],
  );

  const onDayPress = (day: { dateString: string }) => {
    nav.navigate('DayDetail', { id: device.id, date: day.dateString });
  };

  /* ---------- ui ---------- */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* next dose */}
      <Card style={styles.nextCard}>
        <Card.Content>
          <Text variant="titleLarge">Next dose</Text>
          <Text variant="headlineMedium">{nextDose}</Text>
        </Card.Content>
      </Card>

      {/* calendar */}
      <Text variant="titleLarge" style={styles.sectionTitle}>
        This month
      </Text>
      <Calendar
        markedDates={marks}
        hideExtraDays
        enableSwipeMonths
        onDayPress={onDayPress}
        style={styles.calendar}
      />

      {/* windows list */}
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Dose windows
      </Text>
      {todaySchedule.windows.map((w) => (
        <Card key={w.id} style={styles.windowCard}>
          <Card.Title
            title={w.label ?? 'Untitled window'}
            subtitle={`${w.start} – ${w.end}   •   required: ${w.required}`}
          />
        </Card>
      ))}

      {/* actions */}
      <View style={styles.actions}>
        <Button
          mode="contained"
          style={styles.actionBtn}
          onPress={() => nav.navigate('AddDose', { id: device.id })}
        >
          Add dose manually
        </Button>

        <View style={{ height: 12 }} />

        <Button
          mode="contained-tonal"
          style={styles.actionBtn}
          onPress={() =>
            nav.navigate('Device', {
              screen: 'Settings',
              params: { id: device.id },
            })
          }
        >
          Device settings
        </Button>
      </View>
    </ScrollView>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48 },
  nextCard: { marginBottom: 16 },
  sectionTitle: { marginTop: 12, marginBottom: 4 },
  calendar: { borderRadius: 12, elevation: 2, marginBottom: 16 },
  windowCard: { marginBottom: 10 },
  actions: { marginTop: 20 },
  actionBtn: { borderRadius: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
