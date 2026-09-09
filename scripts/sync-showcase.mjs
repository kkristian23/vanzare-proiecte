import { cp, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { writeProjectPreview } from "./project-previews.mjs";
import { normalizeNextExport } from "./normalize-next-export.mjs";

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
  if (slug === "iqcalendar") {
    content = content.replace(/(['"`])\/(app|calendar|activity|result)(?=['"`?#])/g, (_match, quote, page) => `${quote}/${slug}/${page}.html`);
  }
  const prefix = `/${slug}/`;
  const basePath = prefix.slice(0, -1);
  const prefixRootPath = (target) => {
    if (target === basePath || target.startsWith(prefix)) return target;
    return `${basePath}${target}`;
  };

  return content
    .replace(/(href|src|action)=(['"])(\/(?!\/)[^'"]*)/g, (_match, attribute, quote, target) =>
      `${attribute}=${quote}${prefixRootPath(target)}`)
    // Plain React anchors must keep their project prefix after hydration too.
    .replace(/(\bhref\s*:\s*)(['"`])(\/(?!\/)[^'"`\\\s]*)/g, (_match, property, quote, target) =>
      `${property}${quote}${slug === 'studio-velora' ? prefixRootPath(target) : target}`)
    .replace(/url\((['"]?)(\/(?!\/)[^'")\s]*)/g, (_match, quote, target) =>
      `url(${quote}${prefixRootPath(target)}`)
    .replace(/(['"`])(\/(?:_next|assets|images|fonts|products|resurse)\/)/g, (_match, quote, target) =>
      `${quote}${prefixRootPath(target)}`)
    // Responsive image candidates also appear after commas in HTML/RSC srcsets.
    .replace(/(,\s+)(\/(?:assets|images|products)\/)/g, (_match, separator, target) =>
      `${separator}${prefixRootPath(target)}`)
    .replace(/(['"`])(\/(?!\/)[^'"`\s]*\.(?:png|jpe?g|webp|svg|ico|woff2?|avif))(?=[?\\'"`])/gi, (_match, quote, target) =>
      `${quote}${prefixRootPath(target)}`)
    // Vite's dependency preloader prepends '/' to these relative manifest entries.
    .replace(/(['"`])(_next\/static\/)/g, (_match, quote, target) =>
      `${quote}${slug}/${target}`);
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
    if (project.id >= 35) await writeProjectPreview(destination);
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

  // A standalone Next build embeds its base path in the router, beyond HTML URLs.
  // Only trust metadata belonging to the exact exported build, and preserve the
  // working showcase if an unrelated standalone build is offered for copying.
  const nextMetadata = path.join(project.source, ".next", "required-server-files.json");
  const nextBuildId = path.join(project.source, ".next", "BUILD_ID");
  if (await exists(nextMetadata) && await exists(nextBuildId)) {
    const buildId = (await readFile(nextBuildId, "utf8")).trim();
    if (await exists(path.join(output, "_next", "static", buildId))) {
      const metadata = JSON.parse(await readFile(nextMetadata, "utf8"));
      if (metadata.config?.basePath !== `/${project.slug}`) {
        results.push({slug:project.slug,status:"base-path-mismatch",error:`Rebuild with npm run showcase:sync -- ${project.slug} --build --strict; existing public export preserved.`});
        continue;
      }
    }
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
      // Built routes may legitimately be named reports, logs or tests.
      // Excluding source-only names here removed their JavaScript chunks.
      filter: (source) => ![".git", "node_modules", "graphify-out"].includes(path.basename(source)),
    });
  }
  if (project.entrypoint && !(await exists(path.join(destination, "index.html")))) {
    const target = `/${project.slug}/${project.entrypoint.replace(/(?:\/index)?\.html$/, '')}`;
    await writeFile(path.join(destination, "index.html"), `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"></head><body><a href="${target}">Deschide proiectul</a><script>location.replace(${JSON.stringify(target)})</script></body></html>`);
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
    await normalizeNextExport(destination);
    await rewriteTree(destination, project.slug);
    // Next 14/15 requests the base-path root payload as /project.txt.
    if (await exists(path.join(destination, "index.txt"))) {
      await cp(path.join(destination, "index.txt"), path.join(publicRoot, `${project.slug}.txt`));
    }
  if (project.id >= 35) await writeProjectPreview(destination);
  results.push({ slug: project.slug, status: "synced", output });
}

for (const result of results) {
  console.log(`${result.status === "synced" || result.status === "unchanged" ? "✓" : "!"} ${result.slug}: ${result.status}${result.output ? ` (${result.output})` : ""}${result.error ? ` — ${result.error}` : ""}`);
}

const missing = results.filter(
  (result) => result.status !== "synced" && result.status !== "unchanged" && result.status !== "disabled",
);
if (strict && missing.length) process.exitCode = 1;
