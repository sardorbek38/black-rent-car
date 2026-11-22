// Ranglar va shriftlar Google Stitch mobil dizaynidan (DESIGN.md "Tashkent Prestige Automotive")
export const c = {
  surface: "#131313",
  lowest: "#0E0E0E",
  low: "#1C1B1B",
  container: "#201F1F",
  high: "#2A2A2A",
  highest: "#353534",
  onSurface: "#E5E2E1",
  onVariant: "#D1C5B4",
  outline: "#9A8F80",
  outlineVariant: "#4E4639",
  primary: "#E8C176",
  primaryContainer: "#C9A45C",
  primaryFixed: "#FFDEA4",
  onPrimary: "#412D00",
  secondary: "#E5C27A",
  secondaryContainer: "#5B4305",
  onSecondaryContainer: "#D2B16B",
  error: "#FFB4AB",
  green: "#34D399",
  glass: "rgba(0,0,0,0.45)",
  glassBorder: "rgba(255,255,255,0.18)",
  goldTint: "rgba(201,164,92,0.15)",
  goldBorder: "rgba(201,164,92,0.3)",
};

export const f = {
  heroItalic: "Montserrat_800ExtraBold_Italic",
  extra: "Montserrat_800ExtraBold",
  display: "Montserrat_700Bold",
  displaySemi: "Montserrat_600SemiBold",
  body: "Inter_400Regular",
  bodyMed: "Inter_500Medium",
  bodySemi: "Inter_600SemiBold",
};

// Stitch: bg-gradient-to-r from-primary-container to-primary
export const goldGradient = [c.primaryContainer, c.primary] as const;

// Stitch tipografiyasi
export const t = {
  headlineLgMobile: { fontFamily: f.display, fontSize: 26, lineHeight: 34, letterSpacing: 0.26, color: c.onSurface },
  headlineMd: { fontFamily: f.display, fontSize: 24, lineHeight: 32, letterSpacing: 0.7, color: c.onSurface },
  headlineSm: { fontFamily: f.displaySemi, fontSize: 18, lineHeight: 26, letterSpacing: 0.7, color: c.onSurface },
  bodyMd: { fontFamily: f.body, fontSize: 15, lineHeight: 24, color: c.onSurface },
  bodySm: { fontFamily: f.body, fontSize: 13, lineHeight: 20, color: c.onVariant },
  labelLg: { fontFamily: f.bodySemi, fontSize: 14, lineHeight: 18, letterSpacing: 0.28, color: c.onSurface },
  labelMd: { fontFamily: f.bodySemi, fontSize: 12, lineHeight: 16, letterSpacing: 0.6, color: c.onSurface },
  labelSm: { fontFamily: f.bodySemi, fontSize: 10, lineHeight: 14, letterSpacing: 0.8, color: c.onSurface },
} as const;
