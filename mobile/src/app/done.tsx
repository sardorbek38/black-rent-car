import { router, useLocalSearchParams } from "expo-router";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Body, Card, GhostButton, GoldButton, H1, Icon, Kicker } from "../components/ui";
import { formatDateTime, formatSum } from "../lib/format";
import { site } from "../lib/site";
import { useStore } from "../lib/store";
import { c, f } from "../lib/theme";

export default function Done() {
  const p = useLocalSearchParams<{ code: string; car: string; start: string; end: string; days: string; pickup: string; address: string; name: string; phone: string; total: string }>();
  const { t } = useStore();
  const insets = useSafeAreaInsets();
  const rows: [string, string][] = [
    [t.done.car, p.car ?? ""],
    [t.done.period, `${formatDateTime(new Date(p.start))}\n${formatDateTime(new Date(p.end))} (${p.days} ${t.form.dayUnit})`],
    [t.done.place, p.pickup === "DELIVERY" ? `${t.form.delivery}: ${p.address}` : t.form.office],
    [t.done.client, `${p.name}\n${p.phone}`],
    [t.done.total, p.total ? `${formatSum(Number(p.total))} ${t.common.sum}` : t.form.totalTbd],
  ];
  return (
    <ScrollView style={{ backgroundColor: c.ink }} contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: insets.bottom + 24 }}>
      <View style={{ alignItems: "center", gap: 12, marginTop: 8 }}>
        <View style={st.check}><Icon name="check" size={36} color={c.ink} /></View>
        <H1 style={{ textAlign: "center", fontSize: 26 }}>{t.done.title}</H1>
        <Body style={{ textAlign: "center" }}>{t.done.lead}</Body>
      </View>
      <Card style={{ padding: 18 }}>
        <View style={st.codeRow}>
          <View>
            <Kicker style={{ fontSize: 10 }}>{t.done.id}</Kicker>
            <Text style={st.code}>#{p.code}</Text>
          </View>
          <View style={st.pending}><Text style={st.pendingText}>{t.done.pending}</Text></View>
        </View>
        {rows.map(([k, v], i) => (
          <View key={k} style={[st.row, i === rows.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={st.k}>{k}</Text>
            <Text style={st.v}>{v}</Text>
          </View>
        ))}
      </Card>
      <GoldButton label={t.common.call} icon="call" onPress={() => Linking.openURL(site.phoneHref)} />
      <GhostButton label={t.done.home} icon="home" onPress={() => router.dismissTo("/")} />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  check: { width: 72, height: 72, borderRadius: 36, backgroundColor: c.gold, alignItems: "center", justifyContent: "center" },
  codeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: c.line },
  code: { fontFamily: f.display, fontSize: 22, color: c.fg, marginTop: 4 },
  pending: { borderRadius: 999, backgroundColor: "rgba(201,164,92,0.12)", paddingHorizontal: 10, paddingVertical: 5 },
  pendingText: { fontFamily: f.bodySemi, fontSize: 11, color: c.goldLight },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.line },
  k: { fontFamily: f.body, fontSize: 13, color: c.dim },
  v: { flex: 1, fontFamily: f.bodySemi, fontSize: 13.5, color: c.fg, textAlign: "right", lineHeight: 19 },
});
