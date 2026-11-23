import Link from "next/link";
import type { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatSum, prettyPhone } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { AdminShell } from "./AdminShell";
import { updateBooking } from "./actions";

export const dynamic = "force-dynamic";

const LABEL: Record<BookingStatus, string> = { NEW: "Yangi", CONFIRMED: "Tasdiqlandi", ACTIVE: "Ijarada", DONE: "Yakunlandi", CANCELLED: "Bekor qilindi" };
const COLOR: Record<BookingStatus, string> = {
  NEW: "bg-gold text-ink", CONFIRMED: "bg-sky-500/20 text-sky-300", ACTIVE: "bg-emerald-500/20 text-emerald-300",
  DONE: "bg-raised text-muted", CANCELLED: "bg-danger/15 text-danger",
};
// Bir bosishda holatni o'zgartirish tugmalari
const QUICK: Record<BookingStatus, { to: BookingStatus; label: string; icon: string; danger?: boolean }[]> = {
  NEW: [{ to: "CONFIRMED", label: "Tasdiqlash", icon: "check_circle" }, { to: "CANCELLED", label: "Bekor qilish", icon: "cancel", danger: true }],
  CONFIRMED: [{ to: "ACTIVE", label: "Mashina berildi", icon: "key" }, { to: "CANCELLED", label: "Bekor qilish", icon: "cancel", danger: true }],
  ACTIVE: [{ to: "DONE", label: "Qaytarildi", icon: "task_alt" }],
  DONE: [],
  CANCELLED: [],
};
const fmt = (d: Date) => new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Tashkent" }).format(d);

export default async function AdminBookings({ searchParams }: { searchParams: Promise<{ status?: string; clash?: string }> }) {
  const sp = await searchParams;
  const status = (Object.keys(LABEL) as BookingStatus[]).find((s) => s === sp.status);
  const startOfDay = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tashkent" }) + "T00:00:00+05:00");
  const monthAgo = new Date(Date.now() - 30 * 86_400_000);

  const [bookings, counts, today, month, active] = await Promise.all([
    prisma.booking.findMany({ where: status ? { status } : {}, include: { car: true }, orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.booking.groupBy({ by: ["status"], _count: true }),
    prisma.booking.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.booking.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.booking.count({ where: { status: "ACTIVE" } }),
  ]);
  const back = status ? `/admin?status=${status}` : "/admin";
  const clashCode = sp.clash && /^BR-\d{6}$/.test(sp.clash) ? sp.clash : null;
  const countOf = (s: BookingStatus) => counts.find((c) => c.status === s)?._count ?? 0;

  // Bir mashinaga tasdiqlangan bronlar ustma-ust tushsa ogohlantirish
  const live = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "ACTIVE");
  const clash = new Set<string>();
  for (const a of live) for (const b of live)
    if (a.id < b.id && a.carId === b.carId && a.startAt < b.endAt && b.startAt < a.endAt) { clash.add(a.id); clash.add(b.id); }

  const stats = [
    { label: "Bugungi so'rovlar", value: today, icon: "today" },
    { label: "Yangi (javob kutmoqda)", value: countOf("NEW"), icon: "notifications_active" },
    { label: "Hozir ijarada", value: active, icon: "key" },
    { label: "30 kunda bronlar", value: month, icon: "insights" },
  ];

  return (
    <AdminShell active="bookings">
      <h1 className="font-display text-2xl font-bold">Bronlar</h1>
      <p className="mt-1 text-xs text-muted">Yangi, tasdiqlangan va ijaradagi bronlar mashina sanasini band qiladi: saytda va ilovada shu kunlar band ko'rinadi. Bekor qilsangiz, sana bo'shaydi.</p>
      {clashCode && (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
          <Icon name="error" className="!text-[18px]" />
          Saqlanmadi: bu mashina shu sanalarga #{clashCode} bron bilan allaqachon tasdiqlangan. Avval o&apos;sha bronni bekor qiling yoki sanani o&apos;zgartiring.
        </p>
      )}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <Icon name={s.icon} className="text-gold" />
            <p className="mt-2 font-display text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        <Link href="/admin" className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold ${!status ? "border-gold/60 bg-gold/15 text-gold" : "border-line text-muted"}`}>Barchasi</Link>
        {(Object.keys(LABEL) as BookingStatus[]).map((s) => (
          <Link key={s} href={`/admin?status=${s}`} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold ${status === s ? "border-gold/60 bg-gold/15 text-gold" : "border-line text-muted"}`}>
            {LABEL[s]} ({countOf(s)})
          </Link>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {bookings.length === 0 && <p className="card p-10 text-center text-muted">Hozircha bron yo'q.</p>}
        {bookings.map((b) => (
          <div key={b.id} className={`card p-4 md:p-5 ${b.status === "NEW" ? "border-gold/50" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display font-bold">#{b.code}</span>
                  <span className={`badge ${COLOR[b.status]}`}>{LABEL[b.status]}</span>
                  {clash.has(b.id) && <span className="badge bg-danger/20 text-danger">Sanalar ustma-ust!</span>}
                </div>
                <p className="mt-1 text-xs text-dim">Yuborildi: {fmt(b.createdAt)} · til: {b.locale}</p>
              </div>
              <p className="font-display text-lg font-bold text-gold">{b.totalPrice ? `${formatSum(b.totalPrice)} so'm` : "narx yo'q"}</p>
            </div>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
              <div><p className="text-[10px] font-bold uppercase tracking-wider text-dim">Mashina</p><p className="font-semibold">{b.car.brand} {b.car.model}</p></div>
              <div><p className="text-[10px] font-bold uppercase tracking-wider text-dim">Muddat</p><p>{fmt(b.startAt)} → {fmt(b.endAt)} <span className="text-muted">({b.days} kun)</span></p></div>
              <div><p className="text-[10px] font-bold uppercase tracking-wider text-dim">Mijoz</p><p>{b.name}</p><a href={`tel:${b.phone}`} className="font-semibold text-gold">{prettyPhone(b.phone)}</a></div>
              <div><p className="text-[10px] font-bold uppercase tracking-wider text-dim">Joy</p><p>{b.pickupType === "DELIVERY" ? `Yetkazish: ${b.address}` : "Ofisdan"}</p></div>
            </div>
            {b.comment && <p className="mt-3 rounded-lg bg-raised p-3 text-sm text-muted">💬 {b.comment}</p>}
            {QUICK[b.status].length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                {QUICK[b.status].map((q) => (
                  <form key={q.to} action={updateBooking}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="status" value={q.to} />
                    <input type="hidden" name="back" value={back} />
                    <button className={q.danger ? "btn-ghost !border-danger/40 !px-4 !py-2 !text-xs !text-danger" : "btn-gold !px-4 !py-2 !text-xs"}>
                      <Icon name={q.icon} className="!text-[16px]" />{q.label}
                    </button>
                  </form>
                ))}
              </div>
            )}
            <form action={updateBooking} className="mt-3 flex flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={b.id} />
              <input type="hidden" name="back" value={back} />
              <select name="status" defaultValue={b.status} className="field !w-auto !py-2 text-sm">
                {(Object.keys(LABEL) as BookingStatus[]).map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
              </select>
              <input name="adminNote" defaultValue={b.adminNote ?? ""} placeholder="Admin izohi" className="field !w-auto min-w-0 flex-1 !py-2 text-sm" />
              <button className="btn-gold !px-5 !py-2 !text-xs">Saqlash</button>
            </form>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
