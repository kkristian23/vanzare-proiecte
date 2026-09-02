let chosenActivities = [];
let customActivityText = "";
let selectedDate = "-";
let selectedTime = "-";
let selectedPartnerIds = [];
let cachedSelectablePartners = []; // [{id, name}] raw account names
let cachedPartnerGroups = {}; // { groupId: { id, name, memberIds: [] } }
let ideasVisible = false;

const activities = [
  { id: 'pizza', icon: '🍕', label: 'Pizza' },
  { id: 'games', icon: '🎮', label: 'Games' },
  { id: 'film', icon: '🎬', label: 'Film' },
  { id: 'walk', icon: '🚶', label: 'Plimbare' },
  { id: 'coffee', icon: '☕', label: 'Cafea' },
  { id: 'music', icon: '🎵', label: 'Muzică' },
  { id: 'picnic', icon: '🧺', label: 'Picnic' },
  { id: 'board-games', icon: '🎲', label: 'Jocuri de societate' },
  { id: 'cinema', icon: '🎥', label: 'Cinema' },
  { id: 'cycling', icon: '🚴', label: 'Ciclism' },
  { id: 'dessert', icon: '🍰', label: 'Desert' },
  { id: 'dance', icon: '💃', label: 'Dans' },
  { id: 'karaoke', icon: '🎤', label: 'Karaoke' },
  { id: 'hiking', icon: '🏞️', label: 'Drumeție' },
  { id: 'spa', icon: '🧖', label: 'Spa' },
  { id: 'book', icon: '📚', label: 'Carte' },
  { id: 'photo', icon: '📷', label: 'Foto' },
  { id: 'beach', icon: '🏖️', label: 'Plajă' },
  { id:'museum', icon: '🖼️', label: 'Muzeu' },
  { id: 'concert', icon: '🎸', label: 'Concert' },
  { id: 'cooking', icon: '🍳', label: 'Gătit' },
  { id: 'yoga', icon: '🧘', label: 'Yoga' },
  { id: 'brunch', icon: '🥞', label: 'Brunch' },
  { id: 'escape-room', icon: '🧩', label: 'Escape Room' },
  { id: 'sushi', icon: '🍣', label: 'Sushi' },
  { id: 'shopping', icon: '🛍️', label: 'Shopping' },
  { id: 'travel', icon: '✈️', label: 'Călătorie' },
  { id: 'painting', icon: '🎨', label: 'Pictură' },
  { id: 'sportik', icon: '🤸', label: 'Sportik' },
  { id: 'karting', icon: '🏁', label: 'Karting' },
  { id: 'theater', icon: '🎭', label: 'Teatru' }
];

window.onload = async () => {
  await window.activityConfigLoaded;
  await initializeUser();

  selectedDate = localStorage.getItem('selectedDate') || '-';
  selectedTime = localStorage.getItem('selectedTime') || '-';

  document.getElementById('displayDate').innerText = selectedDate;
  document.getElementById('displayTime').innerText = selectedTime;
  renderActivities();
  bindCustomActivityInput();
  bindIdeasToggle();
  // Reveal bottom section once activities and inputs are rendered
  const bottomSection = document.getElementById('cardBottom');
  if (bottomSection && bottomSection.classList.contains('preload-part')) {
    bottomSection.classList.add('no-anim');
    bottomSection.classList.remove('preload-part', 'preload-bottom');
    setTimeout(() => bottomSection.classList.remove('no-anim'), 60);
  }

  loadActivityNotificationLeadTime();
  bindActivityNotificationLeadTime();
  document.getElementById('confirmButton').addEventListener('click', confirmActivity);
  // Load partners (async) and reveal top section when ready
  await loadPartners();
  applySingleModeState();
  updateConfirmButtonVisibility();
  const topSection = document.getElementById('cardTop');
  if (topSection && topSection.classList.contains('preload-part')) {
    topSection.classList.add('no-anim');
    topSection.classList.remove('preload-part', 'preload-top');
    setTimeout(() => topSection.classList.remove('no-anim'), 60);
  }
};

function loadActivityNotificationLeadTime() {
  const selectedMinutes = typeof getNotificationLeadTime === 'function' ? getNotificationLeadTime() : 10;
  const select = document.getElementById('notificationLeadTimeSelect');
  if (!select) return;

  const availableValues = Array.from(select.options).map(option => option.value);
  const normalizedValue = String(selectedMinutes);

  if (availableValues.includes(normalizedValue)) {
    select.value = normalizedValue;
    return;
  }

  select.value = '10';
  if (typeof setNotificationLeadTime === 'function') {
    setNotificationLeadTime(10);
  }
}

function bindActivityNotificationLeadTime() {
  const select = document.getElementById('notificationLeadTimeSelect');
  if (!select) return;
  select.removeEventListener('change', activityNotificationLeadTimeChanged);
  select.addEventListener('change', activityNotificationLeadTimeChanged);
}

function activityNotificationLeadTimeChanged(event) {
  const value = parseFloat(event.target.value);
  if (typeof setNotificationLeadTime === 'function') {
    setNotificationLeadTime(value);
  }
}

window.addEventListener('languageChanged', () => {
  renderActivities();
  updateIdeasToggleButton();
  updateSelectedActivityText();
  renderPartnerCheckboxList();
  renderPartnerGroupChips();
});

function bindIdeasToggle() {
  const toggleBtn = document.getElementById('toggleIdeasBtn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    ideasVisible = !ideasVisible;
    applyIdeasVisibility();
  });

  updateIdeasToggleButton();
}

function applyIdeasVisibility() {
  const grid = document.getElementById('activityGrid');
  if (!grid) return;
  const shouldShow = ideasVisible;
  grid.classList.toggle('hidden', !shouldShow);
  updateIdeasToggleButton();
}

function updateIdeasToggleButton() {
  const toggleBtn = document.getElementById('toggleIdeasBtn');
  const toggleWrap = document.getElementById('ideasToggleWrap');
  if (!toggleBtn || !toggleWrap) return;

  toggleWrap.classList.remove('hidden');

  const key = ideasVisible ? 'hideActivityIdeas' : 'showActivityIdeas';
  const text = typeof translate === 'function' ? translate(key) : (ideasVisible ? 'Ascunde idei de evenimente' : 'Afiseaza idei de evenimente');
  toggleBtn.innerText = text;
}

function renderActivities() {
  const grid = document.getElementById('activityGrid');
  grid.innerHTML = '';

  activities.forEach((activity) => {
    const button = document.createElement('button');
    button.className = 'activity-option';
    button.type = 'button';

    const locked = isActivityLocked(activity.id);
    if (locked) {
      button.classList.add('activity-locked');
      button.disabled = true;
    }

    const activityTranslation = translate(`activityLabel_${activity.id}`);
    const activityLabel = activityTranslation === `activityLabel_${activity.id}` ? activity.label : activityTranslation;
    button.innerHTML = `
      <span class="activity-icon">${activity.icon}</span>
      <span>${activityLabel}</span>
      ${locked ? '<span class="lock-icon">🔒</span>' : ''}
    `;

    if (!locked) {
      if (chosenActivities.includes(activity.id)) {
        button.classList.add('active');
      }
      button.addEventListener('click', () => selectActivity(button, activity.id));
    }
    grid.appendChild(button);
  });
}

function updateConfirmButtonVisibility() {
  const btn = document.getElementById('confirmButton');
  if (!btn) return;
  const shouldShow = (chosenActivities.length > 0 || !!customActivityText);
  btn.classList.toggle('hidden', !shouldShow);
}

function escapeHtmlForActivity(text) {
  const div = document.createElement('div');
  div.innerText = text == null ? '' : String(text);
  return div.innerHTML;
}

function isPartnerSelected(userId) {
  return selectedPartnerIds.includes(userId);
}

function togglePartnerSelection(userId) {
  const idx = selectedPartnerIds.indexOf(userId);
  if (idx > -1) {
    selectedPartnerIds.splice(idx, 1);
  } else {
    selectedPartnerIds.push(userId);
  }
  renderPartnerCheckboxList();
  renderPartnerGroupChips();
}

function renderPartnerCheckboxList() {
  const container = document.getElementById('partnerCheckboxList');
  if (!container) return;

  if (cachedSelectablePartners.length === 0) {
    const emptyText = typeof translate === 'function' ? translate('partnersNoPartners') : 'Nu s-au găsit parteneri pentru afișare.';
    container.innerHTML = `<p class="empty-state partner-checkbox-empty">${escapeHtmlForActivity(emptyText)}</p>`;
    return;
  }

  container.innerHTML = cachedSelectablePartners.map(user => {
    const checked = isPartnerSelected(user.id);
    const displayName = getLocalPartnerNickname(user.id, user.name);
    return `
      <label class="partner-checkbox-row${checked ? ' checked' : ''}">
        <input type="checkbox" value="${user.id}" ${checked ? 'checked' : ''} onchange="togglePartnerSelection('${user.id}')" />
        <span>${escapeHtmlForActivity(displayName)}</span>
      </label>
    `;
  }).join('');
}

function renderPartnerGroupChips() {
  const wrap = document.getElementById('partnerGroupsQuickSelect');
  if (!wrap) return;

  const groups = Object.values(cachedPartnerGroups || {});
  wrap.classList.remove('hidden');

  if (groups.length === 0) {
    const noneLabel = typeof translate === 'function' ? translate('noGroupsQuickLabel') : 'Nimeni';
    wrap.innerHTML = `<div class="partner-groups-empty">${escapeHtmlForActivity(noneLabel)}</div>`;
    return;
  }


  wrap.classList.remove('hidden');
  wrap.innerHTML = `
    <div class="partner-groups-chip-row">
      ${groups.map(group => {
        const memberIds = Array.isArray(group.memberIds) ? group.memberIds : [];
        const validMemberIds = memberIds.filter(id => cachedSelectablePartners.some(u => u.id === id));
        const isActive = validMemberIds.length > 0 &&
          selectedPartnerIds.length === validMemberIds.length &&
          validMemberIds.every(id => selectedPartnerIds.includes(id));
        return `<button type="button" class="group-chip${isActive ? ' active' : ''}" onclick="applyGroupQuickSelect('${group.id}')">${escapeHtmlForActivity(group.name)}</button>`;
      }).join('')}
    </div>
  `;
}

function applyGroupQuickSelect(groupId) {
  const group = cachedPartnerGroups[groupId];
  if (!group) return;
  const memberIds = Array.isArray(group.memberIds) ? group.memberIds : [];
  const validMemberIds = memberIds.filter(id => cachedSelectablePartners.some(u => u.id === id));
  if (validMemberIds.length === 0) return;

  // Groups are mutually exclusive: selecting one replaces the entire current
  // selection with only that group's members. Clicking the already-active
  // group again clears the selection.
  const isActive = selectedPartnerIds.length === validMemberIds.length &&
    validMemberIds.every(id => selectedPartnerIds.includes(id));

  selectedPartnerIds = isActive ? [] : [...validMemberIds];

  renderPartnerCheckboxList();
  renderPartnerGroupChips();
}

// Load partners (and partner groups) from Firebase for selection
async function loadPartners() {
  try {
    const users = typeof getApprovedPartnersFromFirebase === 'function'
      ? await getApprovedPartnersFromFirebase()
      : await getAllUsersFromFirebase();
    cachedSelectablePartners = users
      .filter(user => user.id !== getCurrentUserId())
      .map(user => ({ id: user.id, name: user.name }));

    if (typeof getPartnerGroups === 'function') {
      cachedPartnerGroups = getPartnerGroups() || {};
    }

    renderPartnerCheckboxList();
    renderPartnerGroupChips();
    bindPartnerListToggle();
  } catch (error) {
    console.error('Error loading partners:', error);
  }
}

function bindPartnerListToggle() {
  const toggleBtn = document.getElementById('partnerListToggleBtn');
  const list = document.getElementById('partnerCheckboxList');
  if (!toggleBtn || !list) return;

  toggleBtn.onclick = () => {
    const willExpand = list.classList.contains('hidden');
    list.classList.toggle('hidden', !willExpand);
    toggleBtn.classList.toggle('expanded', willExpand);
    toggleBtn.setAttribute('aria-expanded', String(willExpand));
  };
}

function applySingleModeState() {
  document.getElementById('customActivityContainer').classList.remove('hidden');
  document.getElementById('partnerSelectorContainer').classList.remove('hidden');

  const selectorLabel = document.getElementById('partnerSelectorLabel');
  if (selectorLabel) selectorLabel.innerText = translate('selectPartnerWithMe');

  document.getElementById('activityGrid').classList.remove('disabled-grid');
  applyIdeasVisibility();
  updateSelectedActivityText();
  updateConfirmButtonVisibility();
}

function selectActivity(button, activityId) {
  const index = chosenActivities.indexOf(activityId);
  if (index > -1) {
    chosenActivities.splice(index, 1);
    button.classList.remove('active');
  } else {
    if (chosenActivities.length >= 3) {
      // Animație roșie în loc de alert
      button.classList.add('max-reached');
      setTimeout(() => {
        button.classList.remove('max-reached');
      }, 1000);
      return;
    }
    chosenActivities.push(activityId);
    button.classList.add('active');
  }

  customActivityText = "";
  document.getElementById('customActivityInput').value = '';
  updateSelectedActivityText();
}

function updateSelectedActivityText() {
  // Selection preview text under the ideas button was intentionally removed.
  updateConfirmButtonVisibility();
}

function bindCustomActivityInput() {
  const customInput = document.getElementById('customActivityInput');
  if (!customInput) return;

  customInput.addEventListener('input', () => {
    customActivityText = customInput.value.trim();
    if (customActivityText) {
      document.querySelectorAll('.activity-option').forEach(btn => btn.classList.remove('active'));
      chosenActivities = [];
    }
    updateSelectedActivityText();
    updateConfirmButtonVisibility();
  });
}

async function getPartnerTelegramChatId(partnerId) {
  if (!partnerId || typeof getUserById !== 'function') return null;

  const partner = await getUserById(partnerId);
  if (!partner) return null;

  if (partner.telegramNotificationsEnabled === false) {
    return null;
  }

  return String(partner.telegramChatId || partner.telegram_chat_id || '').trim() || null;
}

function buildEventDeepLink(planId) {
  const scope = typeof getCurrentDataScope === 'function'
    ? getCurrentDataScope()
    : (typeof isTestEnvironment === 'boolean' && isTestEnvironment ? 'test' : 'production');
  const configuredBaseUrl = String(window.APP_ENV?.appUrls?.[scope] || '').trim();
  const baseUrl = configuredBaseUrl || window.location.href;
  const eventUrl = new URL('/calendar', baseUrl);
  eventUrl.searchParams.set('event', String(planId));
  if (scope === 'test') {
    eventUrl.searchParams.set('scope', 'test');
  }
  return eventUrl.href;
}

async function sendPartnerConfirmationTelegramNotification(partnerId, creatorName, activityText, date, time, planId, details = '') {
  const { token, apiBase } = getTelegramNotificationConfig();
  if (!token) {
    console.warn('Telegram confirmation skipped: missing TELEGRAM_BOT_TOKEN');
    return false;
  }

  const chatId = await getPartnerTelegramChatId(partnerId);
  if (!chatId) {
    console.warn('Telegram confirmation skipped: partner has no linked Telegram chat');
    return false;
  }

  const eventUrl = buildEventDeepLink(planId);
  const eventDetails = String(details || '').trim();
  const text = [
    '🔔 Ai fost adăugat la un eveniment:',
    creatorName ? `👤 Cu: ${escapeTelegramHtml(creatorName)}` : null,
    `📅 ${escapeTelegramHtml(date || '-')}`,
    `⏰ ${escapeTelegramHtml(time || '-')}`,
    `🎯 ${escapeTelegramHtml(activityText || 'Activitate')}`,
    eventDetails ? `💬 Mesaj: ${escapeTelegramHtml(eventDetails)}` : null,
    `🔗 <a href="${escapeTelegramHtml(eventUrl)}">Deschide evenimentul</a>`
  ].filter(Boolean).join('\n');

  const response = await fetch(`${apiBase}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
  });

  if (!response.ok) {
    const raw = await response.text().catch(() => '');
    throw new Error(raw || `HTTP ${response.status}`);
  }

  return true;
}

async function confirmActivity() {
  console.log('🚀 confirmActivity called', { selectedPartnerIds, chosenActivities, customActivityText });
  const eventDetails = String(document.getElementById('eventDetailsInput')?.value || '').trim();

  const selectedEventDate = new Date(`${selectedDate}T${selectedTime.length === 5 ? selectedTime + ':00' : selectedTime}`);
  if (!Number.isFinite(selectedEventDate.getTime())) {
    if (typeof showAlertApp === 'function') await showAlertApp('Data sau ora selectata este invalida.'); else alert('Data sau ora selectata este invalida.');
    return;
  }

  if (selectedEventDate.getTime() < Date.now()) {
    if (typeof showAlertApp === 'function') await showAlertApp('Nu poti crea evenimente in trecut. Selecteaza o data si o ora viitoare.'); else alert('Nu poti crea evenimente in trecut. Selecteaza o data si o ora viitoare.');
    return;
  }

  let finalActivity = customActivityText || chosenActivities.join(', ');
  
  if (!finalActivity) {
    if (typeof showAlertApp === 'function') await showAlertApp(translate('alertMinActivity')); else alert(translate('alertMinActivity'));
    return;
  }

  if (chosenActivities.length > 3) {
    if (typeof showAlertApp === 'function') await showAlertApp(translate('alertMaxActivity')); else alert(translate('alertMaxActivity'));
    return;
  }

  // Obtine datele partenerilor selectati (suporta grup/multipli parteneri)
  const selectedPartners = cachedSelectablePartners.filter(u => selectedPartnerIds.includes(u.id));
  const partnerIds = selectedPartners.map(p => p.id);
  const partnerNames = selectedPartners.map(p => p.name);

  const notificationLeadTime = typeof getNotificationLeadTime === 'function' ? getNotificationLeadTime() : 10;
  const notificationTimeMs = notificationLeadTime < 0
    ? null
    : selectedEventDate.getTime() - Math.max(0, notificationLeadTime * 60 * 1000);

  const meetingResult = {
    id: Date.now(),
    date: selectedDate,
    time: selectedTime,
    activityIds: chosenActivities.length > 0 ? chosenActivities : null,
    activityCustom: customActivityText || null,
    details: eventDetails,
    activityMode: null,
    mode: 'self',
    timestamp: new Date().toISOString(),
    notificationLeadTime,
    notificationTimeMs,
    
    // User data
    userId: getCurrentUserId(),
    userName: getCurrentUserName(),
    
    // Partner data (supports multiple partners / group selection)
    partnerIds,
    partnerNames,
    partnerId: partnerIds[0] || null,
    partnerName: partnerNames[0] || null,
    
    // Tags
    tags: partnerIds.length > 0 ? ['shared', 'self'] : ['self', 'personal'],

    // Mark data as test/prod so Firebase can separate environments
    isTestEnvironment: typeof isTestEnvironment === 'boolean' ? isTestEnvironment : false
  };

  // Add createdAt for visibility in DB
  meetingResult.createdAt = new Date().toISOString();
  
  console.log('📝 Event salvat:', {
    mode: meetingResult.mode,
    partnerIds: meetingResult.partnerIds,
    partnerNames: meetingResult.partnerNames,
    userName: meetingResult.userName
  });

  // Salvează în Realtime Database (dacă disponibil) altfel salvează local pentru migrare ulterioară
  if (isFirebaseAvailable()) {
    const saved = await savePlanificationToFirestore(meetingResult);
    if (!saved) {
      if (typeof showAlertApp === 'function') await showAlertApp('Eroare la salvare în baza de date!'); else alert('Eroare la salvare în baza de date!');
      return;
    }
  } else {
    // Fallback: salvează în localStorage dacă RTDB nu e disponibil și marchează pentru migrare
    let planifications = JSON.parse(localStorage.getItem('planifications') || '[]');
    planifications.push(meetingResult);
    localStorage.setItem('planifications', JSON.stringify(planifications));
    localStorage.setItem('unsyncedPlanifications', '1');
    console.log('🔁 Planification salvată local, va fi migrată când RTDB este disponibil');
  }


  localStorage.setItem('meetingResult', JSON.stringify(meetingResult));

  let activityText = '';
  if (customActivityText) {
    activityText = customActivityText;
  } else {
    activityText = chosenActivities
      .map(id => {
        const translation = translate(`activityLabel_${id}`);
        return translation === `activityLabel_${id}` ? activities.find(a => a.id === id)?.label : translation;
      })
      .filter(Boolean)
      .join(', ');
  }

  if (partnerIds.length > 0) {
    for (let i = 0; i < partnerIds.length; i++) {
      try {
        await sendPartnerConfirmationTelegramNotification(
          partnerIds[i],
          meetingResult.userName,
          activityText,
          selectedDate,
          selectedTime,
          meetingResult.id,
          meetingResult.details
        );
      } catch (err) {
        console.error('Failed to send Telegram partner confirmation:', err && err.message ? err.message : err);
      }
    }
  }

  window.location.href = '/result';
}

