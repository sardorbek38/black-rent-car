import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDict, isLocale, locales, type Locale } from "@/lib/i18n";
import { site, siteUrl } from "@/lib/site";
import { baseOpenGraph, defaultTexts } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ru = locale === "ru";
  const { title, description } = defaultTexts(locale as Locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: "%s | Black Rent Car" },
    description,
    applicationName: "Black Rent Car",
    keywords: ru
      ? ["аренда авто Ташкент", "прокат автомобилей Ташкент", "аренда машины", "Black Rent Car", "BYD", "Chevrolet Malibu"]
      : ["avtomobil ijarasi Toshkent", "mashina ijarasi", "prokat Toshkent", "Black Rent Car", "BYD", "Chevrolet Malibu"],
    icons: { icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/logo.png", type: "image/png" }], apple: "/apple-touch-icon.png" },
    openGraph: { ...baseOpenGraph(locale as Locale), title, description },
    twitter: { card: "summary_large_image" },
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
    formatDetection: { telephone: false },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(locale)) }} />
        <Header locale={locale} t={t} />
        <main>{children}</main>
        <Footer locale={locale} t={t} />
      </body>
    </html>
  );
}

// Google uchun kompaniya ma'lumoti. Faqat tasdiqlangan faktlar: manzil, narx va ish vaqti mijoz tasdiqlagach qo'shiladi.
function businessJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": `${siteUrl}/#business`,
    name: site.name,
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/cars/byd-han/main.webp`,
    telephone: site.phone.replace(/\s/g, ""),
    description: locale === "ru" ? "Аренда автомобилей в Ташкенте с подачей по городу." : "Toshkentda avtomobil ijarasi, shahar bo'ylab yetkazib berish bilan.",
    areaServed: { "@type": "City", name: locale === "ru" ? "Ташкент" : "Toshkent" },
    sameAs: [site.instagramHref, ...(site.telegram ? [`https://t.me/${site.telegram}`] : [])],
    ...(site.address ? { address: { "@type": "PostalAddress", streetAddress: site.address[locale], addressLocality: "Tashkent", addressCountry: "UZ" } } : {}),
  };
}
