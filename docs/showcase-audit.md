# Verificarea catalogului

Pentru loturi paralele cu reluare, rulează `npm run audit:batches -- --workers=2 --resume`. Selectează proiectele cu `--only=slug1,slug2`. Fiecare proiect are un singur proces în acest lot; evită un al doilea audit simultan pentru aceleași proiecte. `final/batch-run.json` înregistrează procesele, iar rapoartele proiectelor conțin rezultatele și acoperirea reală.

Din `D:\vanzare proiecte`:

```powershell
npm install
npm test
npm run audit:serve
```

În alt terminal:

```powershell
npm run audit:http
npm run audit:browser
npm run audit:report
npm run audit:regression
npm run audit:catalog
npm run audit:interactions:recheck
node scripts/audit-findings-recheck.mjs --only=pophaus,nord-and-oak
```

Raportul interactiv: `reports/showcase-audit/index.html`. Fiecare proiect are JSON cu URL-uri, controale, rezultat observat, erori și capturi desktop/mobil. Browserul este Chrome instalat local, pornit headless de Playwright, în contexte separate de sesiunea personală.

Cu serverul pornit, raportul este disponibil și la `http://127.0.0.1:4010/__audit/`. Fiecare proiect are o ancoră proprie, de exemplu `http://127.0.0.1:4010/__audit/#pophaus`.

Pentru un lot sau o reverificare:

```powershell
npm run audit:browser -- --only=pophaus,forma-living
npm run audit:browser -- --resume
npm run audit:browser -- --only=pophaus --strict-clicks
```

Implicit sunt parcurse toate fișierele HTML exportate și linkurile interne descoperite, pe desktop 1440×900 și mobil 390×844. `--entry-only` verifică interacțiuni numai de la intrare; `--load-only` verifică încărcarea tuturor paginilor fără clickuri. Aceste opțiuni au acoperire mai mică și sunt marcate explicit în JSON. `--output=...` separă loturile de rapoartele finale.

Linkurile identice din header/footer reutilizează un click deja verificat în același proiect și la aceeași dimensiune de ecran. Structura HTML și destinația trebuie să coincidă; JSON indică `shared-navigation-verified` și `verifiedBy`. Controalele specifice paginii sunt testate separat. `--strict-clicks` dezactivează reutilizarea și repetă fiecare click comun pe fiecare pagină. Interacțiunile folosesc preferința de mișcare redusă. Resursele compilate cu nume unice pot fi păstrate în cache; documentele și raportul rămân fără cache.

Limite: maximum 600 (configurabil prin --max-controls=NUMAR) de controale inventariate per pagină; atingerile limitei sunt raportate. Sunt testate stările descoperite, nu toate combinațiile posibile ale filtrelor sau toate valorile formularelor. Un control nou apărut poate depinde de date, autentificare sau ordine. `clicked-review-outcome` nu înseamnă test funcțional trecut. `interaction-error` trebuie analizat cu mesajul aferent. Linkurile externe, încărcările de fișiere, controalele dezactivate și acțiunile distructive/plățile sunt marcate pentru verificare manuală. Cererile de scriere sunt blocate pentru a nu trimite rezervări, mesaje sau modificări reale.

WebSocket-urile și service worker-ele sunt blocate în testele automate; funcțiile realtime, notificările și modul offline necesită un mediu separat de test. `--resume` reia paginile salvate ale unui lot întrerupt. După modificarea exportului, rulează proiectul fără `--resume` pentru o reverificare completă. `npm run audit:recheck` reîncarcă punctual paginile cu probleme din loturile `pages/`; raportul păstrează rezultatele anterioare și reverificările.

Pentru a sincroniza și reconstrui un proiect reparat în directorul său sursă:

```powershell
npm run showcase:sync -- pophaus --build --strict
npm test
npm run audit:http -- --only=pophaus
npm run audit:browser -- --only=pophaus
npm run audit:report
graphify update .
```

Sursele proiectelor sunt în directoarele specificate de `showcase-projects/registry.json`, unele în afara acestui repository. Păstrează și modificările din aceste directoare. Auditul include 63 de proiecte, cu AquaVerde, TerraForma, GazonPro, EcoHabitat și YardCraft. Forge este ascuns și exclus. Neo Booking permite programări simulate și configurare în browser; importul automat al unei teme necesită serviciul de scanare.

`audit:regression` include și fluxuri complete pentru Audio Rental (pagini informative, categorii, căutare, detalii, perioadă), PopHaus (butonul principal) și Neo Booking (programare, înapoi, reluare și configurare locală). `audit:interactions:recheck -- --only=noma,drivolt` reia erorile de click dintr-o stare curată și salvează rezultate separate în `interaction-rechecks/`; un click reprodus cu succes nu înlocuiește un test de rezultat funcțional.

Scenariile suplimentare verifică Drivolt (căutare, coș, cerere de ofertă), Flow CRM (înregistrări, filtre, selecție, CSV, setări), Forma Living (configurație partajată și cerere), Academia (lecții, notițe persistente și ferestre), Tableo (livrare/ridicare și rezervare demonstrativă), PopHaus (previzualizarea culorii) și calculatorul Studio Velora pe mobil. Testul de partajare Forma Living capturează textul pregătit pentru clipboard și verifică deschiderea sa; nu certifică permisiunile clipboard ale fiecărui sistem de operare.

Inventarierea interacțiunilor versiunea 2 prioritizează controalele introduse de un tab/ecran înainte de navigarea către alt ecran și închide din nou ferestrele redeschise. Versiunea este înregistrată per pagină în `interactionInventoryVersion`. `npm run audit:source` găsește în surse butoane care merită revizuite; delegarea evenimentelor și fișierele care nu fac parte din export pot produce rezultate care nu sunt defecte.

În Academia, înregistrarea video a cursului nu este inclusă în proiect; butonul deschide rezumatul demonstrativ și explică această limită. E-mailurile, serviciile de rezervări externe, administrarea conturilor și integrările care necesită server sunt distincte de operațiile locale verificate. Diagnosticul opțional `--debug-hydration` capturează contextul erorilor React de hidratare în JSON.

Scenariile de navigare includ toate cele 5 proiecte noi, revenirea repetată între limbile Nord & Oak și 60 de încărcări proaspete ale produselor, fiecare link de detalii Audio Rental și toate favoritele/rezervările/accesul la administrare RentTech. PopHaus verifică și reordonarea persistentă a moodboardului. Sincronizarea refuză un export Next compilat cu alt basePath și păstrează copia publică existentă.

`audit-findings-recheck.mjs` reîncarcă paginile din constatările auditului final și păstrează în selecție paginile reverificate anterior. Include parametrii URL, astfel încât filtrele precum `?category=rugs` să fie testate în aceeași stare. Pentru efectele butoanelor se folosesc în continuare regresiile și `audit:interactions:recheck`.

Raportul separă avertismentele de performanță/depreciere de defectele locale și de integrările externe neverificate. Erorile Firebase Google și validarea rezervărilor Alteg rămân în detaliile integrărilor, cu verificare manuală necesară. Nu sunt declarate remediate prin simpla lor reclasificare.

Regresiile pentru EcoHabitat verifică scorul ecologic, validarea calculatorului și deschiderea celor trei fișe A4 în file separate. Pentru YardCraft sunt parcurși cei 14 pași ai configuratorului, salvarea, reluarea și ștergerea unei configurații locale. Auditul înregistrează destinația și conținutul filelor noi, apoi le închide. Un test separat confirmă că `--resume` reîncearcă paginile întrerupte chiar dacă raportul anterior conține un moment de finalizare.
Acțiunile ArchiContract sunt verificate separat pentru toate cele 30 de produse, în română, rusă și engleză, pe desktop și mobil (180 de vizite). Testele confirmă produsul și cantitatea din lista salvată, păstrarea produselor la adăugarea din catalog, eliminarea și golirea listei. Pe mobil, verifică și închiderea meniului prin Escape, ofertă și siglă, în toate cele trei limbi. Apelul funcției de tipărire este observat în browser, fără imprimare fizică. Rezultatele individuale sunt în `reports/showcase-audit/archi-product-actions.json`; reluare: `node --test tests/showcase-archi-actions.test.mjs`.
