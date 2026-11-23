"use client";
import Image from "next/image";
import { useActionState } from "react";
import { login, sendNewPassword } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  const [reset, resetAction, resetting] = useActionState(sendNewPassword, {});
  return (
    <div className="grid min-h-dvh place-items-center px-5">
      <form action={action} className="card glow w-full max-w-sm p-7">
        <Image src="/logo.png" alt="Black Rent Car" width={64} height={64} className="mx-auto rounded-full" />
        <h1 className="mt-4 text-center font-display text-xl font-bold">Admin panel</h1>
        <label className="mt-6 block">
          <span className="label">Parol</span>
          <input name="password" type="password" className="field" autoFocus autoComplete="current-password" required />
        </label>
        {state?.error && <p className="mt-2 text-sm text-danger">{state.error}</p>}
        <button className="btn-gold mt-5 w-full" disabled={pending}>{pending ? "..." : "Kirish"}</button>
        <button formAction={resetAction} formNoValidate className="mt-4 w-full text-center text-xs text-muted hover:text-gold" disabled={resetting}>
          {resetting ? "Yuborilmoqda..." : "Parolni unutdingizmi? Yangisini Telegram'ga yuborish"}
        </button>
        {reset.error && <p className="mt-2 text-center text-xs text-danger">{reset.error}</p>}
        {reset.info && <p className="mt-2 text-center text-xs text-gold">{reset.info}</p>}
      </form>
    </div>
  );
}
