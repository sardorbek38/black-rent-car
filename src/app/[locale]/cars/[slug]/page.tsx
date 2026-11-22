import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getDict, type Locale } from "@/lib/i18n";
import { formatSum } from "@/lib/format";
import { site } from "@/lib/site";
import { BookingForm } from "@/components/BookingForm";
import { CarCard, Price } from "@/components/CarCard";
import { Gallery } from "@/components/Gallery";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

type Params = Promise<{ locale: Locale; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, locale } = await params;
  const car = await prisma.car.findUnique({ where: { slug } });
  if (!car) return {};
  return {
    title: `${car.brand} ${car.model}`,
    description: locale === "ru" ? car.descriptionRu : car.descriptionUz,
    openGraph: { images: [car.images[0]] },
  };
}

export default async function CarPage({ params, searchParams }: { params: Params; searchParams: Promise<{ start?: string; end?: string }> }) {
  const { locale, slug } = await params;
  const sp = await searchParams;
  const t = getDict(locale);
  const car = await prisma.car.findUnique({ where: { slug } });
  if (!car || !car.isVisible) notFound();
  const others = await prisma.car.findMany({ where: { isVisible: true, id: { not: car.id } }, orderBy: { sortOrder: "asc" }, take: 3 });
  const name = `${car.brand} ${car.model}`;
  const tbd = t.common.tbd;
  const money = (v: number | null) => (v ? `${formatSum(v)} ${t.common.sum}` : tbd);

  const specs = [
    { icon: "calendar_today", label: t.car.year, value: car.year ?? tbd },
    { icon: "settings", label: t.car.gearbox, value: car.automatic == null ? tbd : car.automatic ? t.common.automatic : t.common.manual },
    { icon: car.fuel === "PETROL" ? "local_gas_station" : "bolt", label: t.car.fuel, value: car.fuel ? t.fuel[car.fuel] : tbd },
    { icon: "airline_seat_recline_normal", label: t.car.seats, value: car.seats },
    { icon: "directions_car", label: t.car.body, value: t.bodyType[car.bodyType] },
    { icon: "workspace_premium", label: t.car.class, value: t.carClass[car.carClass] },
  ];

  return (
    <div className="container-x pt-6 md:pt-8">
      <nav className="flex items-center gap-1 text-xs text-dim">
        <Link href={`/${locale}`} className="hover:text-fg">{t.nav.home}</Link>
        <Icon name="chevron_right" className="!text-[16px]" />
        <Link href={`/${locale}/cars`} className="hover:text-fg">{t.nav.cars}</Link>
        <Icon name="chevron_right" className="!text-[16px]" />
        <span className="text-gold">{name}</span>
      </nav>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="badge bg-gold text-ink">{t.carClass[car.carClass]}</span>
            <span className={`badge gap-1.5 border border-line bg-card ${car.status === "AVAILABLE" ? "text-emerald-400" : "text-muted"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${car.status === "AVAILABLE" ? "bg-emerald-400" : "bg-dim"}`} />
              {car.status === "AVAILABLE" ? t.common.available : t.common.busy}
            </span>
          </div>
          <h1 className="mt-3 font-display text-[32px] font-extrabold leading-tight md:text-[48px]">
            {car.brand} <span className="gold-text italic">{car.model}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-muted">{locale === "ru" ? car.descriptionRu : car.descriptionUz}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">
        <div className="min-w-0 space-y-10">
          <Gallery images={car.images} alt={name} />

          <section>
            <h2 className="flex items-center gap-3 font-display text-xl font-bold"><span className="h-6 w-1 rounded bg-gold" />{t.car.specs}</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
              {specs.map((s) => (
                <div key={s.label} className="card p-4">
                  <Icon name={s.icon} className="text-gold" />
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-dim">{s.label}</p>
                  <p className="mt-1 font-display font-bold">{s.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="flex items-center gap-3 font-display text-xl font-bold"><Icon name="gavel" className="text-gold" />{t.car.termsTitle}</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {t.terms.items.slice(0, 4).map((it) => (
                <div key={it.title} className="flex gap-3 rounded-xl border border-line bg-ink/50 p-4">
                  <Icon name={it.icon} className="text-gold" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dim">{it.title}</p>
                    <p className="mt-1 text-sm font-semibold">{it.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href={`/${locale}/terms`} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-gold">{t.car.termsMore}<Icon name="chevron_right" /></Link>
          </section>
        </div>

        <aside id="book" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <div className="card glow p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="kicker !text-[10px]">{t.form.title}</p>
                <p className="mt-1 font-display text-lg font-bold">{name}</p>
              </div>
            </div>
            <div className="mt-3"><Price value={car.pricePerDay} t={t} size="lg" /></div>

            <div className="mt-4 space-y-2">
              <p className="label">{t.car.pricing}</p>
              {[
                { l: t.car.days1, v: car.pricePerDay },
                { l: t.car.days3, v: car.price3Days },
                { l: t.car.days7, v: car.price7Days },
              ].map((r) => (
                <div key={r.l} className="flex justify-between rounded-xl border border-line bg-ink/50 px-4 py-2.5 text-sm">
                  <span className="text-muted">{r.l}</span><span className="font-semibold">{money(r.v)}</span>
                </div>
              ))}
              <div className="flex justify-between px-1 pt-1 text-xs text-dim"><span>{t.car.deposit}</span><span>{money(car.deposit)}</span></div>
              {!car.pricePerDay && <p className="rounded-xl bg-gold/10 p-3 text-xs text-gold">{t.car.pricesNote}</p>}
            </div>

            <div className="my-5 border-t border-line" />
            <BookingForm car={car} locale={locale} t={t} start={sp.start} end={sp.end} />
          </div>
          <a href={site.phoneHref} className="btn-ghost mt-3 w-full !normal-case !tracking-normal"><Icon name="call" className="!text-[18px] text-gold" />{t.common.call}: {site.phone}</a>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="mt-20">
          <div className="flex items-end justify-between">
            <h2 className="h-section">{t.car.similar}</h2>
            <Link href={`/${locale}/cars`} className="flex items-center text-sm font-bold text-gold">{t.home.allCars}<Icon name="chevron_right" /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((c) => <CarCard key={c.id} car={c} locale={locale} t={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}
