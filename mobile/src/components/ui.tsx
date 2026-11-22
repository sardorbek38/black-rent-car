import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { ComponentProps, ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { c, f, goldGradient } from "../lib/theme";

export type IconName = ComponentProps<typeof MaterialIcons>["name"];

export function Icon({ name, size = 18, color = c.gold }: { name: IconName; size?: number; color?: string }) {
  return <MaterialIcons name={name} size={size} color={color} />;
}

export function Kicker({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[s.kicker, style]}>{children}</Text>;
}

export function H1({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[s.h1, style]}>{children}</Text>;
}

export function H2({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[s.h2, style]}>{children}</Text>;
}

export function Body({ children, style, dim }: { children: ReactNode; style?: StyleProp<TextStyle>; dim?: boolean }) {
  return <Text style={[s.body, dim && { color: c.dim }, style]}>{children}</Text>;
}

type BtnProps = { label: string; onPress?: () => void; icon?: IconName; loading?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle>; small?: boolean };

export function GoldButton({ label, onPress, icon, loading, disabled, style, small }: BtnProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [{ opacity: pressed || disabled ? 0.8 : 1 }, style]}>
      <LinearGradient colors={goldGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.btn, small && s.btnSmall]}>
        {loading ? <ActivityIndicator color={c.ink} /> : icon ? <Icon name={icon} color={c.ink} size={small ? 16 : 18} /> : null}
        <Text style={[s.btnText, { color: c.ink }, small && s.btnTextSmall]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function GhostButton({ label, onPress, icon, style, small, outline }: BtnProps & { outline?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.btn, small && s.btnSmall, outline ? s.outline : s.ghost, pressed && { opacity: 0.75 }, style]}
    >
      {icon ? <Icon name={icon} color={outline ? c.gold : c.fg} size={small ? 16 : 18} /> : null}
      <Text style={[s.btnText, { color: outline ? c.gold : c.fg }, small && s.btnTextSmall]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, icon }: { label: string; icon?: IconName }) {
  return (
    <View style={s.chip}>
      {icon ? <Icon name={icon} size={14} color={c.muted} /> : null}
      <Text style={s.chipText}>{label}</Text>
    </View>
  );
}

export function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.filter, active && s.filterActive]}>
      <Text style={[s.filterText, active && { color: c.ink }]}>{label}</Text>
    </Pressable>
  );
}

export function Badge({ label, gold = true }: { label: string; gold?: boolean }) {
  return (
    <View style={[s.badge, { backgroundColor: gold ? c.gold : "rgba(10,10,10,0.8)" }]}>
      <Text style={[s.badgeText, { color: gold ? c.ink : c.muted }]}>{label}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export const s = StyleSheet.create({
  kicker: { fontFamily: f.display, fontSize: 11, letterSpacing: 1.6, textTransform: "uppercase", color: c.gold },
  h1: { fontFamily: f.display, fontSize: 30, lineHeight: 36, color: c.fg },
  h2: { fontFamily: f.display, fontSize: 22, lineHeight: 28, color: c.fg },
  body: { fontFamily: f.body, fontSize: 15, lineHeight: 22, color: c.muted },
  btn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 999, paddingHorizontal: 22, paddingVertical: 15 },
  btnSmall: { paddingHorizontal: 12, paddingVertical: 11 },
  btnText: { fontFamily: f.display, fontSize: 13, letterSpacing: 0.8, textTransform: "uppercase" },
  btnTextSmall: { fontSize: 11.5 },
  ghost: { backgroundColor: c.raised, borderWidth: 1, borderColor: c.line },
  outline: { borderWidth: 1.5, borderColor: c.gold },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 999, borderWidth: 1, borderColor: c.line, backgroundColor: c.raised, paddingHorizontal: 10, paddingVertical: 6 },
  chipText: { fontFamily: f.body, fontSize: 12.5, color: c.muted },
  filter: { borderRadius: 999, borderWidth: 1, borderColor: c.line, backgroundColor: c.card, paddingHorizontal: 16, paddingVertical: 9 },
  filterActive: { backgroundColor: c.gold, borderColor: c.gold },
  filterText: { fontFamily: f.bodySemi, fontSize: 13, color: c.fg },
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontFamily: f.display, fontSize: 9.5, letterSpacing: 0.8, textTransform: "uppercase" },
  card: { backgroundColor: c.card, borderRadius: 20, borderWidth: 1, borderColor: c.line },
});
