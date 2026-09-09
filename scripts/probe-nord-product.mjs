import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const checks=[];
try {
  const context=await browser.newContext({reducedMotion:'reduce'});
  const page=await context.newPage();
  for(let i=0;i<12;i++) {
    const check={i,errors:[]};checks.push(check);let stage='load';
    page.removeAllListeners('pageerror');
    page.on('pageerror',error=>check.errors.push({stage,url:page.url(),message:error.message,stack:error.stack}));
    await page.goto('http://127.0.0.1:4010/nord-and-oak/en/product/vale-bed');
    await page.waitForTimeout(700);
    stage='skip';await page.locator('.skip').focus();await page.locator('.skip').click();
    for(const locale of ['ro','ru','en']) {
      stage=locale;await page.locator(`header a[href="/nord-and-oak/${locale}/product/vale-bed"]`).click();
      await page.waitForTimeout(250);
      stage=locale+' back';await page.goBack({waitUntil:'domcontentloaded'});await page.waitForTimeout(200);
      if(!page.url().includes('/en/product/vale-bed'))await page.goto('http://127.0.0.1:4010/nord-and-oak/en/product/vale-bed#content');
    }
    stage='home';await page.locator('nav[aria-label=Breadcrumb] a').first().click();
    await page.waitForTimeout(250);
    stage='home back';await page.goBack({waitUntil:'domcontentloaded'});await page.waitForTimeout(700);
    console.log(i,check.errors.map(e=>[e.stage,e.message]));
  }
}finally{await browser.close();await writeFile('reports/showcase-audit/nord-product-hydration.json',JSON.stringify(checks,null,2));}
