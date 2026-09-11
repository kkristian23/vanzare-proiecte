import { cmsContent } from "./cms-store";
import type { Locale } from "./site-config";

export type ServiceContent = {
  seo?: { title: string; description: string };
  title: string;
  description: string;
  intro: string;
  problem: string;
  included: string[];
  process: string[];
  quote: string;
  faq: { q: string; a: string }[];
};

export type Service = {
  slug: string;
  categories: string[];
  content: Record<Locale, ServiceContent>;
};

/** Editorial content is intentionally maintained per service and language. */
export const services: Service[] = cmsContent("services-services", [
  {
    slug: "business-websites",
    categories: ["Gardens & Landscaping", "Interior Design", "Mobilă"],
    content: {
      ro: {
        seo: { title: "Site de prezentare pentru afaceri din Moldova", description: "Site de prezentare MONO/DEV pentru serviciile și oferta companiei tale. Stabilim paginile, limbile, personalizarea și costul înainte de lansare." },
        title: "Creare site pentru afaceri din Moldova",
        description: "Un site care explică oferta afacerii tale: structură, pagini de servicii, conținut în limbile publicului și o cale clară către contact.",
        intro: "Când cineva află de afacerea ta, site-ul trebuie să răspundă repede: ce oferi, cui te adresezi și cum poate începe colaborarea. Construim această prezentare pornind de la activitatea reală, pentru afaceri din Moldova.",
        problem: "O pagină de social media poate atrage atenția, dar informațiile despre servicii se pierd între postări. Un site propriu le organizează la o adresă stabilă și permite trimiterea unui link direct către oferta relevantă.",
        included: ["Structura paginilor și traseul către cerere de ofertă.", "Design adaptat la telefon, tabletă și desktop.", "Pagini pentru serviciile agreate, informații de contact și conținut furnizat de afacere.", "Titluri, descrieri și structură HTML pentru paginile publice."],
        process: ["Clarificăm publicul, serviciile prioritare și materialele disponibile.", "Alegem o bază din catalog sau definim paginile pentru o construcție personalizată.", "Adaptăm conținutul și verificăm navigarea înainte de lansarea agreată."],
        quote: "Oferta se stabilește după numărul de pagini, limbile necesare și funcțiile cerute. Prețul unui proiect din catalog este punctul de plecare doar dacă acel proiect se potrivește; adaptările se discută separat.",
        faq: [{ q: "Pot avea site în română și rusă?", a: "Da. Stabilim versiunile necesare și pregătim pagini distincte pentru fiecare limbă, cu texte verificate înainte de publicare." }, { q: "Trebuie să am deja logo și fotografii?", a: "Materialele existente ajută la definirea direcției. Dacă lipsesc, stabilim ce trebuie pregătit și cine furnizează conținutul, înainte de implementare." }],
      },
      ru: {
        seo: { title: "Корпоративный сайт для бизнеса в Молдове", description: "Сайт компании от MONO/DEV: услуги, содержание на языках клиентов и обращение за предложением. Согласуем страницы, адаптацию и стоимость." },
        title: "Создание сайтов для бизнеса в Молдове",
        description: "Сайт с понятным предложением: услуги компании, страницы на языках ваших клиентов, удобная мобильная версия и обращение за расчетом.",
        intro: "Посетителю важно быстро понять, чем занимается компания, подходит ли ему услуга и как связаться. Создаем сайты для бизнеса в Молдове вокруг этих вопросов и реальных материалов компании.",
        problem: "В социальных сетях описание услуг теряется среди публикаций. Собственный сайт собирает предложение по постоянному адресу: клиент может сразу перейти к нужной услуге, а вы — отправить ссылку на конкретную страницу.",
        included: ["Структура страниц и понятный путь к обращению.", "Адаптация интерфейса для телефона, планшета и компьютера.", "Согласованные страницы услуг и проверенные контакты компании.", "Заголовки, описания и семантическая разметка публичных страниц."],
        process: ["Определяем аудиторию, основные услуги и готовые материалы.", "Выбираем подходящий проект из каталога или составляем структуру нового сайта.", "Адаптируем тексты и проверяем навигацию до согласованного запуска."],
        quote: "Стоимость зависит от количества страниц, языков и функций. Цена проекта из каталога служит ориентиром только для соответствующей основы; дополнительные изменения оцениваются отдельно.",
        faq: [{ q: "Можно сделать сайт на румынском и русском?", a: "Да. Для выбранных языков готовятся отдельные страницы. Тексты необходимо проверить до публикации." }, { q: "Нужны ли готовый логотип и фотографии?", a: "Они помогают определить оформление. Если материалов пока нет, заранее согласуем, что нужно подготовить и кто за это отвечает." }],
      },
      en: {
        seo: { title: "Business website development in Moldova", description: "A business website by MONO/DEV, scoped around your services, content and enquiries. Agree the pages, languages, customization and launch requirements." },
        title: "Custom business websites",
        description: "Business websites built around your offer, audience and enquiry flow, with responsive pages and a clear plan for content and launch.",
        intro: "Turn a business introduction into a useful destination. We build websites that explain your services, answer the questions buyers ask and give visitors a clear next step, including for businesses working across markets.",
        problem: "A social profile or slide deck rarely gives every prospect the right level of detail. A dedicated website makes your offer easy to reference and lets you share a direct link to each service.",
        included: ["Page structure based on your audience and enquiry goals.", "Responsive layouts for mobile, tablet and desktop.", "Agreed service pages, business content and contact routes.", "Page titles, descriptions and semantic HTML for public content."],
        process: ["Review your offer, audience and available brand materials.", "Choose a suitable catalogue foundation or scope a custom structure.", "Adapt the content, review the key journeys and agree the launch."],
        quote: "We quote after reviewing page count, languages and functionality. If a catalogue project fits, its listed price provides a starting point; custom work is scoped separately.",
        faq: [{ q: "Can the website serve more than one market?", a: "Yes. We can plan separate language pages and adapt the content to each audience. Required translations and review responsibilities are agreed during scoping." }, { q: "What should I prepare for the first discussion?", a: "Bring a short description of your services, examples of your audience's questions and any existing brand materials. A complete brief is helpful but not required to start the conversation." }],
      },
    },
  },
  {
    slug: "web-design",
    categories: ["Interior Design", "Beauty & Academy"],
    content: {
      ro: {
        seo: { title: "Web design în Moldova — design și interfețe", description: "Web design MONO/DEV pentru site-uri noi și interfețe existente: structură vizuală, navigare, accesibilitate și implementare responsive." },
        title: "Web design și dezvoltare web în Moldova",
        description: "Design și dezvoltare web pentru o ofertă ușor de înțeles: ierarhie vizuală, navigare, accesibilitate și implementare responsive.",
        intro: "Un design bun ajută vizitatorul să înțeleagă conținutul, nu doar să observe un efect vizual. Pentru un site nou sau o interfață existentă, legăm identitatea brandului de navigare și de acțiunile importante.",
        problem: "Textele greu de citit, secțiunile fără ordine și meniurile complicate fac oferta dificil de evaluat. Lucrul începe cu ierarhia informației și continuă cu o implementare care se comportă coerent pe ecrane diferite.",
        included: ["Structură vizuală pentru paginile și stările agreate.", "Tipografie, culori și componente coerente cu materialele brandului.", "Implementare responsive și verificarea contrastului și a navigării cu tastatura.", "Revizuirea imaginilor și a încărcării elementelor vizuale importante."],
        process: ["Analizăm conținutul și punctele unde utilizatorul se poate bloca.", "Stabilim direcția vizuală și exemplele de ecrane care trebuie aprobate.", "Implementăm și verificăm paginile pe mobil și desktop."],
        quote: "Estimarea depinde de numărul de tipuri de pagini, stări interactive și componente noi. O adaptare de brand și o reproiectare completă au scopuri diferite, definite în ofertă.",
        faq: [{ q: "Puteți păstra identitatea vizuală actuală?", a: "Da. Putem îmbunătăți lizibilitatea și navigarea folosind logo-ul, culorile și stilul existent, dacă acestea sunt potrivite pentru paginile cerute." }, { q: "Designul include și implementarea?", a: "Serviciul poate acoperi ambele etape. Oferta precizează ecranele, implementarea și verificările incluse, ca să fie clar ce se livrează." }],
      },
      ru: {
        seo: { title: "Веб-дизайн в Молдове — дизайн сайтов", description: "Веб-дизайн MONO/DEV для новых сайтов и существующих интерфейсов: визуальная структура, навигация и адаптивная вёрстка по согласованному объёму." },
        title: "Веб-дизайн и разработка в Молдове",
        description: "Дизайн и разработка понятных сайтов: визуальная иерархия, удобная навигация, доступность и адаптация для разных экранов.",
        intro: "Веб-дизайн должен помогать читать и принимать решения. Связываем стиль бренда с содержанием и ключевыми действиями посетителя — при создании нового сайта или обновлении существующего интерфейса.",
        problem: "Мелкий текст, перегруженные блоки и запутанное меню мешают оценить предложение. Поэтому начинаем с порядка информации, а затем переносим согласованное оформление в работающие страницы.",
        included: ["Визуальная структура согласованных страниц и состояний.", "Шрифты, цвета и компоненты на основе материалов бренда.", "Адаптивная верстка, проверка контраста и навигации с клавиатуры.", "Проверка изображений и загрузки основных визуальных элементов."],
        process: ["Изучаем содержание и затруднения в текущем пользовательском пути.", "Согласуем визуальное направление и ключевые макеты.", "Реализуем страницы и проверяем их на телефоне и компьютере."],
        quote: "Оценка зависит от типов страниц, интерактивных состояний и новых компонентов. Адаптация фирменного стиля и полная переработка интерфейса обсуждаются как разные объемы работ.",
        faq: [{ q: "Можно сохранить существующий фирменный стиль?", a: "Да. Читаемость и навигацию можно улучшить с текущими логотипом, цветами и визуальным характером, если они подходят задаче." }, { q: "Вы делаете только макеты или работающий сайт?", a: "Объем может включать дизайн и разработку. В предложении указываются конкретные экраны, реализация и проверки." }],
      },
      en: {
        seo: { title: "Web design in Moldova — responsive interfaces", description: "MONO/DEV web design connects your brand with clear content, responsive interfaces and keyboard navigation. Discuss design and front-end implementation." },
        title: "Web design and front-end development",
        description: "Connect brand design with usable web pages: content hierarchy, responsive components, keyboard navigation and implementation review.",
        intro: "A visual direction becomes useful when it helps people read, navigate and act. We connect your brand with the structure and behaviour of the website, whether the work starts with an existing interface or a new concept.",
        problem: "Small text, competing calls to action and inconsistent layouts create friction. We first make the information hierarchy clear, then implement the agreed direction across screen sizes.",
        included: ["Visual structure for agreed page templates and interface states.", "Typography, colour and components informed by your brand assets.", "Responsive implementation with contrast and keyboard navigation checks.", "Review of image use and loading for important visual content."],
        process: ["Review the content and identify confusing points in the visitor journey.", "Agree the visual direction and representative screens.", "Implement and review the pages on mobile and desktop."],
        quote: "The estimate follows the number of page templates, interactive states and new components. A brand refresh and a full redesign are scoped separately so the deliverables remain clear.",
        faq: [{ q: "Can you work with our existing visual identity?", a: "Yes. We can retain your logo, colours and visual character while improving readability and navigation." }, { q: "Does this include working code?", a: "It can include both design and implementation. The proposal specifies which screens, development tasks and checks are part of the work." }],
      },
    },
  },
  {
    slug: "ecommerce",
    categories: ["E-commerce & Auto", "Marketplace"],
    content: {
      ro: {
        seo: { title: "Creare magazin online în Moldova", description: "Creare magazin online MONO/DEV pentru afaceri din Moldova. Planificăm catalogul, comenzile și integrările de plată și livrare; solicită o ofertă." },
        title: "Dezvoltare magazine online",
        description: "Magazine online cu un catalog clar și un flux de comandă adaptat afacerii. Planificăm produsele, livrarea și integrările înainte de implementare.",
        intro: "Un magazin online începe cu modul în care vinzi: produse, variante, stoc, livrare și plată. Alegem structura potrivită acestor operațiuni, pentru ca prezentarea produselor și procesarea comenzilor să poată funcționa împreună.",
        problem: "Un coș demonstrativ nu înseamnă automat plăți sau gestionare reală a stocului. Separăm interfața din demo de integrările necesare pentru activitatea comercială și verificăm fiecare etapă înainte de lansare.",
        included: ["Structura catalogului, categorii și pagini de produs.", "Fluxul de coș și comandă conform cerințelor agreate.", "Definirea integrărilor pentru plată, livrare sau inventar, dacă sunt necesare.", "Verificarea scenariilor de comandă, erorilor și confirmărilor."],
        process: ["Inventariem produsele, variantele și regulile de livrare.", "Confirmăm furnizorii externi și accesul la mediile lor de test.", "Implementăm fluxurile convenite și verificăm comenzi de test."],
        quote: "Oferta depinde de volumul catalogului, importul de date și integrări. Taxele procesatorului de plăți, curierului sau altor servicii externe se clarifică separat; nu sunt deduse din prețul unui demo.",
        faq: [{ q: "Demo-ul încasează plăți reale?", a: "Nu presupune acest lucru. Funcțiile demonstrative trebuie verificate; un procesator real necesită contul comerciantului, configurare și testare." }, { q: "Pot importa produsele existente?", a: "Putem evalua un import după ce vedem sursa, câmpurile și calitatea datelor. Maparea categoriilor și variantelor intră în estimare." }],
      },
      ru: {
        seo: { title: "Создание интернет-магазина в Молдове", description: "Создание интернет-магазина MONO/DEV для бизнеса в Молдове. Планируем каталог, заказы и интеграции оплаты и доставки. Обсудите требования и стоимость." },
        title: "Разработка интернет-магазинов",
        description: "Интернет-магазины с понятным каталогом и оформлением заказа. Планируем товары, доставку и интеграции до начала разработки.",
        intro: "Магазин строится вокруг реальных операций: товары, варианты, остатки, доставка и оплата. Подбираем структуру так, чтобы витрина соответствовала тому, как компания принимает и обрабатывает заказы.",
        problem: "Работающая корзина в демо еще не означает прием платежей или учет остатков. Отделяем демонстрационный интерфейс от необходимых коммерческих интеграций и проверяем согласованный путь заказа.",
        included: ["Структура каталога, категории и карточки товаров.", "Корзина и оформление заказа по согласованным требованиям.", "План интеграций оплаты, доставки и учета, если они нужны.", "Проверка заказа, ошибок и подтверждений."],
        process: ["Разбираем товары, варианты и правила доставки.", "Уточняем внешних поставщиков и доступ к тестовым средам.", "Реализуем согласованные сценарии и проверяем тестовые заказы."],
        quote: "Расчет зависит от объема каталога, импорта данных и интеграций. Комиссии платежных систем, доставка и внешние подписки уточняются отдельно от цены проекта.",
        faq: [{ q: "Демонстрационный магазин принимает настоящие платежи?", a: "Это нельзя предполагать по виду интерфейса. Для реальной оплаты нужны аккаунт продавца у провайдера, настройка и тестирование." }, { q: "Можно перенести существующий каталог?", a: "Оценим импорт после проверки источника и полей данных. Сопоставление категорий и вариантов товаров учитывается в объеме работ." }],
      },
      en: {
        seo: { title: "E-commerce development in Moldova", description: "MONO/DEV online store development for businesses in Moldova and abroad. Scope your catalog, checkout, migration, payment and delivery integrations." },
        title: "E-commerce development",
        description: "Online stores scoped around your products and order operations, with clear decisions on catalogue migration, checkout and external integrations.",
        intro: "A store needs to match how your business sells: product variants, stock, delivery and payment. We plan the storefront around those operations so browsing and order handling fit together.",
        problem: "A demo checkout does not establish that payment collection or inventory synchronisation is connected. We identify what the demonstration covers and which production services need separate integration.",
        included: ["Catalogue structure, categories and product pages.", "Cart and order journey based on the agreed requirements.", "Scope for payment, delivery or inventory integrations where required.", "Checks for orders, failure states and customer confirmations."],
        process: ["Map products, variants and delivery rules for your target markets.", "Confirm external providers and access to their test environments.", "Build the agreed flows and run test orders before launch."],
        quote: "Pricing depends on catalogue size, data migration and integrations. Payment provider fees, delivery charges and external subscriptions are clarified separately from development.",
        faq: [{ q: "Does a catalogue demo process real payments?", a: "Do not assume so from its interface. Live payments require a merchant account, integration and testing with the selected provider." }, { q: "Can you migrate an existing product catalogue?", a: "We can assess an import after reviewing its source and field structure. Category mapping, variants and data cleanup affect the scope." }],
      },
    },
  },
  {
    slug: "web-applications",
    categories: ["CRM & Sales", "Service Management", "Calendar & Events"],
    content: {
      ro: {
        seo: { title: "Dezvoltare aplicații și platforme web în Moldova", description: "Platforme și aplicații web MONO/DEV pentru procesele afacerii: roluri, date și fluxuri de lucru. Discută funcțiile și integrările pentru o ofertă." },
        title: "Dezvoltare aplicații și platforme web",
        description: "Aplicații web pentru fluxuri de lucru: roluri, date, stări și integrări definite clar înainte de dezvoltare și lansare.",
        intro: "Când activitatea depinde de tabele, mesaje și transferuri manuale, o aplicație web poate aduce pașii într-un singur flux. Pornim de la cine folosește sistemul și ce trebuie să poată face fiecare persoană.",
        problem: "Un tablou de bord poate arăta convingător fără să rezolve regulile din spate. Identificăm datele, permisiunile, excepțiile și sistemele existente înainte să alegem arhitectura și ecranele.",
        included: ["Scenarii de utilizare și roluri pentru versiunea agreată.", "Interfețe, stări goale, erori și confirmări.", "Plan pentru date, autentificare și integrări necesare.", "Verificări ale fluxurilor principale și condiții de predare."],
        process: ["Descriem un flux complet, de la intrare până la rezultat.", "Separăm funcțiile necesare lansării de extinderile ulterioare.", "Implementăm și validăm scenariile cu date de test."],
        quote: "Estimăm după fluxuri, roluri, volum de date și sisteme conectate. O interfață demonstrativă din catalog poate fi punct de plecare, dar nu dovedește existența unui backend de producție.",
        faq: [{ q: "Poate aplicația folosi CRM-ul pe care îl avem?", a: "Evaluăm documentația și accesul la API. Compatibilitatea, limitele și costurile furnizorului trebuie confirmate înainte de a promite integrarea." }, { q: "Putem începe cu o versiune mai mică?", a: "Da. Definim un flux util și verificabil pentru prima versiune, apoi documentăm funcțiile care rămân pentru etapele următoare." }],
      },
      ru: {
        seo: { title: "Разработка веб-приложений и платформ в Молдове", description: "Веб-приложения и платформы MONO/DEV для рабочих процессов: роли, данные и интеграции. Обсудим функции и объём разработки перед оценкой." },
        title: "Разработка веб-приложений и платформ",
        description: "Веб-приложения для рабочих процессов: роли пользователей, данные, состояния и интеграции с понятным объемом первой версии.",
        intro: "Если работа распределена между таблицами и перепиской, веб-приложение может объединить ее в последовательный процесс. Начинаем с пользователей: кто входит в систему и какие задачи должен решать.",
        problem: "Красивый дашборд не заменяет правила обработки данных. До выбора экранов и архитектуры разбираем права доступа, исключения и связь с существующими системами.",
        included: ["Пользовательские сценарии и роли согласованной версии.", "Интерфейсы, пустые состояния, ошибки и подтверждения.", "План данных, авторизации и необходимых интеграций.", "Проверки основных процессов и условия передачи."],
        process: ["Описываем целый рабочий сценарий от начала до результата.", "Отделяем необходимое для запуска от последующих расширений.", "Реализуем и проверяем сценарии с тестовыми данными."],
        quote: "Оценка строится по процессам, ролям, данным и внешним системам. Интерфейс из каталога может стать основой, но демонстрация не подтверждает наличие готового серверного решения.",
        faq: [{ q: "Можно подключить нашу CRM?", a: "Проверим документацию и доступ к API. Совместимость, ограничения и тарифы провайдера нужно выяснить до включения интеграции в предложение." }, { q: "Можно начать с небольшой версии?", a: "Да. Выделяем полезный и проверяемый сценарий для первого запуска, а оставшиеся функции описываем как следующие этапы." }],
      },
      en: {
        seo: { title: "Web application development in Moldova", description: "MONO/DEV builds web applications around business workflows, roles and data. Discuss features, integrations and delivery scope for a custom quote." },
        title: "Web application development",
        description: "Web applications designed around operational workflows, user roles and data, with a defined first release and an explicit integration scope.",
        intro: "When work is scattered across spreadsheets and messages, a web application can make the steps easier to follow. We start by defining who uses the system and what each person needs to accomplish.",
        problem: "A polished dashboard is only one part of an application. Data rules, permissions, exceptions and existing systems determine whether a workflow can operate reliably beyond the demonstration.",
        included: ["User journeys and roles for the agreed release.", "Interfaces including empty states, errors and confirmations.", "A plan for data, authentication and required integrations.", "Key workflow checks and agreed handover criteria."],
        process: ["Describe a complete operational journey from input to outcome.", "Separate first-release requirements from later extensions.", "Implement and validate the agreed scenarios with test data."],
        quote: "We estimate by workflows, roles, data requirements and connected systems. A catalogue interface can provide a starting point, but it does not establish that a production backend is included.",
        faq: [{ q: "Can the application connect to our existing tools?", a: "We assess the provider's API documentation and access requirements first. Compatibility, limits and third-party costs must be confirmed during scoping." }, { q: "Can we start with a smaller release?", a: "Yes. We can define one useful, testable workflow for the initial release and document the remaining features for later stages." }],
      },
    },
  },
  {
    slug: "clinic-websites",
    categories: ["Clinics & Medical"],
    content: {
      ro: {
        title: "Site-uri pentru clinici și cabinete medicale",
        description: "Site-uri de clinică cu servicii explicate clar, informații verificate despre specialiști și un traseu simplu către solicitarea unei programări.",
        intro: "O persoană care caută o clinică are nevoie de informații precise despre servicii, specialiști și programare. Organizăm site-ul pentru aceste întrebări, folosind conținut medical și date confirmate de clinică.",
        problem: "Un formular de solicitare nu este același lucru cu o programare confirmată. Separăm aceste etape și stabilim ce date sunt necesare, fără să prezentăm o demonstrație drept sistem medical operațional.",
        included: ["Structură pentru specialități, servicii și profiluri aprobate de clinică.", "Pagini adaptate pentru mobil și un traseu clar către contact.", "Definirea fluxului de solicitare sau a integrării cu sistemul de programări.", "Revizuirea câmpurilor de formular și a mesajelor de confirmare."],
        process: ["Inventariem serviciile și stabilim cine validează informația medicală.", "Clarificăm dacă vizitatorul solicită o programare sau alege un interval disponibil.", "Verificăm textele, contactele și scenariul de programare înainte de lansare."],
        quote: "Oferta ține cont de numărul de specialități, limbi și integrarea de programări. Funcțiile pentru dosare medicale sau date clinice necesită analiză separată și nu sunt implicite într-un site de prezentare.",
        faq: [{ q: "Scrieți recomandări medicale pentru pagini?", a: "Conținutul medical trebuie furnizat sau validat de reprezentanții calificați ai clinicii. Putem organiza și prezenta informația, fără a inventa indicații, rezultate sau calificări." }, { q: "Pacientul primește automat o programare?", a: "Doar dacă este implementată și verificată o integrare care confirmă disponibilitatea. Într-un flux de solicitare, confirmarea vine separat de la clinică." }],
      },
      ru: {
        title: "Сайты для клиник и медицинских кабинетов",
        description: "Сайты клиник с понятными услугами, проверенными сведениями о специалистах и прозрачным процессом обращения за записью.",
        intro: "При выборе клиники человеку нужны точные сведения об услугах, специалистах и порядке записи. Организуем страницы вокруг этих вопросов, используя информацию, подтвержденную самой клиникой.",
        problem: "Заявка на прием и подтвержденная запись — разные действия. Уточняем эти этапы и необходимые поля, чтобы демонстрационный интерфейс не создавал впечатления действующей медицинской системы.",
        included: ["Страницы направлений, услуг и утвержденных профилей специалистов.", "Мобильная версия и понятные способы связи.", "Сценарий заявки или согласованная интеграция системы записи.", "Проверка полей формы и сообщений о результате обращения."],
        process: ["Собираем услуги и определяем ответственного за медицинские тексты.", "Уточняем, запрашивает ли посетитель прием или выбирает доступное время.", "Проверяем содержание, контакты и сценарий записи перед запуском."],
        quote: "Стоимость зависит от направлений, языков и системы записи. Медицинские карты и обработка клинических данных требуют отдельной оценки и не подразумеваются в обычном сайте клиники.",
        faq: [{ q: "Вы готовите медицинские рекомендации для сайта?", a: "Медицинские материалы предоставляет или проверяет квалифицированный представитель клиники. Мы помогаем со структурой, не придумывая показания, результаты лечения или квалификацию." }, { q: "Запись подтверждается автоматически?", a: "Только при подключении и проверке системы с актуальным расписанием. Если реализована заявка, клиника подтверждает время отдельно." }],
      },
      en: {
        title: "Websites for clinics and medical practices",
        description: "Clinic websites with clear service pages, approved practitioner information and an appointment journey that sets accurate expectations.",
        intro: "Patients need accurate information about services, practitioners and how to arrange a visit. We organise clinic websites around those needs using content and professional details approved by the practice.",
        problem: "An appointment request is different from a confirmed booking. We define that boundary and the information required so a demonstration form does not imply a connected clinical system.",
        included: ["Pages for specialties, services and approved practitioner profiles.", "Mobile layouts and clear contact routes.", "An appointment request journey or scoped booking integration.", "Review of form fields and confirmation messages."],
        process: ["Map the services and identify who approves clinical content.", "Confirm whether visitors request a visit or select a live appointment slot.", "Review the content, contact information and appointment journey before launch."],
        quote: "The estimate depends on specialties, languages and booking integration. Patient records and clinical data handling require a separate assessment and are not implicit in a presentation website.",
        faq: [{ q: "Do you write medical advice for the website?", a: "Clinical information must be supplied or approved by qualified representatives of the practice. We help structure it without inventing treatment claims or credentials." }, { q: "Will patients receive an automatic booking confirmation?", a: "Only when a tested integration can confirm availability. With a request-based flow, the practice confirms the appointment separately." }],
      },
    },
  },
  {
    slug: "restaurant-websites",
    categories: ["Restaurants & Food"],
    content: {
      ro: {
        title: "Site-uri pentru restaurante și cafenele",
        description: "Site-uri de restaurant cu meniu ușor de citit pe telefon, informații practice și un flux clar pentru rezervări sau comenzi.",
        intro: "Clienții verifică adesea meniul de pe telefon, înainte să decidă unde merg. Punem preparatele, programul și opțiunile de rezervare într-o structură ușor de parcurs, cu informații furnizate de local.",
        problem: "Un meniu disponibil doar ca fotografie mare este greu de consultat și actualizat. Separăm conținutul util de decor și clarificăm dacă site-ul doar preia cereri sau se conectează la un sistem de rezervări ori comenzi.",
        included: ["Meniu organizat în categorii și adaptat ecranelor mici.", "Pagini cu informațiile reale despre local și fotografiile aprobate.", "Traseu către rezervare, contact sau comandă, după scopul agreat.", "Mod de actualizare a meniului stabilit înainte de predare."],
        process: ["Colectăm meniul, limbile necesare și informațiile practice.", "Definim cum sunt preluate și confirmate rezervările sau comenzile.", "Verificăm meniul și fluxurile pe telefon, inclusiv mesajele de rezultat."],
        quote: "Estimarea depinde de mărimea meniului, limbile publicate și sistemele externe. Rezervările conectate, plățile și livrarea se evaluează separat de un site de prezentare.",
        faq: [{ q: "Pot actualiza meniul după lansare?", a: "Da, prin metoda agreată: actualizare în cod sau un sistem de administrare, dacă acesta intră în proiect. Nu presupunem că fiecare demo include un CMS." }, { q: "Cine verifică ingredientele și alergenii?", a: "Restaurantul furnizează și validează aceste informații. Site-ul le prezintă fără a deduce ingrediente sau a inventa afirmații despre preparate." }],
      },
      ru: {
        title: "Сайты для ресторанов и кафе",
        description: "Сайт ресторана с удобным меню на телефоне, актуальными сведениями о заведении и понятным путем к бронированию или заказу.",
        intro: "Гости часто смотрят меню с телефона еще до выбора заведения. Делаем блюда, часы работы и способ бронирования доступными в понятной структуре, опираясь на материалы ресторана.",
        problem: "Меню в виде большой фотографии неудобно читать и обновлять. Выделяем полезную информацию и заранее определяем, собирает ли сайт заявки или подключается к системе бронирования и заказов.",
        included: ["Меню по категориям, удобное для небольших экранов.", "Реальные сведения о заведении и согласованные фотографии.", "Переход к бронированию, обращению или заказу по выбранному сценарию.", "Согласованный способ обновления меню после передачи."],
        process: ["Собираем меню, нужные языки и сведения для гостей.", "Определяем прием и подтверждение бронирований или заказов.", "Проверяем меню и сценарии на телефоне, включая итоговые сообщения."],
        quote: "Оценка зависит от меню, языков и внешних систем. Подключенное бронирование, платежи и доставка рассматриваются отдельно от презентационных страниц.",
        faq: [{ q: "Можно самостоятельно менять меню?", a: "Способ обновления согласуется заранее: изменения в коде или система управления, если она входит в объем. Наличие CMS нельзя предполагать по демонстрации." }, { q: "Кто отвечает за сведения об аллергенах?", a: "Ингредиенты и аллергены предоставляет и проверяет ресторан. При оформлении сайта эти данные не додумываются." }],
      },
      en: {
        title: "Restaurant and café websites",
        description: "Restaurant websites with readable mobile menus, practical venue information and a clear route to reservations or ordering.",
        intro: "Guests often browse a menu on their phones before deciding where to go. We make dishes, opening information and reservation options easy to find using content supplied by the venue.",
        problem: "A large menu photograph is difficult to read and maintain. We organise the information into usable pages and establish whether reservations or orders are requests or connected operational services.",
        included: ["A categorised menu designed for small screens.", "Verified venue information and approved photography.", "A route to reservations, contact or ordering for the agreed use case.", "An agreed approach to updating the menu after handover."],
        process: ["Collect the menu, required languages and practical visitor information.", "Define how reservations or orders are received and confirmed.", "Check mobile browsing and the messages shown at each step."],
        quote: "The quote reflects menu size, languages and external systems. Connected booking, payment and delivery functions are assessed separately from presentation pages.",
        faq: [{ q: "Can we update the menu after launch?", a: "Yes, using the agreed method: code updates or a content management system if included. A CMS should not be assumed from a demo interface." }, { q: "Who checks ingredient and allergen information?", a: "The restaurant supplies and approves it. We present that information without inferring ingredients or creating unsupported food claims." }],
      },
    },
  },
  {
    slug: "real-estate-websites",
    categories: ["Real Estate"],
    content: {
      ro: {
        title: "Site-uri pentru imobiliare",
        description: "Cataloage imobiliare cu pagini pentru proprietăți, filtre utile și cereri de vizionare. Definim sursa anunțurilor și actualizarea disponibilității.",
        intro: "Un vizitator trebuie să compare proprietăți după criterii concrete: localizare, suprafață, preț și disponibilitate. Construim structura care face această comparație posibilă și duce spre o cerere relevantă de vizionare.",
        problem: "Anunțurile fără date coerente sau fără statut actualizat generează solicitări pentru oferte care nu mai există. Stabilim de unde vin datele și cine menține disponibilitatea, înainte să proiectăm filtrele.",
        included: ["Pagini de proprietate cu câmpuri și fotografii agreate.", "Filtre bazate pe datele reale ale catalogului.", "Traseu către agent sau solicitarea unei vizionări.", "Reguli pentru actualizare și tratarea anunțurilor retrase."],
        process: ["Verificăm sursa anunțurilor și câmpurile disponibile.", "Definim criteriile de căutare și modul de actualizare.", "Testăm căutarea, paginile de proprietate și cererile de contact."],
        quote: "Oferta depinde de volumul și sursa anunțurilor, filtre și integrări CRM. Importul dintr-un sistem existent se estimează după verificarea accesului și a structurii datelor.",
        faq: [{ q: "Proprietățile din demo sunt oferte reale?", a: "Sunt exemple demonstrative, nu un portofoliu confirmat al MONO/DEV. La personalizare se folosesc doar anunțurile și materialele autorizate de afacerea ta." }, { q: "Pot sincroniza anunțurile cu un CRM?", a: "Posibilitatea se stabilește după analiza API-ului sau a exporturilor disponibile. Frecvența sincronizării și gestionarea ofertelor retrase trebuie definite explicit." }],
      },
      ru: {
        title: "Сайты для недвижимости",
        description: "Каталоги недвижимости с карточками объектов, полезными фильтрами и заявками на просмотр. Планируем источник и обновление объявлений.",
        intro: "Покупателю или арендатору нужны сопоставимые данные: расположение, площадь, цена и статус объекта. Создаем структуру для такого сравнения и перехода к содержательной заявке на просмотр.",
        problem: "Разные форматы данных и устаревший статус вызывают обращения по недоступным объектам. Сначала определяем источник объявлений и ответственного за обновление, затем строим поиск.",
        included: ["Карточки объектов с согласованными полями и фотографиями.", "Фильтры на основе фактических данных каталога.", "Обращение к представителю или заявка на просмотр.", "Правила обновления и обработки снятых объявлений."],
        process: ["Проверяем источник объявлений и доступные поля.", "Определяем критерии поиска и порядок обновления.", "Тестируем поиск, страницы объектов и обращения."],
        quote: "Оценка зависит от объема и источника объявлений, фильтров и CRM. Импорт из существующей системы рассчитывается после проверки доступа и структуры данных.",
        faq: [{ q: "Объекты в демо действительно продаются?", a: "Это демонстрационные примеры, а не подтвержденный портфель MONO/DEV. При адаптации используются объявления и материалы, на которые у вашего бизнеса есть разрешение." }, { q: "Можно синхронизировать объявления с CRM?", a: "Это определяется после изучения API или доступных экспортов. Частота обновления и обработка снятых объектов согласуются отдельно." }],
      },
      en: {
        title: "Real estate websites",
        description: "Property websites with useful listing pages, filters and viewing enquiries, supported by an explicit plan for listing data and availability updates.",
        intro: "Property visitors compare specific details: location, floor area, price and availability. We structure that information so they can narrow their choices and make a relevant viewing enquiry.",
        problem: "Inconsistent listing data and outdated status produce enquiries for unavailable properties. Before designing filters, we establish where listings come from and who keeps them current.",
        included: ["Property pages with agreed data fields and photography.", "Filters supported by the actual listing data.", "A route to an agent or viewing request.", "Rules for updates and withdrawn listings."],
        process: ["Review the listing source and available fields.", "Define search criteria and the update process.", "Test discovery, property pages and contact journeys."],
        quote: "We quote based on listing volume and source, filters and CRM integration. Imports are assessed after reviewing access and the structure of the existing data.",
        faq: [{ q: "Are the properties in the demos real listings?", a: "They are demonstration examples, not a verified MONO/DEV property portfolio. Customisation uses listing data and assets authorised by your business." }, { q: "Can the site synchronise with our CRM?", a: "We assess this from the available API or exports. Update frequency and handling of withdrawn listings need an explicit specification." }],
      },
    },
  },
  {
    slug: "launch-ready-websites",
    categories: ["Gardens & Landscaping", "Hotels & Travel", "Restaurants & Food"],
    content: {
      ro: {
        title: "Site-uri gata de lansare, adaptate afacerii tale",
        description: "Alege o bază demonstrativă din catalog și verifică ce trebuie adaptat pentru lansare: brand, conținut, integrări, domeniu și predare.",
        intro: "Un proiect din catalog îți permite să vezi direcția înainte de a începe. Poți evalua structura, ecranele și interacțiunile existente, apoi alegem ce se păstrează și ce trebuie adaptat pentru afacerea ta.",
        problem: "«Gata de lansare» descrie o bază pregătită pentru adaptare, nu publicarea automată a unei afaceri cu date demonstrative. Conținutul, contactele și conexiunile externe trebuie verificate pentru utilizarea reală.",
        included: ["Compararea proiectului ales cu cerințele afacerii.", "Lista de înlocuiri pentru brand, texte, fotografii și contacte.", "Clarificarea funcțiilor demonstrative și a integrărilor necesare.", "Verificarea versiunii personalizate și pașii de predare agreați."],
        process: ["Alegi proiectul și verifici pagina lui permanentă și demo-ul.", "Stabilim diferențele dintre demonstrație și lansarea dorită.", "Adaptăm, verificăm și publicăm în condițiile convenite."],
        quote: "Prețul de bază este cel afișat pentru proiect. Personalizarea și serviciile externe se clarifică separat. Chiria sau ratele se discută doar pentru opțiunile și proiectele eligibile prezentate în catalog.",
        faq: [{ q: "Pot publica imediat varianta din demo?", a: "Înainte de publicare trebuie înlocuite informațiile demonstrative și verificate drepturile asupra materialelor, contactele și funcțiile necesare. Termenul se confirmă după această evaluare." }, { q: "Este demo-ul un proiect realizat pentru un client?", a: "Catalogul prezintă produse demonstrative. Un demo nu este prezentat drept lucrare pentru un client sau drept dovadă de rezultate comerciale." }],
      },
      ru: {
        title: "Готовые сайты с адаптацией к вашему бизнесу",
        description: "Выберите основу из каталога и уточните путь к запуску: фирменный стиль, содержание, интеграции, домен и передача проекта.",
        intro: "Проект из каталога позволяет оценить направление заранее. Вы видите структуру, экраны и существующие взаимодействия, после чего определяете, что подходит бизнесу и что нужно изменить.",
        problem: "Готовность к запуску означает основу для адаптации, а не автоматическую публикацию с демонстрационными данными. Для реальной работы нужно проверить содержание, контакты и подключения внешних сервисов.",
        included: ["Сопоставление выбранного проекта с задачами бизнеса.", "Список замен бренда, текстов, фотографий и контактов.", "Уточнение демонстрационных функций и нужных интеграций.", "Проверка адаптированной версии и согласованные шаги передачи."],
        process: ["Выбираете проект и изучаете его отдельную страницу и демо.", "Определяем разницу между демонстрацией и нужным запуском.", "Адаптируем, проверяем и публикуем на согласованных условиях."],
        quote: "Базовая цена указана на странице проекта. Адаптация и внешние сервисы уточняются отдельно. Аренда и рассрочка рассматриваются только для подходящих проектов и вариантов из каталога.",
        faq: [{ q: "Можно сразу опубликовать демо?", a: "Перед публикацией нужно заменить примерные сведения, проверить права на материалы, контакты и необходимые функции. Срок определяется после этой проверки." }, { q: "Демо — это работа для реального клиента?", a: "Каталог представляет демонстрационные продукты. Демонстрация не выдается за клиентский кейс или доказательство коммерческих результатов." }],
      },
      en: {
        title: "Launch-ready websites",
        description: "Choose a visible website foundation and scope its launch: brand adaptation, real content, integrations, domain setup and handover.",
        intro: "A catalogue project gives you something concrete to review before development starts. Explore its structure, screens and existing interactions, then decide which parts fit your business and what needs to change.",
        problem: "Launch-ready means a foundation prepared for adaptation. It does not mean publishing a business with demonstration data or assuming that external services are already connected for your account.",
        included: ["A comparison of the selected project against your requirements.", "A replacement list for branding, copy, photography and contacts.", "Clear identification of demo behaviour and required integrations.", "Review of the adapted version and agreed handover steps."],
        process: ["Choose a project and review its dedicated page and demo.", "Identify the gap between the demonstration and your intended launch.", "Adapt, verify and publish under the agreed scope."],
        quote: "The project's page provides its base price. Customisation and external services are clarified separately. Rental or instalment options apply only where the catalogue presents eligible terms.",
        faq: [{ q: "Can I publish the demo immediately?", a: "Demonstration information must be replaced and asset rights, contacts and required functionality checked first. A launch date is confirmed after that review." }, { q: "Are these examples commissioned client projects?", a: "The catalogue contains demonstration products. A demo is not presented as a commissioned client case study or evidence of business results." }],
      },
    },
  },
  {
    slug: "website-customization",
    categories: ["Beauty & Academy", "Equipment Rental", "Interior Design"],
    content: {
      ro: {
        title: "Personalizarea unui website sau proiect existent",
        description: "Adaptăm un proiect existent la brand și la cerințe noi, după o verificare a codului, conținutului și funcțiilor care trebuie păstrate.",
        intro: "Poate ai găsit un proiect potrivit în catalog sau ai deja un website care are nevoie de schimbări. Pornim de la diferența concretă dintre ce există și ce trebuie să poată face versiunea următoare.",
        problem: "O schimbare aparent mică poate afecta pagini, date sau integrări comune. Verificăm baza existentă și delimităm modificările, pentru a putea păstra comportamentele de care afacerea depinde.",
        included: ["Analiza materialelor și a accesului necesar la proiect.", "Lista de adaptări vizuale, texte și funcții agreate.", "Implementarea modificărilor în limitele tehnice identificate.", "Verificarea zonelor schimbate și a fluxurilor conectate."],
        process: ["Trimiți linkul proiectului și lista de schimbări dorite.", "Verificăm codul disponibil, dependențele și dreptul de modificare.", "Confirmăm oferta, implementăm și comparăm rezultatul cu cerințele."],
        quote: "Estimarea se face după verificarea bazei existente. Schimbarea culorilor și textelor, o pagină nouă și o integrare nouă sunt sarcini distincte; prețul lor nu este dedus automat din costul proiectului.",
        faq: [{ q: "Lucrați și cu site-uri care nu sunt din catalog?", a: "Le putem evalua dacă există acces și drept de modificare. Compatibilitatea și starea codului stabilesc dacă adaptarea este fezabilă." }, { q: "Pot păstra adresele actuale ale paginilor?", a: "Inventariem URL-urile importante și le păstrăm când structura permite. Dacă o adresă trebuie schimbată, planificăm redirecționarea și verificarea linkurilor." }],
      },
      ru: {
        title: "Адаптация существующего сайта или проекта",
        description: "Изменения бренда, содержания и функций существующего сайта после проверки кода и процессов, которые важно сохранить.",
        intro: "Вы можете выбрать основу из каталога или обратиться с уже работающим сайтом. Начинаем с конкретной разницы между текущей версией и тем, что должна делать следующая.",
        problem: "Небольшое на вид изменение может затронуть общие страницы, данные и интеграции. Проверяем существующую основу и определяем границы работ, учитывая действующие процессы бизнеса.",
        included: ["Проверка материалов и необходимого доступа к проекту.", "Перечень согласованных изменений оформления, текстов и функций.", "Реализация с учетом выявленных технических ограничений.", "Проверка измененных частей и связанных сценариев."],
        process: ["Получаем ссылку на проект и список желаемых изменений.", "Проверяем доступный код, зависимости и права на модификацию.", "Согласуем расчет, внедряем и сверяем результат с требованиями."],
        quote: "Расчет возможен после изучения существующей основы. Замена цветов, новая страница и новая интеграция оцениваются как разные задачи; цена исходного проекта их автоматически не определяет.",
        faq: [{ q: "Вы работаете с сайтами не из вашего каталога?", a: "Можем рассмотреть их при наличии доступа и прав на изменение. Возможность адаптации зависит от технологии и состояния кода." }, { q: "Можно сохранить текущие адреса страниц?", a: "Составляем список важных URL и сохраняем их, где позволяет структура. Если адрес меняется, планируем перенаправление и проверку ссылок." }],
      },
      en: {
        title: "Website customization",
        description: "Adapt an existing website's branding, content and functionality after reviewing its code, dependencies and the journeys that need to keep working.",
        intro: "You may have selected a catalogue project or already own a website that needs changes. We start with the specific gap between the current version and the behaviour you want from the next one.",
        problem: "A small-looking change can affect shared pages, data or integrations. Reviewing the existing foundation helps define the work and protect the journeys your business already relies on.",
        included: ["Review of available materials and required project access.", "An agreed list of visual, content and functional changes.", "Implementation within the technical constraints identified.", "Checks of the changed areas and connected user journeys."],
        process: ["Share the project link and your requested changes.", "Review the available code, dependencies and modification rights.", "Agree the scope, implement and compare the result with the requirements."],
        quote: "We estimate after reviewing the existing foundation. A brand update, a new page and a new integration are different tasks; the original project price does not automatically cover them.",
        faq: [{ q: "Can you customise a site outside your catalogue?", a: "We can assess it if access and modification rights are available. Technical compatibility and code condition determine whether the work is feasible." }, { q: "Can we keep our existing page URLs?", a: "We inventory important URLs and retain them where the structure allows. Where a change is necessary, we plan redirects and link checks." }],
      },
    },
  },
  {
    slug: "website-maintenance",
    categories: ["Service Management", "Utility Management", "CRM & Sales"],
    content: {
      ro: {
        title: "Mentenanță website și suport tehnic",
        description: "Mentenanță pentru website-uri existente: evaluare tehnică, actualizări, verificarea fluxurilor importante și un scop de suport stabilit în scris.",
        intro: "După lansare, un website poate avea nevoie de actualizări, corecturi și adaptări la schimbările serviciilor externe. Începem prin a înțelege cum este publicat proiectul și care sunt funcțiile importante pentru afacere.",
        problem: "Fără o evidență a accesului, dependențelor și responsabilităților, o intervenție simplă devine greu de estimat. Definim ce intră în mentenanță și cum se diferențiază o eroare de o funcție nouă.",
        included: ["Evaluarea tehnică a proiectului și a modului de publicare.", "Lista actualizărilor și verificărilor convenite.", "Verificarea fluxurilor afectate după intervenție.", "Clarificarea acceselor, responsabilităților și procedurii de revenire."],
        process: ["Inventariem codul, hostingul și serviciile conectate.", "Prioritizăm problemele și stabilim limitele suportului.", "Aplicăm intervențiile agreate și documentăm verificarea."],
        quote: "Oferta poate fi pentru o intervenție concretă sau un scop recurent, după evaluare. Timpii de răspuns, programul, frecvența copiilor și costurile sunt valabile numai dacă sunt stabilite explicit; această pagină nu promite suport permanent.",
        faq: [{ q: "Include mentenanța funcții noi?", a: "Nu automat. Corecturile, actualizările și dezvoltarea nouă se delimitează în ofertă, pentru ca volumul de lucru să fie verificabil." }, { q: "Puteți prelua un site făcut de altcineva?", a: "Întâi verificăm accesul la cod, hosting, licențe și starea proiectului. După evaluare putem preciza intervențiile fezabile și eventualele condiții de preluare." }],
      },
      ru: {
        title: "Обслуживание сайтов и техническая поддержка",
        description: "Техническое обслуживание сайтов: оценка состояния, обновления, проверка важных сценариев и согласованные границы поддержки.",
        intro: "После запуска сайту могут потребоваться исправления, обновления и адаптация к внешним сервисам. Сначала изучаем способ публикации и функции, от которых зависит работа бизнеса.",
        problem: "Без списка доступов, зависимостей и ответственных даже простое вмешательство трудно оценить. Определяем состав обслуживания и разницу между исправлением и новой функциональностью.",
        included: ["Техническая оценка проекта и процесса публикации.", "Согласованный перечень обновлений и проверок.", "Проверка затронутых пользовательских сценариев.", "Уточнение доступов, ответственности и порядка отката."],
        process: ["Собираем сведения о коде, хостинге и подключенных сервисах.", "Расставляем приоритеты и определяем границы поддержки.", "Выполняем согласованные работы и фиксируем проверки."],
        quote: "После оценки возможен расчет разовой задачи или регулярного объема. Сроки ответа, график, резервное копирование и стоимость действуют только при явном согласовании; страница не обещает круглосуточную поддержку.",
        faq: [{ q: "Входят ли новые функции в обслуживание?", a: "Не автоматически. Исправления, обновления и новая разработка разграничиваются в предложении, чтобы объем можно было проверить." }, { q: "Можно передать вам сайт другого разработчика?", a: "Сначала проверяем доступ к коду и хостингу, лицензии и состояние проекта. Затем можем определить возможные работы и условия сопровождения." }],
      },
      en: {
        title: "Website maintenance and technical support",
        description: "Maintenance for existing websites, starting with a technical review and an agreed scope for updates, fixes and critical journey checks.",
        intro: "A launched website may need updates, corrections and changes as external services evolve. We first review how it is deployed and which functions matter to your day-to-day operations.",
        problem: "Without a clear record of access, dependencies and responsibilities, even a small intervention is difficult to scope. We define what maintenance covers and distinguish fixes from new development.",
        included: ["Technical review of the project and deployment process.", "An agreed list of updates and checks.", "Verification of affected user journeys after changes.", "Clarification of access, responsibilities and rollback steps."],
        process: ["Inventory the code, hosting and connected services.", "Prioritise issues and agree the support boundaries.", "Apply the scoped changes and document their verification."],
        quote: "We can scope a specific intervention or recurring work after review. Response times, coverage hours, backup frequency and costs apply only when explicitly agreed; this page does not promise around-the-clock support.",
        faq: [{ q: "Does maintenance include new features?", a: "Not automatically. Fixes, updates and new development are separated in the proposal so the scope is clear." }, { q: "Can you take over another developer's website?", a: "We first review code and hosting access, licences and project condition. That assessment establishes which work is feasible and any handover requirements." }],
      },
    },
  },
]);

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export const serviceLabels = cmsContent("services-serviceLabels", {
  ro: { title: "Servicii web pentru Moldova și colaborări internaționale", description: "De la un site de prezentare la un magazin sau o aplicație web: alege serviciul după problema pe care vrei să o rezolvi și vezi exemplele din catalog.", problem: "Ce rezolvăm", included: "Ce putem include în proiect", process: "Cum lucrăm", quote: "Cum se stabilește oferta", examples: "Exemple demonstrative relevante", examplesNote: "Exemplele din catalog ilustrează direcții de design și funcții. Sunt produse demonstrative, nu studii de caz ale unor clienți.", faq: "Întrebări despre acest serviciu", cta: "Discută cerințele proiectului", all: "Toate serviciile", detail: "Vezi proiectul", related: "Servicii conexe" },
  ru: { title: "Веб-услуги для Молдовы и международных проектов", description: "От сайта компании до интернет-магазина и веб-приложения: выберите услугу по своей задаче и изучите примеры из каталога.", problem: "Какую задачу решаем", included: "Что может войти в проект", process: "Как проходит работа", quote: "Как рассчитывается стоимость", examples: "Подходящие демонстрационные проекты", examplesNote: "Примеры показывают направления дизайна и функции. Это демонстрационные продукты, а не кейсы клиентов.", faq: "Вопросы об этой услуге", cta: "Обсудить требования к проекту", all: "Все услуги", detail: "Посмотреть проект", related: "Связанные услуги" },
  en: { title: "Website and web application services", description: "From a business website to an online store or operational application: choose a service by the problem you need to solve and explore relevant catalogue examples.", problem: "The problem we address", included: "What the project can include", process: "How the work proceeds", quote: "How we scope the quote", examples: "Relevant demonstration projects", examplesNote: "Catalogue examples illustrate design directions and functionality. They are demonstration products, not commissioned client case studies.", faq: "Questions about this service", cta: "Discuss your project requirements", all: "All services", detail: "View project", related: "Related services" },
} as const);
