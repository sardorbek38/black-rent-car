import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { gearbox } from "../../components/CarCards";
import { BackHeader } from "../../components/Header";
import { DarkButton, Icon, type IconName } from "../../components/ui";
import { formatSum } from "../../lib/format";
import { carImage } from "../../lib/images";
import { API_BASE, site } from "../../lib/site";
import { useStore } from "../../lib/store";
import { c, f, t } from "../../lib/theme";

export default function CarScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { t: d, locale, cars } = useStore();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const car = cars.find((x) => x.slug === slug);

  if (!car) {
    return (
      <View style={{ flex: 1, backgroundColor: c.surface }}>
        <BackHeader title={d.car.title} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 }}>
          <Text style={t.bodySm}>{d.cars.empty}</Text>
          <DarkButton label={d.common.back} icon="arrow-back" onPress={() => router.back()} style={{ alignSelf: "stretch" }} />
        </View>
      </View>
    );
  }

  const name = `${car.brand} ${car.model}`;
  const busy = car.status !== "AVAILABLE";
  const tbd = d.common.tbd;
  const tiles: { icon: IconName; label: string; value: string }[] = [
    { icon: "calendar-today", label: d.car.year, value: car.year ? `${car.year}${d.common.yearSuffix}` : tbd },
    { icon: "tune", label: d.car.gearbox, value: gearbox(car, d) },
    { icon: car.fuel === "PETROL" ? "local-gas-station" : "bolt", label: d.car.fuel, value: car.fuel ? d.fuel[car.fuel] : tbd },
    { icon: "airline-seat-recline-extra", label: d.car.seats, value: `${car.seats} ${d.common.seats}` },
  ];
  // chegirma foizi faqat ikkala narx ma'lum bo'lsa
  const off = (v: number | null) => (v && car.pricePerDay ? Math.round((1 - v / car.pricePerDay) * 100) : 0);
  const rows: [string, number | null, number][] = [
    [d.car.day1, car.pricePerDay, 0],
    [d.car.day3, car.price3Days, off(car.price3Days)],
    [d.car.day7, car.price7Days, off(car.price7Days)],
  ];
  const perks: [IconName, string][] = [
    ["local-shipping", d.car.perkDelivery],
    ["timer", d.car.perkFast],
    ["support-agent", d.car.perkSupport],
    [car.fuel === "ELECTRIC" ? "electric-car" : "directions-car", `${d.bodyType[car.bodyType]} • ${d.carClass[car.carClass]}`],
  ];

  const share = () =>
    Share.share({ message: `${d.car.shareText.replace("{car}", name)}\n${API_BASE}/${locale}/cars/${car.slug}\n${site.phone}` }).catch(() => {});

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <BackHeader title={d.car.title} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}>
        {/* Galereya */}
        <View style={{ height: 320, backgroundColor: c.lowest }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
            scrollEventThrottle={64}
          >
            {car.images.map((img) => (
              <View key={img} style={{ width, height: 320 }}>
                <Image source={carImage(img)} style={StyleSheet.absoluteFill} contentFit="cover" />
                <LinearGradient colors={["rgba(19,19,19,0.4)", "transparent", c.surface]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
              </View>
            ))}
          </ScrollView>
          <Pressable accessibilityLabel={d.common.share} onPress={share} style={s.share}>
            <Icon name="share" size={20} color={c.onSurface} />
          </Pressable>
          <View style={s.dots}>
            {car.images.map((img, i) => <View key={img} style={[s.dot, i === page && s.dotActive]} />)}
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 24, marginTop: -12 }}>
          {/* Sarlavha */}
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={s.classChip}>{d.carClass[car.carClass]} {d.car.classSuffix}</Text>
              <View style={s.status}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: busy ? c.error : c.green }} />
                <Text style={[t.labelSm, { fontFamily: f.display, color: busy ? c.error : c.green, textTransform: "uppercase" }]}>{busy ? d.common.busy : d.common.available}</Text>
              </View>
            </View>
            <Text style={[t.headlineLgMobile, { lineHeight: 32 }]}>
              {car.brand} <Text style={{ fontFamily: f.heroItalic, color: c.primary }}>{car.model}</Text>
            </Text>
            <Text style={t.bodySm}>{locale === "ru" ? car.descriptionRu : car.descriptionUz}</Text>
          </View>

          {/* 4 ta xususiyat */}
          <View style={s.grid}>
            {tiles.map((x) => (
              <View key={x.label} style={s.tile}>
                <View style={s.tileIcon}><Icon name={x.icon} size={19} /></View>
                <View>
                  <Text style={[t.labelSm, { color: c.outline, textTransform: "uppercase" }]}>{x.label}</Text>
                  <Text style={[t.headlineSm, { fontSize: 15, lineHeight: 21 }]} numberOfLines={1}>{x.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Narxlar */}
          <View style={s.priceCard}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={t.headlineSm}>{d.car.prices}</Text>
              <Text style={[t.labelSm, { color: c.outline, textTransform: "uppercase" }]}>{d.car.currency}</Text>
            </View>
            {rows.map(([label, v, pct], i) => (
              <View key={label} style={s.priceRow}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: i === 0 ? c.outline : c.primary }} />
                  <Text style={t.labelLg}>{label}</Text>
                  {pct > 0 ? <Text style={[s.pct, i === 2 && { backgroundColor: c.primaryContainer, color: c.onPrimary }]}>-{pct}%</Text> : null}
                </View>
                <Text style={[t.headlineSm, { fontFamily: f.display, fontSize: 15, color: v ? c.primary : c.onVariant }]}>{v ? `${formatSum(v)} ${d.common.perDay}` : tbd}</Text>
              </View>
            ))}
            <View style={s.deposit}>
              <Icon name="verified-user" size={20} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 4 }}>
                  <Text style={t.labelMd}>{d.car.deposit}</Text>
                  <Text style={[t.labelMd, { fontFamily: f.display, color: car.deposit ? c.primary : c.onVariant }]}>{car.deposit ? `${formatSum(car.deposit)} ${d.common.sum}` : tbd}</Text>
                </View>
                <Text style={[t.bodySm, { fontSize: 12, color: c.outline, marginTop: 2 }]}>{car.pricePerDay ? d.car.depositNote : d.car.pricesNote}</Text>
              </View>
            </View>
          </View>

          {/* Afzalliklar */}
          <View style={{ gap: 10 }}>
            <Text style={t.headlineSm}>{d.car.perks}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {perks.map(([icon, label]) => (
                <View key={label} style={s.perk}>
                  <Icon name={icon} size={18} />
                  <Text style={t.labelMd}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Kafolat */}
          <View style={s.guarantee}>
            <View style={[s.tileIcon, { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(232,193,118,0.1)" }]}><Icon name="workspace-premium" size={22} /></View>
            <View style={{ flex: 1 }}>
              <Text style={t.labelLg}>{d.car.guaranteeTitle}</Text>
              <Text style={[t.bodySm, { fontSize: 12, color: c.outline }]}>{d.car.guaranteeText}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Pastki panel */}
      <View style={[s.bar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Pressable accessibilityLabel={d.common.callFull} onPress={() => Linking.openURL(site.phoneHref)} style={s.round}>
          <Icon name="call" size={24} />
        </Pressable>
        <Pressable onPress={() => router.push(`/book/${car.slug}`)} style={({ pressed }) => [s.bookBtn, pressed && { opacity: 0.9 }]}>
          <Text style={[t.headlineSm, { fontFamily: f.display, color: c.onPrimary, textTransform: "uppercase", letterSpacing: 1.2 }]}>{d.common.book}</Text>
          <Icon name="arrow-forward" size={20} color={c.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  share: { position: "absolute", top: 16, right: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(14,14,14,0.7)", alignItems: "center", justifyContent: "center" },
  dots: { position: "absolute", bottom: 16, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(53,53,52,0.8)" },
  dotActive: { width: 24, backgroundColor: c.primary },
  classChip: { ...t.labelSm, fontFamily: f.display, color: c.primary, textTransform: "uppercase", letterSpacing: 1.6, backgroundColor: c.high, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, overflow: "hidden" },
  status: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: c.low, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10 },
  tile: { width: "48.5%", backgroundColor: c.low, borderRadius: 12, padding: 12, gap: 8 },
  tileIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: c.highest, alignItems: "center", justifyContent: "center" },
  priceCard: { backgroundColor: c.container, borderRadius: 16, padding: 16, gap: 10 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 12, backgroundColor: c.low },
  pct: { ...t.labelSm, fontFamily: f.display, color: c.onSecondaryContainer, backgroundColor: c.secondaryContainer, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: "hidden" },
  deposit: { flexDirection: "row", gap: 10, backgroundColor: "rgba(14,14,14,0.6)", borderRadius: 12, padding: 12, marginTop: 4 },
  perk: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: c.low, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  guarantee: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: c.low, borderRadius: 16, padding: 16 },
  bar: { position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingTop: 14, backgroundColor: "rgba(14,14,14,0.95)", shadowColor: "#000", shadowOpacity: 0.65, shadowRadius: 16, shadowOffset: { width: 0, height: -8 }, elevation: 16 },
  round: { width: 52, height: 52, borderRadius: 26, backgroundColor: c.low, alignItems: "center", justifyContent: "center" },
  bookBtn: { flex: 1, height: 52, borderRadius: 999, backgroundColor: c.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, shadowColor: c.primaryContainer, shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
});
