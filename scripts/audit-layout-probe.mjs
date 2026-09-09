import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const relative=process.argv[2];if(!relative)throw new Error('Pass a project/path');
const browser=await chromium.launch({channel:'chrome',headless:true});
try{const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4010/'+relative);await page.waitForTimeout(2000);
const overflow=await page.locator('body *').evaluateAll(els=>els.flatMap(el=>{const box=el.getBoundingClientRect(),style=getComputedStyle(el);return box.width>0&&(box.right>innerWidth+3||box.left< -3)&&style.visibility!=='hidden'?[{tag:el.tagName,class:el.className,text:el.textContent?.slice(0,100),left:box.left,right:box.right,width:box.width,whiteSpace:style.whiteSpace,minWidth:style.minWidth,fontSize:style.fontSize}]:[];}));
console.log(JSON.stringify(overflow.slice(-35),null,2));await writeFile('reports/showcase-audit/layout-probe.json',JSON.stringify({relative,overflow},null,2));await page.screenshot({path:'reports/showcase-audit/layout-probe.png',fullPage:true});
}finally{await browser.close();}
