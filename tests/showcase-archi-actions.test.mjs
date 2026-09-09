import test from 'node:test';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
const base=process.env.AUDIT_BASE||'http://127.0.0.1:4010';
test('ArchiContract product actions and persistent board',{timeout:600000},async t=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  const report={started:new Date().toISOString(),checks:[],printNote:'The browser print function is observed; no physical printer is used.'};
  try{
    for(const width of [1440,390])await t.test(`Every product adds the right item and opens print in all three languages at ${width}px`,async()=>{
      const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
      await context.route('**/*',route=>['GET','HEAD','OPTIONS'].includes(route.request().method())?route.continue():route.abort());
      await context.addInitScript(()=>{window.__printCalls=0;window.print=()=>{window.__printCalls++;};});
      const page=await context.newPage();
      try{
        await page.goto(`${base}/archicontract/en/catalog`);
        const ids=await page.locator('a[href*="/catalog/ac-"]').evaluateAll(els=>[...new Set(els.map(el=>el.getAttribute('href').match(/ac-\d+/)?.[0]).filter(Boolean))].sort());
        assert.equal(ids.length,30);
        const locales=['ro','ru','en'];
        for(const [languageIndex,locale] of locales.entries())for(const id of ids){
          const check={width,locale,id,url:`${base}/archicontract/${locale}/catalog/${id}`};report.checks.push(check);
          await page.goto(check.url);
          check.title=await page.locator('h1').innerText();
          await page.getByRole('button',{name:'Print specification',exact:true}).click();
          assert.equal(await page.evaluate(()=>window.__printCalls),1);
          await page.getByRole('button',{name:'Add to Project Board',exact:true}).click();
          await page.waitForURL(url=>url.pathname.replace(/\/$/,'')===`/archicontract/${locale}/project-board`);
          await expect(page.locator('.card').filter({hasText:id.toUpperCase()})).toContainText(`QTY ${languageIndex+1}`);
          check.boardUrl=page.url();check.result='passed';check.quantity=languageIndex+1;
          if(report.checks.length%10===0)await writeFile('reports/showcase-audit/archi-product-actions.json',JSON.stringify(report,null,2));
        }
        // Adding from a newly loaded catalog must keep all thirty saved lines.
        await page.goto(`${base}/archicontract/en/catalog`);
        await page.locator('input[aria-label]').first().fill('AC-001');
        await page.getByRole('button',{name:'Add',exact:true}).click();
        await expect(page.getByRole('status')).toContainText('AC-001');
        await page.goto(`${base}/archicontract/en/project-board`);
        await expect(page.locator('.card')).toHaveCount(30);
        await expect(page.locator('.card').filter({hasText:'AC-001'})).toContainText('QTY 4');
        await page.getByRole('button',{name:'Remove',exact:true}).first().click();
        await expect(page.locator('.card')).toHaveCount(29);
        await page.getByRole('button',{name:'Clear products',exact:true}).click();
        await page.reload();await expect(page.getByText('No products yet.',{exact:false})).toBeVisible();
        if(width===390){
          for(const locale of locales){
            await page.goto(`${base}/archicontract/${locale}/catalog/ac-009`);
            await page.getByRole('button',{name:'Menu',exact:true}).click();
            await expect(page.locator('#mobile-navigation')).toBeVisible();
            await page.keyboard.press('Escape');
            await expect(page.locator('#mobile-navigation')).toHaveCount(0);
            await page.getByRole('button',{name:'Print specification',exact:true}).click();
            assert.equal(await page.evaluate(()=>window.__printCalls),1);
            await page.getByRole('button',{name:'Menu',exact:true}).click();
            await page.locator('#mobile-navigation a').last().click();
            await page.waitForURL(url=>url.pathname.replace(/\/$/,'')===`/archicontract/${locale}/quote`);
            await expect(page.locator('#mobile-navigation')).toHaveCount(0);
            await page.getByRole('button',{name:'Menu',exact:true}).click();
            await page.locator('header').getByRole('link',{name:/ARCHI/}).click();
            await expect(page.locator('#mobile-navigation')).toHaveCount(0);
          }
        }
      }finally{await context.close();}
    });
    report.finished=new Date().toISOString();
  }finally{await browser.close();await writeFile('reports/showcase-audit/archi-product-actions.json',JSON.stringify(report,null,2));}
});
