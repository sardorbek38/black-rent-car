import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const cars = await prisma.car.findMany({ where: { isVisible: true }, select: { slug: true, updatedAt: true } });
  const pages = ["", "/cars", "/prices", "/terms", "/contacts"];
  return ["uz", "ru"].flatMap((l) => [
    ...pages.map((p) => ({ url: `${base}/${l}${p}` })),
    ...cars.map((c) => ({ url: `${base}/${l}/cars/${c.slug}`, lastModified: c.updatedAt })),
  ]);
}
