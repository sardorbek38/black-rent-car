import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDict, isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ru = locale === "ru";
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: ru ? "Black Rent Car | Аренда авто в Ташкенте" : "Black Rent Car | Toshkentda avtomobil ijarasi", template: "%s | Black Rent Car" },
    description: ru
      ? "Аренда автомобилей в Ташкенте: оформление за 5 минут, подача по городу. Для бизнеса, отдыха и поездок."
      : "Toshkentda avtomobil ijarasi: 5 daqiqada rasmiylashtirish, shahar bo'ylab yetkazib berish. Biznes, dam olish va sayohat uchun.",
    icons: { icon: "/logo.png" },
    openGraph: { images: ["/cars/byd-han/main.webp"], siteName: "Black Rent Car", locale: ru ? "ru_RU" : "uz_UZ" },
    alternates: { languages: { uz: "/uz", ru: "/ru" } },
  };
}

export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0&icon_names=account_balance_wallet,add,airline_seat_recline_normal,arrow_forward,arrow_outward,badge,bolt,calendar_month,calendar_today,call,check,chevron_right,description,directions_car,edit,event_available,event_note,gavel,group,home,insights,key,local_gas_station,local_shipping,location_on,logout,map,notifications_active,person,photo_camera,receipt_long,schedule,search,search_off,sell,send,settings,speed,storefront,support_agent,timer,today,verified_user,work,workspace_premium&display=block" rel="stylesheet" />
      </head>
      <body className="min-h-dvh">
        <Header locale={locale} t={t} />
        <main>{children}</main>
        <Footer locale={locale} t={t} />
      </body>
    </html>
  );
}
