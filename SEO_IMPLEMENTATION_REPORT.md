# Implementarea SEO MONO/DEV

> Actualizare ulterioară, 10 septembrie 2026: strategia curentă concentrează indexarea pe MONO/DEV. Cele 63 de proiecte / 189 pagini sunt `noindex, follow`, fără Product/Offer sau hreflang; sitemap-ul are 57 URL-uri. `catalog-directory` este eliminat. [Raportul actual și comparația cu baza locală](reports/seo/focus-2026-09-10/REPORT.md), [cercetarea și harta keyword → pagină](reports/seo/focus-2026-09-10/KEYWORDS.md). Textul de mai jos păstrează istoricul implementării inițiale; numerele și constatările inițiale nu înlocuiesc raportul actual.

Data verificării: 10 septembrie 2026. Domeniu canonic: `https://monodev.md`. Implementare locală, fără deploy, modificări DNS sau activarea serviciilor externe.

## Ce s-a implementat

- Configurație centrală pentru brand, contacte confirmate, RO/RU/EN, URL-uri, metadata, canonical și hreflang. Email: `monodev@gmail.com`; telefon existent: `+373 78 868 996`. Nu s-a atribuit un sediu sau oraș MONO/DEV.
- Catalog extras în modul reutilizabil: toate cele 64 de înregistrări rămân în sursă; 63 sunt publice. Categoria ascunsă existentă nu este publicată în paginile SEO.
- 189 de pagini de proiect (63 × 3), 30 de pagini de servicii (10 × 3), contact și FAQ localizate, index servicii și pagini Despre/Proces/Confidențialitate/Termeni/Cookies.
- Toate cele 100 de întrebări FAQ rămân disponibile, cu traduceri complete în EN și RU și răspunsuri în HTML-ul inițial. Filtrarea și acordioanele rămân funcționale.
- Prețurile EUR provin din `app/project-prices.json`; opțiunile existente de chirie și rate sunt păstrate. Cererea prin email este prezentată ca pregătire a mesajului, fără a pretinde că mesajul a fost recepționat sau plata încasată.
- Linkuri reale între limbi, către fiecare proiect, servicii, contact și paginile de informare. Catalogul păstrează filtrarea, paginarea și previzualizarea modală.
- Capturi reale noi pentru 23 de demonstrații, inclusiv cele cinci proiecte de grădinărit; toate cele 63 de proiecte publice au acum capturi din interfața reală. Imaginile existente au fost păstrate. Imaginea OG existentă a fost verificată vizual și are 1731 × 909 px. Favicon ICO, PNG pentru dispozitive și manifest adăugate pornind de la identitatea SVG existentă.
- Cele 45 de carduri cu imagini au 90 de variante WebP responsive la 480/800 px, disponibile direct în HTML. Originalele au fost verificate prin SHA-256 și rămân intacte. Variantele de 800 px totalizează 1,92 MB față de 4,23 MB pentru surse; browserul descarcă numai varianta potrivită. Generatorul de mentenanță este separat de prebuild.
- Zoom permis atât prin viewport, cât și prin CSS tactil. Fonturi locale în export inclusiv pentru alfabetul chirilic; imagini de catalog lazy, fără încărcarea automată a demo-urilor; CDN-ul de imagini recunoaște domeniul canonic. Titlul contactului RU se încadrează pe mobil. Stilurile ample ale homepage-ului sunt încărcate numai pe homepage; paginile secundare folosesc stilurile comune și propriile componente.
- Auditul fără JavaScript a identificat titlul principal invizibil până la hidratare. Animația sa este păstrată în CSS și poate începe imediat după încărcarea stilurilor. Previzualizarea cardului folosește un buton real, iar pagina permanentă are link separat, ambele accesibile din tastatură.
- GA4 opțional prin `NEXT_PUBLIC_GA_MEASUREMENT_ID`, încărcat doar după acceptare. Fără ID valid nu există script Google Analytics sau banner inutil. Evenimentele nu transmit conținutul formularului; detaliile și configurarea măsurării automate sunt în checklist.

## URL-uri și sitemap

Pentru fiecare limbă `ro`, `ru`, `en`:

```text
/{locale}
/{locale}/contact
/{locale}/intrebari
/{locale}/services
/{locale}/services/{slug}
/{locale}/projects/{slug}
/{locale}/about
/{locale}/process
/{locale}/privacy
/{locale}/terms
/{locale}/cookies
```

Sitemap-ul cuprinde **246 URL-uri canonice HTTPS**: 189 proiecte, 30 servicii și 27 pagini principale/de informare. Nu conține cabinetul, demo-urile, filtrele sau parametrii vechi.

Exemplu pentru aceeași pagină de proiect:

```html
<link rel="canonical" href="https://monodev.md/ru/projects/aquaverde">
<link rel="alternate" hreflang="ro-MD" href="https://monodev.md/ro/projects/aquaverde">
<link rel="alternate" hreflang="ru-MD" href="https://monodev.md/ru/projects/aquaverde">
<link rel="alternate" hreflang="en" href="https://monodev.md/en/projects/aquaverde">
<link rel="alternate" hreflang="x-default" href="https://monodev.md/en/projects/aquaverde">
```

Legăturile sunt reciproce și fiecare limbă are canonical propriu. `/en` și paginile sale echivalente sunt x-default.

## Export și controlul indexării

Vinext instalat: `1.0.0-beta.2`. `output: "export"` rămâne activ. Exportatorul instalat omite metadata routes dinamice în `emitStaticMetadataFiles`, de aceea există o singură implementare: `scripts/generate-seo.mjs` generează `public/robots.txt` și `public/sitemap.xml` din datele aplicației. Build-ul le copiază în `dist/client`.

`generateStaticParams` este declarat explicit și pe contact și FAQ: primul build a demonstrat că declarația părintelui singură nu era suficientă pentru aceste rute. Build-ul final cu Node **22.13.0**, versiunea Netlify, exportă **251 de rute**, inclusiv paginile de compatibilitate, cabinet și 404.

Scheme implementate: Organization, WebSite, Product/Offer, Service, BreadcrumbList, FAQPage. JSON-LD este serializat sigur, cu prețuri și disponibilitate din catalog. Fără recenzii, ratinguri sau LocalBusiness fictive.

Redirecturi permanente generate în `public/_redirects`: HTTPS și www spre hostul canonic; `/` și intrările vechi spre `/ro`; combinații recunoscute `lang`/`proiect` spre destinații permanente; păstrarea parametrilor de contact. Există **1314 de reguli**, fără catch-all 200. Parametrii suplimentari neacoperiți de o regulă exactă rămân compatibili și au canonical către ruta curată.

Cabinetul are `noindex, nofollow` în HTML și headere. Headerele noindex ale demo-urilor sunt generate din inventarul HTML real al celor 64 de directoare: 4778 de căi și aliasuri. Sunt protejate separat 6479 de payloaduri `.txt`, fișierele `*.rsc` și manifestul intern. Resursele CSS/JS și imaginile rămân accesibile. `robots.txt` permite crawl-ul pentru observarea noindex.

Comportamentul CDN în producție (301, headere, HTTPS, 404) necesită verificare după un deploy autorizat. Exportul static local nu demonstrează răspunsurile serverului public. Convențiile sunt documentate în [documentația Netlify](https://docs.netlify.com/manage/routing/headers/) și în [opțiunile de redirect](https://docs.netlify.com/manage/routing/redirects/redirect-options/).

Parserele oficiale Netlify au acceptat 11273 de reguli de headere (inclusiv cele cinci reguli existente de cache) și toate cele 1314 redirecturi, fără erori. [Raportul de validare](reports/seo/netlify-parser-validation.json) verifică și aliasuri cu slash, payloaduri și excluderea imaginilor/CSS/JS.

## Verificări

Artefactele sunt în `reports/seo/`, iar logurile locale în `reports/seo-*.log` și `reports/seo/all-tests.log`.

- Audit DOM al HTML-ului exportat: 246 pagini publice și cabinet; zero probleme la verificarea finală. Raport: [static-audit.json](reports/seo/static-audit.json).
- Typecheck Node 22.13.0: trecut.
- Lint: zero erori, două avertismente `no-img-element` pentru imagini statice cu dimensiuni explicite.
- Build Node 22.13.0: cod de ieșire 0, 251 rute, zero omisiuni.
- Suita completă: **107/107 teste trecute**, zero eșecuri, zero teste sărite; include testele existente ale demo-urilor, auditul SEO și navigarea multilingvă. După ultima ajustare CSS pentru animații reduse, buildul și auditul tuturor paginilor au trecut din nou; cele două teste browser au trecut, inclusiv deschiderea previzualizării cu Enter, închiderea modalului și accesarea paginii permanente.
- Navigare browser: limbi, linkuri permanente, FAQ, precompletare contact; fără erori de hidratare în eșantionul verificat.
- Verificare vizuală și browser pe 11 pagini: homepage în toate cele trei limbi, trei proiecte, trei servicii, contact RU mobil și FAQ EN desktop. Zero erori de runtime/hidratare, zero depășiri orizontale și zero scripturi Analytics neconfigurate. Titlul homepage este vizibil și fără JavaScript; serverul local răspunde 404 pentru o adresă inexistentă. [Rezultate](reports/seo/browser-review.json).
- `graphify update .`: cod de ieșire 0; **1415 noduri, 2767 relații, 111 comunități**. `graph.json` și `GRAPH_REPORT.md` au fost actualizate, cu backup al grafului anterior. Actualizarea este AST, fără apeluri LLM.

Avertismente rămase în tooling: Vinext raportează emiterea repetată a aceluiași fișier CSS, iar Node/dependențele raportează avertismente de depreciere/funcții experimentale; exportul și aspectul rezultat au fost verificate. Graphify nu produce noduri AST pentru 31 de fișiere de date/rapoarte și semnalează că unele etichete de comunitate necesită ulterior o actualizare semantică. Acestea nu au fost raportate drept verificări semantice reușite.

## Performanță măsurată și limite

Lighthouse 13.4.1, mobil simulat, export static local cu gzip, câte o măsurare pe rută. Aceste rezultate nu sunt date Core Web Vitals din producție, iar TBT nu reprezintă INP.

| Pagină | Performanță | Accesibilitate | SEO | FCP | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/ro` | 75 | 100 | 100 | 3,21 s | 4,56 s | 0 | 162 ms |
| `/en/projects/aquaverde` | 94 | 100 | 100 | 2,04 s | 2,81 s | 0 | 13 ms |

Față de măsurarea anterioară cu aceeași compresie, transferul homepage a scăzut de la 1501659 la 694672 octeți (**−53,7%**), iar LCP de la 4,72 la 4,56 s. Transferul paginii de proiect a scăzut de la 330150 la 299377 octeți, iar LCP de la 3,01 la 2,81 s. Fișierul CSS comun transferat a scăzut de la 34014 la 3192 octeți. Verificarea numelor accesibile ale cardurilor trece acum.

**Ținta orientativă LCP ≤ 2,5 s nu este încă atinsă în aceste măsurări.** CLS este 0 în ambele. INP necesită date de la utilizatori reali după publicare. Următoarea optimizare măsurată ar trebui să urmărească JavaScript-ul și lucrul pe firul principal al homepage-ului (aproximativ 77 KiB JS nefolosit în încărcarea inițială și 3,9 s de lucru simulat), CSS-ul homepage-ului și variante responsive pentru captura mare a proiectului. Nu se justifică eliminarea generală a animațiilor sau comprimarea suplimentară a imaginilor fără verificare vizuală.

[Rezultatele și metodologia completă](reports/seo/performance-summary.json). Primele rapoarte pe portul 4010 au folosit transfer necomprimat și sunt păstrate numai pentru diagnostic; nu sunt folosite drept comparație controlată.

## Ce necesită proprietarul

Nu sunt inventate date despre entitatea juridică, IDNO, fondator, adresă, experiență, profiluri sociale, clienți sau testimoniale. Proprietarul trebuie să confirme aceste date, condițiile licenței și contractului, politica efectivă privind datele și drepturile imaginilor/demo-urilor. Catalogul NEO Barber Club are conținut demonstrativ de locație care merită revizuit; acesta nu este prezentat drept sediu MONO/DEV.

Testele au descoperit un defect existent în meniul mobil Archi: meniul rămânea deschis după navigare. Corecția din export are un normalizator repetabil la sincronizare și teste în cele trei limbi. Vizitatorii care au deja vechiul bundle în cache cu `immutable` pot păstra comportamentul vechi; un build ulterior din sursa Archi trebuie să genereze un hash nou pentru reîmprospătarea lor. Sursa externă nu a fost modificată.

Pașii externi și planul de 30/60/90 zile sunt în [SEO_LAUNCH_CHECKLIST.md](SEO_LAUNCH_CHECKLIST.md): DNS Search Console, trimiterea sitemap-ului, URL Inspection, indexare, GA4 real, Bing, validatoare Schema/OG și monitorizare 404/CTR. Nu s-a efectuat niciunul dintre pașii care modifică servicii externe.

Plan editorial de 12 săptămâni, autori reali, exemple verificabile și promovare prin mențiuni legitime: [seo-editorial-plan.md](docs/seo-editorial-plan.md). Articolele nu au fost publicate automat. Eligibilitatea Google Business Profile trebuie confirmată; nu se propune adresă virtuală pentru o activitate exclusiv online.

## Fișiere

Lista completă a fișierelor create și modificate este în [docs/seo-file-inventory.md](docs/seo-file-inventory.md). Schimbările locale preexistente din graphify-out și `reports/project-image-optimization.json` au fost păstrate; nu s-au folosit resetări sau ștergeri ale lucrului utilizatorului.
