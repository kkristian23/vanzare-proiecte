import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const args = process.argv.slice(2);
const option = (name, fallback) => args.findLast(x => x.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback;
const base = option('base', 'http://127.0.0.1:3001');
const phase = option('phase', 'http');
const controlLimit=Math.max(1,Math.min(2000,Number(option('max-controls','600'))||600));
const output = path.resolve(option('output', 'reports/showcase-audit'));
const registry = JSON.parse(await readFile('showcase-projects/registry.json', 'utf8')).filter(p => p.id !== 24);
const prices = JSON.parse(await readFile('app/project-prices.json', 'utf8'));
const only = option('only', '').split(',').filter(Boolean);
const explicitPaths = option('paths', '').split(',').filter(Boolean);
const projects = registry.filter(p => !only.length || only.includes(p.slug));
await mkdir(output, { recursive: true });
async function files(dir) {
  const result = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (['_next', 'assets', '.vite', 'images', 'fonts', 'node_modules', '404', '_not-found'].includes(e.name)) continue;
    const target = path.join(dir, e.name);
    if (e.isDirectory()) result.push(...await files(target));
    else if (e.name.endsWith('.html') && !['404.html', 'preview.html', '_not-found.html', '500.html'].includes(e.name)) result.push(target);
  }
  return result;
}
const cache = new Map();
async function request(url) {
  if (!cache.has(url)) cache.set(url, (async () => {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: 'follow' });
      const type = response.headers.get('content-type') ?? '';
      const body = /text|javascript|json/.test(type) ? await response.text() : (await response.arrayBuffer(), '');
      return { status: response.status, finalUrl: response.url, type, body };
    } catch (error) { return { status: 0, error: error.message, body: '' }; }
  })());
  return cache.get(url);
}
async function save(report) {
  await writeFile(path.join(output, `${report.slug}.${phase}.json`), JSON.stringify(report, null, 2));
}
function localLinks(html, url) {
  const references = [...html.matchAll(/\b(?:href|src|action)=["']([^"']+)["']/g)].map(m => m[1]);
  for (const [, candidates] of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    if (candidates.startsWith('data:')) continue;
    references.push(...candidates.split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
  }
  return references.map(ref => ref.replaceAll('&amp;', '&')).flatMap(ref => {
    try { const u = new URL(ref, url); return u.origin === new URL(base).origin ? [u.href.split('#')[0]] : []; } catch { return []; }
  });
}
let browser;
if (phase === 'browser') browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const project of projects) {
  const report = { id: project.id, name: prices.find(p => p.id === project.id)?.name ?? project.slug, slug: project.slug, phase, scope: args.includes('--entry-only') ? 'entry-interactions' : args.includes('--load-only') ? 'all-pages-load-only' : 'all-pages-interactions', started: new Date().toISOString(), pages: [], issues: [], blocked: [] };
  if (args.includes('--resume')) {
    try {
      const old = JSON.parse(await readFile(path.join(output, `${project.slug}.${phase}.json`), 'utf8'));
      const availableExport = project.disabled || (old.pages.length > 0 && !old.blocked?.some(item=>item.kind==='disabled-project'));
      const compatible = availableExport && old.scope === report.scope && !!old.strictClicks === args.includes('--strict-clicks') && JSON.stringify(old.explicitPaths||[])===JSON.stringify(explicitPaths) && (!old.finished || (old.controlLimit??200)>=controlLimit || !old.pages.some(p=>p.limitReached));
      if (compatible && old.finished && !old.pages.some(p=>p.error||p.inProgress)) { console.log(`SKIP ${project.slug}`); continue; }
      if (compatible && phase === 'browser') {
        if(old.pages.some(p=>p.error))await writeFile(path.join(output,`${project.slug}.resume-history.json`),JSON.stringify(old,null,2));
        Object.assign(report, old, {pages:old.pages.filter(p=>!p.inProgress&&!p.error),finished:undefined,resumedAt:new Date().toISOString()});
      }
    } catch { /* new project */ }
  }
  console.log(`START ${project.slug} ${phase}`);
  report.strictClicks = args.includes('--strict-clicks');
  report.controlLimit=controlLimit;
  try {
    if (project.disabled) {
      report.blocked.push({ kind: 'disabled-project', message: 'Catalog project is marked unavailable; no usable exported entry.' });
      report.finished = new Date().toISOString();
      await save(report);
      continue;
    }
    const entry = `${base}/${project.slug}/`;
    const routes = new Set([entry, ...(args.includes('--entry-only') ? [] : await files(path.join('public', project.slug))).map(f => {
      const url = `${base}/${f.replaceAll('\\', '/').replace(/^public\//, '')}`;
      return phase === 'browser' && project.slug !== 'iqcalendar' ? url.replace(/\/index\.html$/, '/').replace(/\.html$/, '') : url;
    })]);
    if (explicitPaths.length) {
      routes.clear();
      explicitPaths.forEach(p => routes.add(new URL(`${project.slug}/${p.replace(/^\/+/, '')}`, `${base}/`).href));
      report.explicitPaths = explicitPaths;
    }
    if (phase === 'http') {
      const visited = new Set();
      for (const url of routes) {
        const result = await request(url);
        report.pages.push({ url, status: result.status, finalUrl: result.finalUrl });
        if (result.status >= 400 || !result.status) report.issues.push({ kind: 'page-response', url, status: result.status, error: result.error });
        if (result.status === 200 && !/<(?:main|body|div)\b/i.test(result.body)) report.issues.push({ kind: 'empty-document', url });
        const resources = [...new Set(localLinks(result.body, result.finalUrl ?? url))];
        for (const target of resources) {
          if (visited.has(target)) continue;
          visited.add(target);
          const asset = await request(target);
          if (asset.status >= 400 || !asset.status) report.issues.push({ kind: 'link-or-resource', page: url, url: target, status: asset.status, error: asset.error });
          if (asset.status === 200 && asset.type?.includes('text/html') && target.startsWith(`${base}/${project.slug}/`) && !/\/(?:404|preview)\.html/.test(target) && !/\.(?:js|css|woff2?|png|jpg|webp|svg)(?:\?|$)/i.test(target)) routes.add(target);
          if (/\.(?:js|css|woff2?|png|jpg|webp|svg)(?:\?|$)/i.test(target) && asset.type?.includes('text/html')) report.issues.push({ kind: 'asset-returned-html', page: url, url: target });
        }
        await save(report);
      }
      report.resourcesChecked = visited.size;
    } else {
      // Real browser interaction audit; an isolated context never reuses personal sessions.
      for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
        const context = await browser.newContext({ viewport, acceptDownloads: false, serviceWorkers: 'block', reducedMotion: 'reduce' });
        await context.routeWebSocket('**/*', socket => {
          report.blocked.push({kind:'websocket',url:socket.url()});
          socket.close();
        });
        await context.route('**/*', async route => {
          const req = route.request();
          if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method())) {
            report.blocked.push({ kind: 'network-write', url: req.url(), method: req.method() });
            return route.abort('blockedbyclient');
          }
          await route.continue();
        });
        const createAuditPage=async()=>{
        const page = await context.newPage();
        // Leave Playwright's interception/cache behavior intact.
        const network = await context.newCDPSession(page);
        if(args.includes('--debug-hydration')) {
          await network.send('Debugger.enable');
          await network.send('Debugger.setPauseOnExceptions',{state:'all'});
          network.on('Debugger.paused',async event=>{
            const release=setTimeout(()=>void network.send('Debugger.resume').catch(()=>{}),5000);
            try{
              if(/(?:#418|#519|Hydration failed|Hydration Mismatch|#421)/.test(event.data?.description||'')) {
                const diagnostic={page:page.url(),viewport:viewport.width,exception:event.data?.description,frames:[]};
                diagnostic.recentControls=report.pages.at(-1)?.controls.slice(-5).map(c=>({name:c.name,href:c.href,result:c.result,afterUrl:c.afterUrl}));
                const document=await network.send('DOM.getDocument',{depth:2}).catch(()=>null);
                const body=document?.root.children?.find(n=>n.nodeName==='HTML')?.children?.find(n=>n.nodeName==='BODY');
                if(body)diagnostic.document=(await network.send('DOM.getOuterHTML',{nodeId:body.nodeId})).outerHTML.slice(0,18000);
                for(const frame of event.callFrames.slice(0,4)) {
                  const local=frame.scopeChain.find(scope=>scope.type==='local');
                  const properties=local?await network.send('Runtime.getProperties',{objectId:local.object.objectId,ownProperties:true}):{result:[]};
                  const values=[];
                  for(const property of properties.result) {
                    if(!property.value?.objectId){values.push({name:property.name,value:property.value?.value});continue;}
                    const result=await network.send('Runtime.getProperties',{objectId:property.value.objectId,ownProperties:true}).catch(()=>null);
                    const fields=result?.result?.filter(p=>['tag','type','pendingProps','memoizedProps','stateNode','message'].includes(p.name))||[];
                    if(fields.length)values.push({name:property.name,fields:fields.map(p=>({name:p.name,value:p.value?.value,description:p.value?.description}))});
                  }
                  diagnostic.frames.push({function:frame.functionName,location:frame.location,values});
                }
                (report.hydrationDiagnostics??=[]).push(diagnostic);
              }
            }catch(error){(report.hydrationDiagnosticErrors??=[]).push(String(error));}finally{clearTimeout(release);await network.send('Debugger.resume').catch(()=>{});}
          });
        }
        page.setDefaultTimeout(7000);
        page.on('dialog', dialog => { report.blocked.push({ kind: 'dialog', message: dialog.message() }); void dialog.dismiss(); });
        page.on('download', download => { (report.downloads ??= []).push({page:page.url(),url:download.url(),filename:download.suggestedFilename()}); });
        page.on('pageerror', error => report.issues.push({ kind: 'javascript', page: page.url(), viewport: viewport.width, message: error.message }));
        page.on('console', msg => { if (['warning', 'error'].includes(msg.type())) report.issues.push({ kind: 'console', level: msg.type(), page: page.url(), message: msg.text().slice(0, 800) }); });
        page.on('response', response => { if (response.status() >= 400) report.issues.push({ kind: 'http-browser', page: page.url(), url: response.url(), status: response.status() }); });
        return page;
        };
        let page=await createAuditPage();
        const visitedBrowserUrls = new Set(report.pages.filter(p => p.viewport?.width === viewport.width).map(p => (p.finalUrl || p.url).replace(/\/index\.html(?=[?#]|$)/, '/').replace(/\.html(?=[?#]|$)/, '').replace(/\/(?=[?#]|$)/, '')));
        const sharedNavigation = new Map(report.pages.filter(p=>p.viewport?.width===viewport.width).flatMap(p=>(p.controls||[]).filter(c=>c.sharedKey&&c.result==='navigated').map(c=>[c.sharedKey,{page:p.url,afterUrl:c.afterUrl}])));
        report.sharedNavigationReuse = 'Identical header/footer anchor markup and destination reuse a successful click from the same project and viewport; page-specific controls are clicked separately.';
        for (const url of routes) {
          const requestedCanonical = url.replace(/\/index\.html(?=[?#]|$)/, '/').replace(/\.html(?=[?#]|$)/, '').replace(/\/(?=[?#]|$)/, '');
          if (visitedBrowserUrls.has(requestedCanonical)) continue;
          const record = { url, viewport, controls: [], images: [], links: [] };
          report.pages.push(record);
          try {
            const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
            await page.waitForTimeout(700);
            record.status = response?.status(); record.finalUrl = page.url();
            const canonical = page.url().replace(/\/index\.html(?=[?#]|$)/, '/').replace(/\.html(?=[?#]|$)/, '').replace(/\/(?=[?#]|$)/, '');
            if (visitedBrowserUrls.has(canonical)) { record.aliasOf = canonical; continue; }
            visitedBrowserUrls.add(canonical);
            record.title = await page.title();
            let body = await page.locator('body').innerText();
            if (body.trim().length < 30) {
              await page.waitForFunction(() => document.body?.innerText.trim().length > 30, undefined, {timeout:3000}).catch(() => {});
              body = await page.locator('body').innerText();
            }
            if (body.trim().length < 30) report.issues.push({ kind: 'blank-page', url, viewport });
            let metrics = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.body.scrollHeight }));
            if (metrics.scrollWidth > metrics.width + 3) {
              record.initialMetrics = metrics;
              await page.waitForTimeout(2500);
              metrics = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.body.scrollHeight }));
            }
            record.metrics = metrics;
            if (metrics.scrollWidth > metrics.width + 3) report.issues.push({ kind: 'horizontal-overflow', url, viewport, metrics });
            record.links = await page.locator('a[href]').evaluateAll(els => els.map(el => ({ text: el.textContent.trim().slice(0, 100), href: el.href })));
            for (const link of args.includes('--entry-only') || explicitPaths.length ? [] : record.links) {
              try { const u = new URL(link.href); if (u.origin === new URL(base).origin && u.pathname.startsWith(`/${project.slug}/`) && !/\.(?:pdf|png|jpg|svg|zip|webp|css|js)$/.test(u.pathname)) { u.hash = ''; routes.add(u.href); } } catch { /* protocol link */ }
            }
            record.images = await page.locator('img').evaluateAll(els => els.filter(e => e.complete && !e.naturalWidth).map(e => e.currentSrc || e.src));
            if (record.images.length) report.issues.push({ kind: 'broken-images', url, viewport, images: record.images });
            await page.screenshot({ path: path.join(output, `${project.slug}-${viewport.width}-${report.pages.length}.png`), fullPage: false, animations: 'disabled' }).catch(error => { record.screenshotError = error.message; });
            if (args.includes('--load-only')) { await save(report); continue; }
            const selector = 'button, a[href], input:not([type=hidden]), label[for], select, textarea, summary, [role=button], [role=tab]';
            const tested = new Set();
            const discoveredControls = new Map();
            record.inProgress=true;
            record.interactionInventoryVersion=2;
            record.interactionLimit=controlLimit;
            // Re-inventory after each interaction to include menus, dialogs and tabs it exposes.
            for (let step = 0; step < controlLimit; step++) {
              if(new URL(page.url()).pathname!==new URL(record.finalUrl).pathname){
                await page.goto(record.finalUrl,{waitUntil:'domcontentloaded',timeout:25000});
                await page.waitForTimeout(700);
              }
              if(step%10===0){record.currentStep=step;await save(report);}
              const controls = page.locator(selector);
              let found = false;
              const inventory = await controls.evaluateAll(els => {
                const occurrences = new Map();
                return els.map((el, index) => {
                  const modal = el.closest('[role=dialog], [aria-modal=true], dialog[open], .modal, .modal-content, .overlay, .drawer, .search-overlay, .search-layer, .cart-drawer, .mobile-menu');
                  const name = el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.textContent?.trim().slice(0, 140) || el.getAttribute('name') || '';
                  const identity = `${el.tagName}|${name}|${el.getAttribute('href')}`;
                  const occurrence = occurrences.get(identity) || 0; occurrences.set(identity, occurrence + 1);
                  const hiddenLabel = el.tagName === 'LABEL' && (el.classList.contains('sr-only') || el.classList.contains('visually-hidden'));
                  const sharedKey = el.tagName==='A' && el.closest('header,footer') && !el.getAttribute('href')?.startsWith('#') ? el.outerHTML : undefined;
                  return { index, occurrence, sharedKey, disabled:el.matches(':disabled')||el.getAttribute('aria-disabled')==='true', modal: modal?.querySelector('h1,h2,h3')?.textContent || (modal ? 'dialog' : ''), priority: modal ? (/close|închide|inchide|cancel|закрыть/i.test(name) ? 1 : 2) : 0, visible: !hiddenLabel && el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}), tag: el.tagName, type: el.getAttribute('type'), role: el.getAttribute('role'), name, href: el.getAttribute('href'), id: el.id };
                }).sort((a,b) => b.priority - a.priority);
              });
              const ordered=inventory.map(({index,visible,...meta})=>{
                const key=JSON.stringify(meta);
                if(!discoveredControls.has(key))discoveredControls.set(key,step);
                return {index,visible,meta,key,generation:discoveredControls.get(key)};
              }).sort((a,b)=>b.meta.priority-a.meta.priority || b.generation-a.generation);
              // Explore controls introduced by a view/tab before leaving it via an older menu item.
              for (const { index, visible, meta, key } of ordered) {
                if (!visible) continue;
                // Keep identity stable when a React update inserts/removes earlier controls.
                const control = await controls.nth(index).elementHandle();
                if(!control)continue;
                // A dialog can be reopened by another product. Its close control must work every time.
                if (tested.has(key) && !(meta.modal && meta.priority === 1)) continue;
                tested.add(key); found = true;
                const item = { ...meta, result: '' }; record.controls.push(item);
                if (!await control.isEnabled().catch(()=>false)) { item.result = meta.disabled ? 'disabled' : 'state-changed-before-action'; if(!meta.disabled)tested.delete(key); break; }
                if (['INPUT', 'TEXTAREA'].includes(meta.tag) && await control.getAttribute('readonly') !== null) { item.result = 'readonly-verified'; break; }
                if (meta.href && /^(?:https?:\/\/|mailto:|tel:|javascript:)/i.test(meta.href) && !meta.href.startsWith(base)) { item.result = 'external-or-protocol-manual'; break; }
                if (/delete|remove account|unsubscribe|șterge|sterge|удалить|pay now|plătește|платить/i.test(meta.name)) { item.result = 'destructive-or-payment-manual'; break; }
                if (!args.includes('--strict-clicks') && meta.sharedKey && sharedNavigation.has(meta.sharedKey)) {
                  item.result = 'shared-navigation-verified'; item.verifiedBy = sharedNavigation.get(meta.sharedKey); break;
                }
                const beforeUrl = page.url();
                const navigationMarker = await page.evaluate(() => JSON.stringify([...document.querySelectorAll('h1,header a[aria-current="page"]')].map(el=>el.textContent)));
                const writesBefore = report.blocked.length;
                const before = await page.locator('body').innerText();
                let openedPopup=null;
                try {
                  const opensSeparate=meta.tag==='A' && await control.getAttribute('target')==='_blank';
                  const popupPromise=opensSeparate?page.waitForEvent('popup',{timeout:15000}).then(p=>openedPopup=p).catch(()=>null):null;
                  const closingHandle=meta.modal && meta.priority===1 ? control : null;
                  if (meta.tag === 'A' && /skip|sari la/i.test(meta.name)) await control.focus();
                  if (meta.tag === 'SELECT') {
                    const choices = await control.evaluate(el => [...el.querySelectorAll('option')].filter(e => !e.disabled && e.value).map(e => e.value));
                    if (choices.length) await control.selectOption(choices.at(-1));
                  } else if (['INPUT', 'TEXTAREA'].includes(meta.tag)) {
                    if (['checkbox', 'radio'].includes(meta.type)) {
                      const label = meta.id ? page.locator(`label[for=${JSON.stringify(meta.id)}]`).first() : null;
                      if (label && await label.isVisible() && !await control.isChecked()) await label.click();
                      else await control.check();
                    }
                    else if (meta.type === 'file') { item.result = 'file-upload-manual'; break; }
                    else if (['range', 'color', 'submit', 'button'].includes(meta.type)) await control.click();
                    else await control.fill(meta.type === 'email' ? 'qa@example.invalid' : meta.type === 'tel' ? '000000000' : meta.type === 'password' ? 'TestQA-only-2026!' : meta.type === 'number' ? '2' : meta.type === 'date' ? '2026-12-15' : meta.type === 'time' ? '12:00' : 'Test QA');
                  } else {
                    const backdropPosition=await control.evaluate(el=>{
                      if(!/backdrop/.test(el.className))return null;
                      const b=el.getBoundingClientRect();
                      for(const y of [innerHeight-12,12,innerHeight/2])for(const x of [12,innerWidth-12,innerWidth/2])if(document.elementFromPoint(x,y)===el)return {x:x-b.left,y:y-b.top};
                      return null;
                    });
                    await control.click({timeout:meta.tag === 'A' ? 15000 : 7000,noWaitAfter:opensSeparate,...(backdropPosition?{position:backdropPosition}:{})});
                  }
                  if (meta.tag === 'A' && meta.href && !meta.href.startsWith('#')) {
                    const destination=new URL(meta.href,beforeUrl);
                    if(destination.href!==beforeUrl&&!opensSeparate) await page.waitForURL(value=>value.href!==beforeUrl,{timeout:5000}).catch(()=>{});
                    await page.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => {});
                  }
                  if(closingHandle)await closingHandle.waitForElementState('hidden',{timeout:2000}).catch(()=>{});
                  await page.waitForTimeout(100);
                  const afterUrl = page.url();
                  item.result = afterUrl !== beforeUrl ? 'navigated' : (await page.locator('body').innerText()) !== before ? 'content-changed' : 'clicked-review-outcome';
                  item.afterUrl = afterUrl;
                  if(opensSeparate){
                    const popup=await popupPromise;
                    if(!popup)throw new Error('The link did not open its new tab');
                    await popup.waitForLoadState('domcontentloaded',{timeout:15000});
                    item.popup={url:popup.url(),title:await popup.title(),bodyLength:(await popup.locator('body').innerText()).trim().length};
                    item.popup.status=(await request(popup.url())).status;
                    if(item.popup.status!==200||item.popup.bodyLength<30)throw new Error(`New tab failed: HTTP ${item.popup.status}, ${item.popup.bodyLength} text characters`);
                    item.result='popup-opened-and-verified';
                  }
                  if(report.blocked.slice(writesBefore).some(x=>x.kind==='network-write')) item.result='network-write-manual';
                  else if(afterUrl.startsWith('chrome-error:')) throw new Error('Navigation reached a browser error document');
                  if(meta.sharedKey && item.result==='navigated') sharedNavigation.set(meta.sharedKey,{page:url,afterUrl});
                  if (['INPUT', 'TEXTAREA'].includes(meta.tag) && !['checkbox', 'radio', 'range', 'color', 'submit', 'button', 'file'].includes(meta.type)) {
                    item.inputValue = await control.inputValue().catch(() => null);
                    const keepForSubmit = await control.evaluate(el=>!!el.form?.querySelector('input[type=email],input[type=tel],textarea')).catch(()=>false);
                    if (!keepForSubmit) await control.fill('').catch(() => {});
                  }
                  if (afterUrl !== beforeUrl && !afterUrl.startsWith(beforeUrl.split('#')[0] + '#')) {
                    await page.goBack({ waitUntil: 'domcontentloaded', timeout: 10000 });
                    item.backUrl=page.url();
                    item.backContentMatches=await page.waitForFunction(marker=>JSON.stringify([...document.querySelectorAll('h1,header a[aria-current="page"]')].map(el=>el.textContent))===marker,navigationMarker,{timeout:3000}).then(()=>true).catch(()=>false);
                    // A fresh page isolates the next click from outstanding router
                    // work; the real Back result above remains in the audit trail.
                    await page.close();
                    page=await createAuditPage();
                    await page.goto(beforeUrl,{waitUntil:'domcontentloaded',timeout:25000});
                    await page.waitForTimeout(700);
                  }
                } catch (error) {
                  item.result = report.blocked.slice(writesBefore).some(x=>x.kind==='network-write') ? 'network-write-manual' : 'interaction-error'; item.error = error.message.slice(0, 3000);
                  await page.keyboard.press('Escape').catch(() => {});
                  await page.goto(beforeUrl, {waitUntil:'domcontentloaded', timeout:25000}).catch(() => {});
                  await page.reload({waitUntil:'domcontentloaded',timeout:25000}).catch(()=>{});
                } finally {await openedPopup?.close().catch(()=>{});}
                break;
              }
              if (!found) {
                if(!record.finalInventoryWait){record.finalInventoryWait=true;await page.waitForTimeout(1000);continue;}
                break;
              }
              record.finalInventoryWait=false;
              if (step === controlLimit-1) record.limitReached = true;
            }
            record.inProgress=false;
          } catch (error) {
            record.error = error.message;
            report.issues.push({ kind: 'navigation-error', url, viewport, message: error.message });
            if(/Page crashed|Target page.*closed/i.test(error.message)){
              await page.close().catch(()=>{});page=await createAuditPage();
            }
          }
          await save(report);
        }
        await context.close();
      }
    }
  } catch (error) { report.issues.push({ kind: 'project-error', message: error.message }); }
  report.finished = new Date().toISOString();
  await save(report);
  console.log(`DONE ${project.slug}: ${report.pages.length} pages, ${report.issues.length} findings`);
}
await browser?.close();
console.log(`Reports: ${output}`);
