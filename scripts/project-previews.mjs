import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export async function writeProjectPreview(directory) {
  const slug = path.basename(directory);
  const target = `/${slug}/index.html?source=catalog`;
  const preview = `<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Demo ${slug}</title></head><body><main><p>Demo-ul interactiv se încarcă doar la cerere.</p><a href="${target}">Deschide proiectul</a></main></body></html>`;
  await writeFile(path.join(directory, "preview.html"), preview, "utf8");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const root = path.resolve(import.meta.dirname, "..");
  const registry = JSON.parse(await readFile(path.join(root, "showcase-projects/registry.json"), "utf8"));
  const projects = registry.filter(project => project.id >= 35 && !project.disabled);
  for (const project of projects) await writeProjectPreview(path.join(root, "public", project.slug));
  console.log(`Generated ${projects.length} lightweight on-demand preview entrypoints.`);
}
