# Graph Report - vanzare proiecte  (2026-09-10)

## Corpus Check
- 194 files · ~3,293,927 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1446 nodes · 2830 edges · 119 communities (102 shown, 17 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 151 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2810b2a0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- garden-projects.ts
- scripts
- e
- route.ts
- Inventarul fișierelor pentru implementarea SEO
- qd
- worker/index.ts
- site-config.ts
- index-CKwsJXdb.js
- AGENTS.md
- eslint.config.mjs
- devDependencies
- start-server.mjs
- trust-page.tsx
- next.config.ts
- next-env.d.ts
- dl
- zr
- MONO/DEV — raport SEO final
- rl
- Wl
- c0
- J
- proxy.ts
- audit-translations.mjs
- audit-showcase.mjs
- audit-network.mjs
- audit-batches.mjs
- postcss.config.mjs
- MONO/DEV — catalog de proiecte
- isLocale
- audit-report.mjs
- audit-catalog.mjs
- serve-audit.mjs
- showcase-audit.md
- audit-recheck.mjs
- audit-interactions-recheck.mjs
- refresh-32-project-covers.mjs
- probe-nord.mjs
- Hd
- optimize-png-lossless.mjs
- audit-control-source.mjs
- Q: primesc asa eroara la pornire proiect, de ce? middleware-to-proxy internal error getWorkerEntryExportTypes
- probe-nord-product.mjs
- audit-bandwidth.mjs
- Q: pretul vreau sa fie in rand cu titlul, cum era
- probe-nord-dom.mjs
- showcase-archi-actions.test.mjs
- academia/.vite/manifest.json
- flow-crm/.vite/manifest.json
- Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?
- medora-clinic/.vite/manifest.json
- Q: cand userul aleje cu servicii sau fara, sa i se afiseze aici ce intra in aceste servicii. Fix textul din i sa se arate
- audit-showcase-locales.mjs
- json-ld.tsx
- Audit Network – localhost:3000
- live-project-preview.tsx
- optimize-images-aggressive.mjs
- audit-seo.mjs
- Audit Network – localhost:3000
- js
- Q: da, fal asa. Dar el trebuie sa stea in drepata in colt sus. si trebuie sa file la ambele butoane in coltul din dreapt asus
- home-client.tsx
- Q: vreau mereu cand deschide un proiect, sa fie default 12 luni selectat; textul Cumpără în rate sa fie cu litere mari totul
- Q: aici textul schimbal in de la
- Q: butonul I fal de 2 ori mai mic
- cabinet/layout.tsx
- Nd
- showcase-favicons.test.mjs
- Bd
- L0
- Q: cand deschid orice card, popupul nu e vizibil intreg si trebuie scroll stanga-dreapta
- i18n.ts
- optimize-project-images.mjs
- contact-client.tsx
- Q: acest buton punel la fel ca in pagina de intrebari
- Q: pe ecrane mai mici, poza proiectului se strica tare, corecteaza ca sa nu se scrice pe nici o dimensiune de ecran
- Q: eu vreau sa fie in 2 randuri si tot o data sa nu se strice pozele la carduri
- localePath
- projects/[slug]/page.tsx
- dependencies
- package.json
- Q: analizeaza toate priectele, cee 63, si fiecare imagine din ele, si daca imaginea depastete greutatea de 250 kb, comprima la maxim daca e posibil fara a pierde calitatea ei
- serve-seo.mjs
- project-catalog.ts
- h
- brand-logo.tsx
- Ki
- SEO_IMPLEMENTATION_REPORT.md
- Arhitectura SEO statică
- Implementarea SEO MONO/DEV
- MONO/DEV — checklist de lansare SEO
- Cercetare și hartă keyword → pagină
- Q: analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are.
- sync-showcase.mjs
- Q: mai verifica din nou toate cele 24 proiecte daca sunt traduse in 3 limibi si lucreaza corect
- Proiecte incluse în catalog
- migrate-frontends-to-next.mjs
- Q: ok. Cand pornesc acest proiect pe portul 3000, automat cand pornesc si alt proiect, se porneste pe perturile disponibile? sau tot pe 3000 se va porni?
- env.d.ts
- integrate-new-projects.mjs

## God Nodes (most connected - your core abstractions)
1. `qd()` - 328 edges
2. `h()` - 61 edges
3. `e()` - 47 edges
4. `zr()` - 46 edges
5. `scripts` - 32 edges
6. `localePath()` - 31 edges
7. `isLocale()` - 27 edges
8. `n()` - 27 edges
9. `u()` - 24 edges
10. `rl()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `LocaleLayout()` --calls--> `isLocale()`  [EXTRACTED]
  app/[locale]/layout.tsx → app/lib/site-config.ts
- `indexablePaths()` --indirect_call--> `isProjectSeoEnabled()`  [INFERRED]
  app/lib/seo-routes.ts → app/lib/project-seo.ts
- `GET()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts
- `POST()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts
- `generateMetadata()` --calls--> `trustMetadata()`  [EXTRACTED]
  app/[locale]/about/page.tsx → app/components/trust-page.tsx

## Import Cycles
- None detected.

## Communities (119 total, 17 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.06
Nodes (31): dist, dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+23 more)

### Community 1 - "garden-projects.ts"
Cohesion: 0.19
Nodes (10): delivery, GardenCopy, gardenDescriptions(), GardenDetail, gardenDetails(), GardenProject, gardenProjects, headings (+2 more)

### Community 2 - "scripts"
Cohesion: 0.06
Nodes (32): scripts, audit:bandwidth, audit:batches, audit:browser, audit:catalog, audit:http, audit:interactions:recheck, audit:network (+24 more)

### Community 3 - "e"
Cohesion: 0.16
Nodes (41): ai(), Al(), Cu(), di(), dn(), Et(), Fu(), go() (+33 more)

### Community 4 - "route.ts"
Cohesion: 0.39
Nodes (5): getDb(), GET(), POST(), toRouteErrorMessage(), notes

### Community 5 - "Inventarul fișierelor pentru implementarea SEO"
Cohesion: 0.15
Nodes (12): Artefacte locale generate și excluse din Git, Capturi reale noi ale proiectelor (23), Cod și stiluri (51), Configurație și fișiere SEO publice (10), Documentație (5), Iconuri și corecturi ale demo-urilor (5), Inventarul fișierelor pentru implementarea SEO, Modificări preexistente păstrate (+4 more)

### Community 6 - "qd"
Cohesion: 0.05
Nodes (73): qd(), A0(), Aa(), Ac(), ad(), An(), bo(), Ca() (+65 more)

### Community 7 - "worker/index.ts"
Cohesion: 0.29
Nodes (3): Env, ExecutionContext, worker

### Community 8 - "site-config.ts"
Cohesion: 0.18
Nodes (10): HtmlDocument(), organizationSchema(), metadata, geist, metadata, mono, RootLayout(), viewport (+2 more)

### Community 9 - "index-CKwsJXdb.js"
Cohesion: 0.08
Nodes (25): af, am, cm(), ef, em, Fd, Id, Jd (+17 more)

### Community 12 - "devDependencies"
Cohesion: 0.04
Nodes (47): @cloudflare/vite-plugin, drizzle-kit, eslint, @eslint/js, eslint-plugin-jsx-a11y, eslint-plugin-react, eslint-plugin-react-hooks, globals (+39 more)

### Community 14 - "start-server.mjs"
Cohesion: 0.17
Nodes (10): devLockPath, extraArgs, findAvailablePort(), hasExplicitHost, portIsAvailable(), refreshScript, root, server (+2 more)

### Community 15 - "trust-page.tsx"
Cohesion: 0.09
Nodes (19): trustMetadata(), TrustPage(), TrustPageProps, locales, TrustContent, TrustPath, trustPaths, dynamicParams (+11 more)

### Community 18 - "dl"
Cohesion: 0.16
Nodes (20): _0(), ce(), dl(), ee(), Es(), Ff(), gr(), If() (+12 more)

### Community 19 - "zr"
Cohesion: 0.12
Nodes (35): au(), br(), Cc(), Dc(), dr(), Dt(), _e(), ei() (+27 more)

### Community 20 - "MONO/DEV — raport SEO final"
Cohesion: 0.18
Nodes (11): Activarea SEO în viitor, Baza inițială și protejarea modificărilor, Cercetare și strategie comercială, Dimensiuni și aspect, Fișiere și motive, Limite rămase, MONO/DEV — raport SEO final, Măsurare, autoritate și pași următori (+3 more)

### Community 21 - "rl"
Cohesion: 0.15
Nodes (21): at(), da(), io(), Kt(), Le(), lr(), M0(), ma() (+13 more)

### Community 22 - "Wl"
Cohesion: 0.14
Nodes (27): ar(), ct(), D0(), eu(), fe(), Is(), jc(), jo() (+19 more)

### Community 23 - "c0"
Cohesion: 0.12
Nodes (36): bc(), Bi(), Bl(), Bu(), c0(), dd(), Ed(), Gu() (+28 more)

### Community 25 - "J"
Cohesion: 0.18
Nodes (15): C(), ft(), J(), Tl(), Hl(), yl(), Ud(), At() (+7 more)

### Community 27 - "audit-translations.mjs"
Cohesion: 0.13
Nodes (10): catalog, catalogIds, copyBlocks, gardenIds, issues, legacyDescriptionIds, legacyDetailIds, numericKeysIn() (+2 more)

### Community 28 - "audit-showcase.mjs"
Cohesion: 0.12
Nodes (11): args, base, cache, controlLimit, explicitPaths, only, output, phase (+3 more)

### Community 29 - "audit-network.mjs"
Cohesion: 0.22
Nodes (9): args, base, concurrency, kind(), measure(), output, recommendation(), registry (+1 more)

### Community 30 - "audit-batches.mjs"
Cohesion: 0.20
Nodes (9): args, output, persist(), registry, run, selected, worker(), workers (+1 more)

### Community 34 - "MONO/DEV — catalog de proiecte"
Cohesion: 0.11
Nodes (15): Catalog, Limitele demonstrațiilor, Refacerea celor 32 de proiecte, Surse și întreținere, Verificare, Actualizare, Proiecte de grădină și peisagistică, Catalog runtime (+7 more)

### Community 35 - "isLocale"
Cohesion: 0.19
Nodes (16): breadcrumbSchema(), websiteSchema(), absoluteUrl(), alternateLanguages(), canonicalUrl(), isLocale(), pageMetadata(), Contact() (+8 more)

### Community 36 - "audit-report.mjs"
Cohesion: 0.22
Nodes (7): details(), entries, escape(), fixes, registry, root, summary

### Community 37 - "audit-catalog.mjs"
Cohesion: 0.50
Nodes (3): expectedProjects, report, retry

### Community 38 - "serve-audit.mjs"
Cohesion: 0.50
Nodes (3): mime, port, roots

### Community 42 - "audit-interactions-recheck.mjs"
Cohesion: 0.40
Nodes (3): args, base, only

### Community 43 - "refresh-32-project-covers.mjs"
Cohesion: 0.50
Nodes (3): output, projects, registry

### Community 46 - "Hd"
Cohesion: 0.19
Nodes (13): cf(), e1(), h(), Hd(), L(), Nl(), x(), L() (+5 more)

### Community 47 - "optimize-png-lossless.mjs"
Cohesion: 0.33
Nodes (5): collect(), defaultBinary, files, isPng(), root

### Community 48 - "audit-control-source.mjs"
Cohesion: 0.33
Nodes (3): findings, registry, skipped

### Community 49 - "Q: primesc asa eroara la pornire proiect, de ce? middleware-to-proxy internal error getWorkerEntryExportTypes"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: primesc asa eroara la pornire proiect, de ce? middleware-to-proxy internal error getWorkerEntryExportTypes, Source Nodes

### Community 52 - "audit-bandwidth.mjs"
Cohesion: 0.25
Nodes (6): byKind, limits, oversized, publicRoot, records, total

### Community 55 - "Q: pretul vreau sa fie in rand cu titlul, cum era"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: pretul vreau sa fie in rand cu titlul, cum era, Source Nodes

### Community 61 - "academia/.vite/manifest.json"
Cohesion: 0.05
Nodes (45): app/page.tsx, file, imports, isDynamicEntry, name, src, _framework-D_rUT4EX.js, file (+37 more)

### Community 62 - "flow-crm/.vite/manifest.json"
Cohesion: 0.05
Nodes (45): app/page.tsx, file, imports, isDynamicEntry, name, src, _framework-D_rUT4EX.js, file (+37 more)

### Community 64 - "Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?, Source Nodes

### Community 65 - "medora-clinic/.vite/manifest.json"
Cohesion: 0.05
Nodes (45): app/page.tsx, file, imports, isDynamicEntry, name, src, _framework-D_rUT4EX.js, file (+37 more)

### Community 67 - "Q: cand userul aleje cu servicii sau fara, sa i se afiseze aici ce intra in aceste servicii. Fix textul din i sa se arate"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: cand userul aleje cu servicii sau fara, sa i se afiseze aici ce intra in aceste servicii. Fix textul din i sa se arate, Source Nodes

### Community 68 - "audit-showcase-locales.mjs"
Cohesion: 0.29
Nodes (4): locales, projects, registry, report

### Community 69 - "json-ld.tsx"
Cohesion: 0.12
Nodes (18): faqSchema(), JsonLd(), serializeJsonLd(), labels, SeoLinks(), QuestionsPage(), metadata, Category (+10 more)

### Community 70 - "Audit Network – localhost:3000"
Cohesion: 0.40
Nodes (4): Audit Network – localhost:3000, Candidați de optimizare, Catalog, Toate proiectele

### Community 71 - "live-project-preview.tsx"
Cohesion: 0.50
Nodes (3): projectCardImages, gardenPreviewSources, StaticProjectPreview()

### Community 72 - "optimize-images-aggressive.mjs"
Cohesion: 0.17
Nodes (10): after, before, changed, concurrency, extensions, files, optimize(), results (+2 more)

### Community 73 - "audit-seo.mjs"
Cohesion: 0.11
Nodes (34): auditProduction(), auditSeo(), exists(), expectedRoutes(), exportedFile(), flattenSchemas(), HREFLANG, LOCALES (+26 more)

### Community 74 - "Audit Network – localhost:3000"
Cohesion: 0.40
Nodes (4): Audit Network – localhost:3000, Candidați de optimizare, Catalog, Toate proiectele

### Community 75 - "js"
Cohesion: 0.24
Nodes (11): bs(), cn(), fn(), js(), Ls(), nn(), Ns(), oa() (+3 more)

### Community 76 - "Q: da, fal asa. Dar el trebuie sa stea in drepata in colt sus. si trebuie sa file la ambele butoane in coltul din dreapt asus"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: da, fal asa. Dar el trebuie sa stea in drepata in colt sus. si trebuie sa file la ambele butoane in coltul din dreapt asus, Source Nodes

### Community 77 - "home-client.tsx"
Cohesion: 0.13
Nodes (15): categorySlugs, cleanFilterCopy, filters, gamesPlatformCopy, Home(), platformCopy, readPreference(), shuffledProjectIds() (+7 more)

### Community 78 - "Q: vreau mereu cand deschide un proiect, sa fie default 12 luni selectat; textul Cumpără în rate sa fie cu litere mari totul"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: vreau mereu cand deschide un proiect, sa fie default 12 luni selectat; textul Cumpără în rate sa fie cu litere mari totul, Source Nodes

### Community 79 - "Q: aici textul schimbal in de la"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: aici textul schimbal in de la, Source Nodes

### Community 80 - "Q: butonul I fal de 2 ori mai mic"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: butonul I fal de 2 ori mai mic, Source Nodes

### Community 82 - "Nd"
Cohesion: 0.29
Nodes (9): Cd(), Nd(), h(), x(), yl(), j(), M(), w() (+1 more)

### Community 83 - "showcase-favicons.test.mjs"
Cohesion: 0.40
Nodes (3): registry, root, visibleProjects

### Community 84 - "Bd"
Cohesion: 0.40
Nodes (6): Bd(), p(), D(), pt(), Yd(), p()

### Community 85 - "L0"
Cohesion: 0.20
Nodes (19): _a(), ao(), bd(), Ea(), eo(), fr(), G0(), ga() (+11 more)

### Community 86 - "Q: cand deschid orice card, popupul nu e vizibil intreg si trebuie scroll stanga-dreapta"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: cand deschid orice card, popupul nu e vizibil intreg si trebuie scroll stanga-dreapta, Source Nodes

### Community 87 - "i18n.ts"
Cohesion: 0.15
Nodes (15): ProjectVisual(), contactCopy, copy, descriptions, localDescription(), Locale, localizedDetail(), localType() (+7 more)

### Community 88 - "optimize-project-images.mjs"
Cohesion: 0.07
Nodes (37): apply, audit, candidates, concurrency, decodedFingerprint(), fileHash(), imageExtensions, includeSourceImages (+29 more)

### Community 89 - "contact-client.tsx"
Cohesion: 0.25
Nodes (9): AnalyticsConsent(), text, ContactPage(), analyticsConsentKey, AnalyticsEvent, trackEvent(), Window, contactOptionLabel() (+1 more)

### Community 90 - "Q: acest buton punel la fel ca in pagina de intrebari"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: acest buton punel la fel ca in pagina de intrebari, Source Nodes

### Community 91 - "Q: pe ecrane mai mici, poza proiectului se strica tare, corecteaza ca sa nu se scrice pe nici o dimensiune de ecran"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: pe ecrane mai mici, poza proiectului se strica tare, corecteaza ca sa nu se scrice pe nici o dimensiune de ecran, Source Nodes

### Community 92 - "Q: eu vreau sa fie in 2 randuri si tot o data sa nu se strice pozele la carduri"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: eu vreau sa fie in 2 randuri si tot o data sa nu se strice pozele la carduri, Source Nodes

### Community 93 - "localePath"
Cohesion: 0.16
Nodes (16): SeoShell(), projectHref(), getService(), Service, ServiceContent, serviceLabels, services, localePath() (+8 more)

### Community 94 - "projects/[slug]/page.tsx"
Cohesion: 0.19
Nodes (17): getProject(), monthlyRentalPrice(), publicProjects, isProjectSeoEnabled(), LocalizedProject, projectMetadata(), projectStructuredData(), projectTitle() (+9 more)

### Community 95 - "dependencies"
Cohesion: 0.15
Nodes (13): drizzle-orm, framer-motion, lucide-react, magic-string, dependencies, drizzle-orm, framer-motion, lucide-react (+5 more)

### Community 97 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, name, private, type, version

### Community 98 - "Q: analizeaza toate priectele, cee 63, si fiecare imagine din ele, si daca imaginea depastete greutatea de 250 kb, comprima la maxim daca e posibil fara a pierde calitatea ei"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: analizeaza toate priectele, cee 63, si fiecare imagine din ele, si daca imaginea depastete greutatea de 250 kb, comprima la maxim daca e posibil fara a pierde calitatea ei, Source Nodes

### Community 99 - "serve-seo.mjs"
Cohesion: 0.40
Nodes (4): compress, mime, port, root

### Community 103 - "project-catalog.ts"
Cohesion: 0.13
Nodes (14): categoryServiceSlugs, hiddenCategories, installmentPlans, MobileOS, PaymentMode, Platform, pricesByProjectId, Project (+6 more)

### Community 104 - "h"
Cohesion: 0.15
Nodes (16): co(), du(), h(), hf(), li(), nc(), on(), oo() (+8 more)

### Community 105 - "brand-logo.tsx"
Cohesion: 0.33
Nodes (4): BrandLogo(), BrandLogoProps, content, locales

### Community 106 - "Ki"
Cohesion: 0.13
Nodes (20): Ae(), Gc(), id(), K0(), Ke(), Ki(), ld(), nl() (+12 more)

### Community 108 - "Arhitectura SEO statică"
Cohesion: 0.25
Nodes (8): Arhitectura SEO statică, Controlul indexării și redirecturi, Date structurate și limitări, Generarea build-ului, Imaginile cardurilor, Politica actuală de indexare — 10 septembrie 2026, URL-uri și limbi, Validarea configurației Netlify

### Community 109 - "Implementarea SEO MONO/DEV"
Cohesion: 0.25
Nodes (8): Ce necesită proprietarul, Ce s-a implementat, Export și controlul indexării, Fișiere, Implementarea SEO MONO/DEV, Performanță măsurată și limite, URL-uri și sitemap, Verificări

### Community 110 - "MONO/DEV — checklist de lansare SEO"
Cohesion: 0.29
Nodes (7): Analytics: configurare explicită și consimțământ, Google Business Profile, Google Search Console și alte instrumente, MONO/DEV — checklist de lansare SEO, Netlify și verificări după un deploy autorizat, Priorități 30 / 60 / 90 de zile, Înainte de publicare

### Community 111 - "Cercetare și hartă keyword → pagină"
Cohesion: 0.50
Nodes (4): Ce s-a implementat și ce necesită validare, Cercetare și hartă keyword → pagină, Constatări pe limbi, Distribuția intențiilor

### Community 135 - "Q: analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are., Source Nodes

### Community 162 - "sync-showcase.mjs"
Cohesion: 0.06
Nodes (37): registry, root, normalizeNextExport(), normalizeArchiNavigation(), normalizeShowcaseInteractions(), walk(), writeProjectPreview(), ensureShowcaseFavicon() (+29 more)

### Community 179 - "Q: mai verifica din nou toate cele 24 proiecte daca sunt traduse in 3 limibi si lucreaza corect"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: mai verifica din nou toate cele 24 proiecte daca sunt traduse in 3 limibi si lucreaza corect, Source Nodes

### Community 302 - "Q: ok. Cand pornesc acest proiect pe portul 3000, automat cand pornesc si alt proiect, se porneste pe perturile disponibile? sau tot pe 3000 se va porni?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ok. Cand pornesc acest proiect pe portul 3000, automat cand pornesc si alt proiect, se porneste pe perturile disponibile? sau tot pe 3000 se va porni?, Source Nodes

### Community 1516 - "integrate-new-projects.mjs"
Cohesion: 0.14
Nodes (13): catalogPath, catalogRoot, configs, folders, known, pagePath, pathEntries, priceByDomain (+5 more)

## Knowledge Gaps
- **540 isolated node(s):** `dynamicParams`, `copy`, `dynamicParams`, `dynamicParams`, `dynamicParams` (+535 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RentalServiceTier` (3× useful, score=2.929327903) _(code changed — re-verify)_
- `ProjectVisual()` (2× useful, score=1.990262807) _(code changed — re-verify)_
- `i18n.ts` (2× useful, score=1.840138395)
- `sync-showcase.mjs` (2× useful, score=1.813446333)
- `projectSlugs` (2× useful, score=1.691561123) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `qd()` connect `qd` to `e`, `h`, `index-CKwsJXdb.js`, `Ki`, `js`, `Hd`, `Nd`, `dl`, `Bd`, `L0`, `Wl`, `rl`, `zr`, `J`, `c0`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `Nd()` connect `Nd` to `index-CKwsJXdb.js`, `Hd`, `J`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `localePath()` connect `localePath` to `isLocale`, `json-ld.tsx`, `project-catalog.ts`, `site-config.ts`, `home-client.tsx`, `trust-page.tsx`, `contact-client.tsx`, `projects/[slug]/page.tsx`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Are the 20 inferred relationships involving `qd()` (e.g. with `ad()` and `cd()`) actually correct?**
  _`qd()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `e()` (e.g. with `ao()` and `ci()`) actually correct?**
  _`e()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `zr()` (e.g. with `A0()` and `a()`) actually correct?**
  _`zr()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `dynamicParams`, `copy`, `dynamicParams` to the rest of the system?**
  _540 weakly-connected nodes found - possible documentation gaps or missing edges._