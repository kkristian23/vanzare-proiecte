import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

const base = process.env.AUDIT_BASE || 'http://127.0.0.1:4010';
test('remaining showcase workflows', {timeout:360000}, async t => {
  const browser = await chromium.launch({channel:'chrome', headless:true});
  try {
    for (const width of [1440,390]) {
      await t.test(`Drivolt: search, cart, quote draft and Escape at ${width}px`, async () => {
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        try {
          await page.goto(`${base}/drivolt/`);
          await page.getByRole('button',{name:'EN',exact:true}).click();
          await page.getByRole('button',{name:'Open search',exact:true}).filter({visible:true}).first().click();
          await expect(page.locator('.search-layer')).toBeVisible();
          const firstProduct=await page.locator('.search-results button b').first().innerText();
          await page.locator('.search-layer input').fill(firstProduct);
          await expect(page.locator('.search-results button').first()).toContainText(firstProduct);
          await page.locator('.search-results button').first().click();
          await expect(page.locator('.detail-modal')).toContainText(firstProduct);
          await page.locator('.detail-action button').click();
          await page.keyboard.press('Escape');
          await expect(page.locator('.detail-modal')).toHaveCount(0);
          const cartButton=width===390?page.locator('.mobile-nav button').last():page.getByRole('button',{name:'Open cart',exact:true});
          await cartButton.click();
          await expect(page.locator('.cart-drawer.open')).toBeVisible();
          await expect(page.locator('.cart-lines')).toContainText(firstProduct);
          const quote=new URL(await page.locator('.cart-total a').getAttribute('href'));
          assert.equal(quote.protocol,'mailto:');
          assert.ok(quote.searchParams.get('body').includes(firstProduct));
          await page.locator('.cart-lines button').first().click();
          await expect(page.locator('.cart-total')).toHaveCount(0);
          await page.keyboard.press('Escape');
          await expect(page.locator('.cart-drawer')).toBeHidden();
          await page.getByRole('button',{name:'Open search',exact:true}).filter({visible:true}).first().click();
          await page.keyboard.press('Escape');
          await expect(page.locator('.search-layer')).toHaveCount(0);
        } finally {await page.close();}
      });
      await t.test(`Audio Rental: information, categories, search and dates at ${width}px`, async () => {
        const context = await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
        const page = await context.newPage();
        const errors=[];
        page.on('pageerror',e=>errors.push(e.message));
        try {
          for(const locale of ['ro','en','ru']) {
            await page.goto(`${base}/audio-rental-md/${locale}/contact`,{waitUntil:'domcontentloaded'});
            for(const section of ['privacy','rental-terms','contact']) {
              await page.locator(`a[href="/audio-rental-md/${locale}/${section}"]`).click();
              await expect(page.locator('.information-content article')).toHaveCount(section==='contact'?2:3);
              assert.ok((await page.locator('h1').innerText()).length>3);
              assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));
              assert.equal((await context.request.get(page.url())).status(),200);
            }
          }
          await page.goto(`${base}/audio-rental-md/ro/categories`);
          await page.locator('a[href*="catalog?category=tools"]').click();
          await expect(page.locator('.route-card')).toHaveCount(1);
          await expect(page.locator('.route-card')).toContainText('Bosch');
          await page.getByRole('combobox').selectOption('');
          await expect(page.locator('.route-card')).toHaveCount(5);
          await page.getByRole('textbox',{name:'Caută produse'}).fill('zz-no-product');
          await expect(page.locator('.route-card')).toHaveCount(0);
          await page.getByRole('button',{name:'Resetează filtrele'}).click();
          await expect(page.locator('.route-card')).toHaveCount(5);
          await page.getByRole('textbox',{name:'Caută produse'}).fill('JBL');
          await expect(page.locator('.route-card')).toHaveCount(1);
          await page.locator('.route-card a').click();
          await expect(page.locator('.detail-panel')).toBeVisible();
          await page.goBack();
          await page.goto(`${base}/audio-rental-md/ro`);
          await page.locator('input[type=date]').nth(0).fill('2026-12-15');
          await page.locator('input[type=date]').nth(1).fill('2026-12-18');
          await page.locator('form button').click();
          await page.waitForURL(/catalog\?start=2026-12-15&end=2026-12-18/);
          await expect(page.locator('.route-card')).toHaveCount(5);
          assert.deepEqual(errors,[]);
        } finally { await context.close(); }
      });
      await t.test(`PopHaus hero CTA receives clicks at ${width}px`, async () => {
        const page = await browser.newPage({viewport:{width,height:900}});
        try {
          await page.goto(`${base}/pophaus/ro`);
          await page.locator('.hero-copy a.button').first().click();
          await page.waitForURL(/\/pophaus\/ro\/shop/);
        } finally { await page.close(); }
      });
      await t.test(`Neo Booking: complete demo reservation and restart at ${width}px`, async () => {
        const context = await browser.newContext({viewport:{width,height:900}});
        const page = await context.newPage();
        const writes=[], errors=[];
        await context.route('**/*',route=>{if(!['GET','HEAD','OPTIONS'].includes(route.request().method())){writes.push(route.request().url());return route.abort();}return route.continue();});
        page.on('pageerror',e=>errors.push(e.message));
        try {
          await page.goto(`${base}/neo-booking/`);
          await page.getByRole('link',{name:'Vezi demonstrația'}).click();
          await page.locator('.ub-services button').first().click();
          await page.locator('.ub-specialists button').first().click();
          await page.locator('.ub-days button').first().click();
          await page.locator('.ub-times button:not([disabled])').first().click();
          await page.getByRole('button',{name:'Continuă'}).click();
          await page.getByLabel('Nume și prenume').fill('Test QA');
          await page.getByLabel('Telefon',{exact:true}).fill('000000000');
          await page.getByLabel('Email (opțional)',{exact:true}).fill('qa@example.invalid');
          await page.getByRole('button',{name:'Verifică'}).click();
          await expect(page.locator('.ub-confirm')).toContainText('Test QA');
          await page.getByRole('button',{name:'Înapoi'}).click();
          await expect(page.getByLabel('Nume și prenume')).toHaveValue('Test QA');
          await page.getByRole('button',{name:'Verifică'}).click();
          await page.getByRole('button',{name:'Confirmă programarea'}).click();
          await expect(page.locator('.ub-success')).toBeVisible();
          await expect(page.locator('.showcase-notice')).toContainText('nu sunt trimise');
          await page.getByRole('button',{name:'Programare nouă'}).click();
          await expect(page.locator('.ub-services')).toBeVisible();
          assert.deepEqual(writes,[]); assert.deepEqual(errors,[]);
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));
        } finally { await context.close(); }
      });
    }
    await t.test('Nord & Oak: pinned animation keeps its React container through navigation',async()=>{
      const page=await browser.newPage({viewport:{width:1440,height:900}});
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      try {
        for(let attempt=0;attempt<3;attempt++) {
          await page.goto(`${base}/nord-and-oak/`,{waitUntil:'domcontentloaded'});
          await page.locator('[data-story-spacer].pin-spacer').waitFor({timeout:20000});
          await page.evaluate(()=>{const el=document.querySelector('[data-story-spacer]');window.scrollTo(0,el.getBoundingClientRect().top+scrollY+200);});
          await expect(page.locator('[data-story-spacer] > section')).toHaveCount(1);
          await page.locator('a[href="/nord-and-oak/ro/shop"]').first().click();
          await page.waitForURL(/\/ro\/shop\/?$/);
          await page.goBack({waitUntil:'domcontentloaded'});
          await page.locator('[data-story-spacer].pin-spacer').waitFor({timeout:20000});
          await expect(page.locator('[data-story-spacer] > section')).toHaveCount(1);
        }
        assert.deepEqual(errors,[]);
      } finally {await page.close();}
    });
    await t.test('Neo Booking: configured local preview opens its saved services',async()=>{
      const page=await browser.newPage();
      try {
        await page.goto(`${base}/neo-booking/setup`);
        await page.getByLabel('Nume',{exact:true}).fill('QA Company');
        await page.getByLabel('Nume serviciu',{exact:true}).fill('QA Service');
        await page.getByRole('button',{name:'Publică sistemul'}).click();
        await expect(page.locator('.setup-done')).toBeVisible();
        await page.getByRole('link',{name:'Deschide pagina de programări'}).click();
        await expect(page.locator('.ub-services')).toContainText('QA Service');
        await expect(page.locator('.ub-header')).toContainText('QA Company');
      } finally { await page.close(); }
    });
  } finally { await browser.close(); }
});
