"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LangSwitch({ locale }: { locale: string }) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");
  return (
    <div className="flex items-center rounded-full border border-line bg-card p-1 text-[11px] font-bold">
      {(["uz", "ru"] as const).map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}`}
          onClick={() => { document.cookie = `lang=${l}; path=/; max-age=31536000`; }}
          className={`rounded-full px-2.5 py-1 uppercase transition ${l === locale ? "bg-gold text-ink" : "text-muted hover:text-fg"}`}
          aria-current={l === locale ? "true" : undefined}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
