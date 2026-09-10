import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/ro") {
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
  assert.match(html, /<title>[^<]*MONO\/DEV/);
  assert.match(html, /IDEI MARI/);
  assert.match(html, /EVENTORA/);
  assert.doesNotMatch(html, /class="catalog-directory(?:\s|")/, "Removed directory must not be rendered");
  for (const title of ["AquaVerde", "TerraForma", "GazonPro", "EcoHabitat", "YardCraft"]) {
    assert.ok(html.includes(title), `${title}: new project missing from first catalog page`);
  }
  assert.match(html, /Grădini și peisagistică/);
  assert.match(html, /id="proiecte"/);
  assert.match(html, /id="proces"/);
  const catalogSource = await readFile(new URL("../app/home-client.tsx", import.meta.url), "utf8");
  const configuredPageSize = Number(catalogSource.match(/const PROJECT_PAGE_SIZE = (\d+);/)?.[1]);
  assert.ok(configuredPageSize > 0, "catalog page size must be configured");
  assert.equal([...html.matchAll(/<article\b[^>]*class="card"/g)].length, configuredPageSize);
  assert.match(html, /aria-controls="project-grid"/);
  assert.match(html, /Mai multe/);
});

test("every registered project has an export and a catalog route", async () => {
  const [registryText, pageSource] = await Promise.all([
    readFile(new URL("../showcase-projects/registry.json", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/project-catalog.ts", import.meta.url), "utf8"),
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

test("exported root RSC payloads are available at their browser-requested base paths", async () => {
  const registry = JSON.parse(await readFile(new URL("../showcase-projects/registry.json", import.meta.url), "utf8"));
  for (const project of registry) {
    const hasPayload = await access(new URL(`../public/${project.slug}/index.txt`, import.meta.url)).then(() => true, () => false);
    if (hasPayload) {
      const expected = await readFile(new URL(`../public/${project.slug}.txt`, import.meta.url), "utf8");
      const built = await readFile(new URL(`../dist/client/${project.slug}.txt`, import.meta.url), "utf8");
      assert.equal(built, expected, `${project.slug}: built root payload differs from the published export`);
    }
  }
});

test("project directory URLs redirect to their static entry and preserve the query", async () => {
  const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url).href);
  const registry = JSON.parse(await readFile(new URL("../showcase-projects/registry.json", import.meta.url), "utf8"));
  const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  for (const project of registry.filter(project => project.id >= 35)) {
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
  const newProjects = registry.filter(project => project.id >= 35 && !project.disabled);
  for (const slug of ["aquaverde", "terraforma", "gazonpro", "ecohabitat", "yardcraft"]) {
    assert.ok(newProjects.some(project => project.slug === slug), `${slug}: missing registration`);
  }
  const html = await (await render()).text();
  const pageSource = await readFile(new URL("../app/lib/project-catalog.ts", import.meta.url), "utf8");
  assert.doesNotMatch(html, /<iframe\b/i, "catalog must not preload interactive project exports");
  assert.doesNotMatch(html, /\/\.netlify\/images/, "local and server-rendered previews must not require Netlify Image CDN");
  const gardenPreview = [...html.matchAll(/<img\b[^>]*>/g)].find(([tag]) => /alt="AquaVerde\b/.test(tag))?.[0];
  assert.ok(gardenPreview, "catalog must render the AquaVerde preview before hydration");
  const previewSource = gardenPreview.match(/\bsrc="([^"]+)"/)?.[1];
  const previewAlt = gardenPreview.match(/\balt="([^"]+)"/)?.[1];
  assert.ok(previewSource?.startsWith("/") && !previewSource.startsWith("//"), "preview needs a locally served fallback");
  assert.match(previewAlt ?? "", /AquaVerde.+irigare/i, "preview alt must identify the project and its localized purpose");
  await access(new URL(`../public${previewSource}`, import.meta.url));
  for (const project of newProjects) {
    assert.ok(pageSource.includes(`"/${project.slug}/"`), `${project.slug}: preview path absent from catalog`);
    assert.ok(!html.includes(`/${project.slug}/preview.html`), `${project.slug}: heavyweight preview must not be loaded by the catalog`);
    const page = await readFile(new URL(`../public/${project.slug}/index.html`, import.meta.url), "utf8");
    const preview = await readFile(new URL(`../public/${project.slug}/preview.html`, import.meta.url), "utf8");
    assert.ok(Buffer.byteLength(preview) < 1024, `${project.slug}: retired preview entrypoint exceeds 1 KiB`);
    assert.doesNotMatch(preview, /<script\b|<img\b|<link\b[^>]*rel="stylesheet"/i, `${project.slug}: retired preview loads resources`);
    assert.ok(preview.includes(`href="/${project.slug}/index.html?source=catalog"`), `${project.slug}: explicit demo link is missing`);
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
