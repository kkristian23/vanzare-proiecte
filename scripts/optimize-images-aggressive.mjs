import { copyFile, readFile, readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(process.argv[2] ?? "public");
const concurrency = Math.max(1, Math.min(Number(process.env.IMAGE_OPTIMIZE_CONCURRENCY ?? 4), 8));
const skipAfter = process.env.IMAGE_OPTIMIZE_SKIP_AFTER
  ? new Date(process.env.IMAGE_OPTIMIZE_SKIP_AFTER).getTime()
  : Number.POSITIVE_INFINITY;
const extensions = new Set([".png", ".webp"]);
const files = [];

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(target);
    else if (entry.name.endsWith(".optimize.tmp")) await unlink(target);
    else if (extensions.has(path.extname(entry.name).toLowerCase())) files.push(target);
  }
}

async function optimize(file) {
  const extension = path.extname(file).toLowerCase();
  const temporary = `${file}.${process.pid}.optimize.tmp`;
  const before = await stat(file);
  if (before.mtimeMs >= skipAfter) {
    return { file, before: before.size, after: before.size, changed: false };
  }
  // Buffering releases the source file before replacement, which avoids Windows
  // sharing violations caused by libvips retaining a file handle.
  const source = await readFile(file);
  const input = sharp(source, { failOn: "error", limitInputPixels: false });
  const original = await input.metadata();

  try {
    if (extension === ".png") {
      await input.png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true,
        quality: 65,
        colours: 256,
        dither: 0.8,
        effort: 10,
      }).toFile(temporary);
    } else {
      await input.webp({
        quality: 60,
        alphaQuality: 75,
        effort: 6,
        smartSubsample: true,
        preset: "picture",
      }).toFile(temporary);
    }

    const candidate = await stat(temporary);
    const output = await sharp(await readFile(temporary), { failOn: "error", limitInputPixels: false }).metadata();
    if (output.format !== extension.slice(1) || output.width !== original.width || output.height !== original.height) {
      throw new Error(`validation failed (${output.format} ${output.width}x${output.height})`);
    }

    if (candidate.size >= before.size) {
      await unlink(temporary);
      return { file, before: before.size, after: before.size, changed: false };
    }

    await copyFile(temporary, file);
    await unlink(temporary);
    return { file, before: before.size, after: candidate.size, changed: true };
  } catch (error) {
    await unlink(temporary).catch(() => {});
    throw new Error(`${path.relative(process.cwd(), file)}: ${error.message}`);
  }
}

await collect(root);
files.sort();

const results = new Array(files.length);
let cursor = 0;
async function worker() {
  while (cursor < files.length) {
    const index = cursor++;
    results[index] = await optimize(files[index]);
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));

const before = results.reduce((total, item) => total + item.before, 0);
const after = results.reduce((total, item) => total + item.after, 0);
const changed = results.filter((item) => item.changed);
const mib = (bytes) => (bytes / 1024 / 1024).toFixed(2);
const percent = before === 0 ? "0.0" : (((before - after) / before) * 100).toFixed(1);

console.log(`Optimized ${changed.length}/${results.length} PNG/WebP files: ${mib(before)} -> ${mib(after)} MiB; saved ${mib(before - after)} MiB (${percent}%).`);
for (const item of changed.sort((a, b) => (b.before - b.after) - (a.before - a.after)).slice(0, 20)) {
  console.log(`${path.relative(process.cwd(), item.file)}: ${(item.before / 1024).toFixed(1)} -> ${(item.after / 1024).toFixed(1)} KiB`);
}
