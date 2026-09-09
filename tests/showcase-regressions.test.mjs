import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const base = process.env.AUDIT_BASE ?? 'http://127.0.0.1:4010';
test('showcase navigation and viewport regressions', {timeout:180000}, async t => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    for (const [slug, target, start=''] of [['micora','galerie'], ['studio-velora','proiecte'], ['studio-velora','proiecte/atelier-no-7','proiecte'], ['pophaus','ro/shop'], ['nord-and-oak','ro/shop'], ['neobarberclub','servicii']]) {
      await t.test(`${slug}/${target}: click opens the project page inside its own base path`, async () => {
        const page = await browser.newPage();
        const javascriptErrors=[];
        page.on('pageerror',error=>javascriptErrors.push(error.message));
        try {
          const response = await page.goto(`${base}/${slug}/${start}`, {waitUntil:'domcontentloaded'});
          assert.equal(response.status(), 200);
          const link = page.locator(`a[href="/${slug}/${target}"], a[href="/${slug}/${target}/"]`).first();
          await link.click();
          await page.waitForURL(url => url.pathname.replace(/\/$/,'') === `/${slug}/${target}`);
          await page.waitForFunction(()=>document.body?.innerText.length>100,undefined,{timeout:10000});
          assert.ok((await page.locator('body').innerText()).length > 100);
          await page.goBack({waitUntil:'domcontentloaded'});
          assert.ok(new URL(page.url()).pathname.startsWith(`/${slug}`));
          assert.deepEqual(javascriptErrors,[]);
        } finally { await page.close(); }
      });
    }
    for (const slug of ['08-lead-pilot','12-garage-box','elan','studio-forma','rentech','micora','atelier-noire/ru/confidentialitate','nord-and-oak/ro/sustainability','nord-and-oak/ru/journal/design-scandinav','nord-and-oak/ru/origin','nord-and-oak/ru/takeback','neo-booking/setup','forma-living/ru/guide/guide-6']) {
      for (const width of [1440,390]) {
        await t.test(`${slug}: no document overflow at ${width}px`, async () => {
          const page = await browser.newPage({viewport:{width,height:900}});
          try {
            await page.goto(`${base}/${slug}/`, {waitUntil:'domcontentloaded'});
            await page.waitForTimeout(400);
            const metrics = await page.evaluate(() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
            assert.ok(metrics.scrollWidth <= metrics.width + 3, JSON.stringify(metrics));
          } finally { await page.close(); }
        });
      }
    }
    await t.test('restored routes and RSC root payload return 200', async () => {
      for (const route of ['/autoflow-partner.txt','/neobarberclub.txt','/studio-velora.txt','/market9000/info/reguli','/market9000/companies/category/17','/market9000/companies/5','/neobarberclub/servicii/barber','/forma-living/ro/about']) {
        const response = await fetch(base+route);
        assert.equal(response.status,200,route);
      }
    });
  } finally { await browser.close(); }
});
