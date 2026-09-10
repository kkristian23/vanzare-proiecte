# Inventarul fișierelor pentru implementarea SEO

Inventar realizat la 10 septembrie 2026 din `git diff --name-only` și `git ls-files --others --exclude-standard`. „Creat” înseamnă fișier nou, încă neurmărit de Git; „Modificat” înseamnă fișier urmărit cu modificări locale. Inventarul nu reprezintă un commit sau un deploy.

Sunt listate **231 de fișiere** aferente implementării și verificărilor, inclusiv **23 de capturi WebP noi** și **90 de variante responsive pentru carduri**. Rapoartele pot fi regenerate de verificările finale fără schimbarea căilor. Rezultatele și limitele verificărilor sunt descrise în [raportul implementării](../SEO_IMPLEMENTATION_REPORT.md).

## Modificări preexistente păstrate

Aceste fișiere erau deja modificate înaintea intervenției și nu sunt contabilizate drept livrabile noi ale sarcinii:

- `reports/project-image-optimization.json` — raportul utilizatorului a fost păstrat.
- `graphify-out/graph.json`
- `graphify-out/GRAPH_REPORT.md`
- `graphify-out/reflections/LESSONS.md`

Actualizarea finală `graphify update .` s-a încheiat cu cod 0: 1.415 noduri, 2.767 muchii și 111 comunități. Au fost reîmprospătate `graphify-out/graph.json` și `graphify-out/GRAPH_REPORT.md`; modificările preexistente din `graphify-out/reflections/LESSONS.md` au fost păstrate. Copiile de siguranță automate și locale rămân în directoarele ignorate de Git. Actualizarea a folosit numai analiza AST; 31 de fișiere JSON și alte fișiere fără noduri AST, precum și etichetele de comunități rămase din analiza anterioară, sunt documentate ca limitări în raportul implementării.

## Cod și stiluri (51)

| Statut | Fișier |
| --- | --- |
| Creat | `app/[locale]/about/page.tsx` |
| Creat | `app/[locale]/contact/page.tsx` |
| Creat | `app/[locale]/cookies/page.tsx` |
| Creat | `app/[locale]/intrebari/page.tsx` |
| Creat | `app/[locale]/layout.tsx` |
| Creat | `app/[locale]/page.tsx` |
| Creat | `app/[locale]/privacy/page.tsx` |
| Creat | `app/[locale]/process/page.tsx` |
| Creat | `app/[locale]/projects/[slug]/page.tsx` |
| Creat | `app/[locale]/services/[slug]/page.tsx` |
| Creat | `app/[locale]/services/page.tsx` |
| Creat | `app/[locale]/terms/page.tsx` |
| Creat | `app/analytics-consent.css` |
| Creat | `app/base.css` |
| Modificat | `app/brand-logo.tsx` |
| Modificat | `app/cabinet/layout.tsx` |
| Modificat | `app/cabinet/page.tsx` |
| Creat | `app/components/analytics-consent.tsx` |
| Creat | `app/components/html-document.tsx` |
| Creat | `app/components/json-ld.tsx` |
| Creat | `app/components/seo-shell.tsx` |
| Creat | `app/components/trust-page.tsx` |
| Creat | `app/contact/contact-client.tsx` |
| Modificat | `app/contact/contact.css` |
| Modificat | `app/contact/layout.tsx` |
| Modificat | `app/contact/page.tsx` |
| Modificat | `app/globals.css` |
| Creat | `app/home-client.tsx` |
| Creat | `app/home-hero.css` |
| Modificat | `app/i18n.ts` |
| Creat | `app/intrebari/faq-client.tsx` |
| Modificat | `app/intrebari/page.tsx` |
| Modificat | `app/layout.tsx` |
| Creat | `app/lib/analytics.ts` |
| Creat | `app/lib/contact-request.ts` |
| Creat | `app/lib/faq-content.ts` |
| Creat | `app/lib/faq-translations.ts` |
| Creat | `app/lib/faq-ui.ts` |
| Creat | `app/lib/legacy-project-translations.ts` |
| Creat | `app/lib/project-card-images.ts` |
| Creat | `app/lib/project-catalog.ts` |
| Creat | `app/lib/project-images.ts` |
| Creat | `app/lib/services.ts` |
| Creat | `app/lib/site-config.ts` |
| Creat | `app/lib/trust-content.ts` |
| Modificat | `app/live-project-preview.tsx` |
| Creat | `app/not-found.tsx` |
| Modificat | `app/page-language-switch.css` |
| Modificat | `app/page.tsx` |
| Creat | `app/project-pages.css` |
| Creat | `app/seo-pages.css` |

## Configurație și fișiere SEO publice (10)

| Statut | Fișier |
| --- | --- |
| Creat | `.env.example` |
| Modificat | `.gitignore` |
| Modificat | `eslint.config.mjs` |
| Modificat | `netlify.toml` |
| Modificat | `package.json` |
| Creat | `public/_headers` |
| Creat | `public/_redirects` |
| Creat | `public/robots.txt` |
| Creat | `public/site.webmanifest` |
| Creat | `public/sitemap.xml` |

## Scripturi de build, sincronizare și audit (12)

| Statut | Fișier |
| --- | --- |
| Modificat | `scripts/audit-findings-recheck.mjs` |
| Modificat | `scripts/audit-interactions-recheck.mjs` |
| Creat | `scripts/audit-seo.mjs` |
| Modificat | `scripts/audit-translations.mjs` |
| Creat | `scripts/generate-project-card-images.mjs` |
| Creat | `scripts/generate-seo.mjs` |
| Modificat | `scripts/integrate-new-projects.mjs` |
| Creat | `scripts/load-site-data.mjs` |
| Creat | `scripts/netlify-seo.mjs` |
| Creat | `scripts/normalize-showcase-interactions.mjs` |
| Creat | `scripts/serve-seo.mjs` |
| Modificat | `scripts/sync-showcase.mjs` |

## Teste (7)

| Statut | Fișier |
| --- | --- |
| Creat | `tests/normalize-showcase-interactions.test.mjs` |
| Modificat | `tests/rendered-html.test.mjs` |
| Creat | `tests/seo-browser.test.mjs` |
| Creat | `tests/seo.test.mjs` |
| Modificat | `tests/showcase-archi-actions.test.mjs` |
| Creat | `tests/showcase-archi-navigation.test.mjs` |
| Modificat | `tests/showcase-favicons.test.mjs` |

## Capturi reale noi ale proiectelor (23)

Capturile reprezintă demonstrații existente, nu imagini inventate ori lucrări atribuite unor clienți. Primele 18 capturi au fost completate cu AquaVerde, EcoHabitat, GazonPro, TerraForma și YardCraft. Imaginile originale nu au fost înlocuite.

| Statut | Fișier |
| --- | --- |
| Creat | `public/project-previews/aquaverde-screenshot.webp` |
| Creat | `public/project-previews/archicontract-screenshot.webp` |
| Creat | `public/project-previews/atelier-noire-screenshot.webp` |
| Creat | `public/project-previews/audio-rental-md-screenshot.webp` |
| Creat | `public/project-previews/contor-acasa-screenshot.webp` |
| Creat | `public/project-previews/ecohabitat-screenshot.webp` |
| Creat | `public/project-previews/elan-screenshot.webp` |
| Creat | `public/project-previews/fixora-screenshot.webp` |
| Creat | `public/project-previews/forma-living-screenshot.webp` |
| Creat | `public/project-previews/gazonpro-screenshot.webp` |
| Creat | `public/project-previews/iqcalendar-screenshot.webp` |
| Creat | `public/project-previews/market9000-screenshot.webp` |
| Creat | `public/project-previews/micora-screenshot.webp` |
| Creat | `public/project-previews/neo-booking-screenshot.webp` |
| Creat | `public/project-previews/neobarberclub-screenshot.webp` |
| Creat | `public/project-previews/noma-screenshot.webp` |
| Creat | `public/project-previews/nord-and-oak-screenshot.webp` |
| Creat | `public/project-previews/pophaus-screenshot.webp` |
| Creat | `public/project-previews/rentech-screenshot.webp` |
| Creat | `public/project-previews/studio-forma-screenshot.webp` |
| Creat | `public/project-previews/studio-velora-screenshot.webp` |
| Creat | `public/project-previews/terraforma-screenshot.webp` |
| Creat | `public/project-previews/yardcraft-screenshot.webp` |

## Variante responsive pentru cardurile catalogului (90)

Pentru 45 de surse existente au fost generate câte două variante WebP, la 480 și 800 px, fără mărirea imaginilor și cu parametrul de calitate 86. Sursele originale sunt păstrate. Maparea cu dimensiuni și srcset este în `app/lib/project-card-images.ts`; generatorul este `scripts/generate-project-card-images.mjs`, iar raportul tehnic este `reports/seo/project-card-images.json`.

| Statut | Fișier |
| --- | --- |
| Creat | `public/project-card-previews/01-eventora-480.webp` |
| Creat | `public/project-card-previews/01-eventora-800.webp` |
| Creat | `public/project-card-previews/02-scena-city-480.webp` |
| Creat | `public/project-card-previews/02-scena-city-800.webp` |
| Creat | `public/project-card-previews/03-pulse-tickets-480.webp` |
| Creat | `public/project-card-previews/03-pulse-tickets-800.webp` |
| Creat | `public/project-card-previews/04-clinica-nova-480.webp` |
| Creat | `public/project-card-previews/04-clinica-nova-800.webp` |
| Creat | `public/project-card-previews/05-laboris-480.webp` |
| Creat | `public/project-card-previews/05-laboris-800.webp` |
| Creat | `public/project-card-previews/06-doctor-aproape-480.webp` |
| Creat | `public/project-card-previews/06-doctor-aproape-800.webp` |
| Creat | `public/project-card-previews/07-med-slot-480.webp` |
| Creat | `public/project-card-previews/07-med-slot-800.webp` |
| Creat | `public/project-card-previews/08-lead-pilot-480.webp` |
| Creat | `public/project-card-previews/08-lead-pilot-800.webp` |
| Creat | `public/project-card-previews/09-growth-desk-480.webp` |
| Creat | `public/project-card-previews/09-growth-desk-800.webp` |
| Creat | `public/project-card-previews/10-closeflow-480.webp` |
| Creat | `public/project-card-previews/10-closeflow-800.webp` |
| Creat | `public/project-card-previews/11-partmatch-480.webp` |
| Creat | `public/project-card-previews/11-partmatch-800.webp` |
| Creat | `public/project-card-previews/12-garage-box-480.webp` |
| Creat | `public/project-card-previews/12-garage-box-800.webp` |
| Creat | `public/project-card-previews/13-motor-supply-480.webp` |
| Creat | `public/project-card-previews/13-motor-supply-800.webp` |
| Creat | `public/project-card-previews/14-auto-grid-480.webp` |
| Creat | `public/project-card-previews/14-auto-grid-800.webp` |
| Creat | `public/project-card-previews/15-park-suites-demo-480.webp` |
| Creat | `public/project-card-previews/15-park-suites-demo-800.webp` |
| Creat | `public/project-card-previews/16-urban-haven-480.webp` |
| Creat | `public/project-card-previews/16-urban-haven-800.webp` |
| Creat | `public/project-card-previews/17-nest-collection-480.webp` |
| Creat | `public/project-card-previews/17-nest-collection-800.webp` |
| Creat | `public/project-card-previews/18-moldova-escape-480.webp` |
| Creat | `public/project-card-previews/18-moldova-escape-800.webp` |
| Creat | `public/project-card-previews/19-bazar-local-480.webp` |
| Creat | `public/project-card-previews/19-bazar-local-800.webp` |
| Creat | `public/project-card-previews/20-pret-bun-480.webp` |
| Creat | `public/project-card-previews/20-pret-bun-800.webp` |
| Creat | `public/project-card-previews/21-local-craft-480.webp` |
| Creat | `public/project-card-previews/21-local-craft-800.webp` |
| Creat | `public/project-card-previews/22-skillup-480.webp` |
| Creat | `public/project-card-previews/22-skillup-800.webp` |
| Creat | `public/project-card-previews/23-civic-learn-480.webp` |
| Creat | `public/project-card-previews/23-civic-learn-800.webp` |
| Creat | `public/project-card-previews/24-mentor-cloud-480.webp` |
| Creat | `public/project-card-previews/24-mentor-cloud-800.webp` |
| Creat | `public/project-card-previews/25-casa-check-480.webp` |
| Creat | `public/project-card-previews/25-casa-check-800.webp` |
| Creat | `public/project-card-previews/26-direct-home-480.webp` |
| Creat | `public/project-card-previews/26-direct-home-800.webp` |
| Creat | `public/project-card-previews/27-area-insight-480.webp` |
| Creat | `public/project-card-previews/27-area-insight-800.webp` |
| Creat | `public/project-card-previews/28-table-flow-480.webp` |
| Creat | `public/project-card-previews/28-table-flow-800.webp` |
| Creat | `public/project-card-previews/29-food-route-480.webp` |
| Creat | `public/project-card-previews/29-food-route-800.webp` |
| Creat | `public/project-card-previews/30-menu-studio-480.webp` |
| Creat | `public/project-card-previews/30-menu-studio-800.webp` |
| Creat | `public/project-card-previews/31-my-utility-480.webp` |
| Creat | `public/project-card-previews/31-my-utility-800.webp` |
| Creat | `public/project-card-previews/32-block-admin-480.webp` |
| Creat | `public/project-card-previews/32-block-admin-800.webp` |
| Creat | `public/project-card-previews/academia-480.webp` |
| Creat | `public/project-card-previews/academia-800.webp` |
| Creat | `public/project-card-previews/aquaverde-480.webp` |
| Creat | `public/project-card-previews/aquaverde-800.webp` |
| Creat | `public/project-card-previews/autoflow-partner-480.webp` |
| Creat | `public/project-card-previews/autoflow-partner-800.webp` |
| Creat | `public/project-card-previews/drivolt-480.webp` |
| Creat | `public/project-card-previews/drivolt-800.webp` |
| Creat | `public/project-card-previews/ecohabitat-480.webp` |
| Creat | `public/project-card-previews/ecohabitat-800.webp` |
| Creat | `public/project-card-previews/flow-crm-480.webp` |
| Creat | `public/project-card-previews/flow-crm-800.webp` |
| Creat | `public/project-card-previews/gazonpro-480.webp` |
| Creat | `public/project-card-previews/gazonpro-800.webp` |
| Creat | `public/project-card-previews/imobilia-one-480.webp` |
| Creat | `public/project-card-previews/imobilia-one-800.webp` |
| Creat | `public/project-card-previews/medora-clinic-480.webp` |
| Creat | `public/project-card-previews/medora-clinic-800.webp` |
| Creat | `public/project-card-previews/staynest-480.webp` |
| Creat | `public/project-card-previews/staynest-800.webp` |
| Creat | `public/project-card-previews/tableo-480.webp` |
| Creat | `public/project-card-previews/tableo-800.webp` |
| Creat | `public/project-card-previews/terraforma-480.webp` |
| Creat | `public/project-card-previews/terraforma-800.webp` |
| Creat | `public/project-card-previews/yardcraft-480.webp` |
| Creat | `public/project-card-previews/yardcraft-800.webp` |

## Iconuri și corecturi ale demo-urilor (5)

Normalizarea ArchiContract este aplicată copiei publice și reaplicată de sincronizare; sursa externă a proiectului nu a fost modificată.

| Statut | Fișier |
| --- | --- |
| Creat | `public/apple-touch-icon.png` |
| Modificat | `public/archicontract/_next/static/chunks/0t1mk9f5s0n14.js` |
| Creat | `public/favicon.ico` |
| Creat | `public/icon-192.png` |
| Creat | `public/icon-512.png` |

## Documentație (5)

| Statut | Fișier |
| --- | --- |
| Creat | `docs/seo-architecture.md` |
| Creat | `docs/seo-editorial-plan.md` |
| Creat | `docs/seo-file-inventory.md` |
| Creat | `SEO_IMPLEMENTATION_REPORT.md` |
| Creat | `SEO_LAUNCH_CHECKLIST.md` |

## Rapoarte de verificare (28)

| Statut | Fișier |
| --- | --- |
| Creat | `reports/seo/browser-review.json` |
| Creat | `reports/seo/garden-screenshot-review.jpg` |
| Creat | `reports/seo/lighthouse-mobile-home-before-fixes.json` |
| Creat | `reports/seo/lighthouse-mobile-home-compressed-before-card-optimization.json` |
| Creat | `reports/seo/lighthouse-mobile-home-final-compressed.json` |
| Creat | `reports/seo/lighthouse-mobile-home.json` |
| Creat | `reports/seo/lighthouse-mobile-project-before-fixes.json` |
| Creat | `reports/seo/lighthouse-mobile-project-compressed-before-card-optimization.json` |
| Creat | `reports/seo/lighthouse-mobile-project-final-compressed.json` |
| Creat | `reports/seo/lighthouse-mobile-project.json` |
| Creat | `reports/seo/netlify-parser-validation.json` |
| Creat | `reports/seo/performance-summary.json` |
| Creat | `reports/seo/performance-summary-before-card-optimization.json` |
| Creat | `reports/seo/project-card-images.json` |
| Creat | `reports/seo/project-card-visual-1.png` |
| Creat | `reports/seo/project-card-visual-2.png` |
| Creat | `reports/seo/static-audit.json` |

Capturi de verificare UI, grupate sub `reports/seo/screenshots/`:

- `reports/seo/screenshots/en-390.png`
- `reports/seo/screenshots/en-intrebari-1440.png`
- `reports/seo/screenshots/en-projects-aquaverde-390.png`
- `reports/seo/screenshots/en-services-website-customization-390.png`
- `reports/seo/screenshots/ro-1440.png`
- `reports/seo/screenshots/ro-projects-flow-crm-1440.png`
- `reports/seo/screenshots/ro-services-business-websites-1440.png`
- `reports/seo/screenshots/ru-1440.png`
- `reports/seo/screenshots/ru-contact-390.png`
- `reports/seo/screenshots/ru-projects-04-clinica-nova-390.png`
- `reports/seo/screenshots/ru-services-ecommerce-390.png`

## Artefacte locale generate și excluse din Git

- `dist/client/` — exportul static, regenerat de build; include rutele, resursele, robots, sitemap și regulile Netlify. Nu este o sursă editată manual.
- `reports/seo/all-tests.log` — jurnalul local al suitei de teste; ignorat de Git conform regulii pentru loguri.
- `reports/showcase-audit/` — rapoarte operaționale și capturi ale demonstrațiilor, inclusiv `reports/showcase-audit/archi-product-actions.json`; directorul este ignorat de Git. Nu sunt enumerate individual rezultatele repetate ale fiecărui produs.
- Fișierele tehnice și cache-urile Graphify rămân excluse conform `.gitignore`; sursele curente ale grafului sunt tratate separat mai sus.

Fișiere precum `app/project-prices.json` și `next.config.ts` sunt folosite de implementare, dar nu apar în inventarul schimbărilor dacă nu au fost modificate. Nicio captură nu este prezentată drept validare completă a tuturor paginilor, iar lista rapoartelor nu substituie rezultatul fiecărei verificări.
