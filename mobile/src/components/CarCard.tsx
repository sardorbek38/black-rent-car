import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatSum } from "../lib/format";
import { carImage } from "../lib/images";
import type { Dict } from "../lib/i18n";
import { c, f } from "../lib/theme";
import type { Car } from "../lib/types";
import { Badge, Chip, GhostButton, GoldButton, Kicker } from "./ui";

export function CarSpecs({ car, t }: { car: Car; t: Dict }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
      <Chip icon="settings" label={car.automatic == null ? t.common.tbd : car.automatic ? t.common.automatic : t.common.manual} />
      <Chip icon="group" label={`${car.seats} ${t.common.seats}`} />
      {car.fuel ? <Chip icon={car.fuel === "PETROL" ? "local-gas-station" : "bolt"} label={t.fuel[car.fuel]} /> : null}
    </View>
  );
}

export function Price({ value, t, large }: { value: number | null; t: Dict; large?: boolean }) {
  if (!value) return <Text style={[st.price, { fontSize: large ? 22 : 16 }]}>{t.common.priceOnRequest}</Text>;
  return (
    <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
      <Text style={[st.price, { fontSize: large ? 28 : 22 }]}>{formatSum(value)}</Text>
      <Text style={st.per}>{t.common.perDay}</Text>
    </View>
  );
}

export function CarCard({ car, t, compact }: { car: Car; t: Dict; compact?: boolean }) {
  const open = () => router.push(`/car/${car.slug}`);
  const busy = car.status !== "AVAILABLE";
  return (
    <View style={[st.card, compact && { width: 280 }]}>
      <Pressable onPress={open}>
        <View style={st.imgWrap}>
          <Image source={carImage(car.images[0])} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          <LinearGradient colors={["transparent", c.card]} style={st.fade} />
          <View style={st.badges}>
            <Badge label={t.carClass[car.carClass]} />
            {busy ? <Badge label={t.common.busy} gold={false} /> : null}
          </View>
        </View>
      </Pressable>
      <View style={st.content}>
        <View>
          <Kicker style={{ fontSize: 10 }}>{t.bodyType[car.bodyType]}</Kicker>
          <Text style={st.name} onPress={open}>{car.brand} {car.model}</Text>
        </View>
        {!compact && <CarSpecs car={car} t={t} />}
        <View style={st.priceRow}>
          <Text style={st.priceLabel}>{t.cars.rentPrice}</Text>
          <Price value={car.pricePerDay} t={t} />
        </View>
        {!compact && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <GhostButton small label={t.common.details} onPress={open} style={{ flex: 1 }} />
            <GoldButton small label={t.common.book} onPress={() => router.push(`/book/${car.slug}`)} style={{ flex: 1 }} />
          </View>
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: c.card, borderRadius: 20, borderWidth: 1, borderColor: c.line, overflow: "hidden" },
  imgWrap: { aspectRatio: 2, backgroundColor: c.raised },
  fade: { position: "absolute", left: 0, right: 0, bottom: 0, height: "45%" },
  badges: { position: "absolute", left: 12, top: 12, flexDirection: "row", gap: 6 },
  content: { padding: 16, gap: 14 },
  name: { fontFamily: f.displaySemi, fontSize: 18, color: c.fg, marginTop: 4 },
  priceRow: { borderTopWidth: 1, borderTopColor: c.line, paddingTop: 12, gap: 2 },
  priceLabel: { fontFamily: f.display, fontSize: 9.5, letterSpacing: 1.2, textTransform: "uppercase", color: c.dim },
  price: { fontFamily: f.display, color: c.gold },
  per: { fontFamily: f.body, fontSize: 12, color: c.dim },
});
