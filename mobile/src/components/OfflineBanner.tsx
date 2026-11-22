import { Pressable, StyleSheet, Text } from "react-native";
import { useStore } from "../lib/store";
import { c, f } from "../lib/theme";
import { Icon } from "./ui";

export function OfflineBanner() {
  const { offline, loading, refresh, t } = useStore();
  if (!offline || loading) return null;
  return (
    <Pressable onPress={refresh} style={st.wrap}>
      <Icon name="wifi-off" size={16} color={c.goldLight} />
      <Text style={st.text}>{t.common.offline}</Text>
      <Text style={st.retry}>{t.common.retry}</Text>
    </Pressable>
  );
}

const st = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 14, borderWidth: 1, borderColor: "rgba(201,164,92,0.3)", backgroundColor: "rgba(201,164,92,0.08)", padding: 12 },
  text: { flex: 1, fontFamily: f.body, fontSize: 12.5, color: c.goldLight },
  retry: { fontFamily: f.bodySemi, fontSize: 12.5, color: c.gold, textDecorationLine: "underline" },
});
