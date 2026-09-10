import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const archiNavigationMarker = '/* mono-archi-close-on-route */';

// ArchiContract's upstream Header keeps its mobile menu state across client
// navigation. Normalize only the copied export: external source repositories
// remain untouched, and a later showcase sync reapplies this compatibility fix.
export function normalizeArchiNavigation(source) {
  const start = source.indexOf('"Header",0,function(');
  if (start === -1 || !source.includes('id:"mobile-nav"') || source.includes(archiNavigationMarker)) return source;
  const header = source.slice(start);
  const state = /let\[[\w$]+,([\w$]+)\]=\(0,([\w$]+)\.useState\)\(!1\),([\w$]+)=\(0,[\w$]+\.usePathname\)\(\)/.exec(header);
  if (!state || state.index > 150) throw new Error('ArchiContract Header changed: review the mobile navigation export normalizer.');
  const [, setOpen, react, pathname] = state;
  const existingEffect = `return(0,${react}.useEffect)`;
  const effectIndex = header.indexOf(existingEffect);
  if (effectIndex < 0 || effectIndex > 500) throw new Error('ArchiContract Header effect changed: review the mobile navigation export normalizer.');
  const patchedHeader = header.replace(existingEffect, `return${archiNavigationMarker}(0,${react}.useEffect)(()=>{${setOpen}(!1)},[${pathname}]),(0,${react}.useEffect)`);
  return source.slice(0, start) + patchedHeader;
}

export async function normalizeShowcaseInteractions(directory, slug) {
  if (slug !== 'archicontract') return 0;
  let updated = 0;
  async function walk(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const filename = path.join(folder, entry.name);
      if (entry.isDirectory()) await walk(filename);
      else if (entry.name.endsWith('.js')) {
        const source = await readFile(filename, 'utf8');
        const normalized = normalizeArchiNavigation(source);
        if (normalized !== source) { await writeFile(filename, normalized, 'utf8'); updated++; }
      }
    }
  }
  await walk(path.join(directory, '_next', 'static', 'chunks'));
  return updated;
}
