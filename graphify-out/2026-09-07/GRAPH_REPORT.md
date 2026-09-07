# Graph Report - vanzare proiecte  (2026-09-07)

## Corpus Check
- 57 files · ~1,480,866 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 840 nodes · 1861 edges · 64 communities (41 shown, 23 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 154 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1634e5d3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- Pa
- dependencies
- c0
- route.ts
- app/page.tsx
- zr
- worker/index.ts
- app/layout.tsx
- Bd
- AGENTS.md
- eslint.config.mjs
- devDependencies
- start-server.mjs
- y
- next.config.ts
- next-env.d.ts
- Ud
- Hi
- Nd
- index-CRlfCg0A.js
- e1
- scripts
- Ki
- yl
- middleware.ts
- package.json
- Ea
- qd
- Wt
- postcss.config.mjs
- MONO/DEV — catalog de proiecte
- contact/layout.tsx
- eslint-plugin-jsx-a11y
- eslint-plugin-react-hooks
- globals
- @next/eslint-plugin-next
- @tailwindcss/postcss
- @types/react
- @types/react-dom
- typescript
- typescript-eslint
- vinext
- js
- vite
- @vitejs/plugin-react
- @vitejs/plugin-rsc
- e
- academia/.vite/manifest.json
- flow-crm/.vite/manifest.json
- Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?
- medora-clinic/.vite/manifest.json
- L0
- Q: analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are.
- sync-showcase.mjs
- Q: mai verifica din nou toate cele 24 proiecte daca sunt traduse in 3 limibi si lucreaza corect
- Proiecte incluse în catalog
- migrate-frontends-to-next.mjs
- Q: ok. Cand pornesc acest proiect pe portul 3000, automat cand pornesc si alt proiect, se porneste pe perturile disponibile? sau tot pe 3000 se va porni?
- env.d.ts
- integrate-new-projects.mjs

## God Nodes (most connected - your core abstractions)
1. `qd()` - 326 edges
2. `y()` - 62 edges
3. `e()` - 49 edges
4. `zr()` - 46 edges
5. `n()` - 28 edges
6. `u()` - 25 edges
7. `Ud()` - 23 edges
8. `J()` - 23 edges
9. `a()` - 23 edges
10. `sl()` - 23 edges

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

## Communities (64 total, 23 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.06
Nodes (31): dist, dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts (+23 more)

### Community 1 - "Pa"
Cohesion: 0.19
Nodes (19): ar(), ct(), D0(), Gc(), Is(), jc(), Kc(), Ku() (+11 more)

### Community 2 - "dependencies"
Cohesion: 0.15
Nodes (13): drizzle-orm, framer-motion, lucide-react, magic-string, dependencies, drizzle-orm, framer-motion, lucide-react (+5 more)

### Community 3 - "c0"
Cohesion: 0.30
Nodes (15): bc(), c0(), _e(), Gi(), H0(), Lt(), Qa(), Ru() (+7 more)

### Community 4 - "route.ts"
Cohesion: 0.39
Nodes (5): getDb(), GET(), POST(), toRouteErrorMessage(), notes

### Community 5 - "app/page.tsx"
Cohesion: 0.08
Nodes (34): contactCopy, copy, descriptions, localDescription(), Locale, locales, localizedDetail(), localType() (+26 more)

### Community 6 - "zr"
Cohesion: 0.08
Nodes (53): _0(), au(), br(), ce(), da(), Dc(), dl(), dr() (+45 more)

### Community 7 - "worker/index.ts"
Cohesion: 0.29
Nodes (3): Env, ExecutionContext, worker

### Community 8 - "app/layout.tsx"
Cohesion: 0.33
Nodes (4): geist, metadata, mono, viewport

### Community 9 - "Bd"
Cohesion: 0.67
Nodes (4): Bd(), A(), Yd(), A()

### Community 12 - "devDependencies"
Cohesion: 0.11
Nodes (19): @cloudflare/vite-plugin, drizzle-kit, eslint, @eslint/js, eslint-plugin-react, devDependencies, @cloudflare/vite-plugin, drizzle-kit (+11 more)

### Community 14 - "start-server.mjs"
Cohesion: 0.15
Nodes (13): devLockPath, extraArgs, findAvailablePort(), hasExplicitHost, portIsAvailable(), refreshScript, refreshTimer, root (+5 more)

### Community 15 - "y"
Cohesion: 0.11
Nodes (38): J(), A0(), Bi(), Bu(), cl(), dd(), ds(), Ed() (+30 more)

### Community 18 - "Ud"
Cohesion: 0.18
Nodes (8): cf(), B(), id(), r(), Ud(), Cl(), O(), Tt()

### Community 19 - "Hi"
Cohesion: 0.15
Nodes (18): Aa(), An(), cd(), e0(), Ha(), Hi(), In(), jf() (+10 more)

### Community 20 - "Nd"
Cohesion: 0.24
Nodes (11): Cd(), Nd(), yl(), D(), fd(), G(), Vl(), yl() (+3 more)

### Community 21 - "index-CRlfCg0A.js"
Cohesion: 0.08
Nodes (25): af, am, cm(), ef, em, Fd, Id, Jd (+17 more)

### Community 22 - "e1"
Cohesion: 0.20
Nodes (11): e1(), F(), Nl(), Q(), Q(), Y(), nm(), W() (+3 more)

### Community 23 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, db:generate, dev, lint, prebuild, showcase:refresh, showcase:sync (+2 more)

### Community 24 - "Ki"
Cohesion: 0.22
Nodes (10): Ae(), Ki(), pd(), Sm(), Td(), Te(), tl(), vo() (+2 more)

### Community 25 - "yl"
Cohesion: 0.22
Nodes (11): Y(), C(), ft(), $l(), pl(), O(), sd(), fl() (+3 more)

### Community 27 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, name, private, type, version

### Community 28 - "Ea"
Cohesion: 0.12
Nodes (21): Ac(), bo(), Ea(), eu(), fe(), io(), jo(), M0() (+13 more)

### Community 29 - "qd"
Cohesion: 0.07
Nodes (30): qd(), ad(), Ca(), ci(), co(), cs(), f0(), fo() (+22 more)

### Community 30 - "Wt"
Cohesion: 0.33
Nodes (6): df(), Em(), gd(), ir(), pi(), Wt()

### Community 34 - "MONO/DEV — catalog de proiecte"
Cohesion: 0.13
Nodes (13): Catalog, Limitele demonstrațiilor, Refacerea celor 32 de proiecte, Surse și întreținere, Verificare, Catalog runtime, Included Shape, Learn More (+5 more)

### Community 46 - "js"
Cohesion: 0.15
Nodes (17): bs(), Cc(), cn(), fn(), Gs(), It(), js(), jt() (+9 more)

### Community 55 - "e"
Cohesion: 0.09
Nodes (67): Hd(), ai(), Al(), at(), Cu(), De(), di(), dm() (+59 more)

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

### Community 74 - "L0"
Cohesion: 0.18
Nodes (19): _a(), ao(), bd(), du(), eo(), fr(), G0(), ga() (+11 more)

### Community 135 - "Q: analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are."
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: analizeaza cele 24 proiecte, daca toate sunt integral traduse in RO/RU/EN? daca nu, dami lista si ce probleme are., Source Nodes

### Community 162 - "sync-showcase.mjs"
Cohesion: 0.09
Nodes (24): previewDocument(), versionsPath, writeProjectPreview(), buildProject(), buildRequested, changedOnly, exists(), findOutput() (+16 more)

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
- **270 isolated node(s):** `metadata`, `typeMap`, `romanianTypeMap`, `descriptions`, `geist` (+265 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `locales` (2× useful, score=1.951172409) _(code changed — re-verify)_
- `projects` (2× useful, score=1.951172409) _(code changed — re-verify)_
- `projectSlugs` (2× useful, score=1.951172409) _(code changed — re-verify)_

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `qd()` connect `qd` to `Pa`, `c0`, `zr`, `Bd`, `L0`, `js`, `y`, `Ud`, `Hi`, `Nd`, `index-CRlfCg0A.js`, `e1`, `e`, `Ki`, `yl`, `Ea`, `Wt`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Why does `Ud()` connect `Ud` to `Nd`, `index-CRlfCg0A.js`, `e1`, `Ki`, `yl`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `eslint-plugin-jsx-a11y`, `eslint-plugin-react-hooks`, `globals`, `@next/eslint-plugin-next`, `@tailwindcss/postcss`, `@types/react`, `@types/react-dom`, `typescript`, `typescript-eslint`, `vinext`, `vite`, `@vitejs/plugin-react`, `@vitejs/plugin-rsc`, `package.json`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 18 inferred relationships involving `qd()` (e.g. with `ad()` and `cd()`) actually correct?**
  _`qd()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 19 inferred relationships involving `e()` (e.g. with `ao()` and `ci()`) actually correct?**
  _`e()` has 19 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `zr()` (e.g. with `A0()` and `a()`) actually correct?**
  _`zr()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `n()` (e.g. with `ai()` and `Cu()`) actually correct?**
  _`n()` has 16 INFERRED edges - model-reasoned connections that need verification._