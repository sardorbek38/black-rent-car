import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatSum } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { AdminShell } from "../AdminShell";

export const dynamic = "force-dynamic";

const STATUS = { AVAILABLE: "Bo'sh", RENTED: "Ijarada", SERVICE: "Ta'mirda" } as const;

export default async function AdminCars() {
  const cars = await prisma.car.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <AdminShell active="cars">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Mashinalar ({cars.length})</h1>
        <Link href="/admin/cars/new" className="btn-gold !px-4 !py-2 !text-xs"><Icon name="add" className="!text-[18px]" />Qo&apos;shish</Link>
      </div>
      {cars.some((c) => !c.pricePerDay) && (
        <p className="mt-4 rounded-xl border border-gold/40 bg-gold/10 p-3 text-sm text-gold">Ba&apos;zi mashinalarda narx yo&apos;q. Saytda ular &quot;Narx so&apos;raladi&quot; deb ko&apos;rinadi.</p>
      )}
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {cars.map((c) => (
          <Link key={c.id} href={`/admin/cars/${c.id}`} className="card flex items-center gap-4 p-3 transition hover:border-gold/60">
            <span className="relative h-16 w-32 shrink-0 overflow-hidden rounded-lg bg-raised">
              {c.images[0] && <Image src={c.images[0]} alt="" fill sizes="128px" className="object-cover" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display font-bold">{c.brand} {c.model}</span>
              <span className="mt-1 block text-sm text-gold">{c.pricePerDay ? `${formatSum(c.pricePerDay)} so'm/kun` : "narx yo'q"}</span>
              <span className="mt-1 flex gap-2 text-xs text-muted">
                <span>{STATUS[c.status]}</span>
                {!c.isVisible && <span className="text-danger">· yashirin</span>}
              </span>
            </span>
            <Icon name="edit" className="text-muted" />
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
