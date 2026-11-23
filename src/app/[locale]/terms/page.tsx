import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getDict, type Locale } from "@/lib/i18n";
import { Icon } from "@/components/Icon";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale, "/terms", { title: getDict(locale).terms.title });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDict(locale);
  return (
    <div className="container-x pt-10 md:pt-14">
      <h1 className="font-display text-[36px] font-extrabold uppercase md:text-[48px]"><span className="gold-text">{t.terms.title}</span></h1>
      <p className="mt-3 max-w-xl text-muted">{t.terms.lead}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {t.terms.items.map((it) => (
          <div key={it.title} className="card p-6">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-line bg-raised text-gold"><Icon name={it.icon} /></div>
            <h2 className="mt-5 font-display text-lg font-bold">{it.title}</h2>
            <p className={`mt-2 text-sm ${it.text === t.common.tbd ? "text-dim" : "text-muted"}`}>{it.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
