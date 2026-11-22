import type { Car } from "./types";

// Internet bo'lmaganda ko'rsatiladigan zaxira ro'yxat (sayt bazasidagi seed bilan bir xil).
// Narxlar mijozdan kelmaguncha null. Yil, quti, yoqilg'i taxmin: admin paneldan to'g'rilanadi.
type Seed = Pick<Car, "slug" | "brand" | "model" | "carClass" | "bodyType" | "fuel" | "automatic" | "seats" | "descriptionUz" | "descriptionRu">;

const seed: Seed[] = [
  { slug: "chevrolet-malibu", brand: "Chevrolet", model: "Malibu", carClass: "BUSINESS", bodyType: "SEDAN", fuel: "PETROL", automatic: true, seats: 5,
    descriptionUz: "Biznes uchrashuvlar va shahar bo'ylab qulay safarlar uchun keng va sokin sedan.",
    descriptionRu: "Просторный и тихий седан для деловых встреч и комфортных поездок по городу." },
  { slug: "byd-chazor", brand: "BYD", model: "Chazor", carClass: "BUSINESS", bodyType: "SEDAN", fuel: "HYBRID", automatic: true, seats: 5,
    descriptionUz: "Zamonaviy gibrid sedan: tejamkor, jim va texnologik.",
    descriptionRu: "Современный гибридный седан: экономичный, тихий и технологичный." },
  { slug: "byd-han", brand: "BYD", model: "Han", carClass: "PREMIUM", bodyType: "SEDAN", fuel: "ELECTRIC", automatic: true, seats: 5,
    descriptionUz: "Premium klassdagi flagman sedan. Muhim tadbirlar va VIP mehmonlar uchun.",
    descriptionRu: "Флагманский седан премиум-класса. Для важных событий и VIP-гостей." },
  { slug: "bmw-i3-35l", brand: "BMW", model: "i3 35L", carClass: "PREMIUM", bodyType: "SEDAN", fuel: "ELECTRIC", automatic: true, seats: 5,
    descriptionUz: "Nemis sifati va sport xarakteri bir mashinada.",
    descriptionRu: "Немецкое качество и спортивный характер в одном автомобиле." },
  { slug: "chevrolet-lacetti", brand: "Chevrolet", model: "Lacetti", carClass: "ECONOM", bodyType: "SEDAN", fuel: "PETROL", automatic: null, seats: 5,
    descriptionUz: "Ishonchli va tejamkor sedan. Kundalik ishlar uchun eng qulay tanlov.",
    descriptionRu: "Надёжный и экономичный седан. Лучший выбор для повседневных дел." },
  { slug: "byd-champion", brand: "BYD", model: "Champion", carClass: "BUSINESS", bodyType: "CROSSOVER", fuel: "HYBRID", automatic: true, seats: 5,
    descriptionUz: "Oila va sayohatlar uchun keng krossover.",
    descriptionRu: "Просторный кроссовер для семьи и путешествий." },
  { slug: "chevrolet-monza", brand: "Chevrolet", model: "Monza", carClass: "COMFORT", bodyType: "SEDAN", fuel: "PETROL", automatic: true, seats: 5,
    descriptionUz: "Zamonaviy dizayndagi qulay sedan, shahar uchun ideal.",
    descriptionRu: "Комфортный седан современного дизайна, идеален для города." },
  { slug: "li-auto-l9", brand: "Li Auto", model: "L9", carClass: "PREMIUM", bodyType: "SUV", fuel: "RANGE_EXTENDER", automatic: true, seats: 6,
    descriptionUz: "Katta premium SUV: 6 o'rindiq, uzoq safarlar va delegatsiyalar uchun.",
    descriptionRu: "Большой премиальный SUV: 6 мест, для дальних поездок и делегаций." },
];

export const fallbackCars: Car[] = seed.map((s) => ({
  ...s,
  year: null,
  pricePerDay: null,
  price3Days: null,
  price7Days: null,
  deposit: null,
  status: "AVAILABLE",
  images: ["main", "front", "rear", "poster"].map((n) => `/cars/${s.slug}/${n}.webp`),
}));
