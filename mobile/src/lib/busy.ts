// Band vaqtlar bilan ishlash. Server ham, brauzer ham ishlatadi (Prisma'siz).
// Saytdagi src/lib/busy.ts nusxasi: o'zgartirsangiz, ikkalasini ham o'zgartiring.

export type BusyRange = { start: Date; end: Date };
export type BusyJson = { start: string; end: string };

/** Yangi bron, tasdiqlangan va hozir ijaradagi bronlar sanani band qiladi. Bekor/yakunlangan bo'shatadi. */
export const BLOCKING_STATUSES = ["NEW", "CONFIRMED", "ACTIVE"] as const;

/** [aStart, aEnd) va [bStart, bEnd) kesishadimi. Qaytarish vaqti = keyingi olish vaqti bo'lishi mumkin. */
export const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) => aStart < bEnd && bStart < aEnd;

export const parseBusy = (list: BusyJson[]): BusyRange[] =>
  list.map((r) => ({ start: new Date(r.start), end: new Date(r.end) })).filter((r) => !isNaN(+r.start) && !isNaN(+r.end));

/** Shu vaqtda mashinani olish mumkin emasmi */
export const startBlocked = (busy: BusyRange[], at: Date) => busy.some((r) => r.start <= at && at < r.end);

/** start dan shu vaqtgacha ijara band vaqtga to'qnashadimi */
export const rangeBlocked = (busy: BusyRange[], start: Date, end: Date) => busy.some((r) => overlaps(start, end, r.start, r.end));
