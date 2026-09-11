# Verificarea administrării — 11 septembrie 2026

Implementarea este în proiectul local. Proiectul Firebase de producție nu a fost indicat și nu există configurație Web Firebase locală, deci nu s-au creat conturi, modificat reguli ori publicat date în producție. Pașii de conectare și de autorizare sunt în [admin-firebase.md](admin-firebase.md).

## Rezultate

| Verificare | Rezultat |
| --- | --- |
| TypeScript (`npm run typecheck`) | Trecut |
| ESLint pentru `app/` și scripturile/testele CMS | 0 erori; 5 avertismente privind imaginile HTML |
| Build de producție | Trecut; 252 rute exportate, inclusiv `admin.html` |
| Testele existente de export și SEO (`npm test`) | 18/18 trecute |
| Modelul de conținut și prețuri (`npm run test:admin`) | 6/6 trecute |
| Reguli Firestore și Storage, cu emulatoare Firebase reale | 5/5 trecute |
| Fluxul complet în Chromium, cu Auth/Firestore/Storage reale în emulator | Trecut |
| Export static: acces direct `/admin`, reload, mobil, noindex și sitemap | Trecut |

Fluxul în browser verifică parola greșită, contul autentificat neautorizat, sesiunea păstrată la reîncărcare, editarea textelor, publicarea într-un browser separat, importul inițial repetat fără pierderea editărilor, validarea reducerilor, prețul tăiat în catalog și detalii, încărcarea unei imagini reale, tipurile respinse, textul alternativ, conflictul dintre două salvări, eliminarea imaginilor, ordinea galeriei, dezactivarea reducerii și deconectarea.

Dimensiunile verificate sunt 1440×1000 și 390×844. Capturile au fost inspectate vizual: [desktop](../reports/admin/desktop.png), [mobil](../reports/admin/mobile.png), [imagini](../reports/admin/images.png). Capturile folosesc date de test exclusiv locale.

Regulile resping scrierile anonime și ale utilizatorilor fără rol, autoatribuirea rolului, prețurile invalide, fișierele prea mari, MIME neacceptat, suprascrierea și ștergerea fișierelor existente. O galerie validă de 12 imagini este acceptată. Retragerea documentului de autorizare blochează următoarea scriere.

## Limite și operațiuni rămase

- Conectarea Firebase, publicarea regulilor și deploy-ul Netlify nu au fost executate pentru producție. Sunt necesare configurația Web și accesul proprietarului proiectului Firebase.
- Citirea snapshot-ului la build este implementată prin API-ul public Firestore. Build-ul a fost verificat fără configurație de producție, cu fallback la conținutul sursă. Ramura de citire a serviciului Firebase real necesită proiectul configurat.
- Eliminarea imaginilor retrage referințele. Fișierele sunt păstrate pentru a proteja utilizările comune; curățarea obiectelor orfane nu este automată.
- Listenerul actualizează vizitatorii imediat. HTML-ul inițial și metadatele pentru crawlere fără JavaScript se actualizează la următorul build/deploy, folosind snapshot-ul Firestore.
- `graphify update .` a actualizat graful codului. Unele fișiere de date/rapoarte JSON nu produc noduri AST; acesta este un avertisment al indexării, nu o eroare de build sau de funcționare a CMS-ului.
