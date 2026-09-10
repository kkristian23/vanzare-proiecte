"use client";

import { ArrowLeft, ArrowUpRight, ChevronDown, CircleHelp, Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Locale, locales } from "../i18n";
import { BrandLogo } from "../brand-logo";
import "./intrebari.css";
import "../page-language-switch.css";

type FAQ = { question: string; answer: string };
type Category = { title: string; code: string; description: string; questions: FAQ[] };

const categories: Category[] = [
  { title: "Catalog & alegere", code: "01", description: "Cum găsești proiectul potrivit.", questions: [
    ["Ce găsesc în catalog?", "Proiecte digitale gata de lansare: site-uri, magazine, platforme și produse web pentru industrii diferite."],
    ["Proiectele din catalog sunt deja funcționale?", "Da. Fiecare este construit ca produs demonstrativ funcțional, pregătit pentru adaptare și lansare."],
    ["Cum aleg proiectul potrivit?", "Pornește de la tipul afacerii, obiectivul principal și funcțiile de care ai nevoie. Te ajutăm să compari opțiunile."],
    ["Pot vedea proiectul înainte să îl cumpăr?", "Da, din catalog poți deschide prezentarea fiecărui proiect și, unde este disponibil, demo-ul acestuia."],
    ["De ce unele proiecte au prețuri diferite?", "Prețul reflectă amploarea produsului, numărul de pagini, funcțiile și nivelul de pregătire pentru lansare."],
    ["Pot filtra proiectele după categorie?", "Da. Catalogul are filtre de categorie, platformă, sistem de operare, căutare și sortare după preț."],
    ["Există proiecte pentru afaceri mici?", "Da. Catalogul include soluții potrivite atât pentru lansări rapide, cât și pentru afaceri în creștere."],
    ["Există proiecte pentru companii mari?", "Da. Unele proiecte sunt gândite ca platforme și pot fi extinse cu module, roluri și integrări."],
    ["Pot cere o recomandare înainte de a decide?", "Da. Trimite-ne domeniul, obiectivul și bugetul estimativ, iar noi îți recomandăm o direcție potrivită."],
    ["Catalogul se actualizează?", "Da. Adăugăm și îmbunătățim proiecte pe măsură ce apar concepte și funcții noi."],
  ].map(([question, answer]) => ({ question, answer })) },
  { title: "Preț, licență & plată", code: "02", description: "Claritate înainte de investiție.", questions: [
    ["Ce include prețul afișat?", "Prețul de bază acoperă licența proiectului și pachetul indicat în prezentarea lui. Personalizările se estimează separat."],
    ["Prețul include codul sursă?", "Da, pentru achiziția completă primești codul sursă editabil al proiectului, conform pachetului agreat."],
    ["Pot plăti în rate?", "Da, este posibil. Putem discuta un termen de plată pentru proiectele care includ personalizare sau implementări mai ample."],
    ["Există și opțiune de chirie lunară?", "Pentru site-urile eligibile, da. Chiria fixă lunară se calculează pentru 18 luni și include lansarea și întreținerea tehnică."],
    ["Pot cumpăra ulterior un site închiriat?", "Da, poți cumpăra ulterior site-ul închiriat, conform condițiilor stabilite împreună."],
    ["Ce licență primesc?", "Licența exactă este clarificată înainte de începere și stabilește drepturile de folosire, modificare și publicare."],
    ["Pot revinde proiectul după cumpărare?", "Da, toate drepturile vă aparțin."],
    ["Se facturează personalizările separat?", "Da. Adaptările care depășesc pachetul proiectului se estimează transparent înainte de lucru."],
    ["Există costuri recurente?", "Doar dacă alegi servicii recurente, cum ar fi hostingul, mentenanța sau integrări externe cu abonament."],
    ["Primesc o estimare înainte de plată?", "Da. Vei primi o propunere clară cu livrabile, termen, cost și pașii următori."],
  ].map(([question, answer]) => ({ question, answer })) },
  { title: "Personalizare & brand", code: "03", description: "Proiectul devine al tău.", questions: [
    ["Pot schimba logo-ul și culorile?", "Da. Identitatea vizuală poate fi adaptată la logo, culori, tipografie și stilul brandului tău."],
    ["Pot modifica textele și imaginile?", "Da. Înlocuim conținutul demonstrativ cu textele, imaginile și mesajele afacerii tale."],
    ["Pot adăuga pagini noi?", "Da. Pagini precum Despre, Servicii, Întrebări, Blog sau Contact pot fi adăugate în funcție de nevoie."],
    ["Pot elimina secțiuni de care nu am nevoie?", "Da. Păstrăm doar ceea ce ajută utilizatorul și obiectivul comercial al proiectului."],
    ["Pot schimba limba site-ului?", "Da. Putem pregăti site-ul într-o limbă sau mai multe, inclusiv română, engleză și rusă."],
    ["Cât de mult pot personaliza designul?", "De la adaptări de brand până la ecrane și componente noi; definim nivelul potrivit înainte de implementare."],
    ["Pot folosi propriile fotografii?", "Da. Ne poți trimite imaginile, iar noi le optimizăm și le integrăm în compoziție."],
    ["Mă ajutați cu textele?", "Da. Putem structura și rafina textele astfel încât să fie clare, credibile și orientate spre acțiune."],
    ["Pot cere o funcție care nu apare în demo?", "Da. Spune-ne scenariul de folosire, iar noi evaluăm soluția tehnică și costul."],
    ["Personalizarea afectează termenul?", "Da, termenul depinde de amploarea adaptărilor și de cât de repede primim materialele necesare."],
  ].map(([question, answer]) => ({ question, answer })) },
  { title: "Lansare & livrare", code: "04", description: "De la alegere la publicare.", questions: [
    ["În cât timp poate fi lansat un proiect?", "Un proiect cu adaptări esențiale poate fi lansat rapid; termenul exact este confirmat după brief."],
    ["Care sunt pașii de lucru?", "Alegem proiectul, stabilim personalizările, pregătim conținutul, verificăm și publicăm."],
    ["Ce trebuie să pregătesc eu?", "De regulă: logo, date de contact, conținut, imagini și acces la domeniu sau hosting, dacă există."],
    ["Pot lansa fără să am un domeniu?", "Da. Te putem ghida în alegerea și conectarea unui domeniu potrivit."],
    ["Mă ajutați cu hostingul?", "Da. Putem configura hostingul și publicarea sau lucrăm cu furnizorul ales de tine."],
    ["Primesc acces înainte de lansare?", "Da. Vei verifica varianta pregătită înainte ca aceasta să fie publicată."],
    ["Faceți testare înainte de publicare?", "Da. Verificăm navigarea, formularele, afișarea mobilă și fluxurile principale."],
    ["Pot programa lansarea pentru o anumită zi?", "Da, dacă stabilim din timp materialele și aprobările necesare."],
    ["Ce se întâmplă dacă întârzii cu materialele?", "Calendarul se ajustează; păstrăm comunicarea deschisă pentru a relua eficient lucrul."],
    ["Primesc o confirmare la lansare?", "Da. Îți comunicăm când proiectul este live și ce accesuri sau recomandări urmează."],
  ].map(([question, answer]) => ({ question, answer })) },
  { title: "Tehnic & funcționalități", code: "05", description: "Ce se află sub interfață.", questions: [
    ["Pe ce tehnologii sunt construite proiectele?", "Majoritatea folosesc tehnologii moderne web, precum React, Next.js și TypeScript, alese pentru performanță și mentenabilitate."],
    ["Site-ul va fi responsive?", "Da. Interfața este gândită să funcționeze bine pe telefon, tabletă și desktop."],
    ["Pot integra un formular de contact?", "Da. Formularele pot trimite cereri pe email sau către un serviciu conectat."],
    ["Pot integra plăți online?", "Da, pentru proiectele unde este relevant. Alegem procesatorul potrivit pentru piața și modelul tău."],
    ["Pot conecta un CRM?", "Da. Putem trimite lead-uri către CRM-uri sau instrumente de automatizare compatibile."],
    ["Pot avea conturi de utilizator?", "Da. Această funcție poate fi adăugată sau configurată în proiectele care o susțin."],
    ["Pot integra Google Maps?", "Da. Hărți, locații, trasee și puncte de lucru pot fi incluse unde sunt utile."],
    ["Pot adăuga chat sau WhatsApp?", "Da. Putem integra metode de contact rapide și vizibile pentru vizitatori."],
    ["Se poate conecta la un API extern?", "Da. Analizăm documentația API-ului și stabilim integrarea necesară."],
    ["Pot cere o aplicație mobilă?", "Da. Catalogul include și direcții mobile, iar pentru un produs nou discutăm separat cerințele."],
  ].map(([question, answer]) => ({ question, answer })) },
  { title: "Conținut & administrare", code: "06", description: "Control după lansare.", questions: [
    ["Pot edita singur conținutul?", "Da, unde este necesar putem configura o zonă de administrare sau un flux simplu de actualizare."],
    ["Primesc instrucțiuni de administrare?", "Da. La predare îți explicăm lucrurile importante pentru actualizările de zi cu zi."],
    ["Pot adăuga produse noi?", "Da, proiectele de catalog sau e-commerce pot fi pregătite pentru adăugarea de produse."],
    ["Pot publica articole de blog?", "Da. Putem include o structură de blog sau resurse, cu editorul potrivit pentru echipa ta."],
    ["Cine scrie descrierile produselor?", "Poți furniza textele sau putem ajuta cu structurarea și redactarea lor."],
    ["Puteți migra conținut de pe site-ul vechi?", "Da. Evaluăm volumul și formatul conținutului, apoi planificăm migrarea."],
    ["Imaginile sunt optimizate?", "Da. Optimizăm imaginile pentru încărcare rapidă, păstrând un aspect bun."],
    ["Pot avea mai mulți administratori?", "Da, dacă soluția de administrare aleasă permite roluri și drepturi distincte."],
    ["Pot modifica meniul?", "Da. Meniul și paginile pot fi administrate în funcție de structura implementată."],
    ["Ce se întâmplă cu datele din formulare?", "Stabilim traseul lor: email, CRM, bază de date sau un alt sistem agreat."],
  ].map(([question, answer]) => ({ question, answer })) },
  { title: "SEO & performanță", code: "07", description: "Vizibil, rapid, pregătit pentru creștere.", questions: [
    ["Este site-ul pregătit pentru Google?", "Da. Punem bazele SEO tehnic: structură semantică, metadate, titluri și performanță."],
    ["Pot alege titlul și descrierea paginilor?", "Da. Acestea sunt configurate împreună cu conținutul final al proiectului."],
    ["Site-ul se încarcă repede?", "Construim cu atenție la performanță și optimizăm resursele esențiale pentru o experiență rapidă."],
    ["Pot conecta Google Analytics?", "Da. Putem integra instrumente de analiză și măsurare a conversiilor."],
    ["Pot conecta Google Search Console?", "Da. Te putem ghida pentru verificare și configurarea proprietății."],
    ["Ajutați cu cuvinte-cheie?", "Putem propune o structură de pagini și teme relevante; cercetarea SEO extinsă se poate estima separat."],
    ["Pot avea pagini locale pentru orașe?", "Da. Putem crea o structură coerentă pentru servicii sau locații multiple."],
    ["Imaginile au texte alternative?", "Da. Adăugăm descrieri alternative relevante pentru accesibilitate și context SEO."],
    ["Pot urmări cererile primite?", "Da. Putem măsura trimiterile de formular, apelurile la acțiune și alte evenimente utile."],
    ["SEO garantează poziția întâi?", "Nu. SEO îmbunătățește fundația și relevanța, însă rezultatele depind și de piață, conținut și concurență."],
  ].map(([question, answer]) => ({ question, answer })) },
  { title: "Suport & mentenanță", code: "08", description: "Ajutor și după publicare.", questions: [
    ["Oferiți suport după lansare?", "Da. Fiecare predare include perioada de suport menționată în ofertă."],
    ["Ce include mentenanța?", "Poate include actualizări tehnice, monitorizare, mici ajustări și intervenții agreate."],
    ["Pot cere modificări după lansare?", "Da. Modificările mici pot intra în suport, iar extinderile se planifică separat."],
    ["Ce fac dacă observ o problemă?", "Scrie-ne cu o descriere, captură și link; analizăm și îți comunicăm următorul pas."],
    ["Există suport de urgență?", "Pentru situații critice, stabilim un canal și un nivel de prioritate în funcție de pachet."],
    ["Cât durează răspunsul?", "Ne propunem să răspundem în cel mult 12 ore pentru cererile obișnuite."],
    ["Pot prelungi mentenanța?", "Da. Putem continua cu un abonament lunar sau cu intervenții punctuale."],
    ["Faceți copii de siguranță?", "Strategia de backup depinde de hosting și de aplicație; o stabilim înainte de lansare."],
    ["Actualizați dependențele tehnice?", "Da, în cadrul mentenanței tehnice planificate și după verificarea compatibilității."],
    ["Pot lucra cu propria echipă după predare?", "Da. Putem pregăti predarea tehnică și documentația necesară pentru o tranziție bună."],
  ].map(([question, answer]) => ({ question, answer })) },
  { title: "Securitate & date", code: "09", description: "Lucruri importante, explicate simplu.", questions: [
    ["Datele mele sunt tratate confidențial?", "Da. Folosim informațiile de proiect doar pentru discuția, implementarea și suportul convenite."],
    ["Site-ul va avea HTTPS?", "Da. Conectăm certificatul SSL disponibil prin hosting pentru o conexiune securizată."],
    ["Puteți adăuga politică de confidențialitate?", "Da. Putem integra paginile juridice furnizate sau aprobate de tine."],
    ["Formularele sunt protejate de spam?", "Da. Putem aplica măsuri potrivite, precum validare, honeypot sau protecție anti-robot."],
    ["Cine deține domeniul?", "Ideal, domeniul este înregistrat pe numele tău; te ajutăm cu configurarea lui."],
    ["Cine deține contul de hosting?", "Recomandăm ca accesul principal să fie al tău, cu acces tehnic delegat către noi când este nevoie."],
    ["Primesc accesurile la predare?", "Da. Accesurile relevante sunt predate într-un mod sigur, conform pachetului."],
    ["Puteți integra un banner de cookies?", "Da, dacă folosești cookie-uri sau instrumente care cer consimțământ."],
    ["Stocați date personale în site?", "Doar dacă funcționalitatea o cere; atunci definim clar ce se stochează și unde."],
    ["Mă puteți ajuta cu GDPR?", "Putem implementa cerințele tehnice stabilite; pentru consultanță juridică recomandăm un specialist."],
  ].map(([question, answer]) => ({ question, answer })) },
  { title: "Colaborare & următorii pași", code: "10", description: "Începem cu o conversație bună.", questions: [
    ["Cum începem?", "Alege un proiect sau trimite-ne ideea ta prin pagina de contact. Revenim cu întrebările utile."],
    ["Ce informații să trimit în primul mesaj?", "Spune-ne ce afacere ai, ce vrei să obții, ce proiect te interesează și ce termen ai în minte."],
    ["Pot programa un apel?", "Da. Putem stabili un moment potrivit după primul mesaj."],
    ["Lucrați doar cu clienți din Moldova?", "Nu. Putem colabora la distanță cu clienți din alte țări."],
    ["Pot veni cu un brief incomplet?", "Da. Te ajutăm să îl transformi într-o listă clară de priorități."],
    ["Pot cere o ofertă pentru mai multe proiecte?", "Da. Comparăm opțiunile și putem construi o ofertă pentru scenariul ales."],
    ["Pot combina două proiecte din catalog?", "Uneori da. Analizăm ce elemente pot fi reunite fără a compromite experiența sau termenul."],
    ["Ce se întâmplă după acceptarea ofertei?", "Stabilim calendarul, accesurile, materialele și punctele de aprobare, apoi începem implementarea."],
    ["Cum comunicăm pe parcurs?", "Stabilim un canal simplu de lucru pentru actualizări, întrebări și feedback."],
    ["Nu am găsit răspunsul meu. Ce fac?", "Scrie-ne. O întrebare bună merită un răspuns clar, iar noi actualizăm FAQ-ul când este util."],
  ].map(([question, answer]) => ({ question, answer })) },
];

export default function QuestionsPage() {
  const [locale, setLocale] = useState<Locale>("ro");
  const [active, setActive] = useState("Toate");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const normalized = query.trim().toLocaleLowerCase("ro");
  const visible = useMemo(() => categories.map(category => ({ ...category, questions: category.questions.filter(item =>
    (active === "Toate" || category.title === active) && (!normalized || `${item.question} ${item.answer} ${category.title}`.toLocaleLowerCase("ro").includes(normalized))
  ) })).filter(category => category.questions.length), [active, normalized]);
  const count = categories.reduce((total, category) => total + category.questions.length, 0);
  useEffect(() => {
    const urlLocale = new URL(window.location.href).searchParams.get("lang");
    const savedLocale = localStorage.getItem("mono-locale");
    const nextLocale = locales.includes(urlLocale as Locale) ? urlLocale as Locale : locales.includes(savedLocale as Locale) ? savedLocale as Locale : "ro";
    setLocale(nextLocale);
    document.documentElement.lang = nextLocale;
  }, []);
  const changeLocale = (nextLocale: Locale) => {
    localStorage.setItem("mono-locale", nextLocale);
    const url = new URL(window.location.href);
    if (nextLocale === "ro") url.searchParams.delete("lang"); else url.searchParams.set("lang", nextLocale);
    window.history.replaceState({}, "", url);
    document.documentElement.lang = nextLocale;
    setLocale(nextLocale);
  };

  return <main className="faq-page">
    <div className="faq-noise" aria-hidden="true" />
    <header className="faq-nav">
      <BrandLogo className="faq-logo" href="/" inverse />
      <div className="faq-runtime"><i /> KNOWLEDGE BASE <b>v1.0.0</b></div>
      <div className="page-nav-tools">
        <div className="page-language-switch" aria-label="Limbă">{locales.map(language => <button key={language} className={locale === language ? "active" : ""} onClick={() => changeLocale(language)} lang={language}>{language.toUpperCase()}</button>)}</div>
      </div>
    </header>
    <section className="faq-hero">
      <div><a className="faq-back faq-hero-back" href="/"><ArrowLeft /> Înapoi la catalog</a><p className="faq-kicker"><span>00</span> / ÎNTREBĂRI FRECVENTE</p><h1>RĂSPUNSURI<br />PENTRU <em>DECIZII</em><br />MAI BUNE.</h1><p className="faq-lead">Tot ce trebuie să știi despre proiectele din catalog, de la alegere și preț până la lansare.</p></div>
      <div className="faq-stat-card">
        <em className="faq-stat-edition">KNOWLEDGE<br />EDITION</em>
        <Sparkles />
        <strong>{count}</strong>
        <span>răspunsuri<br /><b>cu sens.</b></span>
        <small>STATUS: READY_TO_HELP</small>
      </div>
    </section>
    <section className="faq-workspace">
      <aside className="faq-sidebar"><p>/ NAVIGARE RAPIDĂ</p><button className={active === "Toate" ? "selected" : ""} onClick={() => setActive("Toate")}><span>00</span> Toate întrebările <b>{count}</b></button>{categories.map(category => <button key={category.title} className={active === category.title ? "selected" : ""} onClick={() => setActive(category.title)}><span>{category.code}</span> {category.title} <b>{category.questions.length}</b></button>)}<a href="/contact">Mai ai o întrebare? <ArrowUpRight /></a></aside>
      <div className="faq-content"><div className="faq-content-head"><div><p>/ CAUTĂ ÎN BAZA DE CUNOȘTINȚE</p><h2>{active === "Toate" ? "Tot catalogul," : active + ","}<br /><em>fără neclarități.</em></h2></div><span>{visible.reduce((total, category) => total + category.questions.length, 0).toString().padStart(3, "0")} rezultate</span></div>
        <label className="faq-search"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Caută după subiect, funcție sau termen..." />{query && <button onClick={() => setQuery("")} aria-label="Șterge căutarea"><X /></button>}</label>
        {visible.length ? visible.map(category => <section className="faq-category" key={category.title}><div className="faq-category-head"><span>{category.code}</span><div><h3>{category.title}</h3><p>{category.description}</p></div><b>{category.questions.length} întrebări</b></div><div className="faq-list">{category.questions.map((item, index) => { const id = `${category.title}-${index}`; const isOpen = open === id; return <article className={isOpen ? "open" : ""} key={id}><button aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : id)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.question}</strong><ChevronDown /></button>{isOpen && <div className="faq-answer"><p>{item.answer}</p></div>}</article>})}</div></section>) : <div className="faq-empty"><CircleHelp /><h3>Niciun rezultat încă.</h3><p>Încearcă alt cuvânt sau revino la toate întrebările.</p><button onClick={() => { setQuery(""); setActive("Toate"); }}>Resetează filtrele</button></div>}
      </div>
    </section>
    <footer className="faq-footer"><span>© 2026 MONO/DEV</span><p>CLARITATE → DECIZIE → LANSARE</p><a href="/contact">Discută proiectul <ArrowUpRight /></a></footer>
  </main>;
}
