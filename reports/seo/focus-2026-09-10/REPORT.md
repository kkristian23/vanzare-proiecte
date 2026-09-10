# MONO/DEV — raport SEO final

10 septembrie 2026 · https://monodev.md · Implementare locală verificată, fără deploy, modificări DNS sau activarea conturilor externe.

## Rezultatul implementării

- **63 proiecte cu `seoEnabled: false`; 189 pagini RO/RU/EN cu `noindex, follow`.** Rutele, prețurile, ratele, chiria, modalurile și demo-urile rămân disponibile.
- **Sitemap: 246 → 57 URL-uri.** Exact 189 URL-uri individuale au fost eliminate, fără pierderea unei pagini generale. Grupurile hreflang ale proiectelor au fost eliminate din HTML și sitemap; Product/Offer este dezactivat.
- `catalog-directory` este eliminat din markup și CSS. Comparația cu sursa inițială confirmă că homepage-ul diferă numai prin eliminarea solicitată și importul devenit inutil. Nu există secțiuni, paragrafe sau elemente vizibile noi.
- Metadata homepage și patru familii de servicii au fost îmbunătățite în RO/RU/EN, păstrând H1, descrierile vizibile și designul.
- **18/18 teste statice, 5/5 teste browser, build și TypeScript trecute.** Audit static: zero probleme. Parser-ele oficiale Netlify: zero erori.
- `graphify update .` a fost executat: 1.446 noduri, 2.832 muchii, 119 comunități; numai AST, fără cost API/LLM.

**Situația publicării:** auditul HTTP a găsit 404 la `/ro`, `/ru`, `/en`, `robots.txt`, `sitemap.xml` și rutele localizate eșantionate. 34/35 verificări publice nu corespund build-ului local; verificarea adresei inexistente a trecut. Modificările nu au fost publicate și nu produc încă efecte în Google. Configurarea/publicarea corectă a hostingului și verificarea după deploy sunt prioritare. [Audit public](production-audit.json)

## Baza inițială și protejarea modificărilor

Înainte de editări au fost inventariate 251 fișiere modificate/neînregistrate, cu SHA-256 și backup al surselor relevante. [Inventar și locația backup-ului](baseline-files.json). Fișierele demo suplimentare au primit backup înaintea modificării: [inventarul demo](baseline-demo-files.json).

Implementarea avea deja canonical, hreflang RO-MD/RU-MD/EN și x-default EN, metadata, OG, Twitter Cards, Organization/WebSite, Service/BreadcrumbList, sitemap automat, redirecturi Netlify și Analytics cu consimțământ. Aceste mecanisme au fost păstrate. Inițial, toate cele 189 pagini de proiect erau indexabile și emiteau Product/Offer.

Erori preexistente confirmate înainte de modificări:

- `npm test`: build reușit, **13/14 teste trecute**. Schema FAQ conținea 100 întrebări, dar răspunsurile nu erau în HTML-ul inițial, în toate limbile.
- Browser: **1/2 teste trecute**. Testul FAQ presupunea răspunsuri în DOM și o căutare absentă din interfața actuală.
- TypeScript inițial: trecut.

FAQ a fost reparat fără schimbarea interfeței: întrebările și răspunsurile existente sunt prerandate, iar controalele acordeonului păstrează aceleași stări vizibile. Nu este conținut destinat numai crawlerelor. Testul urmează acum categoriile existente, fără introducerea unei căutări noi.

Verificarea extinsă a identificat și 218 fișiere demo cu meta `index, follow`, în contradicție cu headerul noindex. Alte trei aveau `noindex, nofollow`. Toate cele 221 au fost uniformizate la `noindex, follow`; modificările sunt limitate la robots/googlebot. Restul HTML este identic în comparația independentă. [Verificarea păstrării fișierelor și lista exactă a schimbărilor](changes.json)

Nu s-au folosit reset/checkout distructiv, ștergeri recursive sau anularea modificărilor utilizatorului. Niciun fișier inițial inventariat nu lipsește.

## URL-uri, metadata și headere

| Grup | Rezultat final |
|---|---|
| `/`, `/index.html` | Regula 301 existentă către `/ro`; fără duplicat în sitemap. |
| `/ro`, `/ru`, `/en` | Homepage și catalog indexabile, index/follow. |
| `/{locale}/services` și cele 10 servicii/categorii | Toate rămân indexabile. |
| `/{locale}/about`, `/process`, `/contact`, `/intrebari` | Indexabile, cu conținut și navigare păstrate. |
| `/{locale}/terms`, `/privacy`, `/cookies` | Indexabile; nicio pagină informativă retrasă. |
| `/{locale}/projects/{slug}` | 189 pagini accesibile, noindex/follow, canonical propriu, fără hreflang sau Product/Offer. |
| Query-uri istorice `lang` / `proiect` | Aceleași 301 către pagina localizată, care transmite noindex. Niciun proiect nu este redirecționat la homepage. |
| Demo HTML și aliasuri | X-Robots-Tag noindex/follow; absente din sitemap. |
| Cabinet, 404 și payloaduri tehnice | Politica existentă noindex/nofollow. |

Lista celor **57 URL-uri canonice** este în [keyword-map.json](keyword-map.json), câmpul `indexablePages`. Există 19 pagini per limbă: homepage, opt pagini generale și zece servicii. Nu s-au fabricat categorii, pagini pentru parametri sau variante de oraș.

Canonical-urile MONO/DEV și grupurile hreflang indexabile nu au fost schimbate. Auditul verifică reciprocitatea în HTML și sitemap. Un proiect noindex păstrează canonical propriu; selectorul de limbă rămâne navigare normală pentru utilizatori.

`public/_redirects`, `public/robots.txt`, `netlify.toml`, layout-ul, traducerile homepage și integrarea Analytics sunt neschimbate față de inventarul inițial. Cele **1.314 redirecturi**, regulile cache și configurația existentă sunt păstrate. Robots permite crawl-ul, necesar citirii noindex. [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

Headerele proiectelor acoperă **1.134 forme exacte**: 189 rute × variante fără/cu slash, `.html`, `/index`, `/index/`, `/index.html`. Demo-urile au **4.778 căi HTML/aliasuri**, din 64 directoare. Cele 6.479 payloaduri `.txt`, extensia `.rsc` și manifestul tehnic sunt tratate separat. Nu există wildcard pe directoare demo care să includă imagini, CSS, JavaScript sau fonturi.

Auditul a inspectat **1.422 fișiere HTML demo**: 328 cu noindex în meta, 1.094 protejate prin header. Prebuild corectează punctual directivele contradictorii dacă resincronizarea exporturilor le reintroduce. Excluderea fișierelor fără meta depinde de publicarea headerelor generate. [Audit static](static-audit.json)

Parser-ele oficiale Netlify, headers 10.1.1 și redirects 16.1.1, acceptă **12.407 reguli de headere**, inclusiv cache, și 1.314 redirecturi fără erori. `_headers` are 945.804 bytes; `_redirects` 106.891 bytes. Aceasta este validare locală a configurației, nu dovadă a răspunsurilor CDN. [Rezultat](netlify-parser.json), [documentație Netlify](https://docs.netlify.com/manage/routing/headers/)

## Cercetare și strategie comercială

[Cercetarea RO/RU/EN](KEYWORDS.md) și [harta celor 69 expresii](keyword-map.json) includ pentru fiecare expresie limba, intenția, relevanța, pagina, title și description implementate, H1 existent, conținut, linkuri interne, canibalizare, surse și filtrele GSC.

Homepage-ul deține cererea generală de creare/dezvoltare web și brandul. Serviciile separă prezentarea companiei, designul, magazinul online, aplicațiile, nișele existente, personalizarea, mentenanța și alegerea unei baze gata de lansare. Ratele și chiria sunt asociate paginii existente de proiecte gata de lansare, fără pagini artificiale separate.

S-au ajustat metadata celor trei homepage-uri și a serviciilor prezentare, web design, e-commerce și aplicații × trei limbi. H1 și textele vizibile sunt păstrate. Nu se creează pagini aproape identice pentru Chișinău sau variații ortografice.

Limite: accesul direct la Google cu `gl=md` a returnat eroare; cercetarea folosește rezultatele web disponibile și oferta reală. Nu există acces la GSC/Keyword Planner. **Nu sunt inventate volume, dificultăți sau poziții.** Cererea exactă pentru nișe, chirie și rate este marcată ca ipoteză de validat. Sursele arată intenții și oferte, nu volumul fiecărui termen.

Organization, WebSite, Service și BreadcrumbList rămân bazate pe informațiile existente. Nu au fost adăugate adrese, fondatori, clienți, recenzii sau parteneriate. FAQPage reflectă răspunsurile existente accesibile prin acordeon. Google a retras afișarea rezultatelor îmbogățite FAQ în mai 2026; schema validă nu promite afișare specială. [Actualizări Google Search Central](https://developers.google.com/search/updates)

## Activarea SEO în viitor

- Fiecare proiect are flag propriu în catalog; cele cinci proiecte de grădinărit îl declară în `app/garden-projects.ts`, de unde este preluat în catalog.
- `app/lib/project-seo.ts` acceptă strict `seoEnabled === true`. Valori lipsă sau stringul `"true"` nu activează indexarea.
- `app/lib/seo-routes.ts` furnizează selecția comună pentru sitemap, headere și audituri. Metadata, hreflang și Product/Offer folosesc aceeași politică.
- Activarea ulterioară a unui singur proiect, urmată de build/deploy, îi adaugă URL-urile localizate în sitemap, activează hreflang și schema și elimină noindex-ul. Celelalte proiecte și toate demo-urile rămân excluse.
- Scenariul este verificat cu o copie în memorie. **Niciun proiect real nu este activat acum.**

## Fișiere și motive

| Fișiere | Modificare |
|---|---|
| Catalog și garden-projects | Flag explicit, separat de disponibilitatea comercială. |
| `app/lib/project-seo.ts`, `app/lib/seo-routes.ts` — noi | Politică centrală și selecția rutelor. |
| Pagina localizată de proiect | Metadata/schema condiționate; UI și acțiuni păstrate. |
| `app/home-client.tsx`, `app/project-pages.css` | Eliminarea directorului solicitat și a CSS-ului aferent. |
| Site-config, services, pagina serviciului | Metadata comercială, fără schimbarea H1/descrierii vizibile. |
| `app/intrebari/faq-client.tsx` | Repararea nepotrivirii preexistente FAQ schema/HTML. |
| Generatoarele SEO/Netlify | Sitemap, headere exacte și normalizarea demo robots. |
| `scripts/audit-seo.mjs` | Audit complet indexabil/noindex, hreflang XML, Twitter, prețuri, demo și HTTP public. |
| Testele de politică SEO — noi; rendered-html/browser; package.json | Scenarii viitoare, regresii și integrare în npm test. |
| Sitemap, headere și 221 HTML demo | Fișiere generate / atribute robots; restul resurselor păstrat. |
| Documentele SEO și graphify-out | Documentarea politicii curente și actualizarea grafului. |

[changes.json](changes.json) conține fiecare cale, motivul și hashurile relevante. Rapoartele și capturile noi sunt în acest director. Raportul SEO anterior rămâne păstrat ca istoric și trimite la această actualizare.

## Verificări înainte / după

| Verificare | Inițial | Final |
|---|---|---|
| Build | Reușit, 251 rute prerandate | Reușit, 251 rute prerandate |
| Teste aplicație/SEO/export | 13/14 | 18/18 |
| Browser | 1/2 | 5/5; RO/RU/EN × desktop/mobil |
| TypeScript | Trecut | Trecut |
| Audit HTML/XML | FAQ neconform; proiecte indexabile | 247 pagini parseate; zero probleme |
| Sitemap | 246 | 57; zero pagini generale pierdute |
| Lint final | Codul vizat exista deja | 0 erori, 3 avertismente existente |

Avertismentele lint privesc două img existente și dependența `categories` a unui useEffect existent. Nu au fost făcute schimbări de design pentru eliminarea lor.

Browserul verifică toate cele 63 carduri după încărcare, căutare/ștergere, filtre, sortare după preț, platforme, tastatură, modal, Escape, rate la 3/6/12 luni, ambele pachete de chirie, acces demo/detalii, limbi și precompletarea contactului. Zero erori runtime/hidratare/console.error în fluxurile testate. Auditul verifică legăturile tuturor paginilor generale și ale celor 189 proiecte: zero legături rupte identificate.

AquaVerde, GazonPro și Audio Rental au fost încărcate separat: 200 și zero erori de pagină în încărcările eșantionate. Nu se pretinde testarea fiecărui control intern al tuturor demo-urilor; conservarea lor este susținută și de comparația care arată modificări exclusiv la robots.

Dovezi: [build și teste](final-test-build.log), [browser](final-browser.log), [TypeScript](final-typecheck.log), [lint](final-lint.log), [audit static](static-audit.json), [graphify](graphify-update.log). Logurile inițiale au prefixul `baseline-`.

## Dimensiuni și aspect

| Homepage | HTML inițial → final, bytes | Gzip inițial → final, bytes |
|---|---:|---:|
| RO | 82,870 → 67,693 | 15,589 → 12,301 |
| RU | 90,399 → 71,458 | 17,320 → 13,233 |
| EN | 82,346 → 67,257 | 15,369 → 12,094 |

Export client: 263,500,302 → 262,782,138 bytes; reducere 718,164 bytes, cu același număr de 10,947 fișiere. Nu s-au eliminat pagini de proiect.

Capturile `final-{locale}-{desktop|mobile}.png` arată interfața păstrată și pagina scurtată prin eliminarea directorului. Inspecția vizuală nu a arătat regresii evidente; nu există overflow orizontal al documentului în cele șase verificări. [Metrici](final-metrics.json), [comparație](visual-comparison.json).

Măsurători locale fără throttling: LCP 316–1.056 ms, CLS 0 în cele șase încărcări. Sunt diagnostice pe localhost, **nu Core Web Vitals de producție și nu INP de teren**. Nu există o măsurătoare inițială LCP/INP echivalentă pentru a pretinde un câștig. Fonturile locale, font-display swap, dimensiunile imaginilor și lazy loading existente sunt păstrate. [Google despre CWV](https://developers.google.com/search/docs/appearance/core-web-vitals)

## Măsurare, autoritate și pași următori

1. Publică exportul `dist/client` pe hostingul corect, apoi verifică din nou 200/301/404, headerele, canonical și sitemap. Auditul public actual nu este conform build-ului local.
2. În Search Console, verifică proprietatea Domain din contul proprietarului și trimite sitemap-ul cu 57 URL-uri. Inspectează homepage-uri și servicii. Pentru proiecte, verifică excluderea noindex și eliminarea treptată după recrawl, fără cerere de indexare sau Disallow.
3. Salvează o bază pe 28 zile și compară perioade echivalente. Segmentează după Moldova, mobil/desktop, prefix URL RO/RU/EN și brand/non-brand. GSC nu are un filtru de limbă presupus; limba se derivă din ruta paginii. EN internațional se măsoară separat.
4. Urmărește impresii, clickuri, CTR, poziție medie, pagini cu vizibilitate și interogări cu impresii și poziție medie ≤10/≤3. Aceste praguri sunt indicatori operaționali, nu dovada unei poziții constante. Harta include filtre query exact + page. Verifică lunar canibalizarea.
5. Dacă GA4 are ID valid și consimțământ, analizează Organic Search → pagina de intrare → project_request/email_click/phone_click/form_submit. Form_submit înseamnă pregătirea mesajului, nu primirea emailului sau plata. Reconciliază cererile reale cu mesajele/contractele. Integrarea și protecția datelor existente sunt păstrate.
6. Crește autoritatea prin profiluri reale consecvente, lucrări proprii, studii de caz aprobate și mențiuni relevante în publicații/comunități. Fără backlinkuri cumpărate în masă, recenzii fictive sau directoare automate. Nu inventa un sediu și nu crea Business Profile fără eligibilitate confirmată.
7. Recomandare pentru aprobare ulterioară: explicații contractuale suplimentare despre avans, cost total, proprietate și încetarea chiriei în pagina existentă; studii de caz numai cu dovezi și acord. Aceste texte nu au fost adăugate automat.

[Documentația raportului GSC](https://support.google.com/webmasters/answer/7576553?hl=en) descrie indicatorii și filtrarea. Configurarea instrumentelor este pregătită, dar nu există date de cont care să demonstreze rezultate comerciale.

**Top 3 este un obiectiv strategic, nu o garanție.** Rezultatele depind de concurență, calitatea/relevanța conținutului, autoritate și linkuri externe, istoricul domeniului, viteza reală, experiența și comportamentul utilizatorilor și consistența optimizării. Vechimea singură nu garantează clasarea.

## Limite rămase

- Deploy-ul nu a fost efectuat; rutele localizate publice verificate răspund 404. Este necesară verificarea hostingului/publicării.
- Volumele exacte, clasările Google Moldova, GSC/GA4 și CWV de teren nu sunt disponibile; nu sunt înlocuite cu estimări inventate.
- Testele au rulat pe Node 24.18.0; proiectul declară >=22.13 <24, iar Netlify este fixat pe 22.13.0. Dependențele/runtime-ul nu au fost schimbate; build-ul pe runtime-ul Netlify se verifică la publicare.
- Graphify a raportat 42 fișiere fără noduri AST, în principal JSON/rapoarte; unele etichete de comunități provin din analiza precedentă. Avertismentele sunt păstrate în log; nu s-a pornit extragere semantică plătită.
- Textele și afirmațiile comerciale preexistente sunt conservate conform cerinței; nu se pretinde validare juridică sau comercială independentă a tuturor acestora.

Modificările locale ale utilizatorului au fost păstrate. Catalogul comercial și toate cele 189 pagini de detalii rămân accesibile; excluderea privește indexarea.
