import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { prisma } from "@/lib/db";
import { formatSum, normalizePhone, prettyPhone, rentalDays, totalPrice } from "@/lib/format";
import { escapeHtml, notifyTelegram } from "@/lib/telegram";
import { findConflict, lockCar } from "@/lib/availability";

export const runtime = "nodejs";

type Body = {
  carId?: string; name?: string; phone?: string; startAt?: string; endAt?: string;
  pickupType?: string; address?: string; comment?: string; locale?: string; website?: string;
};

const bad = (field: string, status = 400) => NextResponse.json({ error: "invalid", field }, { status });

export async function POST(req: Request) {
  let body: Body;
  try { body = await req.json(); } catch { return bad("server"); }

  // honeypot: bot to'ldirgan bo'lsa, jim "muvaffaqiyat" qaytarmaymiz, shunchaki rad etamiz
  if (body.website) return bad("server");

  const name = (body.name ?? "").trim().slice(0, 80);
  if (name.length < 2) return bad("name");
  const phone = normalizePhone(body.phone ?? "");
  if (!phone) return bad("phone");

  const startAt = new Date(body.startAt ?? "");
  const endAt = new Date(body.endAt ?? "");
  if (isNaN(+startAt) || isNaN(+endAt) || endAt <= startAt) return bad("dates");
  if (startAt.getTime() < Date.now() - 60 * 60 * 1000) return bad("past");
  if (endAt.getTime() - startAt.getTime() > 90 * 86_400_000) return bad("dates");

  const pickupType = body.pickupType === "DELIVERY" ? "DELIVERY" : "OFFICE";
  const address = (body.address ?? "").trim().slice(0, 200) || null;
  if (pickupType === "DELIVERY" && !address) return bad("address");
  const comment = (body.comment ?? "").trim().slice(0, 500) || null;
  const locale = body.locale === "ru" ? "ru" : "uz";

  const car = body.carId ? await prisma.car.findUnique({ where: { id: body.carId } }) : null;
  if (!car || !car.isVisible) return bad("server", 404);

  const recent = await prisma.booking.count({ where: { phone, createdAt: { gte: new Date(Date.now() - 60_000) } } });
  if (recent >= 3) return NextResponse.json({ error: "rate" }, { status: 429 });

  const days = rentalDays(startAt, endAt);
  const total = totalPrice(car, days);

  // Bir mashinani bir vaqtga ikki marta bron qilib bo'lmaydi. Qulf parallel so'rovlarni navbatga qo'yadi.
  const result = await prisma.$transaction(async (tx) => {
    await lockCar(tx, car.id);
    if (await findConflict(tx, car.id, startAt, endAt)) return "busy" as const;
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = `BR-${randomInt(100000, 999999)}`;
      if (await tx.booking.findUnique({ where: { code }, select: { id: true } })) continue; // kod takrorlansa qayta urinamiz
      return tx.booking.create({
        data: { code, carId: car.id, name, phone, startAt, endAt, pickupType, address, comment, days, totalPrice: total, locale },
      });
    }
    return null;
  });
  if (result === "busy") return bad("busy", 409);
  const booking = result;
  if (!booking) return bad("server", 500);

  const fmt = (d: Date) => new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Tashkent" }).format(d);
  await notifyTelegram(
    [
      `🚗 <b>Yangi bron #${booking.code}</b>`,
      `<b>${escapeHtml(car.brand)} ${escapeHtml(car.model)}</b>`,
      `📅 ${fmt(startAt)} → ${fmt(endAt)} (${days} kun)`,
      `👤 ${escapeHtml(name)}`,
      `📞 ${prettyPhone(phone)}`,
      pickupType === "DELIVERY" ? `📍 Yetkazish: ${escapeHtml(address ?? "")}` : "📍 Ofisdan oladi",
      comment ? `💬 ${escapeHtml(comment)}` : "",
      `💰 ${total ? `${formatSum(total)} so'm` : "narx belgilanmagan"}`,
      `🌐 Til: ${locale}`,
    ].filter(Boolean).join("\n"),
  );

  return NextResponse.json({ code: booking.code }, { status: 201 });
}
