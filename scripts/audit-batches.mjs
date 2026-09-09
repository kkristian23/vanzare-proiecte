import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';

const args=process.argv.slice(2);
const option=(name,fallback)=>args.find(x=>x.startsWith(`--${name}=`))?.slice(name.length+3)??fallback;
const selected=option('only','').split(',').filter(Boolean);
const workers=Math.max(1,Math.min(4,Number(option('workers','2'))||2));
const output=path.resolve(option('output','reports/showcase-audit/final'));
const registry=JSON.parse(await readFile('showcase-projects/registry.json','utf8')).filter(p=>p.id!==24&&!p.disabled);
const slugs=selected.length?[...new Set(selected)]:registry.map(p=>p.slug);
for(const slug of slugs)if(!registry.some(p=>p.slug===slug))throw new Error(`Unknown project: ${slug}`);
const run={started:new Date().toISOString(),workers,jobs:slugs.map(slug=>({slug,status:'queued'}))};
await mkdir(output,{recursive:true});
let writes=Promise.resolve();
const persist=()=>{const snapshot=JSON.stringify(run,null,2);writes=writes.then(()=>writeFile(path.join(output,'batch-run.json'),snapshot));return writes;};
await persist();
let next=0;
async function worker(){
  while(next<run.jobs.length){
    const job=run.jobs[next++];job.status='running';job.started=new Date().toISOString();
    const forwarded=args.filter(arg=>arg!=='--resume'&&!/^--(?:only|workers|output)=/.test(arg));
    const command=['scripts/audit-showcase.mjs','--phase=browser','--base=http://127.0.0.1:4010',`--output=${output}`,`--only=${job.slug}`,...forwarded];
    if(args.includes('--resume'))command.push('--resume');
    await new Promise(resolve=>{
      const child=spawn(process.execPath,command,{stdio:'inherit',windowsHide:true});job.pid=child.pid;void persist();
      child.once('error',error=>{job.error=error.message;job.status='process-failed';});
      child.once('close',code=>{job.exitCode=code;job.status=code===0?'process-completed':'process-failed';job.finished=new Date().toISOString();resolve();});
    });
    await persist();
  }
}
await Promise.all(Array.from({length:Math.min(workers,slugs.length)},worker));
run.finished=new Date().toISOString();await persist();
if(run.jobs.some(job=>job.status==='process-failed'))process.exitCode=1;
console.log(`Batch processes finished: ${run.jobs.length}. Inspect the project reports for findings and coverage.`);
