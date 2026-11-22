import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CarCard, CarSpecs, Price } from "../../components/CarCard";
import { Badge, Body, Card, GhostButton, GoldButton, H1, H2, Icon, Kicker } from "../../components/ui";
import { formatSum } from "../../lib/format";
import { carImage } from "../../lib/images";
import { site } from "../../lib/site";
import { useStore } from "../../lib/store";
import { c, f } from "../../lib/theme";

export default function CarScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { t, locale, cars } = useStore();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const car = cars.find((x) => x.slug === slug);

  if (!car) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 }}>
        <Body>{t.cars.empty}</Body>
        <GhostButton label={t.common.back} onPress={() => router.back()} />
      </View>
    );
  }

  const tbd = t.common.tbd;
  const money = (v: number | null) => (v ? `${formatSum(v)} ${t.common.sum}` : tbd);
  const specs: [string, string][] = [
    [t.car.class, t.carClass[car.carClass]],
    [t.car.body, t.bodyType[car.bodyType]],
    [t.car.year, car.year ? String(car.year) : tbd],
    [t.car.gearbox, car.automatic == null ? tbd : car.automatic ? t.common.automatic : t.common.manual],
    [t.car.fuel, car.fuel ? t.fuel[car.fuel] : tbd],
    [t.car.seats, String(car.seats)],
  ];
  const others = cars.filter((x) => x.slug !== car.slug).slice(0, 6);
  const name = `${car.brand} ${car.model}`;

  return (
    <View style={{ flex: 1, backgroundColor: c.ink }}>
      <Stack.Screen options={{ title: name }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Galereya */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
          onScroll={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
          scrollEventThrottle={64}
        >
          {car.images.map((img) => (
            <Image key={img} source={carImage(img)} style={{ width, height: width * 0.62, backgroundColor: c.raised }} contentFit="cover" />
          ))}
        </ScrollView>
        <View style={st.dots}>
          {car.images.map((img, i) => <View key={img} style={[st.dot, i === page && st.dotActive]} />)}
        </View>

        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Badge label={t.carClass[car.carClass]} />
            {car.status !== "AVAILABLE" ? <Badge label={t.common.busy} gold={false} /> : null}
          </View>
          <H1 style={{ fontSize: 28 }}>{name}</H1>
          <CarSpecs car={car} t={t} />
          <Price value={car.pricePerDay} t={t} large />
          <Body>{locale === "ru" ? car.descriptionRu : car.descriptionUz}</Body>

          {/* Tariflar */}
          <Card style={{ padding: 16, gap: 10, marginTop: 6 }}>
            <Kicker>{t.car.pricing}</Kicker>
            {[
              [t.car.days1, car.pricePerDay],
              [t.car.days3, car.price3Days],
              [t.car.days7, car.price7Days],
            ].map(([label, v]) => (
              <View key={label as string} style={st.tariff}>
                <Text style={st.tariffLabel}>{label as string}</Text>
                <Text style={st.tariffValue}>{money(v as number | null)}</Text>
              </View>
            ))}
            <View style={[st.kv, { borderBottomWidth: 0 }]}>
              <Text style={st.kvLabel}>{t.car.deposit}</Text>
              <Text style={st.kvLabel}>{money(car.deposit)}</Text>
            </View>
            {!car.pricePerDay && (
              <View style={st.note}>
                <Icon name="info-outline" size={16} color={c.goldLight} />
                <Text style={st.noteText}>{t.car.pricesNote}</Text>
              </View>
            )}
          </Card>

          {/* Xususiyatlar */}
          <Card style={{ padding: 16 }}>
            <Kicker style={{ marginBottom: 6 }}>{t.car.specs}</Kicker>
            {specs.map(([k, v], i) => (
              <View key={k} style={[st.kv, i === specs.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={st.kvLabel}>{k}</Text>
                <Text style={st.kvValue}>{v}</Text>
              </View>
            ))}
          </Card>
        </View>

        {others.length > 0 && (
          <>
            <H2 style={{ paddingHorizontal: 20, marginTop: 28, marginBottom: 14 }}>{t.car.similar}</H2>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
              {others.map((o) => <CarCard key={o.slug} car={o} t={t} compact />)}
            </ScrollView>
          </>
        )}
      </ScrollView>

      {/* Pastki panel */}
      <View style={[st.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <GhostButton label="" icon="call" onPress={() => Linking.openURL(site.phoneHref)} style={{ width: 54, paddingHorizontal: 0 }} />
        <GoldButton label={t.common.book} icon="event-available" onPress={() => router.push(`/book/${car.slug}`)} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginVertical: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.line },
  dotActive: { width: 18, backgroundColor: c.gold },
  tariff: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 12, borderWidth: 1, borderColor: c.line, backgroundColor: c.ink, paddingHorizontal: 14, paddingVertical: 12 },
  tariffLabel: { fontFamily: f.body, fontSize: 14, color: c.muted },
  tariffValue: { fontFamily: f.bodySemi, fontSize: 14, color: c.fg },
  kv: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.line },
  kvLabel: { fontFamily: f.body, fontSize: 13.5, color: c.dim },
  kvValue: { fontFamily: f.bodySemi, fontSize: 13.5, color: c.fg },
  note: { flexDirection: "row", gap: 8, borderRadius: 12, backgroundColor: "rgba(201,164,92,0.08)", borderWidth: 1, borderColor: "rgba(201,164,92,0.25)", padding: 12 },
  noteText: { flex: 1, fontFamily: f.body, fontSize: 12.5, lineHeight: 18, color: c.goldLight },
  bar: { position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", gap: 10, paddingHorizontal: 20, paddingTop: 12, backgroundColor: "rgba(10,10,10,0.96)", borderTopWidth: 1, borderTopColor: c.line },
});
