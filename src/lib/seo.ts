import type { Metadata } from "next";
import type { Locale } from "./i18n";

export function defaultTexts(locale: Locale) {
  const ru = locale === "ru";
  return {
    title: ru ? "Black Rent Car | Аренда авто в Ташкенте" : "Black Rent Car | Toshkentda avtomobil ijarasi",
    description: ru
      ? "Аренда автомобилей в Ташкенте: оформление за 5 минут, подача по городу. Для бизнеса, отдыха и поездок."
      : "Toshkentda avtomobil ijarasi: 5 daqiqada rasmiylashtirish, shahar bo'ylab yetkazib berish. Biznes, dam olish va sayohat uchun.",
  };
}

// Next.js openGraph'ni ota layout bilan birlashtirmaydi, shuning uchun umumiy qiymatlar har sahifada beriladi.
export function baseOpenGraph(locale: Locale) {
  return {
    type: "website" as const,
    siteName: "Black Rent Car",
    locale: locale === "ru" ? "ru_RU" : "uz_UZ",
    alternateLocale: locale === "ru" ? "uz_UZ" : "ru_RU",
    images: [{ url: "/cars/byd-han/main.webp", alt: "Black Rent Car" }],
  };
}

// Har bir sahifa uchun canonical va uz/ru muqobil havolalar (Google ikki tilni bog'lashi uchun).
export function pageMeta(locale: Locale, path: string, extra: Metadata = {}): Metadata {
  const url = `/${locale}${path}`;
  const d = defaultTexts(locale);
  const ogTitle = typeof extra.title === "string" ? `${extra.title} | Black Rent Car` : d.title;
  const ogDescription = typeof extra.description === "string" ? extra.description : d.description;
  const og = Object.fromEntries(Object.entries(extra.openGraph ?? {}).filter(([, v]) => v !== undefined));
  return {
    ...extra,
    alternates: { canonical: url, languages: { uz: `/uz${path}`, ru: `/ru${path}`, "x-default": `/uz${path}` } },
    openGraph: { ...baseOpenGraph(locale), title: ogTitle, description: ogDescription, url, ...og },
  };
}
