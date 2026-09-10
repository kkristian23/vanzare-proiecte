import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const registry = JSON.parse(fs.readFileSync(path.join(root, "showcase-projects", "registry.json"), "utf8"));
const visibleProjects = registry.filter((project) => !project.disabled && project.slug !== "forge");

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(entryPath);
    return entry.name.toLowerCase().endsWith(".html") ? [entryPath] : [];
  });
}

test("all 63 visible showcase projects expose favicons on real pages and keep preview stubs resource-free", () => {
  assert.equal(visibleProjects.length, 63);

  for (const project of visibleProjects) {
    const directory = path.join(root, "public", project.slug);
    const pages = htmlFiles(directory);
    assert.ok(pages.length > 0, `${project.slug}: no HTML pages`);

    for (const page of pages) {
      const html = fs.readFileSync(page, "utf8");
      if (path.basename(page) === "preview.html") {
        assert.ok(Buffer.byteLength(html) < 1024, `${project.slug}: retired preview stub must stay lightweight`);
        assert.doesNotMatch(html, /<script\b|<img\b|<link\b[^>]*rel=["']stylesheet["']/i, `${project.slug}: preview must not preload demo resources`);
        assert.match(html, /<meta\b[^>]*name=["']robots["'][^>]*content=["']noindex["']/i);
        assert.ok(html.includes(`href="/${project.slug}/index.html?source=catalog"`), `${project.slug}: preview must provide the explicit demo link`);
        continue;
      }
      const faviconLinks = [...html.matchAll(/<link\b[^>]*>/gi)].filter((match) => {
        const rel = match[0].match(/\brel\s*=\s*(["'])(.*?)\1/i)?.[2]?.toLowerCase().split(/\s+/) ?? [];
        return rel.includes("icon");
      });
      assert.equal(faviconLinks.length, 1, `${path.relative(root, page)}: expected one favicon link`);
      const href = faviconLinks[0][0].match(/\bhref=["']([^"']+)["']/i)?.[1];
      assert.ok(href, `${path.relative(root, page)}: missing favicon link`);
      const relativeAsset = href.replace(`/${project.slug}/`, "");
      assert.ok(fs.existsSync(path.join(directory, relativeAsset)), `${project.slug}: missing ${href}`);
    }
  }
});
