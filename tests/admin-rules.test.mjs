import { after, before, beforeEach, test } from "node:test";
import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, deleteObject, getBytes } from "firebase/storage";
let env;
before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-monodev",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: readFileSync("firestore.rules", "utf8"),
    },
    storage: {
      host: "127.0.0.1",
      port: 9199,
      rules: readFileSync("storage.rules", "utf8"),
    },
  });
});
after(async () => {
  await env?.cleanup();
});
beforeEach(async () => {
  await env.clearFirestore();
  await env.clearStorage();
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), "cmsAdmins", "admin"), { active: true });
  });
});
const write = (ctx, id, data, revision = 1) =>
  setDoc(doc(ctx.firestore(), "cms", id), {
    ...data,
    site: "monodev-catalog",
    revision,
    updatedAt: serverTimestamp(),
    updatedBy: ctx === admin ? "admin" : "visitor",
  });
let admin;
test("anonymous and authenticated non-admin cannot write; users cannot grant themselves access", async () => {
  for (const ctx of [
    env.unauthenticatedContext(),
    env.authenticatedContext("visitor"),
  ]) {
    await assertFails(write(ctx, "text-home", { values: { title: "Hacked" } }));
    await assertFails(
      write(ctx, "price-1", { standard: 1, discounted: null, enabled: false }),
    );
    await assertFails(write(ctx, "media-test", { images: [] }));
    await assertFails(
      setDoc(doc(ctx.firestore(), "cmsAdmins", "visitor"), { active: true }),
    );
    await assertFails(
      uploadBytes(
        ref(ctx.storage(), "cms-images/monodev-catalog/test.png"),
        new Uint8Array([1, 2, 3]),
        { contentType: "image/png" },
      ),
    );
  }
});
test("admin can publish content; public reads work; private role list stays protected", async () => {
  admin = env.authenticatedContext("admin");
  await assertSucceeds(
    write(admin, "text-home", { values: { title: "Titlu nou" } }),
  );
  const publicDb = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(publicDb, "cms", "text-home")));
  await assertSucceeds(getDocs(collection(publicDb, "cms")));
  await assertFails(getDocs(collection(publicDb, "cmsAdmins")));
  await assertFails(getDoc(doc(publicDb, "cmsAdmins", "admin")));
  await assertSucceeds(getDoc(doc(admin.firestore(), "cmsAdmins", "admin")));
  await assertFails(deleteDoc(doc(admin.firestore(), "cms", "text-home")));
  await assertFails(
    write(admin, "text-home", { values: { title: "Stale" } }, 1),
  );
  await assertSucceeds(
    write(admin, "text-home", { values: { title: "Revision 2" } }, 2),
  );
});
test("catalog scope is mandatory and unrelated application content is rejected", async () => {
  admin = env.authenticatedContext("admin");
  const db = admin.firestore();
  const metadata = {
    revision: 1,
    updatedAt: serverTimestamp(),
    updatedBy: "admin",
    values: { title: "Outside" },
  };
  await assertFails(setDoc(doc(db, "cms", "text-demo-site"), metadata));
  await assertFails(
    setDoc(doc(db, "cms", "text-demo-site"), {
      ...metadata,
      site: "supplemental-project",
    }),
  );
  await assertFails(
    uploadBytes(
      ref(admin.storage(), "cms-images/supplemental-project/test.png"),
      new Uint8Array([1]),
      { contentType: "image/png" },
    ),
  );
});
test("server rejects invalid pricing even when the UI is bypassed", async () => {
  admin = env.authenticatedContext("admin");
  for (const price of [
    { standard: -1, discounted: null, enabled: false },
    { standard: "100", discounted: null, enabled: false },
    { standard: 1500, discounted: 1500, enabled: true },
    { standard: 1500, discounted: 0, enabled: true },
    { standard: 1500, discounted: null, enabled: true },
  ])
    await assertFails(write(admin, "price-1", price));
  await assertSucceeds(
    write(admin, "price-1", {
      standard: 1500,
      discounted: 1200,
      enabled: true,
    }),
  );
  await assertSucceeds(
    write(
      admin,
      "price-1",
      { standard: 1500, discounted: 1200, enabled: false },
      2,
    ),
  );
});
test("revoking the allowlist blocks subsequent writes", async () => {
  admin = env.authenticatedContext("admin");
  await assertSucceeds(write(admin, "text-home", { values: {} }));
  await env.withSecurityRulesDisabled((ctx) =>
    setDoc(doc(ctx.firestore(), "cmsAdmins", "admin"), { active: false }),
  );
  await assertFails(write(admin, "text-home", { values: {} }, 2));
  await assertFails(
    uploadBytes(
      ref(admin.storage(), "cms-images/monodev-catalog/revoked.png"),
      new Uint8Array([1]),
      { contentType: "image/png" },
    ),
  );
});
test("image rules enforce size and MIME, preserve immutable files and allow safe detachment", async () => {
  admin = env.authenticatedContext("admin");
  const image = ref(admin.storage(), "cms-images/monodev-catalog/test.png");
  await assertSucceeds(
    uploadBytes(image, new Uint8Array([1, 2, 3]), { contentType: "image/png" }),
  );
  await assertSucceeds(
    getBytes(
      ref(env.unauthenticatedContext().storage(), "cms-images/monodev-catalog/test.png"),
    ),
  );
  await assertFails(
    uploadBytes(image, new Uint8Array([2]), { contentType: "image/png" }),
  );
  await assertFails(deleteObject(image));
  await assertFails(
    uploadBytes(
      ref(admin.storage(), "cms-images/monodev-catalog/large.png"),
      new Uint8Array(5 * 1024 * 1024 + 1),
      { contentType: "image/png" },
    ),
  );
  await assertFails(
    uploadBytes(
      ref(admin.storage(), "cms-images/monodev-catalog/bad.svg"),
      new Uint8Array([1]),
      { contentType: "image/svg+xml" },
    ),
  );
  await assertFails(
    write(admin, "media-test", {
      images: [{ src: "javascript:alert(1)", alt: "x" }],
    }),
  );
  await assertSucceeds(
    write(admin, "media-test", {
      images: [{ src: "/project-previews/aquaverde.webp", alt: "Copertă" }],
    }),
  );
  await assertSucceeds(write(admin, "media-test", { images: [] }, 2));
  await assertSucceeds(
    write(admin, "media-gallery", {
      images: Array.from({ length: 12 }, (_, i) => ({
        src: "/project-previews/aquaverde.webp",
        alt: `Imagine ${i}`,
      })),
    }),
  );
});
