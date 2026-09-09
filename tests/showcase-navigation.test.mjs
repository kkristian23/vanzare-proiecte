import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const base=process.env.AUDIT_BASE||'http://127.0.0.1:4010';

test('catalog base paths and mobile navigation',{timeout:240000},async t=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try {
    for(const slug of ['aquaverde','terraforma','gazonpro','ecohabitat','yardcraft'])for(const width of [1440,390]){
      await t.test(`${slug}: internal link and Back stay in the project at ${width}px`,async()=>{
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce',serviceWorkers:'block'});
        const errors=[];
        page.on('pageerror',error=>errors.push(error.message));
        page.on('response',response=>{if(response.url().startsWith(base)&&response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
        await page.route('**/*',route=>['GET','HEAD','OPTIONS'].includes(route.request().method())?route.continue():route.abort());
        try {
          const response=await page.goto(`${base}/${slug}/`);assert.equal(response.status(),200);
          const initial=new URL(page.url());
          const links=page.locator(`main a[href^="/${slug}/"]`);
          let link;
          for(let i=0;i<await links.count();i++){
            const candidate=links.nth(i);const href=await candidate.getAttribute('href');
            if(await candidate.isVisible()&&new URL(href,base).pathname!==initial.pathname&&!/\.(pdf|json|png|jpg)$/.test(href)){link=candidate;break;}
          }
          assert.ok(link,'Expected an internal project link');
          const destination=new URL(await link.getAttribute('href'),base);
          await link.click();await page.waitForURL(url=>url.pathname===destination.pathname,{timeout:15000});
          await expect(page.locator('main')).not.toBeEmpty();
          assert.equal((await page.request.get(page.url())).status(),200);
          await page.goBack({waitUntil:'domcontentloaded'});await page.waitForURL(url=>url.pathname===initial.pathname);
          await page.waitForTimeout(300);assert.deepEqual(errors,[]);
        } finally {await page.close();}
      });
    }
    await t.test('Nord & Oak closes its mobile menu after navigation and with Escape',async()=>{
      const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
      try {
        await page.goto(`${base}/nord-and-oak/en/`);
        const toggle=page.locator('button[aria-controls="main-navigation"]');
        await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','true');
        await page.locator('#main-navigation a').first().click();await page.waitForURL(/\/en\/shop\/?$/);
        await expect(toggle).toHaveAttribute('aria-expanded','false');
        await toggle.click();await page.keyboard.press('Escape');await expect(toggle).toHaveAttribute('aria-expanded','false');
      } finally {await page.close();}
    });
    await t.test('Nord & Oak restores the URL language after repeated Back navigation',async()=>{
      const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
      const errors=[];page.on('pageerror',error=>errors.push(error.message));
      try {
        await page.goto(`${base}/nord-and-oak/ru/contact#content`);
        const original=await page.locator('h1').innerText();
        for(let i=0;i<4;i++){
          await page.locator('header a').filter({hasText:/^en$/}).click();
          await page.waitForURL(/\/en\/contact\/?$/);
          await expect(page.locator('h1')).not.toHaveText(original);
          await page.goBack({waitUntil:'domcontentloaded'});
          await expect(page.locator('h1')).toHaveText(original);
          await expect(page.locator('header a[aria-current="page"]')).toHaveText('ru');
        }
        await page.goto(`${base}/nord-and-oak/ru/product/lina-chair`);
        const product=await page.locator('h1').innerText();
        for(let cycle=0;cycle<3;cycle++)for(const route of ['shop','materials','origin','craftspeople','journal']){
          await page.locator('button[aria-controls="main-navigation"]').click();
          await page.locator(`#main-navigation a[href="/nord-and-oak/ru/${route}"]`).click();
          await page.waitForURL(url=>url.pathname===`/nord-and-oak/ru/${route}`);
          await page.goBack({waitUntil:'domcontentloaded'});
          await expect(page.locator('h1')).toHaveText(product);
        }
        assert.deepEqual(errors,[]);
      }finally{await page.close();}
    });
    await t.test('Nord & Oak hydrates product content consistently across repeated fresh documents',async()=>{
      const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
      const errors=[];
      await context.route('**/*',route=>['GET','HEAD','OPTIONS'].includes(route.request().method())?route.continue():route.abort());
      try {
        const routes=['ru/product/lina-chair','ru/product/birch-toy-chest','ro/product/niva-shelf'];
        for(let cycle=0;cycle<60;cycle++){
          const page=await context.newPage();page.on('pageerror',error=>errors.push({route:routes[cycle%3],message:error.message}));
          await page.goto(`${base}/nord-and-oak/${routes[cycle%3]}`);
          await expect(page.locator('main h1')).not.toBeEmpty();
          await page.waitForTimeout(150);await page.close();
        }
        assert.deepEqual(errors,[]);
      }finally{await context.close();}
    });
  } finally {await browser.close();}
});
