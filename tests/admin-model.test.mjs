import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadSiteModule } from "../scripts/load-site-data.mjs";
const cms = loadSiteModule("app/lib/cms-store.ts");
const catalog = loadSiteModule("app/lib/project-catalog.ts");
test("price validation rejects invalid discounts, blanks, negative and non-finite prices", () => {
  for (const p of [
    { standard: -1, discounted: null, enabled: false },
    { standard: NaN, discounted: null, enabled: false },
    { standard: 1500, discounted: 0, enabled: true },
    { standard: 1500, discounted: 1500, enabled: true },
    { standard: 1500, discounted: null, enabled: true },
    { standard: Infinity, discounted: 1, enabled: false },
  ])
    assert.ok(cms.validatePrice(p));
  assert.equal(
    cms.validatePrice({ standard: 1500, discounted: 1200, enabled: true }),
    null,
  );
  assert.equal(
    cms.validatePrice({ standard: 0, discounted: null, enabled: false }),
    null,
  );
});
test("live catalog, detail and payment calculations share effective prices without changing standard", () => {
  cms.publishCms({});
  const project = catalog.publicProjects[0],
    original = project.price;
  cms.publishCms({
    [`price-${project.id}`]: {
      revision: 1,
      standard: 1500,
      discounted: 1200,
      enabled: true,
    },
  });
  assert.equal(project.price, 1200);
  assert.equal(catalog.getProject("ro", project.slug).price, 1200);
  assert.equal(catalog.monthlyRentalPrice(project.price), 66);
  cms.publishCms({
    [`price-${project.id}`]: {
      revision: 2,
      standard: 1500,
      discounted: 1200,
      enabled: false,
    },
  });
  assert.equal(project.price, 1500);
  assert.equal(cms.projectPrice(project.id, original).standard, 1500);
  cms.publishCms({});
  assert.equal(project.price, original);
});
test("payment settings update installment terms and monthly rental calculations", () => {
  cms.publishCms({
    "text-payment-settings": {
      revision: 1,
      values: {
        plan1Months: "4",
        plan1Surcharge: "2",
        plan2Months: "8",
        plan2Surcharge: "6",
        plan3Months: "16",
        plan3Surcharge: "10",
        plan4Months: "24",
        plan4Surcharge: "12",
        rentalMonths: "24",
        rentalHosting: "12",
        rentalMaintenance: "23",
        rentalSecurity: "5",
      },
    },
  });
  assert.deepEqual(catalog.installmentPlans(), [
    { months: 4, surcharge: 0.02 },
    { months: 8, surcharge: 0.06 },
    { months: 16, surcharge: 0.1 },
    { months: 24, surcharge: 0.12 },
  ]);
  assert.equal(catalog.monthlyRentalPrice(1000), 41);
  assert.equal(catalog.annualInstallmentPrice(1000), 46);
  assert.equal(cms.paymentSettings().rentalMonths, 24);
  assert.deepEqual(cms.paymentSettings().rentalServices, [
    { name: "Găzduire web", price: 12 },
    { name: "Mentenanță tehnică", price: 23 },
    { name: "Securitate și backup", price: 5 },
  ]);
  cms.publishCms({});
});
test("payment settings accept more than eight installment plans", () => {
  const values = Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => [
      [`plan${index + 1}Months`, String((index + 1) * 3)],
      [`plan${index + 1}Surcharge`, String(index)],
    ]).flat(),
  );
  cms.publishCms({ "text-payment-settings": { revision: 1, values } });
  assert.equal(cms.paymentSettings().installmentPlans.length, 10);
  assert.equal(cms.paymentSettings().installmentPlans.at(-1).months, 30);
  cms.publishCms({});
});
test("text edits remain reactive through nested arrays and preserve deliberately empty text", () => {
  const data = cms.cmsContent("example", {
    ro: { title: "Titlu", lines: ["Original"] },
  });
  cms.publishCms({
    "text-example": {
      revision: 1,
      values: { "ro.title": "", "ro.lines.0": "Editat" },
    },
  });
  assert.equal(data.ro.title, "");
  assert.deepEqual([...data.ro.lines], ["Editat"]);
  cms.publishCms({});
  assert.equal(data.ro.title, "Titlu");
});
test("derived FAQ and project translations are editable, with no source mutation", () => {
  const faq = loadSiteModule("app/lib/faq-content.ts");
  const before = faq.getFaqCategories("en")[0].questions[0].answer;
  cms.publishCms({
    "text-faq-translations-translatedFaqCategories": {
      revision: 1,
      values: { "en.0.questions.0.answer": "Updated answer" },
    },
  });
  assert.equal(
    faq.getFaqCategories("en")[0].questions[0].answer,
    "Updated answer",
  );
  cms.publishCms({});
  assert.equal(faq.getFaqCategories("en")[0].questions[0].answer, before);
});
test("empty media explicitly removes the default; unsafe image schemes are ignored", () => {
  cms.publishCms({ "media-example": { revision: 1, images: [] } });
  assert.deepEqual(cms.slotImages("example"), []);
  cms.publishCms({
    "media-example": {
      revision: 2,
      images: [
        { src: "javascript:alert(1)", alt: "bad" },
        { src: "//evil.example/image", alt: "bad" },
      ],
    },
  });
  assert.deepEqual(cms.slotImages("example"), []);
  cms.publishCms({});
  assert.equal(cms.slotImages("example"), undefined);
});
test("registry preserves thousands of defaults, unique document IDs and every catalog project", () => {
  const registry = JSON.parse(
    readFileSync("app/admin/content-registry.json", "utf8"),
  );
  assert.equal(new Set(registry.map((g) => g.id)).size, registry.length);
  assert.ok(
    registry.reduce((sum, g) => sum + Object.keys(g.fields).length, 0) > 5000,
  );
  for (const p of catalog.projects)
    assert.equal(
      registry.find((g) => g.id === `text-project-${p.id}`).fields.title,
      p.title,
    );
  for (const g of registry) {
    assert.equal(g.site, "monodev-catalog");
    assert.match(g.source, /^app\//);
    assert.doesNotMatch(g.source, /^app\/admin\//);
    assert.doesNotMatch(g.source, /(^|\/)public\//);
    assert.match(g.id, /^text-[a-zA-Z0-9_-]+$/);
    assert.ok(Buffer.byteLength(JSON.stringify(g.fields)) < 850000);
  }
});
