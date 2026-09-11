import { cmsContent } from "./cms-store";
import type { Locale } from "./site-config";

export const trustPaths = ["about", "process", "privacy", "terms", "cookies"] as const;
export type TrustPath = (typeof trustPaths)[number];
export type TrustContent = { title: string; description: string; sections: { title: string; paragraphs: string[] }[] };

export const trustContent: Record<Locale, Record<TrustPath, TrustContent>> = cmsContent("trust-content-trustContent", {
  ro: {
    about: {
      title: "Despre MONO/DEV",
      description: "MONO/DEV prezintă proiecte web demonstrative și servicii de personalizare pentru afaceri din Moldova și colaborări internaționale.",
      sections: [
        { title: "Ce este MONO/DEV", paragraphs: ["MONO/DEV este brandul acestui catalog de proiecte digitale și al serviciilor de dezvoltare și personalizare prezentate pe site. Catalogul include site-uri de prezentare, magazine și interfețe de aplicații pentru domenii diferite.", "Exemplele sunt produse demonstrative pe care le poți examina înainte de a discuta un proiect. Nu reprezintă automat lucrări comandate de clienți, afaceri active sau rezultate comerciale obținute."] },
        { title: "Pentru cine construim", paragraphs: ["Ne adresăm afacerilor care au nevoie de o prezentare online, unui catalog de produse sau unui flux de lucru digital. Site-ul este disponibil în română, rusă și engleză, pentru Moldova și colaborare internațională.", "Alegerea se face după activitate, public și funcțiile necesare. O clinică, un restaurant și un catalog imobiliar au cerințe diferite, chiar dacă toate sunt accesate din browser."] },
        { title: "De la demonstrație la proiectul tău", paragraphs: ["Putem porni de la structura unui proiect existent sau de la cerințe pentru o construcție personalizată. Stabilim ce păstrăm, ce înlocuim cu materialele afacerii și ce dezvoltăm suplimentar.", "Brandul, textele, imaginile, contactele și integrările se verifică pentru utilizarea reală. Funcțiile demonstrative nu sunt presupuse a fi servicii de producție conectate."] },
        { title: "O discuție concretă", paragraphs: ["Trimite un link din catalog sau descrie activitatea, publicul și rezultatul dorit. Datele de contact publice sunt pe pagina Contact; pentru email poți folosi monodev@gmail.com."] },
      ],
    },
    process: {
      title: "Procesul de lucru",
      description: "Cum trece un proiect de la cerințe la lansare: alegere, ofertă, conținut, personalizare, verificare și predare cu responsabilități clare.",
      sections: [
        { title: "1. Cerințe și alegerea direcției", paragraphs: ["Pornim de la activitate, public, funcțiile necesare și materialele existente. Dacă ai ales un proiect din catalog, comparăm demonstrația cu cerințele tale și notăm diferențele."] },
        { title: "2. Ofertă și limitele proiectului", paragraphs: ["Stabilim paginile, limbile, adaptările și integrările propuse. Costul, termenul, drepturile de utilizare, opțiunea de plată și responsabilitățile se clarifică înainte de începerea lucrului.", "Prețul din catalog nu înseamnă că orice funcție nouă sau abonament extern este inclus. Aceste elemente trebuie identificate separat în oferta concretă."] },
        { title: "3. Materiale și personalizare", paragraphs: ["Pregătim conținutul real al afacerii: logo, texte, fotografii autorizate și contacte. Pentru informații medicale, produse, proprietăți sau alte date de specialitate, afacerea validează corectitudinea.", "Adaptăm ecranele și implementăm funcțiile agreate. O schimbare nouă de scop se evaluează înainte de a modifica așteptările de cost și termen."] },
        { title: "4. Revizuire înainte de lansare", paragraphs: ["Verificăm paginile și fluxurile importante: navigare, afișare pe telefon, formulare și linkuri. Integrările reale se testează cu accesul și mediile disponibile pentru proiect.", "Varianta pregătită se revizuiește înainte de publicare. Lansarea depinde de materialele, accesul și aprobările necesare, nu de o durată universală promisă pe site."] },
        { title: "5. Publicare și predare", paragraphs: ["Publicarea, accesul la proiect și documentația de predare urmează pachetul agreat. Pentru mentenanță se definesc separat intervențiile, responsabilitățile și condițiile de suport."] },
      ],
    },
    privacy: {
      title: "Politica de confidențialitate",
      description: "Cum funcționează contactul, stocarea locală, demonstrațiile și analiza opțională a vizitelor pe site-ul MONO/DEV.",
      sections: [
        { title: "Contact și informațiile oferite de tine", paragraphs: ["Adresa publică pentru întrebări despre datele personale este monodev@gmail.com. Când ne scrii, mesajul poate include numele, adresa de email, bugetul și detaliile proiectului pe care alegi să le furnizezi.", "Formularul de contact pregătește un mesaj în aplicația ta de email printr-un link mailto. Site-ul nu trimite acel mesaj printr-un formular conectat la un server. Îl verifici și îl trimiți din aplicația de email; deschiderea aplicației nu confirmă livrarea mesajului.", "Informațiile trimise sunt necesare pentru a discuta solicitarea și eventualul proiect. Nu introduce parole, date de plată sau date sensibile în câmpurile de brief."] },
        { title: "Preferințe în browser", paragraphs: ["Site-ul poate reține limba aleasă și preferința pentru analiza vizitelor în stocarea locală a browserului. Catalogul folosește și contoare locale pentru interacțiunea cu recomandările. Aceste valori locale nu reprezintă automat date trimise unui serviciu de analiză.", "Poți șterge datele site-ului din setările browserului. Preferințele pot fi resetate după ștergere. Detaliile despre analiza opțională se găsesc în pagina Cookies."] },
        { title: "Găzduire, analiză și pagini externe", paragraphs: ["Site-ul este publicat pe Netlify. Furnizarea paginilor implică procesarea tehnică a cererilor de către serviciul de găzduire; condițiile furnizorului se aplică propriei sale infrastructuri.", "Google Analytics poate fi activat numai dacă este configurat pentru această versiune și dacă accepți analiza opțională. Formularul nu este folosit pentru a transmite către analiză conținutul mesajului, numele sau adresa de email.", "Unele demonstrații se deschid pe alte domenii. Serviciile și paginile externe au propriile practici. Folosește date de test în demonstrații; nu le trata ca sisteme pentru informații personale reale."] },
        { title: "Întrebări și solicitări", paragraphs: ["Pentru clarificarea datelor trimise prin email ori pentru a solicita corectarea sau ștergerea lor, scrie la monodev@gmail.com și precizează mesajul sau contextul relevant. Nu trimite documente de identitate nesolicitate.", "Această pagină descrie funcționarea site-ului public. Prelucrarea datelor într-un proiect livrat unui client se analizează separat, în funcție de funcțiile și furnizorii acelui proiect."] },
      ],
    },
    terms: {
      title: "Termeni de utilizare și informații comerciale",
      description: "Cum se folosesc catalogul și demo-urile MONO/DEV și ce trebuie clarificat pentru preț, licență, personalizare și lansare.",
      sections: [
        { title: "Catalogul și demonstrațiile", paragraphs: ["Catalogul permite explorarea unor proiecte digitale și inițierea unei discuții despre achiziție sau personalizare. Numele, persoanele, produsele și operațiunile din demonstrații pot fi exemple, nu date despre clienți reali.", "Nu introduce informații confidențiale sau plăți reale în demo-uri. O interfață de cont, comandă ori programare nu dovedește că există un serviciu de producție conectat."] },
        { title: "Prețuri și cereri", paragraphs: ["Prețurile și opțiunile afișate pe pagina fiecărui proiect descriu oferta din catalog. Disponibilitatea și conținutul pachetului se clarifică în discuția despre proiect; personalizarea și serviciile externe pot necesita o ofertă separată.", "Selectarea unui proiect sau deschiderea mesajului de contact nu reprezintă o plată finalizată ori o confirmare automată a comenzii. Condițiile comerciale se stabilesc pentru solicitarea concretă."] },
        { title: "Licență și materiale", paragraphs: ["Drepturile de utilizare, modificare, distribuire și accesul la codul sursă trebuie precizate în acordul pentru proiect. Nu deduce exclusivitate sau drept de revânzare doar din accesul la demo.", "Pentru personalizare se folosesc materiale pe care ai dreptul să le furnizezi. Licențele componentelor, imaginilor sau serviciilor externe pot avea condiții proprii, care trebuie verificate pentru utilizarea dorită."] },
        { title: "Livrare, mentenanță și rezultate", paragraphs: ["Livrabilele, termenul, acceptarea, predarea și eventualele servicii recurente se definesc în oferta agreată. Condițiile pentru modificări, anulare sau rambursare trebuie clarificate înainte de plată, în acordul aplicabil proiectului.", "Site-ul nu garantează o poziție în Google, un volum de vânzări sau un rezultat comercial. Un proiect demonstrativ nu constituie dovadă de performanță pentru o afacere reală."] },
        { title: "Clarificări înainte de colaborare", paragraphs: ["Pentru orice neclaritate despre un proiect, preț ori condiții, scrie la monodev@gmail.com sau folosește pagina Contact. Păstrează oferta și condițiile confirmate pentru proiectul tău."] },
      ],
    },
    cookies: {
      title: "Cookies și preferințe de analiză",
      description: "Stocarea locală folosită de MONO/DEV și controlul analizei opționale Google Analytics: acceptare, refuz și schimbarea preferinței.",
      sections: [
        { title: "Ce se păstrează local", paragraphs: ["Limba aleasă poate fi păstrată în localStorage, sub cheia mono-locale. Catalogul mai poate păstra contoare locale pentru afișarea și accesarea recomandărilor. Preferința de analiză este stocată tot în browser.", "localStorage și cookies sunt mecanisme diferite. Datele din localStorage nu expiră automat în această implementare și pot fi eliminate din setările browserului sau odată cu ștergerea datelor site-ului."] },
        { title: "Analiză opțională", paragraphs: ["Dacă Google Analytics este configurat, controlul de consimțământ permite acceptarea sau refuzul analizei. Scriptul de analiză se încarcă după acceptare; navigarea în catalog și contactul rămân disponibile dacă refuzi.", "Analiza poate măsura pagini vizitate și acțiuni precum deschiderea unui proiect sau a unui demo, click pe contact și schimbarea limbii. Conținutul brief-ului și câmpurile personale nu sunt trimise ca parametri de eveniment."] },
        { title: "Cookies Google Analytics", paragraphs: ["După acceptare, GA4 poate folosi cookie-ul _ga și cookie-uri cu prefixul _ga_ pentru identificarea vizitelor și menținerea stării sesiunii. Google indică o durată implicită de doi ani; durata efectivă poate depinde de configurarea proprietății și a browserului.", "Detaliile furnizorului sunt disponibile în documentația oficială Google Analytics indicată mai jos. Dacă analiza nu este configurată, această integrare nu încarcă scriptul Google."] },
        { title: "Schimbarea alegerii", paragraphs: ["Când analiza este configurată, folosește controlul de preferințe disponibil pe site pentru a schimba alegerea. Poți șterge și cookies sau datele locale din setările browserului. Ștergerea datelor locale resetează preferința și nu șterge automat datele deja procesate de un furnizor.", "Pentru întrebări despre această implementare, scrie la monodev@gmail.com."] },
      ],
    },
  },
  ru: {
    about: {
      title: "О MONO/DEV",
      description: "MONO/DEV представляет демонстрационные веб-проекты и услуги адаптации для бизнеса в Молдове и международного сотрудничества.",
      sections: [
        { title: "Что такое MONO/DEV", paragraphs: ["MONO/DEV — бренд этого каталога цифровых проектов и представленных на сайте услуг разработки и адаптации. В каталоге есть сайты компаний, магазины и интерфейсы приложений для разных направлений бизнеса.", "Примеры — демонстрационные продукты, которые можно изучить до обсуждения проекта. Они не означают автоматически работы для клиентов, действующие компании или достигнутые коммерческие результаты."] },
        { title: "Для кого создаются проекты", paragraphs: ["Сайт предназначен для бизнеса, которому нужны представительство в интернете, товарный каталог или цифровой рабочий процесс. Материалы доступны на румынском, русском и английском для Молдовы и международного сотрудничества.", "Выбор зависит от деятельности, аудитории и необходимых функций. У клиники, ресторана и каталога недвижимости разные требования, хотя все эти продукты открываются в браузере."] },
        { title: "От демонстрации к вашему проекту", paragraphs: ["Основой может стать готовая структура из каталога или требования к индивидуальной разработке. Определяем, что сохранить, какие материалы заменить и какие функции добавить.", "Бренд, тексты, изображения, контакты и интеграции проверяются для реального использования. Демонстрационные функции не считаются автоматически подключенными рабочими сервисами."] },
        { title: "С чего начать разговор", paragraphs: ["Отправьте ссылку из каталога или опишите свою деятельность, аудиторию и желаемый результат. Актуальные способы связи указаны на странице контактов; написать можно на monodev@gmail.com."] },
      ],
    },
    process: {
      title: "Как проходит работа",
      description: "Путь проекта от требований до запуска: выбор, предложение, содержание, адаптация, проверка и передача с понятными обязанностями.",
      sections: [
        { title: "1. Требования и направление", paragraphs: ["Начинаем с деятельности, аудитории, нужных функций и готовых материалов. Если вы выбрали проект из каталога, сравниваем его демонстрацию с вашей задачей и записываем различия."] },
        { title: "2. Предложение и объем", paragraphs: ["Определяем страницы, языки, адаптацию и интеграции. Стоимость, сроки, права использования, способ оплаты и обязанности сторон уточняются до начала работ.", "Цена каталога не означает включение любой новой функции или внешней подписки. Такие позиции нужно отдельно определить в конкретном предложении."] },
        { title: "3. Материалы и адаптация", paragraphs: ["Готовим реальные материалы бизнеса: логотип, тексты, разрешенные к использованию фотографии и контакты. Медицинские сведения, данные о товарах и объектах и другую специальную информацию проверяет представитель бизнеса.", "Адаптируем экраны и реализуем согласованные функции. Новое требование оценивается до изменения ожиданий по сроку и стоимости."] },
        { title: "4. Проверка перед запуском", paragraphs: ["Проверяем страницы и основные сценарии: навигацию, мобильное отображение, формы и ссылки. Реальные интеграции тестируются с доступами и средами конкретного проекта.", "Подготовленную версию рассматривают перед публикацией. Запуск зависит от материалов, доступов и необходимых согласований, а не от универсального срока, обещанного на сайте."] },
        { title: "5. Публикация и передача", paragraphs: ["Публикация, доступ к проекту и документация следуют согласованному пакету. Для обслуживания отдельно определяются работы, ответственность и условия поддержки."] },
      ],
    },
    privacy: {
      title: "Политика конфиденциальности",
      description: "Как на сайте MONO/DEV работают обращения, локальное хранение, демонстрации и необязательный анализ посещений.",
      sections: [
        { title: "Обращения и предоставленная информация", paragraphs: ["Публичный адрес для вопросов о персональных данных — monodev@gmail.com. В отправленном сообщении могут быть имя, email, бюджет и сведения о проекте, которые вы решите указать.", "Контактная форма подготавливает сообщение в вашей почтовой программе через ссылку mailto. Сайт не отправляет его через подключенную серверную форму. Вы проверяете и отправляете письмо в своей программе; ее открытие не подтверждает доставку.", "Отправленные сведения нужны для обсуждения обращения и возможного проекта. Не вводите пароли, платежные или чувствительные данные в поля брифа."] },
        { title: "Настройки браузера", paragraphs: ["Сайт может сохранять выбранный язык и согласие на анализ посещений в локальном хранилище браузера. Каталог также использует локальные счетчики взаимодействия с рекомендациями. Эти значения сами по себе не означают передачу в систему аналитики.", "Данные сайта можно удалить в настройках браузера. После удаления предпочтения могут сброситься. Необязательная аналитика подробнее описана на странице Cookies."] },
        { title: "Хостинг, аналитика и внешние страницы", paragraphs: ["Сайт опубликован на Netlify. Доставка страниц предполагает техническую обработку запросов хостингом; к инфраструктуре провайдера применяются его условия.", "Google Analytics может включаться только при настройке для этой версии сайта и вашем согласии на необязательный анализ. Содержимое сообщения, имя и email из формы не передаются как параметры аналитики.", "Часть демонстраций открывается на других доменах с собственными практиками обработки данных. Используйте тестовые сведения и не рассматривайте демо как системы для настоящих персональных данных."] },
        { title: "Вопросы и запросы", paragraphs: ["Для уточнения отправленных по email сведений или запроса их исправления либо удаления напишите на monodev@gmail.com и укажите относящееся к вопросу письмо или контекст. Не присылайте документы, удостоверяющие личность, без запроса.", "Эта страница описывает публичный сайт. Обработка данных в клиентском проекте рассматривается отдельно с учетом его функций и провайдеров."] },
      ],
    },
    terms: {
      title: "Условия использования и коммерческая информация",
      description: "Использование каталога и демонстраций MONO/DEV: что уточнить о цене, лицензии, адаптации и запуске до начала сотрудничества.",
      sections: [
        { title: "Каталог и демонстрации", paragraphs: ["Каталог предназначен для изучения цифровых проектов и обсуждения приобретения или адаптации. Названия, люди, товары и операции в демонстрациях могут быть примерами, а не сведениями о реальных клиентах.", "Не вводите конфиденциальные данные и не совершайте реальные платежи в демо. Экран аккаунта, заказа или записи не доказывает подключение рабочего сервиса."] },
        { title: "Цены и обращения", paragraphs: ["Цены и варианты на странице проекта описывают предложение каталога. Доступность и состав пакета уточняются при обсуждении; адаптация и внешние сервисы могут потребовать отдельного расчета.", "Выбор проекта или открытие письма не являются завершенным платежом либо автоматическим подтверждением заказа. Коммерческие условия устанавливаются для конкретного обращения."] },
        { title: "Лицензия и материалы", paragraphs: ["Права использования, изменения, распространения и доступ к исходному коду определяются соглашением по проекту. Доступ к демо сам по себе не означает эксклюзивность или право перепродажи.", "Для адаптации используются материалы, которые вы вправе предоставить. У компонентов, изображений и внешних сервисов могут быть собственные лицензии, которые нужно проверить для планируемого использования."] },
        { title: "Передача, поддержка и результаты", paragraphs: ["Результаты работ, срок, приемка, передача и регулярные услуги определяются согласованным предложением. Условия изменений, отмены и возврата следует уточнить до оплаты в соглашении по проекту.", "Сайт не гарантирует позицию в Google, объем продаж или коммерческий результат. Демонстрационный продукт не служит доказательством эффективности для реального бизнеса."] },
        { title: "Уточнения до начала работы", paragraphs: ["По вопросам проекта, цены и условий напишите на monodev@gmail.com или перейдите на страницу контактов. Сохраните подтвержденное предложение и условия вашего проекта."] },
      ],
    },
    cookies: {
      title: "Cookies и настройки аналитики",
      description: "Локальные данные MONO/DEV и управление необязательным Google Analytics: согласие, отказ и изменение выбора.",
      sections: [
        { title: "Что хранится локально", paragraphs: ["Выбранный язык может сохраняться в localStorage под ключом mono-locale. Каталог также может сохранять локальные счетчики показа и открытия рекомендаций. Выбор аналитики хранится в браузере.", "localStorage и cookies — разные механизмы. Значения localStorage в этой реализации автоматически не истекают; их можно удалить в настройках браузера вместе с данными сайта."] },
        { title: "Необязательная аналитика", paragraphs: ["Если Google Analytics настроен, элемент управления согласием позволяет принять или отклонить анализ. Скрипт загружается после согласия. При отказе каталог и способы связи остаются доступны.", "Аналитика может измерять просмотр страниц, открытие проекта и демо, переход к контакту и смену языка. Текст брифа и персональные поля не передаются в параметрах событий."] },
        { title: "Cookies Google Analytics", paragraphs: ["После согласия GA4 может использовать _ga и cookies с префиксом _ga_ для различения посещений и сохранения состояния сессии. Google указывает срок по умолчанию два года; фактическая длительность может зависеть от настроек ресурса и браузера.", "Подробности есть в официальной документации Google Analytics по ссылке ниже. Если аналитика не настроена, эта интеграция не загружает скрипт Google."] },
        { title: "Изменение выбора", paragraphs: ["Когда аналитика настроена, выбор можно изменить доступным на сайте элементом управления. Cookies и локальные данные также можно удалить в настройках браузера. Это сбросит локальное предпочтение, но не удалит автоматически уже обработанные провайдером сведения.", "Вопросы об этой реализации можно направить на monodev@gmail.com."] },
      ],
    },
  },
  en: {
    about: {
      title: "About MONO/DEV",
      description: "MONO/DEV presents demonstration web projects and development services for businesses in Moldova and international collaboration.",
      sections: [
        { title: "What MONO/DEV is", paragraphs: ["MONO/DEV is the brand behind this digital project catalogue and the development and customisation services presented on the site. The catalogue includes business websites, stores and application interfaces for different industries.", "These examples are demonstration products you can inspect before discussing a project. They do not automatically represent commissioned client work, active businesses or achieved commercial results."] },
        { title: "Who the projects are for", paragraphs: ["The site serves businesses that need an online presence, a product catalogue or a digital workflow. Content is available in Romanian, Russian and English for Moldova and international collaboration.", "A suitable starting point depends on your activity, audience and required functionality. A clinic, restaurant and property catalogue have different requirements even though all are accessed in a browser."] },
        { title: "From demonstration to your project", paragraphs: ["We can begin with an existing catalogue structure or scope a custom build. We agree what stays, what changes to reflect your business and which features require additional development.", "Branding, copy, images, contacts and integrations are checked for real use. Demonstration behaviour is not assumed to be a connected production service."] },
        { title: "Start with a concrete conversation", paragraphs: ["Share a catalogue link or describe your business, audience and intended outcome. Public contact details are available on the Contact page, and you can email monodev@gmail.com."] },
      ],
    },
    process: {
      title: "Our working process",
      description: "How a project moves from requirements to launch: direction, proposal, content, customisation, review and handover with clear responsibilities.",
      sections: [
        { title: "1. Requirements and direction", paragraphs: ["Start with your activity, audience, required functions and available materials. If you have selected a catalogue project, we compare its demonstration with your requirements and record the differences."] },
        { title: "2. Proposal and scope", paragraphs: ["We define the proposed pages, languages, adaptations and integrations. Cost, timing, usage rights, payment options and responsibilities are clarified before work begins.", "A catalogue price does not imply that any new feature or external subscription is included. Those items need to be identified separately in the project proposal."] },
        { title: "3. Content and customisation", paragraphs: ["Prepare real business materials: logo, copy, authorised photography and contact details. Your business validates specialist information such as clinical content, products or property data.", "We adapt the screens and implement agreed functionality. New scope is assessed before it changes cost and schedule expectations."] },
        { title: "4. Review before launch", paragraphs: ["We check the pages and important journeys, including navigation, mobile layouts, forms and links. Live integrations are tested using the access and environments available for the project.", "The prepared version is reviewed before publication. Launch depends on required materials, access and approvals rather than a universal delivery time promised on this site."] },
        { title: "5. Publication and handover", paragraphs: ["Publication, project access and handover documentation follow the agreed package. Maintenance tasks, responsibilities and support conditions are defined separately when required."] },
      ],
    },
    privacy: {
      title: "Privacy information",
      description: "How contact requests, local browser storage, demonstrations and optional visit analytics work on the MONO/DEV website.",
      sections: [
        { title: "Contact and information you provide", paragraphs: ["The public contact address for personal data questions is monodev@gmail.com. A message you send may include your name, email address, budget and any project details you choose to provide.", "The contact form prepares a message in your email application through a mailto link. This website does not send it through a connected server form. You review and send the message in your email application; opening that application does not confirm delivery.", "Information you send is used to discuss your enquiry and potential project. Do not put passwords, payment details or sensitive information into the brief fields."] },
        { title: "Browser preferences", paragraphs: ["The site may store your selected language and analytics preference in local browser storage. The catalogue also uses local counters for interactions with recommendations. Local values do not by themselves mean that data is sent to an analytics service.", "You can remove site data through your browser settings. This may reset preferences. The Cookies page explains optional analytics in more detail."] },
        { title: "Hosting, analytics and external pages", paragraphs: ["The site is published on Netlify. Delivering pages involves technical processing of requests by the hosting service; the provider's terms apply to its infrastructure.", "Google Analytics can be enabled only when configured for this version and after you accept optional analytics. The form does not send message content, names or email addresses as analytics parameters.", "Some demonstrations open on other domains with their own practices. Use test information in demos and do not treat them as systems for real personal data."] },
        { title: "Questions and requests", paragraphs: ["To ask about information sent by email or request its correction or deletion, contact monodev@gmail.com and identify the relevant message or context. Do not send unsolicited identity documents.", "This page describes the public website. Data handling in a delivered client project is assessed separately according to that project's features and providers."] },
      ],
    },
    terms: {
      title: "Terms of use and commercial information",
      description: "Using the MONO/DEV catalogue and demonstrations, and what to clarify about pricing, licensing, customisation and launch before working together.",
      sections: [
        { title: "Catalogue and demonstrations", paragraphs: ["The catalogue lets you explore digital projects and start a discussion about acquisition or customisation. Names, people, products and operations in demonstrations may be examples rather than information about real clients.", "Do not enter confidential information or make real payments in demos. An account, checkout or booking screen does not establish that a production service is connected."] },
        { title: "Prices and enquiries", paragraphs: ["Prices and options displayed on a project page describe the catalogue offering. Availability and package contents are clarified in the project discussion; customisation and external services may require a separate proposal.", "Selecting a project or opening a contact email is not a completed payment or automatic order confirmation. Commercial terms are established for the specific enquiry."] },
        { title: "Licensing and materials", paragraphs: ["Rights to use, modify and distribute a project, and access to source code, must be specified in the project agreement. Demo access alone does not imply exclusivity or resale rights.", "Customisation uses materials you are entitled to provide. Components, images and external services may carry their own licence conditions, which need review for the intended use."] },
        { title: "Delivery, support and outcomes", paragraphs: ["Deliverables, timing, acceptance, handover and recurring services are defined in the agreed proposal. Terms for changes, cancellation or refunds should be clarified before payment in the applicable project agreement.", "This website does not guarantee a Google ranking, sales volume or commercial outcome. A demonstration project is not evidence of performance for a real business."] },
        { title: "Clarify before starting", paragraphs: ["For questions about a project, price or terms, email monodev@gmail.com or use the Contact page. Keep the confirmed proposal and terms for your project."] },
      ],
    },
    cookies: {
      title: "Cookies and analytics preferences",
      description: "Local browser data used by MONO/DEV and control of optional Google Analytics, including acceptance, refusal and changing your choice.",
      sections: [
        { title: "What is stored locally", paragraphs: ["Your selected language may be stored in localStorage under mono-locale. The catalogue may also keep local counters for showing and opening recommendations. The analytics preference is stored in your browser.", "localStorage and cookies are different mechanisms. Local storage values do not expire automatically in this implementation and can be removed through browser settings or by clearing site data."] },
        { title: "Optional analytics", paragraphs: ["When Google Analytics is configured, the consent control lets you accept or decline analytics. The script loads after acceptance. You can still browse the catalogue and use contact options if you decline.", "Analytics may measure page visits and actions such as opening a project or demo, using a contact link and changing language. Brief content and personal form fields are not sent as event parameters."] },
        { title: "Google Analytics cookies", paragraphs: ["After acceptance, GA4 may use _ga and cookies beginning with _ga_ to distinguish visits and maintain session state. Google lists a default lifetime of two years; the effective duration may depend on property and browser settings.", "The official Google Analytics documentation linked below explains the provider's cookies. When analytics is not configured, this integration does not load the Google script."] },
        { title: "Changing your choice", paragraphs: ["When analytics is configured, use the preference control on the site to change your choice. You can also clear cookies and local data in browser settings. Clearing local data resets the preference but does not automatically remove data already processed by a provider.", "For questions about this implementation, email monodev@gmail.com."] },
      ],
    },
  },
});
