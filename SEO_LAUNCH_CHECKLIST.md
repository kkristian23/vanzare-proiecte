# MONO/DEV — checklist de lansare SEO

Domeniu canonic: **https://monodev.md**. Implementarea este pregătită local; acest document nu atestă un deploy, o modificare DNS, indexarea în Google sau rezultate Core Web Vitals în producție.

Politica actuală: 57 URL-uri generale în sitemap; toate cele 189 pagini de proiect sunt `noindex, follow`. Nu solicita indexarea proiectelor și nu activa `seoEnabled` fără o cerință separată. Auditul public din 10 septembrie a găsit HTTP 404 la `/ro`, `/ru`, `/en`, `robots.txt` și `sitemap.xml`; verificarea publicării este prioritară. [Raportul actual](reports/seo/focus-2026-09-10/REPORT.md).

## Înainte de publicare

- [ ] Proprietarul confirmă denumirea juridică, forma de organizare și persoana responsabilă de contracte/date personale. Nu sunt publicate identități sau identificatori fiscali inventați.
- [ ] Confirmă emailul existent `monodev@gmail.com` și telefonul existent `+37378868996`; testează primirea solicitărilor.
- [ ] Furnizează, dacă pot fi publicate: fondatorul/autorii reali, experiența verificabilă, fotografii proprii, profiluri profesionale reale și eventuale studii de caz cu permisiunea clientului.
- [ ] Confirmă descrierea livrabilelor, licențierea codului și imaginilor, disponibilitatea proiectelor, prețurile EUR, taxele aplicabile, condițiile de rate/chirie, suportul și politica de anulare. Datele existente sunt sursa catalogului; nu sunt o promisiune de disponibilitate perpetuă.
- [ ] Revizuiește paginile de confidențialitate, termeni și cookies cu persoana care răspunde de obligațiile comerciale și de prelucrarea datelor. Completează operatorul real, temeiurile, perioadele de păstrare, destinatarii și procedurile efectiv folosite.
- [ ] Verifică funcționarea formularului: deschide un mesaj în clientul de email. Deschiderea clientului nu confirmă transmiterea sau primirea emailului.
- [ ] Confirmă că toate demonstrațiile reprezintă produse demonstrative. Numele, persoanele, cifrele sau recenziile din demo nu devin clienți ori dovezi comerciale MONO/DEV.
- [ ] Rulează `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:seo` și testele de regresie. Păstrează raportul `reports/seo/static-audit.json` generat de `npm run audit:seo`.
- [ ] Revizuiește vizual `/ro`, `/ru`, `/en`, trei proiecte, trei servicii, contact, FAQ și navigarea pe mobil, inclusiv zoom și preferința pentru animații reduse.

## Netlify și verificări după un deploy autorizat

- [ ] Confirmă că domeniile `monodev.md` și `www.monodev.md` sunt atribuite site-ului Netlify și certificatul HTTPS este valid. Configurația locală nu atribuie domenii și nu modifică DNS.
- [ ] Verifică publicarea directorului `dist/client`, cu `_redirects`, `_headers`, `404.html`, `robots.txt` și `sitemap.xml`. Regulile SEO sunt generate de `scripts/netlify-seo.mjs`; nu le duplica în dashboard sau `netlify.toml`.
- [ ] Confirmă în sumarul deploy-ului procesarea fără erori a tuturor regulilor: raportul local `reports/seo/netlify-parser-validation.json` atestă numai parsarea oficială locală, nu acceptarea sau comportamentul CDN.
- [ ] Pentru vizitatorii ArchiContract care au deja vechiul bundle în cache `immutable`, recompilă sursa cu corecția de închidere a meniului la navigare și resincronizează exportul cu un hash nou. Corecția normalizată local funcționează la încărcare nouă; schimbarea headerului aceleiași adrese nu poate actualiza un răspuns deja stocat în browser.
- [ ] Verifică o singură redirecționare 301 pentru `/` → `/ro`, `/?lang=ru` → `/ru`, `/?proiect=aquaverde&lang=en` → `/en/projects/aquaverde`, `/contact?lang=ru` → `/ru/contact`, HTTP/www → destinația HTTPS fără www. Testează ambele ordini ale parametrilor.
- [ ] Verifică și query-uri suplimentare: `lang`, `proiect`, `categorie`, `platforma`, `os`, `project`, `option`. Combinațiile necunoscute sunt păstrate pentru compatibilitate, cu canonical curat; nu se fabrică rute din valori arbitrare.
- [ ] Verifică răspunsul **HTTP 404** pentru o adresă inexistentă. Existența `404.html` și testarea serverului local nu demonstrează statusul CDN.
- [ ] Rulează explicit `node scripts/audit-seo.mjs --production` după publicare; păstrează `reports/seo/production-audit.json`. Este un audit HTTP read-only, separat de auditul static.
- [ ] Verifică `X-Robots-Tag: noindex, nofollow` la `/cabinet` și `noindex, follow` la o pagină de proiect, un demo și un preview. Confirmă că demo-urile și resursele lor CSS/JS continuă să se deschidă. Robots permite crawl-ul pentru ca motorul să citească noindex.
- [ ] Verifică și un alias fără extensie al demo-ului. Regulile noindex inventariază numai HTML și aliasurile lui; imaginile proiectelor, inclusiv OG, CSS și JavaScript nu primesc noindex.
- Inventarul curent protejează 4.778 de căi HTML/aliasuri din 64 de directoare demo, inclusiv variantele cu slash final, plus cabinet și 404; numărul este recalculat automat la fiecare prebuild.
- Payloadurile tehnice au reguli separate: 6.479 de fișiere `.txt` existente, excluzând `robots.txt`, fișierele `*.rsc` și manifestul intern `.vite/manifest.json`. Aceste headere împiedică indexarea, fără a împiedica descărcarea necesară navigării. `site.webmanifest`, imaginile și resursele CSS/JS rămân accesibile fără această regulă.
- [ ] Verifică servirea fără redirect suplimentar a adreselor canonice fără slash final. Postprocesarea Netlify este dezactivată în configurația versionată; un override din dashboard trebuie verificat.
- [ ] Inspectează HTML-ul inițial cu View Source: title/description unice, un H1, `lang`, canonical propriu; patru hreflang pentru paginile indexabile, zero pentru proiectele noindex. Product/Offer lipsește de pe proiectele dezactivate. Nu te baza numai pe inspectorul DOM după hidratare.

Netlify aplică prima regulă potrivită, iar regulile query declarate cer seturi exacte de parametri. Domeniile trebuie atribuite site-ului pentru redirecționare; `404.html` este folosit automat pentru resurse inexistente. Vezi [opțiunile oficiale de redirect](https://docs.netlify.com/manage/routing/redirects/redirect-options/) și [headerele personalizate](https://docs.netlify.com/manage/routing/headers/).

## Google Search Console și alte instrumente

- [ ] Proprietarul verifică proprietatea de tip Domain pentru `monodev.md` în [Search Console](https://search.google.com/search-console) prin înregistrarea DNS cerută de Google. Tokenul se obține din contul proprietarului; nu există unul inventat în proiect.
- [ ] Trimite `https://monodev.md/sitemap.xml` și verifică procesarea fără erori.
- [ ] Rulează URL Inspection, inclusiv test live, pentru homepage-uri și servicii; confirmă canonical declarat și ales de Google. Separat, inspectează proiecte din RO/RU/EN și verifică excluderea prin noindex, fără solicitare de indexare. Verifică eliminarea lor treptată din index după recrawl.
- [ ] Urmărește Page Indexing: pagini excluse intenționat, duplicate, soft 404 și pagini descoperite/neindexate. Nu solicita indexarea cabinetului sau a demo-urilor.
- [ ] Verifică [Rich Results Test](https://search.google.com/test/rich-results) și [Schema Markup Validator](https://validator.schema.org/). Prezența unei scheme valide nu garantează un rezultat îmbogățit, iar FAQ nu garantează afișarea unui rezultat special.
- [ ] Verifică [PageSpeed Insights](https://pagespeed.web.dev/) pe mobil și desktop. Folosește raportul Core Web Vitals din Search Console după acumularea datelor reale.
- [ ] Ținte mobile: LCP ≤ 2,5 s; CLS ≤ 0,1; INP ≤ 200 ms. Datele de laborator sunt diagnostic, nu dovada atingerii țintelor pentru utilizatorii reali. Nu elimina animațiile fără o măsurătoare care le arată impactul.
- [ ] Deschide `https://monodev.md/og.png` și OG-ul a trei proiecte; verifică preview-uri sociale, crop, text și lipsa 404. OG implicit păstrează imaginea existentă 1731×909.
- [ ] Verifică [Bing Webmaster Tools](https://www.bing.com/webmasters/about), adaugă proprietatea și sitemap-ul din contul proprietarului.
- [ ] Monitorizează lunar interogări, impresii, clickuri, CTR și pagini de intrare separat pentru RO/RU/EN. Compară aceleași perioade și explică sezonalitatea.
- [ ] Revizuiește săptămânal 404 și redirecturi, apoi actualizează linkurile interne la destinația finală.

Fiecare limbă are URL propriu și alternate reciproce; Google recomandă URL-uri distincte și evitarea redirecționării obligatorii pe baza limbii browserului. [Documentația Google pentru site-uri multilingve](https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites).

## Analytics: configurare explicită și consimțământ

- Variabila de build: **`NEXT_PUBLIC_GA_MEASUREMENT_ID`**; valoarea reală are forma `G-…` și este furnizată de proprietar. Fără valoare validă, integrarea nu este activată. Nu pune chei private în variabile `NEXT_PUBLIC_*`.
- Adaugă valoarea în mediul Netlify numai după configurarea proprietății GA4 și verificarea politicilor. Este necesar un nou build static pentru a schimba valoarea publică.
- Scriptul Google Analytics este încărcat asincron numai după acceptarea opțională. Alegerea este salvată în `localStorage` prin `mono-analytics-consent`; refuzul și retragerea trebuie testate. Nu există tracking neesențial implicit.
- Evenimente pregătite: `email_click`, `phone_click`, `form_start`, `form_submit`, `project_open`, `demo_open`, `project_request`, `payment_option`, `language_change`. Păstrează numai identificatori publici de proiect, opțiune și limbă; nu transmite nume, emailuri, texte din formular, URL-uri cu query sau alte date personale.
- `form_submit` măsoară pregătirea mesajului în interfață. Nu îl numi tranzacție finalizată și nu îl folosi ca dovadă de email primit. `project_request` reprezintă intenția de solicitare, nu cumpărarea încasată.
- [ ] Cu consent neacordat/refuzat, verifică în Network că nu există request GA. După acceptare, verifică evenimente în DebugView și Realtime; după retragere, repetă controlul requesturilor și cookies.
- [ ] În fluxul web GA4, oprește Enhanced measurement pentru **Form interactions** și pentru **Page changes based on browser history events**. Păstrează oprite Site search, Outbound clicks și File downloads până când verifici datele efectiv colectate. Formularul și paginile au evenimente controlate în aplicație; colectarea automată poate dubla evenimentele sau adăuga URL-uri cu parametri. Revizuiește și celelalte evenimente automate înainte de activare.
- Configurația trimite explicit `send_page_view: false`, `page_location` format numai din originea canonică și pathname și `page_referrer: ""`; fiecare page_view controlat refolosește adresa curată. Verifică efectiv în Network/DebugView că `lang`, `proiect`, filtrele și datele precompletate nu ajung în evenimentele GA. Setările contului și alte taguri pot schimba rezultatul, deci testul trebuie repetat după configurarea proprietății.
- [ ] Marchează ca evenimente cheie numai acțiunile relevante pentru afacere; deduplică și documentează semnificația lor. Confirmările reale de contract/plată se vor măsura doar când există un sistem care le poate dovedi.

Vezi [evenimente GA4](https://developers.google.com/analytics/devguides/collection/ga4/events), [setările Enhanced measurement](https://support.google.com/analytics/answer/9216061?hl=en) și [verificarea implementării](https://developers.google.com/analytics/devguides/collection/ga4/troubleshoot).

## Google Business Profile

Nu se creează automat un profil. Proprietarul trebuie să confirme că afacerea îndeplinește criteriile Google, inclusiv contactul real în persoană cu clienții; afacerile exclusiv online nu sunt eligibile. Nu folosi adresă virtuală, sediu inventat sau zone fictive. Un service-area business declară numai zonele în care livrează efectiv servicii directe. [Criteriile oficiale de eligibilitate](https://support.google.com/business/answer/13763036?hl=en).

## Priorități 30 / 60 / 90 de zile

| Perioadă | Acțiuni și dovezi de rezultat |
| --- | --- |
| Zilele 1–30 | Confirmă datele comerciale și conținutul juridic; publică numai după verificări; validează redirecturile, noindex și 404 în CDN; trimite sitemap-ul; stabilește baza de măsurare pe limbi și pagini. Publică primele articole verificate din planul editorial. |
| Zilele 31–60 | Analizează Page Indexing și interogările reale; îmbunătățește serviciile/proiectele care răspund cererii; măsoară LCP/CLS/INP pe paginile de intrare; corectează cauzele observate; publică explicații tehnice și primul studiu de caz verificabil, dacă există. |
| Zilele 61–90 | Compară cereri reale și CTR cu baza inițială; rafinează titlurile fără promisiuni; actualizează conținutul pe baza întrebărilor clienților; dezvoltă parteneriate și mențiuni relevante; păstrează auditul SEO în fluxul de build. |

Planul editorial și regulile pentru mențiuni sunt în [docs/seo-editorial-plan.md](docs/seo-editorial-plan.md). Nicio acțiune nu garantează o poziție sau un termen de indexare.
