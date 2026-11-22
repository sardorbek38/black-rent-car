// Ilova ichiga joylangan mashina rasmlari: internet sekin bo'lsa ham tez ochiladi.
// Kalit = API'dagi rasm yo'li (masalan /cars/byd-han/main.webp).
export const localImages: Record<string, number> = {
  "/cars/chevrolet-malibu/main.webp": require("../../assets/cars/chevrolet-malibu/main.webp"),
  "/cars/chevrolet-malibu/front.webp": require("../../assets/cars/chevrolet-malibu/front.webp"),
  "/cars/chevrolet-malibu/rear.webp": require("../../assets/cars/chevrolet-malibu/rear.webp"),
  "/cars/chevrolet-malibu/poster.webp": require("../../assets/cars/chevrolet-malibu/poster.webp"),
  "/cars/byd-chazor/main.webp": require("../../assets/cars/byd-chazor/main.webp"),
  "/cars/byd-chazor/front.webp": require("../../assets/cars/byd-chazor/front.webp"),
  "/cars/byd-chazor/rear.webp": require("../../assets/cars/byd-chazor/rear.webp"),
  "/cars/byd-chazor/poster.webp": require("../../assets/cars/byd-chazor/poster.webp"),
  "/cars/byd-han/main.webp": require("../../assets/cars/byd-han/main.webp"),
  "/cars/byd-han/front.webp": require("../../assets/cars/byd-han/front.webp"),
  "/cars/byd-han/rear.webp": require("../../assets/cars/byd-han/rear.webp"),
  "/cars/byd-han/poster.webp": require("../../assets/cars/byd-han/poster.webp"),
  "/cars/bmw-i3-35l/main.webp": require("../../assets/cars/bmw-i3-35l/main.webp"),
  "/cars/bmw-i3-35l/front.webp": require("../../assets/cars/bmw-i3-35l/front.webp"),
  "/cars/bmw-i3-35l/rear.webp": require("../../assets/cars/bmw-i3-35l/rear.webp"),
  "/cars/bmw-i3-35l/poster.webp": require("../../assets/cars/bmw-i3-35l/poster.webp"),
  "/cars/chevrolet-lacetti/main.webp": require("../../assets/cars/chevrolet-lacetti/main.webp"),
  "/cars/chevrolet-lacetti/front.webp": require("../../assets/cars/chevrolet-lacetti/front.webp"),
  "/cars/chevrolet-lacetti/rear.webp": require("../../assets/cars/chevrolet-lacetti/rear.webp"),
  "/cars/chevrolet-lacetti/poster.webp": require("../../assets/cars/chevrolet-lacetti/poster.webp"),
  "/cars/byd-champion/main.webp": require("../../assets/cars/byd-champion/main.webp"),
  "/cars/byd-champion/front.webp": require("../../assets/cars/byd-champion/front.webp"),
  "/cars/byd-champion/rear.webp": require("../../assets/cars/byd-champion/rear.webp"),
  "/cars/byd-champion/poster.webp": require("../../assets/cars/byd-champion/poster.webp"),
  "/cars/chevrolet-monza/main.webp": require("../../assets/cars/chevrolet-monza/main.webp"),
  "/cars/chevrolet-monza/front.webp": require("../../assets/cars/chevrolet-monza/front.webp"),
  "/cars/chevrolet-monza/rear.webp": require("../../assets/cars/chevrolet-monza/rear.webp"),
  "/cars/chevrolet-monza/poster.webp": require("../../assets/cars/chevrolet-monza/poster.webp"),
  "/cars/li-auto-l9/main.webp": require("../../assets/cars/li-auto-l9/main.webp"),
  "/cars/li-auto-l9/front.webp": require("../../assets/cars/li-auto-l9/front.webp"),
  "/cars/li-auto-l9/rear.webp": require("../../assets/cars/li-auto-l9/rear.webp"),
  "/cars/li-auto-l9/poster.webp": require("../../assets/cars/li-auto-l9/poster.webp"),
};

import { API_BASE } from "./site";

/** expo-image uchun manba: avval ilovadagi rasm, bo'lmasa saytdan yuklanadi */
export function carImage(path: string | undefined) {
  if (!path) return undefined;
  if (localImages[path]) return localImages[path];
  return { uri: path.startsWith("/") ? API_BASE + path : path };
}
