import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/cars", priority: 0.9, changeFrequency: "daily" },
  { path: "/prices", priority: 0.8, changeFrequency: "weekly" },
  { path: "/terms", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contacts", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let cars: { slug: string; updatedAt: Date }[] = [];
  try {
    cars = await prisma.car.findMany({ where: { isVisible: true }, select: { slug: true, updatedAt: true }, orderBy: { sortOrder: "asc" } });
  } catch {
    // baza vaqtincha ishlamasa ham sitemap sahifalar bilan qaytadi
  }
  const entry = (path: string, extra: Partial<MetadataRoute.Sitemap[number]>) =>
    (["uz", "ru"] as const).map((l) => ({
      url: `${siteUrl}/${l}${path}`,
      alternates: { languages: { uz: `${siteUrl}/uz${path}`, ru: `${siteUrl}/ru${path}` } },
      ...extra,
    }));
  return [
    ...PAGES.flatMap((p) => entry(p.path, { priority: p.priority, changeFrequency: p.changeFrequency })),
    ...cars.flatMap((c) => entry(`/cars/${c.slug}`, { lastModified: c.updatedAt, priority: 0.8, changeFrequency: "weekly" })),
  ];
}
