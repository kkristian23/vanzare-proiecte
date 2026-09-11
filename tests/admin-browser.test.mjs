import test from "node:test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
const base = process.env.ADMIN_TEST_BASE ?? "http://127.0.0.1:4020";
if (!/https?:\/\/(127\.0\.0\.1|localhost):/.test(base))
  throw new Error("Browser tests require a loopback emulator build.");
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
initializeApp({ projectId: "demo-monodev" });
const auth = getAuth(),
  db = getFirestore();
test(
  "administrator workflow uses real Auth, Firestore and Storage emulators on desktop and mobile",
  { timeout: 240000 },
  async () => {
    for (const [uid, email] of [
      ["browser-admin", "admin@monodev.test"],
      ["browser-visitor", "visitor@monodev.test"],
    ]) {
      await auth.deleteUser(uid).catch(() => {});
      await auth.createUser({ uid, email, password: "Local-test-2026!" });
    }
    await db.doc("cmsAdmins/browser-admin").set({ active: true });
    for (const id of [
      "text-i18n-copy",
      "price-71",
      "media-catalog-aquaverde",
      "media-detail-aquaverde",
    ])
      await db.doc(`cms/${id}`).delete();
    await mkdir("reports/admin", { recursive: true });
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      await page.goto(`${base}/admin`, {
        waitUntil: "domcontentloaded",
        timeout: 120000,
      });
      await expect(
        page.getByRole("heading", { name: "Autentificare", exact: true }),
      ).toBeVisible();
      await page
        .getByLabel("Email", { exact: true })
        .fill("admin@monodev.test");
      await page.getByLabel("Parolă", { exact: true }).fill("wrong-password");
      await page
        .getByRole("button", { name: "Autentificare", exact: true })
        .click();
      await expect(page.getByRole("alert")).toContainText("incorecte");
      await page
        .getByLabel("Email", { exact: true })
        .fill("visitor@monodev.test");
      await page.getByLabel("Parolă", { exact: true }).fill("Local-test-2026!");
      await page
        .getByRole("button", { name: "Autentificare", exact: true })
        .click();
      await expect(
        page.getByRole("heading", { name: "Cont neautorizat" }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Folosește alt cont" }).click();
      await page
        .getByLabel("Email", { exact: true })
        .fill("admin@monodev.test");
      await page.getByLabel("Parolă", { exact: true }).fill("Local-test-2026!");
      await page
        .getByRole("button", { name: "Autentificare", exact: true })
        .click();
      await expect(
        page.getByRole("heading", { name: "Catalogul MONO/DEV" }),
      ).toBeVisible();
      await page.reload();
      await expect(
        page.getByRole("heading", { name: "Catalogul MONO/DEV" }),
      ).toBeVisible();
      await page
        .getByLabel("Pagina și secțiunea", { exact: true })
        .selectOption("text-i18n-copy");
      await page
        .getByLabel("Română / hero A", { exact: false })
        .fill("IDEI ADMIN TEST");
      page.once("dialog", (dialog) => dialog.dismiss());
      await page
        .getByRole("button", { name: "Reduceri", exact: true })
        .click();
      await expect(
        page.getByLabel("Română / hero A", { exact: false }),
      ).toHaveValue("IDEI ADMIN TEST");
      await page.getByRole("button", { name: "Salvează modificările" }).click();
      await expect(page.getByRole("status")).toContainText("salvate");
      for (let run = 0; run < 2; run++) {
        page.once("dialog", (dialog) => dialog.accept());
        await page
          .getByRole("button", { name: "Importă conținutul catalogului" })
          .click();
        await expect(page.getByRole("status")).toContainText(
          "Importul s-a încheiat",
          { timeout: 60000 },
        );
        assert.equal(
          (await db.doc("cms/text-i18n-copy").get()).data().values["ro.heroA"],
          "IDEI ADMIN TEST",
        );
      }
      const visitor = await browser.newContext({
          viewport: { width: 1440, height: 1000 },
        }),
        publicPage = await visitor.newPage();
      await publicPage.goto(`${base}/ro`, { waitUntil: "domcontentloaded" });
      await expect(publicPage.getByRole("heading", { level: 1 })).toContainText(
        "IDEI ADMIN TEST",
      );
      await publicPage.reload();
      await expect(publicPage.getByRole("heading", { level: 1 })).toContainText(
        "IDEI ADMIN TEST",
      );
      await page
        .getByRole("button", { name: "Reduceri", exact: true })
        .click();
      await page
        .getByLabel("Preț actual pentru AquaVerde", { exact: true })
        .fill("1500");
      await page.getByRole("button", { name: "Salvează modificările" }).click();
      await expect(page.getByRole("status")).toContainText("salvate");
      await page
        .getByRole("button", { name: "Aplică reduceri", exact: true })
        .click();
      await page.getByLabel("Procentul reducerii").selectOption("20");
      await page.getByLabel("Aplică reducerea pentru AquaVerde").check();
      await page.getByLabel("Reducere individuală pentru AquaVerde").fill("25");
      await page.getByRole("button", { name: "Salvează modificările" }).click();
      await expect(page.getByRole("status")).toContainText("salvate");
      await expect(
        publicPage
          .locator(".card")
          .filter({ hasText: /AquaVerde/i })
          .locator(".catalog-price del"),
      ).toHaveText("€1500");
      const detail = await visitor.newPage();
      await detail.goto(`${base}/ro/projects/aquaverde`, {
        waitUntil: "domcontentloaded",
      });
      await expect(
        detail.locator(".project-purchase .catalog-price"),
      ).toHaveText("€1500€1125");
      await page
        .getByRole("button", { name: "Coperțile din catalog", exact: true })
        .click();
      await page
        .getByLabel("Fișa din catalog", { exact: true })
        .selectOption("media-catalog-aquaverde");
      await page
        .locator('input[type="file"]')
        .first()
        .setInputFiles({
          name: "bad.txt",
          mimeType: "text/plain",
          buffer: Buffer.from("not an image"),
        });
      await expect(page.getByRole("alert")).toContainText("JPEG");
      await page
        .locator('input[type="file"]')
        .first()
        .setInputFiles("public/project-card-previews/aquaverde-480.webp");
      await page
        .getByLabel("Text alternativ", { exact: true })
        .fill("Copertă administrată de test");
      await page.getByRole("button", { name: "Salvează modificările" }).click();
      await expect(page.getByRole("status")).toContainText("salvate", {
        timeout: 30000,
      });
      await expect(
        publicPage.getByAltText("Copertă administrată de test"),
      ).toBeVisible();
      assert.equal(
        await publicPage
          .getByAltText("Copertă administrată de test")
          .evaluate((img) => img.complete && img.naturalWidth > 0),
        true,
      );
      // A second editor cannot overwrite changes made since the form was loaded.
      await page
        .getByLabel("Text alternativ", { exact: true })
        .fill("Draft vechi");
      const saved = await db.doc("cms/media-catalog-aquaverde").get();
      await db
        .doc("cms/media-catalog-aquaverde")
        .update({ revision: saved.data().revision + 1 });
      await page.getByRole("button", { name: "Salvează modificările" }).click();
      await expect(page.getByRole("alert")).toContainText("altă sesiune");
      page.once("dialog", (d) => d.accept());
      await page.getByRole("button", { name: "Reîncarcă secțiunea" }).click();
      page.once("dialog", (d) => d.accept());
      await page.getByRole("button", { name: "Elimină", exact: true }).click();
      await page.getByRole("button", { name: "Salvează modificările" }).click();
      await expect(page.getByRole("status")).toContainText("salvate");
      await expect(
        publicPage.getByAltText("Copertă administrată de test"),
      ).toHaveCount(0);
      await page
        .getByLabel("Fișa din catalog", { exact: true })
        .selectOption("media-detail-aquaverde");
      page.once("dialog", (d) => d.accept());
      await page.getByRole("button", { name: "Elimină", exact: true }).click();
      for (const alt of ["Prima imagine", "A doua imagine"]) {
        await page
          .locator('input[type="file"]')
          .last()
          .setInputFiles("public/project-card-previews/aquaverde-480.webp");
        await expect(
          page.getByLabel("Text alternativ", { exact: true }),
        ).toHaveCount(alt === "Prima imagine" ? 1 : 2);
        await page
          .getByLabel("Text alternativ", { exact: true })
          .last()
          .fill(alt);
      }
      await page
        .getByRole("button", { name: "Mai sus", exact: true })
        .last()
        .click();
      await page.getByRole("button", { name: "Salvează modificările" }).click();
      await expect(page.getByRole("status")).toContainText("salvate", {
        timeout: 30000,
      });
      await expect(detail.locator(".cms-media img")).toHaveCount(2);
      await expect(detail.locator(".cms-media img").first()).toHaveAttribute(
        "alt",
        "A doua imagine",
      );
      await page.screenshot({
        path: "reports/admin/images.png",
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Reduceri", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Aplică reduceri", exact: true })
        .click();
      await page.getByLabel("Aplică reducerea pentru AquaVerde").uncheck();
      await page.getByRole("button", { name: "Salvează modificările" }).click();
      await expect(page.getByRole("status")).toContainText("salvate");
      await expect(
        detail.locator(".project-purchase .catalog-price"),
      ).toHaveText("€1500");
      await expect(detail.locator(".project-purchase del")).toHaveCount(0);
      await page.screenshot({
        path: "reports/admin/desktop.png",
        fullPage: true,
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({
        path: "reports/admin/mobile.png",
        fullPage: true,
      });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        true,
      );
      await publicPage.setViewportSize({ width: 390, height: 844 });
      assert.equal(
        await publicPage.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        true,
      );
      await page
        .getByRole("button", { name: "Deconectare", exact: true })
        .click();
      await expect(
        page.getByRole("heading", { name: "Autentificare", exact: true }),
      ).toBeVisible();
      await page.reload();
      await expect(
        page.getByRole("heading", { name: "Autentificare", exact: true }),
      ).toBeVisible();
      assert.deepEqual(errors, []);
      await visitor.close();
    } catch (error) {
      await page
        .screenshot({ path: "reports/admin/failure.png", fullPage: true })
        .catch(() => {});
      throw error;
    } finally {
      await browser.close();
    }
  },
);
