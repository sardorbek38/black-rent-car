import { PrismaClient, CarClass, BodyType, Fuel } from "@prisma/client";

const prisma = new PrismaClient();

// Narxlar mijozdan kelmaguncha null. Yil, quti va yoqilg'i turi ham taxmin:
// admin paneldan tekshirib to'g'rilash kerak.
const cars: {
  slug: string; brand: string; model: string; carClass: CarClass; bodyType: BodyType;
  fuel: Fuel | null; automatic: boolean | null; seats: number; uz: string; ru: string;
}[] = [
  { slug: "chevrolet-malibu", brand: "Chevrolet", model: "Malibu", carClass: "BUSINESS", bodyType: "SEDAN", fuel: "PETROL", automatic: true, seats: 5,
    uz: "Biznes uchrashuvlar va shahar bo'ylab qulay safarlar uchun keng va sokin sedan.",
    ru: "Просторный и тихий седан для деловых встреч и комфортных поездок по городу." },
  { slug: "byd-chazor", brand: "BYD", model: "Chazor", carClass: "BUSINESS", bodyType: "SEDAN", fuel: "HYBRID", automatic: true, seats: 5,
    uz: "Zamonaviy gibrid sedan: tejamkor, jim va texnologik.",
    ru: "Современный гибридный седан: экономичный, тихий и технологичный." },
  { slug: "byd-han", brand: "BYD", model: "Han", carClass: "PREMIUM", bodyType: "SEDAN", fuel: "ELECTRIC", automatic: true, seats: 5,
    uz: "Premium klassdagi flagman sedan. Muhim tadbirlar va VIP mehmonlar uchun.",
    ru: "Флагманский седан премиум-класса. Для важных событий и VIP-гостей." },
  { slug: "bmw-i3-35l", brand: "BMW", model: "i3 35L", carClass: "PREMIUM", bodyType: "SEDAN", fuel: "ELECTRIC", automatic: true, seats: 5,
    uz: "Nemis sifati va sport xarakteri bir mashinada.",
    ru: "Немецкое качество и спортивный характер в одном автомобиле." },
  { slug: "chevrolet-lacetti", brand: "Chevrolet", model: "Lacetti", carClass: "ECONOM", bodyType: "SEDAN", fuel: "PETROL", automatic: null, seats: 5,
    uz: "Ishonchli va tejamkor sedan. Kundalik ishlar uchun eng qulay tanlov.",
    ru: "Надёжный и экономичный седан. Лучший выбор для повседневных дел." },
  { slug: "byd-champion", brand: "BYD", model: "Champion", carClass: "BUSINESS", bodyType: "CROSSOVER", fuel: "HYBRID", automatic: true, seats: 5,
    uz: "Oila va sayohatlar uchun keng krossover.",
    ru: "Просторный кроссовер для семьи и путешествий." },
  { slug: "chevrolet-monza", brand: "Chevrolet", model: "Monza", carClass: "COMFORT", bodyType: "SEDAN", fuel: "PETROL", automatic: true, seats: 5,
    uz: "Zamonaviy dizayndagi qulay sedan, shahar uchun ideal.",
    ru: "Комфортный седан современного дизайна, идеален для города." },
  { slug: "li-auto-l9", brand: "Li Auto", model: "L9", carClass: "PREMIUM", bodyType: "SUV", fuel: "RANGE_EXTENDER", automatic: true, seats: 6,
    uz: "Katta premium SUV: 6 o'rindiq, uzoq safarlar va delegatsiyalar uchun.",
    ru: "Большой премиальный SUV: 6 мест, для дальних поездок и делегаций." },
];

// VAQTINCHA narxlar (so'm): Toshkent bozoriga yaqin taxmin, mijoz haqiqiy narxni bermaguncha.
// Faqat narxi bo'sh mashinalarga qo'yiladi, admin paneldagi o'zgarishlarni bosib ketmaydi.
const placeholderPrices: Record<string, [day: number, d3: number, d7: number, deposit: number]> = {
  "chevrolet-lacetti": [350_000, 320_000, 300_000, 1_000_000],
  "chevrolet-monza": [450_000, 420_000, 400_000, 1_500_000],
  "chevrolet-malibu": [600_000, 550_000, 500_000, 2_000_000],
  "byd-chazor": [600_000, 550_000, 500_000, 2_000_000],
  "byd-champion": [700_000, 650_000, 600_000, 2_000_000],
  "byd-han": [900_000, 850_000, 800_000, 3_000_000],
  "bmw-i3-35l": [1_000_000, 950_000, 900_000, 3_000_000],
  "li-auto-l9": [1_500_000, 1_400_000, 1_300_000, 5_000_000],
};

async function main() {
  for (const [i, c] of cars.entries()) {
    const images = ["main", "front", "rear", "poster"].map((n) => `/cars/${c.slug}/${n}.webp`);
    const data = {
      brand: c.brand, model: c.model, carClass: c.carClass, bodyType: c.bodyType, fuel: c.fuel,
      automatic: c.automatic, seats: c.seats, descriptionUz: c.uz, descriptionRu: c.ru, images, sortOrder: i,
    };
    await prisma.car.upsert({ where: { slug: c.slug }, update: {}, create: { slug: c.slug, ...data } });
  }
  for (const [slug, [pricePerDay, price3Days, price7Days, deposit]] of Object.entries(placeholderPrices)) {
    await prisma.car.updateMany({ where: { slug, pricePerDay: null }, data: { pricePerDay, price3Days, price7Days, deposit } });
  }
  console.log(`Seeded ${cars.length} cars`);
}

main().finally(() => prisma.$disconnect());
