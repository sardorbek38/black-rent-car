import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DatePick } from "../../components/DatePick";
import { Card, GoldButton, Icon, Kicker, type IconName } from "../../components/ui";
import { createBooking, fetchCar, type BookingError } from "../../lib/api";
import { formatPhoneLocal, formatSum, rentalDays, totalPrice } from "../../lib/format";
import { carImage } from "../../lib/images";
import { useStore } from "../../lib/store";
import { c, f } from "../../lib/theme";

function defaultStart() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 10, 0);
}

function Label({ children, extra }: { children: string; extra?: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
      <Text style={st.label}>{children}</Text>
      {extra ? <Text style={st.extra}>{extra}</Text> : null}
    </View>
  );
}

export default function Book() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { t, locale, cars } = useStore();
  const insets = useSafeAreaInsets();
  const car = cars.find((x) => x.slug === slug);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(() => new Date(defaultStart().getTime() + 86_400_000));
  const [pickup, setPickup] = useState<"OFFICE" | "DELIVERY">("OFFICE");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<BookingError | null>(null);
  const [sending, setSending] = useState(false);

  const days = rentalDays(start, end);
  const total = car ? totalPrice(car, days) : null;
  const today = useMemo(() => new Date(), []);

  if (!car) return null;

  const changeStart = (d: Date) => {
    setStart(d);
    if (end <= d) setEnd(new Date(d.getTime() + 86_400_000));
  };

  const submit = async () => {
    // Tekshiruvlar saytdagi API bilan bir xil
    if (name.trim().length < 2) return setError("name");
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 9) return setError("phone");
    if (end <= start) return setError("dates");
    if (start.getTime() < Date.now() - 3_600_000) return setError("past");
    if (pickup === "DELIVERY" && !address.trim()) return setError("address");
    setError(null);
    setSending(true);
    try {
      // Zaxira ro'yxatda id bo'lmaydi: saytdan olib kelamiz
      const carId = car.id ?? (await fetchCar(car.slug).catch(() => null))?.id;
      if (!carId) return setError("network");
      const res = await createBooking({
        carId, name: name.trim(), phone: `+998${digits}`, startAt: start.toISOString(), endAt: end.toISOString(),
        pickupType: pickup, address: pickup === "DELIVERY" ? address.trim() : undefined, comment: comment.trim() || undefined, locale,
      });
      if (!res.ok) return setError(res.error);
      router.replace({
        pathname: "/done",
        params: {
          code: res.code, car: `${car.brand} ${car.model}`, slug: car.slug, start: start.toISOString(), end: end.toISOString(),
          days: String(days), pickup, address: address.trim(), name: name.trim(), phone: `+998 ${formatPhoneLocal(digits)}`,
          total: total ? String(total) : "",
        },
      });
    } finally {
      setSending(false);
    }
  };

  const fieldErr = (k: BookingError) => (error === k ? <Text style={st.err}>{t.form.errors[k]}</Text> : null);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.ink }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Stack.Screen options={{ title: t.form.title }} />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: insets.bottom + 32 }} keyboardShouldPersistTaps="handled">
        {/* Mashina */}
        <Card style={st.carRow}>
          <Image source={carImage(car.images[0])} style={st.thumb} contentFit="cover" />
          <View style={{ flex: 1 }}>
            <Kicker style={{ fontSize: 10 }}>{t.carClass[car.carClass]}</Kicker>
            <Text style={st.carName}>{car.brand} {car.model}</Text>
            <Text style={st.carPrice}>{car.pricePerDay ? `${formatSum(car.pricePerDay)} ${t.common.perDay}` : t.common.priceOnRequest}</Text>
          </View>
        </Card>

        <View>
          <Label>{t.form.name}</Label>
          <View style={[st.input, error === "name" && st.inputErr]}>
            <Icon name="person-outline" color={c.dim} />
            <TextInput value={name} onChangeText={setName} placeholder={t.form.namePh} placeholderTextColor={c.dim} style={st.text} autoComplete="name" textContentType="name" maxLength={80} />
          </View>
          {fieldErr("name")}
        </View>

        <View>
          <Label>{t.form.phone}</Label>
          <View style={[st.input, error === "phone" && st.inputErr]}>
            <Text style={st.prefix}>+998</Text>
            <TextInput
              value={formatPhoneLocal(phone)}
              onChangeText={(v) => setPhone(v.replace(/\D/g, "").replace(/^998(?=\d{9})/, "").slice(0, 9))}
              placeholder="90 123 45 67"
              placeholderTextColor={c.dim}
              keyboardType="phone-pad"
              style={st.text}
              autoComplete="tel"
              textContentType="telephoneNumber"
            />
          </View>
          {fieldErr("phone")}
        </View>

        <View>
          <Label>{t.form.start}</Label>
          <DatePick value={start} onChange={changeStart} minDay={today} locale={locale} t={t} />
          {fieldErr("past")}
        </View>

        <View>
          <Label>{t.form.end}</Label>
          <DatePick value={end} onChange={setEnd} minDay={start} locale={locale} t={t} />
          {fieldErr("dates")}
        </View>

        <View>
          <Label>{t.form.pickup}</Label>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {([["OFFICE", "storefront", t.form.office], ["DELIVERY", "local-shipping", t.form.delivery]] as const).map(([k, icon, label]) => (
              <Pressable key={k} onPress={() => setPickup(k)} style={[st.option, pickup === k && st.optionActive]}>
                <Icon name={icon as IconName} color={pickup === k ? c.gold : c.muted} size={20} />
                <Text style={[st.optionText, pickup === k && { color: c.gold }]}>{label}</Text>
              </Pressable>
            ))}
          </View>
          {pickup === "DELIVERY" && (
            <View style={{ marginTop: 10 }}>
              <View style={[st.input, error === "address" && st.inputErr]}>
                <Icon name="location-on" color={c.dim} />
                <TextInput value={address} onChangeText={setAddress} placeholder={t.form.addressPh} placeholderTextColor={c.dim} style={st.text} maxLength={200} />
              </View>
              {fieldErr("address")}
            </View>
          )}
        </View>

        <View>
          <Label extra={t.form.optional}>{t.form.comment}</Label>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder={t.form.commentPh}
            placeholderTextColor={c.dim}
            multiline
            maxLength={500}
            style={[st.input, st.text, { minHeight: 84, textAlignVertical: "top", paddingTop: 14 }]}
          />
        </View>

        <Card style={{ padding: 16, gap: 12 }}>
          <View style={st.sumRow}>
            <Text style={st.sumLabel}>{t.form.days}</Text>
            <Text style={st.sumValue}>{days} {t.form.dayUnit}</Text>
          </View>
          <View style={[st.sumRow, { borderTopWidth: 1, borderTopColor: c.line, paddingTop: 12 }]}>
            <Text style={st.label}>{t.form.total}</Text>
            <Text style={st.total}>{total ? `${formatSum(total)} ${t.common.sum}` : t.form.totalTbd}</Text>
          </View>
        </Card>

        {error && ["rate", "server", "network"].includes(error) ? (
          <View style={st.alert}>
            <Icon name="error-outline" color={c.danger} />
            <Text style={[st.err, { marginTop: 0, flex: 1 }]}>{t.form.errors[error]}</Text>
          </View>
        ) : null}

        <GoldButton label={sending ? t.form.sending : t.form.submit} icon={sending ? undefined : "arrow-forward"} loading={sending} onPress={submit} />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Icon name="verified-user" size={16} />
          <Text style={st.note}>{t.form.note}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  carRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 10 },
  thumb: { width: 104, height: 62, borderRadius: 12, backgroundColor: c.raised },
  carName: { fontFamily: f.displaySemi, fontSize: 16, color: c.fg, marginTop: 2 },
  carPrice: { fontFamily: f.bodySemi, fontSize: 13, color: c.gold, marginTop: 2 },
  label: { fontFamily: f.display, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: c.muted },
  extra: { fontFamily: f.body, fontSize: 11, color: c.dim },
  input: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, paddingHorizontal: 14, minHeight: 52 },
  inputErr: { borderColor: c.danger },
  text: { flex: 1, fontFamily: f.body, fontSize: 16, color: c.fg, paddingVertical: 12 },
  prefix: { fontFamily: f.bodySemi, fontSize: 16, color: c.gold },
  err: { fontFamily: f.body, fontSize: 12.5, color: c.danger, marginTop: 6 },
  option: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 14, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, padding: 14 },
  optionActive: { borderColor: c.gold, backgroundColor: "rgba(201,164,92,0.1)" },
  optionText: { flex: 1, fontFamily: f.bodySemi, fontSize: 13, color: c.muted },
  sumRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sumLabel: { fontFamily: f.body, fontSize: 14, color: c.muted },
  sumValue: { fontFamily: f.bodySemi, fontSize: 14, color: c.fg },
  total: { fontFamily: f.display, fontSize: 18, color: c.gold },
  alert: { flexDirection: "row", gap: 8, alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,180,171,0.3)", backgroundColor: "rgba(255,180,171,0.08)", padding: 12 },
  note: { flex: 1, fontFamily: f.body, fontSize: 12.5, lineHeight: 18, color: c.dim },
});
