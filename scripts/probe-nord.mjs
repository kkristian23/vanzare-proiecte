import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const checks=[];
try {
  for(let i=0;i<6;i++) {
    const page=await browser.newPage();let stage='entry';const errors=[];
    page.on('pageerror',e=>errors.push({stage,message:e.message,stack:e.stack}));
    page.on('console',m=>{if(m.type()==='error')errors.push({stage,console:m.text()});});
    await page.goto('http://127.0.0.1:4010/nord-and-oak/',{waitUntil:'domcontentloaded'});
    stage='shop';await page.locator('a[href="/nord-and-oak/ro/shop"]').first().click();
    await page.waitForFunction(()=>document.body.innerText.length>100);
    stage='back';await page.goBack({waitUntil:'domcontentloaded'});
    await page.waitForTimeout(1000);
    checks.push({i,errors});console.log(i,errors.map(e=>[e.stage,e.message||e.console]));
    await page.close();
  }
}finally{await browser.close();await writeFile('reports/showcase-audit/nord-hydration.json',JSON.stringify(checks,null,2));}
