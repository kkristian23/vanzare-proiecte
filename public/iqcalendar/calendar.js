// Calendar Planifications Script

let currentViewMode = 'list';
let calendarCurrentDate = new Date();
let selectedCalendarDate = null;
let renderedPlanMap = new Map();
let activeSuggestionCountsByPlan = new Map();
let stopPlanificationsListener = null;
const MANUAL_PARTNER_REMINDER_COOLDOWN_MS = 60 * 60 * 1000;
const CALENDAR_VIEW_MODE_STORAGE_KEY = 'calendarPageViewMode';

window.onload = async () => {
  if (document.getElementById('calendarReactRoot')) return;
  await initializeUser();
  applyTranslations();
  updatePastEventsToggleLabel();
  restoreCalendarViewMode();
  loadPlanifications();
};

window.addEventListener('languageChanged', updatePastEventsToggleLabel);

function getUserNotificationsRef(userId = getCurrentUserId()) {
  if (!isFirebaseAvailable() || !userId) return null;
  return rdb.ref(`notifications/${getCurrentDataScope()}/${userId}`);
}

function updatePlanSuggestionIndicators() {
  document.querySelectorAll('.plan-card[data-plan-id]').forEach(card => {
    const count = activeSuggestionCountsByPlan.get(card.dataset.planId) || 0;
    const indicator = card.querySelector('.plan-suggestions-indicator');
    if (indicator) {
      indicator.textContent = String(count);
      indicator.classList.toggle('hidden', count === 0);
    }
  });
}

window.addEventListener('social:notification-counts', event => {
  activeSuggestionCountsByPlan = new Map(Object.entries(event.detail || {}));
  updatePlanSuggestionIndicators();
});

window.openPlanFromNotification = function openPlanFromNotification(notification) {
  const plan = renderedPlanMap.get(Number(notification.planId));
  if (plan) openPlanDetails(plan, notification);
  else if (typeof showAlertApp === 'function') showAlertApp('Evenimentul nu mai este disponibil în această listă.');
};

function escapeActivityLabel(text) {
  return text.replace(/ /g, '\u00A0');
}

function getActivityText(plan) {
  if (plan.activityMode === 'partner') {
    return escapeActivityLabel(translate('activityPartnerChoice'));
  }
  if (plan.activityCustom) {
    return escapeActivityLabel(plan.activityCustom);
  }
  if (plan.activityIds && plan.activityIds.length > 0) {
    return plan.activityIds
      .map(id => {
        const translation = translate(`activityLabel_${id}`);
        const label = translation === `activityLabel_${id}` ? id : translation;
        return escapeActivityLabel(label);
      })
      .filter(Boolean)
      .join('\n');
  }
  // Backwards compatibility - dacă e vechea structură cu 'activity'
  return escapeActivityLabel(plan.activity || '');
}

// ===== MULTI-PARTNER HELPERS =====
// Plans can have a single legacy partner (partnerId/partnerName) or a list of
// partners/group (partnerIds/partnerNames). These helpers normalize both shapes.
function getPlanPartnerEntries(plan) {
  if (Array.isArray(plan.partnerIds) && plan.partnerIds.length > 0) {
    return plan.partnerIds.filter(Boolean).map((id, idx) => ({
      id,
      name: (Array.isArray(plan.partnerNames) && plan.partnerNames[idx]) || id
    }));
  }
  if (plan.partnerId) {
    return [{ id: plan.partnerId, name: plan.partnerName || plan.partnerId }];
  }
  if (plan.partnerName) {
    return [{ id: null, name: plan.partnerName }];
  }
  return [];
}

function getPlanPartnerIds(plan) {
  return getPlanPartnerEntries(plan).map(p => p.id).filter(Boolean);
}

function isCurrentUserPlanPartner(plan) {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return false;
  if (plan.partnerId === currentUserId) return true;
  return getPlanPartnerIds(plan).includes(currentUserId);
}

function buildPartnerRemovedPlan(plan, currentUserId) {
  const remaining = getPlanPartnerEntries(plan).filter(p => p.id !== currentUserId);
  const remainingIds = remaining.map(p => p.id);
  const remainingNames = remaining.map(p => p.name);
  return {
    ...plan,
    partnerIds: remainingIds,
    partnerNames: remainingNames,
    partnerId: remainingIds[0] || null,
    partnerName: remainingNames[0] || null,
    mode: 'self',
    activityMode: null,
    tags: remainingIds.length ? ['shared', 'self'] : ['self', 'personal']
  };
}

// When the owner leaves a shared event, ownership transfers to the first remaining
// partner (generalizes the previous single-partner transfer behavior for groups).
// Returns null when there is no remaining partner to transfer ownership to.
function buildOwnerLeftPlan(plan) {
  const entries = getPlanPartnerEntries(plan);
  if (entries.length === 0) return null;

  const [newOwner, ...rest] = entries;
  return {
    ...plan,
    userId: newOwner.id,
    userName: newOwner.name,
    partnerIds: rest.map(p => p.id),
    partnerNames: rest.map(p => p.name),
    partnerId: rest[0] ? rest[0].id : null,
    partnerName: rest[0] ? rest[0].name : null,
    mode: 'self',
    activityMode: null,
    tags: rest.length ? ['shared', 'self'] : ['self', 'personal']
  };
}

function getReminderRecipientsFromPlan(plan) {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return [];

  if (plan.userId === currentUserId) {
    return getPlanPartnerEntries(plan).filter(p => p.id);
  }

  if (isCurrentUserPlanPartner(plan) && plan.userId) {
    return [{ id: plan.userId, name: plan.userName || '' }];
  }

  return [];
}

function canSendManualReminder(plan) {
  if (!plan) return false;
  return getReminderRecipientsFromPlan(plan).length > 0;
}

function getManualReminderLocalStorageKey() {
  return `manualPartnerReminderLastSentAt_${getCurrentUserId() || 'anon'}`;
}

async function getLastManualReminderSentAt() {
  let localLast = 0;
  try {
    localLast = Number(localStorage.getItem(getManualReminderLocalStorageKey()) || 0);
  } catch (e) {
    localLast = 0;
  }

  if (!isFirebaseAvailable() || !getCurrentUserId()) {
    return localLast;
  }

  try {
    const scope = getCurrentDataScope();
    const snapshot = await getUserProfileRef(getCurrentUserId(), scope)
      .child('manualPartnerReminderLastSentAt')
      .once('value');
    const remoteLast = Number(snapshot.val() || 0);
    return Math.max(localLast, remoteLast);
  } catch (e) {
    return localLast;
  }
}

async function markManualReminderSent() {
  const now = Date.now();
  try {
    localStorage.setItem(getManualReminderLocalStorageKey(), String(now));
  } catch (e) {
    // ignore local storage write errors
  }

  if (isFirebaseAvailable() && getCurrentUserId()) {
    try {
      const scope = getCurrentDataScope();
      await getUserProfileRef(getCurrentUserId(), scope).update({
        manualPartnerReminderLastSentAt: now
      });
    } catch (e) {
      console.warn('Could not persist manual reminder cooldown to Firebase', e);
    }
  }
}

function formatRemainingMinutes(ms) {
  return Math.max(1, Math.ceil(ms / 60000));
}

function showReminderYesNoConfirm(message) {
  if (typeof showAppModal === 'function') {
    return new Promise(resolve => {
      showAppModal({
        title: '',
        message,
        actionsClass: 'actions-row-equal',
        buttons: [
          { label: 'DA', className: 'primary', onClick() { resolve(true); } },
          { label: 'NU', className: 'secondary', onClick() { resolve(false); } }
        ],
        onBackdropClose() { resolve(false); }
      });
    });
  }

  if (typeof showConfirmApp === 'function') {
    return showConfirmApp(message);
  }

  return Promise.resolve(confirm(message));
}

async function getTelegramChatIdForUser(userId) {
  if (!userId || typeof getUserById !== 'function') return null;
  const user = await getUserById(userId);
  if (!user) return null;
  if (user.telegramNotificationsEnabled === false) return null;
  return String(user.telegramChatId || user.telegram_chat_id || '').trim() || null;
}

async function sendPartnerEventReminderInternal(planId) {
  const plan = renderedPlanMap.get(Number(planId));
  if (!plan) {
    if (typeof showAlertApp === 'function') await showAlertApp('Nu am putut identifica planificarea. Reincarca pagina.');
    else alert('Nu am putut identifica planificarea. Reincarca pagina.');
    return;
  }

  const recipients = getReminderRecipientsFromPlan(plan).filter(r => r.id);
  if (recipients.length === 0) {
    if (typeof showAlertApp === 'function') await showAlertApp('Nu exista un partener valid pentru aceasta planificare.');
    else alert('Nu exista un partener valid pentru aceasta planificare.');
    return;
  }

  const currentScope = (typeof getCurrentDataScope === 'function') ? getCurrentDataScope() : 'production';
  const enforceCooldown = currentScope !== 'test';

  if (enforceCooldown) {
    const lastSentAt = await getLastManualReminderSentAt();
    const elapsed = Date.now() - lastSentAt;
    if (lastSentAt && elapsed < MANUAL_PARTNER_REMINDER_COOLDOWN_MS) {
      const remainingMinutes = formatRemainingMinutes(MANUAL_PARTNER_REMINDER_COOLDOWN_MS - elapsed);
      const message = `Momentan nu poti trimite reamintirea. Vei putea din nou peste ${remainingMinutes} minute.`;
      if (typeof showAlertApp === 'function') await showAlertApp(message);
      else alert(message);
      return;
    }
  }

  const confirmMessage = recipients.length > 1
    ? 'Esti sigur ca vrei sa trimiti acum o reamintire tuturor participantilor despre acest eveniment?'
    : 'Esti sigur ca vrei sa trimiti acum o reamintire partenerului despre acest eveniment?';
  const confirmed = await showReminderYesNoConfirm(confirmMessage);

  if (!confirmed) {
    return;
  }

  const { token, apiBase } = getTelegramNotificationConfig();
  if (!token) {
    if (typeof showAlertApp === 'function') await showAlertApp('Telegram nu este configurat momentan.');
    else alert('Telegram nu este configurat momentan.');
    return;
  }

  const senderName = getCurrentUserName() || 'Partenerul tau';
  const eventActivity = getActivityText(plan).replace(/\n+/g, ', ');
  const notificationText = [
    '🔔 Reamintire de la partenerul tau:',
    `👤 De la: ${senderName}`,
    `📅 ${plan.date || '-'}`,
    `⏰ ${plan.time || '-'}`,
    `🎯 ${eventActivity || 'Activitate'}`
  ].join('\n');

  let sentCount = 0;
  let lastError = null;

  for (const recipient of recipients) {
    try {
      const partnerChatId = await getTelegramChatIdForUser(recipient.id);
      if (!partnerChatId) {
        continue;
      }

      const response = await fetch(`${apiBase}/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: partnerChatId, text: notificationText })
      });

      if (!response.ok) {
        const raw = await response.text().catch(() => '');
        let description = '';
        try {
          const parsed = JSON.parse(raw || '{}');
          description = String(parsed.description || '').trim();
        } catch (e) {
          description = '';
        }
        throw new Error(description || raw || `HTTP ${response.status}`);
      }

      sentCount++;
    } catch (err) {
      lastError = err;
      console.error('Failed to send reminder to recipient', recipient, err);
    }
  }

  if (sentCount === 0) {
    if (lastError) throw lastError;
    if (typeof showAlertApp === 'function') await showAlertApp('Partenerul nu are Telegram conectat.');
    else alert('Partenerul nu are Telegram conectat.');
    return;
  }

  if (enforceCooldown) {
    await markManualReminderSent();
  }

  const successMessage = recipients.length > 1
    ? `Reamintirea a fost trimisa la ${sentCount} din ${recipients.length} participanti.`
    : 'Reamintirea a fost trimisa partenerului.';
  if (typeof showAlertApp === 'function') await showAlertApp(successMessage);
  else alert(successMessage);
}

window.sendPartnerEventReminder = async function(planId) {
  try {
    await sendPartnerEventReminderInternal(planId);
  } catch (err) {
    console.error('Manual partner reminder failed', err);
    const details = err && err.message ? String(err.message) : '';
    const message = details
      ? `Nu am putut trimite reamintirea: ${details}`
      : 'Nu am putut trimite reamintirea. Incearca din nou.';
    if (typeof showAlertApp === 'function') await showAlertApp(message);
    else alert(message);
  }
};

function switchView(button, mode) {
  currentViewMode = mode;
  persistCalendarViewMode(mode);
  
  // Update toggle buttons
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  
  // Hide/show views
  document.getElementById('listView').classList.toggle('active', mode === 'list');
  document.getElementById('listView').classList.toggle('hidden', mode !== 'list');
  document.getElementById('calendarView').classList.toggle('active', mode === 'calendar');
  document.getElementById('calendarView').classList.toggle('hidden', mode !== 'calendar');
  
  if (mode === 'calendar') {
    buildCalendarView();
  }
}

function persistCalendarViewMode(mode) {
  try {
    localStorage.setItem(CALENDAR_VIEW_MODE_STORAGE_KEY, mode === 'calendar' ? 'calendar' : 'list');
  } catch (e) {
    console.warn('Could not persist calendar view mode', e);
  }
}

function getPersistedCalendarViewMode() {
  try {
    const stored = localStorage.getItem(CALENDAR_VIEW_MODE_STORAGE_KEY);
    return stored === 'calendar' ? 'calendar' : 'list';
  } catch (e) {
    return 'list';
  }
}

function restoreCalendarViewMode() {
  const mode = getPersistedCalendarViewMode();
  const button = mode === 'calendar'
    ? document.querySelector('.view-toggle .toggle-btn[onclick*="calendar"]')
    : document.querySelector('.view-toggle .toggle-btn[onclick*="list"]');

  if (button) {
    switchView(button, mode);
  }
}

// ===== CALENDAR VIEW FUNCTIONS =====

function buildCalendarView() {
  if (document.getElementById('calendarReactRoot')) {
    window.refreshReactCalendarPage?.();
    return;
  }
  renderCalendarMonth();
  renderCalendarDays();
}

function renderCalendarMonth() {
  const monthLabel = document.getElementById('monthLabel');
  const locale = getLocale();
  monthLabel.innerText = calendarCurrentDate.toLocaleString(locale, { month: 'long', year: 'numeric' });
}

function renderCalendarDays() {
  const cal = document.getElementById('calendarGrid');
  if (!cal) return;

  const y = calendarCurrentDate.getFullYear();
  const m = calendarCurrentDate.getMonth();

  // Funcție pentru a construi calendarul cu eventos
  const buildCalendar = (planifications) => {
    cal.innerHTML = '';
    const plansByDate = {};
    
    planifications.forEach(plan => {
      if (!plansByDate[plan.date]) {
        plansByDate[plan.date] = [];
      }
      plansByDate[plan.date].push(plan);
    });

    if (typeof renderSharedCalendar !== 'function') {
      console.error('renderSharedCalendar is not available');
      return;
    }

    renderSharedCalendar(cal, {
      baseDate: calendarCurrentDate,
      locale: getLocale(),
      selectedDate: selectedCalendarDate,
      isDateMarked: (dateStr) => Boolean(plansByDate[dateStr]),
      onSelectDate: (dateStr, dayCell) => {
        document.querySelectorAll('#calendarGrid .day').forEach(x => x.classList.remove('active'));
        dayCell.classList.add('active');
        selectedCalendarDate = dateStr;
        showSelectedDayPlans(dateStr, plansByDate);
      }
    });

    if (selectedCalendarDate && plansByDate[selectedCalendarDate]) {
      showSelectedDayPlans(selectedCalendarDate, plansByDate);
    } else {
      document.getElementById('selectedDayPlans').classList.add('hidden');
    }
  };

  // Încarcă planificările din Firestore
  if (isFirebaseAvailable()) {
    getAllPlanificationsFromFirestore().then(buildCalendar);
  } else {
    const planifications = JSON.parse(localStorage.getItem('planifications') || '[]');
    buildCalendar(planifications);
  }
}

function showSelectedDayPlans(dateStr, plansByDate) {
  const plansDiv = document.getElementById('selectedDayPlans');
  const titleDiv = document.getElementById('selectedDayTitle');
  const listDiv = document.getElementById('selectedDayList');

  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  const locale = getLocale();
  const dayName = date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  
  titleDiv.innerText = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  listDiv.innerHTML = '';

  const plans = plansByDate[dateStr] || [];
  renderedPlanMap.clear();
  
  if (plans.length === 0) {
    plansDiv.classList.add('hidden');
    return;
  }

  plans.sort((a, b) => a.time.localeCompare(b.time));

  plans.forEach(plan => {
    renderedPlanMap.set(Number(plan.id), plan);
    const past = isDatePast(plan.date);
    const planItem = createPlanCardElement(plan, past);
    listDiv.appendChild(planItem);
  });

  plansDiv.classList.remove('hidden');
}

function prevCalendarMonth() {
  calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
  buildCalendarView();
}

function nextCalendarMonth() {
  calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
  buildCalendarView();
}

// ===== LIST VIEW FUNCTIONS =====

function loadPlanifications() {
  if (document.getElementById('calendarReactRoot')) {
    window.refreshReactCalendarPage?.();
    return;
  }
  // Dacă Firebase este disponibil, citești din Firestore
  if (isFirebaseAvailable()) {
    setupRealtimeListener();
  } else {
    // Fallback: citire din localStorage
    const planifications = JSON.parse(localStorage.getItem('planifications') || '[]');
    displayPlanifications(planifications);
  }
}

function displayPlanifications(planifications) {
  const container = document.getElementById('planificationsContainer');
  const emptyState = document.getElementById('emptyState');
  const showPast = window.showPastEvents === true;
  renderedPlanMap.clear();

  container.innerHTML = '';

  if (planifications.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  const groupedByDate = {};

  // Sort by date și time
  const sorted = [...planifications].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA - dateB;
  });

  sorted.forEach(plan => {
    if (!groupedByDate[plan.date]) {
      groupedByDate[plan.date] = [];
    }
    groupedByDate[plan.date].push(plan);
  });

  Object.entries(groupedByDate).forEach(([date, dayPlans]) => {
    const dayGroup = document.createElement('section');
    dayGroup.className = 'plan-day-group';

    const dayHeader = document.createElement('div');
    dayHeader.className = 'plan-day-header';
    dayHeader.innerHTML = `<span class="plan-day-title">📅 ${formatDateRo(date)}</span>`;
    dayGroup.appendChild(dayHeader);

    const visiblePlans = dayPlans.filter(plan => showPast || !isDatePast(plan.date));
    if (visiblePlans.length === 0) {
      return;
    }

    visiblePlans.forEach(plan => {
      renderedPlanMap.set(Number(plan.id), plan);
      const past = isDatePast(plan.date);
      const planCard = createPlanCardElement(plan, past);
      dayGroup.appendChild(planCard);
    });

    container.appendChild(dayGroup);
  });

  adjustDeleteButtonPositions();
  adjustTrashButtonPositions();
  focusPlanFromEventLink();
}

function focusPlanFromEventLink() {
  const planId = new URLSearchParams(window.location.search).get('event');
  if (!planId) return;

  const card = Array.from(document.querySelectorAll('.plan-card')).find(item => item.dataset.planId === planId);
  if (!card) return;

  card.classList.add('plan-card-link-target');
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => card.classList.remove('plan-card-link-target'), 3000);
  const plan = renderedPlanMap.get(Number(planId));
  if (plan) openPlanDetails(plan);
}

function updatePastEventsToggleLabel() {
  const button = document.getElementById('togglePastEventsBtn');
  if (!button) {
    return;
  }

  button.textContent = window.showPastEvents ? translate('hidePastEvents') : translate('showPastEvents');
}

function togglePastEvents() {
  window.showPastEvents = !window.showPastEvents;
  updatePastEventsToggleLabel();
  if (isFirebaseAvailable()) {
    getAllPlanificationsFromFirestore().then(displayPlanifications);
  } else {
    const planifications = JSON.parse(localStorage.getItem('planifications') || '[]');
    displayPlanifications(planifications);
  }
}

function adjustDeleteButtonPositions() {
  document.querySelectorAll('.plan-card').forEach(card => {
    if (card.querySelector('.plan-card-actions')) return;
    const deleteBtn = card.querySelector('.plan-card-delete');
    const dateGroup = card.querySelector('.plan-card-date');
    if (!deleteBtn || !dateGroup) return;

    deleteBtn.classList.remove('adjusted');

    const btnRect = deleteBtn.getBoundingClientRect();
    const dateRect = dateGroup.getBoundingClientRect();
    const overlap = !(btnRect.right < dateRect.left || btnRect.left > dateRect.right || btnRect.bottom < dateRect.top || btnRect.top > dateRect.bottom);

    if (overlap) {
      deleteBtn.classList.add('adjusted');
    }
  });
}

function adjustTrashButtonPositions() {
  document.querySelectorAll('.plan-card').forEach(item => {
    if (item.querySelector('.plan-card-actions')) return;
    const deleteBtn = item.querySelector('.plan-card-delete');
    const tagWrapper = item.querySelector('.plan-card-tags');
    if (!deleteBtn || !tagWrapper) return;

    deleteBtn.classList.remove('adjusted');

    const btnRect = deleteBtn.getBoundingClientRect();
    const wrapperRect = tagWrapper.getBoundingClientRect();
    const overlaps = btnRect.top < wrapperRect.top + 6 || btnRect.bottom > wrapperRect.bottom - 6;

    if (overlaps) {
      deleteBtn.classList.add('adjusted');
    }
  });
}

window.addEventListener('resize', () => {
  requestAnimationFrame(() => {
    adjustDeleteButtonPositions();
    adjustTrashButtonPositions();
  });
});

// Listener pentru actualizări în timp real
function setupRealtimeListener() {
  if (isFirebaseAvailable()) {
    if (stopPlanificationsListener) return;
    stopPlanificationsListener = listenToPlanificationsChanges((planifications) => {
      displayPlanifications(planifications);
      if (currentViewMode === 'calendar') {
        buildCalendarView();
      }
    }) || null;
  }
}

function formatDateRo(dateStr) {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  const locale = getLocale();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(locale, options);
}

function isDatePast(dateStr) {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split('-').map(n => parseInt(n, 10));
  const planDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0,0,0,0);
  return planDate < today;
}

function getParticipantsLabel(plan) {
  const ownerLabel = getDisplayNameForPerson(plan.userId, plan.userName || 'Unknown');
  const partnerEntries = getPlanPartnerEntries(plan);

  if (partnerEntries.length > 0) {
    const partnerLabels = partnerEntries.map(p => getDisplayNameForPerson(p.id, p.name));
    return `👩‍❤️‍👨 ${escapeHtml(ownerLabel)}\n&\n${escapeHtml(partnerLabels.join(', '))}`;
  }
  return `👤 ${escapeHtml(ownerLabel)}`;
}

// Shared plan-card component: builds the exact same markup/design (list format)
// for both the list view and the calendar day-detail view.
function getPlanCardClassName(plan, past) {
  const modeClass = (getPlanPartnerEntries(plan).length > 0) ? 'partner' : 'self';
  return `plan-card ${modeClass}` + (past ? ' past' : '');
}

// Maps the fixed lead-time options (in minutes) used on the create-event page
// to their corresponding translation keys, so plan cards can show how far in
// advance the notification was scheduled.
const NOTIFICATION_LEAD_TIME_KEYS = {
  '-1': 'notificationLeadTimeOptionNone',
  0: 'notificationLeadTimeOptionAtEvent',
  5: 'notificationLeadTimeOption5',
  10: 'notificationLeadTimeOption10',
  15: 'notificationLeadTimeOption15',
  30: 'notificationLeadTimeOption30',
  60: 'notificationLeadTimeOption60',
  120: 'notificationLeadTimeOption120',
  1440: 'notificationLeadTimeOption1440',
  2880: 'notificationLeadTimeOption2880',
  10080: 'notificationLeadTimeOption10080'
};

function getNotificationLeadTimeLabel(plan) {
  if (!plan || plan.notificationLeadTime === undefined || plan.notificationLeadTime === null) {
    return null;
  }

  const minutes = Number(plan.notificationLeadTime);
  if (!Number.isFinite(minutes) || minutes < 0) return null;

  const key = NOTIFICATION_LEAD_TIME_KEYS[minutes];
  if (key) {
    return translate(key);
  }

  // Fallback for any unexpected value not in the fixed option list
  if (minutes === 0) return translate('notificationLeadTimeOptionAtEvent');
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} h`;
  return `${Math.round(minutes / 1440)} zile`;
}

function buildPlanCardInnerHTML(plan, past) {
  const participantsLabel = getParticipantsLabel(plan);
  const notificationLeadTimeLabel = getNotificationLeadTimeLabel(plan);
  const globalClicked = localStorage.getItem('participantsClickedGlobal') === 'true';
  const clickedRaw = localStorage.getItem('participantsClicked') || '[]';
  let clickedArr = [];
  try { clickedArr = JSON.parse(clickedRaw); } catch (e) { clickedArr = []; }
  const shouldPulse = !globalClicked && !clickedArr.includes(plan.id);

  const currentUserId = getCurrentUserId();
  const isOwnerPlan = plan.userId === currentUserId;
  const canEditTime = isOwnerPlan && getPlanPartnerEntries(plan).length === 0;
  const canEditEntirePlan = isOwnerPlan;
  const canDelete = isOwnerPlan || isCurrentUserPlanPartner(plan) || plan.partnerName === getCurrentUserName();
  const activeSuggestionCount = activeSuggestionCountsByPlan.get(String(plan.id)) || 0;

  return `
    <div class="plan-card-header">
      <div class="plan-card-date">
        <span class="time-badge${canEditTime ? ' time-editable' : ''}"${canEditTime ? ` onclick="startEditPlanTime(event, ${plan.id})" title="Apasă pentru a modifica ora"` : ''}>⏰ ${plan.time}</span>
        ${notificationLeadTimeLabel ? `<span class="notification-lead-badge" title="Notificare">🔔 ${escapeHtml(notificationLeadTimeLabel)}</span>` : ''}
      </div>
      <div class="plan-card-actions">
        ${isOwnerPlan ? `<span class="plan-suggestions-indicator${activeSuggestionCount ? '' : ' hidden'}" title="${activeSuggestionCount} sugestii în așteptare" aria-label="${activeSuggestionCount} sugestii în așteptare">${activeSuggestionCount}</span>` : ''}
        ${canEditEntirePlan ? `<button class="plan-card-edit" onclick="editEntirePlanification(${plan.id})" title="Editează evenimentul" aria-label="Editează evenimentul">✏️</button>` : ''}
        ${canDelete ? `<button class="plan-card-delete" onclick="deletePlanification(${plan.id})" title="Șterge">🗑️</button>` : ''}
      </div>
    </div>
    <div class="plan-card-content">
      <div class="plan-card-activity">
        <span class="activity-icon">🎯</span>
        <span class="plan-card-activity-text">${escapeHtml(getActivityText(plan))}</span>
      </div>
      ${plan.details ? `<div class="plan-card-message">💬 ${escapeHtml(plan.details)}</div>` : ''}
      <div class="plan-card-tags">
        ${participantsLabel ? `
          <div class="participants-actions-row">
            <span class="participants-link">${participantsLabel}</span>
            ${canSendManualReminder(plan) ? `<button class="plan-reminder-btn" onclick="sendPartnerEventReminder(${plan.id})" title="Trimite reamintire partenerului">🔔</button>` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function createPlanCardElement(plan, past) {
  const card = document.createElement('div');
  card.className = getPlanCardClassName(plan, past);
  card.dataset.planId = String(plan.id);
  if (past) {
    card.dataset.pastLabel = translate('pastLabel');
  }
  card.innerHTML = buildPlanCardInnerHTML(plan, past);
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Deschide detaliile evenimentului');
  const openDetailsFromCard = event => {
    if (event.target.closest('button, input, select, textarea, .participants-link, .time-editable')) return;
    openPlanDetails(plan);
  };
  card.addEventListener('click', openDetailsFromCard);
  card.addEventListener('keydown', event => {
    if (event.target.closest('button, input, select, textarea, .participants-link, .time-editable')) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPlanDetails(plan);
    }
  });
  return card;
}

function getSuggestionProposedValues(suggestion) {
  const legacySummary = String(suggestion.summary || '');
  const legacyValue = label => {
    const match = legacySummary.match(new RegExp(`${label}:\\s*([^·]+)`));
    return match ? match[1].trim() : '';
  };
  return {
    date: suggestion.proposedDate || legacyValue('Data'),
    time: suggestion.proposedTime || legacyValue('Ora'),
    location: suggestion.proposedLocation || legacyValue('Locație')
  };
}

function buildSuggestionComparisonHtml(plan, suggestion) {
  const currentLocation = plan.location || getActivityText(plan) || '—';
  const proposed = getSuggestionProposedValues(suggestion);
  const changes = [
    { label: 'Data', current: plan.date || '—', proposed: proposed.date },
    { label: 'Ora', current: plan.time || '—', proposed: proposed.time },
    { label: 'Locația / activitatea', current: currentLocation, proposed: proposed.location }
  ].filter(change => change.proposed && change.proposed !== change.current);
  const rows = changes.length
    ? changes.map(change => `<div class="suggestion-comparison-row"><span>${escapeHtml(change.label)}</span><del>${escapeHtml(change.current)}</del><strong>${escapeHtml(change.proposed)}</strong></div>`).join('')
    : '<p class="suggestion-no-difference">Nu a fost propusă o valoare diferită; verifică mesajul partenerului.</p>';
  const decisionLabel = suggestion.decision === 'accepted'
    ? '<span class="suggestion-status accepted">✓ Acceptată</span>'
    : suggestion.decision === 'rejected'
      ? '<span class="suggestion-status rejected">✕ Refuzată</span>'
      : '<span class="suggestion-status pending">În așteptare</span>';
  const canDecide = plan.userId === getCurrentUserId() && !suggestion.decision;
  const suggestionId = escapeHtml(suggestion.id || '');
  const isOwnSuggestion = suggestion.senderId === getCurrentUserId() && plan.userId !== getCurrentUserId();
  const title = isOwnSuggestion ? '💡 Sugestia ta' : `💡 Sugestie de la ${escapeHtml(suggestion.senderName || 'partener')}`;
  const resolvedAttributes = suggestion.decision ? ' role="button" tabindex="0" title="Apasă pentru detalii"' : '';
  return `<div class="plan-suggestion-received ${suggestion.decision ? 'suggestion-resolved' : 'suggestion-pending'}"${resolvedAttributes}><div class="suggestion-title-row"><strong>${title}</strong>${decisionLabel}</div><div class="suggestion-comparison">${rows}</div>${suggestion.note ? `<p class="suggestion-note">${escapeHtml(suggestion.note)}</p>` : ''}${canDecide ? `<div class="suggestion-decision-actions"><button class="app-btn suggestion-reject" type="button" data-action="reject" data-suggestion-id="${suggestionId}">Refuză</button><button class="app-btn suggestion-accept" type="button" data-action="accept" data-suggestion-id="${suggestionId}">Acceptă</button></div>` : ''}</div>`;
}

async function getPlanSuggestions(planId) {
  const ref = getUserNotificationsRef();
  if (!ref) return null;
  try {
    const cachedEntries = Array.isArray(window.__notificationEntries) ? window.__notificationEntries : null;
    const snapshot = cachedEntries ? null : await ref.once('value');
    const suggestions = [];
    const appendSuggestion = (value, id) => {
      if (value.type === 'event-suggestion' && String(value.planId) === String(planId)) {
        suggestions.push({ id, ...value });
      }
    };
    if (cachedEntries) cachedEntries.forEach(value => appendSuggestion(value, value.id));
    else snapshot.forEach(child => appendSuggestion(child.val() || {}, child.key));
    suggestions.sort((a, b) => {
      if (!a.decision && b.decision) return -1;
      if (a.decision && !b.decision) return 1;
      return Number(b.createdAt || 0) - Number(a.createdAt || 0);
    });
    return suggestions;
  } catch (error) {
    console.error('Could not load event suggestions:', error);
    return [];
  }
}

async function getPartnerPlanSuggestions(planId) {
  const ref = getUserNotificationsRef();
  if (!ref) return [];
  try {
    const cachedEntries = Array.isArray(window.__notificationEntries) ? window.__notificationEntries : null;
    const snapshot = cachedEntries ? null : await ref.once('value');
    const suggestions = [];
    const appendSuggestion = (value, id) => {
      if (value.type === 'event-suggestion-status' && String(value.planId) === String(planId)) {
        suggestions.push({ id, ...value });
      }
    };
    if (cachedEntries) cachedEntries.forEach(value => appendSuggestion(value, value.id));
    else snapshot.forEach(child => appendSuggestion(child.val() || {}, child.key));
    suggestions.sort((a, b) => {
      if (!a.decision && b.decision) return -1;
      if (a.decision && !b.decision) return 1;
      return Number(b.createdAt || 0) - Number(a.createdAt || 0);
    });
    return suggestions;
  } catch (error) {
    console.error('Could not load partner suggestion statuses:', error);
    return [];
  }
}

async function openPlanDetails(plan, suggestion = null) {
  if (!plan) return;
  const existingDetails = Array.from(document.querySelectorAll('.app-modal-backdrop[data-plan-details-id]'))
    .find(element => element.dataset.planDetailsId === String(plan.id));
  if (existingDetails) return;
  let suggestions = [];
  if (plan.userId === getCurrentUserId()) {
    suggestions = await getPlanSuggestions(plan.id);
  } else {
    suggestions = await getPartnerPlanSuggestions(plan.id);
  }
  if (suggestion && !suggestions.some(item => item.id === suggestion.id)) {
    suggestions.unshift(suggestion);
  }

  const detailsUrl = new URL(window.location.href);
  detailsUrl.searchParams.set('event', String(plan.id));
  window.history.replaceState(window.history.state, '', `${detailsUrl.pathname}${detailsUrl.search}${detailsUrl.hash}`);

  const ownerName = getDisplayNameForPerson(plan.userId, plan.userName || '—');
  const suggestionsSection = suggestions.length
    ? `<section class="plan-suggestions-section"><div class="plan-suggestions-heading"><strong>💡 Sugestii</strong></div><div class="plan-suggestions-list">${suggestions.map(item => buildSuggestionComparisonHtml(plan, item)).join('')}</div></section>`
    : '';
  const participants = getPlanPartnerEntries(plan)
    .map(partner => getDisplayNameForPerson(partner.id, partner.name))
    .join(', ') || 'Fără participanți suplimentari';
  const reminder = getNotificationLeadTimeLabel(plan) || 'Fără reamintire';
  const backdrop = document.createElement('div');
  backdrop.className = 'app-modal-backdrop';
  backdrop.dataset.planDetailsId = String(plan.id);
  const modal = document.createElement('div');
  modal.className = 'app-modal plan-details-modal';
  modal.innerHTML = `
    <div class="plan-details-heading">
      <span aria-hidden="true">📅</span>
      <div><p>Detalii eveniment</p><h2>${escapeHtml(formatDateRo(plan.date))}</h2></div>
    </div>
    <div class="plan-details-grid">
      <div><span>🕒 Ora</span><strong>${escapeHtml(plan.time || '—')}</strong></div>
      <div><span>🔔 Reminder</span><strong>${escapeHtml(reminder)}</strong></div>
      <div class="plan-details-wide"><span>🎯 Activitate</span><strong>${escapeHtml(getActivityText(plan) || '—')}</strong></div>
      ${plan.details ? `<div class="plan-details-wide"><span>💬 Mesaj / detalii</span><strong>${escapeHtml(plan.details)}</strong></div>` : ''}
      <div class="plan-details-wide"><span>👤 Creat de</span><strong>${escapeHtml(ownerName)}</strong></div>
      <div class="plan-details-wide"><span>👥 Participanți</span><strong>${escapeHtml(participants)}</strong></div>
    </div>
    ${suggestionsSection}
    <div class="app-modal-actions">
      ${isCurrentUserPlanPartner(plan) && plan.userId !== getCurrentUserId() ? '<button class="app-btn" type="button" data-action="suggest">Propune modificări</button>' : ''}
      <button class="app-btn primary" type="button" data-action="close">Închide</button>
    </div>`;
  const close = () => {
    backdrop.remove();
    if (!document.querySelector('.app-modal-backdrop')) document.body.classList.remove('plan-details-modal-open');
    const calendarUrl = new URL(window.location.href);
    calendarUrl.searchParams.delete('event');
    window.history.replaceState(window.history.state, '', `${calendarUrl.pathname}${calendarUrl.search}${calendarUrl.hash}`);
  };
  modal.querySelector('[data-action="close"]').onclick = close;
  const suggestButton = modal.querySelector('[data-action="suggest"]');
  if (suggestButton) suggestButton.onclick = () => { close(); showEventSuggestionModal(plan); };
  modal.querySelectorAll('[data-action="accept"], [data-action="reject"]').forEach(button => {
    button.onclick = () => {
      const selectedSuggestion = suggestions.find(item => item.id === button.dataset.suggestionId);
      const decision = button.dataset.action === 'accept' ? 'accepted' : 'rejected';
      button.disabled = true;
      handleSuggestionDecision(plan, selectedSuggestion, decision, () => {
        selectedSuggestion.decision = decision;
        const suggestionCard = button.closest('.plan-suggestion-received');
        const status = suggestionCard?.querySelector('.suggestion-status');
        if (status) {
          status.className = `suggestion-status ${decision}`;
          status.textContent = decision === 'accepted' ? '✓ Acceptată' : '✕ Refuzată';
        }
        suggestionCard?.querySelector('.suggestion-decision-actions')?.remove();
      });
    };
  });
  modal.querySelectorAll('.suggestion-resolved').forEach(suggestionCard => {
    const toggleDetails = () => suggestionCard.classList.toggle('show-suggestion-details');
    suggestionCard.onclick = toggleDetails;
    suggestionCard.onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleDetails();
      }
    };
  });
  backdrop.onclick = event => { if (event.target === backdrop) close(); };
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  document.body.classList.add('plan-details-modal-open');
  // Keep the dialog at its top position; focusing the bottom close button can
  // otherwise scroll long event details out of view on smaller viewports.
  modal.querySelector('[data-action="close"]').focus({ preventScroll: true });
}

async function handleSuggestionDecision(plan, suggestion, decision, updateOpenModal) {
  if (!suggestion?.id || plan.userId !== getCurrentUserId()) return;
  if (decision === 'accepted') {
    const proposed = getSuggestionProposedValues(suggestion);
    const updatedPlan = {
      ...plan,
      ...(proposed.date ? { date: proposed.date } : {}),
      ...(proposed.time ? { time: proposed.time } : {}),
      ...(proposed.location ? { location: proposed.location, activityCustom: proposed.location, activityIds: null } : {})
    };
    const saved = isFirebaseAvailable()
      ? await updatePlanificationInFirestore(updatedPlan)
      : updatePlanificationInLocalStorage(updatedPlan);
    if (!saved) {
      if (typeof showAlertApp === 'function') await showAlertApp('Nu am putut aplica sugestia.');
      return;
    }
  }
  const notificationRef = getUserNotificationsRef()?.child(suggestion.id);
  if (notificationRef) await notificationRef.update({ decision, read: true, decidedAt: Date.now() });
  if (suggestion.senderId) {
    const partnerStatusRef = getUserNotificationsRef(suggestion.senderId)?.child(suggestion.id);
    if (partnerStatusRef) {
      const partnerStatusSnapshot = await partnerStatusRef.once('value');
      if (partnerStatusSnapshot.val()?.type === 'event-suggestion-status') {
        await partnerStatusRef.update({ decision, decidedAt: Date.now() });
      } else {
        await partnerStatusRef.set({
          ...suggestion,
          type: 'event-suggestion-status',
          read: true,
          decision,
          decidedAt: Date.now()
        });
      }
    }
    const partnerNotificationRef = getUserNotificationsRef(suggestion.senderId)?.push();
    if (partnerNotificationRef) {
      await partnerNotificationRef.set({
        type: 'event-suggestion-decision', planId: plan.id, senderId: getCurrentUserId(),
        senderName: getCurrentUserName(), decision, summary: decision === 'accepted'
          ? 'Sugestia ta a fost aplicată evenimentului.'
          : 'Sugestia ta nu a fost aplicată evenimentului.',
        note: suggestion.note || '', proposedDate: suggestion.proposedDate || '',
        proposedTime: suggestion.proposedTime || '', proposedLocation: suggestion.proposedLocation || '',
        createdAt: Date.now(), read: false
      });
    }
  }
  updateOpenModal?.();
  loadPlanifications();
}

// React calendar keeps the same legacy actions (details, edit, delete, reminder)
// but supplies the currently rendered plans to those actions.
window.setRenderedCalendarPlans = function(plans) {
  renderedPlanMap = new Map((Array.isArray(plans) ? plans : []).map(plan => [Number(plan.id), plan]));
};

function showEventSuggestionModal(plan) {
  const backdrop = document.createElement('div');
  backdrop.className = 'app-modal-backdrop';
  const modal = document.createElement('div');
  modal.className = 'app-modal event-edit-modal';
  modal.innerHTML = `
    <h2>Propune modificări</h2><p class="modal-subtitle">Sugerează o altă dată, oră, locație sau o idee pentru eveniment.</p>
    <form class="event-edit-form">
      <div class="event-edit-row"><label>Data propusă<input name="date" type="date" value="${escapeHtml(plan.date || '')}"></label><label>Ora propusă<input name="time" type="time" value="${escapeHtml(plan.time || '')}"></label></div>
      <label>Locație propusă<input name="location" type="text" maxlength="120" value="${escapeHtml(plan.location || getActivityText(plan) || '')}" placeholder="De exemplu: Parcul Valea Morilor"></label>
      <label>Mesaj<textarea name="note" rows="4" maxlength="500" placeholder="Scrie sugestia ta..."></textarea></label>
      <p class="suggestion-send-status" aria-live="polite"></p>
      <div class="app-modal-actions"><button class="app-btn" type="button" data-action="cancel">Închide</button><button class="app-btn primary" type="submit">Trimite sugestia</button></div>
    </form>`;
  const close = () => { backdrop.remove(); document.body.classList.remove('event-edit-modal-open'); };
  modal.querySelector('[data-action="cancel"]').onclick = close;
  modal.querySelector('form').onsubmit = async event => {
    event.preventDefault();
    const submitButton = modal.querySelector('button[type="submit"]');
    const status = modal.querySelector('.suggestion-send-status');
    const form = new FormData(event.currentTarget);
    const date = String(form.get('date') || '').trim();
    const time = String(form.get('time') || '').trim();
    const location = String(form.get('location') || '').trim();
    const note = String(form.get('note') || '').trim();
    const normalizeSuggestionValue = value => String(value || '').trim().replace(/\u00a0/g, ' ');
    const existingLocation = plan.location || getActivityText(plan) || '';
    const hasNewSuggestion = normalizeSuggestionValue(date) !== normalizeSuggestionValue(plan.date)
      || normalizeSuggestionValue(time) !== normalizeSuggestionValue(plan.time)
      || normalizeSuggestionValue(location) !== normalizeSuggestionValue(existingLocation)
      || Boolean(note);
    if (!hasNewSuggestion) {
      status.textContent = 'Nu există sugestii noi.';
      status.className = 'suggestion-send-status no-new-suggestion';
      return;
    }
    const summary = [date && `Data: ${date}`, time && `Ora: ${time}`, location && `Locație: ${location}`].filter(Boolean).join(' · ') || 'A trimis o idee pentru eveniment';
    const targetRef = getUserNotificationsRef(plan.userId);
    if (!targetRef) {
      status.textContent = 'Nu există conexiune la baza de date. Încearcă din nou.';
      status.className = 'suggestion-send-status error';
      return;
    }
    submitButton.disabled = true;
    status.textContent = 'Se trimite...';
    status.className = 'suggestion-send-status';
    try {
      const suggestionRef = targetRef.push();
      const suggestionData = {
        type: 'event-suggestion', planId: plan.id, senderId: getCurrentUserId(), senderName: getCurrentUserName(),
        summary, note, proposedDate: date, proposedTime: time, proposedLocation: location,
        createdAt: Date.now(), read: false
      };
      await suggestionRef.set(suggestionData);
      const ownSuggestionStatusRef = getUserNotificationsRef()?.child(suggestionRef.key);
      if (ownSuggestionStatusRef) {
        await ownSuggestionStatusRef.set({ ...suggestionData, type: 'event-suggestion-status', read: true });
      }
      close();
    } catch (error) {
      console.error('Could not send event suggestion:', error);
      status.textContent = `Nu am putut trimite sugestia: ${error.message || 'eroare de conexiune'}`;
      status.className = 'suggestion-send-status error';
    } finally {
      submitButton.disabled = false;
    }
  };
  backdrop.onclick = event => { if (event.target === backdrop) close(); };
  backdrop.appendChild(modal); document.body.appendChild(backdrop); document.body.classList.add('event-edit-modal-open');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

function updatePlanificationInLocalStorage(plan) {
  const planifications = JSON.parse(localStorage.getItem('planifications') || '[]');
  const updatedPlanifications = planifications.map(p => p.id === plan.id ? plan : p);
  localStorage.setItem('planifications', JSON.stringify(updatedPlanifications));
  console.log('✅ Planificare actualizată local:', plan);
  return true;
}

function startEditPlanTime(event, id) {
  event.stopPropagation();

  const plan = renderedPlanMap.get(Number(id));
  if (!plan) return;
  if (plan.userId !== getCurrentUserId()) return;

  const badge = event.currentTarget;
  if (!badge || badge.querySelector('input')) return;

  const originalHTML = badge.innerHTML;
  const input = document.createElement('input');
  input.type = 'time';
  input.value = plan.time || '';
  input.className = 'plan-time-edit-input';

  badge.innerHTML = '';
  badge.appendChild(input);
  input.focus();
  if (typeof input.showPicker === 'function') {
    try { input.showPicker(); } catch (e) { /* ignore */ }
  }

  const onKeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      finish(false);
    }
  };

  const onBlur = () => finish(true);

  function finish(commit) {
    input.removeEventListener('blur', onBlur);
    input.removeEventListener('keydown', onKeydown);

    if (commit && input.value && input.value !== plan.time) {
      savePlanTime(plan, input.value);
    } else {
      badge.innerHTML = originalHTML;
    }
  }

  input.addEventListener('blur', onBlur);
  input.addEventListener('keydown', onKeydown);
  input.addEventListener('click', e => e.stopPropagation());
}

async function savePlanTime(plan, newTime) {
  const updatedPlan = { ...plan, time: newTime };

  const ok = isFirebaseAvailable()
    ? await updatePlanificationInFirestore(updatedPlan)
    : updatePlanificationInLocalStorage(updatedPlan);

  if (!ok) {
    if (typeof showAlertApp === 'function') await showAlertApp('Nu am putut actualiza ora.');
    else alert('Nu am putut actualiza ora.');
    return;
  }

  loadPlanifications();
  if (currentViewMode === 'calendar') {
    buildCalendarView();
  }
}

function showPlanEditModal(plan, selectable) {
  const selectedIds = new Set(getPlanPartnerEntries(plan).map(partner => partner.id));
  const leadTimeOptions = [-1, 0, 5, 10, 15, 30, 60, 120, 1440, 2880, 10080];
  const leadTimeLabels = { '-1': 'Fără reamintire', 0: 'La momentul evenimentului', 5: 'Cu 5 minute înainte', 10: 'Cu 10 minute înainte', 15: 'Cu 15 minute înainte', 30: 'Cu 30 minute înainte', 60: 'Cu 1 oră înainte', 120: 'Cu 2 ore înainte', 1440: 'Cu 1 zi înainte', 2880: 'Cu 2 zile înainte', 10080: 'Cu 1 săptămână înainte' };

  return new Promise(resolve => {
    const backdrop = document.createElement('div');
    backdrop.className = 'app-modal-backdrop';
    const modal = document.createElement('div');
    modal.className = 'app-modal event-edit-modal';
    const participants = selectable.map(user => `
      <label class="event-edit-participant">
        <input type="checkbox" value="${escapeHtml(user.id)}"${selectedIds.has(user.id) ? ' checked' : ''}>
        <span>${escapeHtml(getDisplayNameForPerson(user.id, user.name))}</span>
      </label>`).join('') || '<p class="event-edit-empty">Nu există participanți disponibili.</p>';
    const selectedLeadTime = Number(plan.notificationLeadTime ?? 10);

    modal.innerHTML = `
      <h2>Editează evenimentul</h2>
      <form class="event-edit-form">
        <label>Activitate<textarea name="activity" rows="3" required>${escapeHtml(getActivityText(plan))}</textarea></label>
        <label>Mesaj / detalii<textarea name="details" rows="3" maxlength="500" placeholder="Adaugă detalii pentru participanți...">${escapeHtml(plan.details || '')}</textarea></label>
        <div class="event-edit-row">
          <label>Data<input name="date" type="date" value="${escapeHtml(plan.date || '')}" required></label>
          <label>Ora<input name="time" type="time" value="${escapeHtml(plan.time || '')}" required></label>
        </div>
        <label>Reminder<select name="leadTime">${leadTimeOptions.map(minutes => `<option value="${minutes}"${minutes === selectedLeadTime ? ' selected' : ''}>${leadTimeLabels[minutes]}</option>`).join('')}</select></label>
        <fieldset><legend>Participanți</legend><div class="event-edit-participants">${participants}</div></fieldset>
        <div class="app-modal-actions">
          <button class="app-btn" type="button" data-action="cancel">Anulează</button>
          <button class="app-btn primary" type="submit">Salvează</button>
        </div>
      </form>`;
    document.body.classList.add('event-edit-modal-open');
    const close = value => {
      backdrop.remove();
      if (!document.querySelector('.app-modal-backdrop')) {
        document.body.classList.remove('event-edit-modal-open');
      }
      resolve(value);
    };
    modal.querySelector('[data-action="cancel"]').onclick = () => close(null);
    modal.querySelector('form').onsubmit = event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      close({
        activity: String(form.get('activity') || '').trim(),
        details: String(form.get('details') || '').trim(),
        date: String(form.get('date') || '').trim(),
        time: String(form.get('time') || '').trim(),
        leadTime: Number(form.get('leadTime')),
        partnerIds: Array.from(modal.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value)
      });
    };
    backdrop.onclick = event => { if (event.target === backdrop) close(null); };
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
    modal.querySelector('textarea').focus();
  });
}

// Opens the complete editing flow for a shared event owned by the current user.
async function editEntirePlanification(id) {
  const plan = renderedPlanMap.get(Number(id)) || (isFirebaseAvailable() ? await getPlanificationById(id) : null);
  if (!plan || plan.userId !== getCurrentUserId()) return;

  const users = typeof getApprovedPartnersFromFirebase === 'function'
    ? await getApprovedPartnersFromFirebase()
    : [];
  const selectable = users.filter(user => user.id !== getCurrentUserId());
  const changes = await showPlanEditModal(plan, selectable);
  if (!changes || !changes.activity || !changes.date || !changes.time) return;

  const partnerNames = changes.partnerIds.map(partnerId => {
    const user = selectable.find(item => item.id === partnerId);
    return user ? user.name : partnerId;
  });
  const normalizedDate = changes.date;
  const normalizedTime = changes.time;
  const normalizedLeadTime = changes.leadTime;
  const eventDate = new Date(`${normalizedDate}T${normalizedTime}:00`);
  if (Number.isNaN(eventDate.getTime())) {
    await showAlertApp('Data sau ora evenimentului nu este validă.');
    return;
  }

  const updatedPlan = {
    ...plan,
    date: normalizedDate,
    time: normalizedTime,
    activityIds: null,
    activityCustom: changes.activity,
    details: changes.details,
    notificationLeadTime: normalizedLeadTime,
    notificationTimeMs: normalizedLeadTime < 0 ? null : eventDate.getTime() - (normalizedLeadTime * 60 * 1000),
    partnerIds: changes.partnerIds,
    partnerNames,
    partnerId: changes.partnerIds[0] || null,
    partnerName: partnerNames[0] || null,
    tags: changes.partnerIds.length > 0 ? ['shared', 'self'] : ['self', 'personal']
  };
  const saved = isFirebaseAvailable()
    ? await updatePlanificationInFirestore(updatedPlan)
    : updatePlanificationInLocalStorage(updatedPlan);

  if (!saved) {
    await showAlertApp('Nu am putut actualiza evenimentul.');
    return;
  }
  await showAlertApp('Eveniment actualizat.');
  loadPlanifications();
  if (currentViewMode === 'calendar') buildCalendarView();
}

async function deletePlanification(id) {
  const confirmed = (typeof showConfirmApp === 'function') ? await showConfirmApp(translate('deleteConfirm') + ' 🤔') : confirm(translate('deleteConfirm') + ' 🤔');
  if (!confirmed) return;

  const currentUserId = getCurrentUserId();

  const applyDeleteForPlan = async (plan) => {
    const partnerEntries = getPlanPartnerEntries(plan);
    const isShared = partnerEntries.length > 0;
    const isOwner = plan.userId === currentUserId;
    const isPartner = isCurrentUserPlanPartner(plan) || plan.partnerName === getCurrentUserName();

    if (!isShared) {
      return isFirebaseAvailable()
        ? deletePlanificationFromFirestore(id)
        : Promise.resolve(true);
    }

    if (isOwner) {
      // Owner removes assignment for self; ownership transfers to the next partner
      // (or the event is removed entirely if no partner remains).
      const updatedPlan = buildOwnerLeftPlan(plan);
      if (!updatedPlan) {
        return isFirebaseAvailable()
          ? deletePlanificationFromFirestore(id)
          : Promise.resolve(true);
      }
      return isFirebaseAvailable()
        ? updatePlanificationInFirestore(updatedPlan)
        : Promise.resolve(updatePlanificationInLocalStorage(updatedPlan));
    }

    if (isPartner) {
      // Partner removes self from the event, leaving it for the owner and any other partners.
      const updatedPlan = buildPartnerRemovedPlan(plan, currentUserId);
      return isFirebaseAvailable()
        ? updatePlanificationInFirestore(updatedPlan)
        : Promise.resolve(updatePlanificationInLocalStorage(updatedPlan));
    }

    return isFirebaseAvailable()
      ? deletePlanificationFromFirestore(id)
      : Promise.resolve(true);
  };

  if (isFirebaseAvailable()) {
    getPlanificationById(id).then(plan => {
      if (!plan) {
        return deletePlanificationFromFirestore(id);
      }
      return applyDeleteForPlan(plan);
    }).then(success => {
      if (success) {
        loadPlanifications();
        if (currentViewMode === 'calendar') {
          buildCalendarView();
        }
      }
    });
  } else {
    let planifications = JSON.parse(localStorage.getItem('planifications') || '[]');
    const plan = planifications.find(p => p.id === id);
    if (!plan) {
      return;
    }

    const isShared = getPlanPartnerEntries(plan).length > 0;
    const isOwner = plan.userId === currentUserId;
    const isPartner = isCurrentUserPlanPartner(plan) || plan.partnerName === getCurrentUserName();

    if (!isShared) {
      planifications = planifications.filter(p => p.id !== id);
    } else if (isOwner) {
      const updatedPlan = buildOwnerLeftPlan(plan);
      if (!updatedPlan) {
        planifications = planifications.filter(p => p.id !== id);
      } else {
        planifications = planifications.map(p => p.id === id ? updatedPlan : p);
      }
    } else if (isPartner) {
      const updatedPlan = buildPartnerRemovedPlan(plan, currentUserId);
      planifications = planifications.map(p => p.id === id ? updatedPlan : p);
    }

    localStorage.setItem('planifications', JSON.stringify(planifications));
    loadPlanifications();
    if (currentViewMode === 'calendar') {
      buildCalendarView();
    }
  }
}

async function clearAllPlanifications() {
  const ok = (typeof showConfirmApp === 'function') ? await showConfirmApp(translate('deleteAllConfirm') + ' ' + translate('cannotRecover')) : confirm(translate('deleteAllConfirm') + ' ' + translate('cannotRecover'));
  if (ok) {
    if (isFirebaseAvailable()) {
      // Ștergere din Firestore
      deleteAllPlanificationsFromFirestore().then(success => {
        if (success) {
          loadPlanifications();
          if (currentViewMode === 'calendar') {
            buildCalendarView();
          }
        }
      });
    } else {
      // Fallback: ștergere din localStorage
      localStorage.removeItem('planifications');
      loadPlanifications();
      if (currentViewMode === 'calendar') {
        buildCalendarView();
      }
    }
  }
}

// Allow owner to edit a plan (change/add/remove partner)
async function editPlanification(id) {
  const okEdit = (typeof showConfirmApp === 'function') ? await showConfirmApp(translate('editConfirm') || 'Editezi această planificare?') : confirm(translate('editConfirm') || 'Editezi această planificare?');
  if (!okEdit) return;

  try {
    const plan = await getPlanificationById(id);
    if (!plan) {
      if (typeof showAlertApp === 'function') await showAlertApp('Planificare inexistentă'); else alert('Planificare inexistentă');
      return;
    }

    const currentUserId = getCurrentUserId();
    if (plan.userId !== currentUserId) {
      if (typeof showAlertApp === 'function') await showAlertApp('Doar proprietarul poate edita această planificare'); else alert('Doar proprietarul poate edita această planificare');
      return;
    }

    // Load possible partners and show selection modal
    const users = typeof getApprovedPartnersFromFirebase === 'function'
      ? await getApprovedPartnersFromFirebase()
      : [];
    // Filter out current user from selectable list
    const selectable = users.filter(u => u.id !== currentUserId);
    // If showUserSelectionModal available, use it to pick by name; fallback to prompt if not
    let partnerInput = null;
    if (typeof showUserSelectionModal === 'function') {
      partnerInput = await showUserSelectionModal(selectable, plan.partnerId || '');
    } else {
      const options = selectable.map(u => `${u.id}:${u.name}`).join('\n');
      const promptText = 'Introduceți userId partener (sau lăsați gol pentru a elimina partenerul):\n' + options;
      partnerInput = (typeof showPromptApp === 'function') ? await showPromptApp(promptText, plan.partnerId || '') : prompt(promptText, plan.partnerId || '');
    }
    if (partnerInput === null) return; // cancelled

    let newPartnerId = partnerInput.trim() === '' ? null : partnerInput.trim();
    let newPartnerName = null;
    if (newPartnerId) {
      const found = selectable.find(u => u.id === newPartnerId) || users.find(u => u.id === newPartnerId);
      newPartnerName = found ? found.name : newPartnerId;
    }

    const updatedPlan = {
      ...plan,
      partnerId: newPartnerId,
      partnerName: newPartnerName,
      mode: newPartnerId ? 'partner' : 'self',
      tags: newPartnerId ? ['partner','shared'] : ['self','personal']
    };

    const ok = await updatePlanificationInFirestore(updatedPlan);
    if (ok) {
      if (typeof showAlertApp === 'function') await showAlertApp('Planificare actualizată'); else alert('Planificare actualizată');
      loadPlanifications();
      if (currentViewMode === 'calendar') buildCalendarView();
    } else {
      if (typeof showAlertApp === 'function') await showAlertApp('Eroare la actualizare'); else alert('Eroare la actualizare');
    }
    } catch (err) {
    console.error('editPlanification error', err);
    if (typeof showAlertApp === 'function') await showAlertApp('Eroare la editare: ' + err.message); else alert('Eroare la editare: ' + err.message);
  }
}

// onParticipantsClick is provided globally by user-manager.js for reuse across pages
