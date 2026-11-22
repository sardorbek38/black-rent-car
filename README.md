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

1. Vercel'da GitHub repodan yangi loyiha yarating (Add New → Project → `black-rent-car`).
2. Loyihada **Storage → Create Database → Neon** ni tanlang va loyihaga ulang. `DATABASE_URL` avtomatik qo'shiladi.
3. **Settings → Environment Variables** ga qo'shing: `ADMIN_PASSWORD`, `ADMIN_SECRET` (30+ belgili tasodifiy satr),
   `NEXT_PUBLIC_SITE_URL` (masalan `https://black-rent-car.vercel.app`).
4. **Deployments → Redeploy**. Build paytida `vercel-build` jadvallarni yaratadi va 8 ta mashinani qo'shadi
   (mavjud ma'lumotlar o'zgarmaydi).
5. Keyingi har bir `main` ga push avtomatik deploy bo'ladi.

## Telegram bildirishnoma

1. Telegramda [@BotFather](https://t.me/BotFather) orqali bot yarating va tokenni `TELEGRAM_BOT_TOKEN` ga yozing.
2. Egasi botga `/start` yozadi.
3. `https://api.telegram.org/bot<TOKEN>/getUpdates` dan `chat.id` ni olib `TELEGRAM_CHAT_ID` ga yozing.

## Mijozdan kutilayotgan ma'lumotlar

Narxlar, ijara shartlari, Telegram username va ofis manzili hali yo'q. Narxlarni admin paneldan,
kontaktlarni `src/lib/site.ts` dan, shartlarni `src/lib/i18n.ts` dan o'zgartirish mumkin.
