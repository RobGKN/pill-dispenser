// screens/DayDetail.tsx
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import {
  parseISO,
  format,
  isSameDay,
  isAfter,
  parse,
  addSeconds,
} from 'date-fns';

import { useDeviceContext } from '../contexts/DeviceContext';
import { DoseEvent, DoseWindow } from '../types/models';

type RouteParams = { id: string; date: string }; // date = '2025-06-15'

/* ─── helper: classify status ────────────────────────────── */
function getStatus(
  window: DoseWindow,
  events: DoseEvent[],
  targetDate: Date,
): 'green' | 'yellow' | 'red' | 'grey' {
  const fulfilled = events.length >= window.required;
  const today = new Date();
  if (isAfter(targetDate, today)) return 'grey';
  if (fulfilled) return 'green';
  if (events.length > 0) return 'yellow';
  return 'red';
}

/* ─── screen ─────────────────────────────────────────────── */
export default function DayDetail() {
  const [{ devices, events }] = useDeviceContext();
  const { id, date } = useRoute<{
    key: string;
    name: string;
    params: RouteParams;
  }>().params;

  const device = devices[id];
  const dayDate = parse(date, 'yyyy-MM-dd', new Date());

  /* group events by window */
  const eventsForDay = (events[id] ?? []).filter((e) =>
    isSameDay(parseISO(e.timestamp), dayDate),
  );

  const eventsByWindow: Record<string, DoseEvent[]> = {};
  device.windows.forEach((w) => (eventsByWindow[w.id] = []));
  eventsForDay.forEach((ev) => {
    device.windows.forEach((w) => {
      const start = parse(`${date} ${w.start}`, 'yyyy-MM-dd HH:mm', new Date());
      const end = parse(`${date} ${w.end}`, 'yyyy-MM-dd HH:mm', new Date());
      const ts = parseISO(ev.timestamp);
      if (ts >= start && ts <= addSeconds(end, 59)) {
        eventsByWindow[w.id].push(ev);
      }
    });
  });

  /* ─── ui ──────────────────────────────────────────────── */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {format(dayDate, 'eeee, d LLL yyyy')}
      </Text>

      {device.windows.map((w) => {
        const evs = eventsByWindow[w.id];
        const status = getStatus(w, evs, dayDate);

        const chipColor =
          status === 'green'
            ? '#34c759'
            : status === 'yellow'
            ? '#ffcc00'
            : status === 'red'
            ? '#ff3b30'
            : '#9e9e9e';

        return (
          <Card key={w.id} style={styles.card}>
            <Card.Title
              title={w.label ?? 'Window'}
              subtitle={`${w.start} – ${w.end}   •   required ${w.required}`}
              right={() => (
                <Chip
                  style={[styles.chip, { backgroundColor: chipColor }]}
                  textStyle={styles.chipText}
                >
                  {status.toUpperCase()}
                </Chip>
              )}
            />
            {evs.length > 0 ? (
              evs.map((e) => (
                <View key={e.id} style={styles.eventRow}>
                  <Text>{format(parseISO(e.timestamp), 'p')}</Text>
                  <Text style={styles.eventSource}>{e.source}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noEvent}>— no doses logged —</Text>
            )}
          </Card>
        );
      })}
    </ScrollView>
  );
}

/* ─── styles ─────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  title: { marginBottom: 12 },
  card: { marginBottom: 14 },
  chip: { alignSelf: 'center' },
  chipText: { color: '#fff', fontWeight: '600' },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingVertical: 2,
  },
  eventSource: { fontStyle: 'italic', opacity: 0.7 },
  noEvent: { marginLeft: 16, marginBottom: 8, opacity: 0.6 },
});
