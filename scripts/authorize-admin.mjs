import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
const [projectId, email, action = "grant"] = process.argv.slice(2);
if (!projectId || !email || !["grant", "revoke"].includes(action)) {
  console.error(
    "Utilizare: npm run admin:authorize -- PROJECT_ID EMAIL [grant|revoke]",
  );
  process.exit(1);
}
// Run from a trusted machine with Application Default Credentials. Never import in app/.
initializeApp({ projectId, credential: applicationDefault() });
const user = await getAuth().getUserByEmail(email);
if (user.disabled && action === "grant")
  throw new Error("Contul este dezactivat în Firebase Authentication.");
await getFirestore()
  .doc(`cmsAdmins/${user.uid}`)
  .set(
    { active: action === "grant", updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
if (action === "revoke") await getAuth().revokeRefreshTokens(user.uid);
console.log(
  action === "grant"
    ? `Administrator autorizat: ${email}. Se poate autentifica la /admin.`
    : `Acces retras: ${email}.`,
);
