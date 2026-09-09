import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const args=process.argv.slice(2);
const option=(key,fallback)=>args.find(x=>x.startsWith(`--${key}=`))?.slice(key.length+3)||fallback;
const base=option('base','http://127.0.0.1:4010');
const root='reports/showcase-audit';
const only=option('only','').split(',').filter(Boolean);
await mkdir(`${root}/interaction-rechecks`,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  for(const file of (await readdir(`${root}/final`)).filter(x=>x.endsWith('.browser.json'))) {
    const original=JSON.parse(await readFile(`${root}/final/${file}`,'utf8'));
    if(only.length&&!only.includes(original.slug))continue;
    const targets=original.pages.flatMap(page=>(page.controls||[]).filter(c=>c.result==='interaction-error').map(control=>({page:page.finalUrl||page.url,sourcePage:page.url,viewport:page.viewport,control})));
    const report={slug:original.slug,started:new Date().toISOString(),sourceFinished:original.finished,checks:[],issues:[]};
    if(!targets.length)continue;
    console.log(`RECHECK ${original.slug}: ${targets.length} controls`);
    const context=await browser.newContext({serviceWorkers:'block',reducedMotion:'reduce'});
    await context.route('**/*',route=>['GET','HEAD','OPTIONS'].includes(route.request().method())?route.continue():route.abort('blockedbyclient'));
    await context.routeWebSocket('**/*',socket=>socket.close());
    let page=await context.newPage();
    page.setDefaultTimeout(3500);
    page.on('pageerror',error=>report.issues.push({page:page.url(),message:error.message}));
    try {
      for(const target of targets) {
        await page.close();page=await context.newPage();page.setDefaultTimeout(5000);
        page.on('pageerror',error=>report.issues.push({page:page.url(),message:error.message}));
        const item={...target,result:'',error:''};report.checks.push(item);
        try {
          await page.setViewportSize(target.viewport);
          await page.goto(target.page.replace(new URL(target.page).origin,base),{waitUntil:'domcontentloaded',timeout:25000});
          await page.waitForTimeout(500);
          const meta=target.control;
          const find=async()=> {
            const locator=page.locator(meta.tag.toLowerCase());
            const matches=await locator.evaluateAll((els,m)=>els.map((el,i)=>({i,name:el.getAttribute('aria-label')||el.getAttribute('placeholder')||el.textContent?.trim().slice(0,140)||el.getAttribute('name')||'',href:el.getAttribute('href'),id:el.id})).filter(el=>m.id?el.id===m.id:el.name===m.name&&el.href===m.href).map(x=>x.i),meta);
            if(Number.isInteger(meta.occurrence)&&matches[meta.occurrence]!==undefined)return locator.nth(matches[meta.occurrence]);
            for(const index of matches){if(await locator.nth(index).isVisible())return locator.nth(index);}
            return matches.length ? locator.nth(matches[0]) : null;
          };
          let control=await find();
          if(!control&&original.slug==='atelier-noire'&&meta.href?.includes('product=masa-arc')) {
            item.stateUrl=`${base}/atelier-noire/ro/catalog/masa-arc`;
            item.stateNote='Earlier navigation left a control from another product in the inventory; replay on its actual product page.';
            await page.goto(item.stateUrl);control=await find();
          }
          if(!control&&original.slug==='nord-and-oak'&&['Home','Acasă'].includes(meta.name)) {
            const locale=meta.href.split('/').at(-1);
            item.stateUrl=`${base}/nord-and-oak/${locale}/product/lina-chair`;
            item.stateNote='Replay the shared breadcrumb on a product page; the earlier inventory retained it after Back.';
            await page.goto(item.stateUrl);control=await find();
          }
          if(!control&&original.slug==='pophaus'&&meta.href==='/pophaus/ro/favorites') {
            item.stateUrl=`${base}/pophaus/en/favorites`;await page.goto(item.stateUrl);control=await find();
          }
          if(!control&&original.slug==='pophaus'&&meta.name==='←') {
            await page.goto(`${base}/pophaus/en/shop`);
            await page.getByRole('button',{name:'Add to moodboard',exact:true}).nth(0).click();
            await page.getByRole('button',{name:'Add to moodboard',exact:true}).nth(1).click();
            await page.goto(`${base}/pophaus/en/moodboard`);control=await find();
            item.stateNote='Added two products through the catalog before testing the moodboard control.';
          }
          if(!control&&original.slug==='neo-booking'&&meta.name.includes('Cristina')) {
            await page.locator('.ub-services button').first().click();control=await find();
          }
          if(!control&&original.slug==='micora'&&meta.name==='Открыть меню') {
            await page.locator('.site-nav button.menu').click();
            await page.locator('.mobile-panel .languages button').filter({hasText:'RU'}).click();
            await page.locator('.menu-top > button').click();
            await page.locator('.mobile-panel').waitFor({state:'hidden'});control=await find();
          }
          if(!control&&meta.href){
            const prefix=`/${original.slug}/`;
            const locale=meta.href.startsWith(prefix)?meta.href.slice(prefix.length).match(/^(ro|ru|en)(?:\/|$)/)?.[1]:null;
            const current=new URL(target.page);
            if(locale&&current.pathname.startsWith(prefix)&&/^(ro|ru|en)(?:\/|$)/.test(current.pathname.slice(prefix.length))){
              current.pathname=prefix+current.pathname.slice(prefix.length).replace(/^(ro|ru|en)(?=\/|$)/,locale);
              item.stateUrl=current.href;await page.goto(current.href,{waitUntil:'domcontentloaded',timeout:25000});await page.waitForTimeout(700);control=await find();
            }
          }
          if(control&&!await control.evaluate(el=>el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))) {
            const cart=await control.evaluate(el=>!!el.closest('.cart-drawer'));
            const menu=page.locator(cart ? 'button[aria-label*="cart" i],button[aria-label*="coș" i],button[aria-label*="корзин" i]' : 'button[aria-controls="main-navigation"], button[aria-label*="menu" i], button[aria-label*="meniu" i]').first();
            if(await menu.isVisible()){await menu.click();await page.waitForTimeout(400);control=await find();}
          }
          if(!control) {
            const selectors=page.locator('select');
            for(let index=0;index<await selectors.count();index++){
              const select=selectors.nth(index);if(!await select.isVisible())continue;
              const values=await select.locator('option').evaluateAll(els=>els.map(el=>el.value));
              if(!['ro','ru','en'].every(value=>values.includes(value)))continue;
              const languages=/[\u0400-\u04ff]/.test(meta.name)?['ru','ro','en']:['en','ro','ru'];
              for(const language of languages){await select.selectOption(language);await page.waitForTimeout(700);control=await find();if(control)break;}
              if(control)break;
            }
          }
          if(!control&&/close|închide|inchide|закрыть/i.test(meta.name)){
            const opener=page.getByRole('button',{name:/deschide meniul|open menu|menu|meniu|меню/i}).filter({visible:true}).first();
            if(await opener.isVisible()){await opener.click();await page.waitForTimeout(400);control=await find();}
          }
          if(!control) {
            for(const language of ['EN','RU','RO','English','Русский','Română']) {
              const button=page.getByRole('button',{name:language,exact:true}).first();
              if(await button.isVisible()){await button.click();await page.waitForTimeout(150);control=await find();if(control)break;}
            }
          }
          if(control&&!await control.evaluate(el=>el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))) {
            const cart=await control.evaluate(el=>!!el.closest('.cart-drawer'));
            const opener=page.locator(cart?'button[aria-label*="cart" i],button[aria-label*="coș" i],button[aria-label*="корзин" i]':'button[aria-controls="main-navigation"],button[aria-label*="menu" i],button[aria-label*="meniu" i]').first();
            if(await opener.isVisible()){await opener.click();await page.waitForTimeout(400);control=await find();}
          }
          if(!control){item.result=original.slug==='iqcalendar'&&await page.locator('#onboardingModal').isVisible()?'authentication-required-manual':'state-requires-scenario';continue;}
          if(original.slug==='iqcalendar'&&await page.locator('#onboardingModal').isVisible()&&!await control.evaluate(el=>!!el.closest('#onboardingModal'))){item.result='authentication-required-manual';continue;}
          if(!await control.evaluate(el=>el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))){item.result='not-visible-in-this-viewport';continue;}
          if(meta.tag==='LABEL'&&await control.evaluate(el=>el.classList.contains('sr-only')||el.classList.contains('visually-hidden'))){item.result='accessible-label-not-a-click-target';continue;}
          if(meta.tag==='A'&&/skip|sari la/i.test(meta.name))await control.focus();
          const before=page.url();
          const opensSeparate=meta.tag==='A'&&await control.getAttribute('target')==='_blank';
          const popupPromise=opensSeparate?page.waitForEvent('popup',{timeout:15000}).catch(()=>null):null;
          if(meta.tag==='SELECT') {
            const options=await control.locator('option').evaluateAll(els=>els.filter(el=>!el.disabled&&el.value).map(el=>el.value));
            if(options.length)await control.selectOption(options.at(-1));
          } else if(['INPUT','TEXTAREA'].includes(meta.tag)&&!['checkbox','radio','submit','button','range','color','file'].includes(meta.type)) {
            if(await control.getAttribute('readonly')!==null){item.result='readonly-verified';continue;}
            await control.fill(meta.type==='email'?'qa@example.invalid':meta.type==='number'?'2':meta.type==='date'?'2026-12-15':meta.type==='time'?'12:00':'Test QA');
          } else {
            await control.scrollIntoViewIfNeeded();
            await page.waitForTimeout(350);
            const backdropPosition=await control.evaluate(el=>{
              if(!/backdrop/.test(el.className))return null;
              const b=el.getBoundingClientRect();
              for(const y of [innerHeight-12,12,innerHeight/2])for(const x of [12,innerWidth-12,innerWidth/2])if(document.elementFromPoint(x,y)===el)return {x:x-b.left,y:y-b.top};
              return null;
            });
            await control.click({noWaitAfter:opensSeparate,...(backdropPosition?{position:backdropPosition}:{})});
          }
          await page.waitForTimeout(400);
          item.afterUrl=page.url();item.result='click-reproduced-successfully';
          if(opensSeparate){
            const popup=await popupPromise;if(!popup)throw new Error('New tab was not opened');
            try{
              await popup.waitForLoadState('domcontentloaded');
              item.popupUrl=popup.url();item.popupTitle=await popup.title();
              item.status=(await context.request.get(popup.url())).status();
              if(item.status!==200||(await popup.locator('body').innerText()).trim().length<30)throw new Error('New tab is unavailable or empty');
            }finally{await popup.close();}
          }
          if(page.url()!==before&&!page.url().includes('#')) {
            assertLocal: {
              if(new URL(page.url()).origin!==new URL(base).origin){item.result='external-destination-manual';break assertLocal;}
              item.status=(await context.request.get(page.url())).status();
              if(item.status>=400)throw new Error(`Destination HTTP ${item.status}`);
              await page.goBack({waitUntil:'domcontentloaded'});
            }
          }
        } catch(error){item.result=original.slug==='iqcalendar'&&await page.locator('#onboardingModal').isVisible()?'authentication-required-manual':'reproduced-error';item.error=error.message.replace(/\u001b\[[0-9;]*m/g,'').slice(0,3000);}
        finally {await writeFile(`${root}/interaction-rechecks/${original.slug}.json`,JSON.stringify(report,null,2));}
      }
    } finally {await context.close();}
    report.finished=new Date().toISOString();await writeFile(`${root}/interaction-rechecks/${original.slug}.json`,JSON.stringify(report,null,2));
    console.log(`DONE ${original.slug}: ${report.checks.filter(x=>x.result==='reproduced-error').length} reproduced errors`);
  }
} finally {await browser.close();}
