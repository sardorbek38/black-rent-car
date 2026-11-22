import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatSum } from "../lib/format";
import type { Dict } from "../lib/i18n";
import { carImage } from "../lib/images";
import { c, f, t } from "../lib/theme";
import type { Car, CarClass } from "../lib/types";
import { GlassBadge, GoldButton, Icon, type IconName } from "./ui";

export const classIcon: Record<CarClass, IconName> = { PREMIUM: "star", BUSINESS: "work", COMFORT: "event-seat", ECONOM: "eco" };

export const gearbox = (car: Car, d: Dict) => (car.automatic == null ? d.common.tbd : car.automatic ? d.common.automatic : d.common.manual);

export function priceText(v: number | null, d: Dict) {
  return v ? `${formatSum(v)} ${d.common.perDay}` : d.common.priceOnRequest;
}

const openCar = (slug: string) => router.push(`/car/${slug}`);
const bookCar = (slug: string) => router.push(`/book/${slug}`);

/** Bosh sahifadagi gorizontal karusel kartasi (280px) */
export function CarouselCard({ car, d }: { car: Car; d: Dict }) {
  return (
    <Pressable onPress={() => openCar(car.slug)} style={s.carousel}>
      <View style={{ height: 160, backgroundColor: c.lowest }}>
        <Image source={carImage(car.images[0])} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
        <LinearGradient colors={["transparent", "transparent", c.low]} style={StyleSheet.absoluteFill} />
        <View style={{ position: "absolute", top: 10, left: 10 }}>
          <GlassBadge label={d.carClass[car.carClass]} />
        </View>
      </View>
      <View style={{ padding: 14, paddingBottom: 8 }}>
        <Text style={[t.headlineSm, { fontFamily: f.display, fontSize: 16, lineHeight: 20 }]} numberOfLines={1}>{car.brand} {car.model}</Text>
        <Text style={t.bodySm}>{d.bodyType[car.bodyType]}{car.year ? ` • ${car.year}` : ""}</Text>
        <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
          <Text style={s.tag}>{gearbox(car, d)}</Text>
          <Text style={s.tag}>{car.seats} {d.common.seats}</Text>
          {car.fuel ? <Text style={s.tag}>{d.fuel[car.fuel]}</Text> : null}
        </View>
      </View>
      <View style={{ padding: 14, paddingTop: 0, marginTop: 8, gap: 10 }}>
        <Text style={[t.headlineSm, { fontFamily: f.display, fontSize: 17, color: c.primary }]} numberOfLines={1}>{priceText(car.pricePerDay, d)}</Text>
        <GoldButton label={d.common.book} icon="calendar-month" height={40} onPress={() => bookCar(car.slug)} textStyle={{ fontSize: 12 }} />
      </View>
    </Pressable>
  );
}

/** Katalogdagi to'liq karta */
export function CatalogCard({ car, d }: { car: Car; d: Dict }) {
  const busy = car.status !== "AVAILABLE";
  const specs = [gearbox(car, d), `${car.seats} ${d.common.seats}`, car.fuel ? d.fuel[car.fuel] : null].filter(Boolean) as string[];
  return (
    <Pressable onPress={() => openCar(car.slug)} style={s.catalog}>
      <View style={{ height: 176, borderRadius: 12, overflow: "hidden", backgroundColor: c.lowest }}>
        <Image source={carImage(car.images[0])} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
        <LinearGradient colors={["rgba(0,0,0,0.5)", "transparent", c.low]} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
        <View style={{ position: "absolute", top: 10, left: 10, right: 10, flexDirection: "row", gap: 6 }}>
          <View style={s.classBadge}>
            <Icon name={classIcon[car.carClass]} size={13} color={c.onPrimary} />
            <Text style={[t.labelSm, { fontFamily: f.display, color: c.onPrimary, textTransform: "uppercase" }]}>{d.carClass[car.carClass]}</Text>
          </View>
          {busy || car.year ? (
            <View style={s.darkBadge}>
              <Text style={[t.labelSm, { color: busy ? c.error : c.onVariant }]}>{busy ? d.common.busy : `${car.year}${d.common.yearSuffix}`}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <Text style={[t.headlineSm, { letterSpacing: 0, flexShrink: 1 }]} numberOfLines={1}>{car.brand} {car.model}</Text>
          <Text style={s.goldTag}>{d.bodyType[car.bodyType]}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {specs.map((x, i) => (
            <View key={x} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              {i > 0 ? <Text style={{ color: c.outlineVariant, fontSize: 10 }}>•</Text> : null}
              <Text style={s.spec}>{x}</Text>
            </View>
          ))}
        </View>
        <View style={s.priceRow}>
          <View style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
            <Text style={[t.labelSm, { color: c.outline, textTransform: "uppercase" }]}>{d.cars.daily}</Text>
            <Text style={[t.headlineSm, { fontFamily: f.display, fontSize: 16, color: c.primary, letterSpacing: -0.2 }]} numberOfLines={1}>{priceText(car.pricePerDay, d)}</Text>
          </View>
          <Pressable onPress={() => bookCar(car.slug)} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.95 : 1 }] })}>
            <LinearGradient colors={[c.primaryContainer, c.primary, c.primaryFixed]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={s.smallBtn}>
              <Text style={{ fontFamily: f.display, fontSize: 12, color: c.onPrimary, letterSpacing: 0.3 }}>{d.common.book}</Text>
              <Icon name="arrow-forward" size={15} color={c.onPrimary} />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

/** Bron bo'limidagi ixcham qator */
export function PickRow({ car, d }: { car: Car; d: Dict }) {
  return (
    <Pressable onPress={() => bookCar(car.slug)} style={({ pressed }) => [s.pick, pressed && { backgroundColor: c.container }]}>
      <Image source={carImage(car.images[0])} style={{ width: 96, height: 64, borderRadius: 8, backgroundColor: c.lowest }} contentFit="cover" />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[t.headlineSm, { fontFamily: f.display, fontSize: 16, lineHeight: 20 }]} numberOfLines={1}>{car.brand} {car.model}</Text>
        <Text style={[t.labelSm, { color: c.secondary, textTransform: "uppercase", marginTop: 2 }]}>{d.carClass[car.carClass]} • {d.bodyType[car.bodyType]}</Text>
        <Text style={[t.labelLg, { color: c.primary, marginTop: 4 }]} numberOfLines={1}>{priceText(car.pricePerDay, d)}</Text>
      </View>
      <Icon name="chevron-right" size={22} color={c.outline} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  carousel: { width: 280, backgroundColor: c.low, borderRadius: 16, overflow: "hidden" },
  tag: { ...t.labelSm, fontSize: 11, letterSpacing: 0.3, color: c.onVariant, backgroundColor: c.container, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, overflow: "hidden" },
  catalog: { backgroundColor: c.low, borderRadius: 16, padding: 14, shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  classBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: c.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  darkBadge: { backgroundColor: "rgba(14,14,14,0.8)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  goldTag: { ...t.labelSm, color: c.primary, backgroundColor: "rgba(232,193,118,0.1)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, overflow: "hidden" },
  spec: { ...t.bodySm, color: c.onVariant, backgroundColor: c.high, paddingHorizontal: 8, paddingVertical: 1, borderRadius: 999, overflow: "hidden" },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16, backgroundColor: "rgba(14,14,14,0.4)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  smallBtn: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  pick: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: c.low, borderRadius: 12, padding: 12 },
});

