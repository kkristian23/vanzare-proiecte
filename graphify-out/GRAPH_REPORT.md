# Graph Report - vanzare proiecte  (2026-09-10)

## Corpus Check
- 113 files · ~1,359,426 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1160 nodes · 2175 edges · 100 communities (84 shown, 16 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 148 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c338f412`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- garden-projects.ts
- scripts
- h
- route.ts
- app/page.tsx
- qd
- worker/index.ts
- app/layout.tsx
- index-CKwsJXdb.js
- AGENTS.md
- eslint.config.mjs
- devDependencies
- start-server.mjs
- Home
- next.config.ts
- next-env.d.ts
- dl
- du
- Hi
- e1
- L0
- Ql
- Ud
- proxy.ts
- audit-translations.mjs
- audit-showcase.mjs
- audit-network.mjs
- audit-batches.mjs
- postcss.config.mjs
- MONO/DEV — catalog de proiecte
- contact/layout.tsx
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
- academia/.vite/manifest.json
- flow-crm/.vite/manifest.json
- Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?
- medora-clinic/.vite/manifest.json
- Q: cand userul aleje cu servicii sau fara, sa i se afiseze aici ce intra in aceste servicii. Fix textul din i sa se arate
- audit-showcase-locales.mjs
- intrebari/page.tsx
- Audit Network – localhost:3000
- live-project-preview.tsx
- optimize-images-aggressive.mjs
- rl
- Audit Network – localhost:3000
- c0
- Q: da, fal asa. Dar el trebuie sa stea in drepata in colt sus. si trebuie sa file la ambele butoane in coltul din dreapt asus
- i18n.ts
- Q: vreau mereu cand deschide un proiect, sa fie default 12 luni selectat; textul Cumpără în rate sa fie cu litere mari totul
- Q: aici textul schimbal in de la
- Q: butonul I fal de 2 ori mai mic
- cabinet/layout.tsx
- J
- showcase-favicons.test.mjs
- Ki
- Wl
- Q: cand deschid orice card, popupul nu e vizibil intreg si trebuie scroll stanga-dreapta
- _f
- optimize-project-images.mjs
- yo
- Q: acest buton punel la fel ca in pagina de intrebari
- Q: pe ecrane mai mici, poza proiectului se strica tare, corecteaza ca sa nu se scrice pe nici o dimensiune de ecran
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
5. `scripts` - 27 edges
6. `n()` - 27 edges
7. `u()` - 24 edges
8. `rl()` - 23 edges
9. `Ud()` - 22 edges
10. `J()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts
- `POST()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts
- `Home()` --calls--> `localType()`  [EXTRACTED]
  app/page.tsx → app/i18n.ts
- `ProjectVisual()` --calls--> `localType()`  [EXTRACTED]
  app/page.tsx → app/i18n.ts
- `Home()` --calls--> `localDescription()`  [EXTRACTED]
  app/page.tsx → app/i18n.ts

## Import Cycles
- None detected.

## Communities (100 total, 16 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.06
Nodes (31): dist, dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+23 more)

### Community 1 - "garden-projects.ts"
Cohesion: 0.19
Nodes (10): delivery, GardenCopy, gardenDescriptions(), GardenDetail, gardenDetails(), GardenProject, gardenProjects, headings (+2 more)

### Community 2 - "scripts"
Cohesion: 0.04
Nodes (46): drizzle-orm, framer-motion, lucide-react, magic-string, dependencies, drizzle-orm, framer-motion, lucide-react (+38 more)

### Community 3 - "h"
Cohesion: 0.06
Nodes (108): ai(), Al(), at(), au(), br(), cn(), Cu(), da() (+100 more)

### Community 4 - "route.ts"
Cohesion: 0.39
Nodes (5): getDb(), GET(), POST(), toRouteErrorMessage(), notes

### Community 5 - "app/page.tsx"
Cohesion: 0.08
Nodes (22): categorySlugs, cleanFilterCopy, filterCopy, filters, gamesPlatformCopy, hiddenCategories, installmentPlans, launchProjectIds (+14 more)

### Community 6 - "qd"
Cohesion: 0.08
Nodes (32): qd(), A0(), ad(), bo(), Ca(), Cc(), df(), ds() (+24 more)

### Community 7 - "worker/index.ts"
Cohesion: 0.29
Nodes (3): Env, ExecutionContext, worker

### Community 8 - "app/layout.tsx"
Cohesion: 0.33
Nodes (4): geist, metadata, mono, viewport

### Community 9 - "index-CKwsJXdb.js"
Cohesion: 0.08
Nodes (25): af, am, cm(), ef, em, Fd, Id, Jd (+17 more)

### Community 12 - "devDependencies"
Cohesion: 0.04
Nodes (47): @cloudflare/vite-plugin, drizzle-kit, eslint, @eslint/js, eslint-plugin-jsx-a11y, eslint-plugin-react, eslint-plugin-react-hooks, globals (+39 more)

### Community 14 - "start-server.mjs"
Cohesion: 0.17
Nodes (10): devLockPath, extraArgs, findAvailablePort(), hasExplicitHost, portIsAvailable(), refreshScript, root, server (+2 more)

### Community 15 - "Home"
Cohesion: 0.32
Nodes (8): localDescription(), localizedDetail(), localType(), annualInstallmentPrice(), Home(), monthlyRentalPrice(), ProjectVisual(), shuffledProjectIds()

### Community 18 - "dl"
Cohesion: 0.24
Nodes (13): _0(), ce(), dl(), ee(), Es(), Ff(), If(), Mu() (+5 more)

### Community 19 - "du"
Cohesion: 0.40
Nodes (6): co(), du(), hf(), oo(), Rn(), Sa()

### Community 20 - "Hi"
Cohesion: 0.17
Nodes (16): Aa(), An(), bs(), cd(), e0(), Hi(), In(), jf() (+8 more)

### Community 21 - "e1"
Cohesion: 0.31
Nodes (9): e1(), x(), nm(), Hl(), j(), M(), ft(), uf() (+1 more)

### Community 22 - "L0"
Cohesion: 0.24
Nodes (16): _a(), ao(), bd(), Ea(), eo(), fr(), G0(), ga() (+8 more)

### Community 23 - "Ql"
Cohesion: 0.15
Nodes (26): Bi(), Bl(), Bu(), dd(), Ed(), Gu(), hd(), Hu() (+18 more)

### Community 25 - "Ud"
Cohesion: 0.25
Nodes (8): O(), q(), r(), Ud(), Cl(), D(), J(), pt()

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
Cohesion: 0.25
Nodes (9): Bd(), p(), cf(), Hd(), Nl(), D(), fd(), Yd() (+1 more)

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

### Community 69 - "intrebari/page.tsx"
Cohesion: 0.18
Nodes (9): BrandLogo(), BrandLogoProps, content, contactCopy, Locale, locales, categories, Category (+1 more)

### Community 70 - "Audit Network – localhost:3000"
Cohesion: 0.40
Nodes (4): Audit Network – localhost:3000, Candidați de optimizare, Catalog, Toate proiectele

### Community 71 - "live-project-preview.tsx"
Cohesion: 0.50
Nodes (4): gardenPreviewSources, StaticProjectPreview(), transformed(), widths

### Community 72 - "optimize-images-aggressive.mjs"
Cohesion: 0.17
Nodes (10): after, before, changed, concurrency, extensions, files, optimize(), results (+2 more)

### Community 73 - "rl"
Cohesion: 0.15
Nodes (18): cs(), fo(), gn(), Ht(), io(), Le(), lr(), mf() (+10 more)

### Community 74 - "Audit Network – localhost:3000"
Cohesion: 0.40
Nodes (4): Audit Network – localhost:3000, Candidați de optimizare, Catalog, Toate proiectele

### Community 75 - "c0"
Cohesion: 0.28
Nodes (16): bc(), c0(), _e(), Gi(), H0(), Lt(), Qa(), qu() (+8 more)

### Community 76 - "Q: da, fal asa. Dar el trebuie sa stea in drepata in colt sus. si trebuie sa file la ambele butoane in coltul din dreapt asus"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: da, fal asa. Dar el trebuie sa stea in drepata in colt sus. si trebuie sa file la ambele butoane in coltul din dreapt asus, Source Nodes

### Community 77 - "i18n.ts"
Cohesion: 0.29
Nodes (6): copy, descriptions, romanianTypeMap, showcaseCopy, typeMap, visualCopy

### Community 78 - "Q: vreau mereu cand deschide un proiect, sa fie default 12 luni selectat; textul Cumpără în rate sa fie cu litere mari totul"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: vreau mereu cand deschide un proiect, sa fie default 12 luni selectat; textul Cumpără în rate sa fie cu litere mari totul, Source Nodes

### Community 79 - "Q: aici textul schimbal in de la"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: aici textul schimbal in de la, Source Nodes

### Community 80 - "Q: butonul I fal de 2 ori mai mic"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: butonul I fal de 2 ori mai mic, Source Nodes

### Community 82 - "J"
Cohesion: 0.17
Nodes (20): Cd(), h(), L(), Nd(), C(), ft(), h(), J() (+12 more)

### Community 83 - "showcase-favicons.test.mjs"
Cohesion: 0.40
Nodes (3): registry, root, visibleProjects

### Community 84 - "Ki"
Cohesion: 0.12
Nodes (21): Ae(), ct(), Gc(), id(), Is(), jo(), K0(), Ke() (+13 more)

### Community 85 - "Wl"
Cohesion: 0.18
Nodes (19): ar(), D0(), jc(), Kc(), Ku(), lo(), ms(), Pa() (+11 more)

### Community 86 - "Q: cand deschid orice card, popupul nu e vizibil intreg si trebuie scroll stanga-dreapta"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: cand deschid orice card, popupul nu e vizibil intreg si trebuie scroll stanga-dreapta, Source Nodes

### Community 87 - "_f"
Cohesion: 0.32
Nodes (8): _f(), $n(), of(), p0(), st(), we(), wn(), zf()

### Community 88 - "optimize-project-images.mjs"
Cohesion: 0.07
Nodes (37): apply, audit, candidates, concurrency, decodedFingerprint(), fileHash(), imageExtensions, includeSourceMatches (+29 more)

### Community 89 - "yo"
Cohesion: 0.12
Nodes (17): Ac(), ci(), eu(), fe(), gt(), Mr(), ni(), O0() (+9 more)

### Community 90 - "Q: acest buton punel la fel ca in pagina de intrebari"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: acest buton punel la fel ca in pagina de intrebari, Source Nodes

### Community 91 - "Q: pe ecrane mai mici, poza proiectului se strica tare, corecteaza ca sa nu se scrice pe nici o dimensiune de ecran"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: pe ecrane mai mici, poza proiectului se strica tare, corecteaza ca sa nu se scrice pe nici o dimensiune de ecran, Source Nodes

### Community 135 - "Q: analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are., Source Nodes

### Community 162 - "sync-showcase.mjs"
Cohesion: 0.07
Nodes (34): registry, root, normalizeNextExport(), writeProjectPreview(), ensureShowcaseFavicon(), escapeXml(), exists(), faviconSvg() (+26 more)

### Community 179 - "Q: mai verifica din nou toate cele 24 proiecte daca sunt traduse in 3 limibi si lucreaza corect"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: mai verifica din nou toate cele 24 proiecte daca sunt traduse in 3 limibi si lucreaza corect, Source Nodes

### Community 302 - "Q: ok. Cand pornesc acest proiect pe portul 3000, automat cand pornesc si alt proiect, se porneste pe perturile disponibile? sau tot pe 3000 se va porni?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: ok. Cand pornesc acest proiect pe portul 3000, automat cand pornesc si alt proiect, se porneste pe perturile disponibile? sau tot pe 3000 se va porni?, Source Nodes

### Community 1516 - "integrate-new-projects.mjs"
Cohesion: 0.15
Nodes (12): catalogRoot, configs, folders, known, pagePath, pathEntries, priceByDomain, projectEntries (+4 more)

## Knowledge Gaps
- **450 isolated node(s):** `BrandLogoProps`, `metadata`, `content`, `metadata`, `GardenDetail` (+445 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `RentalServiceTier` (3× useful, score=2.943780031) _(code changed — re-verify)_
- `i18n.ts` (2× useful, score=1.849216899)
- `projectSlugs` (2× useful, score=1.699906607) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `qd()` connect `qd` to `h`, `index-CKwsJXdb.js`, `rl`, `c0`, `Hd`, `J`, `dl`, `Hi`, `Ki`, `L0`, `Wl`, `Ql`, `yo`, `du`, `_f`, `e1`, `Ud`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `scripts`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `Ud()` connect `Ud` to `index-CKwsJXdb.js`, `Hd`, `J`, `Ki`, `e1`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Are the 20 inferred relationships involving `qd()` (e.g. with `ad()` and `cd()`) actually correct?**
  _`qd()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `e()` (e.g. with `ao()` and `ci()`) actually correct?**
  _`e()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `zr()` (e.g. with `A0()` and `a()`) actually correct?**
  _`zr()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `BrandLogoProps`, `metadata`, `content` to the rest of the system?**
  _450 weakly-connected nodes found - possible documentation gaps or missing edges._