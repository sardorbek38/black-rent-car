// Kompaniya kontaktlari (saytdagi src/lib/site.ts bilan bir xil).
// null = mijozdan hali olinmagan.
export const API_BASE = "https://black-rent-car.vercel.app";

export const site = {
  name: "Black Rent Car",
  phone: "+998 90 950 00 15",
  phoneHref: "tel:+998909500015",
  instagram: "black.rent.cars",
  instagramHref: "https://instagram.com/black.rent.cars",
  telegram: null as string | null, // [?] mijozdan so'ralishi kerak
  website: API_BASE,
};
