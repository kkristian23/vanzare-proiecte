# Arhitectura SEO statică

## Politica actuală de indexare — 10 septembrie 2026

Accesul public și SEO sunt independente. Toate cele 63 de proiecte au `seoEnabled: false` în catalog; pentru cele cinci proiecte de grădinărit, proprietatea este în `app/garden-projects.ts` și este preluată în catalog. `app/lib/project-seo.ts` aplică strict `seoEnabled === true` pentru metadata, hreflang și Product/Offer. `app/lib/seo-routes.ts` furnizează aceeași selecție generatorului sitemap, headerelor și auditului.

Sitemap-ul include 57 pagini generale și nicio pagină individuală de proiect. Cele 189 de pagini de proiect continuă să fie prerandate și accesibile, cu `noindex, follow`, canonical propriu și fără hreflang. Selectorul de limbă rămâne navigare normală. Exemplele hreflang pentru proiecte de mai jos descriu numai comportamentul după o activare explicită viitoare.

Pentru activarea ulterioară a unui singur proiect se schimbă numai flagul lui, apoi se rulează `npm test`, auditul și build-ul, urmate de publicarea și verificarea CDN. Sitemap, hreflang, Product/Offer și eliminarea headerului noindex sunt automate; restul proiectelor rămân excluse. Testul cu un proiect activ folosește o copie în memorie, fără activarea vreunui proiect real. Demo-ul rămâne noindex indiferent de flag.

Demo HTML și aliasurile lui primesc `noindex, follow`; cabinetul, 404 și payloadurile tehnice păstrează `noindex, nofollow`. Prebuild corectează punctual meta robots/googlebot contradictorii din exporturile demo, fără schimbarea resurselor. [Raport și validare](../reports/seo/focus-2026-09-10/REPORT.md).

Originea unică este `https://monodev.md`, definită în `app/lib/site-config.ts`. Datele proiectelor sunt în `app/lib/project-catalog.ts`, cu prețuri din `app/project-prices.json`; serviciile folosesc `app/lib/services.ts`. Nu se copiază manual catalogul pentru sitemap, redirecturi sau pagini.

## URL-uri și limbi

Pentru fiecare `locale` din `ro`, `ru`, `en` există pagina principală `/{locale}`, `/contact`, `/intrebari`, `/services`, `/services/{slug}`, `/projects/{slug}`, `/about`, `/process`, `/privacy`, `/terms` și `/cookies`. Sufixele paginilor sunt identice între traduceri pentru a menține grupuri reciproce stabile.

Exemplu pentru proiectul AquaVerde în rusă:

```html
<html lang="ru">
<link rel="canonical" href="https://monodev.md/ru/projects/aquaverde">
<link rel="alternate" hreflang="ro-MD" href="https://monodev.md/ro/projects/aquaverde">
<link rel="alternate" hreflang="ru-MD" href="https://monodev.md/ru/projects/aquaverde">
<link rel="alternate" hreflang="en" href="https://monodev.md/en/projects/aquaverde">
<link rel="alternate" hreflang="x-default" href="https://monodev.md/en/projects/aquaverde">
```

Fiecare pagină publică are conținut inițial localizat, metadata în head și selector de limbă cu linkuri reale. Query-urile de filtrare și precompletare păstrează canonical către ruta curată; nu se introduc în sitemap. Schimbarea limbii browserului nu este folosită pentru redirect obligatoriu.

## Generarea build-ului

- `scripts/load-site-data.mjs` încarcă modulele TypeScript de date folosind compilatorul TypeScript deja instalat. Acest helper este exclusiv pentru tooling și nu intră în aplicația client.
- Prebuild generează o singură implementare statică pentru `public/robots.txt` și `public/sitemap.xml`; Vinext le copiază în `dist/client`. Pentru Vinext instalat, emisia convențiilor metadata dinamice nu este presupusă: versiunea curentă omite metadata routes dinamice în exportator.
- `scripts/netlify-seo.mjs` generează `public/_redirects` și `public/_headers` din aceleași date, plus inventarul real al directoarelor demo HTML.
- `scripts/audit-seo.mjs` citește efectiv `dist/client`, parsează HTML/XML cu DOMParser în Chromium fără executarea scripturilor paginilor, compară sitemap-ul cu rutele așteptate și verifică head, reciprocitate, JSON-LD, prețuri, imagini, linkuri și absența paginilor orfane.
- `npm run test:seo` adaugă verificarea priorității redirecturilor și a comportamentului pentru query-uri necunoscute. `npm run audit:seo` produce raportul static JSON. Un build reușit fără audit HTML nu este suficient.

## Controlul indexării și redirecturi

`/cabinet` are robots noindex/nofollow în HTML și header. Pentru fiecare director din `public/` care conține HTML demonstrativ se inventariază fișierele HTML și aliasurile lor fără extensie, inclusiv rădăcinile deservite de index.html. Numai aceste căi demo primesc `X-Robots-Tag: noindex, follow`; nu se folosește wildcard pe întregul director. Imaginile proiectelor și Open Graph, CSS și JavaScript rămân fără noindex inclusiv când provin din demo. Robots permite crawl-ul; noindex trebuie observat de crawler.

Payloadurile exportate `.txt` au reguli exacte inventariate din public, cu excepția fișierelor robots.txt. O regulă limitată la extensia `*.rsc` protejează payloadurile aplicației; manifestul tehnic `.vite/manifest.json` are propria regulă. Headerele noindex nu blochează fetch-ul acestor date și nu sunt extinse la imagini sau codul CSS/JS.

Proiectele ascunse sau indisponibile sunt excluse de `publicProjects`, deci lipsesc din rutele publice, sitemap și mapările directe ale vechilor query-uri. Dacă un produs devine indisponibil, decizia de a păstra o pagină utilă trebuie implementată explicit cu Offer corespunzător; nu se schimbă automat în conținut fictiv.

Regulile Netlify sunt generate cu prioritate: combinațiile exacte `lang+proiect`, `proiect`, `lang`; paginile contact/FAQ vechi; rădăcina către `/ro`; apoi HTTP și www către hostul canonic. Destinațiile permanente sunt absolute și elimină query-ul SEO recunoscut. Contactul păstrează `project` și `option` pentru precompletare. Un set de parametri suplimentari care nu corespunde regulilor exacte rămâne compatibil și canonicalizat; nu generăm mii de combinații pentru filtre sau valori necunoscute.

Nu există catch-all HTTP 200. Netlify folosește `404.html` pentru căi inexistente. `skip_processing = true` evită modificarea adreselor prin Pretty URLs; condițiile reale ale contului/CDN se verifică după un deploy autorizat. Headerele și redirecturile HTTP nu pot fi demonstrate doar din HTML local.

## Date structurate și limitări

Organization și WebSite identifică MONO/DEV; Service descrie serviciile; Product/Offer citește prețul EUR din catalog numai când `seoEnabled === true`; BreadcrumbList descrie ierarhia; FAQPage reflectă întrebările și răspunsurile disponibile în acordeoanele existente, cu HTML inițial complet. Nu sunt introduse ratinguri, review-uri sau LocalBusiness. JSON-LD se serializează sigur și este verificat prin parsare.

Oferta de proiect descrie produsul existent, nu o tranzacție finalizată sau un client real. Paginile de încredere folosesc date confirmate; completările comerciale și validarea juridică apar în [checklistul de lansare](../SEO_LAUNCH_CHECKLIST.md). Datele Core Web Vitals în producție și indexarea Google rămân verificări după publicare, fără promisiuni de poziționare.

## Validarea configurației Netlify

Fișierele finale au fost citite local cu pachetele oficiale `@netlify/headers-parser` 10.1.1 și `@netlify/redirect-parser` 16.1.1 pe Node 22.13.0: 11.273 reguli de header (11.268 din `_headers` și cinci reguli de cache din `netlify.toml`) și 1.314 redirecturi, fără erori. `_headers` are 882.964 octeți, iar `_redirects` 106.891. Raportul este în `reports/seo/netlify-parser-validation.json`; pachetele de verificare sunt izolate în directorul ignorat `outputs/netlify-header-check`, fără schimbarea dependențelor aplicației.

Parserul oficial acceptă ambele forme cu/fără slash final; regulile explicite pentru ambele forme sunt redundante, dar valide. Au fost verificate separat potrivirea noindex pe HTML/payloaduri și absența sa pe pagini canonice, robots, sitemap, imagini și JavaScript. Documentația oficială nu publică o limită numerică pentru numărul sau dimensiunea regulilor `_headers`; acceptarea parserului confirmă sintaxa locală, iar comportamentul CDN și procesarea tuturor regulilor rămân verificări la deploy. Surse: [headere Netlify](https://docs.netlify.com/manage/routing/headers/), [parserul oficial de headere](https://github.com/netlify/build/tree/main/packages/headers-parser), [parserul oficial de redirecturi](https://github.com/netlify/build/tree/main/packages/redirect-parser).

Corecția meniului mobil ArchiContract este aplicată prin normalizatorul exportului local și se păstrează la sincronizare. Bundle-ul `archicontract/_next/static/chunks/0t1mk9f5s0n14.js` păstrează însă numele anterior, care intră sub regula existentă de cache `immutable`. Un browser care a stocat deja vechiul răspuns poate continua să îl folosească până la expirare. Un header nou pe aceeași adresă nu actualizează retroactiv cache-ul browserului. Pentru actualizarea sigură a vizitatorilor existenți, sursa ArchiContract trebuie recompilată cu această corecție, astfel încât exportul să genereze un nume de bundle nou, apoi resincronizată. Nu a fost modificată sursa externă și nu au fost rescrise în masă referințele exportului. [Cache Netlify](https://docs.netlify.com/build/caching/caching-overview/).

## Imaginile cardurilor

Cele 45 de carduri care afișează artwork static au variante WebP locale la 480 și 800 px, cu calitate 86, fără mărirea surselor. Originalele demo și capturile paginilor de proiect rămân separate. Manifestul `app/lib/project-card-images.ts` furnizează pentru fiecare slug `fallback`, `srcSet`, `width` și `height` reale; fișierele generate sunt în `public/project-card-previews/` și sunt versionate.

Pentru regenerare după schimbarea imaginilor sursă, rulează `node scripts/generate-project-card-images.mjs`. Este o comandă de întreținere, separată de prebuild. Folosește biblioteca Sharp 0.34.5 deja instalată prin lanțul blocat în package-lock: `@cloudflare/vite-plugin` → `miniflare` → `sharp`; nu adaugă Python sau o dependență nouă build-ului. Scriptul verifică dimensiunile și păstrarea hash-ului SHA-256 al fiecărui original, apoi scrie `reports/seo/project-card-images.json`.

Cele 90 de variante generate reduc suma celor 45 de imagini de la 4.231.573 octeți la 1.915.624 pentru setul de 800 px sau 875.920 pentru setul de 480 px. Acestea sunt sume de fișiere, nu trafic măsurat: browserul alege varianta după dimensiunea afișată și densitatea ecranului. Primele opt carduri au fost comparate vizual la 390 px, păstrând compoziția și culorile; varianta de 480 px pierde puțin din detaliile fine. Dovezile sunt `reports/seo/project-card-visual-1.png` și `project-card-visual-2.png`.
