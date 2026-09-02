# Graph Report - vanzare proiecte  (2026-09-02)

## Corpus Check
- 31 files · ~200,407 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 215 nodes · 220 edges · 25 communities (18 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1f422124`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- scripts
- dependencies
- include
- route.ts
- app/page.tsx
- worker/index.ts
- app/layout.tsx
- AGENTS.md
- eslint.config.mjs
- devDependencies
- start-server.mjs
- next.config.ts
- next-env.d.ts
- postcss.config.mjs
- vinext-starter
- contact/layout.tsx
- Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?
- sync-showcase.mjs
- Proiecte incluse în catalog

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `scripts` - 10 edges
3. `include` - 7 edges
4. `vinext-starter` - 7 edges
5. `localType()` - 5 edges
6. `Home()` - 4 edges
7. `getDb()` - 4 edges
8. `localDescription()` - 4 edges
9. `localizedDetail()` - 4 edges
10. `lib` - 4 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts
- `POST()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts
- `ProjectVisual()` --calls--> `localDescription()`  [EXTRACTED]
  app/page.tsx → app/i18n.ts
- `ProjectVisual()` --calls--> `localType()`  [EXTRACTED]
  app/page.tsx → app/i18n.ts
- `Home()` --calls--> `localDescription()`  [EXTRACTED]
  app/page.tsx → app/i18n.ts

## Import Cycles
- None detected.

## Communities (25 total, 7 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.11
Nodes (18): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+10 more)

### Community 1 - "scripts"
Cohesion: 0.12
Nodes (16): engines, node, name, private, scripts, build, db:generate, dev (+8 more)

### Community 2 - "dependencies"
Cohesion: 0.15
Nodes (13): drizzle-orm, framer-motion, lucide-react, magic-string, dependencies, drizzle-orm, framer-motion, lucide-react (+5 more)

### Community 3 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 4 - "route.ts"
Cohesion: 0.39
Nodes (5): getDb(), GET(), POST(), toRouteErrorMessage(), notes

### Community 5 - "app/page.tsx"
Cohesion: 0.12
Nodes (24): contactCopy, copy, descriptions, localDescription(), Locale, locales, localizedDetail(), localType() (+16 more)

### Community 7 - "worker/index.ts"
Cohesion: 0.29
Nodes (3): Env, ExecutionContext, worker

### Community 8 - "app/layout.tsx"
Cohesion: 0.33
Nodes (4): geist, metadata, mono, viewport

### Community 12 - "devDependencies"
Cohesion: 0.04
Nodes (47): @cloudflare/vite-plugin, drizzle-kit, eslint, @eslint/js, eslint-plugin-jsx-a11y, eslint-plugin-react, eslint-plugin-react-hooks, globals (+39 more)

### Community 14 - "start-server.mjs"
Cohesion: 0.29
Nodes (6): extraArgs, refreshScript, refreshTimer, root, server, vinextCli

### Community 34 - "vinext-starter"
Cohesion: 0.25
Nodes (7): Included Shape, Learn More, Prerequisites, Quick Start, Useful Commands, vinext-starter, Workspace Auth Headers

### Community 64 - "Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?, Source Nodes

### Community 162 - "sync-showcase.mjs"
Cohesion: 0.14
Nodes (17): buildProject(), buildRequested, exists(), findOutput(), ignoredNames, isInside(), missing, prefixDocument() (+9 more)

## Knowledge Gaps
- **117 isolated node(s):** `projects`, `filters`, `hiddenCategories`, `unavailableProjectIds`, `filterCopy` (+112 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `scripts`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `projects`, `filters`, `hiddenCategories` to the rest of the system?**
  _117 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1164021164021164 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._