import { access, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const locales = ["ro", "ru", "en"];
const registry = JSON.parse(await (await import("node:fs/promises")).readFile("showcase-projects/registry.json", "utf8"));
const projects = registry.filter((project) => project.id !== 24);

async function htmlCount(directory) {
  try { await access(directory); } catch { return 0; }
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (["_next", "assets", "images", "fonts"].includes(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) count += await htmlCount(target);
    else if (entry.isFile() && entry.name.endsWith(".html")) count += 1;
  }
  return count;
}

const entries = await Promise.all(projects.map(async (project) => {
  const root = path.join("public", project.slug);
  const pages = Object.fromEntries(await Promise.all(locales.map(async (locale) => [locale, await htmlCount(path.join(root, locale))])));
  let selectorLocales = [];
  try {
    const html = await readFile(path.join(root, "index.html"), "utf8");
    const marker = html.match(/data-locales=["']([^"']+)["']/i)?.[1] ?? "";
    selectorLocales = marker.split(",").map((locale) => locale.trim()).filter(Boolean);
  } catch {
    selectorLocales = [];
  }
  const hasLocalizedRoutes = locales.every((locale) => pages[locale] > 0);
  const hasLocalizedSelector = locales.every((locale) => selectorLocales.includes(locale));
  return {
    id: project.id,
    slug: project.slug,
    pages,
    selectorLocales,
    status: hasLocalizedRoutes ? "trilingual-export" : hasLocalizedSelector ? "trilingual-selector" : "localization-not-published",
  };
}));

const report = {
  generated: new Date().toISOString(),
  totalProjects: entries.length,
  trilingualProjects: entries.filter((entry) => entry.status.startsWith("trilingual-")).length,
  missingLocalization: entries.filter((entry) => !entry.status.startsWith("trilingual-")),
  entries,
};

await writeFile("reports/showcase-audit/localization-inventory.json", JSON.stringify(report, null, 2));
console.log(`Localizare exporturi: ${report.trilingualProjects}/${report.totalProjects} proiecte au RO/RU/EN prin rute sau selector validat.`);
for (const entry of report.missingLocalization) console.error(`- ${entry.slug}: rute RO ${entry.pages.ro}, RU ${entry.pages.ru}, EN ${entry.pages.en}; selector ${entry.selectorLocales.join(",") || "absent"}`);
if (report.missingLocalization.length) process.exitCode = 1;
