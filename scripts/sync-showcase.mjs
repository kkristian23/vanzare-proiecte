import { cp, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { writeProjectPreview } from "./project-previews.mjs";

const root = process.cwd();
const registryPath = path.join(root, "showcase-projects", "registry.json");
const publicRoot = path.resolve(root, "public");
const registry = JSON.parse(await readFile(registryPath, "utf8"));
const requested = new Set(process.argv.slice(2).filter((arg) => !arg.startsWith("--")));
const strict = process.argv.includes("--strict");
const buildRequested = process.argv.includes("--build");
const changedOnly = process.argv.includes("--changed");
const textExtensions = new Set([".html", ".css", ".js", ".mjs", ".json", ".rsc", ".txt", ".xml", ".webmanifest"]);
const ignoredNames = new Set([".git", ".next", ".vinext", "node_modules", "graphify-out", "logs", "reports", "tests"]);
const sourceIgnoredNames = new Set([
  ...ignoredNames,
  ".cache",
  ".output",
  ".turbo",
  ".vercel",
  ".wrangler",
  "coverage",
  "dist",
  "out",
]);

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function exists(filePath) {
  try { await stat(filePath); return true; } catch { return false; }
}

async function newestModifiedAt(target, ignored = sourceIgnoredNames) {
  let newest = 0;
  const targetStat = await stat(target);
  if (!targetStat.isDirectory()) return targetStat.mtimeMs;

  for (const entry of await readdir(target, { withFileTypes: true })) {
    if (ignored.has(entry.name) || entry.name.endsWith(".showcase-disabled")) continue;
    const entryPath = path.join(target, entry.name);
    if (entry.isDirectory()) newest = Math.max(newest, await newestModifiedAt(entryPath, ignored));
    else newest = Math.max(newest, (await stat(entryPath)).mtimeMs);
  }
  return newest;
}

async function projectChanged(project, destination) {
  const publicEntry = path.join(destination, "index.html");
  if (!(await exists(publicEntry))) return true;
  const publishedAt = (await stat(publicEntry)).mtimeMs;

  if (project.include) {
    for (const relativePath of project.include) {
      const sourcePath = path.resolve(project.source, relativePath);
      if (isInside(path.resolve(project.source), sourcePath) && await exists(sourcePath)) {
        if (await newestModifiedAt(sourcePath, new Set()) > publishedAt) return true;
      }
    }
    return false;
  }

  return await newestModifiedAt(path.resolve(project.source)) > publishedAt;
}

async function findOutput(project) {
  for (const candidate of project.outputs) {
    const directory = path.resolve(project.source, candidate);
    if (await exists(path.join(directory, project.entrypoint ?? "index.html"))) return directory;
  }
  return null;
}

async function buildProject(project) {
  const hidden = [];
  try {
    for (const relativePath of project.buildHide ?? []) {
      const sourcePath = path.resolve(project.source, relativePath);
      if (!isInside(path.resolve(project.source), sourcePath) || !(await exists(sourcePath))) continue;
      const temporaryPath = `${sourcePath}.showcase-disabled`;
      await rename(sourcePath, temporaryPath);
      hidden.push({ sourcePath, temporaryPath });
    }
    if (hidden.length) await rm(path.join(project.source, ".next"), { recursive: true, force: true, maxRetries: 5, retryDelay: 250 });
    await new Promise((resolve, reject) => {
      const npmExecPath = process.env.npm_execpath;
      const command = project.directNext ? process.execPath : npmExecPath ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm";
      const args = project.directNext ? [path.join(project.source, "node_modules", "next", "dist", "bin", "next"), "build"] : npmExecPath ? [npmExecPath, ...(project.buildArgs ?? ["run", "build"])] : project.buildArgs ?? ["run", "build"];
      const child = spawn(command, args, {
        cwd: project.source,
        env: {
          ...process.env,
          SHOWCASE_BASE_PATH: `/${project.slug}`,
          NEXT_PUBLIC_SHOWCASE_BASE_PATH: `/${project.slug}`,
        },
        shell: false,
        stdio: "inherit",
      });
      child.once("error", reject);
      child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`Build eșuat pentru ${project.slug} (${code})`)));
    });
  } finally {
    for (const entry of hidden.reverse()) await rename(entry.temporaryPath, entry.sourcePath);
  }
}

function prefixDocument(content, slug) {
  const prefix = `/${slug}/`;
  const basePath = prefix.slice(0, -1);
  const prefixRootPath = (target) => {
    if (["ro", "ru", "en"].some((locale) => target === `${basePath}/${locale}`))
      return `${target}.html`;
    if (target === basePath || target.startsWith(prefix)) return target;
    const prefixed = `${basePath}${target}`;
    return ["ro", "ru", "en"].some((locale) => prefixed === `${basePath}/${locale}`)
      ? `${prefixed}.html`
      : prefixed;
  };

  return content
    .replace(/(href|src|action)=(['"])(\/(?!\/)[^'"]*)/g, (_match, attribute, quote, target) =>
      `${attribute}=${quote}${prefixRootPath(target)}`)
    .replace(/url\((['"]?)(\/(?!\/)[^'")\s]*)/g, (_match, quote, target) =>
      `url(${quote}${prefixRootPath(target)}`)
    .replace(/(['"])(\/(?:_next|assets|images|fonts)\/)/g, (_match, quote, target) =>
      `${quote}${prefixRootPath(target)}`);
}

async function rewriteTree(directory, slug) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await rewriteTree(entryPath, slug);
    else if (textExtensions.has(path.extname(entry.name).toLowerCase())) {
      const original = await readFile(entryPath, "utf8");
      const rewritten = prefixDocument(original, slug);
      if (rewritten !== original) await writeFile(entryPath, rewritten, "utf8");
    }
  }
}

const results = [];
for (const project of registry) {
  if (requested.size && !requested.has(project.slug)) continue;
  const destination = path.resolve(publicRoot, project.slug);
  if (!isInside(publicRoot, destination)) throw new Error(`Destinație invalidă: ${destination}`);
  if (project.disabled) {
    await rm(destination, { recursive: true, force: true });
    results.push({ slug: project.slug, status: "disabled" });
    continue;
  }
  if (changedOnly && !(await projectChanged(project, destination))) {
    if (project.id >= 35 && project.id <= 66) await writeProjectPreview(destination);
    results.push({ slug: project.slug, status: "unchanged" });
    continue;
  }
  let output = null;
  if (buildRequested) {
    try {
      console.log(`→ build ${project.slug}`);
      await buildProject(project);
      output = await findOutput(project);
    } catch (error) {
      results.push({ slug: project.slug, status: "build-failed", error: error.message });
      continue;
    }
  }
  output ??= await findOutput(project);
  if (!output) {
    results.push({ slug: project.slug, status: "missing-static-export" });
    continue;
  }

  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  if (project.include) {
    for (const relativePath of project.include) {
      const sourcePath = path.resolve(output, relativePath);
      if (!isInside(output, sourcePath) || !(await exists(sourcePath))) continue;
      await cp(sourcePath, path.join(destination, relativePath), { recursive: true });
    }
  } else {
    await cp(output, destination, {
      recursive: true,
      filter: (source) => !ignoredNames.has(path.basename(source)),
    });
  }
  if (project.entrypoint && !(await exists(path.join(destination, "index.html")))) {
    await cp(path.join(destination, project.entrypoint), path.join(destination, "index.html"));
  }
  // Next static exports use flat `ro.html`/`ru.html`/`en.html` files while also
  // emitting RSC payload directories with the same names. Static hosts resolve
  // `/ro` to the directory first, so give each locale directory a real entry.
  for (const locale of ["ro", "ru", "en"]) {
    const flatLocale = path.join(destination, `${locale}.html`);
    const localeDirectory = path.join(destination, locale);
    const localeIndex = path.join(localeDirectory, "index.html");
    if (await exists(flatLocale)) {
      await mkdir(localeDirectory, { recursive: true });
      if (!(await exists(localeIndex))) await cp(flatLocale, localeIndex);
    }
  }
  await rewriteTree(destination, project.slug);
  if (project.id >= 35 && project.id <= 66) await writeProjectPreview(destination);
  results.push({ slug: project.slug, status: "synced", output });
}

for (const result of results) {
  console.log(`${result.status === "synced" || result.status === "unchanged" ? "✓" : "!"} ${result.slug}: ${result.status}${result.output ? ` (${result.output})` : ""}${result.error ? ` — ${result.error}` : ""}`);
}

const missing = results.filter(
  (result) => result.status !== "synced" && result.status !== "unchanged" && result.status !== "disabled",
);
if (strict && missing.length) process.exitCode = 1;
