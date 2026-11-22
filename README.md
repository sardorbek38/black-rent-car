# Black Rent Car

Toshkentdagi Black Rent Car avtomobil ijarasi uchun sayt, bron tizimi va admin panel.
Texnik topshiriq: [TZ.md](TZ.md). Dizayn: Google Stitch maketi asosida.

## Imkoniyatlar

- O'zbek (`/uz`) va rus (`/ru`) tillari
- Bosh sahifa, avtopark (filtr va saralash), mashina sahifasi, narxlar, ijara shartlari, aloqa
- Bron so'rovi: forma, tekshiruv, spamdan himoya, rahmat sahifasi va kvitansiya
- Yangi bron haqida egasiga Telegram xabar
- Admin panel (`/admin`): bronlar va holatlari, mashinalar, narxlar
- Mobil ilova uchun ochiq API: `GET /api/cars`, `GET /api/cars/:slug`, `POST /api/bookings`

## Texnologiyalar

Next.js 15 (App Router, TypeScript), Tailwind CSS 4, Prisma 6, PostgreSQL. Hosting: Vercel.

## Lokal ishga tushirish

```bash
npm install
cp .env.example .env      # DATABASE_URL, ADMIN_PASSWORD, ADMIN_SECRET ni to'ldiring
npm run db:push           # jadvallarni yaratadi
npm run db:seed           # 8 ta mashinani qo'shadi
npm run dev               # http://localhost:3000
```

## Vercel'ga joylash

1. [Neon](https://neon.tech) da bepul PostgreSQL baza oching va ulanish manzilini oling.
2. Vercel'da GitHub repodan yangi loyiha yarating.
3. Environment Variables bo'limiga `.env.example` dagi o'zgaruvchilarni qo'shing.
   `NEXT_PUBLIC_SITE_URL` ga sayt manzilini yozing (masalan `https://black-rent-car.vercel.app`).
4. Birinchi marta lokal kompyuterdan Neon bazaga ulanib `npm run db:push` va `npm run db:seed` ni ishga tushiring.
5. Deploy. Keyingi har bir `main` ga push avtomatik deploy bo'ladi.

## Telegram bildirishnoma

1. Telegramda [@BotFather](https://t.me/BotFather) orqali bot yarating va tokenni `TELEGRAM_BOT_TOKEN` ga yozing.
2. Egasi botga `/start` yozadi.
3. `https://api.telegram.org/bot<TOKEN>/getUpdates` dan `chat.id` ni olib `TELEGRAM_CHAT_ID` ga yozing.

## Mijozdan kutilayotgan ma'lumotlar

Narxlar, ijara shartlari, Telegram username va ofis manzili hali yo'q. Narxlarni admin paneldan,
kontaktlarni `src/lib/site.ts` dan, shartlarni `src/lib/i18n.ts` dan o'zgartirish mumkin.
