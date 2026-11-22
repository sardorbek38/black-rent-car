import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { CarouselCard } from "../../components/CarCards";
import { BrandHeader } from "../../components/Header";
import { OfflineBanner } from "../../components/OfflineBanner";
import { TAB_BAR_SPACE } from "../../components/TabBar";
import { DarkButton, Dot, GlassBadge, GoldButton, Icon, type IconName } from "../../components/ui";
import { carImage } from "../../lib/images";
import { site } from "../../lib/site";
import { useStore } from "../../lib/store";
import { c, f, t } from "../../lib/theme";

export default function Home() {
  const { t: d, cars, loading, refresh } = useStore();
  const hero = cars.find((x) => x.slug === "byd-han") ?? cars[0];

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <BrandHeader />
      <ScrollView
        contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={c.primary} />}
      >
        {/* Salomlashish */}
        <View style={[s.px, { paddingTop: 16, paddingBottom: 8, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }]}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <Dot />
              <Text style={[t.labelSm, { fontFamily: f.display, color: c.primary, textTransform: "uppercase", letterSpacing: 1.6 }]}>{d.home.kicker}</Text>
            </View>
            <Text style={t.headlineLgMobile}>{d.home.title}</Text>
            <Text style={[t.bodySm, { marginTop: 4 }]}>{d.home.sub}</Text>
          </View>
          <View style={s.glassPill}>
            <Icon name="verified" size={16} />
            <Text style={[t.labelSm, { fontFamily: f.bodySemi, color: c.onSurface }]}>{cars.length} {d.home.carsBadge}</Text>
          </View>
        </View>

        {/* Katta promo karta */}
        <View style={[s.px, { paddingVertical: 8 }]}>
          <View style={s.promo}>
            <View style={{ height: 224 }}>
              {hero ? <Image source={carImage(hero.images[0])} style={StyleSheet.absoluteFill} contentFit="cover" /> : null}
              <LinearGradient colors={["transparent", "rgba(14,14,14,0.6)", c.lowest]} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />
              <View style={{ position: "absolute", top: 14, left: 14 }}>
                <GlassBadge label={d.home.promoBadge} icon="star" />
              </View>
              <View style={{ position: "absolute", left: 14, right: 14, bottom: 14 }}>
                <Text style={t.headlineMd}>{d.home.promoTitle}</Text>
                <Text style={[t.bodySm, { marginTop: 4 }]} numberOfLines={2}>{d.home.promoText}</Text>
              </View>
            </View>
            <View style={s.promoFoot}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={s.circle32}><Icon name="bolt" size={18} /></View>
                <Text style={[t.labelSm, { fontSize: 11, letterSpacing: 0.4 }]}>{d.home.fast}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={[t.labelSm, { fontSize: 11, letterSpacing: 0.4, color: c.primary }]}>{d.home.city}</Text>
                <Icon name="pin-drop" size={16} />
              </View>
            </View>
          </View>
        </View>

        {/* Tezkor tugmalar */}
        <View style={[s.px, { paddingVertical: 8, flexDirection: "row", gap: 12 }]}>
          <GoldButton label={d.common.call} icon="call" style={{ flex: 1 }} onPress={() => Linking.openURL(site.phoneHref)} />
          {site.telegram ? (
            <DarkButton label="Telegram" icon="send" style={{ flex: 1 }} onPress={() => Linking.openURL(`https://t.me/${site.telegram}`)} />
          ) : (
            <DarkButton label="Instagram" icon="photo-camera" style={{ flex: 1 }} onPress={() => Linking.openURL(site.instagramHref)} />
          )}
        </View>

        {/* Afzalliklar */}
        <View style={[s.px, { paddingVertical: 8, flexDirection: "row", gap: 8 }]}>
          {d.home.stats.map((x) => (
            <View key={x.title} style={s.stat}>
              <Icon name={x.icon as IconName} size={20} style={{ marginBottom: 4 }} />
              <Text style={[t.labelSm, { fontFamily: f.display, fontSize: 11 }]} numberOfLines={1}>{x.title}</Text>
              <Text style={[t.labelSm, { fontSize: 9, color: c.onVariant, textTransform: "uppercase", marginTop: 2 }]} numberOfLines={1}>{x.sub}</Text>
            </View>
          ))}
        </View>

        <View style={[s.px, { marginTop: 8 }]}><OfflineBanner /></View>

        {/* Ommabop avtomobillar */}
        <View style={[s.px, { paddingTop: 16, paddingBottom: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1 }}>
            <Text style={[t.headlineSm, { flexShrink: 1 }]} numberOfLines={1}>{d.home.popular}</Text>
            <Text style={s.countChip}>{cars.length}</Text>
          </View>
          <Pressable onPress={() => router.push("/cars")} style={{ flexDirection: "row", alignItems: "center" }} hitSlop={8}>
            <Text style={[t.labelMd, { color: c.primary }]}>{d.home.all}</Text>
            <Icon name="chevron-right" size={16} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={294} decelerationRate="fast" contentContainerStyle={{ paddingLeft: 16, paddingRight: 16, paddingVertical: 8, gap: 14 }}>
          {cars.map((car) => <CarouselCard key={car.slug} car={car} d={d} />)}
        </ScrollView>

        {/* Maxsus talablar */}
        <View style={[s.px, { paddingTop: 12, paddingBottom: 24 }]}>
          <View style={s.help}>
            <View style={{ flexDirection: "row", gap: 14 }}>
              <View style={[s.circle32, { width: 44, height: 44, borderRadius: 22, backgroundColor: c.high }]}><Icon name="diversity-3" size={22} /></View>
              <View style={{ flex: 1 }}>
                <Text style={[t.headlineSm, { fontFamily: f.display, fontSize: 15, lineHeight: 20 }]}>{d.home.helpTitle}</Text>
                <Text style={[t.bodySm, { fontSize: 12, lineHeight: 17, marginTop: 2 }]}>{d.home.helpText}</Text>
                <Pressable onPress={() => Linking.openURL(site.phoneHref)} style={s.helpBtn}>
                  <Text style={[t.labelSm, { fontFamily: f.display, color: c.primary, textTransform: "uppercase" }]}>{d.home.helpBtn}</Text>
                  <Icon name="arrow-forward" size={14} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  px: { paddingHorizontal: 16 },
  glassPill: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" },
  promo: { borderRadius: 16, overflow: "hidden", backgroundColor: c.low },
  promoFoot: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 14, backgroundColor: c.low },
  circle32: { width: 32, height: 32, borderRadius: 16, backgroundColor: c.highest, alignItems: "center", justifyContent: "center" },
  stat: { flex: 1, backgroundColor: c.low, borderRadius: 12, padding: 10, alignItems: "center", justifyContent: "center" },
  countChip: { ...t.labelSm, fontFamily: f.display, color: c.primary, backgroundColor: c.high, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: "hidden" },
  help: { backgroundColor: c.low, borderRadius: 16, padding: 16, overflow: "hidden" },
  glow: { position: "absolute", right: -24, bottom: -24, width: 112, height: 112, borderRadius: 56, backgroundColor: "rgba(232,193,118,0.08)" },
  helpBtn: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start", marginTop: 12, backgroundColor: c.high, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
});
