# Graph Report - vanzare proiecte  (2026-09-01)

## Corpus Check
- 43 files · ~594,870 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1556 nodes · 3851 edges · 121 communities (69 shown, 52 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 404 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ec72e256`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- scripts
- dependencies
- 125cywvngpi._.js
- route.ts
- app/page.tsx
- 0axn.kz6_oov4.js
- worker/index.ts
- layout.tsx
- rendered-html.test.mjs
- AGENTS.md
- eslint.config.mjs
- devDependencies
- 12lpibyw0h3uj.js
- n
- 0eewamb49pw7k.js
- next.config.ts
- next-env.d.ts
- 0t~alnn~v6duj.js
- e
- iu
- check
- tp
- oy
- sh
- r
- se
- s
- nx
- get
- .has
- postcss.config.mjs
- vinext-starter
- contact/layout.tsx
- contact/page.tsx
- .start
- tc
- eF
- turbopack-15avfona-7rq_.js
- u
- sv
- 01xlw8hd842-c.js
- gt
- t
- 03~yq9q893hmn.js
- i
- rP
- R
- vj
- then
- su
- clone
- .constructor
- tn
- rq
- .updateMotionValue
- startsWith
- .initAnimation
- package.json
- 05j62z02hzh1t.js
- e5
- t2
- Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?
- un
- oa
- ca
- cd
- ce
- cf
- cG
- ch
- cv
- iD
- nm
- nv
- pq
- t1
- eslint
- eslint-plugin-jsx-a11y
- eslint-plugin-react
- eslint-plugin-react-hooks
- @openai/sites-vite-plugin
- react-server-dom-webpack
- @tailwindcss/postcss
- @types/react-dom
- typescript
- typescript-eslint
- vinext
- vite
- @vitejs/plugin-react
- @vitejs/plugin-rsc
- LICENSES.md
- and
- c$
- ci
- cl
- cn
- co
- cp
- cr
- cs
- ct
- cu
- cz
- d2
- d9
- default
- e1
- exactOptional
- nonoptional
- oq
- p6
- uQ
- sync-showcase.mjs
- showcase-projects/README.md

## God Nodes (most connected - your core abstractions)
1. `su()` - 65 edges
2. `iu()` - 63 edges
3. `u()` - 61 edges
4. `t()` - 34 edges
5. `n()` - 34 edges
6. `tp()` - 34 edges
7. `sh()` - 33 edges
8. `check()` - 33 edges
9. `s()` - 32 edges
10. `l()` - 30 edges

## Surprising Connections (you probably didn't know these)
- `rg()` --indirect_call--> `rp()`  [INFERRED]
  public/pophaus/_next/static/chunks/125cywvngpi._.js → public/pophaus/_next/static/chunks/0axn.kz6_oov4.js
- `ay()` --indirect_call--> `ao()`  [INFERRED]
  public/pophaus/_next/static/chunks/0axn.kz6_oov4.js → public/pophaus/_next/static/chunks/125cywvngpi._.js
- `GET()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts
- `POST()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts
- `hx()` --indirect_call--> `hb()`  [INFERRED]
  public/pophaus/_next/static/chunks/125cywvngpi._.js → public/pophaus/_next/static/chunks/03~yq9q893hmn.js

## Import Cycles
- None detected.

## Communities (121 total, 52 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+19 more)

### Community 1 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, db:generate, dev, lint, showcase:sync, start, test

### Community 2 - "dependencies"
Cohesion: 0.15
Nodes (13): drizzle-orm, framer-motion, lucide-react, magic-string, dependencies, drizzle-orm, framer-motion, lucide-react (+5 more)

### Community 3 - "125cywvngpi._.js"
Cohesion: 0.02
Nodes (3): ao(), om(), rg()

### Community 4 - "route.ts"
Cohesion: 0.39
Nodes (5): getDb(), GET(), POST(), toRouteErrorMessage(), notes

### Community 5 - "app/page.tsx"
Cohesion: 0.17
Nodes (18): copy, descriptions, localDescription(), Locale, locales, localizedDetail(), localType(), romanianTypeMap (+10 more)

### Community 6 - "0axn.kz6_oov4.js"
Cohesion: 0.04
Nodes (77): a1(), a3(), a4(), a5(), a6(), a7(), a9(), aD() (+69 more)

### Community 7 - "worker/index.ts"
Cohesion: 0.29
Nodes (3): Env, ExecutionContext, worker

### Community 8 - "layout.tsx"
Cohesion: 0.40
Nodes (3): geist, metadata, mono

### Community 12 - "devDependencies"
Cohesion: 0.11
Nodes (19): @cloudflare/vite-plugin, drizzle-kit, @eslint/js, globals, @next/eslint-plugin-next, devDependencies, @cloudflare/vite-plugin, drizzle-kit (+11 more)

### Community 13 - "12lpibyw0h3uj.js"
Cohesion: 0.12
Nodes (61): a(), b(), c(), d(), E(), ea(), eb(), ec() (+53 more)

### Community 14 - "n"
Cohesion: 0.08
Nodes (69): a(), aH(), aQ(), b(), ca(), cl(), co(), cr() (+61 more)

### Community 15 - "0eewamb49pw7k.js"
Cohesion: 0.07
Nodes (28): a(), b(), c, clear(), constructor(), l(), d(), delete() (+20 more)

### Community 18 - "0t~alnn~v6duj.js"
Cohesion: 0.05
Nodes (31): a, b(), c(), d(), E(), ea(), ec(), ee() (+23 more)

### Community 19 - "e"
Cohesion: 0.07
Nodes (49): cE(), ck(), cP(), cx(), fu(), i3(), i4(), i6() (+41 more)

### Community 20 - "iu"
Cohesion: 0.09
Nodes (44): ab(), aC(), ak(), aS(), aT(), aw(), ax(), ay() (+36 more)

### Community 21 - "check"
Cohesion: 0.06
Nodes (44): c2(), c3(), c5(), c6(), c7(), c9(), check(), cq() (+36 more)

### Community 22 - "tp"
Cohesion: 0.10
Nodes (9): iA(), iN(), n1(), rN(), rt(), tm(), tO, tp() (+1 more)

### Community 23 - "oy"
Cohesion: 0.09
Nodes (31): aA(), aF(), aj(), aU(), az(), e2(), eH(), ej() (+23 more)

### Community 24 - "sh"
Cohesion: 0.15
Nodes (30): ae(), an(), ar(), cc(), cf(), ea(), ei(), el() (+22 more)

### Community 25 - "r"
Cohesion: 0.09
Nodes (29): c8(), db(), ep(), gi(), gn(), r(), i3(), i5() (+21 more)

### Community 26 - "se"
Cohesion: 0.15
Nodes (28): eM(), eR(), eV(), fe(), lQ(), rc(), rh(), rm() (+20 more)

### Community 27 - "s"
Cohesion: 0.13
Nodes (20): is(), a$(), aw(), az(), createPanHandlers(), iO(), s(), ir() (+12 more)

### Community 28 - "nx"
Cohesion: 0.12
Nodes (7): as(), eH(), eY(), nI, nx(), nY, register()

### Community 29 - "get"
Cohesion: 0.11
Nodes (18): ax(), dq(), du(), eA(), s(), f1(), get(), ig() (+10 more)

### Community 30 - ".has"
Cohesion: 0.10
Nodes (12): o(), eG(), eI(), eS(), ew(), iu(), rM(), tD() (+4 more)

### Community 34 - "vinext-starter"
Cohesion: 0.25
Nodes (7): Included Shape, Learn More, Prerequisites, Quick Start, Useful Commands, vinext-starter, Workspace Auth Headers

### Community 37 - ".start"
Cohesion: 0.24
Nodes (9): ie(), iz(), n$(), nb, nh(), np(), rJ(), t3() (+1 more)

### Community 39 - "eF"
Cohesion: 0.13
Nodes (4): eB(), eF(), eJ, eK

### Community 40 - "turbopack-15avfona-7rq_.js"
Cohesion: 0.17
Nodes (17): d(), f(), g(), get(), h(), loadWebAssembly(), loadWebAssemblyModule(), m() (+9 more)

### Community 41 - "u"
Cohesion: 0.12
Nodes (21): a0(), a2(), a8(), ag(), aM(), aP(), av(), cI() (+13 more)

### Community 42 - "sv"
Cohesion: 0.10
Nodes (22): sb(), di(), dr(), ds(), oX(), readonly(), sg(), sh() (+14 more)

### Community 43 - "01xlw8hd842-c.js"
Cohesion: 0.13
Nodes (11): b, c(), d(), E, f(), g(), h, l() (+3 more)

### Community 44 - "gt"
Cohesion: 0.14
Nodes (17): a7(), apply(), B(), gt(), L(), lx(), o$(), oE() (+9 more)

### Community 45 - "t"
Cohesion: 0.14
Nodes (18): cc(), cm(), cx(), cy(), dj(), dK(), fN(), fU() (+10 more)

### Community 46 - "03~yq9q893hmn.js"
Cohesion: 0.18
Nodes (9): e(), eb(), hb(), ib(), nb(), ob(), rb(), sb() (+1 more)

### Community 47 - "i"
Cohesion: 0.16
Nodes (13): i(), tb(), tc(), tf(), tg(), th(), tm(), ts() (+5 more)

### Community 48 - "rP"
Cohesion: 0.14
Nodes (5): catch(), p8(), rP, rS(), tr()

### Community 50 - "vj"
Cohesion: 0.13
Nodes (15): f2(), array(), d4(), f9(), h1(), hG(), md(), or() (+7 more)

### Community 51 - "then"
Cohesion: 0.14
Nodes (13): constructor(), dO(), dP(), oF(), pipe(), pW(), rF(), rV() (+5 more)

### Community 52 - "su"
Cohesion: 0.14
Nodes (14): c0(), c1(), c4(), cb(), d6(), m$(), mc(), mg() (+6 more)

### Community 53 - "clone"
Cohesion: 0.15
Nodes (14): catchall(), clone(), describe(), loose(), meta(), passthrough(), pb(), pl() (+6 more)

### Community 54 - ".constructor"
Cohesion: 0.19
Nodes (5): it, tb(), tK(), tT(), tx()

### Community 56 - "rq"
Cohesion: 0.20
Nodes (10): ap(), n2(), nq(), nT(), rb(), rH(), rk, rq() (+2 more)

### Community 57 - ".updateMotionValue"
Cohesion: 0.29
Nodes (5): e7(), e9(), rt(), e0(), e3()

### Community 58 - "startsWith"
Cohesion: 0.25
Nodes (8): endsWith(), ic(), ip(), me(), mt(), o4(), startsWith(), tq()

### Community 60 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, name, private, type, version

### Community 61 - "05j62z02hzh1t.js"
Cohesion: 0.47
Nodes (4): a(), c(), o(), u()

### Community 63 - "t2"
Cohesion: 0.33
Nodes (6): t2(), t5(), t6(), t7(), t8(), t9()

### Community 64 - "Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?, Source Nodes

### Community 66 - "oa"
Cohesion: 1.00
Nodes (3): oa(), oo(), u8()

### Community 67 - "ca"
Cohesion: 0.67
Nodes (3): ca(), cj(), hy()

### Community 68 - "cd"
Cohesion: 0.67
Nodes (3): cd(), d3(), hi()

### Community 69 - "ce"
Cohesion: 0.67
Nodes (3): ce(), hl(), hs()

### Community 70 - "cf"
Cohesion: 0.67
Nodes (3): cf(), d8(), ha()

### Community 71 - "cG"
Cohesion: 0.67
Nodes (3): cG(), ck(), positive()

### Community 72 - "ch"
Cohesion: 0.67
Nodes (3): ch(), d7(), hn()

### Community 73 - "cv"
Cohesion: 0.67
Nodes (3): cv(), d5(), hr()

### Community 75 - "nm"
Cohesion: 0.67
Nodes (3): nc(), nf(), nm()

### Community 76 - "nv"
Cohesion: 0.67
Nodes (3): ng(), nv(), nW()

### Community 77 - "pq"
Cohesion: 0.67
Nodes (3): nullish(), optional(), pq()

### Community 78 - "t1"
Cohesion: 0.67
Nodes (3): t0(), t1(), t4()

### Community 162 - "sync-showcase.mjs"
Cohesion: 0.14
Nodes (17): buildMissing, buildProject(), exists(), findOutput(), ignoredNames, isInside(), missing, prefixDocument() (+9 more)

## Knowledge Gaps
- **109 isolated node(s):** `metadata`, `contactCode`, `typeMap`, `romanianTypeMap`, `descriptions` (+104 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `M()` connect `12lpibyw0h3uj.js` to `R`, `0eewamb49pw7k.js`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `R()` connect `R` to `125cywvngpi._.js`, `eF`, `gt`, `12lpibyw0h3uj.js`, `sh`, `r`, `startsWith`, `.initAnimation`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `a()` connect `0eewamb49pw7k.js` to `12lpibyw0h3uj.js`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `iu()` (e.g. with `aS()` and `a()`) actually correct?**
  _`iu()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `u()` (e.g. with `a()` and `fk()`) actually correct?**
  _`u()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 19 inferred relationships involving `t()` (e.g. with `an()` and `cn()`) actually correct?**
  _`t()` has 19 INFERRED edges - model-reasoned connections that need verification._
- **Are the 17 inferred relationships involving `n()` (e.g. with `al()` and `ca()`) actually correct?**
  _`n()` has 17 INFERRED edges - model-reasoned connections that need verification._