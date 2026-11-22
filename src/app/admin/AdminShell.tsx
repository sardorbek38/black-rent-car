import Image from "next/image";
import Link from "next/link";
import { logout } from "./actions";
import { Icon } from "@/components/Icon";

export function AdminShell({ active, children }: { active: "bookings" | "cars"; children: React.ReactNode }) {
  const item = (key: string, href: string, icon: string, label: string) => (
    <Link href={href} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${active === key ? "bg-raised text-gold" : "text-muted hover:text-fg"}`}>
      <Icon name={icon} className="!text-[18px]" />{label}
    </Link>
  );
  return (
    <>
      <header className="glass sticky top-0 z-30 border-b border-line">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={36} height={36} className="rounded-full" />
            <span className="hidden font-display text-sm font-bold tracking-[0.12em] sm:block">ADMIN PANEL</span>
          </Link>
          <nav className="flex gap-1">
            {item("bookings", "/admin", "event_note", "Bronlar")}
            {item("cars", "/admin/cars", "directions_car", "Mashinalar")}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/uz" target="_blank" className="hidden text-xs text-muted hover:text-fg md:block">Saytni ochish ↗</Link>
            <form action={logout}><button className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted hover:text-fg" aria-label="Chiqish"><Icon name="logout" className="!text-[18px]" /></button></form>
          </div>
        </div>
      </header>
      <main className="container-x py-8">{children}</main>
    </>
  );
}
