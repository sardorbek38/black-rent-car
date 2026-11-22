import { Pressable, StyleSheet, Text, View } from "react-native";
import { useStore } from "../lib/store";
import { c, f } from "../lib/theme";

export function LangSwitch() {
  const { locale, setLocale } = useStore();
  return (
    <View style={st.wrap}>
      {(["uz", "ru"] as const).map((l) => (
        <Pressable key={l} onPress={() => setLocale(l)} style={[st.item, locale === l && st.active]} hitSlop={6}>
          <Text style={[st.text, locale === l && { color: c.ink }]}>{l.toUpperCase()}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { flexDirection: "row", borderRadius: 999, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, padding: 3 },
  item: { borderRadius: 999, paddingHorizontal: 11, paddingVertical: 5 },
  active: { backgroundColor: c.gold },
  text: { fontFamily: f.display, fontSize: 11, color: c.muted, letterSpacing: 0.6 },
});
