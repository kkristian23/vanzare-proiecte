import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

const base = process.env.AUDIT_BASE || 'http://127.0.0.1:4010';
const labels = {
  ro: { add: 'Adaugă în proiect', quantity: 'Cantitate', export: 'Exportă PDF' },
  ru: { add: 'Добавить в проект', quantity: 'Количество', export: 'Экспорт PDF' },
  en: { add: 'Add to project', quantity: 'Quantity', export: 'Export PDF' },
};

test('ArchiContract product actions and persistent board', { timeout: 600000 }, async t => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = { started: new Date().toISOString(), checks: [], exportNote: 'Current demo provides technical sheets and project-list PDF downloads; the retired print button is no longer its export action.' };
  try {
    for (const width of [1440, 390]) await t.test(`Every product adds the right item and exports in all three languages at ${width}px`, async () => {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await context.route('**/*', route => ['GET', 'HEAD', 'OPTIONS'].includes(route.request().method()) ? route.continue() : route.abort());
      const page = await context.newPage();
      try {
        await page.goto(`${base}/archicontract/en/catalog`);
        const ids = await page.locator('a[href*="/catalog/ac-"]').evaluateAll(els => [...new Set(els.map(el => el.getAttribute('href').match(/ac-\d+/)?.[0]).filter(Boolean))].sort());
        assert.equal(ids.length, 30);
        for (const [languageIndex, locale] of ['ro', 'ru', 'en'].entries()) {
          const copy = labels[locale];
          for (const id of ids) {
            const check = { width, locale, id, url: `${base}/archicontract/${locale}/catalog/${id}` };
            report.checks.push(check);
            await page.goto(check.url);
            check.title = await page.locator('h1').innerText();
            assert.ok(check.title.length > 0);
            const technical = page.locator('main a[href*="technical-sheets.pdf"]');
            assert.equal(new URL(await technical.getAttribute('href'), base).hash, `#page=${Number(id.slice(3))}`);
            await page.getByRole('button', { name: copy.add, exact: true }).click();
            await page.waitForURL(url => url.pathname.replace(/\/$/, '') === `/archicontract/${locale}/project-board`);
            await expect(page.getByLabel(`${copy.quantity} ${id.toUpperCase()}`, { exact: true })).toHaveValue(String(languageIndex + 1));
            await expect(page.locator('main')).toContainText(check.title);
            check.boardUrl = page.url(); check.result = 'passed'; check.quantity = languageIndex + 1;
          }
          const pending = page.waitForEvent('download');
          await page.getByRole('button', { name: copy.export, exact: true }).click();
          const download = await pending;
          assert.match(download.suggestedFilename(), /^archicontract-.+\.pdf$/);
          const pdf = await readFile(await download.path());
          assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
          for (const id of ids) assert.ok(pdf.toString('latin1').includes(id.toUpperCase()), `${locale}: exported list missing ${id}`);
          await page.reload();
          await expect(page.locator('input[aria-label*="AC-"]')).toHaveCount(30);
          await writeFile('reports/showcase-audit/archi-product-actions.json', JSON.stringify(report, null, 2));
        }
        // Catalog addition must retain all thirty lines and increment one item.
        await page.goto(`${base}/archicontract/en/catalog`);
        await page.getByPlaceholder('Search name or code', { exact: true }).fill('AC-001');
        await page.getByRole('button', { name: labels.en.add, exact: true }).click();
        await page.goto(`${base}/archicontract/en/project-board`);
        await expect(page.locator('input[aria-label*="AC-"]')).toHaveCount(30);
        await expect(page.getByLabel('Quantity AC-001', { exact: true })).toHaveValue('4');
        await page.getByRole('button', { name: 'Remove', exact: true }).first().click();
        await expect(page.locator('input[aria-label*="AC-"]')).toHaveCount(29);
        await page.getByRole('button', { name: 'Clear list', exact: true }).click();
        await page.reload();
        await expect(page.locator('input[aria-label*="AC-"]')).toHaveCount(0);
        for (const asset of ['technical-sheets.pdf', 'finish-material-guide.pdf', 'bim-cad-library.csv']) {
          const response = await context.request.get(`${base}/archicontract/downloads/${asset}`);
          assert.equal(response.status(), 200, asset);
          const body = await response.body();
          if (asset.endsWith('.pdf')) assert.equal(body.subarray(0, 5).toString(), '%PDF-');
          else assert.ok(body.toString().includes('AC-001'));
        }
        if (width === 390) for (const locale of ['ro', 'ru', 'en']) {
          await page.goto(`${base}/archicontract/${locale}/catalog/ac-009`);
          await page.getByRole('button', { name: 'Menu', exact: true }).click();
          await expect(page.locator('#mobile-nav')).toBeVisible();
          await page.keyboard.press('Escape');
          await expect(page.locator('#mobile-nav')).toHaveCount(0);
          await page.getByRole('button', { name: 'Menu', exact: true }).click();
          await page.locator('#mobile-nav a').last().click();
          await page.waitForURL(url => url.pathname.replace(/\/$/, '') === `/archicontract/${locale}/quote`);
          await expect(page.locator('#mobile-nav')).toHaveCount(0);
          await page.getByRole('button', { name: 'Menu', exact: true }).click();
          await page.locator('header').getByRole('link', { name: /ARCHI/ }).click();
          await expect(page.locator('#mobile-nav')).toHaveCount(0);
        }
      } finally { await context.close(); }
    });
    report.finished = new Date().toISOString();
  } finally { await browser.close(); await writeFile('reports/showcase-audit/archi-product-actions.json', JSON.stringify(report, null, 2)); }
});
