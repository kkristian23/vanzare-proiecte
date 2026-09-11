# Administrarea MONO/DEV

Panoul este la `/admin`, în română, și administrează exclusiv conținutul afișat de catalogul MONO/DEV pe `monodev.md`. Cele 63 de site-uri demonstrative exportate în `public/<slug>/` sunt aplicații independente și sunt în afara panoului: fișierele, textele, imaginile, prețurile și datele lor interne nu sunt citite sau modificate de admin. Panoul folosește Firebase Authentication (email/parolă), Cloud Firestore și Firebase Storage. Nu există înregistrare publică. Sesiunea persistă în browser; autentificarea simplă nu acordă acces la administrare.

## Configurare pentru producție

1. Creează sau selectează proiectul Firebase destinat **monodev.md** și înregistrează o aplicație Web. Activează Authentication → Email/Password, Cloud Firestore în modul Native (baza `(default)`) și Storage. În funcție de configurația proiectului, activarea Storage poate solicita facturare. Folosește resursele proiectului principal, nu configurațiile din aplicațiile demonstrative din `public/`.
2. Adaugă `monodev.md` și domeniile de previzualizare folosite în Authentication → Settings → Authorized domains.
3. Completează variabilele `VITE_FIREBASE_*` din [.env.example](../.env.example), într-un `.env.local` pentru dezvoltare și în variabilele de build Netlify pentru producție. Configurația Web este publică. **Nu pune chei private, conturi de serviciu sau parole în variabile `VITE_*`, `NEXT_PUBLIC_*`, în `app/` ori în `public/`.** `VITE_FIREBASE_EMULATORS` trebuie să fie `false` în producție.
4. Publică regulile înainte de utilizarea panoului:

   ```sh
   npx firebase login
   npx firebase deploy --project PROJECT_ID --only firestore:rules,storage
   ```

   La prima publicare a regulilor Storage care citesc Firestore, Firebase poate cere activarea permisiunii interservicii. Acceptă configurarea pentru proiectul selectat. Regulile din acest repository sunt dedicate CMS-ului MONO/DEV; dacă proiectul Firebase deservește deja alte aplicații, integrează aceste căi în regulile lor existente înainte de publicare, păstrând protecțiile celorlalte colecții și directoare.
5. Rulează `npm ci`, `npm run typecheck`, `npm run build` și publică `dist/client` conform `netlify.toml`. Schimbarea variabilelor Web necesită un build nou. Exportul conține `admin.html`; Netlify îl servește direct la `/admin` și la reîncărcare, fără rewrite global de tip SPA. `_headers` generat include `X-Robots-Tag: noindex, nofollow` pentru `/admin`, aliasurile sale și `/admin/*`. Ruta are și metadata `noindex` și nu intră în sitemap.

## Primul administrator

1. Creează contul în consola Firebase → Authentication → Users → Add user, cu email și parolă. Parola se stabilește în consola Firebase și nu se adaugă în repository.
2. În Firestore, creează manual documentul **`cmsAdmins/UID`**, unde `UID` este identificatorul acelui utilizator din Authentication, cu câmpul boolean **`active: true`**. Acest document nu trebuie să conțină emailul sau parola. Nimeni nu poate modifica lista de administratori prin SDK-ul client.
3. Autentifică-te la `https://monodev.md/admin`. Alternativ, autorizarea poate fi făcută de pe o mașină de încredere, cu Application Default Credentials și drepturile necesare în proiect:

   ```sh
   npm run admin:authorize -- PROJECT_ID administrator@example.com grant
   npm run admin:authorize -- PROJECT_ID administrator@example.com revoke
   ```

   Scriptul folosește Firebase Admin numai în Node. Nu publică credențiale în client. Poți retrage accesul și setând `active: false` în consola Firestore. Regulile verifică documentul la fiecare scriere, iar panoul urmărește modificarea dreptului în timp real.

## Conținut, imagini și prețuri

- Secțiunea **Textele catalogului** oferă conținutul paginii principale MONO/DEV, catalogului, fișelor de prezentare din catalog, serviciilor, întrebărilor, contactului, paginilor informative, footerului și interfețelor auxiliare de pe `monodev.md`. Textele românești, rusești și englezești existente sunt precompletate. Alege pagina/secțiunea, apoi folosește căutarea și filtrul de limbă. Câmpurile comune mai multor limbi apar la „Toate limbile”. Textele sunt randate de React ca text simplu; HTML introdus nu se execută.
- **Importă conținutul catalogului** adaugă numai documentele/câmpurile MONO/DEV care lipsesc. Registrul refuză surse din afara `app/`, inclusiv orice fișier din `public/`. Importurile repetate păstrează valorile existente, inclusiv șirurile goale. Dacă importul este întrerupt, poate fi reluat. Imaginile originale și ilustrațiile din cod rămân neschimbate până la prima editare explicită a slotului respectiv; nu sunt copiate inutil în Storage.
- **Coperțile din catalog** are sloturi distincte pentru card și fișa de prezentare de pe `monodev.md`. Cardul acceptă o imagine; fișa acceptă până la 12, cu ordonare. Imaginile site-ului demonstrativ accesat prin „Demo” nu sunt expuse aici. Sunt acceptate JPEG, PNG, WebP și AVIF, maximum 5 MB și 16.000 px pe latură, cu previzualizare și text alternativ. Uploadul și salvarea referinței se fac înainte de retragerea imaginii vechi.
- Fișierele din `cms-images/monodev-catalog/` sunt imuabile și au nume UUID. Eliminarea unei imagini retrage referința din secțiunea aleasă; nu distruge fișiere care pot fi folosite în altă parte. Fișierele orfane rezultate din înlocuiri sau salvări întrerupte sunt păstrate intenționat. O eventuală curățare se face separat de un operator, după verificarea tuturor referințelor. Publicul poate citi numai colecția CMS publicată și directorul de imagini al catalogului; celelalte căi nu sunt deschise de aceste reguli.
- **Prețurile din catalog** păstrează moneda actuală, **EUR (€)**. Prețul redus trebuie să fie pozitiv și strict mai mic decât cel standard. Reducerea activă afișează prețul standard tăiat și prețul redus în catalog, modal, fișa de prezentare și proiectele similare de pe `monodev.md`. Prețurile din site-urile demonstrative nu sunt modificate. Sortarea, ratele și chiria catalogului folosesc prețul efectiv. Dezactivarea reducerii păstrează prețul standard.
- Salvarea folosește tranzacții și revizii. Dacă alt administrator a salvat între timp, panoul refuză suprascrierea și păstrează formularul pentru recuperarea modificărilor. Înaintea eliminării și abandonării unui formular apar confirmări.
- Vizitatorii primesc modificările prin listener Firestore, inclusiv în file deja deschise. Nu există un cache local de conținut administrat care să trebuiască golit. Dacă Firebase nu este configurat sau nu poate fi citit, paginile publice păstrează conținutul inițial; panoul raportează eroarea și nu simulează salvarea.

## Structură și întreținere

- `app/lib/cms-store.ts`: citirea reactivă a textelor și prețurilor, fără modificarea obiectelor sursă.
- `app/admin/content-registry.json`: registrul generat al textelor; `npm run cms:registry` îl actualizează din declarațiile `cmsContent` / `cmsText` și din modulele de date. Rulează automat înainte de build. Pentru texte noi, folosește aceste funcții și un identificator stabil, apoi regenerează registrul.
- `cms/text-*`: valori de text grupate pe pagini/secțiuni; `cms/price-ID`: prețuri; `cms/media-SLOT`: referințe ordonate la imagini. Fiecare document are obligatoriu `site: "monodev-catalog"`; regulile resping alte scopuri, iar citirea live și snapshotul de build le ignoră. Documentele conțin revizia și autorul ultimei salvări. Nu se stochează date de autentificare aici.
- Fișierele independente din `public/<proiect>/` sunt demonstrații ale produselor din catalog. Panoul administrează doar cardul și fișa de prezentare a produsului pe `monodev.md`; nu citește și nu modifică site-ul demonstrativ, fișierele lui sau datele lui interne.
- La fiecare build, `scripts/cms-snapshot.mjs` citește colecția publică Firestore și generează `app/lib/cms-published.json`, fără credențiale Admin. HTML-ul static, metadatele și datele structurate pornesc de la acest conținut. Vizitatorii primesc schimbările ulterioare imediat prin listener; și titlurile/metadatele din browser se actualizează. Pentru actualizarea fișierelor HTML inițiale servite crawlerelor fără JavaScript, rulează un build/deploy nou pe Netlify. Dacă citirea Firebase eșuează într-un build configurat, build-ul este oprit, evitând publicarea accidentală a valorilor inițiale. Fără configurație Firebase, build-ul folosește conținutul sursă.

## Verificare

```sh
npm run typecheck
npm run test:admin
npm run test:admin:rules
npm test
npm run test:admin:export
```

Testele de reguli folosesc proiectul fictiv `demo-monodev` și emulatoare reale pentru Auth, Firestore și Storage, cu Java 21+. Nu accesează date de producție. Pentru testele în browser, pornește emulatoarele și serverul local cu variabilele de mai jos, apoi rulează `node --test tests/admin-browser.test.mjs`:

```dotenv
VITE_FIREBASE_API_KEY=emulator-key
VITE_FIREBASE_AUTH_DOMAIN=demo-monodev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-monodev
VITE_FIREBASE_STORAGE_BUCKET=demo-monodev.appspot.com
VITE_FIREBASE_APP_ID=1:123:web:emulator
VITE_FIREBASE_MESSAGING_SENDER_ID=123
VITE_FIREBASE_EMULATORS=true
```

```sh
npx firebase emulators:start --project demo-monodev --only auth,firestore,storage
npx vinext dev --port 4020
node --test tests/admin-browser.test.mjs
```

URL-ul local poate fi schimbat prin `ADMIN_TEST_BASE`. Testele în browser creează conturi exclusiv în emulator și verifică accesul neautorizat, parola greșită, sesiunea persistentă, salvarea/publicarea textelor, reducerile, încărcarea/eliminarea imaginilor, conflictele dintre sesiuni, deconectarea și dimensiunile desktop/mobil. Capturile sunt salvate în `reports/admin/`.

Documentație Firebase: [controlul accesului cu Authentication și Security Rules](https://firebase.google.com/docs/rules/rules-and-auth), [persistența autentificării](https://firebase.google.com/docs/auth/web/auth-state-persistence), [reguli Storage și accesul la Firestore](https://firebase.google.com/docs/storage/security/rules-conditions#enhance_with_firestore), [instalarea emulatoarelor](https://firebase.google.com/docs/emulator-suite/install_and_configure).
