"use client";
import { useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { overlaps, startBlocked, type BusyRange } from "@/lib/busy";
import { Icon } from "./Icon";

const WEEK = { uz: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"], ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] };
const MONTHS = {
  uz: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
  ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
};
const MAX_MONTHS_AHEAD = 3;

const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export type DayState = "free" | "partial" | "busy";

/** Kun to'liq band (hech bir soatda olib bo'lmaydi), qisman band yoki bo'sh */
export function dayState(busy: BusyRange[], day: Date): DayState {
  const from = dayStart(day), to = addDays(from, 1);
  if (!busy.some((r) => overlaps(from, to, r.start, r.end))) return "free";
  for (let h = 0; h < 24; h++) if (!startBlocked(busy, new Date(from.getFullYear(), from.getMonth(), from.getDate(), h))) return "partial";
  return "busy";
}

export function AvailabilityCalendar({ busy, start, end, pickNext, onPick, locale, t }: {
  busy: BusyRange[] | null; start: Date | null; end: Date | null; pickNext: "start" | "end";
  onPick: (day: Date) => void; locale: Locale; t: Dict;
}) {
  const today = dayStart(new Date());
  const [offset, setOffset] = useState(() => {
    if (!start) return 0;
    const m = (start.getFullYear() - today.getFullYear()) * 12 + start.getMonth() - today.getMonth();
    return Math.min(Math.max(m, 0), MAX_MONTHS_AHEAD);
  });
  const month = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const lead = (month.getDay() + 6) % 7; // dushanbadan boshlaymiz
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];

  const s = start && dayStart(start).getTime();
  const e = end && dayStart(end).getTime();
  const c = t.form.cal;

  return (
    <div className="rounded-xl border border-line bg-ink/50 p-3">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setOffset((o) => o - 1)} disabled={offset === 0} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-gold disabled:opacity-30" aria-label="‹">
          <Icon name="chevron_left" />
        </button>
        <p className="font-display text-sm font-bold">{MONTHS[locale][month.getMonth()]} {month.getFullYear()}</p>
        <button type="button" onClick={() => setOffset((o) => o + 1)} disabled={offset === MAX_MONTHS_AHEAD} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:text-gold disabled:opacity-30" aria-label="›">
          <Icon name="chevron_right" />
        </button>
      </div>
      <p className="mt-1 text-center text-[11px] text-dim">
        {busy ? `${c.hint} · ` : c.loading}
        {busy && <span className="font-semibold text-gold">{pickNext === "start" ? c.start : c.end}</span>}
      </p>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
        {WEEK[locale].map((w) => <span key={w} className="py-1 text-[10px] font-bold uppercase text-dim">{w}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={`x${i}`} />;
          const time = d.getTime();
          const past = d < today;
          const state = busy && !past ? dayState(busy, d) : "free";
          const edge = time === s || time === e;
          const inRange = s != null && e != null && time > s && time < e;
          const disabled = past || state === "busy";
          return (
            <button
              key={time}
              type="button"
              disabled={disabled}
              onClick={() => onPick(d)}
              title={state === "busy" ? c.busy : state === "partial" ? c.partial : undefined}
              className={`relative h-9 rounded-lg text-sm transition ${
                edge ? "bg-gold font-bold text-ink"
                : state === "busy" && !past ? "cursor-not-allowed bg-danger/10 text-danger/70 line-through"
                : past ? "text-dim/50"
                : inRange ? "bg-gold/15 text-gold"
                : "text-fg hover:bg-raised"
              }`}
            >
              {d.getDate()}
              {state === "partial" && <span className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${edge ? "bg-ink" : "bg-danger"}`} />}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-line bg-card" />{c.free}</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-danger" />{c.partial}</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-danger/30" />{c.busy}</span>
      </div>
    </div>
  );
}
