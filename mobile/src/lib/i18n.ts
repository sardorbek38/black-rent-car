// Matnlar saytdagi src/lib/i18n.ts dan olingan (mobil ilovaga keraklilari).
export type Locale = "uz" | "ru";

const uz = {
  tabs: { home: "Bosh sahifa", cars: "Avtomobillar", contacts: "Aloqa" },
  common: {
    perDay: "so'm / kun", sum: "so'm", priceOnRequest: "Narx so'raladi", tbd: "Aniqlanmoqda",
    details: "Batafsil", book: "Bron qilish", call: "Qo'ng'iroq qilish", all: "Barchasi",
    seats: "o'rin", automatic: "Avtomat", manual: "Mexanika", busy: "Band", back: "Orqaga",
    offline: "Internet yo'q: oxirgi saqlangan ro'yxat ko'rsatilmoqda", retry: "Qayta urinish",
  },
  carClass: { ECONOM: "Ekonom", COMFORT: "Komfort", BUSINESS: "Biznes", PREMIUM: "Premium" },
  bodyType: { SEDAN: "Sedan", CROSSOVER: "Krossover", SUV: "SUV" },
  fuel: { PETROL: "Benzin", HYBRID: "Gibrid", ELECTRIC: "Elektr", RANGE_EXTENDER: "Gibrid (EREV)" },
  home: {
    badge: "Toshkentda avtomobil ijarasi",
    titleA: "Sizning qulayligingiz uchun",
    titleB: "premium avtomobillar",
    lead: "Hujjatlar 5 daqiqada. Mashinani Toshkent bo'ylab istalgan nuqtaga yetkazib beramiz.",
    choose: "Mashina tanlash",
    why: [
      { icon: "timer", title: "5 daqiqada rasmiylashtirish", text: "Pasport va haydovchilik guvohnomasi bilan." },
      { icon: "location-on", title: "Toshkent bo'ylab yetkazish", text: "Uyingiz, ofisingiz yoki aeroportga." },
      { icon: "support-agent", title: "24/7 aloqada", text: "Istalgan vaqtda qo'ng'iroq qiling." },
    ],
    fleetKicker: "Avtopark",
    fleetTitle: "Bizning avtomobillar",
    allCars: "Barchasi",
    howTitle: "Qanday ishlaydi?",
    how: [
      { title: "Avtomobilni tanlang", text: "Katalogdan mashina va ijara muddatini belgilang." },
      { title: "Bron so'rovini yuboring", text: "Menejer qo'ng'iroq qilib tasdiqlaydi." },
      { title: "Mashinani qabul qiling", text: "Shartnomani imzolang va mashinani manzilda oling." },
    ],
  },
  cars: {
    title: "Avtomobillar", count: "ta avtomobil", sortCheap: "Arzonroq", sortExpensive: "Qimmatroq",
    empty: "Bu filtr bo'yicha mashina topilmadi.", rentPrice: "Ijara narxi",
  },
  car: {
    specs: "Texnik ko'rsatkichlar", year: "Yili", gearbox: "Uzatmalar qutisi", fuel: "Yoqilg'i",
    seats: "O'rindiqlar", body: "Kuzov", class: "Toifa", pricing: "Ijara muddati bo'yicha tariflar",
    days1: "1 - 2 kun", days3: "3 - 6 kun", days7: "7+ kun", deposit: "Qaytariladigan depozit",
    pricesNote: "Narxlar tez orada qo'shiladi. Hozir narxni telefon yoki Instagram orqali bilib olishingiz mumkin.",
    about: "Avtomobil haqida",
    similar: "Boshqa avtomobillar",
  },
  form: {
    title: "Bron qilish", name: "Ism va familiya", namePh: "Ismingiz", phone: "Telefon raqam",
    start: "Olish sanasi", end: "Qaytarish sanasi", time: "Vaqti", pickup: "Olish joyi",
    office: "Ofisdan olaman", delivery: "Manzilga yetkazish", address: "Yetkazish manzili",
    addressPh: "Toshkent sh., ko'cha, uy", comment: "Izoh", commentPh: "Masalan: bolalar o'rindig'i kerak",
    optional: "Ixtiyoriy", days: "Ijara muddati", dayUnit: "kun", total: "Taxminiy summa",
    totalTbd: "Menejer aytadi", submit: "Bronni yuborish", sending: "Yuborilmoqda...",
    note: "Menejer tez orada qo'ng'iroq qiladi va buyurtmani tasdiqlaydi. Oldindan to'lov kerak emas.",
    today: "Bugun", tomorrow: "Ertaga",
    errors: {
      name: "Ismingizni kiriting",
      phone: "Telefon raqamni to'liq kiriting: +998 XX XXX XX XX",
      dates: "Qaytarish sanasi olish sanasidan keyin bo'lishi kerak",
      past: "Olish sanasi o'tib ketgan",
      address: "Yetkazish manzilini kiriting",
      rate: "Juda ko'p so'rov. Bir daqiqadan keyin qayta urinib ko'ring",
      server: "Xatolik yuz berdi. Iltimos, qo'ng'iroq qiling",
      network: "Internet bilan aloqa yo'q. Tekshirib, qayta urinib ko'ring",
    },
  },
  done: {
    title: "Bron qabul qilindi!",
    lead: "So'rovingiz ro'yxatdan o'tdi. Menejerimiz tez orada siz bilan bog'lanadi.",
    id: "Buyurtma raqami", pending: "Tasdiqlash kutilmoqda", car: "Avtomobil", period: "Muddati",
    place: "Olish joyi", client: "Mijoz", total: "Taxminiy summa", home: "Bosh sahifaga qaytish",
  },
  contacts: {
    title: "Aloqa", lead: "Biz 24/7 aloqadamiz", phone: "Telefon raqam", instagram: "Rasmiy Instagram",
    website: "Veb-sayt", hours: "Ish tartibi", hoursText: "Dushanba - Yakshanba, 24/7", language: "Til",
    termsTitle: "Ijara shartlari",
    terms: [
      { icon: "badge", title: "Kerakli hujjatlar", text: "Pasport (ID karta) va haydovchilik guvohnomasi." },
      { icon: "person", title: "Yosh va staj", text: "Aniqlanmoqda" },
      { icon: "account-balance-wallet", title: "Depozit", text: "Aniqlanmoqda" },
      { icon: "local-shipping", title: "Yetkazib berish", text: "Toshkent bo'ylab. Narxi aniqlanmoqda." },
    ],
  },
};

export type Dict = typeof uz;

const ru: Dict = {
  tabs: { home: "Главная", cars: "Автомобили", contacts: "Контакты" },
  common: {
    perDay: "сум / сутки", sum: "сум", priceOnRequest: "Цена по запросу", tbd: "Уточняется",
    details: "Подробнее", book: "Забронировать", call: "Позвонить", all: "Все",
    seats: "мест", automatic: "Автомат", manual: "Механика", busy: "Занят", back: "Назад",
    offline: "Нет интернета: показан последний сохранённый список", retry: "Повторить",
  },
  carClass: { ECONOM: "Эконом", COMFORT: "Комфорт", BUSINESS: "Бизнес", PREMIUM: "Премиум" },
  bodyType: { SEDAN: "Седан", CROSSOVER: "Кроссовер", SUV: "SUV" },
  fuel: { PETROL: "Бензин", HYBRID: "Гибрид", ELECTRIC: "Электро", RANGE_EXTENDER: "Гибрид (EREV)" },
  home: {
    badge: "Аренда авто в Ташкенте",
    titleA: "Премиальные автомобили",
    titleB: "для вашего комфорта",
    lead: "Оформление за 5 минут. Подача авто в любую точку Ташкента.",
    choose: "Выбрать авто",
    why: [
      { icon: "timer", title: "Оформление за 5 минут", text: "Только паспорт и водительское удостоверение." },
      { icon: "location-on", title: "Подача по Ташкенту", text: "К дому, офису или в аэропорт." },
      { icon: "support-agent", title: "На связи 24/7", text: "Звоните в любое время." },
    ],
    fleetKicker: "Автопарк",
    fleetTitle: "Наши автомобили",
    allCars: "Все",
    howTitle: "Как это работает?",
    how: [
      { title: "Выберите автомобиль", text: "Выберите машину и срок аренды в каталоге." },
      { title: "Отправьте заявку", text: "Менеджер перезвонит и подтвердит бронь." },
      { title: "Получите автомобиль", text: "Подпишите договор и получите машину по адресу." },
    ],
  },
  cars: {
    title: "Автомобили", count: "автомобилей", sortCheap: "Дешевле", sortExpensive: "Дороже",
    empty: "По этому фильтру автомобилей не найдено.", rentPrice: "Стоимость аренды",
  },
  car: {
    specs: "Характеристики", year: "Год", gearbox: "Коробка передач", fuel: "Топливо",
    seats: "Мест", body: "Кузов", class: "Класс", pricing: "Тарифы по сроку аренды",
    days1: "1 - 2 дня", days3: "3 - 6 дней", days7: "7+ дней", deposit: "Возвратный депозит",
    pricesNote: "Цены скоро появятся. Сейчас стоимость можно узнать по телефону или в Instagram.",
    about: "Об автомобиле",
    similar: "Другие автомобили",
  },
  form: {
    title: "Бронирование", name: "Имя и фамилия", namePh: "Ваше имя", phone: "Номер телефона",
    start: "Дата получения", end: "Дата возврата", time: "Время", pickup: "Место получения",
    office: "Заберу из офиса", delivery: "Доставка по адресу", address: "Адрес доставки",
    addressPh: "г. Ташкент, улица, дом", comment: "Комментарий", commentPh: "Например: нужно детское кресло",
    optional: "Необязательно", days: "Срок аренды", dayUnit: "сут.", total: "Примерная сумма",
    totalTbd: "Уточнит менеджер", submit: "Отправить заявку", sending: "Отправка...",
    note: "Менеджер скоро перезвонит и подтвердит заказ. Предоплата не нужна.",
    today: "Сегодня", tomorrow: "Завтра",
    errors: {
      name: "Введите ваше имя",
      phone: "Введите номер полностью: +998 XX XXX XX XX",
      dates: "Дата возврата должна быть позже даты получения",
      past: "Дата получения уже прошла",
      address: "Введите адрес доставки",
      rate: "Слишком много заявок. Попробуйте через минуту",
      server: "Произошла ошибка. Пожалуйста, позвоните нам",
      network: "Нет связи с интернетом. Проверьте и попробуйте снова",
    },
  },
  done: {
    title: "Заявка принята!",
    lead: "Ваша заявка зарегистрирована. Наш менеджер скоро свяжется с вами.",
    id: "Номер заказа", pending: "Ожидает подтверждения", car: "Автомобиль", period: "Срок",
    place: "Место получения", client: "Клиент", total: "Примерная сумма", home: "Вернуться на главную",
  },
  contacts: {
    title: "Контакты", lead: "Мы на связи 24/7", phone: "Телефон", instagram: "Официальный Instagram",
    website: "Веб-сайт", hours: "Режим работы", hoursText: "Понедельник - Воскресенье, 24/7", language: "Язык",
    termsTitle: "Условия аренды",
    terms: [
      { icon: "badge", title: "Документы", text: "Паспорт (ID-карта) и водительское удостоверение." },
      { icon: "person", title: "Возраст и стаж", text: "Уточняется" },
      { icon: "account-balance-wallet", title: "Депозит", text: "Уточняется" },
      { icon: "local-shipping", title: "Доставка", text: "По Ташкенту. Стоимость уточняется." },
    ],
  },
};

export const dicts: Record<Locale, Dict> = { uz, ru };
