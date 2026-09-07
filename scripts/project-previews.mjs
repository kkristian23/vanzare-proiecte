import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

const versionsPath = path.resolve(import.meta.dirname, "../app/project-preview-versions.json");

// Input is our generated static export, not arbitrary user-provided HTML.
export function previewDocument(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    // Keep only stylesheets, which writeProjectPreview embeds below. In
    // particular, React's image preloads must not request the original files
    // after <img> sources have been replaced with embedded data URLs.
    .replace(/<link\b[^>]*>/gi, tag =>
      /\brel\s*=\s*["']stylesheet["']/i.test(tag) ? tag : "");
}

export async function writeProjectPreview(directory) {
  const original = await readFile(path.join(directory, "index.html"), "utf8");
  let preview = previewDocument(original);
  // Opaque sandbox origins cannot request dev-server assets. Bundle the local
  // presentation assets so previews work without sharing the catalog origin.
  const publicRoot = path.dirname(directory);
  const assetPath = (url) => {
    const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
    const resolved = pathname.startsWith("/")
      ? path.resolve(publicRoot, `.${pathname}`)
      : path.resolve(directory, pathname);
    if (!resolved.startsWith(path.resolve(directory) + path.sep)) {
      throw new Error(`Preview asset outside project: ${url}`);
    }
    return resolved;
  };
  for (const [tag, url] of preview.matchAll(/<link\b[^>]*href="([^"]+)"[^>]*>/gi)) {
    if (!/\brel="stylesheet"/i.test(tag)) continue;
    const css = await readFile(assetPath(url), "utf8");
    if (/@import\b|url\(/i.test(css)) {
      throw new Error(`Preview stylesheet needs embedded assets: ${url}`);
    }
    preview = preview.replace(tag, `<style>${css.replace(/<\/style/gi, "<\\/style")}</style>`);
  }
  const imageTypes = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".avif": "image/avif", ".gif": "image/gif" };
  for (const [tag, url] of preview.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)) {
    const filename = assetPath(url);
    const mime = imageTypes[path.extname(filename).toLowerCase()];
    if (!mime) throw new Error(`Unsupported preview image: ${url}`);
    const data = await readFile(filename);
    preview = preview.replace(tag, tag.replace(`src="${url}"`, `src="data:${mime};base64,${data.toString("base64")}"`));
  }
  await writeFile(path.join(directory, "preview.html"), preview, "utf8");
  const version = createHash("sha256").update(preview).digest("hex").slice(0, 16);
  const versions = JSON.parse(await readFile(versionsPath, "utf8").catch(error => {
    if (error.code === "ENOENT") return "{}";
    throw error;
  }));
  const slug = path.basename(directory);
  if (versions[slug] !== version) {
    versions[slug] = version;
    await writeFile(versionsPath, JSON.stringify(versions, null, 2) + "\n", "utf8");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const root = path.resolve(import.meta.dirname, "..");
  const registry = JSON.parse(await readFile(path.join(root, "showcase-projects/registry.json"), "utf8"));
  const projects = registry.filter(project => project.id >= 35 && project.id <= 66 && !project.disabled);
  for (const project of projects) await writeProjectPreview(path.join(root, "public", project.slug));
  console.log(`Generated ${projects.length} script-free project previews.`);
}
