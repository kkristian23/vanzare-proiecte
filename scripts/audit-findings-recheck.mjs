import {readFile,readdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
const only=process.argv.find(x=>x.startsWith('--only='))?.slice(7).split(',')||[];
const directory='reports/showcase-audit';
for(const file of (await readdir(`${directory}/final`)).filter(f=>f.endsWith('.browser.json'))){
  const original=JSON.parse(await readFile(`${directory}/final/${file}`,'utf8'));
  if(only.length&&!only.includes(original.slug))continue;
  let previous;try{previous=JSON.parse(await readFile(`${directory}/rechecks/${file}`,'utf8'));}catch{}
  const prefix=`/${original.slug}/`;
  const paths=[...new Set([...original.issues.map(i=>i.page||i.url),...(previous?.pages||[]).map(p=>p.url)].flatMap(value=>{
    try{const u=new URL(value);return u.pathname.startsWith(prefix)?[(u.pathname.slice(prefix.length)||'/')+u.search]:[];}catch{return [];}
  }))];
  if(!paths.length)continue;
  const code=await new Promise(resolve=>{
    const child=spawn(process.execPath,['scripts/audit-showcase.mjs','--phase=browser','--base=http://127.0.0.1:4010',`--only=${original.slug}`,'--load-only',`--paths=${paths.join(',')}`,`--output=${directory}/rechecks`],{stdio:'inherit',windowsHide:true});
    child.once('error',error=>{console.error(error.message);resolve(1);});child.once('close',resolve);
  });
  if(code)process.exitCode=code;
}
