import { newProjectTranslations } from "./new-project-translations";

export type Locale = "ro" | "ru" | "en";

export const locales: Locale[] = ["ro", "ru", "en"];

export const contactCopy = {
  ro: {
    systemOnline: "SISTEM ONLINE", back: "Înapoi la proiecte", initialize: "/ INIȚIALIZARE CONTACT",
    hero: ["HAI SĂ", "CONSTRUIM", "CEVA", "RAR."], compiled: "compilat cu succes",
    connectionDetails: "/ DATE DE CONTACT", phone: "TELEFON", email: "ADRESA_PRINCIPALĂ", location: "LOCAȚIE",
    responseTime: "TIMP_DE_RĂSPUNS", response: "maximum 12 ore", available: "DISPONIBILI",
    availability: "Acceptăm proiecte noi pentru", newRequest: "/ CERERE_PROIECT_NOU", brief: ["Trimite-ne", "mesaj"],
    accepted: "CERERE ACCEPTATĂ", emailReady: "Clientul tău de email este pregătit.",
    emailFallback: "Dacă nu s-a deschis automat, scrie-ne direct la monodev@gmail.com.", another: "Creează altă cerere",
    namePlaceholder: "Cum te numești?", emailPlaceholder: "tu@companie.md", selectType: "Selectează tipul",
    projectTypes: ["Website de prezentare", "Magazin online", "Platformă / aplicație", "Personalizarea unui proiect existent", "Alt proiect digital"],
    selectBudget: "Selectează bugetul", messagePlaceholder: "Descrie ideea, obiectivul și ce ai vrea să lansăm...",
    submit: "TRIMITE CEREREA", copyEmail: "Copiază adresa de email", copiedEmail: "Adresa de email a fost copiată",
    mailSubject: "Brief de proiect", mailName: "Nume", mailEmail: "Email", mailProject: "Tipul proiectului", mailBudget: "Buget",
    footer: "DESIGN → COD → LANSARE",
  },
  ru: {
    systemOnline: "СИСТЕМА ОНЛАЙН", back: "Назад к проектам", initialize: "/ НАЧАТЬ ДИАЛОГ",
    hero: ["ДАВАЙТЕ", "СОЗДАДИМ", "НЕЧТО", "ОСОБЕННОЕ."], compiled: "успешно скомпилировано",
    connectionDetails: "/ КОНТАКТНЫЕ ДАННЫЕ", phone: "ТЕЛЕФОН", email: "ОСНОВНОЙ_АДРЕС", location: "МЕСТОПОЛОЖЕНИЕ",
    responseTime: "ВРЕМЯ_ОТВЕТА", response: "не более 12 часов", available: "ДОСТУПНЫ",
    availability: "Принимаем новые проекты на", newRequest: "/ ЗАЯВКА_НА_ПРОЕКТ", brief: ["Отправьте нам", "бриф."],
    accepted: "ЗАЯВКА ПРИНЯТА", emailReady: "Ваш почтовый клиент готов.",
    emailFallback: "Если он не открылся автоматически, напишите нам на monodev@gmail.com.", another: "Создать новую заявку",
    namePlaceholder: "Как вас зовут?", emailPlaceholder: "you@company.md", selectType: "Выберите тип проекта",
    projectTypes: ["Презентационный сайт", "Интернет-магазин", "Платформа / приложение", "Адаптация существующего проекта", "Другой цифровой проект"],
    selectBudget: "Выберите бюджет", messagePlaceholder: "Опишите идею, цель и то, что вы хотели бы запустить...",
    submit: "ОТПРАВИТЬ ЗАЯВКУ", copyEmail: "Скопировать адрес электронной почты", copiedEmail: "Адрес электронной почты скопирован",
    mailSubject: "Бриф проекта", mailName: "Имя", mailEmail: "Email", mailProject: "Тип проекта", mailBudget: "Бюджет",
    footer: "ДИЗАЙН → КОД → ЗАПУСК",
  },
  en: {
    systemOnline: "SYSTEM ONLINE", back: "Back to projects", initialize: "/ INITIALIZE CONTACT",
    hero: ["LET'S", "BUILD", "SOMETHING", "RARE."], compiled: "compiled successfully",
    connectionDetails: "/ CONNECTION DETAILS", phone: "PHONE", email: "PRIMARY_ENDPOINT", location: "LOCATION",
    responseTime: "RESPONSE_TIME", response: "within 12 hours", available: "AVAILABLE",
    availability: "Accepting new projects for", newRequest: "/ NEW_PROJECT.REQUEST", brief: ["Send us", "your brief."],
    accepted: "REQUEST ACCEPTED", emailReady: "Your email client is ready.",
    emailFallback: "If it did not open automatically, email us directly at monodev@gmail.com.", another: "Create another request",
    namePlaceholder: "What's your name?", emailPlaceholder: "you@company.com", selectType: "Select project type",
    projectTypes: ["Presentation website", "Online store", "Platform / application", "Customize an existing project", "Another digital project"],
    selectBudget: "Select budget", messagePlaceholder: "Describe the idea, the objective and what you would like us to launch...",
    submit: "RUN REQUEST", copyEmail: "Copy email address", copiedEmail: "Email address copied",
    mailSubject: "Project brief", mailName: "Name", mailEmail: "Email", mailProject: "Project type", mailBudget: "Budget",
    footer: "DESIGN → CODE → LAUNCH",
  },
} as const;

export const copy = {
  ro: {
    nav: ["Proiecte", "Proces", "Contact"], questions: "Întrebări", buyProject: "Proiect personalizat", openMenu: "Deschide meniul", language: "Limbă",
    eyebrow: "PROIECTE DIGITALE. GATA DE LANSARE.", heroA: "IDEI MARI", heroB: "DEJA CONSTRUITE",
    heroText: "Site-uri și produse digitale premium, construite cu grijă și pregătite să devină următoarea ta afacere.", viewProjects: "Vezi proiectele",
    marquee: ["DESIGN CARE VINDE", "COD CURAT", "LIVRARE RAPIDĂ"], catalog: "/ CATALOG 2026", chooseA: "ALEGE URMĂTORUL", chooseB: "TĂU", chooseC: "PROIECT.",
    projectsAvailable: ["PROIECTE", "DISPONIBILE"], all: "Toate", viewDetails: "Vezi detalii", from: "DE LA",
    processKicker: "/ CUM FUNCȚIONEAZĂ", processA: "DE LA CLICK", processB: "LA", processC: "LAUNCH.",
    steps: [["Alegi proiectul", "Selectezi din catalog soluția potrivită pentru afacerea ta."], ["Îl personalizăm", "Adaptăm designul, textele și funcțiile pentru brandul tău."], ["Îl lansăm", "Primești proiectul configurat, verificat și gata de publicare."]],
    whyKicker: "/ DE CE MONO/DEV", whyA: "NU VINDEM", whyB: "DOAR", whyC: "PIXELI.", whyText: "Fiecare proiect este construit să arate impecabil, să se miște rapid și, cel mai important, să transforme vizitatorii în clienți.", talk: "Hai să vorbim",
    metrics: [["COD CURAT", "ȘI EDITABIL"], ["PÂNĂ LA", "PREDARE"], ["ZILE SUPORT", "INCLUS"]], found: "AI GĂSIT CE CĂUTAI?", start: "SĂ ÎNCEPEM",
    close: "Închide detaliile", fullLicense: "LICENȚĂ COMPLETĂ", fullPrice: "PREȚ COMPLET", requestDemo: "Solicită acces demo", openProject: "Deschide proiectul", buyFor: "Cumpără pentru", interested: "Interesat de", demoSubject: "Solicit acces demo pentru", rentalLabel: "CHIRIE LUNARĂ", rentalFrom: "de la", perMonth: "/lunar", rentalIncludes: ["Chirie fixă pentru 18 luni", "Lansare și găzduire incluse", "Mentenanță tehnică lunară", "Poți cumpăra ulterior"], rentFor: "Închiriază de la",
    footer: { label: "MONO/DEV — PRODUSE DIGITALE", title: "Ai găsit proiectul potrivit?", text: "Îți explicăm ce include, cum îl personalizăm și care sunt pașii până la lansare.", contact: "Discută proiectul", navigation: "Navigare", projects: "Proiecte", process: "Proces", contactPage: "Contact", email: "Email", availability: "Disponibil pentru proiecte noi", legal: "Website-uri și produse digitale gata de lansare." },
  },
  ru: {
    nav: ["Проекты", "Процесс", "Контакты"], questions: "Вопросы", buyProject: "Купить проект", openMenu: "Открыть меню", language: "Язык",
    eyebrow: "ЦИФРОВЫЕ ПРОЕКТЫ. ГОТОВЫ К ЗАПУСКУ.", heroA: "БОЛЬШИЕ ИДЕИ.", heroB: "УЖЕ СОЗДАНЫ.",
    heroText: "Премиальные сайты и цифровые продукты, готовые стать вашим следующим бизнесом.", viewProjects: "Смотреть проекты",
    marquee: ["ДИЗАЙН, КОТОРЫЙ ПРОДАЁТ", "ЧИСТЫЙ КОД", "БЫСТРАЯ ЗАПУСК"], catalog: "/ КАТАЛОГ 2026", chooseA: "ВЫБЕРИТЕ СВОЙ", chooseB: "СЛЕДУЮЩИЙ", chooseC: "ПРОЕКТ.",
    projectsAvailable: ["ПРОЕКТОВ", "ДОСТУПНО"], all: "Все", viewDetails: "Подробнее", from: "ОТ",
    processKicker: "/ КАК ЭТО РАБОТАЕТ", processA: "ОТ КЛИКА", processB: "ДО", processC: "ЗАПУСКА.",
    steps: [["ВЫБИРАЕТЕ", "Изучаете каталог и находите проект для своей идеи."], ["НАСТРАИВАЕМ", "Адаптируем бренд, цвета и контент под ваш бизнес."], ["ЗАПУСКАЕМ", "Вы получаете готовый, настроенный проект."]],
    whyKicker: "/ ПОЧЕМУ MONO/DEV", whyA: "МЫ ПРОДАЁМ", whyB: "НЕ ТОЛЬКО", whyC: "ПИКСЕЛИ.", whyText: "Каждый проект безупречно выглядит, быстро работает и превращает посетителей в клиентов.", talk: "Обсудим",
    metrics: [["ЧИСТЫЙ КОД", "И РЕДАКТИРУЕМЫЙ"], ["ДО", "ПЕРЕДАЧИ"], ["ДНЕЙ ПОДДЕРЖКИ", "ВКЛЮЧЕНО"]], found: "НАШЛИ ТО, ЧТО ИСКАЛИ?", start: "НАЧНЁМ",
    close: "Закрыть", fullLicense: "ПОЛНАЯ ЛИЦЕНЗИЯ", fullPrice: "ПОЛНАЯ ЦЕНА", requestDemo: "Запросить демо", openProject: "Открыть проект", buyFor: "Купить за", interested: "Интересует", demoSubject: "Запрос демо для", rentalLabel: "ЕЖЕМЕСЯЧНАЯ АРЕНДА", rentalFrom: "от", perMonth: "/ месяц", rentalIncludes: ["Фиксированная аренда на 18 месяцев", "Запуск и хостинг включены", "Ежемесячная техподдержка", "Можно выкупить позже"], rentFor: "Арендовать от",
    footer: { label: "MONO/DEV — ЦИФРОВЫЕ ПРОДУКТЫ", title: "Нашли подходящий проект?", text: "Расскажем, что входит в проект, как проходит настройка и какие шаги ведут к запуску.", contact: "Обсудить проект", navigation: "Навигация", projects: "Проекты", process: "Процесс", contactPage: "Контакты", email: "Email", availability: "Доступны для новых проектов", legal: "Сайты и цифровые продукты, готовые к запуску." },
  },
  en: {
    nav: ["Projects", "Process", "Contact"], questions: "Questions", buyProject: "Buy a project", openMenu: "Open menu", language: "Language",
    eyebrow: "DIGITAL PROJECTS. READY TO LAUNCH.", heroA: "BIG IDEAS.", heroB: "ALREADY BUILT.",
    heroText: "Premium websites and digital products, carefully built and ready to become your next business.", viewProjects: "View projects",
    marquee: ["DESIGN THAT SELLS", "CLEAN CODE", "FAST DELIVERY"], catalog: "/ 2026 CATALOG", chooseA: "CHOOSE YOUR", chooseB: "NEXT", chooseC: "PROJECT.",
    projectsAvailable: ["PROJECTS", "AVAILABLE"], all: "All", viewDetails: "View details", from: "FROM",
    processKicker: "/ HOW IT WORKS", processA: "FROM CLICK", processB: "TO", processC: "LAUNCH.",
    steps: [["CHOOSE", "Explore the catalog and find the right project for your idea."], ["CUSTOMIZE", "We adapt the brand, colors and content to your business."], ["LAUNCH", "Receive a complete, configured project ready to perform."]],
    whyKicker: "/ WHY MONO/DEV", whyA: "WE DON'T SELL", whyB: "JUST", whyC: "PIXELS.", whyText: "Every project is built to look impeccable, move fast and, most importantly, turn visitors into customers.", talk: "Let's talk",
    metrics: [["CLEAN CODE", "AND EDITABLE"], ["UNTIL", "DELIVERY"], ["DAYS SUPPORT", "INCLUDED"]], found: "FOUND WHAT YOU NEEDED?", start: "LET'S START",
    close: "Close details", fullLicense: "FULL LICENSE", fullPrice: "FULL PRICE", requestDemo: "Request demo access", openProject: "Open project", buyFor: "Buy for", interested: "Interested in", demoSubject: "Demo access request for", rentalLabel: "MONTHLY RENTAL", rentalFrom: "from", perMonth: "/ month", rentalIncludes: ["Fixed rental for 18 months", "Launch and hosting included", "Monthly technical care", "Option to buy later"], rentFor: "Rent from",
    footer: { label: "MONO/DEV — DIGITAL PRODUCTS", title: "Found the right project?", text: "We’ll explain what is included, how customization works and every step leading to launch.", contact: "Discuss your project", navigation: "Navigation", projects: "Projects", process: "Process", contactPage: "Contact", email: "Email", availability: "Available for new projects", legal: "Launch-ready websites and digital products." },
  },
} as const;

const typeMap: Record<string, [string, string]> = {
  "Gardens & Landscaping": ["Сады и ландшафтный дизайн", "Gardens & Landscaping"],
  "Real Estate": ["Недвижимость", "Real Estate"],
  "Clinics & Medical": ["Клиники и медицина", "Clinics & Medical"],
  "Restaurants & Food": ["Рестораны и еда", "Restaurants & Food"],
  "Hotels & Travel": ["Отели и путешествия", "Hotels & Travel"],
  "Online Education": ["Онлайн-образование", "Online Education"],
  "CRM & Sales": ["CRM и продажи", "CRM & Sales"],
  "AI Website Factory": ["Фабрика сайтов с ИИ", "AI Website Factory"],
  "Interior Design": ["Дизайн интерьера", "Interior Design"],
  "Mobilă": ["Мебель", "Furniture"],
  "Furniture E-commerce": ["Магазин мебели", "Furniture E-commerce"], "Sustainable Furniture": ["Экологичная мебель", "Sustainable Furniture"],
  "Furniture Configurator": ["Конфигуратор мебели", "Furniture Configurator"], "Contract Furniture": ["Контрактная мебель", "Contract Furniture"],
  "Luxury Furniture": ["Премиальная мебель", "Luxury Furniture"], Marketplace: ["Маркетплейс", "Marketplace"],
  "Equipment Rental": ["Аренда техники", "Equipment Rental"], "Beauty & Academy": ["Красота и академия", "Beauty & Academy"], "Service Management": ["Управление сервисом", "Service Management"],
  "Calendar & Events": ["Календарь и события", "Calendar & Events"], "Utility Management": ["Учёт коммунальных услуг", "Utility Management"], Beauty: ["Красота", "Beauty"],
};

const romanianTypeMap: Record<string, string> = {
  "Gardens & Landscaping": "Grădini și peisagistică",
  "Real Estate": "Imobiliare",
  "Clinics & Medical": "Clinici și servicii medicale",
  "Restaurants & Food": "Restaurante și gastronomie",
  "Hotels & Travel": "Hoteluri și turism",
  "Online Education": "Educație online",
  "CRM & Sales": "CRM și vânzări",
  "AI Website Factory": "Fabrică de site-uri cu AI",
  "Interior Design": "Design interior",
  "Furniture E-commerce": "Magazin online de mobilă",
  "Sustainable Furniture": "Mobilă sustenabilă",
  "Furniture Configurator": "Configurator de mobilă",
  "Contract Furniture": "Mobilă pentru afaceri",
  "Luxury Furniture": "Mobilă premium",
  Marketplace: "Platformă de vânzări",
  "Equipment Rental": "Închiriere echipamente",
  "Beauty & Academy": "Frumusețe și Academie",
  "Service Management": "Managementul serviciilor",
  "Calendar & Events": "Calendar și evenimente",
  "Utility Management": "Administrarea utilităților",
  Beauty: "Frumusețe",
};

export function localType(type: string, locale: Locale) { return locale === "ro" ? romanianTypeMap[type] ?? type : typeMap[type]?.[locale === "ru" ? 0 : 1] ?? type; }

const descriptions: Record<number, [string, string]> = {
  34: ["Мультитенантная операционная платформа для автосервисов: записи, работы, клиенты, склад, партнёры и отчёты в одной системе", "A multi-tenant operations platform for automotive service companies, combining appointments, work orders, customers, inventory, partners and reporting"],
  26: ["Универсальная система онлайн-записи для услуг, команд и доступности, автоматически адаптируемая под каждую компанию", "A universal booking system for services, teams and availability, automatically customized for each company"],
  25: ["Универсальная платформа аренды с инвентарём, доступностью, ценообразованием, депозитами и полным управлением бронированиями", "A universal rental platform with inventory, availability, pricing, deposits and complete reservation management"],
  24: ["Локальная платформа для автоматической генерации, тестирования и улучшения сайтов; все услуги бесплатно в течение первого года", "A local platform for automatically generating, testing and improving websites, with all services included free for the first year"],
  23: ["Многостраничный luxury-сайт студии архитектуры и дизайна интерьера с проектами, услугами и редакционным журналом", "A multi-page luxury architecture and interior-design website with projects, services and an editorial journal"],
  22: ["Выразительный сайт студии дизайна интерьера с проектами, цветовой лабораторией и интерактивной формой", "An expressive interior-design studio website with projects, a color lab and an interactive enquiry form"],
  21: ["Редакционный сайт студии дизайна интерьера с портфолио, процессом, материалами и заявками на проекты", "An editorial interior-design studio website with portfolio, process, materials and project enquiries"],
  20: ["Трёхъязычный concept store современной мебели с яркими коллекциями и интерактивными инструментами", "A multilingual concept store for contemporary furniture, expressive collections and interactive tools"],
  19: ["Экологичный мебельный магазин с историями мастеров, материалами и прослеживаемыми объектами", "An editorial store for sustainable furniture, craftspeople, materials and traceable objects"],
  18: ["Премиальная платформа модульной мебели с визуальными конфигураторами диванов и стеллажей", "A premium modular-furniture platform with visual sofa and shelving configurators"],
  17: ["B2B-платформа контрактной мебели, спецификаций, проектов и запросов предложений", "A B2B platform for contract furniture, professional specifications, projects and RFQs"],
  16: ["Трёхъязычный редакционный сайт премиальной мебели, коллекций, проектов и услуг", "A multilingual editorial experience for premium furniture, collections, projects and services"],
  15: ["Полная платформа объявлений для покупки, продажи и продвижения компаний", "A complete marketplace for buying, selling and promoting companies"],
  14: ["Премиальный сайт барбершопа с услугами, портфолио и профессиональной академией", "A premium barber-shop website for services, portfolio and professional academy"],
  12: ["Полная платформа аренды профессиональной техники и оборудования", "A complete platform for renting professional machinery and equipment"],
  11: ["Редакционный сайт ногтевой студии, премиальных услуг и курсов", "An editorial website for a nail studio, premium services and professional courses"],
  10: ["Операционная система для полного управления автосервисом", "An operating system for complete auto-service management"],
  9: ["Социальный календарь для событий, партнёров и групп", "A social calendar for events, partners and groups"],
  8: ["Платформа умного управления жилыми сообществами и коммунальными услугами", "A platform for intelligent residential-community management"],
  7: ["Премиальный цифровой опыт для салона красоты", "A premium digital experience for a beauty salon"],
};

export function localDescription(id: number, fallback: string, locale: Locale) {
  if (locale === "ro") return fallback;
  return newProjectTranslations[locale].descriptions[id]
    ?? descriptions[id]?.[locale === "ru" ? 0 : 1]
    ?? `[${locale.toUpperCase()} translation missing for project ${id}]`;
}

export function localizedDetail(locale: Exclude<Locale, "ro">, project: { title: string; type: string; stack: string[] }) {
  const ru = locale === "ru", type = localType(project.type, locale);
  return {
    summary: ru ? `${project.title} — готовый цифровой проект в категории «${type}». Он сочетает выразительный дизайн, адаптивную вёрстку и редактируемую архитектуру.` : `${project.title} is a launch-ready digital project in the ${type} category. It combines distinctive design, responsive implementation and an editable architecture.`,
    sections: ru ? [
      { title: "Продукт", items: ["Полный и готовый к адаптации цифровой продукт", `Позиционирование: ${type}`, "Адаптивный интерфейс для телефона, планшета и desktop"] },
      { title: "Функции", items: ["Структура и контент готовы к ребрендингу", "Продуманные сценарии навигации и конверсии", "Модульная база для новых функций"] },
      { title: "Технологии", items: project.stack },
      { title: "Покупатель получает", items: ["Полный редактируемый исходный код", "Дизайн и все представленные разделы", "Основу для брендинга, деплоя и расширения"] },
    ] : [
      { title: "The product", items: ["A complete digital product ready for customization", `Positioned for ${type}`, "Responsive interface for phone, tablet and desktop"] },
      { title: "Features", items: ["Structure and content ready for rebranding", "Considered navigation and conversion journeys", "A modular foundation for new features"] },
      { title: "Technology", items: project.stack },
      { title: "What the buyer receives", items: ["Complete, editable source code", "Design and every showcased section", "A foundation ready for branding, deployment and expansion"] },
    ],
  };
}

export const visualCopy = {
  ro: { coming: "ÎN CURÂND", search: "Ce cauți astăzi?", estate: "Imobil", auto: "Auto", services: "Servicii", electronics: "Electronice", active: "MARKETPLACE ACTIV", opportunities: "oportunități într-un singur loc", publish: "+ PUBLICĂ ANUNȚ", available: "UTILAJ DISPONIBIL", capacity: "CAPACITATE ATELIER", appointments: "PROGRAMĂRI", working: "ÎN LUCRU", dinner: "🍷 Cină împreună", participants: "2 participanți", connect: "PLANIFICĂ · INVITĂ · CONECTEAZĂ", hello: "BUNĂ, CRISTIAN", consumers: "CONSUMATORI", roles: "MULTI-ZONĂ · 3 ROLURI", configurable: "MODULAR / CONFIGURABIL / AL TĂU" },
  ru: { coming: "СКОРО", search: "Что вы ищете?", estate: "Недвижимость", auto: "Авто", services: "Услуги", electronics: "Техника", active: "МАРКЕТПЛЕЙС АКТИВЕН", opportunities: "все возможности в одном месте", publish: "+ ПОДАТЬ ОБЪЯВЛЕНИЕ", available: "ТЕХНИКА ДОСТУПНА", capacity: "ЗАГРУЗКА СЕРВИСА", appointments: "ЗАПИСЕЙ", working: "В РАБОТЕ", dinner: "🍷 Ужин вместе", participants: "2 участника", connect: "ПЛАНИРУЙ · ПРИГЛАШАЙ · ОБЩАЙСЯ", hello: "ПРИВЕТ, КРИСТИАН", consumers: "ПОТРЕБИТЕЛЕЙ", roles: "МУЛЬТИЗОНА · 3 РОЛИ", configurable: "МОДУЛЬНО / НАСТРАИВАЕМО / ДЛЯ ВАС" },
  en: { coming: "COMING SOON", search: "What are you looking for?", estate: "Property", auto: "Auto", services: "Services", electronics: "Electronics", active: "ACTIVE MARKETPLACE", opportunities: "opportunities in one place", publish: "+ POST AN AD", available: "EQUIPMENT AVAILABLE", capacity: "WORKSHOP CAPACITY", appointments: "APPOINTMENTS", working: "IN PROGRESS", dinner: "🍷 Dinner together", participants: "2 participants", connect: "PLAN · INVITE · CONNECT", hello: "HELLO, CRISTIAN", consumers: "CONSUMERS", roles: "MULTI-ZONE · 3 ROLES", configurable: "MODULAR / CONFIGURABLE / YOURS" },
} as const;

export const showcaseCopy = {
  ro: {
    universalAppointments: "PROGRAMĂRI UNIVERSALE", step: "PASUL 03 / 05", chooseDate: ["Alege data", "și ora."], bookingLive: "PROGRAMĂRI ACTIVE",
    inventoryAvailable: "INVENTAR DISPONIBIL", rentCycle: ["ÎNCHIRIAZĂ.", "RETURNĂ.", "REPETĂ."], units: "12 UNITĂȚI",
    newProject: "PROIECT NOU / CODEX", buildCycle: ["CONSTRUIEȘTE.", "TESTEAZĂ.", "LANSEAZĂ."], systemActive: "SISTEM ACTIV",
    veloraKicker: "BUCUREȘTI · PARIS · MILANO", veloraTitle: ["INTERIOARE", "DE COLECȚIE."],
    formaKicker: "INTERIOARE CU PULS", formaTitle: ["NU FACEM FRUMOS.", "FACEM VIU."],
    nomaKicker: "DESIGN INTERIOR · CHIȘINĂU", nomaTitle: ["LOCURI CARE", "SE SIMT ACASĂ."],
    mood: ["FORME CU", "ATITUDINE."], nordKicker: "OBIECTE PENTRU O VIAȚĂ MAI LUNGĂ", nordTitle: ["Formă calmă.", "Material sincer."],
    projectSpec: "SPECIFICAȚII PROIECT", readyRfq: "GATA PENTRU OFERTARE ↗", collection: "COLECȚIA 01", quietBeauty: ["OBIECTE DE", "FRUMUSEȚE DISCRETĂ"],
    precision: ["PRECIZIA", "ESTE UN RITUAL"], signatureCut: "TUNSOARE SIGNATURE", nailStudio: "STUDIO DE UNGHII ȘI ACADEMIE", beautyCraft: ["FRUMUSEȚEA", "întâlnește măiestria."],
    serviceOs: "SISTEM SERVICE", liveOperations: "● OPERAȚIUNI ACTIVE", month: "August 2026",
  },
  ru: {
    universalAppointments: "УНИВЕРСАЛЬНАЯ ЗАПИСЬ", step: "ШАГ 03 / 05", chooseDate: ["Выберите дату", "и время."], bookingLive: "ЗАПИСЬ АКТИВНА",
    inventoryAvailable: "ИНВЕНТАРЬ ДОСТУПЕН", rentCycle: ["АРЕНДУЙ.", "ВОЗВРАЩАЙ.", "ПОВТОРЯЙ."], units: "12 ЕДИНИЦ",
    newProject: "НОВЫЙ ПРОЕКТ / CODEX", buildCycle: ["СОЗДАЙ.", "ПРОТЕСТИРУЙ.", "ЗАПУСТИ."], systemActive: "СИСТЕМА АКТИВНА",
    veloraKicker: "БУХАРЕСТ · ПАРИЖ · МИЛАН", veloraTitle: ["КОЛЛЕКЦИОННЫЕ", "ИНТЕРЬЕРЫ."],
    formaKicker: "ИНТЕРЬЕРЫ С ПУЛЬСОМ", formaTitle: ["МЫ НЕ ДЕЛАЕМ КРАСИВО.", "МЫ ДЕЛАЕМ ЖИВО."],
    nomaKicker: "ДИЗАЙН ИНТЕРЬЕРА · КИШИНЁВ", nomaTitle: ["МЕСТА, ГДЕ", "ЧУВСТВУЕШЬ СЕБЯ ДОМА."],
    mood: ["ФОРМЫ С", "ХАРАКТЕРОМ."], nordKicker: "ПРЕДМЕТЫ ДЛЯ ДОЛГОЙ ЖИЗНИ", nordTitle: ["Спокойная форма.", "Честный материал."],
    projectSpec: "СПЕЦИФИКАЦИЯ ПРОЕКТА", readyRfq: "ГОТОВО К ЗАПРОСУ ЦЕНЫ ↗", collection: "КОЛЛЕКЦИЯ 01", quietBeauty: ["ПРЕДМЕТЫ", "ТИХОЙ КРАСОТЫ"],
    precision: ["ТОЧНОСТЬ", "— ЭТО РИТУАЛ"], signatureCut: "ФИРМЕННАЯ СТРИЖКА", nailStudio: "СТУДИЯ НОГТЕЙ И АКАДЕМИЯ", beautyCraft: ["КРАСОТА", "встречает мастерство."],
    serviceOs: "СИСТЕМА СЕРВИСА", liveOperations: "● РАБОТА В РЕАЛЬНОМ ВРЕМЕНИ", month: "Август 2026",
  },
  en: {
    universalAppointments: "UNIVERSAL APPOINTMENTS", step: "STEP 03 / 05", chooseDate: ["Choose the date", "and time."], bookingLive: "BOOKING LIVE",
    inventoryAvailable: "INVENTORY AVAILABLE", rentCycle: ["RENT.", "RETURN.", "REPEAT."], units: "12 UNITS",
    newProject: "NEW PROJECT / CODEX", buildCycle: ["BUILD.", "TEST.", "SHIP."], systemActive: "SYSTEM ACTIVE",
    veloraKicker: "BUCHAREST · PARIS · MILAN", veloraTitle: ["COLLECTIBLE", "INTERIORS."],
    formaKicker: "INTERIORS WITH A PULSE", formaTitle: ["WE DON'T MAKE IT PRETTY.", "WE MAKE IT ALIVE."],
    nomaKicker: "INTERIOR DESIGN · CHIȘINĂU", nomaTitle: ["PLACES THAT", "FEEL LIKE HOME."],
    mood: ["SHAPES WITH", "ATTITUDE."], nordKicker: "OBJECTS FOR A LONGER LIFE", nordTitle: ["Quiet form.", "Honest material."],
    projectSpec: "PROJECT SPEC", readyRfq: "READY FOR RFQ ↗", collection: "COLLECTION 01", quietBeauty: ["OBJECTS OF", "QUIET BEAUTY"],
    precision: ["PRECISION", "IS A RITUAL"], signatureCut: "SIGNATURE CUT", nailStudio: "NAIL STUDIO & ACADEMY", beautyCraft: ["BEAUTY", "meets craft."],
    serviceOs: "SERVICE OS", liveOperations: "● LIVE OPERATIONS", month: "August 2026",
  },
} as const;
