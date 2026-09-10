import test from 'node:test';
import { chromium, expect } from '@playwright/test';

const base = process.env.AUDIT_BASE || 'http://127.0.0.1:4010';

test('ArchiContract mobile navigation closes after links and retains Escape support in all languages', { timeout: 90000 }, async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const locale of ['ro', 'ru', 'en']) {
      await page.goto(`${base}/archicontract/${locale}/catalog/ac-009`);
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await expect(page.locator('#mobile-nav')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#mobile-nav')).toHaveCount(0);
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page.locator('#mobile-nav a').last().click();
      await page.waitForURL(url => url.pathname.replace(/\/$/, '') === `/archicontract/${locale}/quote`);
      await expect(page.locator('#mobile-nav')).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveAttribute('aria-expanded', 'false');
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page.locator('header').getByRole('link', { name: /ARCHI/ }).click();
      await page.waitForURL(url => url.pathname.replace(/\/$/, '') === `/archicontract/${locale}`);
      await expect(page.locator('#mobile-nav')).toHaveCount(0);
    }
  } finally { await browser.close(); }
});
