import Link from "next/link";
import type { Metadata } from "next";
import type { BodyType, CarClass, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getDict, type Locale } from "@/lib/i18n";
import { CarCard } from "@/components/CarCard";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

type SP = { class?: string; body?: string; sort?: string; start?: string; end?: string };
const CLASSES: CarClass[] = ["ECONOM", "COMFORT", "BUSINESS", "PREMIUM"];
const BODIES: BodyType[] = ["SEDAN", "CROSSOVER", "SUV"];

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDict(locale).nav.cars };
}

export default async function CarsPage({ params, searchParams }: { params: Promise<{ locale: Locale }>; searchParams: Promise<SP> }) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = getDict(locale);
  const cls = CLASSES.find((c) => c === sp.class);
  const body = BODIES.find((b) => b === sp.body);

  const where: Prisma.CarWhereInput = { isVisible: true, ...(cls && { carClass: cls }), ...(body && { bodyType: body }) };
  const orderBy: Prisma.CarOrderByWithRelationInput[] =
    sp.sort === "cheap" ? [{ pricePerDay: { sort: "asc", nulls: "last" } }, { sortOrder: "asc" }]
    : sp.sort === "expensive" ? [{ pricePerDay: { sort: "desc", nulls: "last" } }, { sortOrder: "asc" }]
    : [{ sortOrder: "asc" }];

  const [cars, counts] = await Promise.all([
    prisma.car.findMany({ where, orderBy }),
    prisma.car.groupBy({ by: ["carClass"], where: { isVisible: true }, _count: true }),
  ]);
  const total = counts.reduce((a, c) => a + c._count, 0);
  const countOf = (c: CarClass) => counts.find((x) => x.carClass === c)?._count ?? 0;

  const link = (patch: Partial<SP>) => {
    const q = new URLSearchParams();
    const merged = { ...sp, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) q.set(k, v);
    const s = q.toString();
    return `/${locale}/cars${s ? `?${s}` : ""}`;
  };
  const dateQs = (() => {
    const q = new URLSearchParams();
    if (sp.start) q.set("start", sp.start);
    if (sp.end) q.set("end", sp.end);
    const s = q.toString();
    return s ? `?${s}` : "";
  })();

  const pill = (active: boolean) =>
    `rounded-full border px-4 py-2 font-display text-[12px] font-bold uppercase tracking-[0.06em] transition ${
      active ? "border-gold/60 bg-gold/15 text-gold" : "border-line bg-raised text-muted hover:text-fg"
    }`;

  return (
    <div className="container-x pt-10 md:pt-14">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span className="badge gap-2 border border-line bg-card text-gold"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{t.cars.kicker}</span>
          <h1 className="mt-4 font-display text-[36px] font-extrabold uppercase leading-tight md:text-[56px]">
            {t.cars.titleA} <span className="gold-text">{t.cars.titleB}</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted">{t.cars.lead}</p>
        </div>
        <div className="card flex gap-8 px-6 py-4">
          <div><p className="font-display text-2xl font-bold text-gold">{total}</p><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dim">{t.cars.count}</p></div>
          <div><p className="font-display text-2xl font-bold text-gold">24/7</p><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dim">{t.contacts.hours}</p></div>
        </div>
      </div>

      <div className="card mt-8 space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <Link href={link({ class: undefined })} className={pill(!cls)}>{t.common.all} ({total})</Link>
            {CLASSES.filter((c) => countOf(c) > 0).map((c) => (
              <Link key={c} href={link({ class: c })} className={pill(cls === c)}>{t.carClass[c]} ({countOf(c)})</Link>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="font-bold uppercase tracking-[0.1em] text-dim">{t.cars.sort}:</span>
            {[
              { v: undefined, l: t.cars.sortDefault },
              { v: "cheap", l: t.cars.sortCheap },
              { v: "expensive", l: t.cars.sortExpensive },
            ].map((o) => (
              <Link key={o.l} href={link({ sort: o.v })} className={`rounded-full px-3 py-1.5 font-semibold ${sp.sort === o.v ? "bg-raised text-gold" : "text-muted hover:text-fg"}`}>{o.l}</Link>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.1em] text-dim">{t.cars.body}:</span>
          <Link href={link({ body: undefined })} className={pill(!body)}>{t.common.all}</Link>
          {BODIES.map((b) => <Link key={b} href={link({ body: b })} className={pill(body === b)}>{t.bodyType[b]}</Link>)}
        </div>
      </div>

      {cars.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center gap-4 p-12 text-center text-muted">
          <Icon name="search_off" className="!text-[40px] text-gold" />
          {t.cars.empty}
          <Link href={`/${locale}/cars`} className="btn-outline">{t.cars.reset}</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {cars.map((c, i) => <CarCard key={c.id} car={c} locale={locale} t={t} priority={i < 3} qs={dateQs} />)}
        </div>
      )}
    </div>
  );
}
