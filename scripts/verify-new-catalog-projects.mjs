import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { loadSiteModule } from './load-site-data.mjs';

const slugs = ['serviceflow-pro', 'vatra-market', 'codru-escapes', 'clientaxis-crm'];
const { getProject } = loadSiteModule('app/lib/project-catalog.ts');
const { projectCardImages } = loadSiteModule('app/lib/project-card-images.ts');
for (const slug of slugs) {
  for (const locale of ['ro', 'ru', 'en']) {
    const project = getProject(locale, slug);
    assert.ok(project, `${locale}: missing catalog project ${slug}`);
    assert.equal(project.demo, `/${slug}/`);
    assert.ok(project.description && !project.description.includes('translation missing'));
    assert.ok(project.image && projectCardImages[slug]);
  }
}
await mkdir('public/project-previews', { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const slug of slugs) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(`http://127.0.0.1:4010/${slug}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const info = await page.evaluate((slug) => ({
      title: document.title,
      text: document.body.innerText.slice(0, 500),
      brokenImages: [...document.images].filter(i => i.getBoundingClientRect().top < innerHeight && (!i.complete || i.naturalWidth === 0)).map(i => i.getAttribute('src')),
      escapedLinks: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h.startsWith('/') && !h.startsWith(`/${slug}`)),
      overflow: document.documentElement.scrollWidth > innerWidth,
    }), slug);
    await sharp(await page.screenshot()).webp({ quality: 86 }).toFile(`public/project-previews/${slug}.webp`);
    await page.setViewportSize({ width: 390, height: 844 });
    const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    console.log(JSON.stringify({ slug, status: response.status(), ...info, mobileOverflow, errors }));
    assert.equal(response.status(), 200);
    assert.equal(errors.length, 0);
    assert.equal(info.escapedLinks.length, 0);
    assert.equal(info.brokenImages.length, 0);
    assert.equal(info.overflow || mobileOverflow, false);
    if (slug === 'vatra-market') {
      await page.goto(`http://127.0.0.1:4010/${slug}/produse/`, { waitUntil: 'networkidle' });
      await page.locator('a.product-name').first().click();
      assert.ok(page.url().includes(`/${slug}/produs/`));
      const product = await page.reload({ waitUntil: 'networkidle' });
      assert.equal(product.status(), 200);
    }
    if (slug === 'serviceflow-pro') {
      const calculator = await page.goto(`http://127.0.0.1:4010/${slug}/calculator/`, { waitUntil: 'networkidle' });
      assert.equal(calculator.status(), 200);
    }
    await page.close();
  }
} finally { await browser.close(); }
