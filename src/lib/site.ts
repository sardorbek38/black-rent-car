// Kompaniya kontaktlari. null = mijozdan hali olinmagan.
export const site = {
  name: "Black Rent Car",
  phone: "+998 90 950 00 15",
  phoneHref: "tel:+998909500015",
  instagram: "black.rent.cars",
  instagramHref: "https://instagram.com/black.rent.cars",
  telegram: null as string | null, // masalan "blackrentcar"
  // VAQTINCHA manzil: mijoz haqiqiy manzilni bermaguncha
  address: { uz: "Toshkent sh., Amir Temur shoh ko'chasi", ru: "г. Ташкент, проспект Амира Темура" } as { uz: string; ru: string } | null,
  hours: "24/7",
};

export const telegramHref = site.telegram ? `https://t.me/${site.telegram}` : null;

// Saytning asosiy manzili. O'z domeni ulansa, Vercel'da NEXT_PUBLIC_SITE_URL ni yangilash kifoya.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");
