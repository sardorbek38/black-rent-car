import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "../lib/store";
import { c, f, t } from "../lib/theme";
import { Icon } from "./ui";

/** Stitch: BR logotipi + BLACK RENT CAR + til tugmasi */
export function BrandHeader() {
  const insets = useSafeAreaInsets();
  const { locale, setLocale } = useStore();
  return (
    <View style={[s.wrap, { paddingTop: insets.top }]}>
      <View style={s.row}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={s.logoOuter}>
            <View style={s.logoInner}>
              <Text style={s.logoText}>BR</Text>
            </View>
          </View>
          <View>
            <Text style={[t.headlineSm, { textTransform: "uppercase", letterSpacing: 1.1, lineHeight: 20 }]}>Black Rent Car</Text>
            <Text style={[t.labelSm, { color: "rgba(232,193,118,0.8)", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }]}>{useStore().t.brandSub}</Text>
          </View>
        </View>
        <Pressable
          accessibilityLabel="Tilni tanlash"
          onPress={() => setLocale(locale === "uz" ? "ru" : "uz")}
          style={({ pressed }) => [s.lang, pressed && { opacity: 0.7 }]}
          hitSlop={6}
        >
          <Icon name="translate" size={16} color={c.onVariant} />
          <Text style={[t.labelSm, { fontSize: 11, fontFamily: f.display, color: c.primary }]}>{locale.toUpperCase()}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Stitch: orqaga strelka + katta harfli sarlavha */
export function BackHeader({ title, right }: { title: string; right?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.wrap, { paddingTop: insets.top }]}>
      <View style={s.row}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1 }}>
          <Pressable accessibilityLabel="Orqaga" onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))} style={s.back} hitSlop={6}>
            <Icon name="arrow-back" size={24} color={c.onSurface} />
          </Pressable>
          <Text style={[t.headlineSm, { textTransform: "uppercase", letterSpacing: 0.9, flexShrink: 1 }]} numberOfLines={1}>{title}</Text>
        </View>
        {right}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { backgroundColor: "rgba(15,15,15,0.92)", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)", zIndex: 10 },
  row: { height: 64, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logoOuter: { width: 36, height: 36, borderRadius: 18, backgroundColor: c.lowest, padding: 2, shadowColor: c.primaryContainer, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  logoInner: { flex: 1, borderRadius: 16, backgroundColor: c.low, alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: f.heroItalic, fontSize: 14, color: c.primary, letterSpacing: -0.7 },
  lang: { height: 36, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 999, backgroundColor: "rgba(28,27,27,0.6)" },
  back: { width: 44, height: 44, marginLeft: -8, alignItems: "center", justifyContent: "center" },
});
