# Black Rent Car: Android ilova (Expo)

Saytdagi API'dan foydalanadigan mobil ilova: https://black-rent-car.vercel.app

## Ekranlar
- **Bosh sahifa**: hero, afzalliklar, avtopark (gorizontal), "Qanday ishlaydi"
- **Avtomobillar**: katalog, kuzov turi bo'yicha filtr, narx bo'yicha saralash (narxlar kiritilgach chiqadi)
- **Mashina sahifasi**: rasmlar galereyasi, tariflar, xususiyatlar, "Bron qilish" va qo'ng'iroq tugmalari
- **Bron formasi**: ism, telefon (+998), olish/qaytarish sanasi va soati, ofis yoki yetkazish, izoh, taxminiy summa
- **Bron qabul qilindi**: buyurtma raqami (BR-XXXXXX) va kvitansiya
- **Aloqa**: telefon, Instagram, sayt, ish tartibi, ijara shartlari
- O'zbek / rus tili (tanlov eslab qolinadi)

## Qanday ishlaydi
- Mashinalar `GET /api/cars` dan olinadi va telefonda saqlanadi. Internet bo'lmasa, oxirgi ro'yxat (yoki ilovadagi zaxira ro'yxat) ko'rsatiladi.
- Bron `POST /api/bookings` ga yuboriladi: sayt bilan bir xil bazaga tushadi, admin panelda va Telegramda ko'rinadi.
- Mashina rasmlari ilova ichida ham bor (`assets/cars`), shuning uchun tez ochiladi. Admin yangi rasm yuklasa, u saytdan olinadi.
- Narx `null` bo'lsa "Narx so'raladi" / "Aniqlanmoqda" chiqadi (sayt kabi).

## Ishga tushirish
```bash
cd mobile
npm install
npx expo start          # telefonda Expo Go orqali QR kodni skanerlang
npx expo start --web    # brauzerda ko'rish
```

## Play Market uchun build (EAS)
```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview      # sinov uchun .apk
npx eas-cli@latest build -p android --profile production   # Play Console uchun .aab
```

## Taxminlar `[?]`
- Android paket nomi: `uz.blackrentcar.app` (Play Console'ga yuklangandan keyin o'zgartirib bo'lmaydi)
- Ilova ikonkasi postdagi 320px logodan kattalashtirilgan: toza PNG/SVG logo kerak
- Telegram username, ofis manzili, narxlar va shartlar hali mijozdan olinmagan
