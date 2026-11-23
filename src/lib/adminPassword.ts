import { randomBytes, randomInt, scryptSync, timingSafeEqual } from "crypto";
import { prisma } from "./db";
import { checkPassword as checkEnvPassword } from "./auth";
import { notifyTelegram } from "./telegram";

// Admin paroli: bazada hash bo'lsa o'sha ishlaydi, bo'lmasa Vercel'dagi ADMIN_PASSWORD.
// Yangi parolni server o'zi yaratadi va faqat egasining Telegramiga yuboradi: parolni hech kim ko'rmaydi.
const HASH_KEY = "adminPasswordHash";
const RESET_KEY = "adminPasswordResetAt";
const RESET_COOLDOWN_MS = 10 * 60_000;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

function hash(pw: string) {
  const salt = randomBytes(16);
  return `${salt.toString("hex")}:${scryptSync(pw, salt, 32).toString("hex")}`;
}

function verify(pw: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const expected = Buffer.from(key, "hex");
  const actual = scryptSync(pw, Buffer.from(salt, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

export async function checkAdminPassword(input: string) {
  const row = await prisma.setting.findUnique({ where: { key: HASH_KEY } });
  return row ? verify(input, row.value) : checkEnvPassword(input);
}

export type ResetResult = "sent" | "wait" | "no_telegram";

export async function resetAdminPassword(): Promise<ResetResult> {
  const last = await prisma.setting.findUnique({ where: { key: RESET_KEY } });
  if (last && Date.now() - Number(last.value) < RESET_COOLDOWN_MS) return "wait";
  await prisma.setting.upsert({ where: { key: RESET_KEY }, create: { key: RESET_KEY, value: String(Date.now()) }, update: { value: String(Date.now()) } });

  const pw = Array.from({ length: 14 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  const sent = await notifyTelegram(
    `🔐 <b>Black Rent Car admin paneli uchun yangi parol</b>\n\n<code>${pw}</code>\n\nEski parol endi ishlamaydi. Bu xabarni hech kimga yubormang.`,
  );
  // Telegram'ga yetib bormasa parolni almashtirmaymiz, aks holda admin qulflanib qoladi
  if (!sent) return "no_telegram";
  await prisma.setting.upsert({ where: { key: HASH_KEY }, create: { key: HASH_KEY, value: hash(pw) }, update: { value: hash(pw) } });
  return "sent";
}
