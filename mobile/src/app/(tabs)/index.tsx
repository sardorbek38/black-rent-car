import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CarCard } from "../../components/CarCard";
import { LangSwitch } from "../../components/LangSwitch";
import { OfflineBanner } from "../../components/OfflineBanner";
import { Body, Card, GhostButton, GoldButton, H1, H2, Icon, Kicker, type IconName } from "../../components/ui";
import { carImage } from "../../lib/images";
import { site } from "../../lib/site";
import { useStore } from "../../lib/store";
import { c, f } from "../../lib/theme";

export default function Home() {
  const { t, cars, loading, refresh } = useStore();
  const insets = useSafeAreaInsets();
  const hero = cars.find((x) => x.slug === "byd-han") ?? cars[0];

  return (
    <ScrollView
      style={{ backgroundColor: c.ink }}
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={c.gold} />}
    >
      {/* Hero */}
      <View style={{ paddingTop: insets.top }}>
        <View style={st.topBar}>
          <View style={st.brand}>
            <Image source={require("../../../assets/logo.png")} style={{ width: 34, height: 34 }} />
            <Text style={st.brandText}>BLACK RENT CAR</Text>
          </View>
          <LangSwitch />
        </View>
        <View style={st.heroImg}>
          {hero && <Image source={carImage(hero.images[0])} style={StyleSheet.absoluteFill} contentFit="cover" />}
          <LinearGradient colors={["rgba(10,10,10,0.1)", "rgba(10,10,10,0.35)", c.ink]} style={StyleSheet.absoluteFill} />
        </View>
        <View style={st.heroText}>
          <View style={st.pill}>
            <View style={st.dot} />
            <Text style={st.pillText}>{t.home.badge}</Text>
          </View>
          <H1>
            {t.home.titleA}{"\n"}
            <Text style={{ color: c.gold }}>{t.home.titleB}</Text>
          </H1>
          <Body>{t.home.lead}</Body>
          <View style={{ gap: 10, marginTop: 6 }}>
            <GoldButton label={t.home.choose} icon="directions-car" onPress={() => router.push("/cars")} />
            <GhostButton label={t.common.call} icon="call" onPress={() => Linking.openURL(site.phoneHref)} />
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <OfflineBanner />
      </View>

      {/* Afzalliklar */}
      <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 20 }}>
        {t.home.why.map((w) => (
          <Card key={w.title} style={st.why}>
            <View style={st.whyIcon}><Icon name={w.icon as IconName} size={22} /></View>
            <View style={{ flex: 1 }}>
              <Text style={st.whyTitle}>{w.title}</Text>
              <Body style={{ fontSize: 13.5, lineHeight: 19 }}>{w.text}</Body>
            </View>
          </Card>
        ))}
      </View>

      {/* Avtopark */}
      <View style={st.sectionHead}>
        <View>
          <Kicker>{t.home.fleetKicker}</Kicker>
          <H2 style={{ marginTop: 4 }}>{t.home.fleetTitle}</H2>
        </View>
        <Pressable onPress={() => router.push("/cars")} style={st.more} hitSlop={8}>
          <Text style={st.moreText}>{t.home.allCars}</Text>
          <Icon name="chevron-right" size={18} />
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
        {cars.map((car) => <CarCard key={car.slug} car={car} t={t} compact />)}
      </ScrollView>

      {/* Qanday ishlaydi */}
      <View style={{ paddingHorizontal: 20, marginTop: 32, gap: 12 }}>
        <H2>{t.home.howTitle}</H2>
        {t.home.how.map((h, i) => (
          <View key={h.title} style={st.step}>
            <Text style={st.stepNum}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={st.whyTitle}>{h.title}</Text>
              <Body style={{ fontSize: 13.5, lineHeight: 19 }}>{h.text}</Body>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 10, zIndex: 2 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandText: { fontFamily: f.display, fontSize: 13, letterSpacing: 1.5, color: c.fg },
  heroImg: { height: 230, marginTop: 4 },
  heroText: { paddingHorizontal: 20, gap: 14, marginTop: -30 },
  pill: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", borderRadius: 999, borderWidth: 1, borderColor: "rgba(201,164,92,0.35)", backgroundColor: "rgba(201,164,92,0.1)", paddingHorizontal: 12, paddingVertical: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.gold },
  pillText: { fontFamily: f.bodySemi, fontSize: 12, color: c.goldLight },
  why: { flexDirection: "row", gap: 14, padding: 16, alignItems: "center" },
  whyIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(201,164,92,0.12)", alignItems: "center", justifyContent: "center" },
  whyTitle: { fontFamily: f.displaySemi, fontSize: 15, color: c.fg, marginBottom: 2 },
  sectionHead: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 32, marginBottom: 14 },
  more: { flexDirection: "row", alignItems: "center" },
  moreText: { fontFamily: f.bodySemi, fontSize: 13, color: c.gold },
  step: { flexDirection: "row", gap: 14, alignItems: "flex-start", backgroundColor: c.card, borderRadius: 18, borderWidth: 1, borderColor: c.line, padding: 16 },
  stepNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: c.gold, color: c.ink, textAlign: "center", lineHeight: 32, fontFamily: f.display, fontSize: 14, overflow: "hidden" },
});
