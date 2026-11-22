export function formatSum(n: number) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function rentalDays(start: Date, end: Date) {
  return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86_400_000));
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

/** "901234567" -> "90 123 45 67" */
export function formatPhoneLocal(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 9);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(" ");
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatDateTime(d: Date) {
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
