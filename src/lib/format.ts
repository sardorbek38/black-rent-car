export function formatSum(n: number) {
  return new Intl.NumberFormat("ru-RU").format(n).replace(/ /g, " ");
}

export function rentalDays(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / 86_400_000));
}

type Prices = { pricePerDay: number | null; price3Days: number | null; price7Days: number | null };

export function dailyRate(car: Prices, days: number) {
  if (days >= 7 && car.price7Days) return car.price7Days;
  if (days >= 3 && car.price3Days) return car.price3Days;
  return car.pricePerDay;
}

export function totalPrice(car: Prices, days: number) {
  const rate = dailyRate(car, days);
  return rate ? rate * days : null;
}

export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("998") ? digits.slice(3) : digits;
  return local.length === 9 ? `+998${local}` : null;
}

export function prettyPhone(p: string) {
  const d = p.replace(/\D/g, "").slice(3);
  return `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
}
