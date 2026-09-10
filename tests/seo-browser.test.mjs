import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
const base = process.env.SEO_TEST_BASE ?? "http://127.0.0.1:4010";

test("localized catalog hydrates, switches language and opens a permanent project", async () => {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${base}/en`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.match(await page.locator("h1").innerText(), /BIG IDEAS/);
    assert.equal(await page.locator('script[src*="googletagmanager"]').count(), 0, "Analytics must be absent without a configured ID");
    const preview = page.locator('.project-preview-trigger').first();
    await preview.focus();
    await page.keyboard.press('Enter');
    await page.getByRole('dialog').waitFor({ state: 'visible' });
    assert.match(await page.locator('#project-modal-title').innerText(), /AquaVerde/);
    await page.locator('.modal-close').click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await page.locator('a[href="/en/projects/aquaverde"]').last().click();
    await page.waitForURL("**/en/projects/aquaverde");
    assert.equal(await page.locator("h1").count(), 1);
    await page.locator('.seo-languages a[lang="ru"]').click();
    await page.waitForURL("**/ru/projects/aquaverde");
    assert.equal(await page.locator("html").getAttribute("lang"), "ru");
    assert.match(await page.locator("h1").innerText(), /[А-Яа-я]/);
    assert.deepEqual(errors, [], "No hydration or runtime errors");
  } finally { await browser.close(); }
});

test("FAQ answers render before hydration, and contact prefill stays localized", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`${base}/en/intrebari`, { waitUntil: "networkidle" });
    assert.equal(await page.locator('.faq-answer').count(), 100);
    await page.locator('.faq-category-actions > button').first().click();
    await page.locator('.faq-inline-questions:visible .faq-list article button').first().click();
    assert.equal(await page.locator('.faq-answer').first().isVisible(), true);
    await page.locator('.faq-category-actions > button').first().click();
    assert.equal(await page.locator('.faq-answer').first().isVisible(), false);
    await page.goto(`${base}/ru/contact?project=AquaVerde&option=rental`, { waitUntil: "networkidle" });
    const prefill = await page.locator('textarea[name="message"]').inputValue();
    assert.match(prefill, /AquaVerde/);
    assert.match(prefill, /аренда/);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://monodev.md/ru/contact");
    assert.equal(await page.locator("html").getAttribute("lang"), "ru");
  } finally { await browser.close(); }
});

for (const locale of ["ro", "ru", "en"]) test(`${locale}: catalog controls, payments and demo remain usable on desktop and mobile`, { timeout: 120_000 }, async () => {
  const browser = await chromium.launch();
  try {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      await page.goto(`${base}/${locale}`, { waitUntil: "networkidle" });
      assert.equal(await page.locator(".catalog-directory").count(), 0);
      assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /^index,\s*follow$/);
      const cards = page.locator("#project-grid article.card");
      const originalCount = await cards.count();
      assert.ok(originalCount > 0 && originalCount < 63);
      const more = page.locator(".projects-load-more button");
      while (await more.count()) await more.click();
      assert.equal(await cards.count(), 63);
      await page.locator(".project-search input").fill("AquaVerde");
      await expect(cards).toHaveCount(1);
      assert.match(await cards.first().innerText(), /AquaVerde/);
      await page.locator(".project-search-clear").click();
      await expect(cards).toHaveCount(originalCount);
      await page.locator(".project-sort summary").click();
      await page.locator(".sort-menu button").nth(2).click();
      await expect(cards).toHaveCount(originalCount);
      const lowPrices = await cards.locator(".price-main").allTextContents();
      assert.ok(lowPrices.length > 0, "Card prices must remain visible");
      const prices = lowPrices.map(text => Number(text.replace(/[^\d.]/g, "")));
      assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
      const filters = page.locator(".primary-filters:not(.filter-measure) button");
      await filters.nth(1).click();
      await expect.poll(async () => await cards.count() > 0 && await cards.count() < 63).toBe(true);
      await filters.first().click();
      await page.locator(".platform-mobile").click();
      assert.equal(await page.locator(".platform-mobile").getAttribute("aria-pressed"), "true");
      await page.locator(".platform-games").click();
      assert.equal(await page.locator(".platform-games").getAttribute("aria-pressed"), "true");
      await page.locator(".platform-web").click();
      await page.locator(".project-search input").fill("AquaVerde");
      await expect(cards).toHaveCount(1);
      await page.locator(".project-preview-trigger").first().focus();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog");
      await dialog.waitFor({ state: "visible" });
      assert.match(await page.locator("#project-modal-title").innerText(), /AquaVerde/);
      await dialog.locator('[data-option="installments"][role="radio"]').click();
      for (const months of [3, 6, 12]) {
        const option = dialog.locator(`[data-option="installments-${months}-months"]`);
        await option.click();
        assert.equal(await option.getAttribute("aria-checked"), "true");
      }
      await dialog.locator('[data-option="rental"][role="radio"]').click();
      for (const tier of ["with-services", "without-services"]) {
        const option = dialog.locator(`[data-option="site-rental-${tier}"]`);
        await option.click();
        assert.equal(await option.getAttribute("aria-checked"), "true");
      }
      const demo = await dialog.locator(".demo-link").getAttribute("href");
      assert.equal((await page.request.get(new URL(demo, base).href)).status(), 200);
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
      await page.locator(`a[href="/${locale}/projects/aquaverde"]`).first().click();
      await page.waitForURL(`**/${locale}/projects/aquaverde`);
      assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /^noindex,\s*follow$/);
      assert.equal(await page.locator('head link[hreflang]').count(), 0);
      assert.equal(await page.locator(".project-payment-table tbody tr").count(), 3);
      assert.deepEqual(errors, [], "No runtime or hydration errors");
      await page.close();
    }
  } finally { await browser.close(); }
});
