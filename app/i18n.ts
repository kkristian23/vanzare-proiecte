export type Locale = "ro" | "ru" | "en";

export const locales: Locale[] = ["ro", "ru", "en"];

export const copy = {
  ro: {
    nav: ["Proiecte", "Proces", "Contact"], buyProject: "Cumpără un proiect", openMenu: "Deschide meniul",
    eyebrow: "PROIECTE DIGITALE. GATA DE LANSARE.", heroA: "IDEI MARI.", heroB: "DEJA CONSTRUITE.",
    heroText: "Site-uri și produse digitale premium, construite cu grijă și pregătite să devină următoarea ta afacere.", viewProjects: "Vezi proiectele",
    marquee: ["DESIGN CARE VINDE", "COD CURAT", "LIVRARE RAPIDĂ"], catalog: "/ CATALOG 2026", chooseA: "ALEGE URMĂTORUL", chooseB: "TĂU", chooseC: "PROIECT.",
    projectsAvailable: ["PROIECTE", "DISPONIBILE"], all: "Toate", viewDetails: "Vezi detalii", from: "DE LA",
    processKicker: "/ CUM FUNCȚIONEAZĂ", processA: "DE LA CLICK", processB: "LA", processC: "LAUNCH.",
    steps: [["ALEGI", "Explorezi catalogul și găsești proiectul potrivit ideii tale."], ["PERSONALIZĂM", "Adaptăm brandul, culorile și conținutul pentru afacerea ta."], ["LANSĂM", "Primești proiectul complet, configurat și gata să producă."]],
    whyKicker: "/ DE CE MONO/DEV", whyA: "NU VINDEM", whyB: "DOAR", whyC: "PIXELI.", whyText: "Fiecare proiect este construit să arate impecabil, să se miște rapid și, cel mai important, să transforme vizitatorii în clienți.", talk: "Hai să vorbim",
    metrics: [["COD CURAT", "ȘI EDITABIL"], ["PÂNĂ LA", "PREDARE"], ["ZILE SUPORT", "INCLUS"]], found: "AI GĂSIT CE CĂUTAI?", start: "SĂ ÎNCEPEM",
    close: "Închide detaliile", fullLicense: "LICENȚĂ COMPLETĂ", fullPrice: "PREȚ COMPLET", requestDemo: "Solicită acces demo", openProject: "Deschide proiectul", buyFor: "Cumpără pentru", interested: "Interesat de", demoSubject: "Solicit acces demo pentru",
  },
  ru: {
    nav: ["Проекты", "Процесс", "Контакты"], buyProject: "Купить проект", openMenu: "Открыть меню",
    eyebrow: "ЦИФРОВЫЕ ПРОЕКТЫ. ГОТОВЫ К ЗАПУСКУ.", heroA: "БОЛЬШИЕ ИДЕИ.", heroB: "УЖЕ СОЗДАНЫ.",
    heroText: "Премиальные сайты и цифровые продукты, готовые стать вашим следующим бизнесом.", viewProjects: "Смотреть проекты",
    marquee: ["ДИЗАЙН, КОТОРЫЙ ПРОДАЁТ", "ЧИСТЫЙ КОД", "БЫСТРАЯ ЗАПУСК"], catalog: "/ КАТАЛОГ 2026", chooseA: "ВЫБЕРИТЕ СВОЙ", chooseB: "СЛЕДУЮЩИЙ", chooseC: "ПРОЕКТ.",
    projectsAvailable: ["ПРОЕКТОВ", "ДОСТУПНО"], all: "Все", viewDetails: "Подробнее", from: "ОТ",
    processKicker: "/ КАК ЭТО РАБОТАЕТ", processA: "ОТ КЛИКА", processB: "ДО", processC: "ЗАПУСКА.",
    steps: [["ВЫБИРАЕТЕ", "Изучаете каталог и находите проект для своей идеи."], ["НАСТРАИВАЕМ", "Адаптируем бренд, цвета и контент под ваш бизнес."], ["ЗАПУСКАЕМ", "Вы получаете готовый, настроенный проект."]],
    whyKicker: "/ ПОЧЕМУ MONO/DEV", whyA: "МЫ ПРОДАЁМ", whyB: "НЕ ТОЛЬКО", whyC: "ПИКСЕЛИ.", whyText: "Каждый проект безупречно выглядит, быстро работает и превращает посетителей в клиентов.", talk: "Обсудим",
    metrics: [["ЧИСТЫЙ КОД", "И РЕДАКТИРУЕМЫЙ"], ["ДО", "ПЕРЕДАЧИ"], ["ДНЕЙ ПОДДЕРЖКИ", "ВКЛЮЧЕНО"]], found: "НАШЛИ ТО, ЧТО ИСКАЛИ?", start: "НАЧНЁМ",
    close: "Закрыть", fullLicense: "ПОЛНАЯ ЛИЦЕНЗИЯ", fullPrice: "ПОЛНАЯ ЦЕНА", requestDemo: "Запросить демо", openProject: "Открыть проект", buyFor: "Купить за", interested: "Интересует", demoSubject: "Запрос демо для",
  },
  en: {
    nav: ["Projects", "Process", "Contact"], buyProject: "Buy a project", openMenu: "Open menu",
    eyebrow: "DIGITAL PROJECTS. READY TO LAUNCH.", heroA: "BIG IDEAS.", heroB: "ALREADY BUILT.",
    heroText: "Premium websites and digital products, carefully built and ready to become your next business.", viewProjects: "View projects",
    marquee: ["DESIGN THAT SELLS", "CLEAN CODE", "FAST DELIVERY"], catalog: "/ 2026 CATALOG", chooseA: "CHOOSE YOUR", chooseB: "NEXT", chooseC: "PROJECT.",
    projectsAvailable: ["PROJECTS", "AVAILABLE"], all: "All", viewDetails: "View details", from: "FROM",
    processKicker: "/ HOW IT WORKS", processA: "FROM CLICK", processB: "TO", processC: "LAUNCH.",
    steps: [["CHOOSE", "Explore the catalog and find the right project for your idea."], ["CUSTOMIZE", "We adapt the brand, colors and content to your business."], ["LAUNCH", "Receive a complete, configured project ready to perform."]],
    whyKicker: "/ WHY MONO/DEV", whyA: "WE DON'T SELL", whyB: "JUST", whyC: "PIXELS.", whyText: "Every project is built to look impeccable, move fast and, most importantly, turn visitors into customers.", talk: "Let's talk",
    metrics: [["CLEAN CODE", "AND EDITABLE"], ["UNTIL", "DELIVERY"], ["DAYS SUPPORT", "INCLUDED"]], found: "FOUND WHAT YOU NEEDED?", start: "LET'S START",
    close: "Close details", fullLicense: "FULL LICENSE", fullPrice: "FULL PRICE", requestDemo: "Request demo access", openProject: "Open project", buyFor: "Buy for", interested: "Interested in", demoSubject: "Demo access request for",
  },
} as const;

const typeMap: Record<string, [string, string]> = {
  "AI Website Factory": ["Фабрика сайтов с ИИ", "AI Website Factory"],
  "Interior Design": ["Дизайн интерьера", "Interior Design"],
  "Furniture E-commerce": ["Магазин мебели", "Furniture E-commerce"], "Sustainable Furniture": ["Экологичная мебель", "Sustainable Furniture"],
  "Furniture Configurator": ["Конфигуратор мебели", "Furniture Configurator"], "Contract Furniture": ["Контрактная мебель", "Contract Furniture"],
  "Luxury Furniture": ["Премиальная мебель", "Luxury Furniture"], Marketplace: ["Маркетплейс", "Marketplace"], "Barber & Academy": ["Барбершоп и академия", "Barber & Academy"],
  "Equipment Rental": ["Аренда техники", "Equipment Rental"], "Beauty & Academy": ["Красота и академия", "Beauty & Academy"], "Service Management": ["Управление сервисом", "Service Management"],
  "Calendar & Events": ["Календарь и события", "Calendar & Events"], "Utility Management": ["Учёт коммунальных услуг", "Utility Management"], Beauty: ["Красота", "Beauty"],
};

export function localType(type: string, locale: Locale) { return locale === "ro" ? type : typeMap[type]?.[locale === "ru" ? 0 : 1] ?? type; }

const descriptions: Record<number, [string, string]> = {
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

export function localDescription(id: number, fallback: string, locale: Locale) { return locale === "ro" ? fallback : descriptions[id]?.[locale === "ru" ? 0 : 1] ?? fallback; }

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
