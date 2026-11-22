import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminShell } from "../../AdminShell";
import { deleteCar, saveCar } from "../../actions";

export const dynamic = "force-dynamic";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-dim">{hint}</span>}
    </label>
  );
}

export default async function EditCar({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const car = isNew ? null : await prisma.car.findUnique({ where: { id } });
  if (!isNew && !car) notFound();
  const v = car;

  return (
    <AdminShell active="cars">
      <Link href="/admin/cars" className="text-sm text-muted hover:text-fg">← Mashinalar</Link>
      <h1 className="mt-2 font-display text-2xl font-bold">{isNew ? "Yangi mashina" : `${v!.brand} ${v!.model}`}</h1>

      <form action={saveCar} className="mt-6 grid gap-6 lg:grid-cols-2">
        <input type="hidden" name="id" value={v?.id ?? ""} />
        <section className="card space-y-4 p-5">
          <h2 className="font-display font-bold">Asosiy</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Brend"><input name="brand" required defaultValue={v?.brand} className="field" /></Field>
            <Field label="Model"><input name="model" required defaultValue={v?.model} className="field" /></Field>
            <Field label="Toifa">
              <select name="carClass" defaultValue={v?.carClass ?? "COMFORT"} className="field">
                <option value="ECONOM">Ekonom</option><option value="COMFORT">Komfort</option><option value="BUSINESS">Biznes</option><option value="PREMIUM">Premium</option>
              </select>
            </Field>
            <Field label="Kuzov">
              <select name="bodyType" defaultValue={v?.bodyType ?? "SEDAN"} className="field">
                <option value="SEDAN">Sedan</option><option value="CROSSOVER">Krossover</option><option value="SUV">SUV</option>
              </select>
            </Field>
            <Field label="Yoqilg'i">
              <select name="fuel" defaultValue={v?.fuel ?? ""} className="field">
                <option value="">Aniqlanmagan</option><option value="PETROL">Benzin</option><option value="HYBRID">Gibrid</option><option value="ELECTRIC">Elektr</option><option value="RANGE_EXTENDER">Gibrid (EREV)</option>
              </select>
            </Field>
            <Field label="Quti">
              <select name="automatic" defaultValue={v?.automatic == null ? "" : v.automatic ? "yes" : "no"} className="field">
                <option value="">Aniqlanmagan</option><option value="yes">Avtomat</option><option value="no">Mexanika</option>
              </select>
            </Field>
            <Field label="Yili"><input name="year" inputMode="numeric" defaultValue={v?.year ?? ""} className="field" /></Field>
            <Field label="O'rindiqlar"><input name="seats" inputMode="numeric" defaultValue={v?.seats ?? 5} className="field" /></Field>
          </div>
        </section>

        <section className="card space-y-4 p-5">
          <h2 className="font-display font-bold">Narxlar (so&apos;m)</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="1 kun"><input name="pricePerDay" inputMode="numeric" defaultValue={v?.pricePerDay ?? ""} placeholder="masalan 500000" className="field" /></Field>
            <Field label="3+ kun (kuniga)"><input name="price3Days" inputMode="numeric" defaultValue={v?.price3Days ?? ""} className="field" /></Field>
            <Field label="7+ kun (kuniga)"><input name="price7Days" inputMode="numeric" defaultValue={v?.price7Days ?? ""} className="field" /></Field>
            <Field label="Depozit"><input name="deposit" inputMode="numeric" defaultValue={v?.deposit ?? ""} className="field" /></Field>
          </div>
          <p className="text-xs text-dim">Bo&apos;sh qoldirilsa saytda &quot;Narx so&apos;raladi&quot; chiqadi.</p>
          <h2 className="pt-2 font-display font-bold">Holat</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Holati">
              <select name="status" defaultValue={v?.status ?? "AVAILABLE"} className="field">
                <option value="AVAILABLE">Bo&apos;sh</option><option value="RENTED">Ijarada</option><option value="SERVICE">Ta&apos;mirda</option>
              </select>
            </Field>
            <Field label="Tartib raqami"><input name="sortOrder" inputMode="numeric" defaultValue={v?.sortOrder ?? 0} className="field" /></Field>
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="isVisible" defaultChecked={v?.isVisible ?? true} className="h-5 w-5 accent-[#c9a45c]" />
            Saytda ko&apos;rsatish
          </label>
        </section>

        <section className="card space-y-4 p-5 lg:col-span-2">
          <h2 className="font-display font-bold">Tavsif va rasmlar</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Tavsif (o'zbekcha)"><textarea name="descriptionUz" rows={3} defaultValue={v?.descriptionUz} className="field" /></Field>
            <Field label="Описание (русский)"><textarea name="descriptionRu" rows={3} defaultValue={v?.descriptionRu} className="field" /></Field>
          </div>
          <Field label="Rasmlar (har qatorda bitta manzil, birinchisi asosiy)" hint="Masalan: /cars/byd-han/main.webp yoki https://... Rasm yuklash keyingi versiyada qo'shiladi.">
            <textarea name="images" rows={4} defaultValue={v?.images.join("\n")} className="field font-mono text-xs" />
          </Field>
        </section>

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <button className="btn-gold">Saqlash</button>
          <Link href="/admin/cars" className="btn-ghost">Bekor qilish</Link>
        </div>
      </form>

      {!isNew && (
        <form action={deleteCar} className="mt-10 border-t border-line pt-6">
          <input type="hidden" name="id" value={v!.id} />
          <button className="text-sm text-danger hover:underline">Mashinani o&apos;chirish (bronlari bo&apos;lsa faqat yashiriladi)</button>
        </form>
      )}
    </AdminShell>
  );
}
