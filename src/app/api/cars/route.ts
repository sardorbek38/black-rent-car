import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Sayt va mobil ilova uchun ochiq API
export async function GET() {
  const cars = await prisma.car.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
    omit: { isVisible: true, sortOrder: true, createdAt: true, updatedAt: true },
  });
  return NextResponse.json({ cars });
}
