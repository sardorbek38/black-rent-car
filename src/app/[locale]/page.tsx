import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getDict, type Locale } from "@/lib/i18n";
import { site, telegramHref } from "@/lib/site";
import { CarCard } from "@/components/CarCard";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDict(locale);
  const cars = await prisma.car.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } });
  const hero = cars.find((c) => c.slug === "byd-han") ?? cars[0];
  const p = `/${locale}`;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[120px]" />
        <div className="container-x grid items-center gap-10 pb-10 pt-10 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-14">
          <div>
            <span className="badge gap-2 border border-line bg-card text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {t.home.badge}
            </span>
            <h1 className="mt-5 font-display text-[36px] font-extrabold leading-[1.15] tracking-[-0.01em] md:text-[56px] md:leading-[1.12] md:tracking-[-0.02em]">
              {t.home.titleA} <span className="gold-text">{t.home.titleB}</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted md:text-lg">{t.home.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`${p}/cars`} className="btn-gold">{t.home.choose}<Icon name="arrow_forward" className="!text-[18px]" /></Link>
              {telegramHref ? (
                <a href={telegramHref} className="btn-ghost !normal-case !tracking-normal"><Icon name="send" className="!text-[18px] text-gold" />{t.common.telegram}</a>
              ) : (
                <a href={site.instagramHref} target="_blank" rel="noopener" className="btn-ghost !normal-case !tracking-normal"><Icon name="photo_camera" className="!text-[18px] text-gold" />Instagram</a>
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-muted">
              <span className="flex items-center gap-1.5"><Icon name="verified_user" className="!text-[16px] text-gold" />{t.home.trust1}</span>
              <span className="flex items-center gap-1.5"><Icon name="schedule" className="!text-[16px] text-gold" />{t.home.trust2}</span>
            </div>
          </div>
          {hero && (
            <Link href={`${p}/cars/${hero.slug}`} className="card glow group relative block overflow-hidden">
              <div className="relative aspect-[2/1]">
                <Image src={hero.images[0]} alt={`${hero.brand} ${hero.model}`} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className="glass absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-line px-4 py-3">
                <div>
                  <p className="kicker !text-[9px]">{t.home.heroTag}</p>
                  <p className="font-display text-sm font-bold">{hero.brand} {hero.model}</p>
                </div>
                <span className="badge border border-gold/40 text-gold">{t.carClass[hero.carClass]}</span>
              </div>
            </Link>
          )}
        </div>

        {/* SEARCH */}
        <div className="container-x">
          <form action={`${p}/cars`} className="card grid gap-3 p-4 sm:grid-cols-2 md:p-5 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <label>
              <span className="label flex items-center gap-1.5"><Icon name="calendar_month" className="!text-[14px] text-gold" />{t.home.searchPickup}</span>
              <input type="date" name="start" className="field" />
            </label>
            <label>
              <span className="label flex items-center gap-1.5"><Icon name="event_available" className="!text-[14px] text-gold" />{t.home.searchReturn}</span>
              <input type="date" name="end" className="field" />
            </label>
            <label className="sm:col-span-2 lg:col-span-1">
              <span className="label flex items-center gap-1.5"><Icon name="directions_car" className="!text-[14px] text-gold" />{t.home.searchClass}</span>
              <select name="class" className="field appearance-none">
                <option value="">{t.common.all}</option>
                {(["ECONOM", "COMFORT", "BUSINESS", "PREMIUM"] as const).map((c) => <option key={c} value={c}>{t.carClass[c]}</option>)}
              </select>
            </label>
            <button className="btn-gold h-[52px] sm:col-span-2 lg:col-span-1"><Icon name="search" className="!text-[18px]" />{t.home.search}</button>
          </form>
        </div>
      </section>

      {/* WHY */}
      <section className="container-x mt-20 md:mt-28">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="kicker">{t.home.whyKicker}</p>
            <h2 className="h-section mt-2">{t.home.whyTitle}</h2>
          </div>
          <p className="max-w-md text-sm text-muted">{t.home.whyLead}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {t.home.why.map((w) => (
            <div key={w.title} className="card p-6 transition hover:border-gold/50">
              <div className="grid h-11 w-11 place-items-center rounded-full border border-line bg-raised text-gold"><Icon name={w.icon} /></div>
              <h3 className="mt-6 font-display text-lg font-bold">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FLEET */}
      <section className="container-x mt-20 md:mt-28">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="kicker">{t.home.fleetKicker}</p>
            <h2 className="h-section mt-2">{t.home.fleetTitle}</h2>
            <p className="mt-2 text-sm text-muted">{t.home.fleetLead}</p>
          </div>
          <Link href={`${p}/cars`} className="flex items-center gap-1 font-display text-sm font-bold text-gold hover:text-gold-hover">
            {t.home.allCars} <Icon name="chevron_right" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cars.slice(0, 8).map((c) => <CarCard key={c.id} car={c} locale={locale} t={t} />)}
        </div>
      </section>

      {/* HOW */}
      <section className="container-x mt-20 md:mt-28">
        <div className="text-center">
          <p className="kicker">{t.home.howKicker}</p>
          <h2 className="h-section mt-2">{t.home.howTitle}</h2>
          <p className="mt-2 text-sm text-muted">{t.home.howLead}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {t.home.how.map((s, i) => (
            <div key={s.title} className="card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold font-display text-sm font-bold text-ink">0{i + 1}</span>
              <h3 className="mt-6 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x mt-20 md:mt-28">
        <div className="card relative overflow-hidden p-7 md:p-10">
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-gold/15 blur-[100px]" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-lg">
              <span className="badge gap-2 bg-raised text-gold"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{t.home.ctaKicker}</span>
              <h2 className="h-section mt-3">{t.home.ctaTitle}</h2>
              <p className="mt-2 text-sm text-muted">{t.home.ctaText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={site.phoneHref} className="btn-gold !normal-case !tracking-normal"><Icon name="call" className="!text-[18px]" />{site.phone}</a>
              <a href={site.instagramHref} target="_blank" rel="noopener" className="btn-ghost !normal-case !tracking-normal"><Icon name="photo_camera" className="!text-[18px] text-gold" />@{site.instagram}</a>
              {telegramHref && <a href={telegramHref} className="btn-ghost !normal-case !tracking-normal"><Icon name="send" className="!text-[18px] text-gold" />Telegram</a>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
