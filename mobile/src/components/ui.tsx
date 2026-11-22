import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { ComponentProps, ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { c, f, goldGradient, t } from "../lib/theme";

export type IconName = ComponentProps<typeof MaterialIcons>["name"];

export function Icon({ name, size = 18, color = c.primary, style }: { name: IconName; size?: number; color?: string; style?: StyleProp<TextStyle> }) {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}

export function Txt({ children, style, numberOfLines }: { children: ReactNode; style?: StyleProp<TextStyle>; numberOfLines?: number }) {
  return <Text style={style} numberOfLines={numberOfLines}>{children}</Text>;
}

/** Oltin gradientli tugma (Stitch: from-primary-container to-primary) */
export function GoldButton({ label, onPress, icon, iconRight, loading, style, height = 48, textStyle }: {
  label: string; onPress?: () => void; icon?: IconName; iconRight?: IconName; loading?: boolean; style?: StyleProp<ViewStyle>; height?: number; textStyle?: StyleProp<TextStyle>;
}) {
  return (
    <Pressable onPress={onPress} disabled={loading} style={({ pressed }) => [st.shadowGold, { transform: [{ scale: pressed ? 0.97 : 1 }] }, style]}>
      <LinearGradient colors={goldGradient} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={[st.pill, { height }]}>
        {loading ? <ActivityIndicator color={c.onPrimary} /> : icon ? <Icon name={icon} color={c.onPrimary} size={19} /> : null}
        <Text style={[t.labelLg, { fontFamily: f.display, color: c.onPrimary }, textStyle]}>{label}</Text>
        {iconRight && !loading ? <Icon name={iconRight} color={c.onPrimary} size={18} /> : null}
      </LinearGradient>
    </Pressable>
  );
}

/** To'q kulrang pill tugma (Stitch: bg-surface-container-high) */
export function DarkButton({ label, onPress, icon, style, height = 48, iconColor = c.primary }: {
  label: string; onPress?: () => void; icon?: IconName; style?: StyleProp<ViewStyle>; height?: number; iconColor?: string;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [st.pill, { height, backgroundColor: pressed ? c.highest : c.high }, style]}>
      {icon ? <Icon name={icon} color={iconColor} size={19} /> : null}
      <Text style={[t.labelLg, { color: c.onSurface }]}>{label}</Text>
    </Pressable>
  );
}

/** Rasm ustidagi shisha badge (Stitch: rgba(0,0,0,.45) + oq chegara) */
export function GlassBadge({ label, icon }: { label: string; icon?: IconName }) {
  return (
    <View style={st.glass}>
      {icon ? <Icon name={icon} size={13} /> : null}
      <Text style={[t.labelSm, { color: c.primary, fontFamily: f.display, textTransform: "uppercase" }]}>{label}</Text>
    </View>
  );
}

export function Dot({ color = c.primary, size = 6 }: { color?: string; size?: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[st.card, style]}>{children}</View>;
}

export function IconCircle({ name, size = 40, bg = c.highest, iconSize = 20 }: { name: IconName; size?: number; bg?: string; iconSize?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      <Icon name={name} size={iconSize} />
    </View>
  );
}

export const st = StyleSheet.create({
  pill: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 999, paddingHorizontal: 16 },
  shadowGold: { borderRadius: 999, shadowColor: c.primaryContainer, shadowOpacity: 0.25, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  glass: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: c.glass, borderWidth: 1, borderColor: c.glassBorder },
  card: { backgroundColor: c.low, borderRadius: 16 },
});
