import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { normalizeNextExport } from '../scripts/normalize-next-export.mjs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('sync preserves a working showcase when a standalone Next build has the wrong base path', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'showcase-base-'));
  try {
    const source=path.join(root,'source');
    for(const dir of ['showcase-projects','public/demo','source/.next','source/out/_next/static/build-qa']) await mkdir(path.join(root,dir),{recursive:true});
    await writeFile(path.join(root,'showcase-projects/registry.json'),JSON.stringify([{id:1,slug:'demo',source,outputs:['out']}]));
    await writeFile(path.join(source,'.next/BUILD_ID'),'build-qa');
    await writeFile(path.join(source,'.next/required-server-files.json'),JSON.stringify({config:{basePath:''}}));
    await writeFile(path.join(source,'out/index.html'),'<main>Wrong export</main>');
    await writeFile(path.join(root,'public/demo/index.html'),'working showcase');
    const result=spawnSync(process.execPath,[fileURLToPath(new URL('../scripts/sync-showcase.mjs',import.meta.url)),'demo','--strict'],{cwd:root,encoding:'utf8'});
    assert.equal(result.status,1,result.stderr);
    assert.match(result.stdout,/base-path-mismatch/);
    assert.equal(await readFile(path.join(root,'public/demo/index.html'),'utf8'),'working showcase');
  } finally {
    assert.ok(root.startsWith(path.join(os.tmpdir(),'showcase-base-')));
    await rm(root,{recursive:true,force:true});
  }
});

test('Windows nested segment payloads become the exact dotted browser URL without losing originals', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'showcase-rsc-'));
  try {
    const nested = path.join(root, 'ro', '__next.$d$locale', 'catalog');
    await mkdir(nested, {recursive:true});
    await writeFile(path.join(nested, '__PAGE__.txt'), 'catalog-payload');
    await writeFile(path.join(root, 'ro', '__next._tree.txt'), 'tree');
    assert.equal(await normalizeNextExport(root), 1);
    assert.equal(await readFile(path.join(root, 'ro', '__next.$d$locale.catalog.__PAGE__.txt'), 'utf8'), 'catalog-payload');
    assert.equal(await readFile(path.join(nested, '__PAGE__.txt'), 'utf8'), 'catalog-payload');
    assert.equal(await readFile(path.join(root, 'ro', '__next._tree.txt'), 'utf8'), 'tree');
    await normalizeNextExport(root);
    assert.equal(await readFile(path.join(root, 'ro', '__next.$d$locale.catalog.__PAGE__.txt'), 'utf8'), 'catalog-payload');
  } finally {
    // mkdtemp returns an absolute task-specific directory under the OS temp root.
    assert.ok(root.startsWith(path.join(os.tmpdir(), 'showcase-rsc-')));
    await rm(root, {recursive:true, force:true});
  }
});
