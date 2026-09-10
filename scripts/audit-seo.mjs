import { access, readFile, mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { loadSiteModule } from "./load-site-data.mjs";
import { demoDirectories, demoHtmlPaths, technicalPayloadPaths, legacyRedirectRules, renderRedirects, renderHeaders } from "./netlify-seo.mjs";

const ORIGIN = "https://monodev.md";
const LOCALES = ["ro", "ru", "en"];
const HREFLANG = { ro: "ro-MD", ru: "ru-MD", en: "en" };
const normalizeText = (text = "") => text.replace(/\s+/g, " ").trim();
const exists = async (filename) => access(filename).then(() => true, () => false);

export async function exportedFile(buildRoot, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return null; }
  const stem = path.resolve(buildRoot, `.${decoded}`);
  if (stem !== buildRoot && !stem.startsWith(buildRoot + path.sep)) return null;
  for (const candidate of [path.join(stem, "index.html"), `${stem}.html`, stem]) {
    if (await exists(candidate)) {
      // A directory is not an exported response.
      if ((await stat(candidate)).isFile()) return candidate;
    }
  }
  return null;
}

export function expectedRoutes(catalog, serviceData) {
  const services = serviceData.services;
  if (!Array.isArray(services) || !Array.isArray(catalog.publicProjects)) throw new Error("Missing publicProjects/services source arrays");
  const { indexablePaths } = loadSiteModule("app/lib/seo-routes.ts");
  return LOCALES.flatMap(locale => indexablePaths(catalog.publicProjects, services).map(suffix => `/${locale}${suffix ? `/${suffix}` : ""}`));
}

function flattenSchemas(value) {
  if (Array.isArray(value)) return value.flatMap(flattenSchemas);
  if (!value || typeof value !== "object") return [];
  return [value, ...Object.values(value).flatMap(flattenSchemas)];
}

// DOMParser inspects the saved HTML without executing application scripts,
// making a missing SSR description/translation impossible to hide by hydration.
async function parseDocuments(page, documents) {
  return page.evaluate((inputs) => inputs.map(({ pathname, html }) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const all = (selector) => [...doc.querySelectorAll(selector)];
    const meta = (name, attribute = "name") => all(`head meta[${attribute}="${name}"]`).map((node) => node.getAttribute("content") ?? "");
    const scripts = all('script[type="application/ld+json"]').map((node) => node.textContent ?? "");
    const schemas = [], jsonErrors = [];
    for (const text of scripts) { try { schemas.push(JSON.parse(text)); } catch (error) { jsonErrors.push(String(error)); } }
    const clone = doc.body.cloneNode(true);
    clone.querySelectorAll("script,style,template").forEach((node) => node.remove());
    return {
      pathname, lang: doc.documentElement.lang,
      title: all("head title").map((node) => node.textContent ?? ""), description: meta("description"),
      canonical: all('head link[rel="canonical"]').map((node) => node.getAttribute("href")),
      alternates: all('head link[rel="alternate"][hreflang]').map((node) => [node.getAttribute("hreflang"), node.getAttribute("href")]),
      h1: all("h1").map((node) => node.textContent ?? ""), robots: meta("robots"),
      ogImages: meta("og:image", "property"), ogUrls: meta("og:url", "property"),
      viewport: meta("viewport"), twitterCards: meta("twitter:card"), twitterTitles: meta("twitter:title"), twitterDescriptions: meta("twitter:description"), directoryBlocks: all(".catalog-directory").length, schemas, jsonErrors, text: clone.textContent ?? "",
      links: all("a[href]").map((node) => ({ href: node.getAttribute("href"), text: node.textContent?.trim() ?? "" })),
      images: all("main img").map((node) => ({ src: node.getAttribute("src"), alt: node.getAttribute("alt"), width: node.getAttribute("width"), height: node.getAttribute("height") })),
      main: all("main").length, breadcrumbs: all('nav[aria-label]').map((node) => node.getAttribute("aria-label")),
    };
  }), documents);
}

export async function auditSeo({ root = process.cwd(), buildDirectory = "dist/client" } = {}) {
  const buildRoot = path.resolve(root, buildDirectory);
  const issues = [], warnings = [];
  const check = (condition, message) => { if (!condition) issues.push(message); };
  const catalog = loadSiteModule("app/lib/project-catalog.ts", root);
  const serviceData = loadSiteModule("app/lib/services.ts", root);
  const { copy: homeCopy } = loadSiteModule("app/i18n.ts", root);
  const { isProjectSeoEnabled } = loadSiteModule("app/lib/project-seo.ts", root);
  const { noindexProjectPaths } = loadSiteModule("app/lib/seo-routes.ts", root);
  const expected = expectedRoutes(catalog, serviceData);
  const projectRoutes = LOCALES.flatMap(locale => catalog.publicProjects.map(project => `/${locale}/projects/${project.slug}`));
  const allRoutes = [...new Set([...expected, ...projectRoutes])];
  const expectedSet = new Set(expected);
  const prices = JSON.parse(await readFile(path.join(root, "app/project-prices.json"), "utf8"));
  const priceById = new Map(prices.map((item) => [item.id, item.price]));
  const slugs = catalog.publicProjects.map((project) => catalog.projectSlugs[project.id]);
  check(slugs.every((slug) => typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)), "Public project slugs must be stable URL segments");
  check(new Set(slugs).size === slugs.length, "Duplicate public project slugs");
  check(expectedSet.size === expected.length, "Duplicate expected routes");
  const unavailable = new Set(catalog.unavailableProjectIds ?? []);
  for (const project of catalog.publicProjects) check(!unavailable.has(project.id), `Unavailable project ${project.id} is still published as available`);

  const sourceDocuments = [];
  for (const pathname of [...allRoutes, "/cabinet"]) {
    const filename = await exportedFile(buildRoot, pathname);
    if (!filename) { issues.push(`${pathname}: missing static HTML`); continue; }
    const html = await readFile(filename, "utf8");
    check(!html.includes("mono" + "-dev.ro"), `${pathname}: obsolete domain present`);
    sourceDocuments.push({ pathname, html });
  }
  check(await exists(path.join(buildRoot, "404.html")), "Missing exported 404.html (Netlify requires it for the custom 404)");
  const browser = await chromium.launch({ headless: true });
  let parsed = [], sitemapUrls = [];
  try {
    const page = await browser.newPage();
    for (let index = 0; index < sourceDocuments.length; index += 20) parsed.push(...await parseDocuments(page, sourceDocuments.slice(index, index + 20)));
    const sitemapPath = path.join(buildRoot, "sitemap.xml");
    const robotsPath = path.join(buildRoot, "robots.txt");
    check(await exists(robotsPath), "robots.txt missing from static build");
    check(await exists(sitemapPath), "sitemap.xml missing from static build");
    if (await exists(robotsPath)) {
      const robots = await readFile(robotsPath, "utf8");
      check(/^User-agent:\s*\*\s*$/im.test(robots), "robots.txt must declare User-agent: *");
      check(/^Sitemap:\s*https:\/\/monodev\.md\/sitemap\.xml\s*$/im.test(robots), "robots.txt sitemap declaration is wrong");
      check(!/^Disallow:\s*\/\S*\s*$/im.test(robots), "robots.txt must allow public and noindex pages to be crawled");
    }
    if (await exists(sitemapPath)) {
      const sitemap = await readFile(sitemapPath, "utf8");
      const xml = await page.evaluate((content) => {
        const doc = new DOMParser().parseFromString(content, "application/xml");
        return { error: doc.querySelector("parsererror")?.textContent, name: doc.documentElement.localName, namespace: doc.documentElement.namespaceURI,
          alternateGroups: [...doc.getElementsByTagNameNS("http://www.sitemaps.org/schemas/sitemap/0.9", "url")].map(node => ({
            loc: [...node.children].find(child => child.localName === "loc")?.textContent,
            links: [...node.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "link")].map(link => [link.getAttribute("hreflang"), link.getAttribute("href")]),
          })),
          urls: [...doc.getElementsByTagNameNS("http://www.sitemaps.org/schemas/sitemap/0.9", "url")].map((node) => [...node.children].filter((child) => child.localName === "loc").map((child) => child.textContent)) };
      }, sitemap);
      check(!xml.error, `sitemap.xml invalid XML: ${xml.error ?? ""}`);
      check(xml.name === "urlset" && xml.namespace === "http://www.sitemaps.org/schemas/sitemap/0.9", "sitemap.xml must use the sitemap urlset namespace");
      check(xml.urls.every((items) => items.length === 1), "Every sitemap url requires exactly one loc");
      sitemapUrls = xml.urls.flat();
      for (const group of xml.alternateGroups) {
        const { alternateLanguages } = loadSiteModule("app/lib/site-config.ts", root);
        const suffix = new URL(group.loc).pathname.split("/").slice(2).join("/");
        const desired = alternateLanguages(suffix);
        check(group.links.length === 4 && group.links.every(([language, href]) => desired[language] === href && sitemapUrls.includes(href)), `Incorrect/nonindexable sitemap hreflang group: ${group.loc}`);
      }
      check(new Set(sitemapUrls).size === sitemapUrls.length, "sitemap.xml contains duplicate URLs");
      for (const value of sitemapUrls) {
        let url;
        try { url = new URL(value); } catch { issues.push(`Invalid sitemap URL: ${value}`); continue; }
        check(url.origin === ORIGIN && !url.search && !url.hash && expectedSet.has(url.pathname), `Noncanonical/noindex/unexpected sitemap URL: ${value}`);
      }
      for (const pathname of expected) check(sitemapUrls.includes(`${ORIGIN}${pathname}`), `Missing sitemap page: ${pathname}`);
    }
  } finally { await browser.close(); }

  const incoming = new Map(expected.map((pathname) => [pathname, new Set()]));
  const metadataByRoute = new Map(parsed.map((document) => [document.pathname, document]));
  const titleOwners = new Map(), descriptionOwners = new Map();
  for (const doc of parsed) {
    const pathname = doc.pathname;
    if (pathname === "/cabinet") {
      check(doc.robots.some((value) => /\bnoindex\b/i.test(value) && /\bnofollow\b/i.test(value)), "/cabinet: initial HTML must have explicit noindex, nofollow");
      continue;
    }
    const locale = pathname.split("/")[1];
    const canonical = `${ORIGIN}${pathname}`;
    const indexed = expectedSet.has(pathname);
    check(doc.lang === locale, `${pathname}: html lang is ${doc.lang}, expected ${locale}`);
    for (const [name, values] of [["title", doc.title], ["description", doc.description]]) {
      check(values.length === 1 && normalizeText(values[0]).length > 0, `${pathname}: exactly one nonempty ${name} required in head`);
      check(!values.some((value) => /localhost|127\.0\.0\.1|\.netlify\.app/i.test(value)), `${pathname}: development host in metadata`);
      const owners = name === "title" ? titleOwners : descriptionOwners;
      const value = normalizeText(values[0]);
      check(!/\?{2,}|[a-z]\?[a-z]|\uFFFD/i.test(value), `${pathname}: possible damaged encoding in ${name}`);
      if (locale === "ru") check(/[А-Яа-яЁё]/u.test(value), `${pathname}: Russian ${name} must be localized`);
      if (value) { check(!owners.has(value), `${pathname}: duplicate ${name} with ${owners.get(value)}`); owners.set(value, pathname); }
    }
    check(doc.canonical.length === 1 && doc.canonical[0] === canonical, `${pathname}: canonical must be exactly ${canonical}`);
    check(doc.ogUrls.length === 1 && doc.ogUrls[0] === canonical, `${pathname}: Open Graph URL must equal canonical`);
    check(doc.h1.length === 1 && normalizeText(doc.h1[0]), `${pathname}: expected one nonempty H1, got ${doc.h1.length}`);
    check(doc.main === 1, `${pathname}: expected one main landmark`);
    const directives = doc.robots.join(", ").toLowerCase().split(/[,\s]+/);
    check(directives.includes(indexed ? "index" : "noindex") && directives.includes("follow") && !directives.includes("nofollow") && !directives.includes(indexed ? "noindex" : "index"), `${pathname}: expected ${indexed ? "index" : "noindex"}, follow without contradictory directives`);
    check(!doc.viewport.some((value) => /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(?:\D|$)/i.test(value)), `${pathname}: viewport prevents accessible zoom`);
    check(!/�|(?:Ã.|Ä[ƒƒ]|È[™›]|Ð[\u0080-\u00bf]|Ñ[\u0080-\u00bf])/.test(doc.text), `${pathname}: possible corrupted text encoding in initial HTML`);
    check(doc.alternates.length === (indexed ? 4 : 0), `${pathname}: expected ${indexed ? "four" : "no"} hreflang links`);
    const suffix = pathname.slice(locale.length + 1);
    const alternates = Object.fromEntries(doc.alternates);
    for (const targetLocale of LOCALES) {
      const target = `/${targetLocale}${suffix}`;
      if (indexed) check(alternates[HREFLANG[targetLocale]] === `${ORIGIN}${target}`, `${pathname}: missing/incorrect ${HREFLANG[targetLocale]} alternate`);
      const reciprocal = metadataByRoute.get(target);
      if (indexed) check(reciprocal && Object.fromEntries(reciprocal.alternates)[HREFLANG[locale]] === canonical, `${pathname}: ${target} hreflang is not reciprocal`);
      check(doc.links.some(({ href }) => href === target || href === `${ORIGIN}${target}`), `${pathname}: language selector lacks real link to ${target}`);
    }
    if (indexed) check(alternates["x-default"] === `${ORIGIN}/en${suffix}`, `${pathname}: x-default must target the equivalent English page`);
    check(doc.twitterCards.length === 1 && doc.twitterCards[0] === "summary_large_image", `${pathname}: missing Twitter Card`);
    check(doc.twitterTitles[0] === doc.title[0] && doc.twitterDescriptions[0] === doc.description[0], `${pathname}: Twitter metadata must match title/description`);
    check(doc.ogImages.length > 0, `${pathname}: missing Open Graph image`);
    for (const image of doc.ogImages) {
      let url;
      try { url = new URL(image); } catch { issues.push(`${pathname}: OG image is not absolute: ${image}`); continue; }
      check(url.origin === ORIGIN, `${pathname}: OG image must use canonical host`);
      check(Boolean(await exportedFile(buildRoot, url.pathname)), `${pathname}: OG image file absent: ${url.pathname}`);
    }
    check(doc.jsonErrors.length === 0, `${pathname}: invalid JSON-LD: ${doc.jsonErrors.join(", ")}`);
    const schemas = doc.schemas.flatMap(flattenSchemas);
    const typed = (type) => schemas.filter((schema) => schema["@type"] === type || (Array.isArray(schema["@type"]) && schema["@type"].includes(type)));
    check(doc.schemas.length > 0, `${pathname}: JSON-LD missing`);
    check(!schemas.some((schema) => ["Review", "AggregateRating", "LocalBusiness"].includes(schema["@type"])), `${pathname}: unsupported review/rating/local business schema`);
    const ids = schemas.map((schema) => schema["@id"]).filter((id, index) => id && Object.keys(schemas[index]).length > 1);
    check(new Set(ids).size === ids.length, `${pathname}: duplicate JSON-LD entity definition`);
    for (const schema of schemas) {
      if (schema.url) {
        try { check(new URL(schema.url).origin === ORIGIN, `${pathname}: noncanonical JSON-LD URL ${schema.url}`); }
        catch { issues.push(`${pathname}: relative/invalid JSON-LD URL ${schema.url}`); }
      }
      for (const key of ["@id", "item", "image", "logo"]) {
        const values = Array.isArray(schema[key]) ? schema[key] : [schema[key]];
        for (const value of values.filter((value) => typeof value === "string")) {
          try { check(new URL(value).origin === ORIGIN, `${pathname}: noncanonical JSON-LD ${key}: ${value}`); }
          catch { issues.push(`${pathname}: relative/invalid JSON-LD ${key}: ${value}`); }
        }
      }
    }
    if (!suffix) {
      check(doc.directoryBlocks === 0, `${pathname}: removed catalog-directory is present`);
      check(typed("Organization").length === 1, `${pathname}: expected one Organization`);
      check(typed("WebSite").length === 1, `${pathname}: expected one WebSite`);
      check(normalizeText(doc.text).includes(normalizeText(homeCopy[locale].heroText)), `${pathname}: localized homepage introduction missing from initial HTML`);
    }
    else check(typed("BreadcrumbList").length === 1, `${pathname}: expected one BreadcrumbList`);
    if (suffix.startsWith("/services/")) {
      check(typed("Service").length === 1, `${pathname}: expected one Service`);
      const content = serviceData.services.find((service) => service.slug === suffix.split("/")[2])?.content[locale];
      for (const value of [content?.intro, content?.problem, ...(content?.included ?? [])]) check(Boolean(value) && normalizeText(doc.text).includes(normalizeText(value)), `${pathname}: localized service content missing from initial HTML`);
    }
    if (suffix === "/intrebari") check(typed("FAQPage").length === 1, `${pathname}: expected one FAQPage`);
    for (const question of typed("Question")) {
      check(normalizeText(doc.text).includes(normalizeText(question.name)), `${pathname}: FAQ question not visible in initial HTML`);
      check(normalizeText(doc.text).includes(normalizeText(question.acceptedAnswer?.text)), `${pathname}: FAQ answer not visible in initial HTML`);
    }
    if (suffix.startsWith("/projects/")) {
      const slug = suffix.split("/")[2];
      const project = catalog.publicProjects.find((item) => catalog.projectSlugs[item.id] === slug);
      const localized = catalog.getProject(locale, slug);
      check(project?.price === priceById.get(project?.id) && doc.text.includes(`€${project?.price}`), `${pathname}: displayed price must match the commercial catalog`);
      for (const value of [localized?.detail.summary, ...(localized?.detail.sections.flatMap((section) => section.items) ?? [])]) check(Boolean(value) && normalizeText(doc.text).includes(normalizeText(value)), `${pathname}: localized project content missing from initial HTML`);
      const products = typed("Product");
      if (isProjectSeoEnabled(project)) {
      check(products.length === 1, `${pathname}: expected one Product`);
      const offer = products[0]?.offers;
      check(offer?.["@type"] === "Offer", `${pathname}: Product requires Offer`);
      check(Number(offer?.price) === priceById.get(project?.id), `${pathname}: Offer price does not match project-prices.json`);
      check(offer?.priceCurrency === "EUR", `${pathname}: Offer currency must match existing EUR catalog prices`);
      check(offer?.availability === "https://schema.org/InStock", `${pathname}: public available project requires InStock`);
      } else {
        check(products.length === 0 && typed("Offer").length === 0, `${pathname}: noindex project must not publish Product/Offer`);
      }
      for (const image of doc.images) {
        check(typeof image.alt === "string" && image.alt.trim().length > 0, `${pathname}: project image needs descriptive alt`);
        check(Number(image.width) > 0 && Number(image.height) > 0, `${pathname}: project image missing width/height`);
      }
    }
    for (const link of doc.links) {
      if (!link.href || /^(mailto:|tel:|data:|javascript:)/i.test(link.href)) continue;
      let url;
      try { url = new URL(link.href, canonical); } catch { issues.push(`${pathname}: invalid link ${link.href}`); continue; }
      if (url.origin !== ORIGIN) continue;
      check(!url.searchParams.has("lang") && !url.searchParams.has("proiect"), `${pathname}: navigation still uses legacy SEO query ${link.href}`);
      const target = url.pathname.replace(/\/$/, "") || "/";
      if (target !== pathname && incoming.has(target)) incoming.get(target).add(pathname);
      if (["/", "/contact", "/intrebari"].includes(target)) continue;
      check(Boolean(await exportedFile(buildRoot, url.pathname)), `${pathname}: broken internal link ${link.href}`);
    }
  }
  for (const [pathname, sources] of incoming) check(sources.size > 0, `${pathname}: orphan page, no incoming crawlable internal links`);

  const directories = await demoDirectories(root);
  const htmlPaths = await demoHtmlPaths(root, directories);
  const payloadPaths = await technicalPayloadPaths(root);
  const expectedHeaders = renderHeaders(htmlPaths, payloadPaths, noindexProjectPaths(catalog.publicProjects));
  const demoMeta = { html: 0, explicitNoindex: 0, headerOnly: 0 };
  for (const pathname of htmlPaths.filter(pathname => pathname.endsWith(".html"))) {
    const filename = await exportedFile(buildRoot, pathname);
    check(Boolean(filename), `Demo HTML missing: ${pathname}`);
    if (!filename) continue;
    const html = await readFile(filename, "utf8");
    const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
    const robots = tags.filter(tag => /name\s*=\s*["'](?:robots|googlebot)["']/i.test(tag)).map(tag => tag.match(/content\s*=\s*["']([^"']*)/i)?.[1] ?? "");
    demoMeta.html++;
    if (robots.some(value => /\bnoindex\b/i.test(value))) demoMeta.explicitNoindex++; else demoMeta.headerOnly++;
    check(!robots.some(value => /(?:^|[,\s])(?:index|all)(?:$|[,\s])/i.test(value)), `${pathname}: demo meta contradicts noindex header`);
    check(expectedHeaders.includes(`${pathname}\n  X-Robots-Tag: noindex, follow`), `${pathname}: demo lacks noindex header`);
  }
  check(htmlPaths.every((pathname) => !/\.(?:webp|png|jpe?g|avif|gif|svg|css|m?js)$/i.test(pathname)), "Demo noindex must not cover images, CSS or JavaScript");
  const expectedRedirects = renderRedirects(legacyRedirectRules({ origin: ORIGIN, locales: LOCALES, projects: catalog.publicProjects, slugs: catalog.projectSlugs }));
  for (const [filename, content] of [["_headers", expectedHeaders], ["_redirects", expectedRedirects]]) {
    check(await exists(path.join(buildRoot, filename)), `${filename} missing from static build`);
    if (await exists(path.join(buildRoot, filename))) check(await readFile(path.join(buildRoot, filename), "utf8") === content, `${filename} differs from current source configuration; regenerate and rebuild`);
  }
  const netlify = await readFile(path.join(root, "netlify.toml"), "utf8");
  check(!/\[\[redirects\]\]/.test(netlify), "Duplicate Netlify redirect implementation in netlify.toml");
  check(!/^\/\*\s+\S+\s+200!?\s*$/m.test(expectedRedirects), "Catch-all 200 rewrite would produce soft 404s");
  warnings.push("Production HTTP 301/noindex headers/404 status require the postdeployment HTTP audit; local static HTML cannot prove CDN responses.");
  return { checkedAt: new Date().toISOString(), buildDirectory, pages: parsed.length, expectedPublicPages: expected.length, noindexProjectPages: projectRoutes.filter(route => !expectedSet.has(route)).length, demoMeta, publicProjects: slugs.length, sitemapUrls: sitemapUrls.length, demoDirectoriesProtected: directories.length, noindexHtmlPaths: htmlPaths.length, technicalPayloadPaths: payloadPaths.length, issues: [...new Set(issues)], warnings };
}

export async function auditProduction(base = ORIGIN) {
  if (new URL(base).origin !== ORIGIN) throw new Error("Production audit only accepts the canonical MONO/DEV origin");
  const checks = [];
  const catalog = loadSiteModule("app/lib/project-catalog.ts");
  const { services } = loadSiteModule("app/lib/services.ts");
  const { isProjectSeoEnabled } = loadSiteModule("app/lib/project-seo.ts");
  const samples = LOCALES.flatMap((locale, index) => [[`/${locale}/projects/${catalog.publicProjects[index].slug}`, 200], [`/${locale}/services/${services[index].slug}`, 200], [`/${locale}/contact`, 200], [`/${locale}/intrebari`, 200]]);
  for (const [pathname, status] of [["/ro", 200], ["/ru", 200], ["/en", 200], ["/robots.txt", 200], ["/sitemap.xml", 200], ["/__seo_missing_page_9b723a__", 404], ...samples]) {
    const response = await fetch(`${base}${pathname}`, { redirect: "manual", signal: AbortSignal.timeout(15_000) });
    checks.push({ url: `${base}${pathname}`, expected: status, actual: response.status, pass: response.status === status });
    if (pathname.includes("/projects/")) {
      const project = catalog.publicProjects.find(project => pathname.endsWith(`/${project.slug}`));
      const indexed = isProjectSeoEnabled(project);
      const html = await response.text();
      const meta = html.match(/<meta\b(?=[^>]*name=["']robots["'])[^>]*content=["']([^"']*)/i)?.[1] ?? "";
      const header = response.headers.get("x-robots-tag") ?? "";
      checks.push({ url: `${base}${pathname}`, expected: indexed ? "index, follow; no noindex header" : "noindex, follow in HTML and header", actual: { meta, header }, pass: indexed ? /\bindex\b/.test(meta) && !/noindex/.test(header) : /noindex/.test(meta) && /\bfollow\b/.test(meta) && /noindex/.test(header) && /\bfollow\b/.test(header) && !/nofollow/.test(`${meta} ${header}`) });
    }
    if (pathname === "/sitemap.xml") {
      const xml = await response.text();
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]).sort();
      const expected = expectedRoutes(catalog, { services }).map(route => `${base}${route}`).sort();
      checks.push({ url: `${base}${pathname}`, expected: expected.length, actual: urls.length, pass: JSON.stringify(urls) === JSON.stringify(expected) });
    }
  }
  const slug = catalog.publicProjects[0].slug;
  for (const [url, destination] of [[`${base}/`, `${base}/ro`], [`${base}/?lang=ru`, `${base}/ru`], [`${base}/?lang=en&proiect=${slug}`, `${base}/en/projects/${slug}`], [`${base}/?proiect=${slug}&lang=en`, `${base}/en/projects/${slug}`], ["https://www.monodev.md/", `${base}/ro`], ["http://monodev.md/", `${base}/ro`]]) {
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15_000) });
    const location = response.headers.get("location")?.replace(/\?$/, "");
    checks.push({ url, expected: `301 ${destination}`, actual: `${response.status} ${location}`, pass: response.status === 301 && location === destination });
  }
  const demo = catalog.projectPaths[catalog.publicProjects[0].id].replace(/\/$/, "");
  for (const pathname of ["/cabinet", demo, `${demo}/`, `${demo}/index.html`, `${demo}/preview`, `${demo}/preview.html`]) {
    const response = await fetch(`${base}${pathname}`, { redirect: "manual", signal: AbortSignal.timeout(15_000) });
    const robots = response.headers.get("x-robots-tag") ?? "";
    const follow = pathname === "/cabinet" ? "nofollow" : "follow";
    checks.push({ url: `${base}${pathname}`, expected: `X-Robots-Tag: noindex, ${follow}`, actual: robots, pass: /noindex/i.test(robots) && robots.split(/[,\s]+/).includes(follow) });
  }
  const screenshot = catalog.getProject("ro", slug)?.image?.src;
  if (screenshot) {
    const response = await fetch(`${base}${screenshot}`, { redirect: "manual", signal: AbortSignal.timeout(15_000) });
    checks.push({ url: `${base}${screenshot}`, expected: "200, no noindex on the project image", actual: `${response.status} ${response.headers.get("x-robots-tag") ?? ""}`, pass: response.status === 200 && !/noindex/i.test(response.headers.get("x-robots-tag") ?? "") });
  }
  return { checkedAt: new Date().toISOString(), checks, issues: checks.filter((check) => !check.pass) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const production = process.argv.includes("--production");
  const report = production ? await auditProduction() : await auditSeo();
  await mkdir("reports/seo", { recursive: true });
  await writeFile(`reports/seo/${production ? "production" : "static"}-audit.json`, JSON.stringify(report, null, 2) + "\n", "utf8");
  console.log(JSON.stringify(report, null, 2));
  if (report.issues.length) process.exitCode = 1;
}
