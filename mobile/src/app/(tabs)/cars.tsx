import { useMemo, useState } from "react";
import { FlatList, Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { CatalogCard } from "../../components/CarCards";
import { BrandHeader } from "../../components/Header";
import { OfflineBanner } from "../../components/OfflineBanner";
import { TAB_BAR_SPACE } from "../../components/TabBar";
import { Dot, Icon } from "../../components/ui";
import { site } from "../../lib/site";
import { useStore } from "../../lib/store";
import { c, f, t } from "../../lib/theme";
import type { Car } from "../../lib/types";

type Filter = "ALL" | "ECONOM" | "COMFORT" | "BUSINESS" | "PREMIUM" | "SUV";
const match = (car: Car, fl: Filter) => fl === "ALL" || (fl === "SUV" ? car.bodyType !== "SEDAN" : car.carClass === fl);

export default function Cars() {
  const { t: d, cars, loading, refresh } = useStore();
  const [filter, setFilter] = useState<Filter>("ALL");
  const list = useMemo(() => cars.filter((x) => match(x, filter)), [cars, filter]);
  // faqat mashinasi bor toifalarni ko'rsatamiz
  const filters = (["ALL", "ECONOM", "COMFORT", "BUSINESS", "PREMIUM", "SUV"] as Filter[]).filter((fl) => cars.some((x) => match(x, fl)));
  const label = (fl: Filter) => (fl === "ALL" ? d.common.all : fl === "SUV" ? d.cars.suv : d.carClass[fl]);

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <BrandHeader />
      <FlatList
        data={list}
        keyExtractor={(x) => x.slug}
        contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={c.primary} />}
        ListHeaderComponent={
          <View>
            <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View>
                <Text style={t.headlineLgMobile}>{d.cars.title}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <Dot />
                  <Text style={t.bodySm}>{cars.length} {d.cars.available}</Text>
                </View>
              </View>
              <View style={s.city}>
                <Icon name="verified" size={16} color={c.secondary} />
                <Text style={[t.labelSm, { color: c.secondary, textTransform: "uppercase" }]}>{d.cars.city}</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8, gap: 8 }}>
              {filters.map((fl) => {
                const active = fl === filter;
                return (
                  <Pressable key={fl} onPress={() => setFilter(fl)} style={[s.chip, active && s.chipActive]}>
                    <Text style={[t.labelMd, { color: active ? c.primary : c.onVariant }]}>{label(fl)}</Text>
                    {fl === "ALL" ? <Text style={s.chipCount}>{cars.length}</Text> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
            <View style={{ paddingHorizontal: 20, paddingTop: 4 }}><OfflineBanner /></View>
          </View>
        }
        renderItem={({ item }) => <View style={{ paddingHorizontal: 20, paddingTop: 16 }}><CatalogCard car={item} d={d} /></View>}
        ListEmptyComponent={<Text style={[t.bodySm, { textAlign: "center", marginTop: 40 }]}>{d.cars.empty}</Text>}
        ListFooterComponent={
          <Pressable onPress={() => Linking.openURL(site.phoneHref)} style={s.help}>
            <View style={s.helpIcon}><Icon name="support-agent" size={24} /></View>
            <View style={{ flex: 1 }}>
              <Text style={[t.headlineSm, { fontSize: 15, lineHeight: 20 }]}>{d.cars.helpTitle}</Text>
              <Text style={t.bodySm}>{d.cars.helpText}</Text>
            </View>
          </Pressable>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  city: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(42,42,42,0.8)", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  chipActive: { backgroundColor: "rgba(201,164,92,0.22)", borderColor: "rgba(201,164,92,0.45)" },
  chipCount: { fontFamily: f.display, fontSize: 10, color: c.primary, backgroundColor: "rgba(0,0,0,0.2)", paddingHorizontal: 6, borderRadius: 999, overflow: "hidden" },
  help: { flexDirection: "row", alignItems: "center", gap: 14, margin: 20, marginTop: 24, padding: 16, borderRadius: 16, backgroundColor: c.high },
  helpIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(232,193,118,0.1)", alignItems: "center", justifyContent: "center" },
});
