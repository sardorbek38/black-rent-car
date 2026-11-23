"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { BookingStatus, CarClass, BodyType, Fuel, CarStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { findConflict, lockCar } from "@/lib/availability";
import { checkAdminPassword, resetAdminPassword } from "@/lib/adminPassword";
import { ADMIN_COOKIE, cookieOptions, createToken, verifyToken } from "@/lib/auth";

async function requireAdmin() {
  const ok = await verifyToken((await cookies()).get(ADMIN_COOKIE)?.value);
  if (!ok) redirect("/admin/login");
}

export async function login(_: { error?: string } | undefined, fd: FormData) {
  const pw = String(fd.get("password") ?? "");
  if (!(await checkAdminPassword(pw))) {
    await new Promise((r) => setTimeout(r, 800));
    return { error: "Parol noto'g'ri" };
  }
  (await cookies()).set(ADMIN_COOKIE, await createToken(), cookieOptions);
  redirect("/admin");
}

export async function sendNewPassword(): Promise<{ error?: string; info?: string }> {
  const r = await resetAdminPassword();
  if (r === "wait") return { error: "Yangi parol yaqinda yuborilgan. 10 daqiqadan keyin qayta urinib ko'ring" };
  if (r === "no_telegram") return { error: "Telegram'ga yuborib bo'lmadi, parol o'zgarmadi" };
  return { info: "Yangi parol egasining Telegramiga yuborildi" };
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

const STATUSES: BookingStatus[] = ["NEW", "CONFIRMED", "ACTIVE", "DONE", "CANCELLED"];

export async function updateBooking(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id"));
  const status = STATUSES.find((s) => s === fd.get("status"));
  const note = fd.get("adminNote");
  const adminNote = note === null ? undefined : String(note).trim().slice(0, 500) || null;
  const back = String(fd.get("back") ?? "");
  const backUrl = back.startsWith("/admin") ? back : "/admin";

  // Tasdiqlash/ijaraga berishda shu mashinaning boshqa tasdiqlangan broniga to'qnashmasligini tekshiramiz
  const clash = await prisma.$transaction(async (tx) => {
    const b = await tx.booking.findUnique({ where: { id }, select: { carId: true, startAt: true, endAt: true } });
    if (!b) return null;
    if (status === "CONFIRMED" || status === "ACTIVE") {
      await lockCar(tx, b.carId);
      const other = await findConflict(tx, b.carId, b.startAt, b.endAt, { excludeId: id, statuses: ["CONFIRMED", "ACTIVE"] });
      if (other) return other.code;
    }
    await tx.booking.update({ where: { id }, data: { ...(status && { status }), ...(adminNote !== undefined && { adminNote }) } });
    return null;
  });
  revalidatePath("/admin");
  const url = new URL(backUrl, "http://x");
  url.searchParams.delete("clash");
  if (clash) url.searchParams.set("clash", clash);
  redirect(url.pathname + url.search);
}

function int(v: FormDataEntryValue | null) {
  const s = String(v ?? "").replace(/\s/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

export async function saveCar(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const auto = String(fd.get("automatic"));
  const fuel = String(fd.get("fuel") ?? "");
  const data = {
    brand: String(fd.get("brand")).trim(),
    model: String(fd.get("model")).trim(),
    carClass: String(fd.get("carClass")) as CarClass,
    bodyType: String(fd.get("bodyType")) as BodyType,
    fuel: (fuel || null) as Fuel | null,
    automatic: auto === "yes" ? true : auto === "no" ? false : null,
    year: int(fd.get("year")),
    seats: int(fd.get("seats")) ?? 5,
    pricePerDay: int(fd.get("pricePerDay")),
    price3Days: int(fd.get("price3Days")),
    price7Days: int(fd.get("price7Days")),
    deposit: int(fd.get("deposit")),
    descriptionUz: String(fd.get("descriptionUz") ?? ""),
    descriptionRu: String(fd.get("descriptionRu") ?? ""),
    status: String(fd.get("status")) as CarStatus,
    isVisible: fd.get("isVisible") === "on",
    sortOrder: int(fd.get("sortOrder")) ?? 0,
    images: String(fd.get("images") ?? "").split("\n").map((s) => s.trim()).filter(Boolean),
  };
  if (!data.brand || !data.model) return;
  if (id) {
    await prisma.car.update({ where: { id }, data });
  } else {
    const base = `${data.brand}-${data.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let slug = base;
    for (let i = 2; await prisma.car.findUnique({ where: { slug } }); i++) slug = `${base}-${i}`;
    await prisma.car.create({ data: { ...data, slug } });
  }
  revalidatePath("/", "layout");
  redirect("/admin/cars");
}

export async function deleteCar(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id"));
  const used = await prisma.booking.count({ where: { carId: id } });
  if (used > 0) {
    // bronlari bor mashinani o'chirmaymiz, faqat yashiramiz
    await prisma.car.update({ where: { id }, data: { isVisible: false } });
  } else {
    await prisma.car.delete({ where: { id } });
  }
  revalidatePath("/", "layout");
  redirect("/admin/cars");
}
