import assert from "node:assert/strict";
import test from "node:test";
import { auditSeo } from "../scripts/audit-seo.mjs";
import { legacyRedirectRules, demoHtmlPaths, technicalPayloadPaths, renderHeaders } from "../scripts/netlify-seo.mjs";
import { loadSiteModule } from "../scripts/load-site-data.mjs";

test("contact prefill preserves rental tiers and each catalogue instalment term in all languages", () => {
  const { contactOptionLabel, contactRequestMessage } = loadSiteModule("app/lib/contact-request.ts");
  const { installmentPlans } = loadSiteModule("app/lib/project-catalog.ts");
  for (const locale of ["ro", "ru", "en"]) {
    const purchase = contactOptionLabel(locale, "purchase");
    const withServices = contactOptionLabel(locale, "site-rental-with-services");
    const withoutServices = contactOptionLabel(locale, "site-rental-without-services");
    assert.notEqual(withServices, purchase);
    assert.notEqual(withoutServices, purchase);
    assert.notEqual(withServices, withoutServices);
    assert.notEqual(contactOptionLabel(locale, "unknown"), purchase, "Unknown options must not be silently sold as purchase");
    assert.equal(contactOptionLabel(locale, "rent"), contactOptionLabel(locale, "rental"));
    for (const plan of installmentPlans) {
      const option = `installments-${plan.months}-months`;
      const label = contactOptionLabel(locale, option);
      assert.notEqual(label, purchase);
      assert.match(label, new RegExp(`\\b${plan.months}\\b`));
      const message = contactRequestMessage(locale, "MONO demo", option);
      assert.ok(message.includes("MONO demo") && message.includes(label));
    }
  }
});

test("FAQ translations preserve all 100 questions and category order without Romanian fallbacks", () => {
  const { getFaqCategories } = loadSiteModule("app/lib/faq-content.ts");
  const romanian = getFaqCategories("ro");
  const romanianQuestions = romanian.flatMap((group) => group.questions);
  assert.equal(romanianQuestions.length, 100);
  for (const locale of ["ro", "ru", "en"]) {
    const groups = getFaqCategories(locale);
    const questions = groups.flatMap((group) => group.questions);
    assert.equal(groups.length, 10, `${locale}: category count`);
    assert.equal(questions.length, 100, `${locale}: question count`);
    assert.equal(new Set(questions.map((item) => item.question)).size, 100, `${locale}: question uniqueness`);
    assert.deepEqual(groups.map((group) => group.code), romanian.map((group) => group.code));
    for (const [groupIndex, group] of groups.entries()) {
      assert.equal(group.questions.length, romanian[groupIndex].questions.length, `${locale}: preserved category ${group.code}`);
      assert.ok(group.title.trim() && group.description.trim());
      if (locale !== "ro") {
        assert.notEqual(group.title, romanian[groupIndex].title);
        assert.notEqual(group.description, romanian[groupIndex].description);
      }
    }
    questions.forEach((item, index) => {
      assert.ok(item.question.trim() && item.answer.trim(), `${locale}: complete question ${index}`);
      assert.doesNotMatch(`${item.question} ${item.answer}`, /\uFFFD/);
      if (locale !== "ro") {
        assert.notEqual(item.question, romanianQuestions[index].question, `${locale}: translated question ${index}`);
        assert.notEqual(item.answer, romanianQuestions[index].answer, `${locale}: translated answer ${index}`);
      }
      if (locale === "ru") assert.match(item.question, /[А-Яа-яЁё]/u);
      if (locale === "en") assert.doesNotMatch(`${item.question} ${item.answer}`, /[А-Яа-яЁёĂăÂâÎîȘșȚț]/u);
    });
  }
  assert.match(getFaqCategories("en")[4].questions[2].answer, /opens your email application/);
  assert.match(getFaqCategories("ru")[4].questions[2].answer, /открывает почтовую программу/);
});

test("JSON-LD serialization cannot terminate its script element", () => {
  const { serializeJsonLd } = loadSiteModule("app/components/json-ld.tsx");
  const payload = { name: "</script><script>alert(1)</script>", text: "& > \u2028 \u2029" };
  const serialized = serializeJsonLd(payload);
  assert.doesNotMatch(serialized, /[<>&\u2028\u2029]/u);
  assert.deepEqual(JSON.parse(serialized), payload);
});

test("demo noindex covers HTML aliases and keeps project images crawlable", async () => {
  const paths = await demoHtmlPaths();
  for (const required of ["/aquaverde", "/aquaverde/", "/aquaverde/index.html", "/aquaverde/preview.html", "/archicontract/ro", "/archicontract/ro/", "/archicontract/ro/catalog/ac-001", "/archicontract/ro/catalog/ac-001/"]) assert.ok(paths.includes(required), required);
  const payloads = await technicalPayloadPaths();
  const headers = renderHeaders(paths, payloads);
  assert.deepEqual(headers.split("\n").filter((line) => line.startsWith("/") && line.includes("*")), ["/*.rsc"], "Only the targeted RSC extension may use a wildcard");
  assert.doesNotMatch(headers, /^\S*\.(?:webp|png|jpe?g|avif|gif|svg|css|m?js)$/mi);
  assert.ok(payloads.includes("/aquaverde.txt"));
  assert.ok(payloads.includes("/aquaverde/index.txt"));
  assert.ok(payloads.every((pathname) => !pathname.endsWith("/robots.txt")));
  assert.match(headers, /^\/\.vite\/manifest\.json$/m);
});

test("all static public translations contain crawlable SEO, correct schemas, links and sitemap entries", { timeout: 180_000 }, async () => {
  const report = await auditSeo();
  assert.deepEqual(report.issues, [], report.issues.join("\n"));
  assert.ok(report.publicProjects > 0);
  assert.equal(report.sitemapUrls, report.expectedPublicPages);
});

test("legacy redirects map exact query combinations directly and preserve unknown queries", () => {
  const catalog = loadSiteModule("app/lib/project-catalog.ts");
  const rules = legacyRedirectRules({ origin: "https://monodev.md", locales: ["ro", "ru", "en"], projects: catalog.publicProjects, slugs: catalog.projectSlugs });
  // Match Netlify's documented exact-key query semantics, independently of the
  // generation loop, to catch general-rule shadowing and fabricated slug routes.
  function resolve(input) {
    const url = new URL(input, "https://monodev.md");
    for (const rule of rules) {
      if (rule.from.includes("://") || rule.from !== url.pathname) continue;
      const keys = Object.keys(rule.query);
      if (keys.length && (keys.length !== [...url.searchParams.keys()].length || !keys.every((key) => rule.query[key].startsWith(":") ? url.searchParams.has(key) : url.searchParams.get(key) === rule.query[key]))) continue;
      let target = rule.to;
      for (const key of keys) target = target.replaceAll(`:${key}`, url.searchParams.get(key));
      const output = new URL(target);
      if (!target.includes("?")) output.search = url.search;
      return { status: rule.status, location: output.href.replace(/\?$/, "") };
    }
    return null;
  }
  for (const project of catalog.publicProjects) {
    const slug = catalog.projectSlugs[project.id];
    for (const locale of ["ro", "ru", "en"]) {
      assert.deepEqual(resolve(`/?proiect=${slug}&lang=${locale}`), { status: 301, location: `https://monodev.md/${locale}/projects/${slug}` });
      assert.deepEqual(resolve(`/?lang=${locale}&proiect=${slug}`), { status: 301, location: `https://monodev.md/${locale}/projects/${slug}` });
      assert.deepEqual(resolve(`/${locale}?proiect=${slug}`), { status: 301, location: `https://monodev.md/${locale}/projects/${slug}` });
    }
    assert.equal(resolve(`/?proiect=${slug}`).location, `https://monodev.md/ro/projects/${slug}`);
  }
  assert.deepEqual(resolve("/?lang=en"), { status: 301, location: "https://monodev.md/en" });
  assert.equal(resolve("/?proiect=does-not-exist").location, "https://monodev.md/ro?proiect=does-not-exist");
  assert.equal(resolve("/?lang=ru&categorie=medical").location, "https://monodev.md/ro?lang=ru&categorie=medical");
  assert.equal(resolve("/contact?lang=ru&project=71&option=rent").location, "https://monodev.md/ru/contact?project=71&option=rent");
  assert.equal(resolve("/contact?project=71&option=rent").location, "https://monodev.md/ro/contact?project=71&option=rent");
  assert.equal(resolve("/en"), null, "Canonical localized home must not loop");
  assert.ok(rules.every((rule) => rule.status === 301 && rule.force));
});
