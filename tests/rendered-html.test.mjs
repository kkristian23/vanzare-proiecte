import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

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
  assert.match(html, /NEO BOOKING/);
  assert.match(html, /AUDIO RENTAL MD/);
  assert.match(html, /id="proiecte"/);
  assert.match(html, /id="proces"/);
});

test("every registered project has an export and a catalog route", async () => {
  const [registryText, pageSource] = await Promise.all([
    readFile(new URL("../showcase-projects/registry.json", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);
  const registry = JSON.parse(registryText);
  assert.equal(registry.length, 19);
  for (const project of registry) {
    await access(new URL(`../public/${project.slug}/index.html`, import.meta.url));
    assert.match(pageSource, new RegExp(`\\b${project.id}: "/${project.slug}/"`));
  }
});

test("synced documents contain no duplicated project prefix", async () => {
  const registry = JSON.parse(
    await readFile(new URL("../showcase-projects/registry.json", import.meta.url), "utf8"),
  );
  for (const project of registry) {
    const html = await readFile(new URL(`../public/${project.slug}/index.html`, import.meta.url), "utf8");
    assert.doesNotMatch(html, new RegExp(`/${project.slug}/${project.slug}/`));
  }
});
