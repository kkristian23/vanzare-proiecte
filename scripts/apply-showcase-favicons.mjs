import { readFile } from "node:fs/promises";
import path from "node:path";
import { ensureShowcaseFavicon, hiddenShowcaseSlugs } from "./showcase-favicons.mjs";

const root = process.cwd();
const registry = JSON.parse(await readFile(path.join(root, "showcase-projects", "registry.json"), "utf8"));
let projects = 0;
let htmlFiles = 0;

for (const project of registry) {
  if (hiddenShowcaseSlugs.has(project.slug) || project.disabled) continue;
  const result = await ensureShowcaseFavicon(path.join(root, "public", project.slug), project);
  projects += 1;
  htmlFiles += result.updated;
  console.log(`✓ ${project.slug}: ${result.href} (${result.updated} pagini)`);
}

console.log(`Favicons aplicate: ${projects} proiecte, ${htmlFiles} pagini HTML actualizate.`);
