import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const base=process.env.AUDIT_BASE??'http://127.0.0.1:4010';
const output='reports/showcase-audit/catalog.json';
const expectedProjects=JSON.parse(await readFile('showcase-projects/registry.json','utf8')).filter(project=>project.id!==24);
let report={started:new Date().toISOString(),base,cards:[],issues:[]};
const retry=process.argv.includes('--retry');
if(retry){report=JSON.parse(await readFile(output,'utf8'));report.previousIssues=report.issues;report.issues=[];report.retryStarted=new Date().toISOString();}
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  const context=await browser.newContext({viewport:{width:1440,height:900},serviceWorkers:'block'});
  await context.route('**/*',route=>['GET','HEAD','OPTIONS'].includes(route.request().method())?route.continue():route.abort());
  await context.routeWebSocket('**/*',socket=>socket.close());
  const page=await context.newPage();
  await page.goto(base,{waitUntil:'domcontentloaded'});
  const more=page.locator('.projects-load-more button');
  while(await more.count()) { await more.click(); await page.waitForTimeout(300); }
  const cards=page.locator('#project-grid article');
  const count=await cards.count();
  report.cardCount=count;
  if(count!==expectedProjects.length)report.issues.push(`Expected ${expectedProjects.length} cards, found ${count}`);
  for(let index=0;index<count;index++) {
    if(retry&&['opened','unavailable'].includes(report.cards[index]?.result))continue;
    while(await more.count()) { await more.click(); await page.waitForTimeout(300); }
    const item={index:index+1,title:await cards.nth(index).locator('h3').innerText()};
    report.cards[index]=item;
    try {
      await cards.nth(index).click();
      await page.locator('.modal-detailed').waitFor();
      item.modalTitle=await page.locator('.modal-title-row h2').innerText();
      if(item.modalTitle!==item.title)throw new Error('Wrong project opened in modal');
      const link=page.locator('.modal-actions .demo-link');
      if(await link.count()) {
        item.href=await link.getAttribute('href');
        await link.click();
        const destination=new URL(item.href,base);
        await page.waitForURL(url=>url.origin===destination.origin && url.pathname.startsWith(destination.pathname.replace(/\/$/,'')),{timeout:20000});
        await page.waitForFunction(()=>document.body?.innerText.trim().length>40,undefined,{timeout:15000});
        {
          item.url=page.url();
          item.status=(await context.request.get(item.url)).status();
          item.textLength=(await page.locator('body').innerText()).trim().length;
          item.result=item.status===200&&item.textLength>30?'opened':'review-load';
        }
        await page.goBack({waitUntil:'domcontentloaded'});
        await page.locator('.modal-detailed').waitFor();
      } else item.result=await page.locator('.demo-link-disabled').isDisabled()?'unavailable':'missing-demo-link';
      await page.locator('.modal-close').click();
      await page.locator('.modal-detailed').waitFor({state:'hidden'});
      item.modalClosed=true;
    }catch(error){item.error=error.message;report.issues.push({title:item.title,message:error.message});await page.goto(base,{waitUntil:'domcontentloaded'});}
    await mkdir('reports/showcase-audit',{recursive:true});
    await writeFile(output,JSON.stringify(report,null,2));
    console.log(`${index+1}/${count} ${item.title}: ${item.result??'error'}`);
  }
  report.finished=new Date().toISOString();
}finally {await browser.close();await writeFile(output,JSON.stringify(report,null,2));}
