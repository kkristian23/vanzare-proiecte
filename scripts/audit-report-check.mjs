import {chromium,expect} from '@playwright/test';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
  for(const url of ['http://127.0.0.1:4010/__audit/',pathToFileURL(path.resolve('reports/showcase-audit/index.html')).href]){
    const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url,{waitUntil:'domcontentloaded'});await expect(page.locator('h1')).toContainText('63');
    await page.getByRole('textbox',{name:'Caută proiect'}).fill('flow-crm');await expect(page.locator('.project:visible')).toHaveCount(1);
    await page.locator('#flow-crm').getByText('Fiecare pagină și fiecare control inventariat',{exact:true}).click();
    const check=page.locator('#flow-crm .page-check').first();await check.locator('summary').click();await expect(check).toHaveAttribute('data-loaded','true');
    if(await check.locator('tr').count()<2)throw new Error('No controls rendered');
    if(errors.length)throw new Error(errors.join('\n'));
    console.log(`Report search and lazy controls passed: ${url}`);
    await page.screenshot({path:'reports/showcase-audit/report-preview.png'});await page.close();
  }
}finally{await browser.close();}
