import Image from "next/image";
import Link from "next/link";
import type { Car } from "@prisma/client";
import type { Locale, Dict } from "@/lib/i18n";
import { formatSum } from "@/lib/format";
import { Icon } from "./Icon";

export function CarSpecs({ car, t }: { car: Car; t: Dict }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="chip"><Icon name="settings" className="!text-[16px]" />{car.automatic == null ? t.common.tbd : car.automatic ? t.common.automatic : t.common.manual}</span>
      <span className="chip"><Icon name="group" className="!text-[16px]" />{car.seats} {t.common.seats}</span>
      {car.fuel && <span className="chip"><Icon name={car.fuel === "PETROL" ? "local_gas_station" : "bolt"} className="!text-[16px]" />{t.fuel[car.fuel]}</span>}
    </div>
  );
}

export function Price({ value, t, size = "md" }: { value: number | null; t: Dict; size?: "md" | "lg" }) {
  if (!value) return <span className={`font-display font-bold text-gold ${size === "lg" ? "text-xl" : "text-base"}`}>{t.common.priceOnRequest}</span>;
  return (
    <span className="flex items-baseline gap-1.5">
      <span className={`font-display font-bold text-gold ${size === "lg" ? "text-[28px]" : "text-[22px]"}`}>{formatSum(value)}</span>
      <span className="text-xs text-dim">{t.common.perDay}</span>
    </span>
  );
}

export function CarCard({ car, locale, t, priority = false, qs = "" }: { car: Car; locale: Locale; t: Dict; priority?: boolean; qs?: string }) {
  const href = `/${locale}/cars/${car.slug}${qs}`;
  const busy = car.status !== "AVAILABLE";
  return (
    <article className="car-card group flex flex-col">
      <Link href={href} className="relative block aspect-[2/1] overflow-hidden">
        <Image
          src={car.images[0]}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="(min-width:1280px) 25vw, (min-width:768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          priority={priority}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="badge bg-gold text-ink">{t.carClass[car.carClass]}</span>
          {busy && <span className="badge bg-ink/80 text-muted">{t.common.busy}</span>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="kicker !text-[10px]">{t.bodyType[car.bodyType]}</p>
          <h3 className="mt-1 font-display text-lg font-semibold">
            <Link href={href} className="hover:text-gold">{car.brand} {car.model}</Link>
          </h3>
        </div>
        <CarSpecs car={car} t={t} />
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dim">{t.cars.rentPrice}</p>
            <Price value={car.pricePerDay} t={t} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link href={href} className="btn-ghost !px-3 !text-[12px]">{t.common.details}</Link>
          <Link href={`${href}#book`} className="btn-gold !px-3 !text-[12px]">{t.common.book}</Link>
        </div>
      </div>
    </article>
  );
}
