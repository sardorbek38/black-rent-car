import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";
import { site, telegramHref } from "@/lib/site";
import { privacy } from "./content";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const p = privacy[locale];
  return pageMeta(locale, "/privacy", { title: p.title, description: p.lead.slice(0, 155) });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const p = privacy[locale];
  const ru = locale === "ru";
  return (
    <div className="container-x max-w-3xl pt-10 md:pt-14">
      <h1 className="font-display text-[32px] font-extrabold uppercase leading-tight md:text-[44px]"><span className="gold-text">{p.title}</span></h1>
      <p className="mt-2 text-xs text-dim">{p.updated}</p>
      <p className="mt-5 text-muted">{p.lead}</p>
      <div className="mt-8 space-y-4">
        {p.sections.map((s) => (
          <section key={s.title} className="card p-6">
            <h2 className="font-display text-lg font-bold">{s.title}</h2>
            {s.text && <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>}
            {s.list && (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted marker:text-gold">
                {s.list.map((li) => <li key={li}>{li}</li>)}
              </ul>
            )}
          </section>
        ))}
        <section className="card p-6">
          <h2 className="font-display text-lg font-bold">{ru ? "10. Контакты" : "10. Aloqa"}</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            <li>Black Rent Car, {ru ? "г. Ташкент, Узбекистан" : "Toshkent sh., O'zbekiston"}</li>
            <li>{ru ? "Телефон" : "Telefon"}: <a className="text-gold hover:underline" href={site.phoneHref}>{site.phone}</a></li>
            <li>Instagram: <a className="text-gold hover:underline" href={site.instagramHref} target="_blank" rel="noopener">@{site.instagram}</a></li>
            {telegramHref && <li>Telegram: <a className="text-gold hover:underline" href={telegramHref} target="_blank" rel="noopener">@{site.telegram}</a></li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
