import { useMemo, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CarCard } from "../../components/CarCard";
import { LangSwitch } from "../../components/LangSwitch";
import { OfflineBanner } from "../../components/OfflineBanner";
import { Body, FilterChip, H1 } from "../../components/ui";
import { useStore } from "../../lib/store";
import { c } from "../../lib/theme";
import type { BodyType } from "../../lib/types";

type Sort = "default" | "cheap" | "expensive";

export default function Cars() {
  const { t, cars, loading, refresh } = useStore();
  const insets = useSafeAreaInsets();
  const [body, setBody] = useState<BodyType | "ALL">("ALL");
  const [sort, setSort] = useState<Sort>("default");
  const hasPrices = cars.some((x) => x.pricePerDay);

  const list = useMemo(() => {
    const filtered = cars.filter((x) => body === "ALL" || x.bodyType === body);
    if (sort === "default") return filtered;
    // narxi yo'qlar oxirida
    return [...filtered].sort((a, b) => {
      const pa = a.pricePerDay ?? Infinity, pb = b.pricePerDay ?? Infinity;
      if (pa === Infinity || pb === Infinity) return pa === pb ? 0 : pa === Infinity ? 1 : -1;
      return sort === "cheap" ? pa - pb : pb - pa;
    });
  }, [cars, body, sort]);

  const bodies: (BodyType | "ALL")[] = ["ALL", "SEDAN", "CROSSOVER", "SUV"];

  return (
    <FlatList
      style={{ backgroundColor: c.ink }}
      data={list}
      keyExtractor={(x) => x.slug}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 32, gap: 16 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={c.gold} />}
      ListHeaderComponent={
        <View style={{ gap: 14 }}>
          <View style={st.head}>
            <H1 style={{ fontSize: 26 }}>{t.cars.title}</H1>
            <LangSwitch />
          </View>
          <Body dim>{list.length} {t.cars.count}</Body>
          <OfflineBanner />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {bodies.map((b) => (
              <FilterChip key={b} label={b === "ALL" ? t.common.all : t.bodyType[b]} active={body === b} onPress={() => setBody(b)} />
            ))}
            {hasPrices && (
              <>
                <View style={st.sep} />
                <FilterChip label={t.cars.sortCheap} active={sort === "cheap"} onPress={() => setSort(sort === "cheap" ? "default" : "cheap")} />
                <FilterChip label={t.cars.sortExpensive} active={sort === "expensive"} onPress={() => setSort(sort === "expensive" ? "default" : "expensive")} />
              </>
            )}
          </ScrollView>
        </View>
      }
      renderItem={({ item }) => <CarCard car={item} t={t} />}
      ListEmptyComponent={<Text style={{ color: c.muted, textAlign: "center", marginTop: 40 }}>{t.cars.empty}</Text>}
    />
  );
}

const st = StyleSheet.create({
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sep: { width: 1, backgroundColor: c.line, marginHorizontal: 4 },
});
