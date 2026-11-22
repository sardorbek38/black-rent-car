import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="font-display text-6xl font-extrabold gold-text">404</p>
      <p className="mt-4 text-muted">Sahifa topilmadi · Страница не найдена</p>
      <Link href="/" className="btn-gold mt-8">Bosh sahifa</Link>
    </div>
  );
}
