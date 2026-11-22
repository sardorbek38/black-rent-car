import Image from "next/image";
import Link from "next/link";
import type { Locale, Dict } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Icon } from "./Icon";
import { LangSwitch } from "./LangSwitch";
import { DesktopNav, MobileNav } from "./NavLinks";

export function Header({ locale, t }: { locale: Locale; t: Dict }) {
  const p = `/${locale}`;
  const desktop = [
    { href: p, label: t.nav.home, icon: "home" },
    { href: `${p}/cars`, label: t.nav.cars, icon: "directions_car" },
    { href: `${p}/prices`, label: t.nav.prices, icon: "sell" },
    { href: `${p}/terms`, label: t.nav.terms, icon: "description" },
    { href: `${p}/contacts`, label: t.nav.contacts, icon: "call" },
  ];
  const mobile = desktop.filter((i) => !i.href.endsWith("/terms"));
  return (
    <>
      <header className="glass sticky top-0 z-40 border-b border-line">
        <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <Link href={p} className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={40} height={40} className="h-9 w-9 rounded-full md:h-10 md:w-10" priority />
            <span className="leading-tight">
              <span className="block whitespace-nowrap font-display text-[13px] font-bold tracking-[0.1em] sm:text-[15px] sm:tracking-[0.12em] md:text-base">BLACK RENT CAR</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gold lg:hidden">Toshkent</span>
            </span>
          </Link>
          <DesktopNav items={desktop} />
          <div className="flex items-center gap-2 md:gap-3">
            <LangSwitch locale={locale} />
            <a href={site.phoneHref} className="btn-gold hidden !px-5 !py-2.5 !text-[13px] !normal-case !tracking-normal md:inline-flex">
              <Icon name="call" className="!text-[18px]" />
              {site.phone}
            </a>
            <a href={site.phoneHref} aria-label={t.common.call} className="grid h-10 w-10 place-items-center rounded-full bg-gold text-ink md:hidden">
              <Icon name="call" />
            </a>
          </div>
        </div>
      </header>
      <MobileNav items={mobile} />
    </>
  );
}
