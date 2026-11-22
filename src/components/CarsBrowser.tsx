"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { BodyType, Car, CarClass } from "@prisma/client";
import type { Dict, Locale } from "@/lib/i18n";
import { CarCard } from "./CarCard";
import { Icon } from "./Icon";

const CLASSES: CarClass[] = ["ECONOM", "COMFORT", "BUSINESS", "PREMIUM"];
const BODIES: BodyType[] = ["SEDAN", "CROSSOVER", "SUV"];

// Filtr brauzerda ishlaydi: serverga so'rov yubormaydi, shuning uchun darhol o'zgaradi
export function CarsBrowser({ cars, locale, t }: { cars: Car[]; locale: Locale; t: Dict }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const cls = CLASSES.find((c) => c === sp.get("class"));
  const body = BODIES.find((b) => b === sp.get("body"));
  const sort = sp.get("sort");

  const set = (k: string, v?: string) => {
    const q = new URLSearchParams(sp.toString());
    if (v) q.set(k, v); else q.delete(k);
    const s = q.toString();
    router.replace(`${pathname}${s ? `?${s}` : ""}`, { scroll: false });
  };

  const shown = useMemo(() => {
    let list = cars.filter((c) => (!cls || c.carClass === cls) && (!body || c.bodyType === body));
    if (sort === "cheap" || sort === "expensive") {
      const dir = sort === "cheap" ? 1 : -1;
      list = [...list].sort((a, b) => {
        if (a.pricePerDay == null) return 1;
        if (b.pricePerDay == null) return -1;
        return (a.pricePerDay - b.pricePerDay) * dir;
      });
    }
    return list;
  }, [cars, cls, body, sort]);

  const dateQs = (() => {
    const q = new URLSearchParams();
    const s = sp.get("start"), e = sp.get("end");
    if (s) q.set("start", s);
    if (e) q.set("end", e);
    const str = q.toString();
    return str ? `?${str}` : "";
  })();

  const countOf = (c: CarClass) => cars.filter((x) => x.carClass === c).length;
  const pill = (active: boolean) =>
    `rounded-full border px-4 py-2 font-display text-[12px] font-bold uppercase tracking-[0.06em] transition whitespace-nowrap ${
      active ? "border-gold/60 bg-gold/15 text-gold" : "border-line bg-raised text-muted hover:text-fg"
    }`;

  return (
    <>
      <div className="card mt-8 space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <button onClick={() => set("class")} className={pill(!cls)}>{t.common.all} ({cars.length})</button>
            {CLASSES.filter((c) => countOf(c) > 0).map((c) => (
              <button key={c} onClick={() => set("class", c)} className={pill(cls === c)}>{t.carClass[c]} ({countOf(c)})</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1 text-[12px]">
            <span className="mr-1 font-bold uppercase tracking-[0.1em] text-dim">{t.cars.sort}:</span>
            {[
              { v: undefined, l: t.cars.sortDefault },
              { v: "cheap", l: t.cars.sortCheap },
              { v: "expensive", l: t.cars.sortExpensive },
            ].map((o) => (
              <button key={o.l} onClick={() => set("sort", o.v)} className={`rounded-full px-3 py-1.5 font-semibold ${(sort ?? undefined) === o.v ? "bg-raised text-gold" : "text-muted hover:text-fg"}`}>{o.l}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.1em] text-dim">{t.cars.body}:</span>
          <button onClick={() => set("body")} className={pill(!body)}>{t.common.all}</button>
          {BODIES.map((b) => <button key={b} onClick={() => set("body", b)} className={pill(body === b)}>{t.bodyType[b]}</button>)}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center gap-4 p-12 text-center text-muted">
          <Icon name="search_off" className="!text-[40px] text-gold" />
          {t.cars.empty}
          <Link href={`/${locale}/cars`} className="btn-outline">{t.cars.reset}</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {shown.map((c, i) => <CarCard key={c.id} car={c} locale={locale} t={t} priority={i < 3} qs={dateQs} />)}
        </div>
      )}
    </>
  );
}
