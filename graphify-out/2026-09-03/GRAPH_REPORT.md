# Graph Report - vanzare proiecte  (2026-09-03)

## Corpus Check
- 108 files · ~688,231 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5443 nodes · 17564 edges · 176 communities (154 shown, 22 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 3009 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4ec4f705`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- compilerOptions
- scripts
- dependencies
- index-DLaChFLh.js
- route.ts
- app/page.tsx
- worker/index.ts
- app/layout.tsx
- AGENTS.md
- eslint.config.mjs
- devDependencies
- start-server.mjs
- PROMPT COMPLET — IMOBILIA ONE
- next.config.ts
- next-env.d.ts
- PROMPT COMPLET — MEDORA CLINIC
- PROMPT COMPLET — ACADEMIA
- PROMPT COMPLET — FLOW CRM
- PROMPT COMPLET — TABLEO
- PROMPT COMPLET — STAYNEST
- project-prompts/README.md
- academia/_next/static/chunks/framework-D_rUT4EX.js
- index-DZIH026o.js
- index-Dc85E_4y.js
- index-DX07COdD.js
- index-DAfP7sCC.js
- f2f58a7e93290fbb.js
- flow-crm/_next/static/chunks/framework-D_rUT4EX.js
- postcss.config.mjs
- vinext-starter
- contact/layout.tsx
- 37elybzku8j9j.js
- 1j_9b-l0n6u-t.js
- eh
- t
- medora-clinic/_next/static/chunks/framework-D_rUT4EX.js
- 5d4f98498ae0e5c6.js
- wf
- u
- r
- wf
- o
- t
- O
- n
- n
- n
- rg
- a
- push
- hu
- n
- t
- u
- i
- id
- academia/.vite/manifest.json
- flow-crm/.vite/manifest.json
- n
- Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?
- medora-clinic/.vite/manifest.json
- #r
- af
- e8f880eca99a243f.js
- wd
- t
- fu
- Ou
- Z
- q
- a
- prefetch
- 19mx3mg6lkumu.js
- prefetch
- push
- eh
- prefetch
- eh
- sy
- uu
- gu
- eh
- delete
- af
- Z
- r
- Z
- uc
- c7
- wd
- _
- i2
- rt
- u
- eh
- ic
- e
- fa
- push
- fa
- go
- rt
- af
- prefetch
- 4b9eae0c8dc7e975.js
- h
- fa
- xf
- sh
- O
- sr
- lc
- i
- sp
- rt
- fa
- i
- 0cz1d0mv5g_q7.js
- fw
- a6dad97d9634a72d.js
- medora-clinic/_next/static/chunks/streamed-icons-Bumrcy-j.js
- Nd
- zd
- 3fntmmi971322.js
- cn
- ss
- hc
- i8
- ug
- 35d1u26kqig3x.js
- q
- 1x4jhta-338sj.js
- zm
- er
- np
- get
- ke
- package.json
- ai
- eslint
- eslint-plugin-jsx-a11y
- eslint-plugin-react
- globals
- @next/eslint-plugin-next
- @openai/sites-vite-plugin
- react-server-dom-webpack
- @types/react
- typescript
- typescript-eslint
- vinext
- vite
- sync-showcase.mjs
- @vitejs/plugin-react
- wrangler
- Proiecte incluse în catalog

## God Nodes (most connected - your core abstractions)
1. `t()` - 154 edges
2. `o()` - 116 edges
3. `a()` - 110 edges
4. `a()` - 88 edges
5. `a()` - 88 edges
6. `#r()` - 83 edges
7. `e()` - 77 edges
8. `rv()` - 70 edges
9. `u()` - 60 edges
10. `t()` - 54 edges

## Surprising Connections (you probably didn't know these)
- `Zr()` --indirect_call--> `Rr()`  [INFERRED]
  public/flow-crm/_next/static/chunks/index-DAfP7sCC.js → public/flow-crm/_next/static/chunks/framework-D_rUT4EX.js
- `Zr()` --indirect_call--> `Rr()`  [INFERRED]
  public/flow-crm/_next/static/chunks/index-DX07COdD.js → public/flow-crm/_next/static/chunks/framework-D_rUT4EX.js
- `nz()` --indirect_call--> `nG()`  [INFERRED]
  public/staynest/_next/static/chunks/1j_9b-l0n6u-t.js → public/tableo/_next/static/chunks/f2f58a7e93290fbb.js
- `GET()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts
- `POST()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts

## Import Cycles
- None detected.

## Communities (176 total, 22 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+19 more)

### Community 1 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, db:generate, dev, lint, showcase:refresh, showcase:schedule, showcase:sync (+2 more)

### Community 2 - "dependencies"
Cohesion: 0.15
Nodes (13): drizzle-orm, framer-motion, lucide-react, magic-string, dependencies, drizzle-orm, framer-motion, lucide-react (+5 more)

### Community 3 - "index-DLaChFLh.js"
Cohesion: 0.01
Nodes (209): ai(), br(), Bt(), Na(), Or(), so(), aa(), ad() (+201 more)

### Community 4 - "route.ts"
Cohesion: 0.39
Nodes (5): getDb(), GET(), POST(), toRouteErrorMessage(), notes

### Community 5 - "app/page.tsx"
Cohesion: 0.11
Nodes (25): contactCopy, copy, descriptions, localDescription(), Locale, locales, localizedDetail(), localType() (+17 more)

### Community 7 - "worker/index.ts"
Cohesion: 0.29
Nodes (3): Env, ExecutionContext, worker

### Community 8 - "app/layout.tsx"
Cohesion: 0.33
Nodes (4): geist, metadata, mono, viewport

### Community 12 - "devDependencies"
Cohesion: 0.11
Nodes (19): @cloudflare/vite-plugin, drizzle-kit, @eslint/js, eslint-plugin-react-hooks, devDependencies, @cloudflare/vite-plugin, drizzle-kit, @eslint/js (+11 more)

### Community 14 - "start-server.mjs"
Cohesion: 0.29
Nodes (6): extraArgs, refreshScript, refreshTimer, root, server, vinextCli

### Community 15 - "PROMPT COMPLET — IMOBILIA ONE"
Cohesion: 0.20
Nodes (9): Criteriu final, Date și imagini, Funcții reale, Identitate vizuală, Mod showcase MONO/DEV, Obiectiv și public, Pagini publice, PROMPT COMPLET — IMOBILIA ONE (+1 more)

### Community 18 - "PROMPT COMPLET — MEDORA CLINIC"
Cohesion: 0.20
Nodes (9): Arhitectură de producție, Date și imagini, Definition of done, Design, Mod showcase, Pagini, Poziționare și conținut, Programare și portal (+1 more)

### Community 19 - "PROMPT COMPLET — ACADEMIA"
Cohesion: 0.22
Nodes (8): Brand și experiență, Conținut demonstrativ, Experiența studentului, Instructor și admin, Pagini publice, PROMPT COMPLET — ACADEMIA, Showcase, Tehnologie

### Community 20 - "PROMPT COMPLET — FLOW CRM"
Cohesion: 0.22
Nodes (8): AI util și controlabil, Date și multi-tenancy, Definition of done, Module, Produs și design, PROMPT COMPLET — FLOW CRM, Showcase, Tehnologie și securitate

### Community 21 - "PROMPT COMPLET — TABLEO"
Cohesion: 0.25
Nodes (7): Concept vizual, Conținut și pagini, Date și media, Funcționalități, PROMPT COMPLET — TABLEO, Showcase, Tehnologie și calitate

### Community 22 - "PROMPT COMPLET — STAYNEST"
Cohesion: 0.25
Nodes (7): Date, Direcție creativă, Motor de rezervare, Pagini, Producție, PROMPT COMPLET — STAYNEST, Showcase

### Community 24 - "academia/_next/static/chunks/framework-D_rUT4EX.js"
Cohesion: 0.03
Nodes (241): a(), aa(), ac(), af(), an(), Ao(), ap(), as() (+233 more)

### Community 25 - "index-DZIH026o.js"
Cohesion: 0.02
Nodes (103): Or(), ad(), allocateNavigationHistoryTraversalIndex(), ao(), at(), bc(), bi(), bn() (+95 more)

### Community 26 - "index-Dc85E_4y.js"
Cohesion: 0.02
Nodes (102): Or(), ad(), Ai(), allocateNavigationHistoryTraversalIndex(), at(), bc(), bi(), bn() (+94 more)

### Community 27 - "index-DX07COdD.js"
Cohesion: 0.02
Nodes (121): br(), xr(), ad(), Ai(), allocateNavigationHistoryTraversalIndex(), ao(), at(), bc() (+113 more)

### Community 28 - "index-DAfP7sCC.js"
Cohesion: 0.02
Nodes (96): ad(), Ai(), allocateNavigationHistoryTraversalIndex(), am(), append(), at(), bi(), bn() (+88 more)

### Community 29 - "f2f58a7e93290fbb.js"
Cohesion: 0.04
Nodes (93): fD(), a0(), a2(), a3(), a4(), a5(), a6(), a8() (+85 more)

### Community 30 - "flow-crm/_next/static/chunks/framework-D_rUT4EX.js"
Cohesion: 0.04
Nodes (91): ae(), ap(), Ar(), at(), bu(), C(), cf(), cs() (+83 more)

### Community 34 - "vinext-starter"
Cohesion: 0.25
Nodes (7): Included Shape, Learn More, Prerequisites, Quick Start, Useful Commands, vinext-starter, Workspace Auth Headers

### Community 36 - "37elybzku8j9j.js"
Cohesion: 0.10
Nodes (92): ch(), cm(), ea(), ei(), eo(), eu(), J(), c() (+84 more)

### Community 37 - "1j_9b-l0n6u-t.js"
Cohesion: 0.03
Nodes (80): a0(), a1(), a3(), a4(), a5(), a7(), a8(), a9() (+72 more)

### Community 38 - "eh"
Cohesion: 0.05
Nodes (103): Ji(), zo(), A(), ae(), append(), b(), be(), c() (+95 more)

### Community 39 - "t"
Cohesion: 0.05
Nodes (86): a(), s(), e(), t(), o(), ua(), Ai(), n() (+78 more)

### Community 40 - "medora-clinic/_next/static/chunks/framework-D_rUT4EX.js"
Cohesion: 0.05
Nodes (62): ad(), ae(), ai(), Ar(), br(), bu(), cr(), ct() (+54 more)

### Community 41 - "5d4f98498ae0e5c6.js"
Cohesion: 0.09
Nodes (56): a(), B(), c(), D(), E(), ea(), ee(), ei() (+48 more)

### Community 42 - "wf"
Cohesion: 0.07
Nodes (73): A(), ae(), append(), b(), be(), c(), ce(), D() (+65 more)

### Community 43 - "u"
Cohesion: 0.06
Nodes (70): ab(), aC(), ak(), aL(), aS(), av(), aw(), ax() (+62 more)

### Community 44 - "r"
Cohesion: 0.08
Nodes (75): A(), ae(), b(), be(), c(), ce(), D(), de() (+67 more)

### Community 45 - "wf"
Cohesion: 0.08
Nodes (66): A(), ae(), append(), be(), c(), ce(), D(), de() (+58 more)

### Community 46 - "o"
Cohesion: 0.09
Nodes (64): o(), A(), ae(), append(), be(), c(), ce(), D() (+56 more)

### Community 47 - "t"
Cohesion: 0.06
Nodes (70): a(), s(), e(), t(), n(), bo(), dd(), i() (+62 more)

### Community 48 - "O"
Cohesion: 0.09
Nodes (53): i(), nf(), O(), r(), back(), fn(), a(), o() (+45 more)

### Community 49 - "n"
Cohesion: 0.12
Nodes (57): a(), aw(), c(), ct(), cu(), D(), E(), eH() (+49 more)

### Community 50 - "n"
Cohesion: 0.12
Nodes (50): a(), a7(), ah(), aQ(), cl(), l(), d(), E() (+42 more)

### Community 51 - "n"
Cohesion: 0.07
Nodes (46): n(), bc(), bf(), bs(), dd(), ed(), el(), en() (+38 more)

### Community 52 - "rg"
Cohesion: 0.07
Nodes (51): add(), clearNamespace(), #e(), e7(), eb(), entries(), ep(), eV() (+43 more)

### Community 53 - "a"
Cohesion: 0.11
Nodes (52): a(), aa(), ac(), Ao(), bc(), bd(), be(), ca() (+44 more)

### Community 54 - "push"
Cohesion: 0.07
Nodes (39): Uo(), ac(), bs(), cc(), dc(), dp(), fp(), gc() (+31 more)

### Community 55 - "hu"
Cohesion: 0.07
Nodes (48): at(), Au(), Cu(), dd(), di(), es(), Eu(), fi() (+40 more)

### Community 56 - "n"
Cohesion: 0.07
Nodes (54): a(), s(), n(), bo(), bp(), dd(), i(), r() (+46 more)

### Community 57 - "t"
Cohesion: 0.11
Nodes (46): b(), bi(), bs(), ce(), Ci(), de(), Ei(), ep() (+38 more)

### Community 58 - "u"
Cohesion: 0.08
Nodes (18): a(), b(), c(), E(), g(), h(), j(), l() (+10 more)

### Community 59 - "i"
Cohesion: 0.13
Nodes (45): ce(), Ci(), de(), df(), ds(), Ei(), ep(), Et() (+37 more)

### Community 60 - "id"
Cohesion: 0.10
Nodes (45): ak(), aP(), aS(), ax(), cY(), eB(), eV(), fc() (+37 more)

### Community 61 - "academia/.vite/manifest.json"
Cohesion: 0.05
Nodes (45): app/page.tsx, file, imports, isDynamicEntry, name, src, _framework-D_rUT4EX.js, file (+37 more)

### Community 62 - "flow-crm/.vite/manifest.json"
Cohesion: 0.05
Nodes (45): app/page.tsx, file, imports, isDynamicEntry, name, src, _framework-D_rUT4EX.js, file (+37 more)

### Community 63 - "n"
Cohesion: 0.07
Nodes (54): aa(), ac(), as(), b(), bd(), bi(), Bo(), bs() (+46 more)

### Community 64 - "Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: De ce arata rau /neo-booking/ pe portul 3004, dar bine pe portul 3001?, Source Nodes

### Community 65 - "medora-clinic/.vite/manifest.json"
Cohesion: 0.05
Nodes (45): app/page.tsx, file, imports, isDynamicEntry, name, src, _framework-D_rUT4EX.js, file (+37 more)

### Community 66 - "#r"
Cohesion: 0.16
Nodes (45): addKeyframes(), compound(), compoundsWith(), e0(), l(), eF(), eG(), eH() (+37 more)

### Community 67 - "af"
Cohesion: 0.09
Nodes (25): Bt(), af(), back(), bd(), cf(), dn(), ei(), fn() (+17 more)

### Community 68 - "e8f880eca99a243f.js"
Cohesion: 0.08
Nodes (32): compare(), constructor(), D(), e2(), e3(), e5(), ea(), ee() (+24 more)

### Community 69 - "wd"
Cohesion: 0.06
Nodes (46): ad(), Ar(), cr(), dr(), Ed(), Er(), fn(), fr() (+38 more)

### Community 70 - "t"
Cohesion: 0.05
Nodes (98): a(), s(), e(), t(), Uo(), o(), ac(), Ai() (+90 more)

### Community 71 - "fu"
Cohesion: 0.07
Nodes (45): ab(), aH(), aU(), aV(), c7(), e4(), e5(), e8() (+37 more)

### Community 72 - "Ou"
Cohesion: 0.15
Nodes (26): Au(), cd(), Cu(), Eu(), gu(), id(), it(), ku() (+18 more)

### Community 73 - "Z"
Cohesion: 0.14
Nodes (26): Al(), bl(), cl(), dl(), el(), fl(), ga(), Il() (+18 more)

### Community 74 - "q"
Cohesion: 0.08
Nodes (37): Au(), bl(), bm(), bu(), cd(), clear(), Fu(), gl() (+29 more)

### Community 75 - "a"
Cohesion: 0.11
Nodes (37): a(), an(), C(), cf(), Du(), ec(), en(), f() (+29 more)

### Community 76 - "prefetch"
Cohesion: 0.08
Nodes (31): am(), An(), ca(), cu(), da(), Fl(), ga(), Gd() (+23 more)

### Community 77 - "19mx3mg6lkumu.js"
Cohesion: 0.07
Nodes (10): a(), d, f(), i(), l(), n(), T(), u() (+2 more)

### Community 78 - "prefetch"
Cohesion: 0.05
Nodes (66): am(), Au(), bl(), bm(), bu(), cd(), clear(), Cm() (+58 more)

### Community 79 - "push"
Cohesion: 0.07
Nodes (43): Vd(), ac(), bs(), cc(), dc(), gt(), hd(), ht() (+35 more)

### Community 80 - "eh"
Cohesion: 0.07
Nodes (36): An(), ar(), b(), bf(), Cm(), cp(), eh(), y() (+28 more)

### Community 81 - "prefetch"
Cohesion: 0.06
Nodes (51): Au(), bl(), bm(), bu(), cd(), clear(), cu(), Fl() (+43 more)

### Community 82 - "eh"
Cohesion: 0.08
Nodes (32): ba(), Cm(), cp(), delete(), Dm(), eh(), Em(), Fm() (+24 more)

### Community 83 - "sy"
Cohesion: 0.12
Nodes (30): ae(), an(), ao(), ar(), at(), c1(), c3(), cg() (+22 more)

### Community 84 - "uu"
Cohesion: 0.08
Nodes (35): c4(), c6(), ci(), co(), cx(), e2(), e6(), fB() (+27 more)

### Community 85 - "gu"
Cohesion: 0.17
Nodes (21): Au(), Cu(), Eu(), gu(), kp(), ku(), mi(), np() (+13 more)

### Community 86 - "eh"
Cohesion: 0.09
Nodes (29): ba(), Cm(), cp(), delete(), Dm(), eh(), Em(), Fm() (+21 more)

### Community 87 - "delete"
Cohesion: 0.08
Nodes (40): Au(), bm(), clear(), delete(), Dm(), du(), Fu(), g() (+32 more)

### Community 88 - "af"
Cohesion: 0.10
Nodes (22): af(), ca(), cf(), da(), ei(), ga(), ha(), Ii() (+14 more)

### Community 89 - "Z"
Cohesion: 0.12
Nodes (30): Al(), bl(), cl(), dl(), el(), fl(), ga(), gl() (+22 more)

### Community 90 - "r"
Cohesion: 0.16
Nodes (29): c(), e1(), eX(), ey(), fromAst(), h(), K(), keysInNamespaces() (+21 more)

### Community 91 - "Z"
Cohesion: 0.13
Nodes (29): Al(), bl(), cl(), dl(), el(), fl(), ga(), Hf() (+21 more)

### Community 92 - "uc"
Cohesion: 0.12
Nodes (28): be(), co(), E(), Ea(), fc(), go(), Hd(), ho() (+20 more)

### Community 93 - "c7"
Cohesion: 0.12
Nodes (28): c2(), c3(), c4(), c5(), c6(), c7(), c8(), c9() (+20 more)

### Community 94 - "wd"
Cohesion: 0.12
Nodes (25): ad(), cr(), dr(), Ed(), Er(), fn(), fr(), Gd() (+17 more)

### Community 95 - "_"
Cohesion: 0.13
Nodes (17): _, a(), b, c(), d(), f(), j, l() (+9 more)

### Community 96 - "i2"
Cohesion: 0.14
Nodes (27): fo(), i1(), i2(), i7(), i9(), ia(), ib(), iF() (+19 more)

### Community 97 - "rt"
Cohesion: 0.10
Nodes (23): a(), s(), bt(), Cn(), ft(), gt(), ht(), it() (+15 more)

### Community 98 - "u"
Cohesion: 0.16
Nodes (20): bt(), du(), ft(), g(), gt(), ht(), it(), jt() (+12 more)

### Community 99 - "eh"
Cohesion: 0.06
Nodes (41): An(), ar(), b(), ba(), bf(), ca(), da(), eh() (+33 more)

### Community 100 - "ic"
Cohesion: 0.14
Nodes (26): Ao(), bc(), ca(), cc(), da(), dc(), fs(), ha() (+18 more)

### Community 101 - "e"
Cohesion: 0.13
Nodes (26): cb(), cG(), cw(), cy(), e0(), fa(), t(), i3() (+18 more)

### Community 102 - "fa"
Cohesion: 0.09
Nodes (27): aa(), Ap(), bp(), dp(), fa(), fp(), gp(), hp() (+19 more)

### Community 103 - "push"
Cohesion: 0.09
Nodes (33): Uo(), ac(), cc(), dc(), gc(), hc(), he(), ic() (+25 more)

### Community 104 - "fa"
Cohesion: 0.14
Nodes (20): aa(), Ap(), bp(), dp(), fa(), fp(), jp(), ka() (+12 more)

### Community 105 - "go"
Cohesion: 0.10
Nodes (25): ao(), bo(), co(), dc(), Do(), Eo(), fo(), go() (+17 more)

### Community 106 - "rt"
Cohesion: 0.20
Nodes (14): bt(), ft(), gt(), ht(), it(), jt(), kt(), mt() (+6 more)

### Community 107 - "af"
Cohesion: 0.09
Nodes (25): Bt(), af(), back(), bd(), cf(), dn(), ei(), fn() (+17 more)

### Community 108 - "prefetch"
Cohesion: 0.11
Nodes (23): am(), cd(), cu(), Fl(), gr(), Il(), ku(), ld() (+15 more)

### Community 109 - "4b9eae0c8dc7e975.js"
Cohesion: 0.13
Nodes (10): c(), f(), i(), l(), M(), o(), p(), R() (+2 more)

### Community 110 - "h"
Cohesion: 0.16
Nodes (21): af(), df(), Dn(), ef(), gf(), If(), jf(), Jt() (+13 more)

### Community 111 - "fa"
Cohesion: 0.13
Nodes (20): aa(), Ap(), dp(), fa(), fp(), gp(), hp(), jp() (+12 more)

### Community 112 - "xf"
Cohesion: 0.20
Nodes (10): ar(), bf(), _f(), Gf(), Jf(), or(), qf(), vf() (+2 more)

### Community 113 - "sh"
Cohesion: 0.18
Nodes (22): eM(), eR(), eV(), lP(), rs(), sa(), sb(), sc() (+14 more)

### Community 115 - "O"
Cohesion: 0.17
Nodes (21): af(), ef(), gf(), Hf(), If(), jf(), Jt(), kf() (+13 more)

### Community 116 - "sr"
Cohesion: 0.17
Nodes (21): ed(), ef(), ej(), eM(), es(), lY(), rp(), rz() (+13 more)

### Community 117 - "lc"
Cohesion: 0.14
Nodes (19): ac(), cc(), ea(), gc(), ia(), ic(), jo(), lc() (+11 more)

### Community 118 - "i"
Cohesion: 0.18
Nodes (15): cN(), cR(), i, i5(), ij(), iQ(), iv(), iw() (+7 more)

### Community 119 - "sp"
Cohesion: 0.19
Nodes (23): aE(), an(), ea(), ei(), ii(), im(), ip(), J() (+15 more)

### Community 120 - "rt"
Cohesion: 0.10
Nodes (25): af(), bt(), cf(), ei(), ft(), Ii(), it(), jt() (+17 more)

### Community 121 - "fa"
Cohesion: 0.10
Nodes (24): aa(), Ap(), ca(), da(), fa(), ga(), gp(), ha() (+16 more)

### Community 122 - "i"
Cohesion: 0.25
Nodes (5): ck(), cu(), cx(), i(), id()

### Community 123 - "0cz1d0mv5g_q7.js"
Cohesion: 0.18
Nodes (9): e(), eb(), hb(), ib(), nb(), ob(), rb(), sb() (+1 more)

### Community 124 - "fw"
Cohesion: 0.14
Nodes (16): aO(), aU(), eH(), ej(), fw(), lH(), lQ(), lu() (+8 more)

### Community 125 - "a6dad97d9634a72d.js"
Cohesion: 0.18
Nodes (9): e(), eb(), hb(), ib(), nb(), ob(), rb(), sb() (+1 more)

### Community 126 - "medora-clinic/_next/static/chunks/streamed-icons-Bumrcy-j.js"
Cohesion: 0.47
Nodes (4): i(), a(), i(), o()

### Community 127 - "Nd"
Cohesion: 0.22
Nodes (14): en(), fd(), ln(), Nd(), on(), pd(), Q(), Qt() (+6 more)

### Community 128 - "zd"
Cohesion: 0.15
Nodes (15): df(), Fd(), ff(), hf(), Kd(), lf(), mf(), Ns() (+7 more)

### Community 129 - "3fntmmi971322.js"
Cohesion: 0.15
Nodes (4): R(), s(), T(), x()

### Community 130 - "cn"
Cohesion: 0.16
Nodes (14): vn(), vn(), vn(), vn(), vn(), cn(), cr(), ta() (+6 more)

### Community 131 - "ss"
Cohesion: 0.11
Nodes (24): as(), Bo(), Fo(), fs(), Fu(), ha(), is(), Iu() (+16 more)

### Community 132 - "hc"
Cohesion: 0.14
Nodes (26): an(), E(), en(), fd(), gc(), hc(), hn(), ia() (+18 more)

### Community 134 - "i8"
Cohesion: 0.22
Nodes (13): f0(), f1(), f2(), f6(), t(), i8(), ik(), l0() (+5 more)

### Community 135 - "ug"
Cohesion: 0.21
Nodes (13): fg(), fh(), ih(), im(), lp(), sc(), uE(), ug() (+5 more)

### Community 136 - "35d1u26kqig3x.js"
Cohesion: 0.23
Nodes (10): b(), c(), f(), g(), l(), l(), o(), s() (+2 more)

### Community 137 - "q"
Cohesion: 0.08
Nodes (37): be(), Hd(), Mf(), Vd(), Au(), bm(), cd(), clear() (+29 more)

### Community 138 - "1x4jhta-338sj.js"
Cohesion: 0.24
Nodes (8): a(), c(), f(), g(), l(), l(), o(), u()

### Community 139 - "zm"
Cohesion: 0.11
Nodes (20): An(), ar(), back(), bd(), dn(), fn(), Gd(), getDerivedStateFromError() (+12 more)

### Community 140 - "er"
Cohesion: 0.24
Nodes (11): e4(), e9(), ed(), l(), er(), a(), rn(), t5() (+3 more)

### Community 141 - "np"
Cohesion: 0.29
Nodes (10): ap(), kp(), np(), t(), Qa(), tp(), ut(), wp() (+2 more)

### Community 143 - "get"
Cohesion: 0.39
Nodes (9): b(), ec(), el(), eo(), es(), eU(), eW(), get() (+1 more)

### Community 144 - "ke"
Cohesion: 0.67
Nodes (4): ae(), Ee(), ke(), Oe()

### Community 145 - "package.json"
Cohesion: 0.29
Nodes (6): engines, node, name, private, type, version

### Community 149 - "ai"
Cohesion: 0.50
Nodes (4): ai(), Ri(), Ri(), Ri()

### Community 162 - "sync-showcase.mjs"
Cohesion: 0.14
Nodes (17): buildProject(), buildRequested, exists(), findOutput(), ignoredNames, isInside(), missing, prefixDocument() (+9 more)

## Knowledge Gaps
- **246 isolated node(s):** `metadata`, `typeMap`, `romanianTypeMap`, `descriptions`, `geist` (+241 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `1j_9b-l0n6u-t.js`, `u`, `f2f58a7e93290fbb.js`, `n`, `c7`?**
  _High betweenness centrality (0.300) - this node is a cross-community bridge._
- **Why does `ci()` connect `uu` to `index-DLaChFLh.js`, `1j_9b-l0n6u-t.js`, `n`, `index-DZIH026o.js`, `index-Dc85E_4y.js`, `index-DX07COdD.js`, `index-DAfP7sCC.js`?**
  _High betweenness centrality (0.287) - this node is a cross-community bridge._
- **Why does `mi()` connect `index-DLaChFLh.js` to `academia/_next/static/chunks/framework-D_rUT4EX.js`, `uu`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Are the 118 inferred relationships involving `t()` (e.g. with `a()` and `bd()`) actually correct?**
  _`t()` has 118 INFERRED edges - model-reasoned connections that need verification._
- **Are the 37 inferred relationships involving `o()` (e.g. with `ep()` and `gu()`) actually correct?**
  _`o()` has 37 INFERRED edges - model-reasoned connections that need verification._
- **Are the 38 inferred relationships involving `a()` (e.g. with `ac()` and `as()`) actually correct?**
  _`a()` has 38 INFERRED edges - model-reasoned connections that need verification._
- **Are the 24 inferred relationships involving `a()` (e.g. with `ac()` and `as()`) actually correct?**
  _`a()` has 24 INFERRED edges - model-reasoned connections that need verification._