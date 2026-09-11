import { readFile, writeFile, rename } from "node:fs/promises";
import { parseEnv } from "node:util";
const env = {
  ...parseEnv(await readFile(".env", "utf8").catch(() => "")),
  ...parseEnv(await readFile(".env.local", "utf8").catch(() => "")),
  ...process.env,
};
const projectId = env.VITE_FIREBASE_PROJECT_ID;
const siteScope = "monodev-catalog";
const snapshot = {};
function decode(value) {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values ?? []).map(decode);
  if ("mapValue" in value)
    return Object.fromEntries(
      Object.entries(value.mapValue.fields ?? {}).map(([key, item]) => [
        key,
        decode(item),
      ]),
    );
  return undefined;
}
if (projectId && env.VITE_FIREBASE_EMULATORS !== "true") {
  let pageToken;
  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/cms`,
    );
    url.searchParams.set("pageSize", "300");
    if (env.VITE_FIREBASE_API_KEY)
      url.searchParams.set("key", env.VITE_FIREBASE_API_KEY);
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    // Only the public collection is read, without Admin credentials or an authorization token.
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok)
      throw new Error(
        `Citirea conținutului CMS pentru build a eșuat (HTTP ${response.status}). Verifică proiectul și regulile Firestore.`,
      );
    const body = await response.json();
    for (const doc of body.documents ?? []) {
      const id = doc.name.split("/").pop();
      if (!/^(text|price|media)-[a-zA-Z0-9_-]+$/.test(id)) continue;
      const decoded = Object.fromEntries(
        Object.entries(doc.fields ?? {})
          .filter(([key]) =>
            [
              "revision",
              "values",
              "standard",
              "discounted",
              "enabled",
              "images",
              "site",
            ].includes(key),
          )
          .map(([key, value]) => [key, decode(value)]),
      );
      if (decoded.site !== siteScope) continue;
      snapshot[id] = decoded;
    }
    pageToken = body.nextPageToken;
  } while (pageToken);
}
await writeFile(
  "app/lib/cms-published.json.tmp",
  JSON.stringify(snapshot) + "\n",
);
await rename("app/lib/cms-published.json.tmp", "app/lib/cms-published.json");
console.log(
  `CMS build snapshot: ${Object.keys(snapshot).length} documente publice${projectId ? "" : " (Firebase neconfigurat; conținut inițial)"}.`,
);
