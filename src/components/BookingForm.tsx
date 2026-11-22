"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Dict, Locale } from "@/lib/i18n";
import { dailyRate, formatSum, rentalDays } from "@/lib/format";
import { Icon } from "./Icon";

type CarPrices = { id: string; pricePerDay: number | null; price3Days: number | null; price7Days: number | null };

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function initial(dateStr: string | undefined, fallbackDays: number) {
  const d = dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? new Date(`${dateStr}T10:00`) : new Date(Date.now() + fallbackDays * 86_400_000);
  if (!dateStr) d.setHours(10, 0, 0, 0);
  return toLocalInput(d);
}

function formatPhoneInput(v: string) {
  const d = v.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return parts.join(" ");
}

export function BookingForm({ car, locale, t }: { car: CarPrices; locale: Locale; t: Dict }) {
  const router = useRouter();
  const sp = useSearchParams();
  const start = sp.get("start") ?? undefined;
  const end = sp.get("end") ?? undefined;
  const f = t.form;
  const [form, setForm] = useState({
    name: "", phone: "", startAt: initial(start, 1), endAt: initial(end, 2),
    pickupType: "OFFICE" as "OFFICE" | "DELIVERY", address: "", comment: "", website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const days = useMemo(() => {
    const s = new Date(form.startAt), e = new Date(form.endAt);
    return isNaN(+s) || isNaN(+e) || e <= s ? null : rentalDays(s, e);
  }, [form.startAt, form.endAt]);
  const rate = days ? dailyRate(car, days) : null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: k === "phone" ? formatPhoneInput(e.target.value) : e.target.value }));

  function validate() {
    const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er.name = f.errors.name;
    if (form.phone.replace(/\D/g, "").length !== 9) er.phone = f.errors.phone;
    if (!days) er.endAt = f.errors.dates;
    if (new Date(form.startAt).getTime() < Date.now() - 60 * 60 * 1000) er.startAt = f.errors.past;
    if (form.pickupType === "DELIVERY" && form.address.trim().length < 3) er.address = f.errors.address;
    return er;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    setSending(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          carId: car.id,
          phone: `+998${form.phone.replace(/\D/g, "")}`,
          startAt: new Date(form.startAt).toISOString(),
          endAt: new Date(form.endAt).toISOString(),
          locale,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors({ form: res.status === 429 ? f.errors.rate : (data.field && f.errors[data.field as keyof typeof f.errors]) || f.errors.server });
        setSending(false);
        return;
      }
      router.push(`/${locale}/booking/${data.code}`);
    } catch {
      setErrors({ form: f.errors.server });
      setSending(false);
    }
  }

  const err = (k: string) => errors[k] && <p className="mt-1.5 text-xs text-danger">{errors[k]}</p>;

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <label className="block">
        <span className="label">{f.name}</span>
        <div className="relative">
          <Icon name="person" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dim" />
          <input className="field !pl-11" value={form.name} onChange={set("name")} placeholder={f.namePh} autoComplete="name" />
        </div>
        {err("name")}
      </label>
      <label className="block">
        <span className="label">{f.phone}</span>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gold">+998</span>
          <input className="field !pl-16" value={form.phone} onChange={set("phone")} placeholder="90 123 45 67" inputMode="tel" autoComplete="tel-national" />
        </div>
        {err("phone")}
      </label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <label className="block">
          <span className="label">{f.start}</span>
          <input type="datetime-local" className="field" value={form.startAt} onChange={set("startAt")} />
          {err("startAt")}
        </label>
        <label className="block">
          <span className="label">{f.end}</span>
          <input type="datetime-local" className="field" value={form.endAt} onChange={set("endAt")} />
          {err("endAt")}
        </label>
      </div>
      <fieldset>
        <legend className="label">{f.pickup}</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["OFFICE", "DELIVERY"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setForm((p) => ({ ...p, pickupType: v }))}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                form.pickupType === v ? "border-gold bg-gold/10 text-gold" : "border-line bg-card text-muted hover:text-fg"
              }`}
              aria-pressed={form.pickupType === v}
            >
              <Icon name={v === "OFFICE" ? "storefront" : "local_shipping"} className="!text-[18px]" />
              {v === "OFFICE" ? f.office : f.delivery}
            </button>
          ))}
        </div>
      </fieldset>
      {form.pickupType === "DELIVERY" && (
        <label className="block">
          <span className="label">{f.address}</span>
          <input className="field" value={form.address} onChange={set("address")} placeholder={f.addressPh} autoComplete="street-address" />
          {err("address")}
        </label>
      )}
      <label className="block">
        <span className="label flex justify-between">{f.comment}<span className="normal-case tracking-normal text-dim">{f.optional}</span></span>
        <textarea className="field min-h-20 resize-y" value={form.comment} onChange={set("comment")} placeholder={f.commentPh} rows={2} />
      </label>
      {/* honeypot: odamlar ko'rmaydi */}
      <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="space-y-2 rounded-xl border border-line bg-ink/60 p-4 text-sm">
        <div className="flex justify-between text-muted"><span>{f.days}</span><span className="text-fg">{days ? `${days} ${f.dayUnit}` : "—"}</span></div>
        <div className="flex items-baseline justify-between border-t border-line pt-2">
          <span className="font-display text-[12px] font-bold uppercase tracking-[0.08em]">{f.total}</span>
          <span className="font-display text-xl font-bold text-gold">{days && rate ? `${formatSum(rate * days)} ${t.common.sum}` : f.totalTbd}</span>
        </div>
      </div>

      {errors.form && <p className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{errors.form}</p>}
      <button className="btn-gold w-full !py-4" disabled={sending}>
        {sending ? f.sending : f.submit}
        {!sending && <Icon name="arrow_forward" className="!text-[18px]" />}
      </button>
      <p className="flex gap-2 text-xs text-muted"><Icon name="verified_user" className="!text-[16px] text-gold" />{f.note}</p>
    </form>
  );
}
