import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { priceText } from "../../components/CarCards";
import { DateSheet } from "../../components/DateSheet";
import { BackHeader } from "../../components/Header";
import { GoldButton, Icon, type IconName } from "../../components/ui";
import { createBooking, fetchBusy, fetchCar, type BookingError } from "../../lib/api";
import { rangeBlocked, startBlocked, type BusyRange } from "../../lib/busy";
import { formatPhoneLocal, formatSum, rentalDays, totalPrice } from "../../lib/format";
import { carImage } from "../../lib/images";
import { useStore } from "../../lib/store";
import { c, f, t } from "../../lib/theme";

const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:00`;

function defaultStart() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 10, 0);
}

function Field({ label, extra, children, error }: { label: string; extra?: string; children: ReactNode; error?: string | null }) {
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={s.label} numberOfLines={1}>{label}</Text>
        {extra ? <Text style={[t.labelSm, { color: c.outline }]}>{extra}</Text> : null}
      </View>
      {children}
      {error ? <Text style={s.err}>{error}</Text> : null}
    </View>
  );
}

export default function Book() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { t: d, locale, cars } = useStore();
  const insets = useSafeAreaInsets();
  const car = cars.find((x) => x.slug === slug);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(() => new Date(defaultStart().getTime() + 86_400_000));
  const [sheet, setSheet] = useState<"start" | "end" | null>(null);
  const [pickup, setPickup] = useState<"OFFICE" | "DELIVERY">("DELIVERY");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<BookingError | null>(null);
  const [sending, setSending] = useState(false);
  const today = useMemo(() => new Date(), []);
  const [busy, setBusy] = useState<BusyRange[]>([]);
  const loadBusy = useCallback(() => { if (slug) fetchBusy(slug).then(setBusy); }, [slug]);
  useEffect(loadBusy, [loadBusy]);

  if (!car) return <View style={{ flex: 1, backgroundColor: c.surface }}><BackHeader title={d.form.title} /></View>;

  const days = rentalDays(start, end);
  const total = totalPrice(car, days);
  const tbd = d.common.tbd;
  const errText = (k: BookingError) => (error === k ? d.form.errors[k] : null);

  const conflict = end > start && rangeBlocked(busy, start, end);
  const changeStart = (v: Date) => {
    setStart(v);
    if (end <= v) setEnd(new Date(v.getTime() + 86_400_000));
    if (error === "busy") setError(null);
  };
  const changeEnd = (v: Date) => {
    setEnd(v);
    if (error === "busy") setError(null);
  };

  const submit = async () => {
    // Tekshiruvlar saytdagi API bilan bir xil
    if (name.trim().length < 2) return setError("name");
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 9) return setError("phone");
    if (end <= start) return setError("dates");
    if (start.getTime() < Date.now() - 3_600_000) return setError("past");
    if (conflict) return setError("busy");
    if (pickup === "DELIVERY" && !address.trim()) return setError("address");
    setError(null);
    setSending(true);
    try {
      const carId = car.id ?? (await fetchCar(car.slug).catch(() => null))?.id;
      if (!carId) return setError("network");
      const res = await createBooking({
        carId, name: name.trim(), phone: `+998${digits}`, startAt: start.toISOString(), endAt: end.toISOString(),
        pickupType: pickup, address: pickup === "DELIVERY" ? address.trim() : undefined, comment: comment.trim() || undefined, locale,
      });
      if (!res.ok) {
        if (res.error === "busy") loadBusy();
        return setError(res.error);
      }
      router.replace({
        pathname: "/done",
        params: {
          code: res.code, slug: car.slug, start: start.toISOString(), end: end.toISOString(), days: String(days), pickup,
          address: address.trim(), name: name.trim(), phone: `+998 ${formatPhoneLocal(digits)}`, total: total ? String(total) : "",
        },
      });
    } finally {
      setSending(false);
    }
  };

  const choices: ["OFFICE" | "DELIVERY", IconName, string][] = [
    ["DELIVERY", "local-shipping", d.form.delivery],
    ["OFFICE", "storefront", d.form.office],
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <BackHeader title={d.form.title} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: insets.bottom + 32 }} keyboardShouldPersistTaps="handled">
          {/* Tanlangan mashina */}
          <View style={s.carCard}>
            <Image source={carImage(car.images[0])} style={s.thumb} contentFit="cover" />
            <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
              <Text style={[t.headlineSm, { fontFamily: f.display, fontSize: 17, lineHeight: 21 }]} numberOfLines={2}>{car.brand} {car.model}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={s.classTag}>{d.carClass[car.carClass]}</Text>
                <Icon name="verified" size={13} />
                <Text style={[t.labelSm, { color: c.onVariant }]}>{d.bodyType[car.bodyType]}</Text>
              </View>
              <Text style={[t.labelLg, { fontFamily: f.displaySemi, color: c.primary }]} numberOfLines={1}>{priceText(car.pricePerDay, d)}</Text>
            </View>
          </View>

          <Field label={d.form.name} error={errText("name")}>
            <View style={[s.input, error === "name" && s.inputErr]}>
              <Icon name="person" size={20} color={c.outline} />
              <TextInput value={name} onChangeText={setName} placeholder={d.form.namePh} placeholderTextColor={c.outline} style={s.text} autoComplete="name" textContentType="name" maxLength={80} />
            </View>
          </Field>

          <Field label={d.form.phone} error={errText("phone")}>
            <View style={[s.input, error === "phone" && s.inputErr]}>
              <Text style={{ fontSize: 18 }}>🇺🇿</Text>
              <Text style={[t.labelMd, { fontFamily: f.display, color: c.primary }]}>+998</Text>
              <TextInput
                value={formatPhoneLocal(phone)}
                onChangeText={(v) => setPhone(v.replace(/\D/g, "").replace(/^998(?=\d{9})/, "").slice(0, 9))}
                placeholder="90 123 45 67"
                placeholderTextColor={c.outline}
                keyboardType="phone-pad"
                style={[s.text, { marginLeft: 6 }]}
                autoComplete="tel"
                textContentType="telephoneNumber"
              />
            </View>
          </Field>

          <View style={{ flexDirection: "row", gap: 10 }}>
            {([["start", d.form.start, "calendar-month", start], ["end", d.form.end, "event-available", end]] as const).map(([k, label, icon, v]) => (
              <View key={k} style={{ flex: 1 }}>
                <Field label={label}>
                  <Pressable onPress={() => setSheet(k)} style={[s.input, s.dateInput, ((k === "end" && (error === "dates" || conflict)) || (k === "start" && error === "past")) && s.inputErr]}>
                    <Icon name={icon} size={18} color={c.outline} />
                    <Text style={[t.bodySm, { color: c.onSurface, flex: 1 }]} numberOfLines={1}>{fmt(v)}</Text>
                  </Pressable>
                </Field>
              </View>
            ))}
          </View>
          {errText("dates") || errText("past") || conflict || error === "busy" ? (
            <Text style={[s.err, { marginTop: -10 }]}>{errText("dates") ?? errText("past") ?? d.form.errors.busy}</Text>
          ) : null}

          <Field label={d.form.pickup}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {choices.map(([k, icon, label]) => {
                const active = pickup === k;
                return (
                  <Pressable key={k} onPress={() => setPickup(k)} style={[s.choice, active && s.choiceActive]}>
                    <Icon name={icon} size={19} color={active ? c.primary : c.onVariant} />
                    <Text style={[t.labelLg, { color: active ? c.primary : c.onVariant, flexShrink: 1 }]} numberOfLines={2}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          {pickup === "DELIVERY" && (
            <Field label={d.form.address} error={errText("address")}>
              <View style={[s.input, error === "address" && s.inputErr]}>
                <Icon name="location-on" size={20} color={c.outline} />
                <TextInput value={address} onChangeText={setAddress} placeholder={d.form.addressPh} placeholderTextColor={c.outline} style={s.text} maxLength={200} />
              </View>
            </Field>
          )}

          <Field label={d.form.comment} extra={d.form.optional}>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder={d.form.commentPh}
              placeholderTextColor={c.outline}
              multiline
              maxLength={500}
              style={[s.input, s.text, { minHeight: 76, textAlignVertical: "top", paddingTop: 12, paddingHorizontal: 16 }]}
            />
          </Field>

          {/* Hisob-kitob */}
          <View style={s.summary}>
            <View style={s.sumRow}>
              <Text style={t.bodySm}>{days} {d.form.rent}</Text>
              <Text style={[t.labelMd, { letterSpacing: 0.2 }]}>{total ? `${formatSum(total)} ${d.common.sum}` : d.form.managerSays}</Text>
            </View>
            {pickup === "DELIVERY" && (
              <View style={s.sumRow}>
                <Text style={t.bodySm}>{d.form.deliveryFee}</Text>
                <Text style={[t.labelMd, { color: c.secondary, letterSpacing: 0.2 }]}>{tbd}</Text>
              </View>
            )}
            <View style={s.sumRow}>
              <Text style={t.bodySm}>{d.form.deposit}</Text>
              <Text style={[t.labelMd, { letterSpacing: 0.2 }]}>{car.deposit ? `${formatSum(car.deposit)} ${d.common.sum}` : tbd}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: c.high, marginVertical: 2 }} />
            <View style={s.sumRow}>
              <Text style={[t.labelLg, { fontFamily: f.displaySemi, textTransform: "uppercase" }]}>{d.form.total}</Text>
              <Text style={[t.headlineSm, { fontFamily: f.display, color: c.primary, letterSpacing: -0.2 }]}>{total ? `${formatSum(total)} ${d.common.sum}` : d.form.managerSays}</Text>
            </View>
          </View>

          {error && ["rate", "server", "network"].includes(error) ? (
            <View style={s.alert}>
              <Icon name="error-outline" color={c.error} />
              <Text style={[s.err, { marginTop: 0, flex: 1 }]}>{d.form.errors[error]}</Text>
            </View>
          ) : null}

          <GoldButton
            label={(sending ? d.form.sending : d.form.submit).toUpperCase()}
            iconRight={sending ? undefined : "arrow-forward"}
            loading={sending}
            onPress={submit}
            height={54}
            textStyle={{ letterSpacing: 1.2 }}
            style={{ marginTop: 4 }}
          />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 16 }}>
            <Icon name="verified-user" size={17} />
            <Text style={[t.bodySm, { textAlign: "center", flexShrink: 1 }]}>{d.form.note}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DateSheet
        visible={sheet !== null}
        title={sheet === "end" ? d.form.end : d.form.start}
        value={sheet === "end" ? end : start}
        onChange={sheet === "end" ? changeEnd : changeStart}
        blocked={sheet === "end" ? (v) => v > start && rangeBlocked(busy, start, v) : (v) => startBlocked(busy, v)}
        hasBusy={busy.length > 0}
        onClose={() => setSheet(null)}
        minDay={sheet === "end" ? start : today}
        locale={locale}
        d={d}
      />
    </View>
  );
}

const s = StyleSheet.create({
  carCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: c.low, borderRadius: 12, padding: 14 },
  thumb: { width: 96, height: 80, borderRadius: 8, backgroundColor: c.lowest },
  classTag: { ...t.labelSm, color: c.secondary, textTransform: "uppercase", backgroundColor: c.highest, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: "hidden" },
  label: { ...t.labelMd, color: c.onVariant, textTransform: "uppercase", letterSpacing: 0.9 },
  input: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: c.low, borderRadius: 12, paddingHorizontal: 14, minHeight: 52, borderWidth: 1, borderColor: "transparent" },
  dateInput: { paddingHorizontal: 12, minHeight: 46, gap: 8 },
  inputErr: { borderColor: c.error },
  text: { flex: 1, fontFamily: f.body, fontSize: 15, color: c.onSurface, paddingVertical: 12, ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null) },
  err: { fontFamily: f.body, fontSize: 12.5, color: c.error },
  choice: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, backgroundColor: c.low },
  choiceActive: { backgroundColor: c.high },
  summary: { backgroundColor: c.lowest, borderRadius: 12, padding: 14, gap: 10 },
  sumRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  alert: { flexDirection: "row", gap: 8, alignItems: "center", borderRadius: 12, backgroundColor: "rgba(255,180,171,0.08)", padding: 12 },
});
