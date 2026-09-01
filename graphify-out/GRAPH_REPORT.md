# Graph Report - vanzare proiecte  (2026-09-01)

## Corpus Check
- 24 files · ~131,435 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 171 nodes · 173 edges · 40 communities (12 shown, 28 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b29b43f5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- package.json
- dependencies
- include
- route.ts
- page.tsx
- eslint
- worker/index.ts
- layout.tsx
- rendered-html.test.mjs
- AGENTS.md
- eslint.config.mjs
- globals
- eslint-plugin-react
- devDependencies
- eslint-plugin-jsx-a11y
- next.config.ts
- next-env.d.ts
- @next/eslint-plugin-next
- react-server-dom-webpack
- tailwindcss
- @tailwindcss/postcss
- @types/react
- @types/react-dom
- typescript
- typescript-eslint
- vinext
- @eslint/js
- @vitejs/plugin-react
- @vitejs/plugin-rsc
- wrangler
- postcss.config.mjs
- vinext-starter
- contact/layout.tsx
- contact/page.tsx
- drizzle-kit
- @openai/sites-vite-plugin
- @types/node

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `scripts` - 7 edges
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

## Communities (40 total, 28 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.11
Nodes (18): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+10 more)

### Community 1 - "package.json"
Cohesion: 0.14
Nodes (13): engines, node, name, private, scripts, build, db:generate, dev (+5 more)

### Community 2 - "dependencies"
Cohesion: 0.15
Nodes (13): drizzle-orm, framer-motion, lucide-react, magic-string, dependencies, drizzle-orm, framer-motion, lucide-react (+5 more)

### Community 3 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 4 - "route.ts"
Cohesion: 0.39
Nodes (5): getDb(), GET(), POST(), toRouteErrorMessage(), notes

### Community 5 - "page.tsx"
Cohesion: 0.20
Nodes (16): copy, descriptions, localDescription(), Locale, locales, localizedDetail(), localType(), typeMap (+8 more)

### Community 7 - "worker/index.ts"
Cohesion: 0.29
Nodes (3): Env, ExecutionContext, worker

### Community 8 - "layout.tsx"
Cohesion: 0.40
Nodes (3): geist, metadata, mono

### Community 14 - "devDependencies"
Cohesion: 0.29
Nodes (7): @cloudflare/vite-plugin, eslint-plugin-react-hooks, devDependencies, @cloudflare/vite-plugin, eslint-plugin-react-hooks, vite, vite

### Community 34 - "vinext-starter"
Cohesion: 0.25
Nodes (7): Included Shape, Learn More, Prerequisites, Quick Start, Useful Commands, vinext-starter, Workspace Auth Headers

## Knowledge Gaps
- **89 isolated node(s):** `projects`, `filters`, `categorySlugs`, `projectSlugs`, `projectDetails` (+84 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`, `eslint`, `globals`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, `@next/eslint-plugin-next`, `react-server-dom-webpack`, `tailwindcss`, `@tailwindcss/postcss`, `@types/react`, `@types/react-dom`, `typescript`, `typescript-eslint`, `vinext`, `@eslint/js`, `@vitejs/plugin-react`, `@vitejs/plugin-rsc`, `wrangler`, `drizzle-kit`, `@openai/sites-vite-plugin`, `@types/node`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `projects`, `filters`, `categorySlugs` to the rest of the system?**
  _89 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._