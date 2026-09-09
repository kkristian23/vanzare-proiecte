import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const base=process.env.AUDIT_BASE||'http://127.0.0.1:4010';
test('additional repaired controls',{timeout:240000},async t=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    for(const width of [1440,390]){
      await t.test(`Academia saves lesson notes and closes information dialogs at ${width}px`,async()=>{
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        try{
          await page.goto(`${base}/academia/`);await page.getByRole('button',{name:'EN',exact:true}).click();
          for(const name of ['Terms','Privacy']){await page.getByRole('button',{name,exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);}
          if(width===390)await page.getByRole('button',{name:'Open menu',exact:true}).click();
          await page.getByRole('button',{name:'My account',exact:true}).click();
          const lessons=page.locator('.lesson-sidebar nav button');
          for(let index=0;index<await lessons.count();index++){const title=await lessons.nth(index).locator('b').innerText();await lessons.nth(index).click();await expect(page.locator('.lesson h1')).toHaveText(title);}
          await lessons.first().click();
          await page.getByRole('button',{name:'Play lesson',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('video recording is not included');await page.getByRole('dialog').getByRole('button',{name:'Close',exact:true}).click();
          await page.getByRole('button',{name:/Add a note/}).click();await page.getByLabel('Lesson notes',{exact:true}).fill('QA lesson note');await page.getByRole('button',{name:'Save note',exact:true}).click();
          await page.reload();if(width===390)await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('button',{name:'My account',exact:true}).click();await page.getByRole('button',{name:/Add a note/}).click();await expect(page.getByRole('textbox',{name:'Lesson notes',exact:true})).toHaveValue('QA lesson note');
        }finally{await page.close();}
      });
      await t.test(`Tableo changes fulfillment and validates a demo reservation at ${width}px`,async()=>{
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        try{
          await page.goto(`${base}/tableo/`);for(let i=0;i<3&&(await page.locator('.lang').innerText()).trim()!=='EN';i++)await page.locator('.lang').click();
          await page.getByRole('button',{name:/^Add to cart:/}).first().click();
          await page.getByRole('button',{name:'Delivery',exact:true}).click();await expect(page.getByRole('button',{name:'Delivery',exact:true})).toHaveAttribute('aria-pressed','true');await page.getByLabel('Delivery address').fill('QA address 10');
          await page.getByRole('button',{name:'Pickup',exact:true}).click();await expect(page.getByLabel('Delivery address')).toHaveCount(0);await page.keyboard.press('Escape');
          await page.getByRole('button',{name:'Find a table',exact:true}).first().click();
          await page.locator('.booking').getByLabel('Date',{exact:true}).fill('2020-01-01');await page.getByRole('button',{name:'Confirm reservation',exact:true}).click();await expect(page.locator('.booking').getByRole('alert')).toBeVisible();
          await page.locator('.booking').getByLabel('Date',{exact:true}).fill('2026-12-15');await page.locator('.booking').getByLabel('Location',{exact:true}).selectOption('1');await page.locator('.booking').getByLabel('Time',{exact:true}).selectOption('20:00');await page.getByRole('button',{name:'Confirm reservation',exact:true}).click();
          await expect(page.locator('.success')).toContainText('2026-12-15');await expect(page.locator('.success')).toContainText('20:00');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('tableo-demo-booking')).location),1);await page.getByRole('button',{name:'Close',exact:true}).last().click();
          await page.getByRole('button',{name:'FAQ',exact:true}).click();await expect(page.getByRole('dialog')).toContainText('No real orders');await page.keyboard.press('Escape');
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));
        }finally{await page.close();}
      });
      await t.test(`PopHaus colour selection changes its illustrated preview at ${width}px`,async()=>{
        const page=await browser.newPage({viewport:{width,height:900}});
        try{await page.goto(`${base}/pophaus/en/product/p1`);const first=await page.locator('.color-preview .product-art').evaluate(el=>el.style.getPropertyValue('--c'));await page.getByRole('button',{name:'Colours 2',exact:true}).click();await expect(page.getByRole('button',{name:'Colours 2',exact:true})).toHaveAttribute('aria-pressed','true');assert.notEqual(await page.locator('.color-preview .product-art').evaluate(el=>el.style.getPropertyValue('--c')),first);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));}finally{await page.close();}
      });
      await t.test(`PopHaus moodboard reorders products and keeps the order after reload at ${width}px`,async()=>{
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        try{
          await page.goto(`${base}/pophaus/en/shop`);
          const add=page.getByRole('button',{name:'Add to moodboard',exact:true});
          await add.nth(0).click();await add.nth(1).click();
          await page.goto(`${base}/pophaus/en/moodboard`);
          const before=await page.locator('.mood-grid h3').allTextContents();assert.equal(before.length,2);
          await page.locator('.mood-grid > div').nth(1).getByRole('button',{name:'←',exact:true}).click();
          await expect(page.locator('.mood-grid h3')).toHaveText([...before].reverse());
          await page.reload();await expect(page.locator('.mood-grid h3')).toHaveText([...before].reverse());
          await page.locator('.mood-grid > div').first().getByRole('button',{name:'×',exact:true}).click();
          await expect(page.locator('.mood-grid h3')).toHaveCount(1);
        }finally{await page.close();}
      });
    }
    for(const width of [1440,390]){
      await t.test(`Audio Rental: every catalog details link is clickable at ${width}px`,async()=>{
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        try{
          await page.goto(`${base}/audio-rental-md/en/catalog`);
          const targets=await page.locator('.route-card > a').evaluateAll(els=>els.map(el=>el.getAttribute('href')));
          assert.equal(targets.length,5);
          for(const href of targets){
            await page.goto(`${base}/audio-rental-md/en/catalog`);
            await page.locator(`.route-card > a[href="${href}"]`).click();
            await page.waitForURL(url=>url.pathname===href);
            await expect(page.locator('h1')).not.toBeEmpty();
          }
        }finally{await page.close();}
      });
      await t.test(`RentTech: all favorite buttons remain above product images at ${width}px`,async()=>{
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        try{
          await page.goto(`${base}/rentech/`);
          const favorites=page.locator('.equipment-grid button.favorite');
          assert.ok(await favorites.count()>0);
          for(let index=0;index<await favorites.count();index++){
            const button=favorites.nth(index);await button.click();await expect(button).toHaveClass(/active/);
            await button.click();await expect(button).not.toHaveClass(/active/);
          }
          const reservations=page.locator('.equipment-grid .reserve-button');
          for(let index=0;index<await reservations.count();index++){
            await reservations.nth(index).click();
            await expect(page.locator('.modal-backdrop')).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
          }
          for(const language of ['ro','en','ru']){
            await page.locator('.language-switcher select').selectOption(language);
            await page.locator('.nav .admin-link').click();
            await page.waitForURL(url=>url.pathname.startsWith('/rentech/admin'));
            await page.goto(`${base}/rentech/`);
          }
        }finally{await page.close();}
      });
    }
    await t.test('Studio Velora calculator fits mobile and updates its estimate',async()=>{
      const page=await browser.newPage({viewport:{width:390,height:844}});try{await page.goto(`${base}/studio-velora/servicii`);const before=await page.locator('.calc .price').innerText();await page.getByRole('button',{name:'Collector',exact:true}).click();assert.notEqual(await page.locator('.calc .price').innerText(),before);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));}finally{await page.close();}
    });
  }finally{await browser.close();}
});
