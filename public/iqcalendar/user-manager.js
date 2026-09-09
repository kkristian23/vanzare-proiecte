// User Management System
// Generates unique device ID and manages user profile with Firebase Realtime Database

let currentUser = null;
try {
  const cachedCurrentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (cachedCurrentUser && typeof cachedCurrentUser === 'object') currentUser = cachedCurrentUser;
} catch (_) {}

const APP_SCALE_STORAGE_KEY = 'appScalePercent';

function normalizeAppScalePercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 95;
  return Math.min(110, Math.max(85, Math.round(n)));
}

function applyAppScalePercent(percent = null) {
  const resolved = (percent === null || typeof percent === 'undefined')
    ? getAppScalePercent()
    : normalizeAppScalePercent(percent);

  const scale = (resolved / 100).toFixed(2);
  try {
    document.documentElement.style.setProperty('--app-global-scale', scale);
  } catch (err) {
    console.warn('Could not apply app scale CSS variable', err);
  }

  return resolved;
}

function getAppScalePercent() {
  try {
    const stored = localStorage.getItem(APP_SCALE_STORAGE_KEY);
    if (stored !== null) {
      return normalizeAppScalePercent(stored);
    }
  } catch (err) {
    console.warn('Could not read app scale setting', err);
  }
  return 95;
}

function setAppScalePercent(percent) {
  const resolved = normalizeAppScalePercent(percent);
  try {
    localStorage.setItem(APP_SCALE_STORAGE_KEY, String(resolved));
  } catch (err) {
    console.warn('Could not save app scale setting', err);
  }
  applyAppScalePercent(resolved);
  return resolved;
}

window.getAppScalePercent = getAppScalePercent;
window.setAppScalePercent = setAppScalePercent;
window.applyAppScalePercent = applyAppScalePercent;

// Apply persisted app scale as soon as user-manager loads.
applyAppScalePercent();

// Generate a unique device ID based on browser fingerprint
function generateDeviceId() {
  const stored = localStorage.getItem('deviceId');
  if (stored) return stored;

  const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('deviceId', id);
  return id;
}

// Get current device ID
function getDeviceId() {
  return localStorage.getItem('deviceId') || generateDeviceId();
}

function getBackTarget() {
  const currentPage = window.location.pathname.split('/').pop() || 'app';
  const backTargets = {
    'activity': '/iqcalendar/app.html',
    'activity.html': '/iqcalendar/app.html',
    'result': '/iqcalendar/activity.html',
    'result.html': '/iqcalendar/activity.html',
    'calendar': '/iqcalendar/app.html',
    'calendar.html': '/iqcalendar/app.html',
    'app': '/iqcalendar/app.html',
    'app.html': '/iqcalendar/app.html'
  };

  return backTargets[currentPage] || '/iqcalendar/app.html';
}

function goBack() {
  window.location.href = getBackTarget();
}

function goHome() {
  window.location.href = '/';
}

let mandatoryNicknamePromise = null;

function ensureMandatoryNicknameForCurrentUser() {
  let authenticatedUser = null;
  try {
    authenticatedUser = isFirebaseAvailable() && firebase.auth
      ? firebase.auth().currentUser
      : null;
  } catch (_) {}

  // A cached/local profile is not enough: nickname setup is allowed only after
  // Firebase confirms the Google session for this exact user.
  if (!authenticatedUser || !currentUser || currentUser.id !== authenticatedUser.uid) {
    return Promise.resolve(false);
  }
  if (normalizePartnerNickname(currentUser.nickname)) {
    return Promise.resolve(true);
  }
  if (mandatoryNicknamePromise) return mandatoryNicknamePromise;

  mandatoryNicknamePromise = new Promise((resolve) => {
    let modal = document.getElementById('mandatoryNicknameModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mandatoryNicknameModal';
      modal.className = 'modal hidden';
      modal.setAttribute('data-backdrop-close', 'false');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'mandatoryNicknameTitle');
      modal.innerHTML = `
        <div class="modal-content onboarding-card">
          <h2 id="mandatoryNicknameTitle" class="modal-title">Alege un nickname</h2>
          <p class="modal-subtitle">Pentru a continua utilizarea aplicației, setează un nickname unic.</p>
          <label for="mandatoryNicknameInput" class="profile-field-label">Nickname unic</label>
          <input id="mandatoryNicknameInput" class="onboarding-input" placeholder="@nume_prenume" maxlength="31" autocomplete="off" aria-label="Nickname" />
          <p id="mandatoryNicknameStatus" class="profile-nickname-status hidden" role="status" aria-live="polite"></p>
          <button id="saveMandatoryNicknameBtn" class="main" type="button" style="width:100%;margin-top:16px">Salvează și continuă</button>
        </div>`;
      document.body.appendChild(modal);
    }

    const input = modal.querySelector('#mandatoryNicknameInput');
    const status = modal.querySelector('#mandatoryNicknameStatus');
    const saveButton = modal.querySelector('#saveMandatoryNicknameBtn');

    const showError = (message) => {
      if (!status) return;
      status.textContent = message;
      status.className = 'profile-nickname-status error';
    };

    const saveNickname = async () => {
      const nickname = input ? input.value : '';
      if (saveButton) saveButton.disabled = true;
      if (status) {
        status.textContent = 'Se salvează...';
        status.className = 'profile-nickname-status';
      }
      try {
        await savePublicProfile(currentUser.name, nickname);
        modal.classList.add('hidden');
        if (!document.querySelector('.modal:not(.hidden)')) document.body.classList.remove('modal-open');
        mandatoryNicknamePromise = null;
        resolve(true);
      } catch (error) {
        showError(error && error.message ? error.message : 'Nickname-ul nu a putut fi salvat.');
      } finally {
        if (saveButton) saveButton.disabled = false;
      }
    };

    if (saveButton) saveButton.onclick = saveNickname;
    if (input) {
      input.onkeydown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          saveNickname();
        }
      };
    }

    const onboardingModal = document.getElementById('onboardingModal');
    if (onboardingModal) onboardingModal.classList.add('hidden');
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    setTimeout(() => input && input.focus(), 0);
  });

  return mandatoryNicknamePromise;
}

window.ensureMandatoryNicknameForCurrentUser = ensureMandatoryNicknameForCurrentUser;

let presenceConnectionRef = null;
let presenceConnectionHandler = null;
let activePresenceRef = null;

function firebasePresenceTimestamp() {
  try { return firebase.database.ServerValue.TIMESTAMP; } catch (_) { return Date.now(); }
}

function stopFirebasePresence(markOffline = false) {
  if (presenceConnectionRef && presenceConnectionHandler) {
    try { presenceConnectionRef.off('value', presenceConnectionHandler); } catch (_) {}
  }
  if (activePresenceRef) {
    try { activePresenceRef.onDisconnect().cancel(); } catch (_) {}
    if (markOffline) {
      try { activePresenceRef.set({ state: 'offline', lastChanged: firebasePresenceTimestamp() }); } catch (_) {}
    }
  }
  presenceConnectionRef = null;
  presenceConnectionHandler = null;
  activePresenceRef = null;
}

function initializeFirebasePresence(fbUser) {
  if (!fbUser || !fbUser.uid || !isFirebaseAvailable()) return;
  stopFirebasePresence(false);

  activePresenceRef = getUserProfileRef(fbUser.uid, getCurrentDataScope()).child('presence');
  presenceConnectionRef = rdb.ref('.info/connected');
  presenceConnectionHandler = snapshot => {
    if (snapshot.val() !== true || !activePresenceRef) return;
    const offlineState = { state: 'offline', lastChanged: firebasePresenceTimestamp() };
    const onlineState = { state: 'online', lastChanged: firebasePresenceTimestamp() };
    activePresenceRef.onDisconnect().set(offlineState)
      .then(() => activePresenceRef && activePresenceRef.set(onlineState))
      .catch(error => console.warn('Could not update Firebase presence:', error));
  };
  presenceConnectionRef.on('value', presenceConnectionHandler);
}

// Initialize Firebase Auth listeners and helpers
function initFirebaseAuth() {
  if (!isFirebaseAvailable() || typeof firebase.auth !== 'function') return;

  firebase.auth().onAuthStateChanged(async (fbUser) => {
    if (!fbUser) {
      stopFirebasePresence(true);
      return;
    }
    try {
      const uid = fbUser.uid;
      let storedProfile = null;
      let remoteProfile = null;

      try {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.id === uid) {
            storedProfile = parsed;
          }
        }
      } catch (e) {
        console.warn('Could not parse stored currentUser:', e);
      }

      if (isFirebaseAvailable()) {
        try {
          const activeScope = getCurrentDataScope();
          const snapshot = await getUserProfileRef(uid, activeScope).once('value');
          if (snapshot.exists()) {
            remoteProfile = snapshot.val();
          }
        } catch (e) {
          console.warn('Could not load remote user profile:', e);
        }
      }

      const baseProfile = remoteProfile || storedProfile;
      const name = (baseProfile && baseProfile.name) ? baseProfile.name : (fbUser.displayName || fbUser.email || ('user_' + Date.now()));
      const createdAt = (baseProfile && baseProfile.createdAt) ? baseProfile.createdAt : (fbUser.metadata && fbUser.metadata.creationTime ? fbUser.metadata.creationTime : new Date().toISOString());
      const telegramChatId = (baseProfile && (baseProfile.telegramChatId || baseProfile.telegram_chat_id)) ? (baseProfile.telegramChatId || baseProfile.telegram_chat_id) : null;
      const profile = {
        ...(baseProfile && typeof baseProfile === 'object' ? baseProfile : {}),
        id: uid,
        name: name,
        createdAt: createdAt,
        lastLogin: new Date().toISOString(),
        language: typeof getSavedLang === 'function' ? getSavedLang() : 'ro',
        ...(telegramChatId ? { telegramChatId, telegram_chat_id: telegramChatId } : {})
      };

      // Persist locally and remotely
      currentUser = profile;
      try { localStorage.setItem('currentUser', JSON.stringify(profile)); localStorage.setItem('userOnboarded', 'true'); } catch(e){}

      try {
        const activeScope = getCurrentDataScope();
        await getUserProfileRef(uid, activeScope).update(profile);
        console.log(`✅ Firebase Auth user updated in RTDB (${activeScope}):`, uid);
      } catch (e) { console.warn('Could not update auth user in RTDB', e); }

      currentUser = profile;
      try { updateTelegramConnectionUi(profile); } catch (e) { console.warn('Could not update Telegram UI state', e); }
      initializeFirebasePresence(fbUser);

      // A Google-authenticated profile must have a unique nickname before the app can be used.
      await ensureMandatoryNicknameForCurrentUser();
      
      // Load partner nicknames from Firebase for this user
      try { await loadPartnerNicknamesFromFirebase(); } catch (e) { console.warn('Could not load partner nicknames', e); }
      try { await loadPartnerGroupsFromFirebase(); } catch (e) { console.warn('Could not load partner groups', e); }
    } catch (e) {
      console.error('onAuthStateChanged handler error', e);
    }
    // Update auth-related UI if present
    try { updateAuthUI(); } catch (e) { /* ignore */ }
  });
}

function signInWithGoogle() {
  if (!isFirebaseAvailable() || typeof firebase.auth !== 'function') {
    if (typeof showAlertApp === 'function') showAlertApp('Firebase Auth nu este disponibil'); else alert('Firebase Auth nu este disponibil');
    return;
  }
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(result => {
    console.log('✅ Google sign-in success', result.user && result.user.uid);
  }).catch(err => {
    console.error('Google sign-in error', err);
    const code = err && err.code ? String(err.code) : '';
    let message = 'Eroare autentificare: ' + (err && err.message ? err.message : 'necunoscuta');

    if (code === 'auth/operation-not-supported-in-this-environment') {
      message = 'Google Sign-In nu merge pe file://. Ruleaza aplicatia pe http://localhost sau pe un domeniu https.';
    } else if (code === 'auth/unauthorized-domain') {
      message = 'Domeniu neautorizat in Firebase Auth. Adauga domeniul curent la Authorized domains in consola Firebase.';
    } else if (code === 'auth/popup-blocked') {
      message = 'Popup-ul Google a fost blocat de browser. Permite popup-uri pentru acest site si incearca din nou.';
    }

    if (typeof showAlertApp === 'function') showAlertApp(message); else alert(message);
  });
}

async function signOut() {
  try {
    if (typeof showConfirmApp === 'function') {
      const confirmed = await showConfirmApp(
        'Esti sigur ca vrei sa deconectezi contul Google?',
        'Confirmare deconectare'
      );
      if (!confirmed) return;
    }
  } catch (err) {
    console.warn('Could not open sign-out confirmation modal', err);
  }

  try {
    if (isFirebaseAvailable() && firebase.auth && firebase.auth().signOut) {
      firebase.auth().signOut().then(() => {
        currentUser = null;
        partnerNicknamesCache = {}; // Clear nickname cache
        try { localStorage.removeItem('currentUser'); localStorage.removeItem('userOnboarded'); } catch(e){}
        updateAuthUI();
        if (typeof showAlertApp === 'function') showAlertApp('Deconectat cu succes'); else alert('Deconectat cu succes');
      }).catch(err => {
        console.error('Sign-out error', err);
        if (typeof showAlertApp === 'function') showAlertApp('Eroare la deconectare: ' + err.message); else alert('Eroare la deconectare: ' + err.message);
      });
    } else {
      // Fallback: clear local session
      currentUser = null;
      partnerNicknamesCache = {}; // Clear nickname cache
      try { localStorage.removeItem('currentUser'); localStorage.removeItem('userOnboarded'); } catch(e){}
      updateAuthUI();
    }
  } catch (e) {
    console.error('signOut error', e);
  }
}

function getTelegramNotificationConfig() {
  const cfg = (window.APP_ENV && window.APP_ENV.notificationConfig) || {};
  return {
    token: String(cfg.TELEGRAM_BOT_TOKEN || '').trim(),
    apiBase: String(cfg.TELEGRAM_API_BASE || 'https://api.telegram.org').trim(),
    botUsername: String(cfg.TELEGRAM_BOT_USERNAME || '').trim(),
    linkTokenTtlMinutes: Math.max(1, Number(cfg.TELEGRAM_LINK_TOKEN_TTL_MINUTES || 30) || 30)
  };
}

function isCurrentUserAdmin(profile = null) {
  const user = profile || currentUser || {};
  if (!user || typeof user !== 'object') return false;

  if (user.isAdmin === true) return true;

  const role = String(user.role || user.userType || '').trim().toLowerCase();
  if (role === 'admin' || role === 'administrator' || role === 'superadmin') return true;

  const configuredAdminIds = Array.isArray(window.APP_ENV && window.APP_ENV.adminUserIds)
    ? window.APP_ENV.adminUserIds.map(v => String(v || '').trim()).filter(Boolean)
    : [];
  if (configuredAdminIds.includes(String(user.id || '').trim())) return true;

  const configuredAdminEmails = Array.isArray(window.APP_ENV && window.APP_ENV.adminEmails)
    ? window.APP_ENV.adminEmails.map(v => String(v || '').trim().toLowerCase()).filter(Boolean)
    : [];

  let currentEmail = '';
  try {
    currentEmail = String((firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.email) || '').trim().toLowerCase();
  } catch (_) {
    currentEmail = '';
  }
  if (currentEmail && configuredAdminEmails.includes(currentEmail)) return true;

  return false;
}

function getBroadcastDraftStorageKey(scope) {
  return `telegramBroadcastDraft:${scope}`;
}

function showBroadcastDetailsPrompt(scope, environmentLabel) {
  return new Promise(resolve => {
    const draftKey = getBroadcastDraftStorageKey(scope);
    let savedDraft = {};
    try { savedDraft = JSON.parse(localStorage.getItem(draftKey) || '{}') || {}; } catch (error) { savedDraft = {}; }
    const backdrop = document.createElement('div');
    backdrop.className = 'app-modal-backdrop';
    const modal = document.createElement('div');
    modal.className = 'app-modal broadcast-details-modal';
    const title = document.createElement('h3');
    title.textContent = 'Detalii update aplicație';
    const description = document.createElement('p');
    description.className = 'app-modal-message';
    description.textContent = `Completează textele pentru utilizatorii din ${environmentLabel}, în română, rusă și engleză.`;
    const fields = document.createElement('div');
    fields.className = 'broadcast-details-fields';
    const createField = (labelText, placeholder) => {
      const label = document.createElement('label');
      label.textContent = labelText;
      const textarea = document.createElement('textarea');
      textarea.className = 'broadcast-details-textarea';
      textarea.rows = 3;
      textarea.maxLength = 1000;
      textarea.placeholder = placeholder;
      label.appendChild(textarea);
      fields.appendChild(label);
      return textarea;
    };
    const languages = [
      { code: 'ro', label: 'Română', implementations: 'Implementări noi', improvements: 'Îmbunătățiri' },
      { code: 'ru', label: 'Русский', implementations: 'Новые возможности', improvements: 'Улучшения' },
      { code: 'en', label: 'English', implementations: 'New features', improvements: 'Improvements' }
    ];
    const inputs = {};
    let translateButton = null;
    languages.forEach(language => {
      const group = document.createElement('section');
      group.className = 'broadcast-language-group';
      const heading = document.createElement('strong');
      heading.textContent = language.label;
      group.appendChild(heading);
      fields.appendChild(group);
      const implementationsInput = createField(language.implementations, '');
      const improvementsInput = createField(language.improvements, '');
      group.append(implementationsInput.parentElement, improvementsInput.parentElement);
      if (language.code === 'ro') {
        translateButton = document.createElement('button');
        translateButton.type = 'button';
        translateButton.className = 'app-btn broadcast-translate-button';
        translateButton.textContent = 'Traducere';
        translateButton.title = 'Traduce textele din română în rusă și engleză';
        group.appendChild(translateButton);
      }
      inputs[language.code] = { implementationsInput, improvementsInput };
      implementationsInput.value = String(savedDraft[language.code]?.implementations || '');
      improvementsInput.value = String(savedDraft[language.code]?.improvements || '');
    });
    const validation = document.createElement('p');
    validation.className = 'broadcast-details-validation';
    const actions = document.createElement('div');
    actions.className = 'app-modal-actions actions-row-equal';
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'app-btn';
    cancel.textContent = 'Anulează';
    const draftButton = document.createElement('button');
    draftButton.type = 'button';
    draftButton.className = 'app-btn broadcast-draft-button';
    draftButton.textContent = 'Draft';
    const sendButton = document.createElement('button');
    sendButton.type = 'button';
    sendButton.className = 'app-btn primary';
    sendButton.textContent = 'Trimite';
    let resizeObserver = null;
    const finish = value => {
      resizeObserver?.disconnect();
      backdrop.remove();
      resolve(value);
    };
    const getLocalizedDetails = () => Object.fromEntries(languages.map(language => [language.code, {
      implementations: inputs[language.code].implementationsInput.value.trim(),
      improvements: inputs[language.code].improvementsInput.value.trim()
    }]));
    translateButton.onclick = async () => {
      const implementations = inputs.ro.implementationsInput.value.trim();
      const improvements = inputs.ro.improvementsInput.value.trim();
      if (!implementations || !improvements) {
        validation.textContent = 'Completează ambele câmpuri în română înainte de traducere.';
        return;
      }
      const configuredUrl = String(window.APP_ENV?.translationApiUrl || '').trim();
      const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
      const translationUrl = configuredUrl || (isLocal ? 'http://127.0.0.1:8787/api/translate' : '/api/translate');
      translateButton.disabled = true;
      validation.textContent = 'Se traduce...';
      try {
        const response = await fetch(translationUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ implementations, improvements })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.translations) throw new Error(result.error || 'Eroare de traducere.');
        inputs.ru.implementationsInput.value = result.translations.ru.implementations || '';
        inputs.ru.improvementsInput.value = result.translations.ru.improvements || '';
        inputs.en.implementationsInput.value = result.translations.en.implementations || '';
        inputs.en.improvementsInput.value = result.translations.en.improvements || '';
        validation.textContent = 'Traducerea a fost completată în rusă și engleză.';
      } catch (error) {
        validation.textContent = error.message || 'Nu am putut efectua traducerea.';
      } finally {
        translateButton.disabled = false;
      }
    };
    cancel.onclick = () => finish(null);
    draftButton.onclick = () => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(getLocalizedDetails()));
      } catch (error) {
        console.warn('Could not save broadcast draft:', error);
      }
      finish(null);
    };
    sendButton.onclick = () => {
      const details = getLocalizedDetails();
      const incomplete = languages.some(language => !details[language.code].implementations || !details[language.code].improvements);
      if (incomplete) {
        validation.textContent = 'Completează „Implementări noi” și „Îmbunătățiri” pentru română, rusă și engleză.';
        return;
      }
      finish(details);
    };
    fields.onkeydown = event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') sendButton.click();
    };
    actions.append(draftButton, cancel, sendButton);
    modal.append(title, description, fields, validation, actions);
    backdrop.appendChild(modal);
    backdrop.onclick = event => { if (event.target === backdrop) finish(null); };
    document.body.appendChild(backdrop);
    const resizeModalToFields = () => {
      const maxWidth = window.innerWidth - 24;
      const horizontalPadding = 32;
      const requiredWidth = fields.scrollWidth + horizontalPadding;
      if (requiredWidth > modal.clientWidth) {
        modal.style.width = `${Math.min(maxWidth, requiredWidth)}px`;
      }
    };
    resizeObserver = new ResizeObserver(resizeModalToFields);
    Object.values(inputs).forEach(languageInputs => {
      resizeObserver.observe(languageInputs.implementationsInput);
      resizeObserver.observe(languageInputs.improvementsInput);
    });
    inputs.ro.implementationsInput.focus();
  });
}

function buildBroadcastAppLink(scope) {
  const configuredBaseUrl = String(window.APP_ENV?.appUrls?.[scope] || '').trim();
  const appUrl = new URL('/', configuredBaseUrl || window.location.href);
  if (scope === 'test') appUrl.searchParams.set('scope', 'test');
  return appUrl.toString();
}

function normalizeUserLanguage(language) {
  const normalized = String(language || '').trim().toLowerCase();
  return ['ro', 'ru', 'en'].includes(normalized) ? normalized : 'ro';
}

function escapeTelegramHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildLocalizedBroadcastMessage(language, updateDetails, appLink) {
  const copy = {
    ro: {
      title: '📣 A apărut o nouă versiune a aplicației.',
      implementations: '✨ Implementări noi',
      improvements: '🛠️ Îmbunătățiri',
      open: 'Intră în app pentru a vedea noutățile:'
    },
    ru: {
      title: '📣 Вышла новая версия приложения.',
      implementations: '✨ Новые возможности',
      improvements: '🛠️ Улучшения',
      open: 'Откройте приложение, чтобы увидеть обновления:'
    },
    en: {
      title: '📣 A new version of the app is available.',
      implementations: '✨ New features',
      improvements: '🛠️ Improvements',
      open: 'Open the app to see what’s new:'
    }
  }[normalizeUserLanguage(language)];
  const localizedDetails = updateDetails?.[normalizeUserLanguage(language)] || {};
  const implementations = String(localizedDetails.implementations || '').trim();
  const improvements = String(localizedDetails.improvements || '').trim();
  return [
    copy.title,
    improvements && `<b>❗❗ ${copy.improvements}</b>\n${escapeTelegramHtml(improvements)}`,
    implementations && `<b>❗❗ ${copy.implementations}</b>\n${escapeTelegramHtml(implementations)}`,
    copy.open,
    escapeTelegramHtml(appLink)
  ].filter(Boolean).join('\n\n');
}

async function sendTelegramVersionBroadcastToProduction() {
  if (!isCurrentUserAdmin()) {
    if (typeof showAlertApp === 'function') await showAlertApp('Aceasta actiune este disponibila doar pentru Admin.');
    else alert('Aceasta actiune este disponibila doar pentru Admin.');
    return;
  }

  const targetScope = getCurrentDataScope();
  const isTestBroadcast = targetScope === 'test';
  const environmentLabel = isTestBroadcast ? 'test' : 'producție';
  const updateDetails = await showBroadcastDetailsPrompt(targetScope, environmentLabel);
  if (updateDetails === null) return;
  try { localStorage.removeItem(getBroadcastDraftStorageKey(targetScope)); } catch (error) { /* storage may be unavailable */ }

  if (!isFirebaseAvailable()) {
    if (typeof showAlertApp === 'function') await showAlertApp('Firebase indisponibil.');
    else alert('Firebase indisponibil.');
    return;
  }

  const { token, apiBase } = getTelegramNotificationConfig();
  if (!token) {
    if (typeof showAlertApp === 'function') await showAlertApp('Lipseste TELEGRAM_BOT_TOKEN in configuratie.');
    else alert('Lipseste TELEGRAM_BOT_TOKEN in configuratie.');
    return;
  }

  const usersSnapshot = await getScopedUsersRootRefForScope(targetScope).once('value');
  const adminUserId = String(getCurrentUserId() || '').trim();
  const adminChatId = String((currentUser && (currentUser.telegramChatId || currentUser.telegram_chat_id)) || '').trim();
  const chatIds = new Set();
  const recipientsByChatId = new Map();
  const languageByChatId = new Map();

  if (usersSnapshot.exists()) {
    usersSnapshot.forEach(child => {
      const user = child.val() || {};
      const userId = String(user.id || child.key || '').trim();
      if (adminUserId && userId === adminUserId) return;

      const chatId = String(user.telegramChatId || user.telegram_chat_id || '').trim();
      if (adminChatId && chatId && chatId === adminChatId) return;
      if (chatId) {
        chatIds.add(chatId);
        if (!recipientsByChatId.has(chatId)) {
          const recipientName = String(user.name || user.email || userId || chatId).trim();
          recipientsByChatId.set(chatId, recipientName || chatId);
          languageByChatId.set(chatId, normalizeUserLanguage(user.language || user.preferredLanguage || user.siteLang));
        }
      }
    });
  }

  if (chatIds.size === 0) {
    const message = `Nu există utilizatori din ${environmentLabel} cu Telegram conectat.`;
    if (typeof showAlertApp === 'function') await showAlertApp(message);
    else alert(message);
    return;
  }

  const appLink = buildBroadcastAppLink(targetScope);

  const sendPromises = Array.from(chatIds).map(async (chatId) => {
    const message = buildLocalizedBroadcastMessage(languageByChatId.get(chatId), updateDetails, appLink);
    const response = await fetch(`${apiBase}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
    });

    if (!response.ok) {
      const rawText = await response.text().catch(() => '');
      throw new Error(rawText || `HTTP ${response.status}`);
    }

    return {
      chatId,
      name: recipientsByChatId.get(chatId) || chatId
    };
  });

  const results = await Promise.allSettled(sendPromises);
  const sentRecipients = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
  const sentCount = sentRecipients.length;
  const failedCount = results.length - sentCount;
  try {
    const archiveRef = rdb.ref(`broadcastArchives/${targetScope}`).push();
    await archiveRef.set({
      type: 'app-update',
      scope: targetScope,
      sentAt: Date.now(),
      sentBy: { id: getCurrentUserId(), name: getCurrentUserName() },
      content: updateDetails,
      appLink,
      recipients: sentRecipients.map(recipient => ({ name: recipient.name })),
      sentCount,
      failedCount
    });
  } catch (error) {
    console.warn('Could not archive Telegram broadcast:', error);
  }
  console.info(`Broadcast ${targetScope}: ${sentCount} trimise, ${failedCount} eșuate.`);
}

async function openBroadcastArchiveModal() {
  if (!isCurrentUserAdmin() || !isFirebaseAvailable()) return;
  const scope = getCurrentDataScope();
  try {
    const snapshot = await rdb.ref(`broadcastArchives/${scope}`).once('value');
    const entries = [];
    snapshot.forEach(child => entries.push({ id: child.key, ...(child.val() || {}) }));
    entries.sort((a, b) => Number(b.sentAt || 0) - Number(a.sentAt || 0));
    const content = entries.length
      ? `<div class="broadcast-archive-list">${entries.map(entry => {
        const details = entry.content || {};
        const ro = details.ro || {};
        const ru = details.ru || {};
        const en = details.en || {};
        const date = entry.sentAt ? new Date(entry.sentAt).toLocaleString('ro-RO') : 'Dată necunoscută';
        return `<details class="broadcast-archive-item"><summary><strong>${escapeHtmlLocal(date)}</strong><span>${entry.sentCount || 0} trimise${entry.failedCount ? ` · ${entry.failedCount} eșuate` : ''}</span></summary><p><b>Română</b><br>Îmbunătățiri: ${escapeHtmlLocal(ro.improvements || '—')}<br>Implementări: ${escapeHtmlLocal(ro.implementations || '—')}</p><p><b>Русский</b><br>Улучшения: ${escapeHtmlLocal(ru.improvements || '—')}<br>Новые возможности: ${escapeHtmlLocal(ru.implementations || '—')}</p><p><b>English</b><br>Improvements: ${escapeHtmlLocal(en.improvements || '—')}<br>New features: ${escapeHtmlLocal(en.implementations || '—')}</p></details>`;
      }).join('')}</div>`
      : '<p class="broadcast-archive-empty">Nu există încă update-uri arhivate pentru acest mediu.</p>';
    showAppModal({ title: `Arhivă update-uri (${scope})`, message: content, buttons: [{ label: 'Închide', className: 'primary' }] });
  } catch (error) {
    console.error('Could not load broadcast archive:', error);
    if (typeof showAlertApp === 'function') await showAlertApp('Nu am putut încărca arhiva update-urilor.');
  }
}

function toggleAdminUpdateActions() {
  if (!isCurrentUserAdmin()) return;
  showAppModal({
    title: 'Update aplicație',
    message: 'Alege acțiunea dorită.',
    actionsClass: 'actions-row-equal',
    buttons: [
      { label: 'Trimitere update', className: 'primary', onClick() { sendTelegramVersionBroadcastToProduction(); } },
      { label: 'Arhivă update-uri', onClick() { openBroadcastArchiveModal(); } }
    ]
  });
}

async function ensureCurrentUserProfileLoaded() {
  if (!isFirebaseAvailable()) {
    return currentUser;
  }

  let uid = null;
  try {
    const authUser = firebase.auth && firebase.auth().currentUser;
    uid = authUser && authUser.uid ? authUser.uid : (currentUser && currentUser.id ? currentUser.id : null);
  } catch (err) {
    console.warn('ensureCurrentUserProfileLoaded: could not read auth user', err);
  }

  if (!uid) {
    return currentUser;
  }

  try {
    const scope = getCurrentDataScope();
    const snapshot = await getUserProfileRef(uid, scope).once('value');
    if (!snapshot.exists()) {
      return currentUser;
    }

    const remoteProfile = snapshot.val() || {};
    const telegramChatId = remoteProfile.telegramChatId || remoteProfile.telegram_chat_id || null;
    const normalizedProfile = {
      ...remoteProfile,
      id: uid,
      ...(telegramChatId ? { telegramChatId, telegram_chat_id: telegramChatId } : {})
    };

    currentUser = normalizedProfile;
    try {
      localStorage.setItem('currentUser', JSON.stringify(normalizedProfile));
      localStorage.setItem('userOnboarded', 'true');
    } catch (e) {}

    try { updateTelegramConnectionUi(normalizedProfile); } catch (e) { console.warn('Could not update Telegram UI state after profile refresh', e); }
    return normalizedProfile;
  } catch (err) {
    console.warn('ensureCurrentUserProfileLoaded: could not refresh profile', err);
    return currentUser;
  }
}

function hasStoredTelegramChatId(userProfile = null) {
  const profile = userProfile || currentUser || {};
  const chatId = profile.telegramChatId || profile.telegram_chat_id;
  return Boolean(chatId && String(chatId).trim());
}

function areTelegramNotificationsEnabled(userProfile = null) {
  const profile = userProfile || currentUser || {};
  if (!hasStoredTelegramChatId(profile)) return false;
  return profile.telegramNotificationsEnabled !== false;
}

async function enableTelegramNotifications() {
  if (!isFirebaseAvailable() || !getCurrentUserId()) {
    if (typeof showAlertApp === 'function') await showAlertApp('Conecteaza-te ca sa poti activa notificarile Telegram.');
    else alert('Conecteaza-te ca sa poti activa notificarile Telegram.');
    return false;
  }

  try {
    await getUserProfileRef(getCurrentUserId(), getCurrentDataScope()).update({
      telegramNotificationsEnabled: true,
      telegramNotificationsEnabledAt: Date.now()
    });

    if (currentUser && typeof currentUser === 'object') {
      currentUser.telegramNotificationsEnabled = true;
      currentUser.telegramNotificationsEnabledAt = Date.now();
      try { localStorage.setItem('currentUser', JSON.stringify(currentUser)); } catch (_) {}
    }

    if (typeof showAlertApp === 'function') await showAlertApp('Notificarile Telegram au fost activate.');
    else alert('Notificarile Telegram au fost activate.');
    return true;
  } catch (err) {
    const message = err && err.message ? err.message : 'Nu am putut activa notificarile Telegram.';
    if (typeof showAlertApp === 'function') await showAlertApp(message); else alert(message);
    return false;
  } finally {
    refreshTelegramLinkStatus().catch(() => {});
  }
}

function updateTelegramConnectionUi(userProfile = null) {
  const statusEl = document.getElementById('telegramLinkStatus');
  const linkBtn = document.getElementById('telegramLinkBtn');
  const hasChatId = hasStoredTelegramChatId(userProfile);
  const notificationsEnabled = areTelegramNotificationsEnabled(userProfile);

  if (!linkBtn && !statusEl) return;

  if (hasChatId && notificationsEnabled) {
    if (statusEl) {
      statusEl.innerText = `Telegram conectat (chat id: ${String((userProfile || currentUser || {}).telegramChatId || (userProfile || currentUser || {}).telegram_chat_id).trim()})`;
      statusEl.style.color = '#2d8a4a';
    }
    if (linkBtn) {
      linkBtn.innerText = 'Deconecteaza notificari Telegram';
      linkBtn.classList.add('telegram-disconnect-button');
      linkBtn.onclick = () => disconnectTelegramNotifications();
    }
  } else if (hasChatId && !notificationsEnabled) {
    if (statusEl) {
      statusEl.innerText = `Telegram conectat (chat id: ${String((userProfile || currentUser || {}).telegramChatId || (userProfile || currentUser || {}).telegram_chat_id).trim()}) - notificari oprite`;
      statusEl.style.color = '#b56a00';
    }
    if (linkBtn) {
      linkBtn.innerText = 'Activeaza notificari Telegram';
      linkBtn.classList.remove('telegram-disconnect-button');
      linkBtn.onclick = () => enableTelegramNotifications();
    }
  } else {
    if (statusEl) {
      statusEl.innerText = 'Telegram neconectat';
      statusEl.style.color = '#5d6f8a';
    }
    if (linkBtn) {
      linkBtn.innerText = 'Conectare notificari Telegram';
      linkBtn.classList.remove('telegram-disconnect-button');
      linkBtn.onclick = () => startTelegramLinkFlow();
    }
  }
}

function normalizeTelegramBotUsername(rawValue) {
  let value = String(rawValue || '').trim();
  if (!value) return '';

  // Accept values like '@my_bot', 'my_bot', 'https://t.me/my_bot', 't.me/my_bot'.
  value = value.replace(/^https?:\/\/t\.me\//i, '').replace(/^t\.me\//i, '');
  value = value.replace(/^@+/, '');
  value = value.split('?')[0].split('/')[0].trim();

  return value;
}

function generateTelegramLinkToken() {
  const tokenLength = 24;
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(tokenLength);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => (b % 36).toString(36)).join('');
  }

  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

async function createTelegramLinkToken() {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase indisponibil.');
  }

  const userId = getCurrentUserId();
  const userName = getCurrentUserName();
  if (!userId) {
    throw new Error('Utilizator neautentificat.');
  }

  const { linkTokenTtlMinutes } = getTelegramNotificationConfig();
  const token = generateTelegramLinkToken();
  const now = Date.now();
  const expiresAt = now + (linkTokenTtlMinutes * 60 * 1000);
  const scope = getCurrentDataScope();
  const userProfilePath = scope === 'test'
    ? `users/test/${userId}`
    : `users/${userId}`;

  await rdb.ref('telegramLinkTokens/' + token).set({
    token,
    userId,
    userName,
    linkVersion: 2,
    scope,
    userProfilePath,
    isTestEnvironment: scope === 'test',
    createdAt: now,
    expiresAt,
    used: false
  });

  return token;
}

async function readActiveUserProfile(userId) {
  if (!isFirebaseAvailable() || !userId) {
    return { user: {}, scope: null };
  }

  const scope = getCurrentDataScope();
  try {
    const ref = getUserProfileRef(userId, scope);
    if (!ref) return { user: {}, scope };
    const snapshot = await ref.once('value');
    if (snapshot.exists()) {
      const value = snapshot.val() || {};
      return { user: value, scope };
    }
  } catch (err) {
    console.warn(`Could not read Telegram profile for scope '${scope}'`, err);
  }

  return { user: {}, scope };
}

async function refreshTelegramLinkStatus() {
  const statusEl = document.getElementById('telegramLinkStatus');
  const linkBtn = document.getElementById('telegramLinkBtn');

  if (!isFirebaseAvailable() || !getCurrentUserId()) {
    if (statusEl) {
      statusEl.innerText = 'Conecteaza-te ca sa activezi Telegram.';
    }
    if (linkBtn) {
      linkBtn.innerText = 'Conectare notificari Telegram';
      linkBtn.classList.remove('telegram-disconnect-button');
      linkBtn.onclick = () => startTelegramLinkFlow();
    }
    return;
  }

  try {
    const { user } = await readActiveUserProfile(getCurrentUserId());
    const chatId = user.telegramChatId || user.telegram_chat_id;
    const notificationsEnabled = user.telegramNotificationsEnabled !== false;
    if (chatId && notificationsEnabled) {
      if (statusEl) {
        statusEl.innerText = `Telegram conectat (chat id: ${chatId})`;
        statusEl.style.color = '#2d8a4a';
      }
      if (linkBtn) {
        linkBtn.innerText = 'Deconecteaza notificari Telegram';
        linkBtn.classList.add('telegram-disconnect-button');
        linkBtn.onclick = () => disconnectTelegramNotifications();
      }
    } else if (chatId && !notificationsEnabled) {
      if (statusEl) {
        statusEl.innerText = `Telegram conectat (chat id: ${chatId}) - notificari oprite`;
        statusEl.style.color = '#b56a00';
      }
      if (linkBtn) {
        linkBtn.innerText = 'Activeaza notificari Telegram';
        linkBtn.classList.remove('telegram-disconnect-button');
        linkBtn.onclick = () => enableTelegramNotifications();
      }
    } else {
      if (statusEl) {
        statusEl.innerText = 'Telegram neconectat';
        statusEl.style.color = '#5d6f8a';
      }
      if (linkBtn) {
        linkBtn.innerText = 'Conectare notificari Telegram';
        linkBtn.classList.remove('telegram-disconnect-button');
        linkBtn.onclick = () => startTelegramLinkFlow();
      }
    }
  } catch (err) {
    if (statusEl) {
      statusEl.innerText = 'Status Telegram indisponibil';
      statusEl.style.color = '#b56a00';
    }
  }
}

async function disconnectTelegramNotifications() {
  try {
    if (typeof showConfirmApp === 'function') {
      const confirmed = await showConfirmApp(
        'Esti sigur ca vrei sa deconectezi notificarile Telegram?',
        'Confirmare deconectare'
      );
      if (!confirmed) return;
    }
  } catch (err) {
    console.warn('Could not open Telegram disconnect confirmation modal', err);
  }

  if (!isFirebaseAvailable() || !getCurrentUserId()) {
    if (typeof showAlertApp === 'function') {
      showAlertApp('Conecteaza-te ca sa poti deconecta Telegram.');
    } else {
      alert('Conecteaza-te ca sa poti deconecta Telegram.');
    }
    return;
  }

  try {
    await getUserProfileRef(getCurrentUserId(), getCurrentDataScope()).update({
      telegramNotificationsEnabled: false,
      telegramNotificationsDisabledAt: Date.now()
    });

    if (currentUser && typeof currentUser === 'object') {
      currentUser.telegramNotificationsEnabled = false;
      currentUser.telegramNotificationsDisabledAt = Date.now();
      try { localStorage.setItem('currentUser', JSON.stringify(currentUser)); } catch (_) {}
    }

  } catch (err) {
    const message = err && err.message ? err.message : 'Nu am putut deconecta Telegram.';
    if (typeof showAlertApp === 'function') showAlertApp(message); else alert(message);
  } finally {
    refreshTelegramLinkStatus().catch(() => {});
  }
}

function showTelegramLinkLoading(message, onDelayedAction) {
  let modal = document.getElementById('telegramLinkLoadingModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'telegramLinkLoadingModal';
    modal.className = 'modal';
    modal.setAttribute('data-backdrop-close', 'false');
    modal.innerHTML = [
      '<div class="modal-content telegram-link-loading-card">',
      '  <div class="telegram-link-loading-spinner" aria-hidden="true"></div>',
      '  <div class="telegram-link-loading-title">Conectare Telegram in curs...</div>',
      '  <div class="telegram-link-loading-message"></div>',
      '  <button type="button" class="telegram-link-loading-action">Hide</button>',
      '</div>'
    ].join('');
    document.body.appendChild(modal);
  }

  const messageEl = modal.querySelector('.telegram-link-loading-message');
  if (messageEl) {
    messageEl.innerText = message || 'Astept confirmarea din Telegram. Apasa Start in bot daca nu ai facut deja.';
  }

  const actionBtn = modal.querySelector('.telegram-link-loading-action');
  if (actionBtn) {
    const existingIntervalId = Number(modal.dataset.countdownIntervalId || 0);
    if (existingIntervalId) {
      clearInterval(existingIntervalId);
      delete modal.dataset.countdownIntervalId;
    }

    let secondsLeft = 10;
    actionBtn.disabled = true;
    actionBtn.innerText = `Hide (${secondsLeft}s)`;

    actionBtn.onclick = () => {
      if (typeof onDelayedAction === 'function') {
        onDelayedAction();
      }
    };

    const countdownInterval = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft > 0) {
        actionBtn.innerText = `Hide (${secondsLeft}s)`;
        return;
      }

      clearInterval(countdownInterval);
      delete modal.dataset.countdownIntervalId;
      actionBtn.disabled = false;
      actionBtn.innerText = 'Hide';
    }, 1000);

    modal.dataset.countdownIntervalId = String(countdownInterval);
  }

  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function hideTelegramLinkLoading() {
  const modal = document.getElementById('telegramLinkLoadingModal');
  if (modal) {
    const intervalId = Number(modal.dataset.countdownIntervalId || 0);
    if (intervalId) {
      clearInterval(intervalId);
      delete modal.dataset.countdownIntervalId;
    }

    const actionBtn = modal.querySelector('.telegram-link-loading-action');
    if (actionBtn) {
      actionBtn.disabled = true;
      actionBtn.innerText = 'Hide';
      actionBtn.onclick = null;
    }

    modal.classList.add('hidden');
  }
  if (!document.querySelector('.modal:not(.hidden)')) {
    document.body.classList.remove('modal-open');
  }
}

function waitForTelegramLinkConfirmation(userId, timeoutMs) {
  return new Promise((resolve, reject) => {
    if (!isFirebaseAvailable() || !userId) {
      reject(new Error('Firebase indisponibil pentru confirmare Telegram.'));
      return;
    }

    const scope = getCurrentDataScope();
    const ref = getUserProfileRef(userId, scope);
    let finished = false;

    const finish = (ok, value) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      try { ref.off('value', onValue); } catch (e) {}
      if (ok) resolve(value);
      else reject(value);
    };

    const onValue = (snapshot) => {
      const user = snapshot && snapshot.exists() ? (snapshot.val() || {}) : {};
      const chatId = user.telegramChatId || user.telegram_chat_id;
      if (chatId) {
        finish(true, { chatId: String(chatId), scope });
      }
    };

    const timer = setTimeout(() => {
      finish(false, new Error('Timeout confirmare Telegram'));
    }, Number(timeoutMs || 150000));

    if (ref) {
      ref.on('value', onValue, (err) => {
        if (!finished) {
          finish(false, err || new Error('Nu am putut verifica statusul Telegram.'));
        }
      });
    } else {
      finish(false, new Error('Nu am putut verifica statusul Telegram.'));
    }
  });
}

async function startTelegramLinkFlow() {
  let pendingWindow = null;
  // Open a blank tab first so browsers treat it as user-initiated.
  try {
    pendingWindow = window.open('', '_blank');
  } catch (e) {
    pendingWindow = null;
  }

  try {
    try { await ensureCurrentUserProfileLoaded(); } catch (_) {}

    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      throw new Error('Utilizator neautentificat.');
    }

    const existingChatId = String((currentUser && (currentUser.telegramChatId || currentUser.telegram_chat_id)) || '').trim();
    if (existingChatId) {
      const alreadyEnabled = currentUser && currentUser.telegramNotificationsEnabled !== false;
      if (!alreadyEnabled) {
        await enableTelegramNotifications();
      } else if (typeof showAlertApp === 'function') {
        await showAlertApp('Notificarile Telegram sunt deja active.');
      } else {
        alert('Notificarile Telegram sunt deja active.');
      }
      return;
    }

    const { botUsername } = getTelegramNotificationConfig();
    const normalizedBotUsername = normalizeTelegramBotUsername(botUsername);
    if (!normalizedBotUsername) {
      throw new Error('Lipseste TELEGRAM_BOT_USERNAME in config.');
    }

    const token = await createTelegramLinkToken();
    const deepLink = `https://t.me/${normalizedBotUsername}?start=link_v2_${token}`;

    let opened = false;
    if (pendingWindow && !pendingWindow.closed) {
      try {
        pendingWindow.location.href = deepLink;
        opened = true;
      } catch (e) {
        opened = false;
      }
    }

    if (!opened) {
      try {
        const popup = window.open(deepLink, '_blank');
        opened = !!(popup && !popup.closed);
      } catch (e) {
        opened = false;
      }
    }

    if (!opened) {
      throw new Error('Browserul a blocat tab-ul nou. Permite pop-up-uri pentru acest site si incearca din nou.');
    }

    const waitPromise = waitForTelegramLinkConfirmation(currentUserId, 180000);
    showTelegramLinkLoading(
      'Astept confirmarea din Telegram. Apasa Start in bot daca nu ai facut deja.',
      () => {
        hideTelegramLinkLoading();
      }
    );
    const linkResult = await waitPromise;
    const linkedChatId = String((linkResult && linkResult.chatId) || '').trim();
    const linkedScope = String((linkResult && linkResult.scope) || '').trim() || getCurrentDataScope();

    try {
      const updatePayload = {
        telegramNotificationsEnabled: true,
        telegramNotificationsEnabledAt: Date.now()
      };
      if (linkedChatId) {
        updatePayload.telegramChatId = linkedChatId;
        updatePayload.telegram_chat_id = linkedChatId;
      }

      const primaryRef = getUserProfileRef(currentUserId, linkedScope);
      if (!primaryRef) {
        throw new Error(`Nu am putut actualiza statusul Telegram pentru scope '${linkedScope}'.`);
      }
      await primaryRef.update(updatePayload);

      const activeScope = getCurrentDataScope();
      if (activeScope !== linkedScope) {
        const secondaryRef = getUserProfileRef(currentUserId, activeScope);
        if (secondaryRef) {
          await secondaryRef.update({
            telegramNotificationsEnabled: true,
            telegramNotificationsEnabledAt: updatePayload.telegramNotificationsEnabledAt
          });
        }
      }

      if (!currentUser) currentUser = {};
      currentUser = { ...currentUser, ...updatePayload };
      try { localStorage.setItem('currentUser', JSON.stringify(currentUser)); } catch (_) {}
    } catch (persistErr) {
      console.warn('Could not persist telegram notification enabled flag after link', persistErr);
      const persistMessage = persistErr && persistErr.message ? persistErr.message : 'Nu am putut activa notificarile Telegram dupa conectare.';
      if (typeof showAlertApp === 'function') {
        await showAlertApp(persistMessage);
      } else {
        alert(persistMessage);
      }
    }

    hideTelegramLinkLoading();

    if (typeof showTelegramConnectedSuccessModal === 'function') {
      await showTelegramConnectedSuccessModal();
    }
  } catch (err) {
    hideTelegramLinkLoading();
    try {
      if (pendingWindow && !pendingWindow.closed) {
        pendingWindow.close();
      }
    } catch (e) {
      // ignore
    }
    let message = err && err.message ? err.message : 'Nu am putut porni conectarea Telegram.';
    if (message === 'Timeout confirmare Telegram') {
      message = 'Nu am primit confirmarea inca. Daca ai apasat Start in Telegram, verifica din nou in cateva momente.';
    }
    if (typeof showAlertApp === 'function') showAlertApp(message); else alert(message);
  } finally {
    refreshTelegramLinkStatus().catch(() => {});
  }
}

// Helper function to mask email for privacy
function maskEmail(email) {
  if (!email || !email.includes('@')) return email;
  
  const [localPart, domain] = email.split('@');
  
  if (localPart.length <= 3) {
    // If local part is 3 chars or less, show it all
    return email;
  }
  
  // Show first 3 and last 3 chars of local part, mask the middle
  const first3 = localPart.substring(0, 2);
  const last3 = localPart.substring(localPart.length - 2);
  const masked = first3 + '****' + last3;
  
  return masked + '@' + domain;
}

function updateAuthUI() {
  try {
    const signInBtn = document.getElementById('googleSignInBtnSettings');
    const signOutBtn = document.getElementById('googleSignOutBtnSettings');
    const nameEl = document.getElementById('currentUserName');
    const nicknameEl = document.getElementById('currentUserNickname');
    const emailDisplay = document.getElementById('googleEmailDisplay');
    const telegramBtn = document.getElementById('telegramLinkBtn');
    const adminBroadcastBtn = document.getElementById('adminBroadcastBtn');
    const partnersBtn = document.getElementById('openPartnersModalBtn');
    const groupsBtn = document.getElementById('openGroupsModalBtn');

    const canEditName = currentUser && currentUser.name;
    const isGoogleAuthenticated = Boolean(
      currentUser &&
      isFirebaseAvailable() &&
      firebase.auth &&
      firebase.auth().currentUser &&
      firebase.auth().currentUser.uid === currentUser.id
    );

    if (nameEl) {
      nameEl.innerText = canEditName ? currentUser.name : '';
    }
    if (nicknameEl) {
      nicknameEl.textContent = canEditName && currentUser.nickname ? currentUser.nickname : '';
      nicknameEl.classList.toggle('hidden', !nicknameEl.textContent);
    }
    const editBtn = document.getElementById('editNameBtn');
    if (editBtn) {
      editBtn.style.display = canEditName ? 'flex' : 'none';
    }

    if (isGoogleAuthenticated) {
      const isAdmin = isCurrentUserAdmin();
      if (signInBtn) signInBtn.style.display = 'none';
      if (signOutBtn) signOutBtn.style.display = '';
      if (telegramBtn) telegramBtn.style.display = '';
      if (adminBroadcastBtn) {
        adminBroadcastBtn.style.display = isAdmin ? '' : 'none';
        adminBroadcastBtn.textContent = getCurrentDataScope() === 'test' ? 'Trimite update app [test]' : 'Trimite update app';
      }
      if (partnersBtn) partnersBtn.style.display = '';
      if (groupsBtn) groupsBtn.style.display = '';
      
      // Display masked Google email if available
      if (emailDisplay && isFirebaseAvailable() && firebase.auth().currentUser) {
        const fbUser = firebase.auth().currentUser;
        if (fbUser.email) {
          emailDisplay.innerText = maskEmail(fbUser.email);
          emailDisplay.style.display = '';
        } else {
          emailDisplay.style.display = 'none';
        }
      } else if (emailDisplay) {
        emailDisplay.style.display = 'none';
      }
    } else {
      if (signInBtn) signInBtn.style.display = '';
      if (signOutBtn) signOutBtn.style.display = 'none';
      if (telegramBtn) telegramBtn.style.display = 'none';
      if (adminBroadcastBtn) adminBroadcastBtn.style.display = 'none';
      if (partnersBtn) partnersBtn.style.display = 'none';
      if (groupsBtn) groupsBtn.style.display = 'none';
      if (emailDisplay) emailDisplay.style.display = 'none';
    }
  } catch (e) {
    // ignore DOM errors in non-browser contexts
  }
}

// Get current user object
function getCurrentUser() {
  return currentUser;
}

// Get current user name
function getCurrentUserName() {
  return currentUser?.name || 'Unknown';
}

// Get current user ID
function getCurrentUserId() {
  return currentUser?.id || getDeviceId();
}

// Debug
console.log('user-manager.js loaded');

// Session-level cache for partner nicknames (loaded from Firebase or localStorage at app init)
let partnerNicknamesCache = {};

function getPartnerNicknamesLocalStorageKey() {
  return 'partnerNicknames_' + getCurrentUserId();
}

function loadPartnerNicknamesFromLocalStorage() {
  try {
    const stored = localStorage.getItem(getPartnerNicknamesLocalStorageKey());
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (err) {
    console.warn('Could not load partner nicknames from localStorage:', err);
  }
  return {};
}

function savePartnerNicknamesToLocalStorage() {
  try {
    localStorage.setItem(getPartnerNicknamesLocalStorageKey(), JSON.stringify(partnerNicknamesCache || {}));
  } catch (err) {
    console.warn('Could not save partner nicknames to localStorage:', err);
  }
}

function getPartnerNicknames() {
  return partnerNicknamesCache || {};
}

function getLocalPartnerNickname(userId, fallbackName) {
  if (!userId) return fallbackName || 'Unknown';
  const nicknames = getPartnerNicknames();
  return nicknames[userId] || fallbackName || 'Unknown';
}

async function saveLocalPartnerNickname(userId, nickname) {
  if (!userId) return;

  // Update session cache and localStorage for anonymous or offline users
  if (nickname) {
    partnerNicknamesCache[userId] = nickname;
  } else {
    delete partnerNicknamesCache[userId];
  }
  savePartnerNicknamesToLocalStorage();

  // Save to Firebase for any known currentUser (including anonymous device-backed users)
  if (isFirebaseAvailable() && currentUser) {
    try {
      const currentUserId = currentUser.id;
      const scope = getCurrentDataScope();
      const nicknamesRef = getUserProfileRef(currentUserId, scope).child('partnerNicknames');

      if (nickname) {
        await nicknamesRef.child(userId).set(nickname);
        console.log('✅ Nickname salvat în Firebase:', userId, '=', nickname);
      } else {
        await nicknamesRef.child(userId).remove();
        console.log('✅ Nickname șters din Firebase:', userId);
      }
    } catch (error) {
      console.error('❌ Eroare salvare nickname în Firebase:', error);
    }
  }
}

async function loadPartnerNicknamesFromFirebase() {
  const localCache = loadPartnerNicknamesFromLocalStorage();

  if (!isFirebaseAvailable() || !currentUser?.id) {
    partnerNicknamesCache = localCache;
    console.log('✅ Nicknames încărcate din localStorage:', partnerNicknamesCache);
    return;
  }

  try {
    const currentUserId = currentUser.id;
    const snapshot = await getUserProfileRef(currentUserId).child('partnerNicknames').once('value');

    if (snapshot.exists()) {
      partnerNicknamesCache = snapshot.val();
      console.log('✅ Partner nicknames încărcate din Firebase:', partnerNicknamesCache);
    } else {
      partnerNicknamesCache = localCache;
      console.log('✅ Nu sunt nicknames salvate în Firebase pentru user:', currentUserId, 'folosind cache local');
    }
  } catch (error) {
    console.error('❌ Eroare încărcare nicknames din Firebase:', error);
    partnerNicknamesCache = localCache;
  }
}

// Session-level cache for partner groups (loaded from Firebase or localStorage at app init)
let partnerGroupsCache = {};

function getPartnerGroupsLocalStorageKey() {
  return 'partnerGroups_' + getCurrentUserId();
}

function loadPartnerGroupsFromLocalStorage() {
  try {
    const stored = localStorage.getItem(getPartnerGroupsLocalStorageKey());
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (err) {
    console.warn('Could not load partner groups from localStorage:', err);
  }
  return {};
}

function savePartnerGroupsToLocalStorage() {
  try {
    localStorage.setItem(getPartnerGroupsLocalStorageKey(), JSON.stringify(partnerGroupsCache || {}));
  } catch (err) {
    console.warn('Could not save partner groups to localStorage:', err);
  }
}

function getPartnerGroups() {
  return partnerGroupsCache || {};
}

async function loadPartnerGroupsFromFirebase() {
  const localCache = loadPartnerGroupsFromLocalStorage();

  if (!isFirebaseAvailable() || !currentUser?.id) {
    partnerGroupsCache = localCache;
    return;
  }

  try {
    const currentUserId = currentUser.id;
    const snapshot = await getUserProfileRef(currentUserId).child('partnerGroups').once('value');

    if (snapshot.exists()) {
      partnerGroupsCache = snapshot.val();
    } else {
      partnerGroupsCache = localCache;
    }
  } catch (error) {
    console.error('❌ Eroare încărcare grupuri partener din Firebase:', error);
    partnerGroupsCache = localCache;
  }
}

async function savePartnerGroup(group) {
  if (!group || !group.id) return false;

  partnerGroupsCache[group.id] = group;
  savePartnerGroupsToLocalStorage();

  if (isFirebaseAvailable() && currentUser) {
    try {
      const currentUserId = currentUser.id;
      const scope = getCurrentDataScope();
      await getUserProfileRef(currentUserId, scope).child('partnerGroups').child(group.id).set(group);
    } catch (error) {
      console.error('❌ Eroare salvare grup partener în Firebase:', error);
      return false;
    }
  }
  return true;
}

async function deletePartnerGroup(groupId) {
  if (!groupId) return false;

  delete partnerGroupsCache[groupId];
  savePartnerGroupsToLocalStorage();

  if (isFirebaseAvailable() && currentUser) {
    try {
      const currentUserId = currentUser.id;
      const scope = getCurrentDataScope();
      await getUserProfileRef(currentUserId, scope).child('partnerGroups').child(groupId).remove();
    } catch (error) {
      console.error('❌ Eroare ștergere grup partener din Firebase:', error);
      return false;
    }
  }
  return true;
}

// Returns "Eu" (translated) when the given userId is the current user, otherwise
// falls back to the local nickname (or the provided fallback name).
function getDisplayNameForPerson(userId, fallbackName) {
  if (userId && getCurrentUserId && userId === getCurrentUserId()) {
    return (typeof translate === 'function') ? translate('meLabel') : 'Eu';
  }
  return getLocalPartnerNickname(userId, fallbackName);
}

// Check if user has completed onboarding
function isFirstLogin() {
  const v = localStorage.getItem('userOnboarded');
  console.log('isFirstLogin check, userOnboarded=', v, 'currentUser=', currentUser);
  // Treat as first login if flag missing OR no currentUser OR missing name
  if (!v) return true;
  if (!currentUser) return true;
  if (!currentUser.name) return true;
  return false;
}

// Save user to Firebase and localStorage
async function saveUserProfile(name) {
  console.log('saveUserProfile called with name=', name);
  // If Firebase Auth user is signed in, prefer their uid as canonical id
  let userId = getDeviceId();
  try {
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
      userId = firebase.auth().currentUser.uid;
      // If name empty, prefer displayName or email
      if ((!name || name.trim() === '') && firebase.auth().currentUser.displayName) {
        name = firebase.auth().currentUser.displayName;
      }
    }
  } catch (e) {
    // ignore
  }
  // noop to anchor following insertion
  const existingTelegramChatId = currentUser && (currentUser.telegramChatId || currentUser.telegram_chat_id)
    ? (currentUser.telegramChatId || currentUser.telegram_chat_id)
    : null;
  const userProfile = {
    ...(currentUser && typeof currentUser === 'object' ? currentUser : {}),
    id: userId,
    name: name,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    ...(existingTelegramChatId ? { telegramChatId: existingTelegramChatId, telegram_chat_id: existingTelegramChatId } : {})
  };

  // Save to localStorage
  localStorage.setItem('currentUser', JSON.stringify(userProfile));
  localStorage.setItem('userOnboarded', 'true');
  console.log('saveUserProfile -> localStorage updated, userOnboarded set');
  
  // Save to Firebase if available
  if (isFirebaseAvailable()) {
    try {
      const scope = getCurrentDataScope();
      await getUserProfileRef(userId, scope).update(userProfile);
      console.log(`✅ User profile updated in Firebase (${scope}):`, userProfile);
    } catch (error) {
      console.error('❌ Error saving user to Firebase:', error);
    }
  }

  currentUser = userProfile;
  return userProfile;
}

// Load user from localStorage or Firebase
async function loadUserProfile() {
  // Try localStorage first
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      console.log('✅ User loaded from localStorage:', currentUser);
      // If this is a Firebase-authenticated user, try to refresh from remote.
      // Do not discard an anonymous local profile when no remote record exists.
      if (isFirebaseAvailable() && currentUser && typeof currentUser.id === 'string' && !currentUser.id.startsWith('user_')) {
        try {
          const scope = getCurrentDataScope();
          const snapshot = await getUserProfileRef(currentUser.id, scope).once('value');
          if (snapshot.exists()) {
            currentUser = snapshot.val();
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log('✅ User loaded from Firebase (over local):', currentUser);
            try { updateTelegramConnectionUi(currentUser); } catch (e) { console.warn('Could not update Telegram UI state after load', e); }
          } else {
            console.log('loadUserProfile: remote Firebase user missing, keeping local profile');
          }
        } catch (err) {
          console.warn('loadUserProfile: could not verify remote user, using local copy', err);
        }
      }
      return currentUser;
    } catch (error) {
      console.error('❌ Error parsing stored user:', error);
    }
  }

  // Try Firebase auth user if available and no local profile is stored
  if (isFirebaseAvailable() && typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
    try {
      const authUser = firebase.auth().currentUser;
      const scope = getCurrentDataScope();
      const snapshot = await getUserProfileRef(authUser.uid, scope).once('value');
      if (snapshot.exists()) {
        currentUser = snapshot.val();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('✅ User loaded from Firebase:', currentUser);
        try { updateTelegramConnectionUi(currentUser); } catch (e) { console.warn('Could not update Telegram UI state after auth load', e); }
        return currentUser;
      }
    } catch (error) {
      console.error('❌ Error loading user from Firebase:', error);
    }
  }

  // If the user has a device-backed anonymous profile in Firebase, load it by deviceId.
  if (isFirebaseAvailable()) {
    try {
      const deviceId = getDeviceId();
      const scope = getCurrentDataScope();
      const snapshot = await getUserProfileRef(deviceId, scope).once('value');
      if (snapshot.exists()) {
        currentUser = snapshot.val();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('✅ Anonymous user profile loaded from Firebase by deviceId:', currentUser);
        return currentUser;
      }
    } catch (error) {
      console.error('❌ Error loading anonymous device user from Firebase:', error);
    }
  }

  return null;
}

// Update last login timestamp
async function updateLastLogin() {
  if (!currentUser?.id) return;

  currentUser.lastLogin = new Date().toISOString();
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  if (isFirebaseAvailable()) {
    try {
      const scope = getCurrentDataScope();
      await getUserProfileRef(currentUser.id, scope).child('lastLogin').set(currentUser.lastLogin);
    } catch (error) {
      console.error('❌ Error updating last login:', error);
    }
  }
}

function hasUpdatedLastLoginThisSession() {
  return sessionStorage.getItem('lastLoginUpdatedThisSession') === 'true';
}

function markLastLoginUpdatedThisSession() {
  try {
    sessionStorage.setItem('lastLoginUpdatedThisSession', 'true');
  } catch (error) {
    console.warn('Could not mark lastLogin update in sessionStorage:', error);
  }
}

// Get all users from Firebase (for partner selection)
async function getAllUsers() {
  const users = [];
  
  if (isFirebaseAvailable()) {
    try {
      const snapshot = await getScopedUsersRootRef().once('value');
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          if (getCurrentDataScope() === 'production' && child.key === 'test') {
            return;
          }
          const user = child.val();
          if (user && typeof user === 'object' && user.id && user.id !== getCurrentUserId()) {
            users.push(user);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    }
  }

  return users;
}

// ===== PARTNERSHIPS (public name + unique nickname) =====
const NICKNAME_CHANGE_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

function normalizePartnerNickname(value) {
  const normalized = String(value || '').trim().toLowerCase().replace(/^@+/, '');
  return /^[a-z0-9_]{3,30}$/.test(normalized) ? `@${normalized}` : '';
}

function getNicknameIndexRef(nickname, scope = getCurrentDataScope()) {
  const normalized = normalizePartnerNickname(nickname).replace(/^@/, '');
  return normalized ? rdb.ref(`nicknameIndex/${scope}/${normalized}`) : null;
}

async function findUserByNickname(nickname) {
  const normalized = normalizePartnerNickname(nickname);
  if (!normalized) return null;
  try {
    const indexRef = getNicknameIndexRef(normalized);
    const indexSnapshot = indexRef ? await indexRef.once('value') : null;
    const indexedUserId = indexSnapshot && indexSnapshot.val();
    if (indexedUserId) {
      const indexedUser = await getUserById(String(indexedUserId));
      if (indexedUser && normalizePartnerNickname(indexedUser.nickname) === normalized) return indexedUser;
    }
  } catch (error) {
    console.warn('Nickname index unavailable, using compatible lookup:', error);
  }
  const users = await getAllUsersFromFirebase();
  const found = users.find(user => normalizePartnerNickname(user.nickname) === normalized) || null;
  if (found) {
    try { await getNicknameIndexRef(normalized)?.set(found.id); } catch (_) {}
  }
  return found;
}

function getApprovedPartnerIds(profile = currentUser) {
  const partners = profile && profile.approvedPartnerIds;
  return partners && typeof partners === 'object'
    ? Object.keys(partners).filter(id => partners[id] === true)
    : [];
}

async function getApprovedPartnersFromFirebase() {
  try {
    if (isFirebaseAvailable() && currentUser && currentUser.id) {
      const snapshot = await getUserProfileRef(currentUser.id, getCurrentDataScope()).once('value');
      if (snapshot.exists()) {
        currentUser = { ...currentUser, ...snapshot.val(), id: currentUser.id };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
    }
  } catch (error) {
    console.warn('Could not refresh approved partners, using cached profile:', error);
  }
  const approvedIds = new Set(getApprovedPartnerIds());
  if (!approvedIds.size) return [];
  const allUsers = await getAllUsersFromFirebase();
  return allUsers.filter(user => user && approvedIds.has(user.id));
}

async function savePublicProfile(name, nickname) {
  const cleanName = String(name || '').trim();
  const cleanNickname = normalizePartnerNickname(nickname);
  if (!cleanName) throw new Error('Introdu numele și prenumele.');
  if (!cleanNickname) throw new Error('Nickname-ul trebuie să înceapă cu @ și să conțină 3–30 litere mici, cifre sau _.');
  if (!isFirebaseAvailable() || !currentUser || !currentUser.id) throw new Error('Nu există o sesiune activă.');

  const previousNickname = normalizePartnerNickname(currentUser.nickname);
  const isChangingNickname = Boolean(previousNickname && previousNickname !== cleanNickname);
  const lastChangedAt = Number(currentUser.nicknameChangedAt || 0);
  const now = Date.now();
  const nextAllowedAt = lastChangedAt + NICKNAME_CHANGE_COOLDOWN_MS;
  if (isChangingNickname && lastChangedAt > 0 && now < nextAllowedAt && !isCurrentUserAdmin()) {
    const availableDate = new Date(nextAllowedAt).toLocaleDateString('ro-RO', { day: '2-digit', month: 'long', year: 'numeric' });
    throw new Error(`Nickname-ul poate fi schimbat o dată la 30 de zile. Îl vei putea modifica din nou pe ${availableDate}.`);
  }

  const nicknameIndexRef = getNicknameIndexRef(cleanNickname);
  if (nicknameIndexRef) {
    const transaction = await nicknameIndexRef.transaction(existingId => {
      if (existingId && existingId !== currentUser.id) return;
      return currentUser.id;
    });
    if (!transaction.committed) throw new Error('Acest nickname este deja folosit.');
  }

  currentUser.name = cleanName;
  currentUser.nickname = cleanNickname;
  if (isChangingNickname || !previousNickname) currentUser.nicknameChangedAt = now;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  await getUserProfileRef(currentUser.id).update({
    name: cleanName,
    nickname: cleanNickname,
    ...(isChangingNickname || !previousNickname ? { nicknameChangedAt: now } : {})
  });
  if (previousNickname && previousNickname !== cleanNickname) {
    try {
      const previousRef = getNicknameIndexRef(previousNickname);
      const previousSnapshot = previousRef ? await previousRef.once('value') : null;
      if (previousSnapshot && previousSnapshot.val() === currentUser.id) await previousRef.remove();
    } catch (_) {}
  }
  try { updateAuthUI(); } catch (_) {}
  return currentUser;
}

async function sendPartnerRequestByNickname(nickname) {
  const requestedNickname = normalizePartnerNickname(nickname);
  if (!requestedNickname) throw new Error('Introdu un nickname valid, de exemplu @codreanu_cristian.');
  if (!isFirebaseAvailable() || !currentUser || !currentUser.id) throw new Error('Nu există o sesiune activă.');

  const target = await findUserByNickname(requestedNickname);
  if (!target) throw new Error('Nu am găsit un utilizator cu acest nickname.');
  if (target.id === currentUser.id) throw new Error('Nu poți trimite o cerere către propriul cont.');
  if (getApprovedPartnerIds().includes(target.id)) throw new Error('Această persoană este deja partenerul tău.');

  const scope = getCurrentDataScope();
  const request = { fromId: currentUser.id, fromName: currentUser.name || '', fromNickname: currentUser.nickname || '', createdAt: Date.now() };
  await Promise.all([
    getUserProfileRef(target.id, scope).child('partnerRequests').child(currentUser.id).set(request),
    getUserProfileRef(currentUser.id, scope).child('sentPartnerRequests').child(target.id).set({ toId: target.id, toName: target.name || '', toNickname: target.nickname || requestedNickname, createdAt: request.createdAt })
  ]);
}

async function cancelSentPartnerRequest(targetUserId) {
  if (!isFirebaseAvailable() || !currentUser || !currentUser.id || !targetUserId) {
    throw new Error('Nu există o sesiune activă.');
  }

  const scope = getCurrentDataScope();
  const prefix = scope === 'test' ? 'users/test' : 'users';
  const updates = {};
  updates[`${prefix}/${currentUser.id}/sentPartnerRequests/${targetUserId}`] = null;
  updates[`${prefix}/${targetUserId}/partnerRequests/${currentUser.id}`] = null;
  await rdb.ref().update(updates);

  if (currentUser.sentPartnerRequests) {
    delete currentUser.sentPartnerRequests[targetUserId];
    try { localStorage.setItem('currentUser', JSON.stringify(currentUser)); } catch (_) {}
  }
}

async function answerPartnerRequest(requesterId, accepted) {
  if (!isFirebaseAvailable() || !currentUser || !currentUser.id || !requesterId) return;
  const scope = getCurrentDataScope();
  const requestRef = getUserProfileRef(currentUser.id, scope).child('partnerRequests').child(requesterId);
  const snapshot = await requestRef.once('value');
  if (!snapshot.exists()) throw new Error('Cererea nu mai este disponibilă.');
  const request = snapshot.val() || {};
  const prefix = scope === 'test' ? 'users/test' : 'users';
  const updates = {};
  updates[`${prefix}/${currentUser.id}/partnerRequests/${requesterId}`] = null;
  updates[`${prefix}/${requesterId}/sentPartnerRequests/${currentUser.id}`] = null;
  if (accepted) {
    updates[`${prefix}/${currentUser.id}/approvedPartnerIds/${requesterId}`] = true;
    updates[`${prefix}/${requesterId}/approvedPartnerIds/${currentUser.id}`] = true;
    currentUser.approvedPartnerIds = { ...(currentUser.approvedPartnerIds || {}), [requesterId]: true };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
  await rdb.ref().update(updates);
}

async function removeApprovedPartner(partnerId) {
  if (!isFirebaseAvailable() || !currentUser || !currentUser.id || !partnerId) return;
  const scope = getCurrentDataScope();
  const prefix = scope === 'test' ? 'users/test' : 'users';
  await rdb.ref().update({
    [`${prefix}/${currentUser.id}/approvedPartnerIds/${partnerId}`]: null,
    [`${prefix}/${partnerId}/approvedPartnerIds/${currentUser.id}`]: null
  });
  if (currentUser.approvedPartnerIds) delete currentUser.approvedPartnerIds[partnerId];
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

  /* Small reusable in-app modal */
  function showAppModal({title = '', message = '', buttons = [], onBackdropClose, actionsClass = '', showCloseButton = true} = {}) {
    try {
      // backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'app-modal-backdrop';

      const modal = document.createElement('div');
      modal.className = 'app-modal';

      if (title) {
        const h = document.createElement('h3');
        h.innerText = title;
        modal.appendChild(h);
      }

      if (message) {
        const p = document.createElement('div');
        p.className = 'app-modal-message';
        p.innerHTML = message;
        modal.appendChild(p);
      }

      if (showCloseButton) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'app-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.onclick = () => {
          try {
            try { document.body.removeChild(backdrop); } catch (_) {}
            if (typeof onBackdropClose === 'function') {
              onBackdropClose();
            }
          } catch (e) {
            try { document.body.removeChild(backdrop); } catch (_) {}
          }
        };
        modal.appendChild(closeBtn);
      }

      const actions = document.createElement('div');
      actions.className = 'app-modal-actions';
      if (actionsClass) {
        actions.classList.add(actionsClass);
      }

      buttons.forEach(btn => {
        const b = document.createElement('button');
        b.className = 'app-btn ' + (btn.className || '');
        b.innerText = btn.label || 'OK';
        b.onclick = () => {
          try { if (btn.onClick) btn.onClick(); } catch (e) { console.error(e); }
          document.body.removeChild(backdrop);
        };
        actions.appendChild(b);
      });

      modal.appendChild(actions);
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);

      // Close modal when clicking on backdrop without triggering any action button.
      backdrop.addEventListener('click', (ev) => {
        if (ev.target !== backdrop) return;
        try {
          try { document.body.removeChild(backdrop); } catch (_) {}
          if (typeof onBackdropClose === 'function') {
            onBackdropClose();
          }
        } catch (e) {
          try { document.body.removeChild(backdrop); } catch (_) {}
        }
      });
    } catch (e) {
      console.error('showAppModal error', e);
      if (typeof showAlertApp === 'function') showAlertApp(message || title); else alert(message || title);
    }
  }

  function getPlanPartnerIdsFromPlan(plan) {
    if (Array.isArray(plan.partnerIds) && plan.partnerIds.length > 0) return plan.partnerIds.filter(Boolean);
    return plan.partnerId ? [plan.partnerId] : [];
  }

  function getPlanPartnerNamesFromPlan(plan) {
    if (Array.isArray(plan.partnerNames) && plan.partnerNames.length > 0) return plan.partnerNames;
    return plan.partnerName ? [plan.partnerName] : [];
  }

  function showParticipantOptionsModal(plan, id, isOwner, isPartner) {
    const title = 'Opțiuni participanți';
    const ownerLabel = getDisplayNameForPerson(plan.userId, plan.userName || 'Unknown');
    const partnerIds = getPlanPartnerIdsFromPlan(plan);
    const partnerNames = getPlanPartnerNamesFromPlan(plan);
    const partnerLabels = partnerIds.length > 0
      ? partnerIds.map((pid, idx) => getDisplayNameForPerson(pid, partnerNames[idx] || pid))
      : partnerNames;

    const participantsLabel = partnerLabels.length > 0
      ? (`👩‍❤️‍👨 ${escapeHtml(ownerLabel)} & ${escapeHtml(partnerLabels.join(', '))}`)
      : (`👤 ${escapeHtml(ownerLabel)}`);

    const buttons = [];

    if (isOwner) {
      buttons.push({ label: 'Editează participanți', className: 'primary', onClick: async () => {
        try {
          const users = (typeof getApprovedPartnersFromFirebase === 'function')
            ? await getApprovedPartnersFromFirebase()
            : [];
          const selectable = users.filter(u => u.id !== getCurrentUserId());

          if (typeof showMultiUserSelectionModal === 'function') {
            const newPartnerIds = await showMultiUserSelectionModal(selectable, partnerIds);
            if (newPartnerIds === null) {
              return;
            }

            const newPartnerNames = newPartnerIds.map(pid => {
              const found = selectable.find(u => u.id === pid) || users.find(u => u.id === pid);
              return found ? found.name : pid;
            });

            const updatedPlan = {
              ...plan,
              partnerIds: newPartnerIds,
              partnerNames: newPartnerNames,
              partnerId: newPartnerIds[0] || null,
              partnerName: newPartnerNames[0] || null,
              mode: 'self',
              tags: newPartnerIds.length ? ['shared','self'] : ['self','personal']
            };
            const ok = isFirebaseAvailable() ? await updatePlanificationInFirestore(updatedPlan) : updatePlanificationInLocalStorage(updatedPlan);
            if (ok) {
              if (typeof loadPlanifications === 'function') loadPlanifications();
              if (typeof buildCalendarView === 'function') buildCalendarView();
            } else {
              if (typeof showAlertApp === 'function') showAlertApp('Eroare la actualizare'); else alert('Eroare la actualizare');
            }
            return;
          }

          if (typeof editPlanification === 'function') editPlanification(id);
        } catch (err) {
          console.error('Could not open participants selection', err);
          if (typeof showAlertApp === 'function') showAlertApp('Eroare la actualizare'); else alert('Eroare la actualizare');
        }
      }});
      buttons.push({ label: 'Elimină toți participanții', className: 'warn', onClick: async () => {
        const updatedPlan = {
          ...plan,
          partnerIds: [],
          partnerNames: [],
          partnerId: null,
          partnerName: null,
          mode: 'self',
          tags: ['self','personal']
        };
        const ok = isFirebaseAvailable() ? await updatePlanificationInFirestore(updatedPlan) : updatePlanificationInLocalStorage(updatedPlan);
        if (ok) {
          if (typeof loadPlanifications === 'function') loadPlanifications();
          if (typeof buildCalendarView === 'function') buildCalendarView();
        } else {
          // fallback alert
          if (typeof showAlertApp === 'function') showAlertApp('Eroare la eliminare participanți'); else alert('Eroare la eliminare participanți');
        }
      }});
    } else if (isPartner) {
      buttons.push({ label: 'Șterge-te din eveniment', className: 'warn', onClick: async () => {
        try {
          const currentUserId = getCurrentUserId();
          const remainingIds = partnerIds.filter(pid => pid !== currentUserId);
          const remainingNames = partnerIds
            .map((pid, idx) => ({ pid, name: partnerNames[idx] }))
            .filter(entry => entry.pid !== currentUserId)
            .map(entry => entry.name);

          const updatedPlan = {
            ...plan,
            partnerIds: remainingIds,
            partnerNames: remainingNames,
            partnerId: remainingIds[0] || null,
            partnerName: remainingNames[0] || null,
            mode: 'self',
            tags: remainingIds.length ? ['shared','self'] : ['self','personal']
          };
          const ok = isFirebaseAvailable() ? await updatePlanificationInFirestore(updatedPlan) : updatePlanificationInLocalStorage(updatedPlan);
          if (ok) {
            if (typeof loadPlanifications === 'function') loadPlanifications();
            if (typeof buildCalendarView === 'function') buildCalendarView();
          } else {
            if (typeof showAlertApp === 'function') showAlertApp('Eroare la actualizare'); else alert('Eroare la actualizare');
          }
        } catch (err) {
          console.error('Could not update participant selection', err);
          if (typeof showAlertApp === 'function') showAlertApp('Eroare la actualizare'); else alert('Eroare la actualizare');
        }
      }});
    } else {
      buttons.push({ label: 'OK', className: 'primary', onClick: () => {} });
    }

    const message = `<div class="modal-participants">${escapeHtmlLocal(participantsLabel)}</div>`;
    showAppModal({ title, message, buttons });
  }

// Listen to user changes
function listenToUserChanges(callback) {
  if (!isFirebaseAvailable()) return;

  try {
    getScopedUsersRootRef().on('value', snapshot => {
      const users = [];
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          if (getCurrentDataScope() === 'production' && child.key === 'test') {
            return;
          }
          const user = child.val();
          if (user && typeof user === 'object' && user.id && user.id !== getCurrentUserId()) {
            users.push(user);
          }
        });
      }
      callback(users);
    });
  } catch (error) {
    console.error('❌ Error setting up user listener:', error);
  }
}

// Promise-based wrappers for alerts/confirms/prompts
function showAlertApp(message, title = '') {
  return new Promise(resolve => {
    showAppModal({
      title,
      message,
      buttons: [{ label: 'OK', className: 'primary', onClick() { resolve(); } }],
      onBackdropClose() { resolve(); }
    });
  });
}

function showTelegramConnectedSuccessModal() {
  return new Promise(resolve => {
    const message = [
      '<div class="telegram-success-wrap">',
      '  <div class="telegram-success-icon" aria-hidden="true">✓</div>',
      '  <div class="telegram-success-title">Telegram conectat</div>',
      '  <div class="telegram-success-message">Contul tau a fost conectat cu succes. Vei primi notificari in Telegram.</div>',
      '</div>'
    ].join('');

    showAppModal({
      title: '',
      message,
      buttons: [{
        label: 'Perfect',
        className: 'primary',
        onClick() { resolve(); }
      }],
      onBackdropClose() { resolve(); }
    });
  });
}

function showConfirmApp(message, title = '') {
  return new Promise(resolve => {
    showAppModal({
      title,
      message,
      buttons: [
        { label: 'Confirmare', className: 'primary', onClick() { resolve(true); } },
        { label: 'Anulare', className: '', onClick() { resolve(false); } }
      ],
      actionsClass: 'actions-row-equal',
      onBackdropClose() { resolve(false); }
    });
  });
}

function showPromptApp(message, defaultValue = '') {
  return new Promise(resolve => {
    try {
      const backdrop = document.createElement('div');
      backdrop.className = 'app-modal-backdrop';
      const modal = document.createElement('div');
      modal.className = 'app-modal';
      const h = document.createElement('h3'); h.innerText = '';
      const p = document.createElement('div'); p.className = 'app-modal-message'; p.innerHTML = message;
      const input = document.createElement('input'); input.type = 'text'; input.value = defaultValue || '';
      input.style.width = '100%'; input.style.padding = '8px'; input.style.marginBottom = '12px';
      const actions = document.createElement('div'); actions.className = 'app-modal-actions';
      const okBtn = document.createElement('button'); okBtn.className = 'app-btn primary'; okBtn.innerText = 'OK';
      okBtn.onclick = () => { const v = input.value; document.body.removeChild(backdrop); resolve(v); };
      actions.appendChild(okBtn);
      modal.appendChild(h); modal.appendChild(p); modal.appendChild(input); modal.appendChild(actions);
      backdrop.appendChild(modal); document.body.appendChild(backdrop);
      input.focus();
      // close on clicking backdrop -> treat as cancel
      backdrop.addEventListener('click', (ev) => {
        if (ev.target !== backdrop) return;
        try { cancelBtn.click(); } catch (e) { try { document.body.removeChild(backdrop); resolve(null); } catch(_){} }
      });
    } catch (e) {
      console.error('showPromptApp error', e); resolve(null);
    }
  });
}

const NOTIFICATION_LEAD_TIME_KEY = 'notificationLeadTime';
const DEFAULT_NOTIFICATION_LEAD_TIME = 10;

function getNotificationLeadTime() {
  const raw = localStorage.getItem(NOTIFICATION_LEAD_TIME_KEY);
  const value = parseFloat(raw);
  if (Number.isFinite(value) && value >= -1) {
    return value;
  }
  return DEFAULT_NOTIFICATION_LEAD_TIME;
}

function setNotificationLeadTime(minutes) {
  const value = parseFloat(minutes);
  if (!Number.isFinite(value) || value < -1) {
    localStorage.setItem(NOTIFICATION_LEAD_TIME_KEY, String(DEFAULT_NOTIFICATION_LEAD_TIME));
    return DEFAULT_NOTIFICATION_LEAD_TIME;
  }
  localStorage.setItem(NOTIFICATION_LEAD_TIME_KEY, String(value));
  return value;
}

async function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.warn('Notification permission request failed', err);
    return false;
  }
}

async function ensureNotificationsEnabled() {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'default') {
    const granted = await requestNotificationPermission();
    if (!granted) return false;
  }
  if (Notification.permission !== 'granted') return false;
  return await initializeFirebaseMessaging();
}

function showNotificationPermissionHint() {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== 'default') return;
  if (typeof showAlertApp === 'function') {
    showAlertApp(translate('notificationPermissionHint'));
  }
}

// Show a user selection modal: list of users + option to remove partner
function showUserSelectionModal(users = [], currentSelection = '') {
  return new Promise(resolve => {
    try {
      const backdrop = document.createElement('div');
      backdrop.className = 'app-modal-backdrop';
      const modal = document.createElement('div');
      modal.className = 'app-modal';

      const h = document.createElement('h3'); h.innerText = 'Selectează un partener';
      modal.appendChild(h);

      const helpText = document.createElement('div');
      helpText.className = 'user-select-help';
      helpText.innerText = 'Alege persoana care va fi partenerul pentru acest eveniment.';
      modal.appendChild(helpText);

      const list = document.createElement('div');
      list.className = 'user-select-list';
      list.style.maxHeight = '40vh';
      list.style.overflowY = 'auto';

      // Option to clear partner
      const noneRow = document.createElement('label');
      noneRow.className = 'user-row';
      noneRow.innerHTML = `<span class="user-row-badge">✕</span><span class="user-row-label">Niciun partener</span><input type="radio" name="__user_select" value="" ${currentSelection ? '' : 'checked'}>`;
      list.appendChild(noneRow);

      users.forEach(u => {
        const row = document.createElement('label');
        row.className = 'user-row';
        const checked = (u.id === currentSelection) ? 'checked' : '';
        const displayName = getLocalPartnerNickname(u.id, u.name);
        row.innerHTML = `<span class="user-row-badge">👤</span><span class="user-row-label">${escapeHtmlLocal(displayName)}</span><input type="radio" name="__user_select" value="${escapeHtmlLocal(u.id)}" ${checked}>`;
        list.appendChild(row);
      });

      modal.appendChild(list);

      const actions = document.createElement('div'); actions.className = 'app-modal-actions';
      const cancelBtn = document.createElement('button'); cancelBtn.className = 'app-btn'; cancelBtn.innerText = 'Anulează';
      cancelBtn.onclick = () => {
        try { document.body.removeChild(backdrop); } catch (_) {}
        resolve(null);
      };
      const okBtn = document.createElement('button'); okBtn.className = 'app-btn primary'; okBtn.innerText = 'Confirmă';
      okBtn.onclick = () => {
        const sel = modal.querySelector('input[name="__user_select"]:checked');
        const v = sel ? sel.value : '';
        try { document.body.removeChild(backdrop); } catch (_) {}
        resolve(v === '' ? '' : v);
      };
      actions.appendChild(cancelBtn); actions.appendChild(okBtn);
      modal.appendChild(actions);

      backdrop.appendChild(modal); document.body.appendChild(backdrop);
      // focus first radio
      const first = modal.querySelector('input[name="__user_select"]');
      if (first) first.focus();
      // backdrop click cancels
      backdrop.addEventListener('click', (ev) => {
        if (ev.target !== backdrop) return;
        try { document.body.removeChild(backdrop); resolve(null); } catch (e) { resolve(null); }
      });
    } catch (e) {
      console.error('showUserSelectionModal error', e);
      resolve(null);
    }
  });
}

// Show a multi-user selection modal (checkboxes): used to edit the full list of
// participants (partnerIds) for an event that supports multiple partners/group.
function showMultiUserSelectionModal(users = [], currentSelectionIds = []) {
  return new Promise(resolve => {
    try {
      const backdrop = document.createElement('div');
      backdrop.className = 'app-modal-backdrop';
      const modal = document.createElement('div');
      modal.className = 'app-modal';

      const h = document.createElement('h3'); h.innerText = 'Selectează participanți';
      modal.appendChild(h);

      const helpText = document.createElement('div');
      helpText.className = 'user-select-help';
      helpText.innerText = 'Alege persoanele care particip\u0103 la acest eveniment.';
      modal.appendChild(helpText);

      const list = document.createElement('div');
      list.className = 'user-select-list';
      list.style.maxHeight = '40vh';
      list.style.overflowY = 'auto';

      if (users.length === 0) {
        const emptyRow = document.createElement('div');
        emptyRow.className = 'empty-state';
        emptyRow.style.margin = '0';
        emptyRow.innerText = 'Nu ai parteneri disponibili.';
        list.appendChild(emptyRow);
      }

      users.forEach(u => {
        const row = document.createElement('label');
        row.className = 'user-row';
        const checked = currentSelectionIds.includes(u.id) ? 'checked' : '';
        const displayName = getLocalPartnerNickname(u.id, u.name);
        row.innerHTML = `<span class="user-row-badge">👤</span><span class="user-row-label">${escapeHtmlLocal(displayName)}</span><input type="checkbox" value="${escapeHtmlLocal(u.id)}" ${checked}>`;
        list.appendChild(row);
      });

      modal.appendChild(list);

      const actions = document.createElement('div'); actions.className = 'app-modal-actions';
      const cancelBtn = document.createElement('button'); cancelBtn.className = 'app-btn'; cancelBtn.innerText = 'Anulează';
      cancelBtn.onclick = () => {
        try { document.body.removeChild(backdrop); } catch (_) {}
        resolve(null);
      };
      const okBtn = document.createElement('button'); okBtn.className = 'app-btn primary'; okBtn.innerText = 'Confirmă';
      okBtn.onclick = () => {
        const checkedInputs = modal.querySelectorAll('input[type="checkbox"]:checked');
        const ids = Array.from(checkedInputs).map(input => input.value);
        try { document.body.removeChild(backdrop); } catch (_) {}
        resolve(ids);
      };
      actions.appendChild(cancelBtn); actions.appendChild(okBtn);
      modal.appendChild(actions);

      backdrop.appendChild(modal); document.body.appendChild(backdrop);
      backdrop.addEventListener('click', (ev) => {
        if (ev.target !== backdrop) return;
        try { document.body.removeChild(backdrop); resolve(null); } catch (e) { resolve(null); }
      });
    } catch (e) {
      console.error('showMultiUserSelectionModal error', e);
      resolve(null);
    }
  });
}

function escapeHtmlLocal(text) {
  const div = document.createElement('div');
  div.innerText = text || '';
  return div.innerHTML;
}

// Initialize once even when several independently bundled React roots mount.
let userInitializationPromise = null;
function initializeUser() {
  if (!userInitializationPromise) userInitializationPromise = initializeUserOnce();
  return userInitializationPromise;
}

async function initializeUserOnce() {
  console.log('initializeUser start');
  generateDeviceId();
  // A cached identity is enough to render immediately. Remote profile data is
  // refreshed in the background and must not block page content.
  if (!currentUser) await loadUserProfile();
  // initialize Firebase auth listener if available
  try { initFirebaseAuth(); } catch (e) { /* ignore */ }
  // Update UI based on current user if settings modal present
  try { updateAuthUI(); } catch (e) { /* ignore */ }
  
  if (currentUser) {
    partnerNicknamesCache = loadPartnerNicknamesFromLocalStorage();
    partnerGroupsCache = loadPartnerGroupsFromLocalStorage();
    const hasAuthenticatedFirebaseUser = Boolean(typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser);
    const backgroundTasks = [loadPartnerNicknamesFromFirebase(), loadPartnerGroupsFromFirebase()];
    if (!hasAuthenticatedFirebaseUser) backgroundTasks.push(loadUserProfile());
    if (!hasUpdatedLastLoginThisSession()) {
      markLastLoginUpdatedThisSession();
      backgroundTasks.push(updateLastLogin());
    }
    void Promise.allSettled(backgroundTasks).then(() => {
      try { updateAuthUI(); } catch (_) {}
      window.dispatchEvent(new CustomEvent('user:profile-updated', { detail: currentUser }));
    });
    console.log('✅ User initialized:', currentUser.name);
  } else {
    console.log('initializeUser: no currentUser found');
  }

  try {
  } catch (err) {
    console.warn('initializeUser: could not finalize user setup', err);
  }

  try {
  } catch (e) {
    console.warn('initializeUser: could not adjust userOnboarded flag', e);
  }
  console.log('initializeUser end, currentUser=', currentUser);
}

// Create a promise that resolves when user is initialized
window.userManagerReady = Promise.resolve();

// Global handler for participants tag clicks (works across pages)
async function onParticipantsClick(id, el) {
  try {
    // Stop pulse animation globally on first click and remember it in localStorage
    try {
      // mark global flag so no tag pulses anymore
      localStorage.setItem('participantsClickedGlobal', 'true');
      // remove pulse class from any existing elements in DOM
      try {
        document.querySelectorAll('.participants-link.pulse').forEach(elm => elm.classList.remove('pulse'));
      } catch (e) {
        // ignore DOM errors in non-browser environments
      }
    } catch (e) {
      console.warn('Could not persist participants click state', e);
    }
    // Ensure DB helper available
    if (typeof getPlanificationById !== 'function') {
      console.error('onParticipantsClick: getPlanificationById not available');
      return;
    }

    const plan = await getPlanificationById(id);
    if (!plan) {
      alert('Planificare inexistentă');
      return;
    }

    const currentUserId = getCurrentUserId();
    const isOwner = plan.userId === currentUserId;
    const planPartnerIds = Array.isArray(plan.partnerIds) && plan.partnerIds.length > 0
      ? plan.partnerIds.filter(Boolean)
      : (plan.partnerId ? [plan.partnerId] : []);
    const isPartner = planPartnerIds.includes(currentUserId) || plan.partnerName === getCurrentUserName();

    if (isOwner || isPartner) {
      showParticipantOptionsModal(plan, id, isOwner, isPartner);
      return;
    }

    if (typeof showAlertApp === 'function') await showAlertApp('Nu ai permisiuni asupra acestui eveniment'); else alert('Nu ai permisiuni asupra acestui eveniment');
  } catch (err) {
    console.error('onParticipantsClick error', err);
    if (typeof showAlertApp === 'function') await showAlertApp('Eroare: ' + err.message); else alert('Eroare: ' + err.message);
  }
}

// Close static HTML modals (elements with class 'modal') when clicking on their backdrop
document.addEventListener('click', (e) => {
  try {
    const t = e.target;
    if (t && t.classList && t.classList.contains('modal')) {
      if (t.id === 'mandatoryNicknameModal' || t.getAttribute('data-backdrop-close') === 'false') {
        return;
      }
      t.classList.add('hidden');
    }
  } catch (err) {
    // ignore
  }
});
