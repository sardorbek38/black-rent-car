// Kompaniya kontaktlari. null = mijozdan hali olinmagan.
export const site = {
  name: "Black Rent Car",
  phone: "+998 90 950 00 15",
  phoneHref: "tel:+998909500015",
  instagram: "black.rent.cars",
  instagramHref: "https://instagram.com/black.rent.cars",
  telegram: null as string | null, // masalan "blackrentcar"
  address: null as { uz: string; ru: string } | null,
  hours: "24/7",
};

export const telegramHref = site.telegram ? `https://t.me/${site.telegram}` : null;
