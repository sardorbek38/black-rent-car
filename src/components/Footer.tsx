import Image from "next/image";
import Link from "next/link";
import type { Locale, Dict } from "@/lib/i18n";
import { site, telegramHref } from "@/lib/site";
import { Icon } from "./Icon";

export function Footer({ locale, t }: { locale: Locale; t: Dict }) {
  const p = `/${locale}`;
  return (
    <footer className="mt-24 border-t border-line pb-28 pt-14 lg:pb-10">
      <div className="container-x grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={40} height={40} className="h-10 w-10 rounded-full" />
            <span className="font-display font-bold tracking-[0.12em]">BLACK RENT CAR</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted">{t.footer.about}</p>
        </div>
        <div>
          <h3 className="mb-4 font-display text-sm font-bold">{t.footer.links}</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link className="hover:text-gold" href={`${p}/cars`}>{t.nav.cars}</Link></li>
            <li><Link className="hover:text-gold" href={`${p}/prices`}>{t.nav.prices}</Link></li>
            <li><Link className="hover:text-gold" href={`${p}/terms`}>{t.nav.terms}</Link></li>
            <li><Link className="hover:text-gold" href={`${p}/contacts`}>{t.nav.contacts}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-display text-sm font-bold">{t.footer.contact}</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li><a className="flex items-center gap-2 hover:text-gold" href={site.phoneHref}><Icon name="call" className="text-gold" />{site.phone}</a></li>
            <li><a className="flex items-center gap-2 hover:text-gold" href={site.instagramHref} target="_blank" rel="noopener"><Icon name="photo_camera" className="text-gold" />@{site.instagram}</a></li>
            {telegramHref && <li><a className="flex items-center gap-2 hover:text-gold" href={telegramHref} target="_blank" rel="noopener"><Icon name="send" className="text-gold" />@{site.telegram}</a></li>}
            <li className="flex items-center gap-2"><Icon name="schedule" className="text-gold" />{t.contacts.hoursText}</li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-12 border-t border-line pt-6 text-xs text-dim">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Black Rent Car. {t.footer.rights}</span>
          <Link className="hover:text-gold" href={`${p}/privacy`}>{t.footer.privacy}</Link>
        </div>
      </div>
    </footer>
  );
}
