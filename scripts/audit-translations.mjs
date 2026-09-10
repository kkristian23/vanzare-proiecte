import { readFile } from "node:fs/promises";

const read = (file) => readFile(file, "utf8");
const unique = (values) => [...new Set(values)].sort((a, b) => a - b);
const idsIn = (source) => [...source.matchAll(/\bid\s*:\s*(\d+)\b/g)].map((match) => Number(match[1]));
const numericKeysIn = (source) => [...source.matchAll(/^\s*(?:"(\d+)"|(\d+))\s*:/gm)].map((match) => Number(match[1] ?? match[2]));

function between(source, start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  if (from < 0 || to < 0) throw new Error(`Nu pot localiza secțiunea ${start}.`);
  return source.slice(from, to);
}

function localeBlock(source, locale) {
  const start = source.indexOf(`  "${locale}": {`);
  if (start < 0) throw new Error(`Lipsește blocul ${locale} în new-project-translations.ts.`);
  const openingBrace = source.indexOf("{", start);
  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(openingBrace + 1, index);
  }
  throw new Error(`Blocul ${locale} nu este închis.`);
}

function objectKeys(source, property) {
  const start = source.indexOf(`"${property}": {`);
  if (start < 0) throw new Error(`Lipsește obiectul ${property}.`);
  const openingBrace = source.indexOf("{", start);
  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return numericKeysIn(source.slice(openingBrace + 1, index));
  }
  throw new Error(`Obiectul ${property} nu este închis.`);
}

const [page, i18n, translations, gardens, romanianDetails] = await Promise.all([
  read("app/lib/project-catalog.ts"),
  read("app/i18n.ts"),
  read("app/new-project-translations.ts"),
  read("app/garden-projects.ts"),
  read("app/new-project-details.ts"),
]);

const catalog = between(page, "const projectCatalog", "const pricesByProjectId");
const catalogIds = unique([...idsIn(catalog), ...idsIn(gardens)]);
const gardenIds = unique(idsIn(gardens));
const legacyDescriptionIds = numericKeysIn(between(i18n, "const descriptions", "export function localDescription"));
const legacyDetailIds = numericKeysIn(page.slice(page.indexOf("const projectDetails")));
const roDetailIds = unique([...numericKeysIn(romanianDetails), ...gardenIds, ...legacyDetailIds]);

const issues = [];
for (const locale of ["en", "ru"]) {
  const block = localeBlock(translations, locale);
  const descriptionIds = unique([...objectKeys(block, "descriptions"), ...gardenIds, ...legacyDescriptionIds]);
  const detailIds = unique([...objectKeys(block, "newProjectDetails"), ...gardenIds, ...legacyDetailIds]);
  for (const id of catalogIds) {
    if (!descriptionIds.includes(id)) issues.push({ id, locale, field: "catalog.description" });
    if (!detailIds.includes(id)) issues.push({ id, locale, field: "details" });
  }
}

for (const id of catalogIds) {
  if (!roDetailIds.includes(id)) issues.push({ id, locale: "ro", field: "details" });
}

const copyBlocks = ["copy", "contactCopy", "visualCopy", "showcaseCopy"];
for (const name of copyBlocks) {
  const declaration = new RegExp(`export const ${name} = \\{([\\s\\S]*?)\\n\\} as const;`).exec(i18n)?.[1] ?? "";
  for (const locale of ["ro", "en", "ru"]) {
    if (!new RegExp(`\\b${locale}:\\s*\\{`).test(declaration)) issues.push({ id: "catalog", locale, field: `${name} locale block` });
  }
}

console.log(`Audit localizare: ${catalogIds.length} proiecte (${catalogIds.join(", ")}).`);
if (issues.length) {
  console.error("\nTraduceri lipsă:");
  for (const issue of issues) console.error(`- proiect ${issue.id} · ${issue.locale} · ${issue.field}`);
  process.exitCode = 1;
} else {
  console.log("RO/EN/RU: descrierile, detaliile și blocurile de catalog sunt complete.");
}
