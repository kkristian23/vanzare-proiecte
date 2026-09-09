import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
test('audit resume retries interrupted pages even when an earlier run has a finish timestamp',{timeout:60000},async()=>{
  const directory=await mkdtemp(path.join(os.tmpdir(),'showcase-resume-'));
  const url='http://127.0.0.1:4010/nord-and-oak/ro/contact';
  const original={slug:'nord-and-oak',phase:'browser',scope:'all-pages-load-only',strictClicks:false,controlLimit:600,explicitPaths:['ro/contact'],started:'2026-01-01T00:00:00Z',finished:'2026-01-01T00:01:00Z',issues:[],blocked:[],pages:[
    {url,finalUrl:url,viewport:{width:1440,height:900},controls:[],preservedSuccess:true},
    {url,viewport:{width:390,height:844},controls:[],error:'Page crashed'},
  ]};
  try{
    await writeFile(path.join(directory,'nord-and-oak.browser.json'),JSON.stringify(original));
    const result=await new Promise(resolve=>{
      const child=spawn(process.execPath,['scripts/audit-showcase.mjs','--phase=browser','--base=http://127.0.0.1:4010','--only=nord-and-oak','--paths=ro/contact','--load-only','--resume',`--output=${directory}`],{windowsHide:true});
      let output='';child.stdout.on('data',chunk=>output+=chunk);child.stderr.on('data',chunk=>output+=chunk);
      child.once('error',error=>resolve({code:1,output:error.message}));child.once('close',code=>resolve({code,output}));
    });
    assert.equal(result.code,0,result.output);
    const report=JSON.parse(await readFile(path.join(directory,'nord-and-oak.browser.json'),'utf8'));
    assert.equal(report.pages.length,2);assert.equal(report.pages[0].preservedSuccess,true);
    assert.equal(report.pages[1].viewport.width,390);assert.equal(report.pages[1].error,undefined);
    assert.equal(report.pages[1].status,200);assert.deepEqual(report.issues,[]);
    assert.notEqual(report.finished,original.finished);
  }finally{
    assert.equal(path.dirname(path.resolve(directory)),path.resolve(os.tmpdir()));
    assert.ok(path.basename(directory).startsWith('showcase-resume-'));
    await rm(directory,{recursive:true,force:true});
  }
});
