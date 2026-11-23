import type { Locale } from "@/lib/i18n";

// Maxfiylik siyosati matni (sayt va Android ilova uchun bitta). O'zgarsa, `updated` sanasini ham yangilang.
type Section = { title: string; text?: string; list?: string[] };
type Privacy = { title: string; updated: string; lead: string; sections: Section[] };

const uz: Privacy = {
  title: "Maxfiylik siyosati",
  updated: "Oxirgi yangilanish: 2026-yil 23-noyabr",
  lead:
    "Ushbu siyosat Black Rent Car (Toshkent) sayti va \"Black Rent Car\" Android ilovasi orqali qanday ma'lumotlar yig'ilishi, nima uchun ishlatilishi va qanday himoyalanishini tushuntiradi. Sayt yoki ilovadan foydalanib, siz shu siyosatga rozilik bildirasiz.",
  sections: [
    {
      title: "1. Qanday ma'lumotlarni yig'amiz",
      text: "Faqat siz bron so'rovi formasini to'ldirganingizda o'zingiz kiritgan ma'lumotlarni olamiz:",
      list: [
        "ism va familiya;",
        "telefon raqami;",
        "tanlangan avtomobil, olish va qaytarish sanasi hamda vaqti;",
        "mashinani olish usuli va yetkazib berish manzili (agar yetkazishni tanlasangiz);",
        "izoh (ixtiyoriy) va sayt/ilova tili.",
      ],
    },
    {
      title: "2. Nimalarni yig'maymiz",
      list: [
        "Ro'yxatdan o'tish yoki akkaunt yo'q, parol so'ramaymiz.",
        "Joylashuv (GPS), kamera, kontaktlar, fayllar va boshqa qurilma ruxsatlarini so'ramaymiz.",
        "Pasport va haydovchilik guvohnomasi ma'lumotlari sayt yoki ilova orqali olinmaydi: ular faqat shartnoma imzolanayotganda joyida ko'rsatiladi.",
        "To'lov kartasi ma'lumotlari yig'ilmaydi: ilova orqali to'lov qilinmaydi.",
        "Reklama identifikatorlari, reklama yoki kuzatuv (tracking) xizmatlari ishlatilmaydi.",
      ],
    },
    {
      title: "3. Ma'lumotlardan qanday foydalanamiz",
      text: "Ma'lumotlaringiz faqat bron so'rovingizni ko'rib chiqish, siz bilan telefon orqali bog'lanib bronni tasdiqlash va ijara xizmatini ko'rsatish uchun ishlatiladi. Biz ularni sotmaymiz, ijaraga bermaymiz va reklama maqsadida boshqalarga bermaymiz.",
    },
    {
      title: "4. Ma'lumotlar qayerda saqlanadi va kimga uzatiladi",
      list: [
        "Bron so'rovi himoyalangan (HTTPS) ulanish orqali yuboriladi va xizmat ko'rsatuvchi bulut serverlaridagi ma'lumotlar bazasida saqlanadi.",
        "So'rov haqidagi xabar kompaniya menejeriga Telegram bot orqali yuboriladi, shunda u sizga tezda qo'ng'iroq qila oladi.",
        "Ma'lumotlarga faqat Black Rent Car xodimlari parol bilan himoyalangan boshqaruv paneli orqali kira oladi.",
        "Qonunda belgilangan hollarda vakolatli davlat organlariga taqdim etilishi mumkin.",
      ],
    },
    {
      title: "5. Qurilmangizda saqlanadigan ma'lumotlar",
      text: "Sayt tanlangan tilni eslab qolish uchun bitta \"lang\" cookie faylidan foydalanadi. Ilova esa tanlangan til va avtomobillar ro'yxatini internet bo'lmaganda ko'rsatish uchun qurilmangizda saqlaydi. Bu ma'lumotlar bizga yuborilmaydi va ilovani o'chirsangiz o'chib ketadi.",
    },
    {
      title: "6. Saqlash muddati",
      text: "Bron ma'lumotlari ijara xizmatini ko'rsatish va hisob yuritish uchun zarur bo'lgan muddatgacha saqlanadi. Siz istalgan vaqtda ularni o'chirishni so'rashingiz mumkin.",
    },
    {
      title: "7. Sizning huquqlaringiz",
      text: "O'zbekiston Respublikasining \"Shaxsga doir ma'lumotlar to'g'risida\"gi Qonuniga muvofiq, siz o'zingiz haqingizdagi ma'lumotlarni bilish, tuzatish yoki o'chirishni talab qilish huquqiga egasiz. Buning uchun quyidagi aloqa kanallari orqali murojaat qiling: so'rovingiz 30 kun ichida bajariladi.",
    },
    {
      title: "8. Bolalar",
      text: "Xizmatimiz haydovchilik guvohnomasiga ega bo'lgan voyaga yetgan shaxslar uchun mo'ljallangan. Biz 18 yoshga to'lmaganlardan ataylab ma'lumot yig'maymiz.",
    },
    {
      title: "9. Siyosatdagi o'zgarishlar",
      text: "Siyosat o'zgarsa, yangi matn shu sahifada e'lon qilinadi va yuqoridagi sana yangilanadi.",
    },
  ],
};

const ru: Privacy = {
  title: "Политика конфиденциальности",
  updated: "Последнее обновление: 23 ноября 2026 г.",
  lead:
    "Эта политика объясняет, какие данные Black Rent Car (Ташкент) получает через сайт и Android-приложение «Black Rent Car», зачем они нужны и как защищены. Пользуясь сайтом или приложением, вы соглашаетесь с этой политикой.",
  sections: [
    {
      title: "1. Какие данные мы получаем",
      text: "Только те данные, которые вы сами вводите в форме бронирования:",
      list: [
        "имя и фамилия;",
        "номер телефона;",
        "выбранный автомобиль, дата и время получения и возврата;",
        "способ получения и адрес доставки (если вы выбрали доставку);",
        "комментарий (необязательно) и язык сайта/приложения.",
      ],
    },
    {
      title: "2. Что мы не собираем",
      list: [
        "Нет регистрации и аккаунтов, мы не запрашиваем пароли.",
        "Мы не запрашиваем доступ к геолокации, камере, контактам, файлам и другим разрешениям устройства.",
        "Данные паспорта и водительского удостоверения не передаются через сайт или приложение: их показывают только при подписании договора.",
        "Данные банковских карт не собираются: оплата в приложении не производится.",
        "Рекламные идентификаторы, реклама и сервисы отслеживания не используются.",
      ],
    },
    {
      title: "3. Как мы используем данные",
      text: "Данные используются только для обработки вашей заявки, звонка для подтверждения бронирования и оказания услуги аренды. Мы не продаём их, не сдаём в аренду и не передаём третьим лицам для рекламы.",
    },
    {
      title: "4. Где хранятся данные и кому передаются",
      list: [
        "Заявка отправляется по защищённому соединению (HTTPS) и хранится в базе данных на облачных серверах хостинг-провайдера.",
        "Уведомление о заявке отправляется менеджеру компании через Telegram-бот, чтобы он мог быстро вам перезвонить.",
        "Доступ к данным есть только у сотрудников Black Rent Car через защищённую паролем панель управления.",
        "В случаях, предусмотренных законом, данные могут быть переданы уполномоченным государственным органам.",
      ],
    },
    {
      title: "5. Данные на вашем устройстве",
      text: "Сайт использует один cookie-файл «lang», чтобы запомнить выбранный язык. Приложение хранит на устройстве выбранный язык и список автомобилей, чтобы показывать его без интернета. Эти данные нам не отправляются и удаляются вместе с приложением.",
    },
    {
      title: "6. Срок хранения",
      text: "Данные бронирования хранятся столько, сколько нужно для оказания услуги и учёта. Вы можете в любой момент попросить их удалить.",
    },
    {
      title: "7. Ваши права",
      text: "В соответствии с Законом Республики Узбекистан «О персональных данных» вы вправе узнать, исправить или потребовать удалить свои данные. Для этого свяжитесь с нами по контактам ниже: запрос выполняется в течение 30 дней.",
    },
    {
      title: "8. Дети",
      text: "Сервис предназначен для совершеннолетних с водительским удостоверением. Мы сознательно не собираем данные лиц младше 18 лет.",
    },
    {
      title: "9. Изменения политики",
      text: "При изменении политики новый текст публикуется на этой странице, а дата выше обновляется.",
    },
  ],
};

export const privacy: Record<Locale, Privacy> = { uz, ru };
