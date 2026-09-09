# Graph Report - vanzare proiecte  (2026-09-09)

## Corpus Check
- 95 files · ~1,855,244 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1031 nodes · 2027 edges · 83 communities (68 shown, 15 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 149 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `af4cfaff`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- garden-projects.ts
- scripts
- e
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
- Hi
- Ki
- Ql
- h
- L0
- Nd
- J
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
- Wl
- probe-nord-dom.mjs
- academia/.vite/manifest.json
- flow-crm/.vite/manifest.json
- Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?
- medora-clinic/.vite/manifest.json
- du
- audit-showcase-locales.mjs
- i18n.ts
- Audit Network – localhost:3000
- live-project-preview.tsx
- Bd
- Audit Network – localhost:3000
- _f
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
5. `n()` - 27 edges
6. `scripts` - 25 edges
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

## Communities (83 total, 15 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.06
Nodes (31): dist, dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+23 more)

### Community 1 - "garden-projects.ts"
Cohesion: 0.19
Nodes (10): delivery, GardenCopy, gardenDescriptions(), GardenDetail, gardenDetails(), GardenProject, gardenProjects, headings (+2 more)

### Community 2 - "scripts"
Cohesion: 0.04
Nodes (44): drizzle-orm, framer-motion, lucide-react, magic-string, dependencies, drizzle-orm, framer-motion, lucide-react (+36 more)

### Community 3 - "e"
Cohesion: 0.06
Nodes (95): ai(), Al(), at(), Cc(), cn(), Cu(), da(), Dc() (+87 more)

### Community 4 - "route.ts"
Cohesion: 0.39
Nodes (5): getDb(), GET(), POST(), toRouteErrorMessage(), notes

### Community 5 - "app/page.tsx"
Cohesion: 0.10
Nodes (20): categorySlugs, cleanFilterCopy, filterCopy, filters, gamesPlatformCopy, hiddenCategories, launchProjectIds, MobileOS (+12 more)

### Community 6 - "qd"
Cohesion: 0.08
Nodes (37): qd(), Ac(), ad(), bo(), ci(), cs(), df(), Em() (+29 more)

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
Cohesion: 0.28
Nodes (9): localDescription(), localizedDetail(), localType(), Home(), isLocalHost(), isServerHost(), monthlyInstallmentPrice(), ProjectVisual() (+1 more)

### Community 18 - "Hi"
Cohesion: 0.13
Nodes (21): Aa(), An(), bs(), Ca(), cd(), e0(), f0(), Hi() (+13 more)

### Community 19 - "Ki"
Cohesion: 0.15
Nodes (16): Ae(), Gc(), Ht(), id(), Is(), K0(), Ke(), Ki() (+8 more)

### Community 20 - "Ql"
Cohesion: 0.19
Nodes (20): Bl(), Bu(), Ed(), Gu(), hd(), Hu(), Il(), t() (+12 more)

### Community 21 - "h"
Cohesion: 0.06
Nodes (68): _0(), A0(), ar(), au(), bc(), Bi(), br(), c0() (+60 more)

### Community 22 - "L0"
Cohesion: 0.23
Nodes (17): _a(), ao(), bd(), Ea(), eo(), fr(), G0(), ga() (+9 more)

### Community 23 - "Nd"
Cohesion: 0.25
Nodes (10): Cd(), Nd(), h(), x(), yl(), j(), M(), w() (+2 more)

### Community 25 - "J"
Cohesion: 0.17
Nodes (18): C(), ft(), J(), Tl(), Hl(), nl(), O(), q() (+10 more)

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

### Community 55 - "Wl"
Cohesion: 0.17
Nodes (19): ct(), D0(), jc(), jo(), Ku(), ms(), Pa(), rs() (+11 more)

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

### Community 67 - "du"
Cohesion: 0.40
Nodes (6): co(), du(), hf(), oo(), Rn(), Sa()

### Community 68 - "audit-showcase-locales.mjs"
Cohesion: 0.29
Nodes (4): locales, projects, registry, report

### Community 69 - "i18n.ts"
Cohesion: 0.15
Nodes (12): contactCopy, copy, descriptions, Locale, locales, romanianTypeMap, showcaseCopy, typeMap (+4 more)

### Community 70 - "Audit Network – localhost:3000"
Cohesion: 0.40
Nodes (4): Audit Network – localhost:3000, Candidați de optimizare, Catalog, Toate proiectele

### Community 71 - "live-project-preview.tsx"
Cohesion: 0.50
Nodes (4): gardenPreviewSources, StaticProjectPreview(), transformed(), widths

### Community 73 - "Bd"
Cohesion: 0.40
Nodes (6): Bd(), p(), D(), pt(), Yd(), p()

### Community 74 - "Audit Network – localhost:3000"
Cohesion: 0.40
Nodes (4): Audit Network – localhost:3000, Candidați de optimizare, Catalog, Toate proiectele

### Community 75 - "_f"
Cohesion: 0.15
Nodes (16): _f(), Ff(), If(), $n(), of(), p0(), pf(), qu() (+8 more)

### Community 135 - "Q: analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are., Source Nodes

### Community 162 - "sync-showcase.mjs"
Cohesion: 0.10
Nodes (23): normalizeNextExport(), writeProjectPreview(), buildProject(), buildRequested, changedOnly, exists(), findOutput(), ignoredNames (+15 more)

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
- **377 isolated node(s):** `metadata`, `GardenDetail`, `GardenCopy`, `GardenProject`, `headings` (+372 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `locales` (2× useful, score=1.773544695) _(code changed — re-verify)_
- `projectSlugs` (2× useful, score=1.773544695) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `qd()` connect `qd` to `e`, `du`, `Bd`, `index-CKwsJXdb.js`, `_f`, `Hd`, `Hi`, `Ki`, `Ql`, `h`, `L0`, `Nd`, `Wl`, `J`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `scripts`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 20 inferred relationships involving `qd()` (e.g. with `ad()` and `cd()`) actually correct?**
  _`qd()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `e()` (e.g. with `ao()` and `ci()`) actually correct?**
  _`e()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `zr()` (e.g. with `A0()` and `a()`) actually correct?**
  _`zr()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `n()` (e.g. with `ai()` and `Cu()`) actually correct?**
  _`n()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `metadata`, `GardenDetail`, `GardenCopy` to the rest of the system?**
  _377 weakly-connected nodes found - possible documentation gaps or missing edges._