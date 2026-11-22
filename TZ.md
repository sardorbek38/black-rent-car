# Texnik topshiriq (TZ): Black Rent Car

**Loyiha:** Black Rent Car uchun avtomobil ijarasi sayti va mobil ilovasi
**Mijoz:** Black Rent Car, Toshkent (Instagram: [@black.rent.cars](https://instagram.com/black.rent.cars), tel: +998 90 950 00 15)
**Ishlab chiquvchi:** Sardorbek
**Sana:** 22-noyabr 2026
**Holat:** qoralama (1-versiya)

> `[?]` belgisi bilan yozilgan joylar taxmin yoki mijozdan so'ralishi kerak bo'lgan ma'lumot.

---

## 1. Loyiha maqsadi

Black Rent Car hozir mijozlarni faqat Instagram va telefon orqali oladi. Maqsad:

1. Mijoz mashinalarni, narxlarni va shartlarni bitta joyda ko'ra olsin.
2. Mijoz 1 daqiqada bron so'rovi yubora olsin (sana, telefon).
3. Egasi har bir yangi so'rovni darhol Telegramda olsin.
4. Egasi mashinalar, narxlar va bronlarni admin paneldan o'zi boshqarsin, dasturchisiz.
5. Keyinchalik shu backend ustida Android ilova chiqarilsin.

**Brend shiori:** "Black rent car | Это забота о вашем комфорте"
**Asosiy afzalliklar (Instagram'dan):** rasmiylashtirish 5 daqiqada, Toshkent bo'ylab yetkazib berish, biznes, dam olish va sayohat uchun, 24/7.

## 2. Dizayn uslubi

**Asosiy dizayn Google Stitch'da tayyorlangan maket bo'ladi**, sayt aynan shu maket bo'yicha quriladi. Quyidagilar maketga yordamchi yo'nalish, Instagram postlaridagi uslubdan olingan:

- **Ranglar:** qora fon (#0A0A0A), kumush/metall matn (#C9CCD1), iliq oltin urg'u (#D4A24C, chiroqlar rangi), oq matn.
- **Kayfiyat:** premium, kechki shahar, yaltiroq qora mashinalar.
- **Shrift:** sarlavhalar uchun keng, qalin sans-serif (masalan Montserrat yoki Unbounded), matn uchun Inter.
- **Logo:** "BR / BLACK RENT CAR" doira logotipi. `[?]` logoning toza PNG/SVG fayli kerak, hozir faqat postlardan kesib olish mumkin.
- **Rasmlar:** har bir mashina uchun mavjud poster (oldi, orqa, yon ko'rinish).
- **Mobil birinchi:** mijozlarning ko'pi Instagram'dan telefonda keladi.

## 3. Avtoparki (hozircha 8 ta mashina)

| # | Mashina | Turi | Kunlik narx |
|---|---------|------|-------------|
| 1 | Chevrolet Malibu | Sedan, biznes | `[?]` |
| 2 | BYD Chazor | Sedan, elektr/gibrid | `[?]` |
| 3 | BYD Han | Sedan, premium elektr | `[?]` |
| 4 | BMW i3 35L | Sedan, premium | `[?]` |
| 5 | Chevrolet Lacetti | Sedan, ekonom | `[?]` |
| 6 | BYD Champion (Song Plus) | Krossover | `[?]` |
| 7 | Chevrolet Monza | Sedan, komfort | `[?]` |
| 8 | Li Auto L9 | Katta SUV, 6 o'rindiq | `[?]` |

Har bir mashina uchun saqlanadi: nomi, brendi, turi, yili `[?]`, uzatmalar qutisi, yoqilg'i turi, o'rindiqlar soni, kunlik narx, 3+ kun va 7+ kun uchun chegirma narx `[?]`, depozit `[?]`, rasmlar, holati (bo'sh / ijarada / ta'mirda).

## 4. Foydalanuvchilar

| Rol | Nima qila oladi |
|-----|-----------------|
| **Mehmon (mijoz)** | Mashinalarni ko'radi, filtrlaydi, bron so'rovi yuboradi, qo'ng'iroq qiladi yoki Telegram/Instagramga yozadi. Ro'yxatdan o'tish shart emas. |
| **Admin (egasi)** | Admin panelga kiradi, mashina qo'shadi/tahrirlaydi, narxlarni o'zgartiradi, bronlarni ko'radi va holatini o'zgartiradi. |

## 5. Sayt sahifalari

### 5.1 Bosh sahifa `/`
- **Hero:** logo, "Black Rent Car" sarlavhasi, shior, eng chiroyli mashina rasmi (masalan BYD Han yoki Li L9), ikkita tugma: "Mashina tanlash" va "Qo'ng'iroq qilish".
- **Afzalliklar:** 4 ta belgi (postlardagidek): Ishonchlilik, Komfort, Premium, 24/7. Qo'shimcha: "5 daqiqada rasmiylashtirish", "Toshkent bo'ylab yetkazib berish".
- **Mashinalar katalogi (qisqa):** 8 ta kartochka.
- **Qanday ishlaydi:** 1) Mashina tanlang, 2) So'rov yuboring, 3) Menejer qo'ng'iroq qiladi, 4) Mashina eshigingizga yetkaziladi.
- **Ijara shartlari (qisqa)** va "Batafsil" havolasi.
- **Kontaktlar:** telefon, Telegram, Instagram, xarita `[?]` (ofis manzili kerak).
- **Footer:** logo, kontaktlar, til almashtirgich.

### 5.2 Katalog `/cars`
- Barcha mashinalar kartochkada: rasm, nomi, turi, kunlik narx, "Batafsil" tugmasi.
- **Filtrlar:** turi (sedan / krossover / SUV), narx oralig'i, o'rindiqlar soni.
- **Saralash:** narx bo'yicha (arzon / qimmat).
- Ijarada yoki ta'mirdagi mashina "Band" belgisi bilan ko'rsatiladi.

### 5.3 Mashina sahifasi `/cars/[slug]`
- Rasmlar galereyasi (oldi, orqa, yon).
- Xususiyatlar jadvali (yili, quti, yoqilg'i, o'rindiq).
- Narxlar: 1 kun, 3+ kun, 7+ kun, depozit.
- **Bron formasi** (6-bo'limga qarang).
- "Qo'ng'iroq qilish" va "Telegramda yozish" tugmalari.
- Pastda "Boshqa mashinalar".

### 5.4 Ijara shartlari `/terms`
`[?]` mijozdan so'ralishi kerak: minimal yosh, haydovchilik staji, kerakli hujjatlar (pasport, guvohnoma), depozit, kunlik km limiti, viloyatga chiqish ruxsati, yoqilg'i siyosati, jarimalar, haydovchi bilan ijara bormi.

### 5.5 Kontaktlar `/contacts`
Telefon, Telegram, Instagram, manzil va Google/Yandex xarita, ish vaqti (24/7).

### 5.6 Rahmat sahifasi / oyna
Bron yuborilgandan keyin: "So'rovingiz qabul qilindi, menejer 15 daqiqa ichida qo'ng'iroq qiladi" `[?]`.

## 6. Bron qilish jarayoni

Onlayn to'lov 1-versiyada **yo'q**. Bron bu so'rov, keyin menejer qo'ng'iroq qilib tasdiqlaydi.

1. Mijoz mashina sahifasida formani to'ldiradi:
   - Ism (majburiy)
   - Telefon `+998 __ ___ __ __` (majburiy, format tekshiriladi)
   - Olish sanasi va vaqti, qaytarish sanasi va vaqti (majburiy)
   - Olish joyi: ofisdan yoki manzilga yetkazib berish (manzil maydoni)
   - Izoh (ixtiyoriy)
2. Forma kunlar sonini va taxminiy narxni avtomatik hisoblaydi.
3. "Bron qilish" bosilganda so'rov bazaga yoziladi, holati **Yangi**.
4. Egasining Telegramiga darhol xabar boradi (Telegram bot orqali): mashina, sanalar, ism, telefon, summa.
5. Mijozga rahmat oynasi chiqadi.
6. Admin panelda holat o'zgartiriladi: **Yangi → Tasdiqlandi → Ijarada → Yakunlandi** yoki **Bekor qilindi**.
7. Bir xil mashina uchun tasdiqlangan bronlar ustma-ust tushsa, admin ogohlantiriladi. Mijozga band sanalarni ko'rsatish 2-versiyada.

**Spamdan himoya:** bitta telefondan 1 daqiqada 3 tadan ko'p so'rov qabul qilinmaydi, yashirin "honeypot" maydon.

## 7. Admin panel `/admin`

- **Kirish:** login va parol (bitta admin, parol muhit o'zgaruvchisida yoki bazada hash ko'rinishida).
- **Bosh sahifa:** bugungi yangi so'rovlar soni, ijaradagi mashinalar, oylik bronlar.
- **Bronlar:** ro'yxat (yangi birinchi), holat bo'yicha filtr, holatni o'zgartirish, mijozga qo'ng'iroq havolasi, admin izohi.
- **Mashinalar:** qo'shish, tahrirlash, o'chirish, rasm yuklash, narx, holat (bo'sh / ta'mirda), saytda ko'rsatish yoki yashirish, tartib.
- **Sozlamalar:** telefon, Telegram username, Instagram, manzil, Telegram bot chat ID.
- Admin panel faqat bitta tilda (o'zbek) bo'lishi yetarli.

## 8. Tillar

- **O'zbek (lotin)** asosiy, **rus** ikkinchi til.
- URL: `/uz/...` va `/ru/...`, til tanlovi eslab qolinadi.
- Mashina tavsiflari admin panelda ikkala tilda kiritiladi.
- `[?]` ingliz tili kerakmi (chet ellik mijozlar uchun)? Hozircha yo'q.

## 9. Texnologiyalar

| Qism | Tanlov | Nega |
|------|--------|------|
| Frontend + Backend | **Next.js 15** (App Router, TypeScript) | Bitta loyihada sayt, API va admin panel, Vercel'ga oson deploy |
| Dizayn | **Tailwind CSS** | Tez, mobilga moslashgan |
| Ma'lumotlar bazasi | **PostgreSQL** (Neon, bepul tarif) | Vercel bilan yaxshi ishlaydi |
| ORM | **Prisma** | Sxema va migratsiyalar oson |
| Rasmlar | **Vercel Blob** yoki Cloudinary | Admin paneldan rasm yuklash uchun |
| Tillar | **next-intl** | uz/ru tarjimalar |
| Bildirishnoma | **Telegram Bot API** | Egasiga yangi bron haqida xabar |
| Autentifikatsiya | Oddiy sessiya cookie + bcrypt parol | Bitta admin uchun yetarli |
| Hosting | **Vercel**, GitHub'dan avtomatik deploy | Ustoz talabi |
| Mobil ilova | **React Native (Expo)** | Shu API'dan foydalanadi, Play Store'ga chiqarish oson |

### API (sayt va mobil ilova uchun umumiy)

| Metod | Yo'l | Vazifa |
|-------|------|--------|
| GET | `/api/cars` | Mashinalar ro'yxati (filtrlar bilan) |
| GET | `/api/cars/:slug` | Bitta mashina |
| POST | `/api/bookings` | Bron so'rovi yaratish |
| GET/PATCH | `/api/admin/bookings` | Bronlarni ko'rish, holatini o'zgartirish (admin) |
| POST/PATCH/DELETE | `/api/admin/cars` | Mashinalarni boshqarish (admin) |

### Ma'lumotlar bazasi (asosiy jadvallar)

- **Car:** id, slug, brand, model, type, year, transmission, fuel, seats, pricePerDay, price3Days, price7Days, deposit, descriptionUz, descriptionRu, images[], status, isVisible, sortOrder
- **Booking:** id, carId, name, phone, startAt, endAt, pickupType, address, comment, totalPrice, status, adminNote, createdAt
- **Setting:** key, value (telefon, telegram, instagram, manzil)
- **Admin:** id, login, passwordHash

## 10. Mobil ilova (27-noyabrdan)

1-versiya saytdagi mijoz qismini takrorlaydi:
- Mashinalar ro'yxati va filtr
- Mashina sahifasi va bron formasi
- Qo'ng'iroq / Telegram / Instagram tugmalari
- uz/ru tillari
- Push-bildirishnomalar va shaxsiy kabinet 2-versiyada.

Play Console uchun kerak bo'ladi: ilova ikonkasi (512×512), skrinshotlar, maxfiylik siyosati sahifasi (saytda `/privacy`), Google Play dasturchi akkaunti `[?]` (kimning nomiga ochiladi).

## 11. SEO va texnik talablar

- Har bir sahifada sarlavha va tavsif (uz/ru), Open Graph rasm (Instagram/Telegramda chiroyli ko'rinishi uchun).
- `sitemap.xml`, `robots.txt`.
- Kalit so'zlar: "аренда авто Ташкент", "прокат машин Ташкент", "avto ijara Toshkent", "mashina ijarasi".
- Rasmlar WebP formatida, sahifa telefonda 3 soniyadan tez ochilishi kerak.
- Domen `[?]`: masalan `blackrentcar.uz`. Boshida Vercel bergan bepul manzil ishlatiladi.

## 12. Muddatlar (ustoz rejasi bo'yicha)

| Sana | Natija |
|------|--------|
| **22-noyabr** | Dizayn va TZ tayyor |
| **23-noyabr** | Sayt tayyor + backend ulangan (bron, admin panel, Telegram bot) |
| **25-noyabr** | Vercel'ga GitHub orqali deploy |
| **27-noyabr** | Mobil ilovani boshlash |
| **30-noyabr** | Play Console'ga joylashni boshlash |
| **14-dekabr** | Ilova Play Store'da chiqqan bo'lishi kerak |

## 13. 1-versiyaga kirmaydi

Onlayn to'lov (Payme/Click), mijoz shaxsiy kabineti, SMS tasdiqlash, kalendarda band kunlarni ko'rsatish, haydovchi bilan ijara, sharhlar. Bular 2-versiyada ko'rib chiqiladi.

## 14. Mijozdan so'ralishi kerak

1. Har bir mashinaning kunlik narxi, 3+ va 7+ kunlik chegirmalar, depozit.
2. Mashinalar yili, quti turi, yoqilg'i turi.
3. Ijara shartlari: yosh, staj, hujjatlar, km limiti, viloyatga chiqish.
4. Yetkazib berish pullikmi, qancha?
5. Telegram username (mijozlar yozishi uchun) va bildirishnomalar boradigan Telegram akkaunt.
6. Ofis manzili (xarita uchun).
7. Logoning toza fayli (PNG yoki SVG).
8. Domen kerakmi, kim to'laydi?
