import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { loadSiteModule } from "./load-site-data.mjs";
const groups = new Map();
const siteScope = "monodev-catalog";
// The editor's initial values always come from source, independently of the latest published snapshot.
loadSiteModule("app/lib/cms-store.ts").publishCms({});
const structural = new Set([
  "id",
  "slug",
  "type",
  "tone",
  "platform",
  "mobileOS",
  "demo",
  "src",
  "srcSet",
  "fallback",
  "code",
  "href",
  "url",
  "categories",
  "locales",
  "defaultLocale",
  "ogImage",
  "socialProfiles",
]);
function add(group, key, value, source) {
  if (!key || typeof value !== "string") return;
  const normalizedSource = source.replaceAll("\\", "/");
  if (!normalizedSource.startsWith("app/") || normalizedSource.startsWith("app/admin/"))
    throw new Error(`CMS scope violation: ${source} is outside the MONO/DEV catalog application.`);
  if (!groups.has(group))
    groups.set(group, { id: `text-${group}`, site: siteScope, source: normalizedSource, fields: {} });
  groups.get(group).fields[key] = value;
}
function flatten(group, value, source, prefix = "") {
  if (typeof value === "string") return add(group, prefix, value, source);
  if (value && typeof value === "object")
    for (const [key, item] of Object.entries(value))
      if (!structural.has(key))
        flatten(group, item, source, prefix ? `${prefix}.${key}` : key);
}
function literal(node) {
  if (!node) return undefined;
  if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node))
    return literal(node.expression);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    return node.text;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node))
    return Object.fromEntries(
      node.properties
        .filter(ts.isPropertyAssignment)
        .map((p) => [p.name.text, literal(p.initializer)]),
    );
  return undefined;
}
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name).replaceAll("\\", "/");
    if (entry.isDirectory() && entry.name !== "admin") await scan(file);
    if (!entry.isFile() || !/\.tsx?$/.test(file)) continue;
    const source = await readFile(file, "utf8"),
      ast = ts.createSourceFile(
        file,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
    function walk(node) {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
        const [group, key, fallback] = node.arguments;
        if (node.expression.text === "cmsContent" && ts.isStringLiteral(group))
          flatten(group.text, literal(key), file);
        if (
          node.expression.text === "cmsText" &&
          ts.isStringLiteral(group) &&
          ts.isStringLiteral(key)
        )
          add(group.text, key.text, literal(fallback), file);
      }
      ts.forEachChild(node, walk);
    }
    walk(ast);
  }
}
await scan("app");
// Evaluate data exports to include derived defaults (garden projects and FAQ tuples).
for (const [file, names] of [
  ["app/new-project-details.ts", ["newProjectDetails"]],
  ["app/new-project-translations.ts", ["newProjectTranslations"]],
  ["app/lib/faq-translations.ts", ["translatedFaqCategories"]],
]) {
  const mod = loadSiteModule(file);
  for (const name of names)
    flatten(`${path.basename(file, ".ts")}-${name}`, mod[name], file);
}
const catalog = loadSiteModule("app/lib/project-catalog.ts");
for (const project of catalog.projects)
  flatten(`project-${project.id}`, project, "app/lib/project-catalog.ts");
const labels = {
  "home-client": "Acasă · elemente vizuale și interfață",
  "i18n-copy": "Acasă · navigare, catalog, proces și footer",
  "i18n-contactCopy": "Contact · formular și informații",
  "contact-client": "Contact · introducere și interfață",
  "faq-content": "Întrebări · română",
  "faq-translations": "Întrebări · rusă și engleză",
  "faq-ui": "Întrebări · interfață",
  "trust-content": "Despre, proces, confidențialitate, termeni și cookies",
  services: "Servicii · pagini și interfață",
  "new-project-details": "Proiecte · descrieri în română",
  "new-project-translations": "Proiecte · descrieri în rusă și engleză",
  "legacy-project-translations": "Proiecte · descrieri în rusă și engleză",
  "project-catalog": "Proiecte · descrieri în română",
  "seo-shell": "Navigare și footer · pagini informative",
  "site-config": "Date de contact și metadate",
  "analytics-consent": "Cookies · consimțământ",
  "page-content": "Cabinet · conținut",
  "contact-meta": "Contact · titlul și descrierea paginii",
  "contact-request": "Contact · mesajul pregătit",
  "project-page-title": "Proiecte · prefixul titlului paginii",
  "i18n-typeMap": "Catalog · categorii în rusă și engleză",
  "i18n-romanianTypeMap": "Catalog · categorii în română",
  "i18n-descriptions": "Catalog · descrieri în rusă și engleză",
  "i18n-visualCopy": "Catalog · texte în ilustrații",
  "i18n-showcaseCopy": "Catalog · texte în ilustrații",
  "view-projects-slug": "Proiecte · pagina de detalii",
  "trust-view": "Pagini informative · interfață",
  "brand-logo": "Identitate · logo",
  "not-found": "Pagina 404",
};
const result = [...groups]
  .map(([key, group]) => {
    const match = Object.keys(labels)
      .sort((a, b) => b.length - a.length)
      .find((prefix) => key.startsWith(prefix));
    const project = key.match(/^project-(\d+)$/)?.[1];
    return {
      ...group,
      label: project
        ? `Fișa din catalog · ${catalog.projects.find((p) => p.id === Number(project))?.title ?? project}`
        : `${labels[match] ?? key}${match && key !== match ? ` · ${key.slice(match.length + 1)}` : ""}`,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label, "ro"));
for (const group of result)
  if (group.site !== siteScope || !group.source.startsWith("app/") || group.source.startsWith("app/admin/"))
    throw new Error(`CMS scope violation in ${group.id}.`);
for (const group of result)
  if (Buffer.byteLength(JSON.stringify(group.fields)) > 850000)
    throw new Error(`Content group too large: ${group.id}`);
await writeFile(
  "app/admin/content-registry.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  `CMS: ${result.length} secțiuni, ${result.reduce((n, g) => n + Object.keys(g.fields).length, 0)} texte existente.`,
);
