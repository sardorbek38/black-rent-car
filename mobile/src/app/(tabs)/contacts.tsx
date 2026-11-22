import { Image } from "expo-image";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LangSwitch } from "../../components/LangSwitch";
import { Body, Card, GoldButton, H1, H2, Icon, Kicker, type IconName } from "../../components/ui";
import { site } from "../../lib/site";
import { useStore } from "../../lib/store";
import { c, f } from "../../lib/theme";

function Row({ icon, label, value, onPress }: { icon: IconName; label: string; value: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [st.row, pressed && { opacity: 0.7 }]}>
      <View style={st.rowIcon}><Icon name={icon} size={20} /></View>
      <View style={{ flex: 1 }}>
        <Text style={st.rowLabel}>{label}</Text>
        <Text style={st.rowValue}>{value}</Text>
      </View>
      {onPress ? <Icon name="chevron-right" color={c.dim} /> : null}
    </Pressable>
  );
}

export default function Contacts() {
  const { t } = useStore();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ backgroundColor: c.ink }} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, gap: 16, paddingBottom: 32 }}>
      <View style={st.head}>
        <H1 style={{ fontSize: 26 }}>{t.contacts.title}</H1>
        <LangSwitch />
      </View>
      <Card style={{ padding: 20, alignItems: "center", gap: 10 }}>
        <Image source={require("../../../assets/logo.png")} style={{ width: 72, height: 72 }} />
        <Kicker>{t.contacts.lead}</Kicker>
        <GoldButton label={`${t.common.call}`} icon="call" onPress={() => Linking.openURL(site.phoneHref)} style={{ alignSelf: "stretch", marginTop: 6 }} />
      </Card>
      <Card style={{ paddingHorizontal: 16 }}>
        <Row icon="call" label={t.contacts.phone} value={site.phone} onPress={() => Linking.openURL(site.phoneHref)} />
        <Row icon="photo-camera" label={t.contacts.instagram} value={`@${site.instagram}`} onPress={() => Linking.openURL(site.instagramHref)} />
        {site.telegram ? <Row icon="send" label="Telegram" value={`@${site.telegram}`} onPress={() => Linking.openURL(`https://t.me/${site.telegram}`)} /> : null}
        <Row icon="language" label={t.contacts.website} value={site.website.replace("https://", "")} onPress={() => Linking.openURL(site.website)} />
        <Row icon="schedule" label={t.contacts.hours} value={t.contacts.hoursText} />
      </Card>

      <H2 style={{ marginTop: 8 }}>{t.contacts.termsTitle}</H2>
      <View style={{ gap: 10 }}>
        {t.contacts.terms.map((x) => (
          <Card key={x.title} style={st.term}>
            <View style={st.rowIcon}><Icon name={x.icon as IconName} size={20} /></View>
            <View style={{ flex: 1 }}>
              <Text style={st.termTitle}>{x.title}</Text>
              <Body style={{ fontSize: 13.5, lineHeight: 19 }}>{x.text}</Body>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.line },
  rowIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(201,164,92,0.12)", alignItems: "center", justifyContent: "center" },
  rowLabel: { fontFamily: f.body, fontSize: 12, color: c.dim },
  rowValue: { fontFamily: f.bodySemi, fontSize: 15, color: c.fg, marginTop: 2 },
  term: { flexDirection: "row", gap: 14, padding: 14, alignItems: "center" },
  termTitle: { fontFamily: f.displaySemi, fontSize: 14.5, color: c.fg, marginBottom: 2 },
});
