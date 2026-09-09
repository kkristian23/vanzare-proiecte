// Firebase Configuration - Using CDN
// https://console.firebase.google.com

const appEnv = (typeof window !== 'undefined' && window.APP_ENV) ? window.APP_ENV : {};

function normalizeDataScope(scope) {
  const raw = String(scope || '').trim().toLowerCase();
  if (raw === 'test') return 'test';
  if (raw === 'production') return 'production';
  return 'production';
}

function parseDataScope(scope) {
  const raw = String(scope || '').trim().toLowerCase();
  if (raw === 'test') return 'test';
  if (raw === 'production') return 'production';
  return null;
}

function getExplicitDataScopeOverride() {
  if (typeof window === 'undefined' || !window.location) {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const queryScope = [params.get('scope'), params.get('dataScope'), params.get('env')]
    .map(value => String(value || '').trim().toLowerCase())
    .find(Boolean);

  if (queryScope === 'test' || queryScope === 'production') {
    return queryScope;
  }

  if (typeof appEnv?.scope === 'string' && appEnv.scope.trim()) {
    const normalized = parseDataScope(appEnv.scope);
    if (normalized === 'test' || normalized === 'production') {
      return normalized;
    }
  }

  if (typeof appEnv?.dataScope === 'string' && appEnv.dataScope.trim()) {
    const normalized = parseDataScope(appEnv.dataScope);
    if (normalized === 'test' || normalized === 'production') {
      return normalized;
    }
  }

  return null;
}

function isDevelopmentEnvironment() {
  if (typeof window === 'undefined' || !window.location) {
    return false;
  }

  const hostname = window.location.hostname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const explicitScope = getExplicitDataScopeOverride();

  if (explicitScope) {
    return explicitScope === 'test';
  }

  if (typeof appEnv.isTestEnvironment === 'boolean') {
    return appEnv.isTestEnvironment;
  }

  if (params.get('forceTestMode') === 'true' || params.get('testMode') === 'true') {
    return true;
  }
  if (params.get('forceTestMode') === 'false') {
    return false;
  }

  if (hostname.includes('test') || hostname.includes('staging')) {
    return true;
  }

  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')
      || /^(10|127)\.\d+\.\d+\.\d+$/.test(hostname)
      || /^192\.168\.\d+\.\d+$/.test(hostname)
      || /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname);
}

const firebaseConfig = appEnv.firebaseConfig || {
    apiKey: "AIzaSyCQn5VtFAHKNQy9OxLLD2wi6Q_Jb2y7l1g",
    authDomain: "dateevent.firebaseapp.com",
    databaseURL: "https://dateevent-default-rtdb.firebaseio.com",
    projectId: "dateevent",
    storageBucket: "dateevent.appspot.com",
    messagingSenderId: "566790015312",
    appId: "1:566790015312:web:7d47b5dd6e222582c94455"
};

let isTestEnvironment = false;

function persistCurrentDataScope(scope = getCurrentDataScope()) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem('activeDataScope', normalizeDataScope(scope));
  } catch (e) {
    // ignore storage issues
  }
}

function refreshRuntimeEnvironmentContext() {
  const explicitScope = getExplicitDataScopeOverride();
  if (explicitScope) {
    isTestEnvironment = explicitScope === 'test';
  } else {
    isTestEnvironment = isDevelopmentEnvironment();
  }
  persistCurrentDataScope(isTestEnvironment ? 'test' : 'production');
  return isTestEnvironment;
}

function getCurrentDataScope() {
  refreshRuntimeEnvironmentContext();
  return isTestEnvironment ? 'test' : 'production';
}

function setActiveDataScope(scope) {
  const normalizedScope = normalizeDataScope(scope);
  isTestEnvironment = normalizedScope === 'test';
  persistCurrentDataScope(normalizedScope);
  return normalizedScope;
}

if (typeof window !== 'undefined') {
  window.setActiveDataScope = setActiveDataScope;
  window.getActiveDataScope = getCurrentDataScope;
}

refreshRuntimeEnvironmentContext();

// Initialize Firebase if SDK is loaded
let rdb;
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  rdb = firebase.database();
  console.log('✅ Firebase Realtime Database initialized successfully');
  console.log('🌐 Firebase environment mode:', isTestEnvironment ? 'test' : 'production');
} else {
  console.error('❌ Firebase SDK not loaded before firebase-config.js. Check that firebase-app.js and firebase-database.js are included before firebase-config.js.');
}

function getFirebasePlanificationsRef() {
  if (!isFirebaseAvailable()) {
    return null;
  }
  return rdb.ref(`planifications/${getCurrentDataScope()}`);
}

function getScopedUsersRootRefForScope(scope = getCurrentDataScope()) {
  if (!isFirebaseAvailable()) {
    return null;
  }
  return rdb.ref(scope === 'test' ? 'users/test' : 'users');
}

function getScopedUsersRootRef() {
  return getScopedUsersRootRefForScope(getCurrentDataScope());
}

function getUserProfileRef(userId, scope = getCurrentDataScope()) {
  const usersRef = getScopedUsersRootRefForScope(scope);
  if (!usersRef || !userId) {
    return null;
  }
    return usersRef.child(String(userId));
}

function getUserPlanificationsRef(userId = getCurrentUserId()) {
  return isFirebaseAvailable() && userId
    ? rdb.ref(`userPlanifications/${getCurrentDataScope()}/${userId}`)
    : null;
}

function getPlanParticipantIds(plan) {
  return [...new Set([plan && plan.userId, plan && plan.partnerId, ...((plan && plan.partnerIds) || [])].filter(Boolean))];
}

async function syncPlanificationIndexes(plan, previousPlan = null) {
  if (!plan || !plan.id || !isFirebaseAvailable()) return;
  const scope = getCurrentDataScope();
  const nextIds = new Set(getPlanParticipantIds(plan));
  const previousIds = new Set(getPlanParticipantIds(previousPlan));
  const updates = {};
  previousIds.forEach(userId => {
    if (!nextIds.has(userId)) updates[`userPlanifications/${scope}/${userId}/${plan.id}`] = null;
  });
  nextIds.forEach(userId => {
    updates[`userPlanifications/${scope}/${userId}/${plan.id}`] = plan;
    updates[`userPlanIndexReady/${scope}/${userId}`] = true;
  });
  try { await rdb.ref().update(updates); } catch (error) {
    console.warn('User plan index could not be synchronized; legacy reads remain active:', error);
  }
}

async function syncLegacyPlansToCurrentUserIndex(plans) {
  const userId = getCurrentUserId();
  if (!userId || !isFirebaseAvailable()) return;
  const scope = getCurrentDataScope();
  const indexedPlans = {};
  (plans || []).forEach(plan => { if (plan && plan.id) indexedPlans[String(plan.id)] = plan; });
  try {
    await getUserPlanificationsRef(userId).set(indexedPlans);
    await rdb.ref(`userPlanIndexReady/${scope}/${userId}`).set(true);
  } catch (error) {
    console.warn('User plan index migration skipped; legacy listener remains compatible:', error);
  }
}

const FIREBASE_CACHE_VERSION = 'v1';
const firebaseMemoryCache = { planifications: new Map(), users: new Map() };

function getFirebaseCacheKey(kind, identity = getCurrentUserId()) {
    return `dateevent:${FIREBASE_CACHE_VERSION}:${kind}:${getCurrentDataScope()}:${identity || 'anonymous'}`;
}

function readFirebaseLocalCache(kind, fallback = []) {
    try {
        const parsed = JSON.parse(localStorage.getItem(getFirebaseCacheKey(kind)) || 'null');
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (_) { return fallback; }
}

function writeFirebaseLocalCache(kind, value) {
    try { localStorage.setItem(getFirebaseCacheKey(kind), JSON.stringify(value)); } catch (_) {}
}

function isPlanRelevantToCurrentUser(plan) {
    const userId = getCurrentUserId();
    return Boolean(plan && (plan.userId === userId || plan.partnerId === userId ||
        (Array.isArray(plan.partnerIds) && plan.partnerIds.includes(userId)) ||
        plan.partnerName === getCurrentUserName()));
}

function planificationsFromSnapshot(snapshot) {
    const plans = [];
    snapshot && snapshot.forEach(child => {
        const plan = child.val();
        if (isPlanRelevantToCurrentUser(plan)) plans.push(plan);
    });
    firebaseMemoryCache.planifications.set(getFirebaseCacheKey('planifications'), plans);
    writeFirebaseLocalCache('planifications', plans);
    return plans;
}

function getCachedPlanifications() {
    const cacheKey = getFirebaseCacheKey('planifications');
    if (firebaseMemoryCache.planifications.has(cacheKey)) return firebaseMemoryCache.planifications.get(cacheKey);
    try {
        if (localStorage.getItem(cacheKey) === null) return null;
    } catch (_) { return null; }
    return readFirebaseLocalCache('planifications');
}

function normalizePlanificationNotificationData(plan) {
  const normalized = { ...plan };
  const leadTime = Number.isFinite(Number(normalized.notificationLeadTime)) ? Number(normalized.notificationLeadTime) : null;
  if (leadTime !== null && leadTime < 0) {
    normalized.notificationTimeMs = null;
  } else if (normalized.date && normalized.time && leadTime !== null) {
    const normalizedTime = normalized.time.length === 5 ? normalized.time + ':00' : normalized.time;
    const eventDate = new Date(`${normalized.date}T${normalizedTime}`);
    if (!Number.isNaN(eventDate.getTime())) {
      normalized.notificationLeadTime = leadTime;
      normalized.notificationTimeMs = eventDate.getTime() - Math.max(0, leadTime * 60 * 1000);
    }
  }
  return normalized;
}

function getPlanActivityForTelegram(plan) {
  if (plan && String(plan.activityCustom || '').trim()) return String(plan.activityCustom).trim();
  if (plan && Array.isArray(plan.activityIds) && plan.activityIds.length > 0) return plan.activityIds.join(', ');
  return 'Activitate';
}

function escapePlanTelegramHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPlanEditTelegramChanges(previousPlan, nextPlan) {
  const participantNames = plan => {
    const names = Array.isArray(plan.partnerNames) && plan.partnerNames.length > 0
      ? plan.partnerNames
      : (plan.partnerName ? [plan.partnerName] : []);
    return names.filter(Boolean).join(', ') || 'Fără alți participanți';
  };
  const reminder = plan => Number(plan.notificationLeadTime) < 0
    ? 'Fără reminder'
    : `${Math.max(0, Number(plan.notificationLeadTime) || 0)} minute înainte`;
  return [
    ['Activitate', getPlanActivityForTelegram(previousPlan), getPlanActivityForTelegram(nextPlan)],
    ['Data', previousPlan.date || '-', nextPlan.date || '-'],
    ['Ora', previousPlan.time || '-', nextPlan.time || '-'],
    ['Detalii', previousPlan.details || '-', nextPlan.details || '-'],
    ['Participanți', participantNames(previousPlan), participantNames(nextPlan)],
    ['Reminder', reminder(previousPlan), reminder(nextPlan)]
  ]
    .filter(([, before, after]) => String(before) !== String(after))
    .map(([label, before, after]) => `• ${label}: ${escapePlanTelegramHtml(before)} → ${escapePlanTelegramHtml(after)}`);
}

function buildPlanEditDeepLink(planId) {
  const scope = getCurrentDataScope();
  const configuredBaseUrl = String(window.APP_ENV?.appUrls?.[scope] || '').trim();
  const eventUrl = new URL('/iqcalendar/calendar.html', configuredBaseUrl || window.location.href);
  eventUrl.searchParams.set('event', String(planId));
  if (scope === 'test') eventUrl.searchParams.set('scope', 'test');
  return eventUrl.href;
}

async function notifyPlanParticipantsAboutEdit(previousPlan, nextPlan, editorId) {
  const changedLines = buildPlanEditTelegramChanges(previousPlan, nextPlan);
  const recipientIds = [...new Set([
    ...getPlanParticipantIds(previousPlan),
    ...getPlanParticipantIds(nextPlan)
  ])].filter(userId => userId && userId !== editorId);
  if (changedLines.length === 0 || recipientIds.length === 0) return;

  const config = typeof getTelegramNotificationConfig === 'function' ? getTelegramNotificationConfig() : null;
  if (!config || !config.token) {
    console.warn('Telegram edit notification skipped: missing TELEGRAM_BOT_TOKEN');
    return;
  }

  const editorName = nextPlan.userName || getCurrentUserName() || 'Organizatorul';
  const eventUrl = buildPlanEditDeepLink(nextPlan.id);
  const text = [
    '✏️ Un eveniment la care participi a fost modificat:',
    `👤 Modificat de: ${escapePlanTelegramHtml(editorName)}`,
    ...changedLines,
    `🎯 ${escapePlanTelegramHtml(getPlanActivityForTelegram(nextPlan))}`,
    `🔗 <a href="${escapePlanTelegramHtml(eventUrl)}">Deschide evenimentul</a>`
  ].join('\n');

  const results = await Promise.allSettled(recipientIds.map(async userId => {
    const user = typeof getUserById === 'function' ? await getUserById(userId) : null;
    if (!user || user.telegramNotificationsEnabled === false) return false;
    const chatId = String(user.telegramChatId || user.telegram_chat_id || '').trim();
    if (!chatId) return false;
    const response = await fetch(`${config.apiBase}/bot${config.token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    if (!response.ok) {
      const raw = await response.text().catch(() => '');
      throw new Error(raw || `HTTP ${response.status}`);
    }
    return true;
  }));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Telegram edit notification failed for participant ${recipientIds[index]}:`, result.reason);
    }
  });
}

// Migrează planificările salvate local în RTDB (dacă există)
async function migrateLocalPlanificationsToRTDB() {
    try {
        if (localStorage.getItem('unsyncedPlanifications') !== '1') return;
        const raw = localStorage.getItem('planifications');
        if (!raw) return;
        const localPlans = JSON.parse(raw || '[]');
        if (!Array.isArray(localPlans) || localPlans.length === 0) return;
        console.log('🔁 Migrating', localPlans.length, 'local planifications to RTDB');
        const targetRef = getFirebasePlanificationsRef();
        if (!targetRef) return;
        for (const p of localPlans) {
            const planWithScope = { ...p, isTestEnvironment };
            await targetRef.child(String(p.id)).set(planWithScope);
        }
        // După migrare, curăță localStorage
        localStorage.removeItem('planifications');
        localStorage.removeItem('unsyncedPlanifications');
        console.log('✅ Migration completed');
    } catch (err) {
        console.error('❌ Migration error:', err);
    }
}

// Rulează migrarea imediat după inițializare
migrateLocalPlanificationsToRTDB();

async function migrateLegacyDataToCurrentScope() {
  if (!isFirebaseAvailable()) {
    return;
  }

  try {
    const scope = getCurrentDataScope();
    const migrationKey = `dateevent:legacy-users-migrated:v1:${scope}`;
    if (localStorage.getItem(migrationKey) === '1') return;
    const targetRoot = getScopedUsersRootRefForScope(scope);
    const legacyRoot = scope === 'test' ? rdb.ref('test') : rdb.ref('users/production');

    if (!targetRoot || !legacyRoot) {
      return;
    }

    const legacySnapshot = await legacyRoot.once('value');

    if (!legacySnapshot.exists()) {
      localStorage.setItem(migrationKey, '1');
      console.log(`Scoped Firebase storage active for '${scope}'.`);
      return;
    }

    const legacyUsers = legacySnapshot.val() || {};
    const entries = Object.entries(legacyUsers || {});
    if (entries.length > 0) {
      const updates = Object.fromEntries(entries.map(([userId, value]) => [String(userId), value]));
      await targetRoot.update(updates);
      await legacyRoot.remove();
      console.log(`Migrated ${entries.length} user profiles from ${scope === 'test' ? '/test' : '/users/production'} to ${scope === 'test' ? '/users/test' : '/users'}.`);
    }

    localStorage.setItem(migrationKey, '1');
    console.log(`Scoped Firebase storage active for '${scope}'.`);
  } catch (error) {
    console.warn('Could not initialize scoped Firebase storage:', error);
  }
}

migrateLegacyDataToCurrentScope();

// Funcție pentru a salva eveniment în Realtime Database (păstrează numele pentru compatibilitate)
async function savePlanificationToFirestore(plan) {
    if (!isFirebaseAvailable()) {
        console.error('Firebase not available, cannot save planification');
        return false;
    }
    try {
        const planWithScope = normalizePlanificationNotificationData({ ...plan, isTestEnvironment });
        const targetRef = getFirebasePlanificationsRef();
        console.log('💾 Saving plan to RTDB:', planWithScope);
        await targetRef.child(String(planWithScope.id)).set(planWithScope);
        void syncPlanificationIndexes(planWithScope);
        console.log('✅ Planification salvată în RTDB:', planWithScope);
        return true;
    } catch (error) {
        console.error('❌ Eroare la salvare în RTDB:', error);
        if (typeof showAlertApp === 'function') showAlertApp('Eroare la salvare: ' + error.message); else alert('Eroare la salvare: ' + error.message);
        return false;
    }
}

// Funcție pentru a obține toate evenimentele din Realtime Database
async function getAllPlanificationsFromFirestore() {
    if (!isFirebaseAvailable()) {
        console.error('Firebase not available, cannot read planifications');
        return [];
    }
    try {
        const ref = getFirebasePlanificationsRef();
        const snapshot = await ref.once('value');
        const allPlanifications = [];
        snapshot.forEach(child => {
            allPlanifications.push(child.val());
        });
        
        // Filtrare: arată doar planificările relevante pentru user-ul curent
        const currentUserId = getCurrentUserId();
        const filteredPlanifications = allPlanifications.filter(plan => {
            if (plan.userId === currentUserId) {
                return true;
            }
            if (plan.partnerId === currentUserId) {
                return true;
            }
            if (Array.isArray(plan.partnerIds) && plan.partnerIds.includes(currentUserId)) {
                return true;
            }
            if (plan.partnerName === getCurrentUserName()) {
                return true;
            }
            return false;
        });
        
        firebaseMemoryCache.planifications.set(getFirebaseCacheKey('planifications'), filteredPlanifications);
        writeFirebaseLocalCache('planifications', filteredPlanifications);
        console.log('📥 Planificări RTDB: total', allPlanifications.length, 'filtrate:', filteredPlanifications.length);
        return filteredPlanifications;
    } catch (error) {
        console.error('❌ Eroare la citire RTDB:', error);
        if (typeof showAlertApp === 'function') showAlertApp('Eroare la citire: ' + error.message); else alert('Eroare la citire: ' + error.message);
        return [];
    }
}

async function getPlanificationById(id) {
    if (!isFirebaseAvailable()) {
        console.error('Firebase not available, cannot fetch planification');
        return null;
    }
    try {
        const ref = getFirebasePlanificationsRef();
        if (!ref) {
            return null;
        }
        const snapshot = await ref.child(String(id)).once('value');
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error('❌ Eroare la citire planificare:', error);
        return null;
    }
}

async function updatePlanificationInFirestore(plan) {
    if (!isFirebaseAvailable()) {
        console.error('Firebase not available, cannot update planification');
        return false;
    }
    try {
        const ref = getFirebasePlanificationsRef();
        if (!ref) {
            return false;
        }

        // Permission checks: only owner can edit fully. Partner may only remove themself.
        const snapshot = await ref.child(String(plan.id)).once('value');
        if (!snapshot.exists()) {
            console.error('❌ Cannot update - plan not found:', plan.id);
            return false;
        }
        const existing = snapshot.val();
        const currentUserId = getCurrentUserId();

        // Owner can perform any update
        if (existing.userId === currentUserId) {
            const normalizedPlan = normalizePlanificationNotificationData({ ...plan, isTestEnvironment });
            await ref.child(String(plan.id)).set(normalizedPlan);
            void syncPlanificationIndexes(normalizedPlan, existing);
            await notifyPlanParticipantsAboutEdit(existing, normalizedPlan, currentUserId).catch(error => {
                console.error('Telegram edit notifications could not be processed:', error);
            });
            console.log('✅ Planificare actualizată în RTDB by owner:', normalizedPlan);
            return true;
        }

        // Partner (any of possibly several partners) can only remove themself from the event
        const existingPartnerIds = Array.isArray(existing.partnerIds) && existing.partnerIds.length > 0
            ? existing.partnerIds.filter(Boolean)
            : (existing.partnerId ? [existing.partnerId] : []);

        if (existingPartnerIds.includes(currentUserId)) {
            const newPartnerIds = Array.isArray(plan.partnerIds) && plan.partnerIds.length > 0
                ? plan.partnerIds.filter(Boolean)
                : (plan.partnerId ? [plan.partnerId] : []);

            const expectedPartnerIds = existingPartnerIds.filter(pid => pid !== currentUserId);
            const sameRemainingSet = expectedPartnerIds.length === newPartnerIds.length &&
                expectedPartnerIds.every(pid => newPartnerIds.includes(pid));

            // Ensure key fields remain unchanged (date/time/user) to avoid partner editing other details
            const unchangedCore = (
                plan.date === existing.date &&
                plan.time === existing.time &&
                plan.userId === existing.userId &&
                plan.userName === existing.userName &&
                JSON.stringify(plan.activityIds || null) === JSON.stringify(existing.activityIds || null) &&
                (plan.activityCustom || null) === (existing.activityCustom || null)
            );

            if (sameRemainingSet && unchangedCore) {
                await getFirebasePlanificationsRef().child(String(plan.id)).set({ ...plan, isTestEnvironment });
                void syncPlanificationIndexes({ ...plan, isTestEnvironment }, existing);
                console.log('✅ Partner removed themself from plan in RTDB:', plan.id);
                return true;
            }
        }

        console.error('❌ Permission denied: user', currentUserId, 'cannot update plan', plan.id);
        return false;
    } catch (error) {
        console.error('❌ Eroare la actualizare planificare:', error);
        if (typeof showAlertApp === 'function') showAlertApp('Eroare la actualizare: ' + error.message); else alert('Eroare la actualizare: ' + error.message);
        return false;
    }
}

// Listener real-time pentru schimbări în Realtime Database
function listenToPlanificationsChanges(callback) {
    if (!isFirebaseAvailable()) {
        console.error('Firebase not available, cannot attach RTDB listener');
        return;
    }
    let active = true;
    let activeRef = null;
    let activeHandler = null;
    const cached = getCachedPlanifications();
    if (cached !== null) callback(cached, { source: 'cache' });

    void (async () => {
        try {
            const scope = getCurrentDataScope();
            const userId = getCurrentUserId();
            const readySnapshot = await rdb.ref(`userPlanIndexReady/${scope}/${userId}`).once('value');
            if (!active) return;
            const usesUserIndex = readySnapshot.val() === true;
            activeRef = usesUserIndex ? getUserPlanificationsRef(userId) : getFirebasePlanificationsRef();
            activeHandler = snapshot => {
                const plans = usesUserIndex
                    ? Object.values(snapshot.val() || {}).filter(Boolean)
                    : planificationsFromSnapshot(snapshot);
                firebaseMemoryCache.planifications.set(getFirebaseCacheKey('planifications'), plans);
                writeFirebaseLocalCache('planifications', plans);
                callback(plans, { source: 'remote', indexed: usesUserIndex });
                if (!usesUserIndex) void syncLegacyPlansToCurrentUserIndex(plans);
            };
            activeRef.on('value', activeHandler, error => console.error('❌ Eroare listener RTDB:', error));
        } catch (error) {
            console.error('❌ Eroare la setup listener RTDB:', error);
        }
    })();

    return () => {
        active = false;
        if (activeRef && activeHandler) activeRef.off('value', activeHandler);
    };
}

// Funcție pentru a șterge un eveniment din Realtime Database
async function deletePlanificationFromFirestore(id) {
    if (!isFirebaseAvailable()) {
        console.error('Firebase not available, cannot delete planification');
        return false;
    }
    try {
        const ref = getFirebasePlanificationsRef();
        if (!ref) {
            return false;
        }

        // Only owner can delete the plan entirely
        const snapshot = await ref.child(String(id)).once('value');
        if (!snapshot.exists()) {
            console.warn('⚠️ deletePlanification: plan not found, nothing to delete', id);
            return true;
        }
        const existing = snapshot.val();
        const currentUserId = getCurrentUserId();

        if (existing.userId !== currentUserId) {
            console.error('❌ Permission denied: only owner can delete plan', id, 'owner=', existing.userId, 'current=', currentUserId);
            return false;
        }

        await getFirebasePlanificationsRef().child(String(id)).remove();
        void syncPlanificationIndexes({ id }, existing);
        console.log('✅ Planification ștearsă din RTDB by owner:', id);
        return true;
    } catch (error) {
        console.error('❌ Eroare la ștergere RTDB:', error);
        if (typeof showAlertApp === 'function') showAlertApp('Eroare la ștergerea: ' + error.message); else alert('Eroare la ștergerea: ' + error.message);
        return false;
    }
}

// Fallback pentru localStorage dacă Firebase nu este disponibil
function isFirebaseAvailable() {
    const available = typeof firebase !== 'undefined' && typeof rdb !== 'undefined' && rdb !== null && typeof rdb.ref === 'function';
    console.log('Firebase available:', available);
    return available;
}

// Funcție pentru a șterge TOATE evenimentele din Firestore
async function deleteAllPlanificationsFromFirestore() {
    if (!isFirebaseAvailable()) {
        console.error('Firebase not available, cannot delete all planifications');
        return false;
    }
    try {
        const scope = getCurrentDataScope();
        await Promise.all([
            getFirebasePlanificationsRef().remove(),
            rdb.ref(`userPlanifications/${scope}`).remove(),
            rdb.ref(`userPlanIndexReady/${scope}`).remove()
        ]);
        console.log('✅ Toate planificările au fost șterse din RTDB');
        return true;
    } catch (error) {
        console.error('❌ Eroare la ștergerea tuturor planificărilor:', error);
        if (typeof showAlertApp === 'function') showAlertApp('Eroare la ștergere: ' + error.message); else alert('Eroare la ștergere: ' + error.message);
        return false;
    }
}

// ===== USER MANAGEMENT FUNCTIONS =====

const usersRealtimeStores = new Map();

function usersFromSnapshot(snapshot) {
    const users = [];
    if (snapshot && snapshot.exists()) {
        snapshot.forEach(child => {
            if (getCurrentDataScope() === 'production' && child.key === 'test') return;
            const user = child.val();
            if (user && typeof user === 'object') users.push(user);
        });
    }
    firebaseMemoryCache.users.set(getFirebaseCacheKey('users', 'all'), users);
    writeFirebaseLocalCache('users', users);
    return users;
}

function ensureUsersRealtimeStore() {
    const key = `${getCurrentDataScope()}:users`;
    if (usersRealtimeStores.has(key)) return usersRealtimeStores.get(key);
    const cached = firebaseMemoryCache.users.get(getFirebaseCacheKey('users', 'all')) || readFirebaseLocalCache('users');
    let resolveReady;
    const store = { users: cached, subscribers: new Set(), ready: null, ref: getScopedUsersRootRef(), handler: null };
    store.ready = new Promise(resolve => { resolveReady = resolve; });
    store.handler = snapshot => {
        store.users = usersFromSnapshot(snapshot);
        resolveReady(store.users);
        store.subscribers.forEach(callback => callback(store.users));
    };
    if (store.ref) store.ref.on('value', store.handler, error => {
        console.error('❌ Eroare listener utilizatori:', error);
        resolveReady(store.users);
    });
    else resolveReady(store.users);
    usersRealtimeStores.set(key, store);
    return store;
}

// Get all users from Firebase (for partner selection)
async function getAllUsersFromFirebase() {
    if (!isFirebaseAvailable()) return [];
    const store = ensureUsersRealtimeStore();
    if (store.users.length) return store.users;
    return await store.ready;
}

// Listen to user changes in real-time
function listenToUsersChanges(callback) {
    if (!isFirebaseAvailable()) {
        console.error('Firebase not available, cannot set up user listener');
        return;
    }

    const store = ensureUsersRealtimeStore();
    store.subscribers.add(callback);
    if (store.users.length) callback(store.users);
    return () => store.subscribers.delete(callback);
}

// Get user by ID
async function getUserById(userId) {
    if (!isFirebaseAvailable()) {
        console.error('Firebase not available, cannot fetch user');
        return null;
    }

    try {
        const userRef = getUserProfileRef(userId);
        const snapshot = userRef ? await userRef.once('value') : null;
        if (snapshot && snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error('❌ Eroare la citire utilizator:', error);
        return null;
    }
}
