import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve();
const thresholdKb = Number(process.argv.find((argument) => argument.startsWith("--threshold-kb="))?.split("=")[1] ?? 250);
const threshold = thresholdKb * 1024;
const apply = process.argv.includes("--apply");
const includeSourceImages = process.argv.includes("--include-source-images");
const concurrency = Math.max(1, Math.min(Number(process.env.IMAGE_OPTIMIZE_CONCURRENCY ?? 2), 4));
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg", ".bmp", ".tif", ".tiff", ".ico"]);
const sourceSkipDirectories = new Set([
  ".git", ".next", ".turbo", ".vinext", ".wrangler", ".cache", "coverage", "logs",
  "node_modules", "node_modules_broken", "playwright-report", "reports", "test-results", "visual-tests", "work",
]);
const oxipng = path.join(root, "work", "tools", "oxipng-10.1.1", "oxipng-10.1.1-x86_64-pc-windows-msvc", "oxipng.exe");
const jpegtran = path.join(root, "work", "tools", "jpegtran-bin-7.0.0", "jpegtran.exe");
const reportPath = path.join(root, "reports", "project-image-optimization.json");

function relative(file) {
  const value = path.relative(root, file);
  return value.startsWith("..") ? file : value;
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function fileHash(file) {
  return sha256(await readFile(file));
}

async function decodedFingerprint(file) {
  const image = sharp(file, { animated: true, failOn: "error", limitInputPixels: false });
  const metadata = await image.metadata();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  return {
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    pages: metadata.pages ?? 1,
    pageHeight: metadata.pageHeight ?? metadata.height,
    channels: info.channels,
    hash: sha256(data),
  };
}

async function inspectImage(file) {
  if (path.extname(file).toLowerCase() === ".ico") {
    const source = await readFile(file);
    const header = source.subarray(0, 6);
    const valid = header.length === 6
      && header[0] === 0 && header[1] === 0
      && header[2] === 1 && header[3] === 0
      && header.readUInt16LE(4) > 0;
    if (!valid && source.toString("utf8", 0, 64).trimStart().startsWith("<svg")) {
      return { format: "svg", valid: true, extensionMismatch: "SVG content stored with .ico extension" };
    }
    if (!valid) throw new Error("Invalid ICO header");
    return { format: "ico", valid: true };
  }
  const metadata = await sharp(await readFile(file), { animated: true, failOn: "error", limitInputPixels: false }).metadata();
  return {
    format: metadata.format,
    width: metadata.width,
    height: metadata.height,
    pages: metadata.pages ?? 1,
    valid: true,
  };
}

function samePixels(a, b) {
  return a.width === b.width
    && a.height === b.height
    && a.pages === b.pages
    && a.pageHeight === b.pageHeight
    && a.channels === b.channels
    && a.hash === b.hash;
}

async function walk(directory, visit, skipDirectories = new Set()) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirectories.has(entry.name)) await walk(target, visit, skipDirectories);
    } else if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      await visit(target);
    }
  }
}

function run(binary, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { cwd: root, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(stderr.trim() || `${path.basename(binary)} exited with ${code}`)));
  });
}

async function makeCandidate(file, format, suffix) {
  const extension = format === "jpeg" ? ".jpg" : `.${format}`;
  const temporary = path.join(path.dirname(file), `${path.basename(file)}.${process.pid}.${suffix}${extension}`);
  await unlink(temporary).catch(() => {});
  return temporary;
}

async function pngCandidates(file) {
  const temporary = await makeCandidate(file, "png", "oxipng");
  await copyFile(file, temporary);
  await run(oxipng, ["-o", "max", "--strip", "safe", temporary]);
  return [temporary];
}

async function jpegCandidates(file) {
  const baseline = await makeCandidate(file, "jpeg", "baseline");
  const progressive = await makeCandidate(file, "jpeg", "progressive");
  await run(jpegtran, ["-copy", "all", "-optimize", "-outfile", baseline, file]);
  await run(jpegtran, ["-copy", "all", "-optimize", "-progressive", "-outfile", progressive, file]);
  return [baseline, progressive];
}

async function modernLosslessCandidate(file, format) {
  const temporary = await makeCandidate(file, format, "lossless");
  const input = sharp(await readFile(file), { animated: true, failOn: "error", limitInputPixels: false });
  if (format === "webp") await input.webp({ lossless: true, effort: 6 }).toFile(temporary);
  else await input.avif({ lossless: true, effort: 9 }).toFile(temporary);
  return [temporary];
}

async function optimizeFile(target) {
  const before = (await stat(target.path)).size;
  const originalBytes = await readFile(target.path);
  const originalPixels = await decodedFingerprint(originalBytes);
  const format = originalPixels.format;
  let candidates = [];
  try {
    if (format === "png") candidates = await pngCandidates(target.path);
    else if (format === "jpeg") candidates = await jpegCandidates(target.path);
    else if (format === "webp" || format === "avif") candidates = await modernLosslessCandidate(target.path, format);
    else return { ...target, format, before, after: before, saved: 0, status: "unsupported-lossless-format" };

    const valid = [];
    for (const candidate of candidates) {
      const candidatePixels = await decodedFingerprint(await readFile(candidate));
      const size = (await stat(candidate)).size;
      if (samePixels(originalPixels, candidatePixels)) valid.push({ candidate, size });
    }
    valid.sort((a, b) => a.size - b.size);
    const best = valid[0];
    if (!best) return { ...target, format, before, after: before, saved: 0, status: "pixel-validation-failed" };
    if (best.size >= before) return { ...target, format, before, after: before, saved: 0, status: "already-optimal" };
    if (apply) {
      try {
        await copyFile(best.candidate, target.path);
      } catch {
        await writeFile(target.path, await readFile(best.candidate));
      }
    }
    const after = apply ? (await stat(target.path)).size : best.size;
    if (apply) {
      const finalPixels = await decodedFingerprint(await readFile(target.path));
      if (!samePixels(originalPixels, finalPixels)) {
        await writeFile(target.path, originalBytes);
        throw new Error("final pixel verification failed; original restored");
      }
    }
    return { ...target, format, before, after, saved: before - after, status: apply ? "optimized" : "would-optimize" };
  } finally {
    await Promise.all(candidates.map((candidate) => unlink(candidate).catch(() => {})));
  }
}

const registry = JSON.parse(await readFile(path.join(root, "showcase-projects", "registry.json"), "utf8"));
const projects = registry.filter((project) => !project.disabled && project.slug !== "forge");
const audit = [];
const candidates = [];
const missingProjects = [];

for (const project of projects) {
  const directory = path.join(root, "public", project.slug);
  try {
    await stat(directory);
  } catch {
    missingProjects.push(project.slug);
    continue;
  }
  await walk(directory, async (file) => {
    const size = (await stat(file)).size;
    const record = { scope: "public-project", project: project.slug, path: file, beforeHash: size > threshold ? await fileHash(file) : undefined, bytes: size };
    try {
      Object.assign(record, await inspectImage(file));
    } catch (error) {
      Object.assign(record, { valid: false, error: error.message });
    }
    audit.push(record);
    if (record.valid && size > threshold) candidates.push(record);
  });
}

const previewDirectory = path.join(root, "public", "project-previews");
await walk(previewDirectory, async (file) => {
  const size = (await stat(file)).size;
  const record = { scope: "project-preview", project: "project-previews", path: file, beforeHash: size > threshold ? await fileHash(file) : undefined, bytes: size };
  try {
    Object.assign(record, await inspectImage(file));
  } catch (error) {
    Object.assign(record, { valid: false, error: error.message });
  }
  audit.push(record);
  if (record.valid && size > threshold) candidates.push(record);
});

const publicCandidateCount = candidates.length;
const sourceTargets = [];
if (includeSourceImages) {
  for (const project of projects) {
    await walk(project.source, async (file) => {
      const size = (await stat(file)).size;
      const record = { scope: "source-project", project: project.slug, path: file, bytes: size };
      try {
        Object.assign(record, await inspectImage(file));
      } catch (error) {
        Object.assign(record, { valid: false, error: error.message });
      }
      audit.push(record);
      if (record.valid && size > threshold) {
        sourceTargets.push(record);
        candidates.push(record);
      }
    }, sourceSkipDirectories);
  }
}

const uniqueTargets = new Map();
for (const target of candidates) uniqueTargets.set(path.resolve(target.path).toLowerCase(), target);
const targets = [...uniqueTargets.values()];
const results = new Array(targets.length);
let cursor = 0;
let completed = 0;

async function worker() {
  while (cursor < targets.length) {
    const index = cursor++;
    const target = targets[index];
    try {
      results[index] = await optimizeFile(target);
    } catch (error) {
      const before = (await stat(target.path)).size;
      results[index] = { ...target, before, after: before, saved: 0, status: "error", error: error.message };
    }
    completed += 1;
    const result = results[index];
    console.log(`[${completed}/${targets.length}] ${result.status.padEnd(24)} ${relative(target.path)} (${(result.before / 1024).toFixed(1)} -> ${(result.after / 1024).toFixed(1)} KiB)`);
  }
}

console.log(`Projects: ${projects.length}; images audited: ${audit.length}; public over ${thresholdKb} KiB: ${publicCandidateCount}; source over ${thresholdKb} KiB: ${sourceTargets.length}.`);
console.log(`${apply ? "Applying" : "Simulating"} pixel-identical lossless optimization with concurrency ${concurrency}.`);
await Promise.all(Array.from({ length: concurrency }, worker));

const totalBefore = results.reduce((sum, result) => sum + result.before, 0);
const totalAfter = results.reduce((sum, result) => sum + result.after, 0);
const publicResults = results.filter((result) => result.scope !== "source-project");
const publicRemaining = publicResults.filter((result) => result.after > threshold);
const output = {
  generatedAt: new Date().toISOString(),
  mode: apply ? "apply" : "dry-run",
  thresholdKb,
  projects: projects.length,
  missingProjects,
  audit: {
    images: audit.length,
    valid: audit.filter((record) => record.valid).length,
    invalid: audit.filter((record) => !record.valid).map((record) => ({ path: relative(record.path), error: record.error })),
    bytes: audit.reduce((sum, record) => sum + record.bytes, 0),
    overThreshold: candidates.length,
  },
  publicImages: audit.filter((record) => record.scope !== "source-project").length,
  sourceImages: audit.filter((record) => record.scope === "source-project").length,
  sourceCandidates: sourceTargets.length,
  optimization: {
    files: results.length,
    optimized: results.filter((result) => result.status === "optimized" || result.status === "would-optimize").length,
    beforeBytes: totalBefore,
    afterBytes: totalAfter,
    savedBytes: totalBefore - totalAfter,
    publicRemainingOverThreshold: publicRemaining.length,
  },
  results: results.map((result) => ({ ...result, path: relative(result.path), beforeHash: undefined })),
};
await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Saved report: ${relative(reportPath)}`);
console.log(`Total: ${(totalBefore / 1048576).toFixed(2)} -> ${(totalAfter / 1048576).toFixed(2)} MiB; saved ${((totalBefore - totalAfter) / 1048576).toFixed(2)} MiB; public files still over threshold: ${publicRemaining.length}.`);
