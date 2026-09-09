import { cp, readdir } from 'node:fs/promises';
import path from 'node:path';

// Windows builds can emit segment payloads as nested directories because the
// exporter replaces forward slashes only. The browser requests dotted names.
export async function normalizeNextExport(directory) {
  let copied = 0;
  async function flatten(source, destination, parts) {
    for (const entry of await readdir(source, { withFileTypes: true })) {
      const next = path.join(source, entry.name);
      if (entry.isDirectory()) await flatten(next, destination, [...parts, entry.name]);
      else if (entry.name.endsWith('.txt')) {
        await cp(next, path.join(destination, [...parts, entry.name].join('.')));
        copied++;
      }
    }
  }
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const child = path.join(directory, entry.name);
    if (entry.name.startsWith('__next.')) await flatten(child, directory, [entry.name]);
    else if (entry.name !== '_next') copied += await normalizeNextExport(child);
  }
  return copied;
}
