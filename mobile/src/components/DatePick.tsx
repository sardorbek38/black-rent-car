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

/** blocked: shu vaqtni tanlab bo'lmaydi (mashina band). Hamma soati band kun o'chiriladi. */
export function DatePick({ value, onChange, minDay, locale, t, blocked }: {
  value: Date; onChange: (d: Date) => void; minDay: Date; locale: Locale; t: Dict; blocked?: (d: Date) => boolean;
}) {
  const days = useMemo(() => {
    const base = startOfDay(minDay);
    return Array.from({ length: 31 }, (_, i) => new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
  }, [minDay]);
  const today = startOfDay(new Date());
  const now = new Date();
  const hourOff = (day: Date, h: number) =>
    (sameDay(day, now) && h <= now.getHours()) || !!blocked?.(new Date(day.getFullYear(), day.getMonth(), day.getDate(), h));
  const dayState = (day: Date) => {
    if (!blocked) return "free";
    let off = 0, open = 0;
    for (const h of HOURS) {
      if (sameDay(day, now) && h <= now.getHours()) continue;
      if (blocked(new Date(day.getFullYear(), day.getMonth(), day.getDate(), h))) off++; else open++;
    }
    return open === 0 ? "busy" : off > 0 ? "partial" : "free";
  };

  const pickDay = (d: Date) => onChange(new Date(d.getFullYear(), d.getMonth(), d.getDate(), value.getHours(), 0));
  const pickHour = (h: number) => onChange(new Date(value.getFullYear(), value.getMonth(), value.getDate(), h, 0));

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
          const state = dayState(d);
          const full = state === "busy" && !active;
          const top = full ? t.form.busyDay : diff === 0 ? t.form.today : diff === 1 ? t.form.tomorrow : WEEK[locale][d.getDay()];
          return (
            <Pressable key={d.toISOString()} disabled={full} onPress={() => pickDay(d)} style={[st.day, active && st.active, full && st.dayBusy]}>
              <Text style={[st.dayTop, active && { color: c.onPrimary }, full && { color: c.error }]} numberOfLines={1}>{top}</Text>
              <Text style={[st.dayNum, active && { color: c.onPrimary }]}>{d.getDate()}</Text>
              <Text style={[st.dayTop, active && { color: c.onPrimary }]}>{MONTH[locale][d.getMonth()]}</Text>
              {state === "partial" && <View style={[st.dot, active && { backgroundColor: c.onPrimary }]} />}
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView ref={hourRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {HOURS.map((h) => {
          const active = value.getHours() === h;
          const off = hourOff(value, h);
          return (
            <Pressable key={h} disabled={off} onPress={() => pickHour(h)} style={[st.hour, active && st.active, off && { opacity: 0.3 }]}>
              <Text style={[st.hourText, active && { color: c.onPrimary }, off && !active && { textDecorationLine: "line-through" }]}>{String(h).padStart(2, "0")}:00</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  day: { width: DAY_W, alignItems: "center", paddingVertical: 9, borderRadius: 14, borderWidth: 1, borderColor: c.high, backgroundColor: c.low, gap: 1 },
  dayBusy: { opacity: 0.45, borderColor: c.error },
  dot: { position: "absolute", bottom: 4, width: 4, height: 4, borderRadius: 2, backgroundColor: c.error },
  active: { backgroundColor: c.primary, borderColor: c.primary },
  dayTop: { fontFamily: f.body, fontSize: 11, color: c.outline },
  dayNum: { fontFamily: f.display, fontSize: 18, color: c.onSurface },
  hour: { width: HOUR_W, alignItems: "center", paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: c.high, backgroundColor: c.low },
  hourText: { fontFamily: f.bodySemi, fontSize: 13, color: c.onSurface },
});
