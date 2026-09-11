import {
  collection,
  doc,
  documentId,
  getDocFromServer,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseServices } from "../lib/firebase-client";
import {
  type CmsDocument,
  type CmsImage,
  CMS_SITE_SCOPE,
  validatePrice,
} from "../lib/cms-store";
export const imageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
export const maxImageBytes = 5 * 1024 * 1024;
const catalogDocumentId = /^(text|price|media)-[a-zA-Z0-9_-]+$/;
function assertCatalogDocument(id: string) {
  if (!catalogDocumentId.test(id))
    throw new Error("Documentul nu aparține catalogului MONO/DEV.");
}
export function validateImage(file: Pick<File, "size" | "type">) {
  if (!imageTypes.includes(file.type))
    throw new Error("Alege o imagine JPEG, PNG, WebP sau AVIF.");
  if (file.size <= 0 || file.size > maxImageBytes)
    throw new Error(
      "Imaginea trebuie să aibă cel mult 5 MB și să nu fie goală.",
    );
}
export async function readDocument(id: string) {
  assertCatalogDocument(id);
  const snap = await getDocFromServer(doc(firebaseServices().db, "cms", id));
  if (!snap.exists()) return null;
  const value = snap.data() as CmsDocument;
  return value.site === CMS_SITE_SCOPE ? value : null;
}
/** Reads catalog documents in Firestore-sized batches instead of one request per project. */
export async function readDocuments(ids: string[]) {
  ids.forEach(assertCatalogDocument);
  const uniqueIds = [...new Set(ids)];
  const chunks = Array.from(
    { length: Math.ceil(uniqueIds.length / 30) },
    (_, index) => uniqueIds.slice(index * 30, (index + 1) * 30),
  );
  const snapshots = await Promise.all(
    chunks.map((chunk) =>
      getDocs(
        query(
          collection(firebaseServices().db, "cms"),
          where(documentId(), "in", chunk),
        ),
      ),
    ),
  );
  return Object.fromEntries(
    snapshots.flatMap((snapshot) =>
      snapshot.docs.flatMap((entry) => {
        const value = entry.data() as CmsDocument;
        return value.site === CMS_SITE_SCOPE ? [[entry.id, value] as const] : [];
      }),
    ),
  );
}
/** Optimistic revision control prevents silently overwriting another administrator. */
export async function saveDocument(
  id: string,
  value: Omit<CmsDocument, "revision">,
  revision: number,
) {
  assertCatalogDocument(id);
  const { db, auth } = firebaseServices();
  if (!auth.currentUser) throw new Error("Autentifică-te din nou.");
  if (id.startsWith("price-")) {
    const error = validatePrice({
      standard: value.standard!,
      discounted: value.discounted ?? null,
      enabled: value.enabled ?? false,
    });
    if (error) throw new Error(error);
  }
  const target = doc(db, "cms", id);
  await runTransaction(db, async (transaction) => {
    const current = await transaction.get(target);
    if ((current.data()?.revision ?? 0) !== revision)
      throw new Error(
        "Conținutul a fost modificat în altă sesiune. Copiază modificările tale, apoi reîncarcă secțiunea.",
      );
    transaction.set(target, {
      ...value,
      site: CMS_SITE_SCOPE,
      revision: revision + 1,
      updatedAt: serverTimestamp(),
      updatedBy: auth.currentUser!.uid,
    });
  });
}
export async function saveDocuments(
  entries: {
    id: string;
    value: Omit<CmsDocument, "revision">;
    revision: number;
  }[],
) {
  entries.forEach(({ id, value }) => {
    assertCatalogDocument(id);
    if (id.startsWith("price-")) {
      const error = validatePrice({
        standard: value.standard!,
        discounted: value.discounted ?? null,
        enabled: value.enabled ?? false,
      });
      if (error) throw new Error(error);
    }
  });
  const { db, auth } = firebaseServices();
  if (!auth.currentUser) throw new Error("Autentifică-te din nou.");
  const chunks = Array.from(
    { length: Math.ceil(entries.length / 200) },
    (_, index) => entries.slice(index * 200, (index + 1) * 200),
  );
  for (const chunk of chunks) {
    await runTransaction(db, async (transaction) => {
      const targets = chunk.map(({ id }) => doc(db, "cms", id));
      const current = await Promise.all(
        targets.map((target) => transaction.get(target)),
      );
      chunk.forEach((entry, index) => {
        if ((current[index].data()?.revision ?? 0) !== entry.revision)
          throw new Error(
            "Prețurile au fost modificate în altă sesiune. Reîncarcă secțiunea și încearcă din nou.",
          );
      });
      chunk.forEach((entry, index) => {
        transaction.set(targets[index], {
          ...entry.value,
          site: CMS_SITE_SCOPE,
          revision: entry.revision + 1,
          updatedAt: serverTimestamp(),
          updatedBy: auth.currentUser!.uid,
        });
      });
    });
  }
}
/** Only missing fields are seeded; repeated runs preserve edits, including empty strings. */
export async function seedDocuments(
  entries: [string, Omit<CmsDocument, "revision">][],
) {
  entries.forEach(([id]) => assertCatalogDocument(id));
  const { db, auth } = firebaseServices();
  await runTransaction(db, async (transaction) => {
    // Read the entire batch before any write; each document retains its own revision.
    const current = await Promise.all(
      entries.map(([id]) => transaction.get(doc(db, "cms", id))),
    );
    entries.forEach(([, defaults], index) => {
      const existing = current[index];
      if (existing.exists() && !defaults.values) return;
      const old = existing.data();
      const values = defaults.values
        ? { ...defaults.values, ...old?.values }
        : undefined;
      if (
        old &&
        Object.keys(values ?? {}).length ===
          Object.keys(old.values ?? {}).length
      )
        return;
      transaction.set(existing.ref, {
        ...(old ?? defaults),
        ...(values ? { values } : {}),
        site: CMS_SITE_SCOPE,
        revision: (old?.revision ?? 0) + 1,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser!.uid,
      });
    });
  });
}
export async function uploadImage(
  file: File,
  progress: (value: number) => void,
): Promise<CmsImage> {
  validateImage(file);
  const { storage } = firebaseServices();
  const extension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  }[file.type]!;
  const imagePath = `cms-images/${CMS_SITE_SCOPE}/${crypto.randomUUID()}.${extension}`;
  const target = ref(storage, imagePath);
  const task = uploadBytesResumable(target, file, {
    contentType: file.type,
    cacheControl: "public,max-age=31536000,immutable",
  });
  await new Promise<void>((resolve, reject) =>
    task.on(
      "state_changed",
      (snap) =>
        progress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      resolve,
    ),
  );
  const url = new URL(await getDownloadURL(target));
  // Local emulator responses use HTTP loopback, but persisted content has the production URL shape.
  if (
    url.hostname === "127.0.0.1" &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID === "demo-monodev"
  ) {
    url.protocol = "https:";
    url.host = "firebasestorage.googleapis.com";
    url.port = "";
  }
  return { src: url.href, alt: "", path: imagePath };
}
