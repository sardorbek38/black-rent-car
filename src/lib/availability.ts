import type { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { BLOCKING_STATUSES } from "./busy";

type Db = Prisma.TransactionClient | typeof prisma;

/** Mashinaning hozirdan keyingi band oraliqlari (mijozga faqat sanalar, shaxsiy ma'lumotsiz) */
export async function busyRanges(carId: string, db: Db = prisma) {
  return db.booking.findMany({
    where: { carId, status: { in: [...BLOCKING_STATUSES] }, endAt: { gt: new Date() } },
    select: { startAt: true, endAt: true },
    orderBy: { startAt: "asc" },
    take: 200,
  });
}

/** Shu oraliqqa to'qnashadigan bron (bo'lsa) */
export function findConflict(
  db: Db,
  carId: string,
  startAt: Date,
  endAt: Date,
  opts: { excludeId?: string; statuses?: readonly string[] } = {},
) {
  return db.booking.findFirst({
    where: {
      carId,
      id: opts.excludeId ? { not: opts.excludeId } : undefined,
      status: { in: [...(opts.statuses ?? BLOCKING_STATUSES)] as Prisma.EnumBookingStatusFilter["in"] },
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
    select: { id: true, code: true, startAt: true, endAt: true },
  });
}

/** Bir mashinaga parallel ikki so'rov kelsa, ikkalasi ham "bo'sh" deb o'tib ketmasligi uchun qulf */
export async function lockCar(tx: Prisma.TransactionClient, carId: string) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${carId}))`;
}
