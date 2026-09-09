import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const base=process.env.AUDIT_BASE||'http://127.0.0.1:4010';
test('new garden project tools',{timeout:180000},async t=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    for(const width of [1440,390]){
      await t.test(`EcoHabitat updates its score and validates water calculator inputs at ${width}px`,async()=>{
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        try{
          await page.goto(`${base}/ecohabitat/evaluare-ecologica/`);
          const checks=page.locator('section[aria-labelledby="score-title"] input[type=checkbox]');
          for(let i=0;i<5;i++)await checks.nth(i).check();
          await expect(page.getByTestId('eco-score')).toContainText('100');
          await checks.first().uncheck();await expect(page.getByTestId('eco-score')).toContainText('80');
          await page.goto(`${base}/ecohabitat/colectarea-apei/`);
          await page.getByRole('button',{name:'Calculează apa disponibilă'}).click();
          const value=await page.getByTestId('rain-potential').innerText();assert.equal(value.replace(/\D/g,''),'44000');
          await page.getByLabel('Suprafața acoperișului (m²)',{exact:true}).fill('0');
          await page.getByRole('button',{name:'Calculează apa disponibilă'}).click();
          await expect(page.locator('#roof-error')).toBeVisible();
          await page.goto(`${base}/ecohabitat/resurse/`);
          const sheets=page.getByRole('link',{name:'Deschide fișa A4'});
          assert.equal(await sheets.count(),3);
          for(let index=0;index<3;index++){
            const expected=await sheets.nth(index).getAttribute('href');
            const popupPromise=page.waitForEvent('popup');
            await sheets.nth(index).click({noWaitAfter:true});
            const popup=await popupPromise;
            try{await popup.waitForLoadState('domcontentloaded');assert.equal(new URL(popup.url()).pathname,expected);await expect(popup.locator('h1')).not.toBeEmpty();assert.equal((await page.request.get(popup.url())).status(),200);assert.ok(await popup.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));}finally{await popup.close();}
          }
        }finally{await page.close();}
      });
      await t.test(`YardCraft completes its 14 steps and restores a saved project at ${width}px`,async()=>{
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        const errors=[];page.on('pageerror',error=>errors.push(error.message));
        page.on('console',message=>{if(/width\(-1\)|height\(-1\)/.test(message.text()))errors.push(message.text());});
        await page.route('**/*',route=>['GET','HEAD','OPTIONS'].includes(route.request().method())?route.continue():route.abort());
        try{
          await page.goto(`${base}/yardcraft/configurator/`);
          if(width===390){
            await page.getByRole('button',{name:'Deschide meniul',exact:true}).click();
            await page.locator('.nav .mobile-contact').click();
            await page.waitForURL(/\/yardcraft\/contact\/?$/);
            await expect(page.locator('.menu-button')).toHaveAttribute('aria-expanded','false');
            await page.getByRole('button',{name:'Deschide meniul',exact:true}).click();
            await page.keyboard.press('Escape');await expect(page.locator('.menu-button')).toHaveAttribute('aria-expanded','false');
            await page.goto(`${base}/yardcraft/configurator/`);
          }
          const next=page.locator('.config-navigation').getByRole('button',{name:/Continuă/});
          await next.click();await next.click();
          await page.getByLabel('Lungime (m)',{exact:true}).fill('42');
          await page.getByRole('button',{name:/Salvează proiectul/}).click();
          await expect(page.getByRole('status')).toContainText('Proiect salvat');
          await page.reload();await page.getByRole('button',{name:'Reia proiectul salvat',exact:true}).click();
          await expect(page.getByLabel('Lungime (m)',{exact:true})).toHaveValue('42');
          for(let step=2;step<13;step++)await next.click();
          await expect(page.getByRole('button',{name:'Vezi rezumatul',exact:true})).toBeVisible();
          await page.locator('.chart-wrap').scrollIntoViewIfNeeded();await page.waitForTimeout(400);
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));
          await page.getByRole('button',{name:/Salvează proiectul/}).click();
          const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('yardcraft-project-v1')));
          assert.equal(saved.step,13);assert.equal(saved.project.length,42);
          await page.getByRole('button',{name:'Șterge salvarea',exact:true}).click();
          assert.equal(await page.evaluate(()=>localStorage.getItem('yardcraft-project-v1')),null);
          assert.deepEqual(errors,[]);
        }finally{await page.close();}
      });
    }
  }finally{await browser.close();}
});
