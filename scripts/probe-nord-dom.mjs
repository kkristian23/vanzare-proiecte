import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});
  await context.route('**/*',async route=>{
    if(!['GET','HEAD','OPTIONS'].includes(route.request().method()))return route.abort();
    if(route.request().url().includes('/4bd1b696-')){
      const response=await route.fetch();let body=await response.text();
      body=body.replace('function rD(e){','function rD(e){window.__hydrationDebug={type:e.type,next:rN?.outerHTML,nextText:rN?.textContent,parent:rP?.type,body:document.body.innerHTML,stack:new Error().stack,child:e.child?{tag:e.child.tag,type:String(e.child.type),props:Object.keys(e.child.pendingProps||{}),state:String(e.child.memoizedState),childTag:e.child.child?.tag}:null};');
      return route.fulfill({response,body});
    }
    return route.continue();
  });
  const paths=['ru/product/lina-chair','ru/product/birch-toy-chest','ro/product/niva-shelf'];
  for(let i=0;i<60;i++){
    const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:4010/nord-and-oak/'+paths[i%paths.length]);await page.waitForTimeout(300);
    const diagnostic=await page.evaluate(()=>window.__hydrationDebug);
    results.push({i,path:paths[i%paths.length],errors,diagnostic});
    await page.close();
    if(diagnostic){console.log(JSON.stringify({...diagnostic,body:diagnostic.body?.slice(0,500)}));break;}
    if(i%10===0)console.log('loads',i+1);
  }
}finally{await browser.close();await writeFile('reports/showcase-audit/nord-dom.json',JSON.stringify(results,null,2));}
