import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
const base = process.env.AUDIT_BASE ?? 'http://127.0.0.1:4010';
const registry = JSON.parse(await readFile('showcase-projects/registry.json','utf8'));
for (const project of registry.filter(p=>p.id!==24&&!p.disabled)) {
  let previous;
  try { previous=JSON.parse(await readFile(`reports/showcase-audit/pages/${project.slug}.browser.json`,'utf8')); } catch { continue; }
  const paths=[...new Set(previous.issues.filter(i=>i.kind!=='console').flatMap(i=>{
    try {const url=new URL(i.page||i.url);const prefix=`/${project.slug}/`;return url.pathname.startsWith(prefix)?[url.pathname.slice(prefix.length)+url.search]:[];}catch{return [];}
  }))];
  if(!paths.length)continue;
  console.log(`Recheck ${project.slug}: ${paths.length} paths`);
  await new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,['scripts/audit-showcase.mjs','--phase=browser','--load-only',`--base=${base}`,`--only=${project.slug}`,`--paths=${paths.join(',')}`,'--output=reports/showcase-audit/rechecks'],{stdio:'inherit'});
    child.once('error',reject);child.once('exit',code=>code===0?resolve():reject(new Error(`Recheck exited ${code}`)));
  });
}
