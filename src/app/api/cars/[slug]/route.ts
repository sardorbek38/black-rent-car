import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = await prisma.car.findUnique({
    where: { slug },
    omit: { sortOrder: true, createdAt: true, updatedAt: true },
  });
  if (!car || !car.isVisible) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ car });
}
