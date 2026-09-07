# Refacerea celor 32 de proiecte

Fiecare proiect are o compoziție de pagină, un model de date și un flux principal propriu. Controalele comune nu decid structura paginilor.

| Proiect | Design și structură | Fluxuri | Referință |
|---|---|---|---|
| Eventora | Afișe de concerte și catalog de bilete | Filtrare evenimente; categorii de bilete și cantități; comenzi persistente și confirmări descărcabile | [iTicket](https://iticket.md/) |
| Scena City | Ghid cultural editorial cu agendă cronologică | Filtre după zi și interes; agendă personală; exportul programului de weekend | [Fest.md](https://www.fest.md/) |
| Pulse Tickets | Consolă pentru organizatori și registru de participanți | Emitere bilete demo; check-in și anulare; export CSV și capacitate de eveniment | [Eventbrite](https://www.eventbrite.com/) |
| Clinica Nova | Prezentare de clinică, specialități și echipă | Selecție specialist; programări cu verificarea intervalului; istoric și anulare | [Medpark](https://medpark.md/) |
| Laboris | Catalog de analize cu listă de recoltare | Căutare după analiză sau cod; coș de investigații; alegerea centrului și istoricul cererilor | [Clinica Sante](https://www.sante.md/) |
| Doctor Aproape | Director de medici cu disponibilitate pe zile | Filtre specialitate/cartier; rezervarea unui interval; eliberarea intervalului prin anulare | [Doctolib](https://www.doctolib.fr/) |
| MedSlot | Selecție ghidată de consultații în trei pași | Potrivire după specialitate, limbă și tip de consultație; rezervare; agendă de vizite | [Zocdoc](https://www.zocdoc.com/) |
| LeadPilot | Panou de oportunități pe etape comerciale | Creare și editare oportunități; mutare între etape prin tragere sau selector; activități și totaluri | [Pipedrive](https://www.pipedrive.com/) |
| GrowthDesk | Bază de contacte și segmentare pentru marketing | Contacte editabile; gestionarea abonării; campanii locale pentru destinatarii eligibili | [HubSpot](https://www.hubspot.com/) |
| CloseFlow | Inbox comercial cu conversații și fișe de contact | Răspunsuri demo și note interne; schițe separate pe conversație; follow-up și rezolvare | [Close](https://www.close.com/) |
| PartMatch | Magazin de piese cu selecție dependentă de vehicul | Marcă/model/motor; filtrare compatibilitate demonstrativă; coș, cantități și istoric de comenzi | [AutoDoc.md](https://autodoc.md/) |
| GarageBox | Banc de lucru pentru atelier și inventar OEM | Căutare OEM; kit de revizie; alocare de stoc în fișe de lucru și export | [FixBox.md](https://fixbox.md/) |
| MotorSupply | Aprovizionare angro prin tabel și deviz | Categorii și depozite; cantități limitate de stoc; reduceri de volum și oferte descărcabile | [Signeda](https://www.signeda.md/) |
| AutoGrid | Comparație de kituri aftermarket și service | Garaj și buget; comparație de specificații; estimare cu montaj și programări consultabile | [AUTODOC Europe](https://www.autodoc.co.uk/) |
| Luma Suites | Prezentare arhitecturală de apartamente urbane | Filtrare după capacitate; calculul nopților și totalului; istoric de sejururi și anulare | [Park Suites](https://parksuites.md/en-gb/) |
| Urban Haven | Hotel cu experiențe de cazare, spa și restaurant | Schimbarea experienței; configurare cameră și servicii suplimentare; pachete de sejur persistente | [Manhattan Hotel](https://manhattan-hotel.md/) |
| Nest Collection | Colecție de apartamente cu galerie asimetrică | Filtrare cartiere; colecție personală; solicitări de cazare cu istoric și anulare | [Sonder](https://www.sonder.com/) |
| Moldova Escape | Planificator de escapade și itinerar | Cazări după regiune și buget; experiențe locale; calcul și export de plan personal | [Booking.com Moldova](https://www.booking.com/country/md.html) |
| Bazar Local | Anunțuri locale pe categorii și localități | Publicare și retragere de anunțuri demo; favorite; afișarea datelor de contact | [999.md](https://999.md/) |
| Preț Bun | Comparator de oferte și istoric de preț | Sortare cu livrare și disponibilitate; istoric demonstrativ; praguri de preț persistente | [Cât Costă](https://catcosta.md/) |
| LocalCraft | Piață de artizanat cu povești și personalizare | Glazură și inscripție; cantități și ambalaj pentru obiecte; comenzi cu opțiunile păstrate | [Etsy](https://www.etsy.com/) |
| SkillUp | Studio de cursuri practice și lecții de probă | Catalog pe subiecte; alegerea grupei; lecții, evaluare și progres salvat | [TiRoDemy](https://tirodemy.md/) |
| CivicLearn | Portal instituțional cu program și evaluare | Module de lectură; evaluare deblocată prin progres; confirmare demonstrativă descărcabilă | [MLearn](https://mlearn.gov.md/) |
| MentorCloud | Trasee de carieră cu exerciții și mentorat | Plan în funcție de timpul disponibil; portofoliu cu etape succesive; sesiuni fără suprapunere | [Coursera / Teachable](https://www.coursera.org/) |
| CasaCheck | Catalog de proprietăți și dosare comparative | Filtre combinate; fișe de proprietate; comparație de suprafețe, camere și preț pe m² | [Immobiliare.md](https://immobiliare.md/) |
| DirectHome | Locuințe direct de la proprietar și agendă | Anunțuri proprii; programări de vizionare fără suprapuneri; listă personală de verificare | [999.md Imobiliare](https://999.md/) |
| Area Insight | Atlas interactiv de cartiere și indicatori | Schemă interactivă; straturi de preț, transport și verdeață; estimare orientativă și export | [Zillow / Rightmove](https://www.rightmove.co.uk/) |
| TableFlow | Restaurante și plan interactiv de sală | Selecție dată, oră și persoane; masă conform capacității; rezervări și eliberarea mesei | [RezervaMasa.md](https://rezervamasa.md/) |
| FoodRoute | Meniu de livrare cu coș lateral și urmărire | Produse și observații; taxe pe zonă sau ridicare; comenzi și simularea etapelor de pregătire | [Straus.md](https://straus.md/) |
| Menu Studio | Bistro editorial și meniu sezonier | Filtre vegetariene și alergeni declarați; selecție de preparate exportabilă; vizite planificate | [Greko Fresh / OpenTable](https://www.opentable.com/) |
| MyUtility | Cont de consumator pentru facturi și contor | Achitare simulată cu sold actualizat; indici validați; istoric de consum și facturi descărcabile | [Premier Energy](https://premierenergy.md/) |
| BlockAdmin | Comunitate de bloc, avizier și participare | Sesizări cu stări; un vot per propunere în demo; repartizarea cheltuielilor pe apartament și suprafață | [Portaluri de administrare rezidențială](https://www.buildium.com/) |

## Limitele demonstrațiilor

Datele, prețurile, stocurile, persoanele și proprietățile sunt demonstrative; fotografiile sunt ilustrative. Fluxurile modifică date locale persistente. Ele nu reprezintă servicii de plată, rezervare, mesagerie, autentificare sau monitorizare live.

## Verificare

Suitele independente DOM folosesc React 19, jsdom și Testing Library, montează componentele reale și verifică interacțiunile, persistența după reîncărcare, validările și conținutul descărcărilor. Au trecut 73 de teste funcționale și 210 verificări de încărcare a datelor locale, acoperind toate cele 32 de proiecte și cele 66 de chei de stocare. Fiecare proiect are propriile scheme pentru validarea datelor salvate; colecțiile goale și valorile opționale valide sunt păstrate, iar datele incompatibile revin la valorile inițiale. Rapoartele finale sunt în docs/qa-32-projects/. Verificarea DOM nu înlocuiește verificarea vizuală într-un browser.

## Catalog

Auditul exporturilor finale a verificat 32 de builduri reușite, 352 de referințe locale fără fișiere lipsă și 496 de comparații între structuri DOM. Nu există componente principale cu hash identic sau structuri principale identice după eliminarea textelor, claselor și culorilor. Acest control static documentează diferențele de implementare, fără a pretinde o evaluare vizuală în browser.

Cele 32 de previzualizări folosesc `preview.html`, generat din exportul real la sincronizare și înainte de construirea catalogului. Acesta păstrează conținutul, stilurile și imaginile, eliminând scripturile și preîncărcările lor. Cadrul păstrează originea locală, cu scripturile și formularele dezactivate. Pagina `index.html` rămâne complet interactivă când proiectul este deschis separat.

Descrierile și fișele proiectelor sunt specifice fiecăruia în română, rusă și engleză. Ele precizează ce funcții sunt demonstrative și care servicii externe trebuie conectate separat.

## Surse și întreținere

Sursele editabile se află în cele 32 de directoare numerotate din `D:/proiecte-front-end`. Catalogul include exporturile în `public/<slug>/`. `showcase-projects/redesign-manifest.json` leagă fiecare intrare din catalog de sursă, referință și funcționalități. Scripturile de lucru folosite în implementare au fost arhivate în `work/redesign-implementation`; sursele proiectelor sunt versiunile finale de întreținut.

La adăugarea sau schimbarea unui model salvat în browser, actualizează schema lui din `components/storage-schema.ts` în proiectul respectiv. Datele necunoscute nu sunt restaurate automat.

Adresele cadrelor includ versiunea SHA-256 a con?inutului din `app/project-preview-versions.json`, actualizat? la generare ?i sincronizare, pentru a evita folosirea coper?ilor vechi din cache.
