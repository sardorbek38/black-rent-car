import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { prisma } from "@/lib/db";
import { getDict, type Locale } from "@/lib/i18n";
import { formatSum } from "@/lib/format";
import { Icon } from "@/components/Icon";

// Sahifa oldindan tayyorlanadi; admin o'zgartirganda darhol yangilanadi
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale, "/prices", { title: getDict(locale).prices.title });
}

export default async function PricesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDict(locale);
  const cars = await prisma.car.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } });
  const m = (v: number | null) => (v ? formatSum(v) : <span className="text-dim">{t.common.tbd}</span>);
  return (
    <div className="container-x pt-10 md:pt-14">
      <h1 className="font-display text-[36px] font-extrabold uppercase md:text-[48px]"><span className="gold-text">{t.prices.title}</span></h1>
      <p className="mt-3 max-w-xl text-muted">{t.prices.lead}</p>
      <div className="card mt-8 overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[10px] font-bold uppercase tracking-[0.1em] text-dim">
              <th className="p-4">{t.prices.car}</th>
              <th className="p-4 text-right">{t.car.days1}</th>
              <th className="p-4 text-right">{t.car.days3}</th>
              <th className="p-4 text-right">{t.car.days7}</th>
              <th className="p-4 text-right">{t.car.deposit}</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0 hover:bg-raised/50">
                <td className="p-4">
                  <Link href={`/${locale}/cars/${c.slug}`} className="flex items-center gap-3">
                    <span className="relative h-10 w-20 shrink-0 overflow-hidden rounded-lg"><Image src={c.images[0]} alt="" fill sizes="80px" className="object-cover" /></span>
                    <span>
                      <span className="block font-display font-bold">{c.brand} {c.model}</span>
                      <span className="text-xs text-dim">{t.carClass[c.carClass]}</span>
                    </span>
                  </Link>
                </td>
                <td className="p-4 text-right font-display font-bold text-gold">{m(c.pricePerDay)}</td>
                <td className="p-4 text-right">{m(c.price3Days)}</td>
                <td className="p-4 text-right">{m(c.price7Days)}</td>
                <td className="p-4 text-right text-muted">{m(c.deposit)}</td>
                <td className="p-4 text-right"><Link href={`/${locale}/cars/${c.slug}#book`} className="inline-flex items-center text-gold"><Icon name="arrow_forward" /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-dim">{t.common.sum} / {t.form.dayUnit}</p>
    </div>
  );
}
