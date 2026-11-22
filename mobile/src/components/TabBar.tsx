import type { BottomTabBarProps } from "expo-router/tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { c, t } from "../lib/theme";
import { Icon, type IconName } from "./ui";

const ICONS: Record<string, IconName> = { index: "home", cars: "directions-car", book: "calendar-month", contacts: "call" };

/** Stitch: suzuvchi shisha pill menyu, faol bo'lim oltin ramkada */
export function TabBar({ state, descriptors, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[s.outer, { bottom: Math.max(insets.bottom, 8) + 8 }]}>
      <View style={s.bar}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const label = descriptors[route.key].options.title ?? route.name;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              onPress={() => {
                const e = emitter.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
                if (!focused && !e.defaultPrevented) navigateToTab(route.key);
              }}
              style={[s.item, focused && s.active]}
            >
              <Icon name={ICONS[route.name] ?? "circle"} size={22} color={focused ? c.primary : c.onVariant} />
              <Text style={[t.labelSm, { marginTop: 4, letterSpacing: 0.3, color: focused ? c.primary : c.onVariant }]} numberOfLines={1}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export const TAB_BAR_SPACE = 104;

const s = StyleSheet.create({
  outer: { position: "absolute", left: 16, right: 16 },
  bar: {
    height: 64, borderRadius: 999, flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingHorizontal: 4,
    backgroundColor: "rgba(20,20,20,0.94)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000", shadowOpacity: 0.6, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, elevation: 12,
  },
  item: { minWidth: 64, minHeight: 48, alignItems: "center", justifyContent: "center", paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: "transparent" },
  active: { backgroundColor: c.goldTint, borderColor: c.goldBorder },
});
