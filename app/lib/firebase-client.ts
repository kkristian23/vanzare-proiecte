import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export const firebaseConfigured = Boolean(
  config.apiKey &&
  config.authDomain &&
  config.projectId &&
  config.storageBucket &&
  config.appId,
);
let services: ReturnType<typeof createServices> | undefined;
function createServices() {
  const app = getApps().length ? getApp() : initializeApp(config);
  const auth = getAuth(app),
    db = getFirestore(app),
    storage = getStorage(app);
  // Explicit opt-in, loopback only; never connect a production visitor to emulators.
  if (
    import.meta.env.VITE_FIREBASE_EMULATORS === "true" &&
    ["localhost", "127.0.0.1"].includes(location.hostname) &&
    config.projectId === "demo-monodev"
  ) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
  }
  const persistence = setPersistence(auth, browserLocalPersistence);
  // Login awaits this promise and reports failure; anonymous readers must not get an unhandled rejection.
  void persistence.catch(() => {});
  return { auth, db, storage, persistence };
}
export function firebaseServices() {
  if (typeof window === "undefined" || !firebaseConfigured)
    throw new Error(
      "Firebase nu este configurat. Consultă docs/admin-firebase.md.",
    );
  return (services ??= createServices());
}
export function firebaseMessage(error: unknown) {
  const code = (error as { code?: string })?.code;
  const messages: Record<string, string> = {
    "auth/invalid-credential": "Emailul sau parola sunt incorecte.",
    "auth/wrong-password": "Emailul sau parola sunt incorecte.",
    "auth/user-not-found": "Emailul sau parola sunt incorecte.",
    "auth/invalid-email": "Introdu o adresă de email validă.",
    "auth/too-many-requests":
      "Prea multe încercări. Încearcă din nou mai târziu.",
    "auth/user-disabled": "Acest cont a fost dezactivat.",
    "auth/network-request-failed":
      "Conexiunea a eșuat. Verifică internetul și încearcă din nou.",
    "auth/web-storage-unsupported":
      "Browserul blochează stocarea sesiunii. Permite stocarea pentru acest site și încearcă din nou.",
    "auth/operation-not-allowed":
      "Autentificarea prin email și parolă trebuie activată în Firebase.",
    "permission-denied":
      "Acces refuzat. Verifică autorizarea contului și regulile Firebase.",
    "storage/unauthorized": "Nu ai dreptul să modifici imaginile.",
    unavailable:
      "Serviciul nu este disponibil. Verifică internetul și reîncearcă.",
    "storage/retry-limit-exceeded": "Încărcarea a expirat. Încearcă din nou.",
  };
  return (
    (code && messages[code]) ||
    (error instanceof Error && !code
      ? error.message
      : "Operațiunea a eșuat. Încearcă din nou.")
  );
}
