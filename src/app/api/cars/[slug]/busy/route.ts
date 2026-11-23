import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { busyRanges } from "@/lib/availability";

export const dynamic = "force-dynamic";

// Mashinaning band sanalari: sayt va mobil ilova kalendari uchun
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = await prisma.car.findUnique({ where: { slug }, select: { id: true, isVisible: true } });
  if (!car || !car.isVisible) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const ranges = await busyRanges(car.id);
  return NextResponse.json(
    { busy: ranges.map((r) => ({ start: r.startAt.toISOString(), end: r.endAt.toISOString() })) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
