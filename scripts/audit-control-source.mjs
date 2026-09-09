import ts from 'typescript';
import {readFile,readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const registry=JSON.parse(await readFile('showcase-projects/registry.json','utf8')).filter(p=>p.id!==24);
const findings=[];
const skipped=new Set(['node_modules','public','out','dist','build','coverage','graphify-out','reports','test-results','playwright-report']);
async function walk(dir) {
  const files=[];
  for(const entry of await readdir(dir,{withFileTypes:true}).catch(()=>[])) {
    if(entry.name.startsWith('.')||skipped.has(entry.name)||entry.isSymbolicLink())continue;
    const file=path.join(dir,entry.name);
    if(entry.isDirectory())files.push(...await walk(file));
    else if(/\.[jt]sx$/.test(entry.name)&&!/(?:test|spec)\.[jt]sx$/.test(entry.name))files.push(file);
  }
  return files;
}
for(const project of registry) {
  for(const file of await walk(project.source)) {
    const source=await readFile(file,'utf8');
    const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    function visit(node) {
      if(ts.isJsxOpeningElement(node)||ts.isJsxSelfClosingElement(node)) {
        const tag=node.tagName.getText(ast);
        if(tag==='button') {
          const attrs=node.attributes.properties;
          const has=name=>attrs.some(a=>a.name?.getText(ast)===name);
          const handler=attrs.find(a=>a.name?.getText(ast)==='onClick')?.initializer;
          const expression=handler&&ts.isJsxExpression(handler)?handler.expression:null;
          if(expression&&(ts.isArrowFunction(expression)||ts.isFunctionExpression(expression))&&ts.isBlock(expression.body)&&expression.body.statements.length===0){
            findings.push({slug:project.slug,file,line:ast.getLineAndCharacterOfPosition(node.getStart()).line+1,reason:'Empty click handler',source:node.parent.getText(ast).slice(0,500)});
          }
          let delegated=false,inForm=false;
          for(let parent=node.parent;parent;parent=parent.parent) {
            if(ts.isJsxElement(parent)) {
              const opening=parent.openingElement;
              if(opening.tagName.getText(ast)==='form')inForm=true;
              if(opening.attributes.properties.some(a=>a.name?.getText(ast)==='onClick'))delegated=true;
            }
          }
          const buttonType=attrs.find(a=>a.name?.getText(ast)==='type')?.initializer?.getText(ast);
          if(!delegated&&!has('onClick')&&!has('disabled')&&!attrs.some(ts.isJsxSpreadAttribute)&&(!inForm||buttonType==='"button"'||buttonType==="'button'")) {
            findings.push({slug:project.slug,file,line:ast.getLineAndCharacterOfPosition(node.getStart()).line+1,source:node.parent.getText(ast).slice(0,500)});
          }
        }
      }
      ts.forEachChild(node,visit);
    }
    visit(ast);
  }
}
await writeFile('reports/showcase-audit/control-source-review.json',JSON.stringify({generated:new Date().toISOString(),note:'Candidates for review, not proven defects. Event delegation and reusable component contracts require inspection.',findings},null,2));
console.log(`${findings.length} buttons require source review`);
console.log(findings.map(f=>`${f.slug}: ${f.file}:${f.line}`).join('\n'));
