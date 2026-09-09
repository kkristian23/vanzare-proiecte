import test from 'node:test';
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const base=process.env.AUDIT_BASE||'http://127.0.0.1:4010';
test('repaired source controls',{timeout:180000},async t=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    for(const width of [1440,390])await t.test(`Flow CRM creates records, filters, exports and saves settings at ${width}px`,async()=>{
      const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',acceptDownloads:false});
      const page=await context.newPage();const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      const navigate=async name=>{if(width===390&&!await page.locator('.rail').isVisible())await page.locator('.topbar .mobile').click();await page.locator('.rail').getByRole('button',{name,exact:true}).click();};
      try{
        await page.goto(`${base}/flow-crm/`);
        await page.getByRole('button',{name:'EN',exact:true}).click();
        await navigate('Pipeline');
        await page.getByRole('button',{name:'Add opportunity',exact:true}).click();
        await page.getByRole('dialog').getByLabel('Name / title').fill('QA Opportunity');
        await page.getByRole('dialog').getByLabel('Value',{exact:true}).fill('42');
        await page.getByRole('button',{name:'Save locally',exact:true}).click();
        await expect(page.locator('.deal-card').filter({hasText:'QA Opportunity'})).toBeVisible();
        await page.locator('.deal-card').filter({hasText:'QA Opportunity'}).click();
        await expect(page.locator('.kanban > section').filter({has:page.locator('.deal-card').filter({hasText:'QA Opportunity'})}).locator('header')).toContainText('Proposal');
        await navigate('Contacts');
        await page.getByRole('button',{name:'Add contact',exact:true}).click();
        await page.getByRole('dialog').getByLabel('Name / title').fill('QA Contact');
        await page.getByRole('dialog').getByLabel('Email',{exact:true}).fill('qa@example.invalid');
        await page.getByRole('button',{name:'Save locally',exact:true}).click();
        await page.getByPlaceholder('Search contacts…').fill('QA Contact');
        await expect(page.locator('tbody tr')).toHaveCount(1);
        await page.getByRole('combobox',{name:'All statuses'}).selectOption('Customer');
        await expect(page.locator('tbody tr')).toHaveCount(0);
        await page.getByRole('combobox',{name:'All statuses'}).selectOption('Lead');
        await expect(page.locator('tbody tr')).toHaveCount(1);
        await page.getByRole('checkbox',{name:'Select all',exact:true}).check();
        await expect(page.locator('tbody input[type=checkbox]')).toBeChecked();
        const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export CSV'}).click();
        assert.equal((await download).suggestedFilename(),'flow-contacts.csv');
        await navigate('Settings');
        await page.getByLabel('Organization name',{exact:true}).fill('QA Workspace');
        await page.getByRole('button',{name:'Save changes',exact:true}).click();
        await page.reload();await navigate('Settings');
        await expect(page.getByLabel('Organization name',{exact:true})).toHaveValue('QA Workspace');
        assert.deepEqual(errors,[]);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));
      }finally{await context.close();}
    });
    for(const width of [1440,390])await t.test(`Forma Living opens a shared configuration and prepares its quote at ${width}px`,async()=>{
      const context=await browser.newContext({viewport:{width,height:900}});
      const page=await context.newPage();
      try{
        const config={i:['m1','m3'],c:'#2457ff',m:'Loop'};
        const url=new URL(`${base}/forma-living/en/configurator-canapea`);url.searchParams.set('c',JSON.stringify(config));
        await page.goto(url.href);
        await expect(page.locator('aside select')).toHaveValue('Loop');
        await expect(page.locator('aside')).toContainText('Ottoman 3');
        const quote=new URL(await page.getByRole('link',{name:'Request a quote',exact:true}).getAttribute('href'));
        assert.equal(quote.protocol,'mailto:');
        assert.ok(quote.searchParams.get('body').includes('Ottoman 3'));
        await page.evaluate(()=>{window.__copiedConfig='';navigator.clipboard.writeText=async value=>{window.__copiedConfig=value;};});
        await page.getByRole('button',{name:'Copy link',exact:true}).click();
        const shared=await page.evaluate(()=>window.__copiedConfig);
        assert.deepEqual(JSON.parse(new URL(shared).searchParams.get('c')),config);
        await context.clearCookies();await page.evaluate(()=>localStorage.clear());
        await page.goto(shared);await expect(page.locator('aside')).toContainText('Ottoman 3');
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));
      }finally{await context.close();}
    });
  }finally{await browser.close();}
});
