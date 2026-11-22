import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BrandHeader } from "../../components/Header";
import { TAB_BAR_SPACE } from "../../components/TabBar";
import { Dot, Icon, IconCircle, type IconName } from "../../components/ui";
import { site } from "../../lib/site";
import { useStore } from "../../lib/store";
import { c, f, t } from "../../lib/theme";

function Item({ icon, label, value, sub, action }: { icon: IconName; label: string; value: string; sub?: string; action?: ReactNode }) {
  return (
    <View style={s.item}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
        <IconCircle name={icon} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[t.labelSm, { color: c.onVariant, textTransform: "uppercase" }]}>{label}</Text>
          <Text style={[t.labelLg, { fontSize: 15 }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{value}</Text>
          {sub ? <Text style={[t.bodySm, { color: "rgba(209,197,180,0.8)" }]} numberOfLines={1}>{sub}</Text> : null}
        </View>
      </View>
      {action}
    </View>
  );
}

function SmallBtn({ label, icon, onPress, gold }: { label?: string; icon: IconName; onPress: () => void; gold?: boolean }) {
  const inner = (
    <>
      <Icon name={icon} size={15} color={gold ? c.onPrimary : c.primary} />
      {label ? <Text style={[t.labelMd, { fontFamily: f.display, fontSize: 11, color: gold ? c.onPrimary : c.primary }]}>{label}</Text> : null}
    </>
  );
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.95 : 1 }] })}>
      {gold ? (
        <LinearGradient colors={[c.primaryFixed, c.primary]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={s.smallBtn}>{inner}</LinearGradient>
      ) : (
        <View style={[s.smallBtn, { backgroundColor: c.highest }]}>{inner}</View>
      )}
    </Pressable>
  );
}

export default function Contacts() {
  const { t: d } = useStore();
  const call = () => Linking.openURL(site.phoneHref);
  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <BrandHeader />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: TAB_BAR_SPACE }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <Text style={t.headlineLgMobile}>{d.contacts.title}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
              <Dot size={8} />
              <Text style={t.bodySm}>{d.contacts.lead}</Text>
            </View>
          </View>
          <IconCircle name="headset-mic" bg={c.container} />
        </View>

        {/* To'g'ridan-to'g'ri aloqa */}
        <View style={s.card}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 4 }}>
            <Text style={[t.labelMd, { color: c.primary, textTransform: "uppercase" }]}>{d.contacts.direct}</Text>
            <Text style={s.mini}>{d.contacts.fast}</Text>
          </View>
          <Item icon="call" label={d.contacts.phone} value={site.phone} action={<SmallBtn gold icon="phone-forwarded" onPress={call} />} />
          {site.telegram ? (
            <Item icon="send" label={d.contacts.telegram} value={`@${site.telegram}`} sub={d.contacts.telegramSub}
              action={<SmallBtn label={d.contacts.write} icon="arrow-outward" onPress={() => Linking.openURL(`https://t.me/${site.telegram}`)} />} />
          ) : null}
          <Item icon="photo-camera" label={d.contacts.instagram} value={`@${site.instagram}`}
            action={<SmallBtn icon="arrow-outward" onPress={() => Linking.openURL(site.instagramHref)} />} />
          <Item icon="language" label={d.contacts.website} value={site.website.replace("https://", "")}
            action={<SmallBtn icon="arrow-outward" onPress={() => Linking.openURL(site.website)} />} />
        </View>

        {/* Ish tartibi */}
        <View style={s.card}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingBottom: 4 }}>
            <Icon name="schedule" size={20} />
            <Text style={t.headlineSm}>{d.contacts.hoursTitle}</Text>
          </View>
          {d.contacts.hours.map((h) => (
            <View key={h.title} style={s.row}>
              <View style={s.square}><Icon name={h.icon as IconName} size={18} /></View>
              <View style={{ flex: 1 }}>
                <Text style={t.labelMd}>{h.title}</Text>
                <Text style={t.bodySm}>{h.text}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Ofis manzili (mijozdan kelguncha) */}
        <View style={s.card}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon name="pin-drop" size={20} />
            <Text style={t.headlineSm}>{d.contacts.officeTitle}</Text>
          </View>
          <Text style={t.bodySm}>{d.contacts.officeSoon}</Text>
        </View>

        {/* Yordam */}
        <LinearGradient colors={[c.low, c.container, c.low]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.card, { flexDirection: "row", gap: 12 }]}>
          <View style={[s.square, { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(232,193,118,0.15)" }]}><Icon name="support-agent" size={24} /></View>
          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={[t.headlineSm, { color: c.primary, flexShrink: 1 }]}>{d.contacts.supportTitle}</Text>
              <Text style={s.badge247} numberOfLines={1}>24/7</Text>
            </View>
            <Text style={[t.bodySm, { lineHeight: 21 }]}>{d.contacts.supportText}</Text>
            <Pressable onPress={call} style={s.supportBtn}>
              <Icon name="call" size={16} color={c.onPrimary} />
              <Text style={[t.labelMd, { fontFamily: f.display, color: c.onPrimary }]}>{d.contacts.supportBtn}</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: c.low, borderRadius: 16, padding: 16, gap: 12 },
  mini: { ...t.labelSm, color: c.onVariant, backgroundColor: c.container, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: "hidden" },
  item: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, backgroundColor: c.container, borderRadius: 12, padding: 14 },
  smallBtn: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8, minWidth: 36, justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: "rgba(32,31,31,0.7)", borderRadius: 12, padding: 12 },
  square: { width: 32, height: 32, borderRadius: 8, backgroundColor: c.highest, alignItems: "center", justifyContent: "center", marginTop: 2 },
  badge247: { flexShrink: 0, fontFamily: f.extra, fontSize: 10, color: c.onPrimary, backgroundColor: c.primary, paddingHorizontal: 6, borderRadius: 4, overflow: "hidden" },
  supportBtn: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", marginTop: 8, backgroundColor: c.primary, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
});
