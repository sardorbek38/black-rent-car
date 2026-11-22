import { useEffect, useMemo, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from "react-native";
import type { Dict, Locale } from "../lib/i18n";
import { c, f } from "../lib/theme";

// Mahalliy sana tanlagich: 30 kunlik kunlar qatori + soatlar qatori.
// Tizim kalendari o'rniga: tezroq, bir xil ko'rinadi va qo'shimcha kutubxona kerak emas.

const WEEK = {
  uz: ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"],
  ru: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
};
const MONTH = {
  uz: ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"],
  ru: ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
};
const DAY_W = 60;
const HOUR_W = 66;
const HOURS = Array.from({ length: 24 }, (_, h) => h);

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();

export function DatePick({ value, onChange, minDay, locale, t }: { value: Date; onChange: (d: Date) => void; minDay: Date; locale: Locale; t: Dict }) {
  const days = useMemo(() => {
    const base = startOfDay(minDay);
    return Array.from({ length: 31 }, (_, i) => new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
  }, [minDay]);
  const today = startOfDay(new Date());

  const pickDay = (d: Date) => onChange(new Date(d.getFullYear(), d.getMonth(), d.getDate(), value.getHours(), 0));
  const pickHour = (h: number) => onChange(new Date(value.getFullYear(), value.getMonth(), value.getDate(), h, 0));
  const now = new Date();

  // Tanlangan kun va soatni ko'rinadigan joyga aylantiramiz
  const dayRef = useRef<ScrollViewInstance>(null);
  const hourRef = useRef<ScrollViewInstance>(null);
  const dayIndex = days.findIndex((d) => sameDay(d, value));
  const hour = value.getHours();
  useEffect(() => {
    const id = setTimeout(() => {
      dayRef.current?.scrollTo({ x: Math.max(0, (dayIndex - 1) * (DAY_W + 8)), animated: true });
      hourRef.current?.scrollTo({ x: Math.max(0, (hour - 2) * (HOUR_W + 6)), animated: true });
    }, 50);
    return () => clearTimeout(id);
  }, [dayIndex, hour]);

  return (
    <View style={{ gap: 8 }}>
      <ScrollView ref={dayRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {days.map((d) => {
          const active = sameDay(d, value);
          const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
          const top = diff === 0 ? t.form.today : diff === 1 ? t.form.tomorrow : WEEK[locale][d.getDay()];
          return (
            <Pressable key={d.toISOString()} onPress={() => pickDay(d)} style={[st.day, active && st.active]}>
              <Text style={[st.dayTop, active && { color: c.onPrimary }]} numberOfLines={1}>{top}</Text>
              <Text style={[st.dayNum, active && { color: c.onPrimary }]}>{d.getDate()}</Text>
              <Text style={[st.dayTop, active && { color: c.onPrimary }]}>{MONTH[locale][d.getMonth()]}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView ref={hourRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {HOURS.map((h) => {
          const active = value.getHours() === h;
          const past = sameDay(value, now) && h <= now.getHours();
          return (
            <Pressable key={h} disabled={past} onPress={() => pickHour(h)} style={[st.hour, active && st.active, past && { opacity: 0.3 }]}>
              <Text style={[st.hourText, active && { color: c.onPrimary }]}>{String(h).padStart(2, "0")}:00</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  day: { width: DAY_W, alignItems: "center", paddingVertical: 9, borderRadius: 14, borderWidth: 1, borderColor: c.high, backgroundColor: c.low, gap: 1 },
  active: { backgroundColor: c.primary, borderColor: c.primary },
  dayTop: { fontFamily: f.body, fontSize: 11, color: c.outline },
  dayNum: { fontFamily: f.display, fontSize: 18, color: c.onSurface },
  hour: { width: HOUR_W, alignItems: "center", paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: c.high, backgroundColor: c.low },
  hourText: { fontFamily: f.bodySemi, fontSize: 13, color: c.onSurface },
});
