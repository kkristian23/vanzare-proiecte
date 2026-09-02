const DEFAULT_LANG = 'ro';
const SUPPORTED_LANGS = ['ro', 'ru', 'en'];

const translations = {
  ro: {
    openButton: 'Deschide',
    hintText: 'Hint: Ziua ta de naștere [format: 30.12.2000]',
    pageTitleApp: 'Momentul nostru 💘',
    confirmButton: 'Confirmă',
    confirmReservation: 'Confirmă',
    pageTitleActivity: 'Alege activitatea 💫',
    activityTitle: 'Alege ce vrei să facem',
    'activityLabel_pizza': 'Pizza',
    'activityLabel_games': 'Jocuri',
    'activityLabel_film': 'Film',
    'activityLabel_walk': 'Plimbare',
    'activityLabel_coffee': 'Cafea',
    'activityLabel_music': 'Muzică',
    'activityLabel_picnic': 'Picnic',
    'activityLabel_board-games': 'Jocuri de societate',
    'activityLabel_cinema': 'Cinema',
    'activityLabel_cycling': 'Ciclism',
    'activityLabel_dessert': 'Desert',
    'activityLabel_dance': 'Dans',
    'activityLabel_karaoke': 'Karaoke',
    'activityLabel_hiking': 'Drumeție',
    'activityLabel_spa': 'Spa',
    'activityLabel_book': 'Carte',
    'activityLabel_photo': 'Foto',
    'activityLabel_beach': 'Plajă',
    'activityLabel_museum': 'Muzeu',
    'activityLabel_concert': 'Concert',
    'activityLabel_cooking': 'Gătit',
    'activityLabel_yoga': 'Yoga',
    'activityLabel_brunch': 'Brunch',
    'activityLabel_escape-room': 'Escape Room',
    'activityLabel_sushi': 'Sushi',
    'activityLabel_shopping': 'Shopping',
    'activityLabel_travel': 'Călătorie',
    'activityLabel_painting': 'Pictură',
    'activityLabel_sportik': 'Sport',
    'activityLabel_karting': 'Karting',
    'activityLabel_theater': 'Teatru',
    dateLabel: 'Data',
    timeLabel: 'Ora',
    customActivityPlaceholder: 'Scrie altă activitate aici…',
    confirmActivity: 'Confirmă activitatea',
    summaryHeading: 'Rezumatul întâlnirii',
    summaryDate: 'Data',
    summaryTime: 'Ora',
    summaryActivity: 'Activitatea',
    summaryNote: '',
    chooseModeSelf: 'Eu aleg',
    chooseModePartner: 'Partenerul alege pentru mine',
    chooseSelfHint: 'Tu alegi activitatea. Poți selecta un partener pentru a participa împreună.',
    selectPartnerWithMe: 'Particip cu:',
    partnerWithMeHint: '(Opțional) Selectează persoana cu care vrei să participi.',
    selectPartnerChoose: 'Partenerul care va alege este:',
    partnerChooseHint: 'Selectează care partener va alege activitatea pentru tine.',
    partnerNote: 'Partenerul va alege activitatea și va surprinde.',
    manualPrimaryHint: 'Scrie manual evenimentul in box. Ideile sunt optionale.',
    showActivityIdeas: 'Afiseaza idei de evenimente',
    hideActivityIdeas: 'Ascunde idei de evenimente',
    activityPartnerChoice: 'Partenerul alege pentru tine',
    selectPartner: 'Alege partenerul:',
    confirmedButton: 'Confirmat',
    pageTitleResult: 'Rezultatul întâlnirii 💌',
    resultTitle: 'Rezultatul întâlnirii',
    confirmResult: 'Confirmă întâlnirea',
    alertSelectDateTime: 'Selectează data și ora!',
    alertChooseActivity: 'Alege o activitate, te rog.',
    shareChoiceHint: 'Alege una dintre opțiuni sau lasă partenerul să decidă pentru tine.',
    multiActivityHint: 'Alege 1-3 activități',
    alertMinActivity: 'Alege cel puțin o activitate',
    alertMaxActivity: 'Poți alege maximum 3 activități',
    onboardingTitle: 'Bine ai venit! 💘',
    onboardingSubtitle: 'Cum te cheamă?',
    onboardingInfo: 'Acest nume va fi folosit pentru a identifica evenimentele tale.',
    pageTitleLogin: 'Secret ❤️',
    pageHome: 'Bine ai venit 💘',
    homeTitle: 'Momentul nostru',
    homeSubtitle: 'Ce vrei să faci?',
    homeBtnNewPlan: 'Creare eveniment nou',
    homeBtnViewPlans: 'Vizualizare planificări',
    settingsButton: 'Setări',
    settingsTitle: 'Setări',
    settingsViewPartners: 'Vizualizează partenerii',
    settingsClose: 'Închide',
    backButton: '← Înapoi',
    partnersTitle: 'Partenerii mei',
    partnersNoPartners: 'Nu s-au găsit parteneri pentru afișare.',
    partnersNicknameLabel: 'Nickname local',
    partnersSave: 'Salvează',
    partnersInfoMessage: 'Vizualizați toți partenerii din rețea și adăugați porecle locale pentru identificare mai ușoară.',
    meLabel: 'Eu',
    groupsButtonLabel: 'Grupurile mele',
    groupsTitle: 'Grupurile mele',
    groupsInfoMessage: 'Creează grupuri din partenerii tăi ca să îi selectezi rapid, dintr-un click, când creezi un eveniment nou.',
    groupsNoGroups: 'Nu ai încă niciun grup creat.',
    groupsNoPartnersAvailable: 'Nu ai parteneri disponibili pentru a crea un grup.',
    groupsNamePlaceholder: 'Numele grupului (ex: Familia)',
    groupsMembersLabel: 'Membri grup',
    groupsCreateButton: 'Creează grup',
    groupsSave: 'Salvează',
    groupsDelete: 'Șterge',
    groupsSavedSuccess: 'Grupul a fost salvat.',
    groupsDeletedConfirm: 'Sigur vrei să ștergi acest grup?',
    groupsNameRequired: 'Introdu un nume pentru grup.',
    groupsMembersRequired: 'Selectează cel puțin un membru pentru grup.',
    noGroupsQuickLabel: 'Nimeni',
    pageCalendar: 'Calendar Planificări 📅',
    ourPlanifications: 'Planificările noastre',
    createNewPlan: 'Creează planificare',
    deleteAll: '🗑️ Șterge toate',
    noPlans: 'Momentan nu ai nicio planificare!',
    noPlansDescription: 'Alege o dată și activitate pentru a crea una.',
    deleteConfirm: 'Sigur vrei să ștergi această planificare?',
    editConfirm: 'Sigur vrei să editezi această planificare?',
    deleteAllConfirm: '⚠️ Sigur vrei să ștergi TOATE planificările?',
    cannotRecover: 'Nu se mai pot recupera!',
    forMe: '🎯 Pentru mine',
    forTwoOfUs: '👩‍❤️‍👨 Pentru doi',
    viewAllPlans: '📅 Vezi toate planificările',
    pastLabel: 'În trecut',
    showPastEvents: 'Arată trecutul',
    hidePastEvents: 'Ascunde trecutul',
    withPartner: 'cu',
    notificationReminderTitle: 'Amintire eveniment',
    notificationReminderBody: 'În {minutes} minute începe: {activity}{partner}',
    notificationPermissionHint: 'Activarea notificărilor îți permite să primești mementouri cu 5, 10 sau 30 minute înainte.',
    notificationLeadTimeLabel: 'Notificare',
    notificationLeadTimeHint: 'Alege când vrei să primești memento.',
    notificationLeadTimeOptionNone: 'Fără reamintire',
    notificationLeadTimeOptionAtEvent: 'La momentul evenimentului',
    notificationLeadTimeOption5: 'Cu 5 minute înainte',
    notificationLeadTimeOption10: 'Cu 10 minute înainte',
    notificationLeadTimeOption15: 'Cu 15 minute înainte',
    notificationLeadTimeOption30: 'Cu 30 minute înainte',
    notificationLeadTimeOption60: 'Cu 1 oră înainte',
    notificationLeadTimeOption120: 'Cu 2 ore înainte',
    notificationLeadTimeOption1440: 'Cu 1 zi înainte',
    notificationLeadTimeOption2880: 'Cu 2 zile înainte',
    notificationLeadTimeOption10080: 'Cu 1 săptămână înainte',
    notificationReminderBodyAtEvent: 'Începe acum: {activity}{partner}',
    calendarWeekdayMon: 'L',
    calendarWeekdayTue: 'Ma',
    calendarWeekdayWed: 'Mi',
    calendarWeekdayThu: 'J',
    calendarWeekdayFri: 'V',
    calendarWeekdaySat: 'S',
    calendarWeekdaySun: 'D',
    calendarInactiveDateTooltip: 'Dată inactivă',
  },
  ru: {
    openButton: 'Открыть',
    hintText: 'Hint: Дата твоего рождения [формат: 30.12.2000]',
    pageTitleApp: 'Наш момент 💘',
    confirmButton: 'Подтвердить',
    confirmReservation: 'Подтвердить',
    pageTitleActivity: 'Выбери активность 💫',
    activityTitle: 'Выбери, чем хочешь заняться',
    'activityLabel_pizza': 'Пицца',
    'activityLabel_games': 'Игры',
    'activityLabel_film': 'Фильм',
    'activityLabel_walk': 'Прогулка',
    'activityLabel_coffee': 'Кофе',
    'activityLabel_music': 'Музыка',
    'activityLabel_picnic': 'Пикник',
    'activityLabel_board-games': 'Настольные игры',
    'activityLabel_cinema': 'Кино',
    'activityLabel_cycling': 'Велоспорт',
    'activityLabel_dessert': 'Десерт',
    'activityLabel_dance': 'Танцы',
    'activityLabel_karaoke': 'Караоке',
    'activityLabel_hiking': 'Поход',
    'activityLabel_spa': 'СПА',
    'activityLabel_book': 'Книга',
    'activityLabel_photo': 'Фото',
    'activityLabel_beach': 'Пляж',
    'activityLabel_museum': 'Музей',
    'activityLabel_concert': 'Концерт',
    'activityLabel_cooking': 'Готовка',
    'activityLabel_yoga': 'Йога',
    'activityLabel_brunch': 'Бранч',
    'activityLabel_escape-room': 'Квест-комната',
    'activityLabel_sushi': 'Суши',
    'activityLabel_shopping': 'Шопинг',
    'activityLabel_travel': 'Путешествие',
    'activityLabel_painting': 'Живопись',
    'activityLabel_sportik': 'Спорт',
    'activityLabel_karting': 'Картинг',
    'activityLabel_theater': 'Театр',
    dateLabel: 'Дата',
    timeLabel: 'Время',
    customActivityPlaceholder: 'Напиши другую активность…',
    confirmActivity: 'Подтвердить активность',
    summaryHeading: 'Итог встречи',
    summaryDate: 'Дата',
    summaryTime: 'Время',
    summaryActivity: 'Активность',
    summaryNote: '',
    chooseModeSelf: 'Я выбираю',
    chooseModePartner: 'Партнёр выбирает для меня',
    chooseSelfHint: 'Ты выбираешь активность. Ты можешь выбрать партнёра для участия вместе.',
    selectPartnerWithMe: 'Участвую с:',
    partnerWithMeHint: '(Опционально) Выбери человека, с которым ты хочешь участвовать.',
    selectPartnerChoose: 'Партнёр, который будет выбирать:',
    partnerChooseHint: 'Выбери, какой партнёр будет выбирать активность для тебя.',
    partnerNote: 'Партнёр выберет активность и устроит сюрприз.',
    manualPrimaryHint: 'Сначала впиши событие вручную. Идеи можно показать по желанию.',
    showActivityIdeas: 'Показать идеи событий',
    hideActivityIdeas: 'Скрыть идеи событий',
    activityPartnerChoice: 'Партнёр выбирает для тебя',
    selectPartner: 'Выбери партнёра:',
    confirmedButton: 'Подтверждено',
    pageTitleResult: 'Результат встречи 💌',
    resultTitle: 'Результат встречи',
    confirmResult: 'Подтвердить встречу',
    alertSelectDateTime: 'Выберите дату и время!',
    alertChooseActivity: 'Пожалуйста, выберите активность.',
    shareChoiceHint: 'Выберите один из вариантов или позволь партнёру решить за вас.',
    multiActivityHint: 'Выберите 1-3 активности',
    alertMinActivity: 'Выберите хотя бы одну активность',
    alertMaxActivity: 'Вы можете выбрать максимум 3 активности',
    onboardingTitle: 'Добро пожаловать! 💘',
    onboardingSubtitle: 'Как тебя зовут?',
    onboardingInfo: 'Это имя будет использоваться для определения ваших событий.',
    pageTitleLogin: 'Секрет ❤️',
    pageHome: 'Добро пожаловать 💘',
    homeTitle: 'Наш момент',
    homeSubtitle: 'Что ты хочешь сделать?',
    homeBtnNewPlan: 'Создать новое событие',
    homeBtnViewPlans: 'Просмотр планов',
    settingsButton: 'Настройки',
    settingsTitle: 'Настройки',
    settingsViewPartners: 'Показать партнёров',
    settingsClose: 'Закрыть',
    backButton: '← Назад',
    partnersTitle: 'Мои партнёры',
    partnersNoPartners: 'Партнёры для отображения не найдены.',
    partnersNicknameLabel: 'Локальный ник',
    partnersSave: 'Сохранить',
    partnersInfoMessage: 'Просмотрите всех партнеров в сети и добавьте локальные ники для более легкого выявления.',
    meLabel: 'Я',
    groupsButtonLabel: 'Мои группы',
    groupsTitle: 'Мои группы',
    groupsInfoMessage: 'Создавайте группы из ваших партнёров, чтобы быстро выбирать их одним кликом при создании нового события.',
    groupsNoGroups: 'У вас пока нет ни одной группы.',
    groupsNoPartnersAvailable: 'Нет доступных партнёров для создания группы.',
    groupsNamePlaceholder: 'Название группы (напр. Семья)',
    groupsMembersLabel: 'Участники группы',
    groupsCreateButton: 'Создать группу',
    groupsSave: 'Сохранить',
    groupsDelete: 'Удалить',
    groupsSavedSuccess: 'Группа сохранена.',
    groupsDeletedConfirm: 'Вы уверены, что хотите удалить эту группу?',
    groupsNameRequired: 'Введите название группы.',
    groupsMembersRequired: 'Выберите хотя бы одного участника для группы.',
    noGroupsQuickLabel: 'Никого',
    pageCalendar: 'Календарь планов 📅',
    ourPlanifications: 'Наши планы',
    createNewPlan: 'Создать план',
    deleteAll: '🗑️ Удалить все',
    noPlans: 'Пока у вас нет никаких планов!',
    noPlansDescription: 'Выберите дату и активность, чтобы создать его.',
    deleteConfirm: 'Вы уверены, что хотите удалить этот план?',
    editConfirm: 'Вы уверены, что хотите отредактировать этот план?',
    deleteAllConfirm: '⚠️ Вы уверены, что хотите удалить ВСЕ планы?',
    cannotRecover: 'Они больше не смогут быть восстановлены!',
    forMe: '🎯 Для меня',
    forTwoOfUs: '👩‍❤️‍👨 Для нас двоих',
    viewAllPlans: '📅 Просмотр всех планов',
    pastLabel: 'В прошлом',
    showPastEvents: 'Показать прошлое',
    hidePastEvents: 'Скрыть прошлое',
    withPartner: 'с',
    notificationReminderTitle: 'Напоминание о событии',
    notificationReminderBody: 'Через {minutes} минут начнётся: {activity}{partner}',
    notificationReminderBodyAtEvent: 'Сейчас начинается: {activity}{partner}',
    notificationPermissionHint: 'Включите уведомления, чтобы получать напоминания за 5, 10 или 30 минут до события.',
    notificationLeadTimeLabel: 'Уведомление',
    notificationLeadTimeHint: 'Выберите, когда вы хотите получать напоминание.',
    notificationLeadTimeOptionNone: 'Без напоминания',
    notificationLeadTimeOptionAtEvent: 'В момент события',
    notificationLeadTimeOption5: 'За 5 минут',
    notificationLeadTimeOption10: 'За 10 минут',
    notificationLeadTimeOption15: 'За 15 минут',
    notificationLeadTimeOption30: 'За 30 минут',
    notificationLeadTimeOption60: 'За 1 час',
    notificationLeadTimeOption120: 'За 2 часа',
    notificationLeadTimeOption1440: 'За 1 день',
    notificationLeadTimeOption2880: 'За 2 дня',
    notificationLeadTimeOption10080: 'За 1 неделю',
    calendarWeekdayMon: 'Пн',
    calendarWeekdayTue: 'Вт',
    calendarWeekdayWed: 'Ср',
    calendarWeekdayThu: 'Чт',
    calendarWeekdayFri: 'Пт',
    calendarWeekdaySat: 'Сб',
    calendarWeekdaySun: 'Вс',
    calendarInactiveDateTooltip: 'Неактивная дата',
  },
  en: {
    openButton: 'Open',
    hintText: 'Hint: Your birthday [format: 30.12.2000]',
    pageTitleApp: 'Our moment 💘',
    confirmButton: 'Confirm',
    confirmReservation: 'Confirm',
    pageTitleActivity: 'Choose an activity 💫',
    activityTitle: 'Choose what you want to do',
    'activityLabel_pizza': 'Pizza',
    'activityLabel_games': 'Games',
    'activityLabel_film': 'Movie',
    'activityLabel_walk': 'Walk',
    'activityLabel_coffee': 'Coffee',
    'activityLabel_music': 'Music',
    'activityLabel_picnic': 'Picnic',
    'activityLabel_board-games': 'Board games',
    'activityLabel_cinema': 'Cinema',
    'activityLabel_cycling': 'Cycling',
    'activityLabel_dessert': 'Dessert',
    'activityLabel_dance': 'Dance',
    'activityLabel_karaoke': 'Karaoke',
    'activityLabel_hiking': 'Hiking',
    'activityLabel_spa': 'Spa',
    'activityLabel_book': 'Book',
    'activityLabel_photo': 'Photo',
    'activityLabel_beach': 'Beach',
    'activityLabel_museum': 'Museum',
    'activityLabel_concert': 'Concert',
    'activityLabel_cooking': 'Cooking',
    'activityLabel_yoga': 'Yoga',
    'activityLabel_brunch': 'Brunch',
    'activityLabel_escape-room': 'Escape Room',
    'activityLabel_sushi': 'Sushi',
    'activityLabel_shopping': 'Shopping',
    'activityLabel_travel': 'Travel',
    'activityLabel_painting': 'Painting',
    'activityLabel_sportik': 'Sport',
    'activityLabel_karting': 'Karting',
    'activityLabel_theater': 'Theater',
    dateLabel: 'Date',
    timeLabel: 'Time',
    customActivityPlaceholder: 'Write another activity here…',
    confirmActivity: 'Confirm activity',
    summaryHeading: 'Meeting summary',
    summaryDate: 'Date',
    summaryTime: 'Time',
    summaryActivity: 'Activity',
    summaryNote: '',
    chooseModeSelf: 'I choose',
    chooseModePartner: 'Partner chooses for me',
    chooseSelfHint: 'You choose the activity. You can select a partner to join you.',
    selectPartnerWithMe: 'Participate with:',
    partnerWithMeHint: '(Optional) Select the person you want to participate with.',
    selectPartnerChoose: 'The partner who will choose is:',
    partnerChooseHint: 'Select which partner will choose the activity for you.',
    partnerNote: 'The partner will choose the activity and surprise you.',
    manualPrimaryHint: 'Write the event manually first. Ideas are optional.',
    showActivityIdeas: 'Show event ideas',
    hideActivityIdeas: 'Hide event ideas',
    activityPartnerChoice: 'Partner chooses for you',
    selectPartner: 'Choose a partner:',
    confirmedButton: 'Confirmed',
    pageTitleResult: 'Meeting result 💌',
    resultTitle: 'Meeting result',
    confirmResult: 'Confirm meeting',
    alertSelectDateTime: 'Select date and time!',
    alertChooseActivity: 'Please choose an activity.',
    shareChoiceHint: 'Choose one of the options or let your partner decide for you.',
    multiActivityHint: 'Choose 1-3 activities',
    alertMinActivity: 'Choose at least one activity',
    alertMaxActivity: 'You can choose a maximum of 3 activities',
    onboardingTitle: 'Welcome! 💘',
    onboardingSubtitle: 'What is your name?',
    onboardingInfo: 'This name will be used to identify your events.',
    pageTitleLogin: 'Secret ❤️',
    pageHome: 'Welcome 💘',
    homeTitle: 'Our moment',
    homeSubtitle: 'What do you want to do?',
    homeBtnNewPlan: 'Create a new event',
    homeBtnViewPlans: 'View plans',
    settingsButton: 'Settings',
    settingsTitle: 'Settings',
    settingsViewPartners: 'View partners',
    settingsClose: 'Close',
    backButton: '← Back',
    partnersTitle: 'My partners',
    partnersNoPartners: 'No partners found to display.',
    partnersNicknameLabel: 'Local nickname',
    partnersSave: 'Save',
    partnersInfoMessage: 'Browse all partners in the network and add local nicknames for easier identification.',
    meLabel: 'Me',
    groupsButtonLabel: 'My groups',
    groupsTitle: 'My groups',
    groupsInfoMessage: 'Create groups from your partners to quickly select them with one click when creating a new event.',
    groupsNoGroups: 'You have no groups yet.',
    groupsNoPartnersAvailable: 'No partners available to create a group.',
    groupsNamePlaceholder: 'Group name (e.g. Family)',
    groupsMembersLabel: 'Group members',
    groupsCreateButton: 'Create group',
    groupsSave: 'Save',
    groupsDelete: 'Delete',
    groupsSavedSuccess: 'Group saved.',
    groupsDeletedConfirm: 'Are you sure you want to delete this group?',
    groupsNameRequired: 'Enter a name for the group.',
    groupsMembersRequired: 'Select at least one member for the group.',
    noGroupsQuickLabel: 'Nobody',
    pageCalendar: 'Schedule calendar 📅',
    ourPlanifications: 'Our plans',
    createNewPlan: 'Create plan',
    deleteAll: '🗑️ Delete all',
    noPlans: 'You currently have no plans!',
    noPlansDescription: 'Choose a date and activity to create one.',
    deleteConfirm: 'Are you sure you want to delete this plan?',
    editConfirm: 'Are you sure you want to edit this plan?',
    deleteAllConfirm: '⚠️ Are you sure you want to delete ALL plans?',
    cannotRecover: 'They can no longer be recovered!',
    forMe: '🎯 For me',
    forTwoOfUs: '👩‍❤️‍👨 For both of us',
    viewAllPlans: '📅 View all plans',
    pastLabel: 'In the past',
    showPastEvents: 'Show past',
    hidePastEvents: 'Hide past',
    withPartner: 'with',
    notificationReminderTitle: 'Event reminder',
    notificationReminderBody: 'In {minutes} minutes starts: {activity}{partner}',
    notificationReminderBodyAtEvent: 'Starting now: {activity}{partner}',
    notificationPermissionHint: 'Enable notifications to receive reminders 5, 10 or 30 minutes before the event.',
    notificationLeadTimeLabel: 'Alert',
    notificationLeadTimeHint: 'Choose when you want to receive a reminder.',
    notificationLeadTimeOptionNone: 'No reminder',
    notificationLeadTimeOptionAtEvent: 'At time of event',
    notificationLeadTimeOption5: '5 minutes before',
    notificationLeadTimeOption10: '10 minutes before',
    notificationLeadTimeOption15: '15 minutes before',
    notificationLeadTimeOption30: '30 minutes before',
    notificationLeadTimeOption60: '1 hour before',
    notificationLeadTimeOption120: '2 hours before',
    notificationLeadTimeOption1440: '1 day before',
    notificationLeadTimeOption2880: '2 days before',
    notificationLeadTimeOption10080: '1 week before',
    calendarWeekdayMon: 'Mo',
    calendarWeekdayTue: 'Tu',
    calendarWeekdayWed: 'We',
    calendarWeekdayThu: 'Th',
    calendarWeekdayFri: 'Fr',
    calendarWeekdaySat: 'Sa',
    calendarWeekdaySun: 'Su',
    calendarInactiveDateTooltip: 'Inactive date',
  }
};


function getSavedLang() {
  const lang = localStorage.getItem('siteLang');
  return SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
}

function getCurrentLang() {
  return getSavedLang();
}

function getLocale() {
  const current = getCurrentLang();
  if (current === 'ru') return 'ru-RU';
  if (current === 'en') return 'en-US';
  return 'ro-RO';
}

function translate(key) {
  const lang = getCurrentLang();
  return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
}

function applyTranslations() {
  const lang = getCurrentLang();
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = translations[lang][el.dataset.i18n];
    if (value !== undefined) {
      el.innerText = value;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const value = translations[lang][el.dataset.i18nPlaceholder];
    if (value !== undefined) {
      el.placeholder = value;
    }
  });

  document.querySelectorAll('[data-title-key]').forEach(el => {
    const value = translations[lang][el.dataset.titleKey];
    if (value !== undefined) {
      document.title = value;
    }
  });

  document.querySelectorAll('[data-lang]').forEach(button => {
    button.classList.toggle('active', button.dataset.lang === lang);
  });
}

function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) {
    lang = DEFAULT_LANG;
  }

  localStorage.setItem('siteLang', lang);
  if (typeof isFirebaseAvailable === 'function' && isFirebaseAvailable()
    && typeof getCurrentUserId === 'function' && typeof getUserProfileRef === 'function') {
    const userId = getCurrentUserId();
    const profileRef = userId ? getUserProfileRef(userId) : null;
    if (profileRef) {
      profileRef.update({ language: lang }).catch(error => {
        console.warn('Could not save language preference:', error);
      });
    }
  }
  applyTranslations();

  const event = new Event('languageChanged');
  window.dispatchEvent(event);
}

function buildLanguageSwitcher() {
  const container = document.getElementById('languageSwitcher');
  if (!container) return;

  container.innerHTML = '';

  const languageLabels = {
    ro: 'Română',
    ru: 'Русский',
    en: 'English'
  };

  SUPPORTED_LANGS.forEach(lang => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.lang = lang;
    button.className = 'lang-button';
    button.setAttribute('aria-label', `Schimbă limba în ${languageLabels[lang]}`);
    button.innerHTML = `<span class="language-option-code">${lang.toUpperCase()}</span>`;
    button.addEventListener('click', () => setLanguage(lang));
    container.appendChild(button);
  });
}

function initLanguage() {
  buildLanguageSwitcher();
  setLanguage(getSavedLang());
}

window.addEventListener('DOMContentLoaded', initLanguage);
