import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getDict, type Locale } from "@/lib/i18n";
import { formatSum, prettyPhone } from "@/lib/format";
import { site } from "@/lib/site";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false } };

export default async function BookingDone({ params }: { params: Promise<{ locale: Locale; code: string }> }) {
  const { locale, code } = await params;
  const t = getDict(locale);
  const b = await prisma.booking.findUnique({ where: { code }, include: { car: true } });
  if (!b) notFound();
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uz-UZ", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tashkent" }).format(d);

  return (
    <div className="container-x max-w-2xl pt-12 text-center md:pt-16">
      <div className="glow mx-auto grid h-24 w-24 place-items-center rounded-full border-2 border-gold bg-card text-gold">
        <Icon name="check" className="!text-[48px]" />
      </div>
      <h1 className="mt-6 font-display text-[32px] font-extrabold">{t.done.title}</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">{t.done.lead}</p>
      <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-card px-5 py-2 font-display text-sm font-bold text-gold">
        <span className="h-2 w-2 rounded-full bg-gold" />{t.done.id}: #{b.code}
      </p>

      <div className="card mt-8 p-5 text-left md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display font-bold"><Icon name="receipt_long" className="text-gold" />{t.done.receipt}</h2>
          <span className="badge gap-1.5 bg-gold/15 text-gold"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{t.done.pending}</span>
        </div>
        <div className="mt-5 flex items-center gap-4 rounded-xl bg-raised p-3">
          <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg">
            <Image src={b.car.images[0]} alt="" fill sizes="112px" className="object-cover" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dim">{t.done.car}</p>
            <p className="font-display font-bold">{b.car.brand} {b.car.model}</p>
          </div>
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4"><dt className="flex items-center gap-2 text-muted"><Icon name="calendar_month" className="!text-[18px]" />{t.done.period}</dt><dd className="text-right">{fmt(b.startAt)} — {fmt(b.endAt)} ({b.days} {t.form.dayUnit})</dd></div>
          <div className="flex justify-between gap-4"><dt className="flex items-center gap-2 text-muted"><Icon name="location_on" className="!text-[18px]" />{t.done.place}</dt><dd className="text-right">{b.pickupType === "DELIVERY" ? b.address : t.form.office}</dd></div>
          <div className="flex justify-between gap-4"><dt className="flex items-center gap-2 text-muted"><Icon name="person" className="!text-[18px]" />{t.done.client}</dt><dd className="text-right">{b.name} ({prettyPhone(b.phone)})</dd></div>
        </dl>
        <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
          <span className="font-display text-[12px] font-bold uppercase tracking-[0.08em]">{t.done.total}</span>
          <span className="font-display text-2xl font-bold text-gold">{b.totalPrice ? `${formatSum(b.totalPrice)} ${t.common.sum}` : t.form.totalTbd}</span>
        </div>
      </div>

      <p className="card mt-4 flex gap-3 p-4 text-left text-sm text-muted"><Icon name="support_agent" className="text-gold" />{t.done.help}</p>
      <div className="mt-6 grid gap-3">
        <Link href={`/${locale}`} className="btn-gold !py-4">{t.done.home}<Icon name="arrow_forward" className="!text-[18px]" /></Link>
        <a href={site.phoneHref} className="btn-ghost !py-4 !normal-case !tracking-normal"><Icon name="call" className="!text-[18px] text-gold" />{site.phone}</a>
      </div>
    </div>
  );
}
