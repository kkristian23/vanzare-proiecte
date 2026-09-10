import assert from "node:assert/strict";
import test from "node:test";
import { loadSiteModule } from "../scripts/load-site-data.mjs";
import { renderHeaders, normalizeDemoRobots } from "../scripts/netlify-seo.mjs";

const catalog = loadSiteModule("app/lib/project-catalog.ts");
const policy = loadSiteModule("app/lib/project-seo.ts");
const routes = loadSiteModule("app/lib/seo-routes.ts");

test("demo normalization changes only conflicting crawler directives and is repeatable", () => {
  const html = '<html><head><meta name="robots" content="index, follow"><meta content="noindex, nofollow" name="googlebot"><meta name="viewport" content="width=device-width"></head><body><a href="/images/index.png">index, follow</a><script src="/demo.js"></script></body></html>';
  const normalized = normalizeDemoRobots(html);
  assert.equal(normalized, html.replace('content="index, follow"', 'content="noindex, follow"').replace('content="noindex, nofollow"', 'content="noindex, follow"'));
  assert.equal(normalizeDemoRobots(normalized), normalized);
});

test("all 63 accessible projects explicitly opt out of indexing in every language", () => {
  assert.equal(catalog.publicProjects.length, 63);
  for (const project of catalog.publicProjects) {
    assert.equal(project.seoEnabled, false);
    for (const locale of ["ro", "ru", "en"]) {
      const localized = catalog.getProject(locale, project.slug);
      const metadata = policy.projectMetadata(locale, localized);
      assert.deepEqual(metadata.robots, { index: false, follow: true });
      assert.equal(metadata.alternates.canonical, `https://monodev.md/${locale}/projects/${project.slug}`);
      assert.equal(metadata.alternates.languages, undefined);
      assert.equal(metadata.openGraph.alternateLocale, undefined);
      assert.equal(policy.projectStructuredData(locale, localized), null);
      assert.ok(localized.demo && localized.price > 0 && localized.detail.summary);
    }
  }
  assert.ok(routes.indexablePaths().every(path => !path.startsWith("projects/")));
});

test("one explicit future opt-in enables only that project's metadata, schema, sitemap and hreflang", () => {
  // Fixtures only: no catalogue flag is changed on disk or in the shared module.
  const first = catalog.publicProjects[0];
  const enabled = { ...first, seoEnabled: true };
  const projects = catalog.publicProjects.map(project => project.id === first.id ? enabled : project);
  assert.deepEqual(routes.indexablePaths(projects).filter(path => path.startsWith("projects/")), [`projects/${first.slug}`]);
  const headerPaths = routes.noindexProjectPaths(projects);
  assert.equal(headerPaths.length, 62 * 3 * 6);
  const headers = renderHeaders([`/${first.slug}/index.html`], [], headerPaths);
  for (const locale of ["ro", "ru", "en"]) {
    const localized = { ...catalog.getProject(locale, first.slug), seoEnabled: true };
    const metadata = policy.projectMetadata(locale, localized);
    assert.deepEqual(metadata.robots, { index: true, follow: true });
    assert.equal(Object.keys(metadata.alternates.languages).length, 4);
    assert.equal(metadata.alternates.languages["x-default"], `https://monodev.md/en/projects/${first.slug}`);
    const schema = policy.projectStructuredData(locale, localized);
    assert.equal(schema["@type"], "Product");
    assert.equal(schema.offers.price, first.price);
    assert.ok(!headerPaths.some(path => path.startsWith(`/${locale}/projects/${first.slug}`)));
    const other = catalog.getProject(locale, projects[1].slug);
    assert.equal(policy.projectMetadata(locale, other).robots.index, false);
  }
  assert.ok(headers.includes(`/${first.slug}/index.html\n  X-Robots-Tag: noindex, follow`), "Opting in the sales page never indexes its demo");
  for (const seoEnabled of [undefined, null, false, "true", 1]) assert.equal(policy.isProjectSeoEnabled({ seoEnabled }), false);
});

test("disabled project headers cover exported HTML and aliases without affecting assets", () => {
  const paths = routes.noindexProjectPaths();
  const headers = renderHeaders([], [], paths);
  for (const project of catalog.publicProjects) for (const locale of ["ro", "ru", "en"]) {
    const stem = `/${locale}/projects/${project.slug}`;
    for (const suffix of ["", "/", ".html", "/index", "/index/", "/index.html"]) {
      assert.ok(headers.includes(`${stem}${suffix}\n  X-Robots-Tag: noindex, follow\n`));
    }
  }
  assert.ok(paths.every(path => !path.includes("*")));
});
