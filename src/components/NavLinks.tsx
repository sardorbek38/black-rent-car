"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

type Item = { href: string; label: string; icon: string };

function isActive(pathname: string, href: string) {
  const depth = href.split("/").length;
  return depth <= 2 ? pathname === href : pathname.startsWith(href);
}

export function DesktopNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-1 rounded-full border border-line bg-card/70 p-1 lg:flex">
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          className={`rounded-full px-4 py-2 font-display text-[12px] font-semibold uppercase tracking-[0.08em] transition ${
            isActive(pathname, i.href) ? "bg-raised text-gold" : "text-muted hover:text-fg"
          }`}
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileNav({ items }: { items: Item[] }) {
  const pathname = usePathname();
  return (
    <nav className="glass fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-full border border-line p-1.5 lg:hidden">
      {items.map((i) => {
        const active = isActive(pathname, i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-[11px] font-semibold transition ${
              active ? "bg-gold/15 text-gold" : "text-muted"
            }`}
          >
            <Icon name={i.icon} fill={active} className="!text-[22px]" />
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
