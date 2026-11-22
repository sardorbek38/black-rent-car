import { Pressable, StyleSheet, Text } from "react-native";
import { useStore } from "../lib/store";
import { c, t } from "../lib/theme";
import { Icon } from "./ui";

export function OfflineBanner() {
  const { offline, loading, refresh, t: d } = useStore();
  if (!offline || loading) return null;
  return (
    <Pressable onPress={refresh} style={s.wrap}>
      <Icon name="wifi-off" size={16} color={c.secondary} />
      <Text style={[t.bodySm, { flex: 1, color: c.secondary, fontSize: 12 }]}>{d.common.offline}</Text>
      <Text style={[t.labelMd, { color: c.primary, textDecorationLine: "underline" }]}>{d.common.retry}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, backgroundColor: c.low, borderWidth: 1, borderColor: c.goldBorder, padding: 12 },
});
