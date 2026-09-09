import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const publicRoot = path.resolve("public");
const limits = { image: 500 * 1024, html: 1024 * 1024, javascript: 750 * 1024 };
const records = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(target);
    else {
      const size = (await stat(target)).size;
      const extension = path.extname(entry.name).toLowerCase();
      const kind = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"].includes(extension)
        ? "image"
        : extension === ".html"
          ? "html"
          : [".js", ".mjs"].includes(extension)
            ? "javascript"
            : "other";
      records.push({ file: path.relative(publicRoot, target).replaceAll("\\", "/"), size, kind });
    }
  }
}

await walk(publicRoot);
const total = records.reduce((sum, record) => sum + record.size, 0);
const oversized = records.filter((record) => limits[record.kind] && record.size > limits[record.kind]);
const byKind = Object.groupBy(records, (record) => record.kind);

console.log(`Public payload: ${(total / 1024 / 1024).toFixed(1)} MiB in ${records.length} files`);
for (const [kind, items] of Object.entries(byKind)) {
  const bytes = items.reduce((sum, item) => sum + item.size, 0);
  console.log(`${kind.padEnd(10)} ${(bytes / 1024 / 1024).toFixed(1).padStart(7)} MiB  ${String(items.length).padStart(5)} files`);
}
console.log(`\nLargest files (optimize these first):`);
for (const record of records.toSorted((a, b) => b.size - a.size).slice(0, 20)) {
  console.log(`${(record.size / 1024 / 1024).toFixed(2).padStart(7)} MiB  ${record.file}`);
}
console.log(`\nBudget warnings: ${oversized.length}`);
for (const record of oversized.slice(0, 30)) console.log(`- ${record.file} (${(record.size / 1024).toFixed(0)} KiB)`);
console.log("\nAfter deploy, verify actual transfer in Netlify Observability → Web requests, grouped by Content-Type and Path.");

if (oversized.some((record) => record.file.endsWith("/preview.html"))) {
  console.error("Large preview.html files remain. Run npm run prebuild before deploying.");
  process.exitCode = 1;
}
