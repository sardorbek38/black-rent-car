import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getDict, type Locale } from "@/lib/i18n";
import { CarCard } from "@/components/CarCard";
import { CarsBrowser } from "@/components/CarsBrowser";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDict(locale).nav.cars };
}

export default async function CarsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDict(locale);
  const cars = await prisma.car.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } });

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
          <div><p className="font-display text-2xl font-bold text-gold">{cars.length}</p><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dim">{t.cars.count}</p></div>
          <div><p className="font-display text-2xl font-bold text-gold">24/7</p><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dim">{t.contacts.hours}</p></div>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {cars.map((c) => <CarCard key={c.id} car={c} locale={locale} t={t} />)}
          </div>
        }
      >
        <CarsBrowser cars={cars} locale={locale} t={t} />
      </Suspense>
    </div>
  );
}
