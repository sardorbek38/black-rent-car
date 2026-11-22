export type CarClass = "ECONOM" | "COMFORT" | "BUSINESS" | "PREMIUM";
export type BodyType = "SEDAN" | "CROSSOVER" | "SUV";
export type Fuel = "PETROL" | "HYBRID" | "ELECTRIC" | "RANGE_EXTENDER";
export type CarStatus = "AVAILABLE" | "RENTED" | "SERVICE";

// /api/cars javobidagi mashina (prisma Car modeli)
export type Car = {
  id?: string; // zaxira ro'yxatda id yo'q, bron paytida API'dan olinadi
  slug: string;
  brand: string;
  model: string;
  carClass: CarClass;
  bodyType: BodyType;
  year: number | null;
  automatic: boolean | null;
  fuel: Fuel | null;
  seats: number;
  pricePerDay: number | null;
  price3Days: number | null;
  price7Days: number | null;
  deposit: number | null;
  descriptionUz: string;
  descriptionRu: string;
  images: string[];
  status: CarStatus;
};
