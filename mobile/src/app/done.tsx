import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DarkButton, GoldButton, Icon, type IconName } from "../components/ui";
import { formatSum } from "../lib/format";
import { carImage } from "../lib/images";
import { site } from "../lib/site";
import { useStore } from "../lib/store";
import { c, f, t } from "../lib/theme";

const pad = (n: number) => String(n).padStart(2, "0");
const day = (iso: string) => { const d = new Date(iso); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:00`; };

export default function Done() {
  const p = useLocalSearchParams<{ code: string; slug: string; start: string; end: string; days: string; pickup: string; address: string; name: string; phone: string; total: string }>();
  const { t: d, cars } = useStore();
  const insets = useSafeAreaInsets();
  const car = cars.find((x) => x.slug === p.slug);

  const rows: [IconName, string, string][] = [
    ["calendar-month", d.done.period, `${day(p.start)} — ${day(p.end)} (${p.days} ${d.form.dayUnit})`],
    ["location-on", d.done.place, p.pickup === "DELIVERY" ? p.address : d.form.office],
    ["person", d.done.client, `${p.name} (${p.phone})`],
  ];

  return (
    <ScrollView style={{ backgroundColor: c.surface }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32, gap: 20 }}>
      {/* Tabrik */}
      <View style={{ alignItems: "center" }}>
        <LinearGradient colors={[c.primaryContainer, c.primary, c.primaryFixed]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={s.ring}>
          <View style={s.ringInner}><Icon name="check" size={40} /></View>
        </LinearGradient>
        <Text style={[t.headlineMd, { textAlign: "center", marginBottom: 8 }]}>{d.done.title}</Text>
        <Text style={[t.bodyMd, { color: c.onVariant, textAlign: "center", maxWidth: 320, marginBottom: 16 }]}>{d.done.lead}</Text>
        <View style={s.idPill}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.primary }} />
          <Text style={[t.labelMd, { fontFamily: f.display, color: c.primary, letterSpacing: 1 }]}>{d.done.id}: #{p.code}</Text>
        </View>
      </View>

      {/* Kvitansiya */}
      <View style={s.receipt}>
        <View style={s.receiptHead}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon name="receipt-long" size={20} />
            <Text style={[t.labelLg, { fontFamily: f.displaySemi }]}>{d.done.receipt}</Text>
          </View>
          <View style={s.pending}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.secondary }} />
            <Text style={[t.labelSm, { color: c.primaryFixed, letterSpacing: 0.4 }]}>{d.done.pending}</Text>
          </View>
        </View>
        <View style={s.carRow}>
          <Image source={carImage(car?.images[0])} style={{ width: 64, height: 48, borderRadius: 8, backgroundColor: c.highest }} contentFit="cover" />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[t.labelSm, { color: c.outline, textTransform: "uppercase" }]}>{d.done.car}</Text>
            <Text style={[t.bodyMd, { fontFamily: f.displaySemi }]} numberOfLines={1}>{car ? `${car.brand} ${car.model}` : ""}</Text>
          </View>
        </View>
        <View style={{ gap: 12, paddingTop: 4 }}>
          {rows.map(([icon, k, v]) => (
            <View key={k} style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Icon name={icon} size={16} color={c.outline} />
                <Text style={[t.bodySm, { color: c.outline }]}>{k}</Text>
              </View>
              <Text style={[t.bodySm, { fontFamily: f.bodyMed, color: c.onSurface, textAlign: "right", flex: 1 }]}>{v}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 1, backgroundColor: c.highest, marginVertical: 4 }} />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={[t.labelSm, { color: c.outline, textTransform: "uppercase" }]}>{d.done.total}</Text>
            <Text style={[t.labelSm, { color: c.onVariant, fontFamily: f.body }]}>{d.done.totalNote}</Text>
          </View>
          <Text style={[t.headlineSm, { fontFamily: f.display, color: c.primary }]}>{p.total ? `${formatSum(Number(p.total))} ${d.common.sum}` : d.form.managerSays}</Text>
        </View>
      </View>

      {/* Yordam */}
      <View style={s.help}>
        <View style={s.helpIcon}><Icon name="support-agent" size={20} /></View>
        <Text style={[t.bodySm, { flex: 1, lineHeight: 18 }]}>{d.done.help}</Text>
      </View>

      <View style={{ gap: 10 }}>
        <GoldButton label={d.done.home} iconRight="arrow-forward" height={52} onPress={() => router.dismissTo("/")} />
        <DarkButton label={d.common.callFull} icon="call" onPress={() => Linking.openURL(site.phoneHref)} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  glow: { position: "absolute", top: -24, width: 176, height: 176, borderRadius: 88, backgroundColor: "rgba(232,193,118,0.08)" },
  ring: { width: 80, height: 80, borderRadius: 40, padding: 2, marginBottom: 20, shadowColor: c.primaryContainer, shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  ringInner: { flex: 1, borderRadius: 38, backgroundColor: c.lowest, alignItems: "center", justifyContent: "center" },
  idPill: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: c.container, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  receipt: { backgroundColor: c.low, borderRadius: 16, padding: 20, gap: 16, overflow: "hidden" },
  receiptHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginHorizontal: -20, marginTop: -20, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: "rgba(32,31,31,0.4)" },
  pending: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(91,67,5,0.6)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  carRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: c.container, borderRadius: 12, padding: 12 },
  help: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "rgba(32,31,31,0.6)", borderRadius: 12, padding: 14 },
  helpIcon: { padding: 8, borderRadius: 8, backgroundColor: c.high },
});
