import type { Metadata } from "next";
import { getDict, type Locale } from "@/lib/i18n";
import { site, telegramHref } from "@/lib/site";
import { Icon } from "@/components/Icon";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDict(locale).contacts.title };
}

export default async function ContactsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDict(locale);
  const c = t.contacts;
  const rows = [
    { icon: "call", label: c.phone, value: site.phone, href: site.phoneHref, action: t.common.call, primary: true },
    { icon: "photo_camera", label: c.instagram, value: `@${site.instagram}`, href: site.instagramHref, action: c.write },
    ...(telegramHref ? [{ icon: "send", label: c.telegram, value: `@${site.telegram}`, href: telegramHref, action: c.write }] : []),
  ];
  return (
    <div className="container-x max-w-3xl pt-10 md:pt-14">
      <h1 className="font-display text-[36px] font-extrabold uppercase md:text-[48px]"><span className="gold-text">{c.title}</span></h1>
      <p className="mt-3 flex items-center gap-2 text-muted"><span className="h-2 w-2 rounded-full bg-gold" />{c.lead}</p>

      <div className="card mt-8 space-y-3 p-4 md:p-5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-4 rounded-xl border border-line bg-ink/50 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-raised text-gold"><Icon name={r.icon} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-dim">{r.label}</p>
              <p className="truncate font-display text-lg font-bold">{r.value}</p>
            </div>
            <a href={r.href} target={r.primary ? undefined : "_blank"} rel="noopener" className={`${r.primary ? "btn-gold" : "btn-ghost"} !px-4 !py-2.5 !text-[12px] !normal-case !tracking-normal`}>
              <span className="hidden sm:inline">{r.action}</span><Icon name="arrow_outward" className="!text-[18px]" />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-display font-bold"><Icon name="schedule" className="text-gold" />{c.hours}</h2>
          <p className="mt-3 text-sm text-muted">{c.hoursText}</p>
        </div>
        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-display font-bold"><Icon name="location_on" className="text-gold" />{c.address}</h2>
          <p className={`mt-3 text-sm ${site.address ? "text-muted" : "text-dim"}`}>{site.address ? site.address[locale] : t.common.tbd}</p>
        </div>
      </div>
    </div>
  );
}
