import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { createHash } from "node:crypto";
import { previewDocument } from "../scripts/project-previews.mjs";

test("previews discard image preloads that would fail inside the isolated frame", () => {
  const html = '<link rel="preload" as="image" href="./images/phone.webp"/>' +
    "<link href='./images/food.jpg' rel='preload' as='image'>" +
    '<link rel="prefetch" href="./images/salad.jpg">' +
    '<link rel="stylesheet" href="/project/styles.css">' +
    '<img src="./images/phone.webp" alt="Phone">';
  const preview = previewDocument(html);
  assert.doesNotMatch(preview, /<link\b[^>]*(?:phone\.webp|food\.jpg|salad\.jpg)/i);
  assert.match(preview, /<link rel="stylesheet"/);
  assert.match(preview, /<img src="\.\/images\/phone\.webp"/);
});

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the MONO/DEV catalog", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>MONO\/DEV/);
  assert.match(html, /IDEI MARI/);
  assert.match(html, /EVENTORA/);
  assert.match(html, /CLINICA NOVA/);
  assert.match(html, /id="proiecte"/);
  assert.match(html, /id="proces"/);
  const catalogSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const configuredPageSize = Number(catalogSource.match(/const PROJECT_PAGE_SIZE = (\d+);/)?.[1]);
  assert.ok(configuredPageSize > 0, "catalog page size must be configured");
  assert.equal([...html.matchAll(/<article\b[^>]*class="card"/g)].length, configuredPageSize);
  assert.match(html, /aria-controls="project-grid"/);
  assert.match(html, /Mai multe/);
});

test("every registered project has an export and a catalog route", async () => {
  const [registryText, pageSource] = await Promise.all([
    readFile(new URL("../showcase-projects/registry.json", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);
  const registry = JSON.parse(registryText);
  for (const project of registry) {
    assert.match(pageSource, new RegExp(`\\b${project.id}: "/${project.slug}/"`));
    if (!project.disabled) {
      await access(new URL(`../public/${project.slug}/index.html`, import.meta.url));
    }
  }
});

test("synced documents contain no duplicated project prefix", async () => {
  const registry = JSON.parse(
    await readFile(new URL("../showcase-projects/registry.json", import.meta.url), "utf8"),
  );
  for (const project of registry) {
    if (project.disabled) continue;
    const html = await readFile(new URL(`../public/${project.slug}/index.html`, import.meta.url), "utf8");
    assert.doesNotMatch(html, new RegExp(`/${project.slug}/${project.slug}/`));
  }
});

test("project directory URLs redirect to their static entry and preserve the query", async () => {
  const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url).href);
  const registry = JSON.parse(await readFile(new URL("../showcase-projects/registry.json", import.meta.url), "utf8"));
  const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  for (const project of registry.filter(project => project.id >= 35 && project.id <= 66)) {
    let response = await worker.fetch(new Request(`http://localhost/${project.slug}/?source=catalog`), env, ctx);
    if (response.status === 308) {
      const canonical = new URL(response.headers.get("location"), "http://localhost");
      assert.equal(canonical.href, `http://localhost/${project.slug}?source=catalog`);
      response = await worker.fetch(new Request(canonical), env, ctx);
    }
    assert.equal(response.status, 307, `${project.slug}: directory route did not redirect`);
    assert.equal(new URL(response.headers.get("location"), "http://localhost").href, `http://localhost/${project.slug}/index.html?source=catalog`);
  }
  const unknown = await worker.fetch(new Request("http://localhost/unknown-export"), env, ctx);
  assert.equal(unknown.status, 404);
});

test("redesigned projects preview their current static exports", async () => {
  const registry = JSON.parse(await readFile(new URL("../showcase-projects/registry.json", import.meta.url), "utf8"));
  const newProjects = registry.filter(project => project.id >= 35 && project.id <= 66);
  assert.equal(newProjects.length, 32);
  const html = await (await render()).text();
  const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const versions = JSON.parse(await readFile(new URL("../app/project-preview-versions.json", import.meta.url), "utf8"));
  for (const project of newProjects) {
    assert.ok(pageSource.includes(`"/${project.slug}/"`), `${project.slug}: preview path absent from catalog`);
    const frame = [...html.matchAll(/<iframe\b[^>]*>/g)].map(match => match[0]).find(tag => tag.includes(`src="/${project.slug}/preview.html?`));
    if (frame) {
      assert.ok(frame.includes(`src="/${project.slug}/preview.html?v=${versions[project.slug]}"`), `${project.slug}: rendered preview version is stale`);
      assert.ok(frame.includes('sandbox="allow-scripts"'), `${project.slug}: preview must use an isolated origin without blocking injected scripts`);
      assert.ok(!frame.includes('allow-same-origin'), `${project.slug}: preview must not share the catalog origin`);
    }
    assert.ok(!html.includes(`src="/project-previews/${project.slug}.png"`), `${project.slug}: stale template screenshot still in catalog`);
    const page = await readFile(new URL(`../public/${project.slug}/index.html`, import.meta.url), "utf8");
    const preview = await readFile(new URL(`../public/${project.slug}/preview.html`, import.meta.url), "utf8");
    assert.equal(versions[project.slug], createHash("sha256").update(preview).digest("hex").slice(0, 16), `${project.slug}: preview cache version does not match its content`);
    assert.doesNotMatch(preview, /<script\b|<link\b[^>]*\bas="script"|<link\b[^>]*\brel="modulepreload"/i);
    assert.ok(preview.includes("<main") && preview.includes("<style>"), `${project.slug}: preview lost content or styles`);
    const mainWithoutImages = document => document.match(/<main\b[\s\S]*?<\/main>/)?.[0].replace(/(<img\b[^>]*\bsrc=")[^"]+/g, '$1');
    assert.equal(mainWithoutImages(preview), mainWithoutImages(page), `${project.slug}: preview changed the main content`);
    assert.doesNotMatch(preview, /<link\b[^>]*rel="stylesheet"/i, `${project.slug}: preview still requests external styles`);
    assert.doesNotMatch(preview, /<link\b/i, `${project.slug}: preview still issues resource hints or external link requests`);
    for (const [, imageUrl] of preview.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) {
      assert.match(imageUrl, /^data:image\/[a-z+]+;base64,/, `${project.slug}: preview still requests an external image`);
    }
    for (const [, cssUrl] of page.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/gi)) {
      const css = await readFile(new URL(`../public${cssUrl}`, import.meta.url), "utf8");
      assert.ok(preview.includes(css.replace(/<\/style/gi, "<\\/style")), `${project.slug}: embedded stylesheet differs from export`);
    }
    assert.match(page, /<script\b/, `${project.slug}: interactive page lost its scripts`);
    assert.ok(page.includes("<main"), `${project.slug}: export is not a usable page`);
    assert.ok(!page.includes("Recharts transformă datele demonstrative"), `${project.slug}: old template was published`);
  }
  const slugs = ["flow-crm", "academia", "staynest", "tableo", "medora-clinic", "imobilia-one"];
  for (const slug of slugs) {
    const image = await readFile(new URL(`../public/project-previews/${slug}.png`, import.meta.url));
    assert.ok(image.subarray(1, 4).toString() === "PNG" || (image[0] === 0xff && image[1] === 0xd8), `${slug}: invalid image`);
    assert.ok(image.length > 10000, `${slug}: preview is unexpectedly small`);
    assert.ok(pageSource.includes(`"/${slug}/"`), `${slug}: project absent from catalog configuration`);
  }
});
