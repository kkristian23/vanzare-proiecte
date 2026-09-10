import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const catalogRoot = process.cwd();
const collectionRoot = "D:\\proiecte-front-end";
const folders = (await readdir(collectionRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{2}-/.test(entry.name))
  .map((entry) => entry.name)
  .sort();

if (folders.length !== 32) throw new Error(`Sunt necesare 32 proiecte, găsite: ${folders.length}`);

const configs = [];
for (const [index, folder] of folders.entries()) {
  const configSource = await readFile(path.join(collectionRoot, folder, "site-config.ts"), "utf8");
  const jsonText = configSource.match(/export const siteConfig = ([\s\S]+) as const;/)?.[1];
  if (!jsonText) throw new Error(`Config invalid: ${folder}`);
  configs.push({ ...JSON.parse(jsonText), folder, id: 66 - index });

  const nextConfig = `import type { NextConfig } from "next";\n\nconst basePath = process.env.SHOWCASE_BASE_PATH ?? "/${folder}";\nconst nextConfig: NextConfig = {\n  output: "export",\n  reactStrictMode: true,\n  basePath,\n  assetPrefix: basePath,\n  images: { unoptimized: true },\n};\nexport default nextConfig;\n`;
  await writeFile(path.join(collectionRoot, folder, "next.config.ts"), nextConfig, "utf8");
}

const stack = ["Next.js 15", "React 19", "TypeScript 5.9", "Tailwind CSS 3", "Firebase", "Lucide React", "Recharts", "React Hook Form", "Zod"];
const priceByDomain = { events: 650, medical: 950, crm: 1200, auto: 850, hotel: 900, market: 1000, education: 750, realestate: 900, food: 700, utility: 1100 };
const projectEntries = configs.map((p) => `  {\n    id: ${p.id},\n    title: ${JSON.stringify(p.name.toUpperCase())},\n    type: ${JSON.stringify(p.category)},\n    price: ${priceByDomain[p.domain] ?? 800},\n    tone: ${JSON.stringify(p.folder.replace(/^\d{2}-/, ""))},\n    desc: ${JSON.stringify(p.description)},\n    stack: ${JSON.stringify(stack)},\n  },`).join("\n");
const slugEntries = configs.map((p) => `  ${p.id}: ${JSON.stringify(p.folder)},`).join("\n");
const pathEntries = configs.map((p) => `  ${p.id}: ${JSON.stringify(`/${p.folder}/`)},`).join("\n");

const catalogPath = path.join(catalogRoot, "app", "lib", "project-catalog.ts");
let catalog = await readFile(catalogPath, "utf8");
if (!catalog.includes('title: "EVENTORA"')) {
  for (const [declaration, entries] of [[/export const projectCatalog: Project\[\] = \[\r?\n/, projectEntries], [/export const projectSlugs: Record<number, string> = \{\r?\n/, slugEntries], [/export const projectPaths: Record<number, string> = \{\r?\n/, pathEntries]]) {
    if (!declaration.test(catalog)) throw new Error(`Catalog declaration missing: ${declaration}`);
    catalog = catalog.replace(declaration, (match) => `${match}${entries}\n`);
  }
}
await writeFile(catalogPath, catalog, "utf8");

const pagePath = path.join(catalogRoot, "app", "home-client.tsx");
let page = await readFile(pagePath, "utf8");
const oldDetail = `  const selectedDetail = selected\n    ? locale === "ro"\n      ? projectDetails[selected.id]\n      : localizedDetail(locale, selected)\n    : null;`;
const newDetail = `  const selectedDetail = selected\n    ? locale === "ro"\n      ? projectDetails[selected.id] ?? {\n          summary: selected.desc,\n          sections: [\n            { title: "Produsul", items: ["Interfață completă și responsive", "Experiență demonstrativă pregătită pentru personalizare", "Conținut și structură originale"] },\n            { title: "Funcționalități", items: ["Căutare, filtrare și favorite", "Formulare validate și notificări", "Temă luminoasă și întunecată"] },\n            { title: "Tehnologii", items: selected.stack },\n            { title: "Ce primește cumpărătorul", items: ["Cod sursă complet editabil", "Build static pentru prezentare", "Configurație Firebase opțională"] },\n          ],\n        }\n      : localizedDetail(locale, selected)\n    : null;`;
if (page.includes(oldDetail)) page = page.replace(oldDetail, newDetail);
await writeFile(pagePath, page, "utf8");

const registryPath = path.join(catalogRoot, "showcase-projects", "registry.json");
const registry = JSON.parse(await readFile(registryPath, "utf8"));
const known = new Set(registry.map((entry) => entry.slug));
for (const project of configs) {
  if (!known.has(project.folder)) registry.push({
    id: project.id,
    slug: project.folder,
    source: path.join(collectionRoot, project.folder),
    outputs: ["out"],
    buildArgs: ["run", "build"],
  });
}
await writeFile(registryPath, JSON.stringify(registry, null, 2) + "\n", "utf8");

console.log(`Integrated ${configs.length} projects into catalog data and registry.`);
