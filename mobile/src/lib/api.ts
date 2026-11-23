import { API_BASE } from "./site";
import { parseBusy, type BusyJson, type BusyRange } from "./busy";
import type { Car } from "./types";

async function getJson<T>(path: string, init?: RequestInit, timeoutMs = 10_000): Promise<{ status: number; data: T }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(API_BASE + path, { ...init, signal: ctrl.signal, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
    const data = (await res.json().catch(() => ({}))) as T;
    return { status: res.status, data };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchCars(): Promise<Car[]> {
  const { status, data } = await getJson<{ cars?: Car[] }>("/api/cars");
  if (status !== 200 || !Array.isArray(data.cars)) throw new Error("cars_failed");
  return data.cars;
}

export async function fetchCar(slug: string): Promise<Car | null> {
  const { status, data } = await getJson<{ car?: Car }>(`/api/cars/${encodeURIComponent(slug)}`);
  return status === 200 && data.car ? data.car : null;
}

/** Mashinaning band vaqtlari. Yuklanmasa bo'sh ro'yxat: server baribir tekshiradi. */
export async function fetchBusy(slug: string): Promise<BusyRange[]> {
  try {
    const { status, data } = await getJson<{ busy?: BusyJson[] }>(`/api/cars/${encodeURIComponent(slug)}/busy`, { cache: "no-store" } as RequestInit);
    return status === 200 && Array.isArray(data.busy) ? parseBusy(data.busy) : [];
  } catch {
    return [];
  }
}

export type BookingInput = {
  carId: string;
  name: string;
  phone: string;
  startAt: string;
  endAt: string;
  pickupType: "OFFICE" | "DELIVERY";
  address?: string;
  comment?: string;
  locale: "uz" | "ru";
};

export type BookingError = "name" | "phone" | "dates" | "past" | "address" | "rate" | "server" | "network" | "busy";

export async function createBooking(input: BookingInput): Promise<{ ok: true; code: string } | { ok: false; error: BookingError }> {
  try {
    const { status, data } = await getJson<{ code?: string; error?: string; field?: string }>("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ ...input, website: "" }),
    });
    if (status === 201 && data.code) return { ok: true, code: data.code };
    if (status === 429) return { ok: false, error: "rate" };
    if (status === 409) return { ok: false, error: "busy" };
    const field = data.field as BookingError | undefined;
    return { ok: false, error: field && ["name", "phone", "dates", "past", "address"].includes(field) ? field : "server" };
  } catch {
    return { ok: false, error: "network" };
  }
}
