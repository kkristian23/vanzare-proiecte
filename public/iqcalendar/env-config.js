function isLocalNetworkHostname(hostname) {
  if (!hostname) return false;
  hostname = hostname.toLowerCase();
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return true;
  }
  if (hostname.endsWith('.local')) {
    return true;
  }
  return /^(10|127)\.\d+\.\d+\.\d+$/.test(hostname)
      || /^192\.168\.\d+\.\d+$/.test(hostname)
      || /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname);
}

function normalizeScopes(scopes) {
  if (Array.isArray(scopes)) {
    return scopes.map(scope => String(scope || '').trim()).filter(Boolean).join(',');
  }
  if (typeof scopes === 'string' && scopes.trim() !== '') {
    return scopes
      .split(',')
      .map(scope => scope.trim())
      .filter(Boolean)
      .join(',');
  }
  return 'production,test';
}

const sharedFirebaseConfig = {
  apiKey: "AIzaSyCQn5VtFAHKNQy9OxLLD2wi6Q_Jb2y7l1g",
  authDomain: "dateevent.firebaseapp.com",
  databaseURL: "https://dateevent-default-rtdb.firebaseio.com",
  projectId: "dateevent",
  storageBucket: "dateevent.appspot.com",
  messagingSenderId: "566790015312",
  appId: "1:566790015312:web:7d47b5dd6e222582c94455"
};

const sharedNotificationConfig = {
  TELEGRAM_BOT_TOKEN: "8831118305:AAGbUMt4ediyzzWuRy6E2AWkQZkO7AxoLAc",
  TELEGRAM_BOT_USERNAME: "@iQPlan_Calendar_bot",
  TELEGRAM_CHAT_ID: "782311404",
  FIREBASE_DATABASE_URL: sharedFirebaseConfig.databaseURL,
  FIREBASE_PROJECT_ID: sharedFirebaseConfig.projectId,
  FIREBASE_SERVICE_ACCOUNT_JSON: "",
  NOTIFICATION_SCOPES: normalizeScopes(['production', 'test']),
  TELEGRAM_API_BASE: "https://api.telegram.org",
  NOTIFICATION_POLL_INTERVAL_MS: "60000",
  TELEGRAM_LINK_TOKEN_TTL_MINUTES: "30"
};

function getRuntimeAppBaseUrl() {
  if (typeof window === 'undefined' || !window.location) {
    return '';
  }
  return new URL('./', window.location.href).href;
}

const SHARED_ENV_CONFIG = {
  firebaseConfig: sharedFirebaseConfig,
  notificationConfig: sharedNotificationConfig,
  appUrls: {
    production: getRuntimeAppBaseUrl(),
    test: getRuntimeAppBaseUrl()
  }
};

const runtimeEnvConfig = {
  isTestEnvironment: (typeof window !== 'undefined' && window.location)
    ? isLocalNetworkHostname(window.location.hostname)
    : false,
  firebaseConfig: SHARED_ENV_CONFIG.firebaseConfig,
  notificationConfig: SHARED_ENV_CONFIG.notificationConfig,
  translationApiUrl: '',
  appUrls: SHARED_ENV_CONFIG.appUrls
};

if (typeof window !== 'undefined') {
  window.APP_ENV = runtimeEnvConfig;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = runtimeEnvConfig;
}
