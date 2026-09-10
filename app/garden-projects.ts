type GardenDetail = { summary: string; sections: { title: string; items: string[] }[] };
type GardenCopy = { description: string; design: string; features: string[] };
type GardenProject = {
  id: number; title: string; slug: string; price: number; seoEnabled: boolean;
  copy: Record<"ro" | "en" | "ru", GardenCopy>;
};

export const gardenProjects: GardenProject[] = [
  {
    id: 71, seoEnabled: false, title: "AquaVerde", slug: "aquaverde", price: 900,
    copy: {
      ro: { description: "Sisteme inteligente de irigare, cu simulator și calculator de consum.", design: "Verde-mentă, suprafețe albe și o prezentare tehnică a circuitului apei.", features: ["Calculator de investiție în trei pași", "Estimări de aspersoare, conducte și consum de apă", "Selector de sisteme, simulator și diagnosticare"] },
      en: { description: "Smart irrigation systems with a simulator and water-use calculator.", design: "Mint green, white surfaces and a technical presentation of water flow.", features: ["Three-step investment calculator", "Sprinkler, pipe and water-use estimates", "System selector, simulator and troubleshooting"] },
      ru: { description: "Умные системы полива с симулятором и расчётом расхода воды.", design: "Мятно-зелёные акценты, белые поверхности и наглядная схема движения воды.", features: ["Калькулятор стоимости в три шага", "Расчёт дождевателей, труб и расхода воды", "Подбор систем, симулятор и диагностика"] },
    },
  },
  {
    id: 70, seoEnabled: false, title: "TerraForma", slug: "terraforma", price: 1000,
    copy: {
      ro: { description: "Arhitectură peisagistică premium, portofoliu editorial și moodboard de grădină.", design: "Fundal crem, accente măslinii și teracotă, titluri elegante și fotografii ample.", features: ["Portofoliu și catalog cu 40 de plante filtrabile", "Moodboard, test de stil și configurator de atmosferă", "Calculatoare de densitate și buget; brief exportabil"] },
      en: { description: "Premium landscape architecture, an editorial portfolio and a garden moodboard.", design: "Cream backgrounds, olive and terracotta accents, elegant headings and large photographs.", features: ["Portfolio and a filterable catalog of 40 plants", "Moodboard, style quiz and atmosphere configurator", "Plant-density and budget calculators; exportable brief"] },
      ru: { description: "Премиальная ландшафтная архитектура, редакционное портфолио и мудборд сада.", design: "Кремовый фон, оливковые и терракотовые акценты, элегантные заголовки и крупные фотографии.", features: ["Портфолио и каталог из 40 растений с фильтрами", "Мудборд, тест стиля и настройка атмосферы", "Расчёт плотности посадки и бюджета; экспорт брифа"] },
    },
  },
  {
    id: 69, seoEnabled: false, title: "GazonPro", slug: "gazonpro", price: 900,
    copy: {
      ro: { description: "Instalare și întreținere gazon, cu magazin demonstrativ și calculator de suprafață.", design: "Verde intens, tipografie Manrope și fotografii de gazon în cadre generoase.", features: ["Calcul de suprafață, rulouri, semințe și fertilizant", "Catalog de 16 produse cu filtre, sortare și coș local", "Diagnostic interactiv și calendar lunar de îngrijire"] },
      en: { description: "Lawn installation and care with a demo shop and an area calculator.", design: "Rich green, Manrope typography and generously framed lawn photography.", features: ["Area, turf-roll, seed and fertilizer calculations", "16-product catalog with filters, sorting and a local cart", "Interactive diagnosis and a monthly care calendar"] },
      ru: { description: "Укладка и уход за газоном с демонстрационным магазином и расчётом площади.", design: "Насыщенный зелёный, шрифт Manrope и крупные фотографии газонов.", features: ["Расчёт площади, рулонов, семян и удобрений", "Каталог из 16 товаров с фильтрами, сортировкой и локальной корзиной", "Интерактивная диагностика и ежемесячный календарь ухода"] },
    },
  },
  {
    id: 68, seoEnabled: false, title: "EcoHabitat", slug: "ecohabitat", price: 850,
    copy: {
      ro: { description: "Grădini ecologice și biodiversitate, cu plante locale și instrumente educaționale.", design: "Verde-pădure, salvie și nuanțe de nisip, fotografii de pajiște și temă întunecată.", features: ["Catalog de 40 de plante cu filtre", "Evaluare ecologică și plan de grădină descărcabil", "Calculatoare pentru compost, sol și apă; fișe imprimabile"] },
      en: { description: "Ecological gardens and biodiversity with local plants and educational tools.", design: "Forest green, sage and sand tones, meadow photography and a dark theme.", features: ["Filterable catalog of 40 plants", "Ecological assessment and a downloadable garden plan", "Compost, soil and water calculators; printable resources"] },
      ru: { description: "Экологичные сады и биоразнообразие с местными растениями и обучающими инструментами.", design: "Лесной зелёный, шалфейные и песочные оттенки, фотографии лугов и тёмная тема.", features: ["Каталог из 40 растений с фильтрами", "Экологическая оценка и скачиваемый план сада", "Расчёты компоста, почвы и воды; материалы для печати"] },
    },
  },
  {
    id: 67, seoEnabled: false, title: "YardCraft", slug: "yardcraft", price: 1200,
    copy: {
      ro: { description: "Amenajarea completă a curții, cu plan schematic și configurator de buget.", design: "Accente lime, suprafețe deschise și o interfață orientată spre configurarea curții.", features: ["Configurator pentru suprafață, finisaje și servicii", "Estimări de buget, materiale și durată a lucrărilor", "Comparație de pachete, salvare locală și rezumat imprimabil"] },
      en: { description: "Complete yard landscaping with a schematic plan and a budget configurator.", design: "Lime accents, light surfaces and an interface centered on planning the yard.", features: ["Configurator for area, finishes and services", "Budget, material and project-duration estimates", "Package comparison, local saving and a printable summary"] },
      ru: { description: "Комплексное благоустройство двора со схемой участка и настройкой бюджета.", design: "Лаймовые акценты, светлые поверхности и интерфейс для планирования двора.", features: ["Настройка площади, отделки и услуг", "Оценка бюджета, материалов и сроков работ", "Сравнение пакетов, локальное сохранение и сводка для печати"] },
    },
  },
];

const headings = {
  ro: ["Design și structură", "Funcționalități demonstrative", "Ce primește cumpărătorul"],
  en: ["Design and structure", "Demo functionality", "What the buyer receives"],
  ru: ["Дизайн и структура", "Демонстрационные функции", "Что получает покупатель"],
};
const delivery = {
  ro: ["Cod sursă editabil și export static responsive", "Date și estimări demonstrative; serviciile reale se conectează separat"],
  en: ["Editable source code and a responsive static export", "Demo data and estimates; live services require separate integration"],
  ru: ["Редактируемый исходный код и адаптивный статический экспорт", "Демонстрационные данные и оценки; реальные сервисы подключаются отдельно"],
};

export function gardenDetails(locale: "ro" | "en" | "ru"): Record<number, GardenDetail> {
  return Object.fromEntries(gardenProjects.map((project) => {
    const copy = project.copy[locale];
    return [project.id, { summary: copy.description, sections: [
      { title: headings[locale][0], items: [copy.design] },
      { title: headings[locale][1], items: copy.features },
      { title: headings[locale][2], items: delivery[locale] },
    ] }];
  }));
}

export function gardenDescriptions(locale: "en" | "ru"): Record<number, string> {
  return Object.fromEntries(gardenProjects.map((project) => [project.id, project.copy[locale].description]));
}
