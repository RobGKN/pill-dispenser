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
  isBefore,
  isSameDay,
  parseISO,
  isAfter,
} from 'date-fns';

import { useDeviceContext } from '../contexts/DeviceContext';
import { DoseEvent } from '../types/models';

/* ------------------------------------------------------------------ */
/*  Utilities                                                         */
/* ------------------------------------------------------------------ */

/** Returns HH:mm string of the next upcoming window start. */
function getNextDose(device: any) {
  const now = new Date();
  const todayMinutes = now.getHours() * 60 + now.getMinutes();

  const sorted = [...device.windows].sort(
    (a: any, b: any) =>
      Number(a.start.split(':')[0]) * 60 +
      Number(a.start.split(':')[1]) -
      (Number(b.start.split(':')[0]) * 60 + Number(b.start.split(':')[1])),
  );

  for (const w of sorted) {
    const [h, m] = w.start.split(':').map(Number);
    if (h * 60 + m >= todayMinutes) return w.start;
  }
  return `${sorted[0].start} (tomorrow)`;
}

/** Build marked-dates object for react-native-calendars */
function buildCalendarMarks(
  events: DoseEvent[],
  windows: any[],
): Record<string, any> {
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const grouped: Record<string, DoseEvent[]> = {};
  events.forEach((e) => {
    const d = format(parseISO(e.timestamp), 'yyyy-MM-dd');
    grouped[d] = (grouped[d] || []).concat(e);
  });

  const marks: Record<string, any> = {};
  days.forEach((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const todaysEvents = grouped[dateStr] || [];
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

/* ------------------------------------------------------------------ */
/*  Screen                                                            */
/* ------------------------------------------------------------------ */
export default function DeviceSummary() {
  const { params } = useRoute<any>(); // { id }
  const nav =
    useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const [{ devices, events }] = useDeviceContext();

  const device = devices[params.id];
  const eventArr = events[device.id] ?? [];

  /* derived */
  const nextDose = getNextDose(device);
  const marks = React.useMemo(
    () => buildCalendarMarks(eventArr, device.windows),
    [eventArr, device.windows],
  );

  /* when user taps a date */
  const onDayPress = (day: { dateString: string }) => {
    nav.navigate('DayDetail', {
        id: device.id,
        date: day.dateString, //'YYYY-MM-DD'
    })
  };

  /* UI ---------------------------------------------------------------- */
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
      {device.windows.map((w: any) => (
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

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 48 },
  nextCard: { marginBottom: 16 },
  sectionTitle: { marginTop: 12, marginBottom: 4 },
  calendar: { borderRadius: 12, elevation: 2, marginBottom: 16 },
  windowCard: { marginBottom: 10 },
  actions: { marginTop: 20 },
  actionBtn: { borderRadius: 8 },
});
