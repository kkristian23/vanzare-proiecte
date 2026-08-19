"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ExternalLink, Menu, ShoppingBag, Sparkles, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const projects = [
  { id: 12, title: "RENTECH", type: "Equipment Rental", price: 1200, tone: "renttech", desc: "Platformă completă pentru închirierea utilajelor și echipamentelor profesionale", stack: ["Next.js", "React", "TypeScript", "Cloudflare D1", "Drizzle ORM", "REST API", "Admin Panel", "Tailwind CSS", "Vinext", "Cloudflare"] },
  { id: 11, title: "ÉLAN", type: "Beauty & Academy", price: 400, tone: "elan", desc: "Website editorial pentru salon de unghii, servicii premium și cursuri profesionale", stack: ["React", "TypeScript", "Vite", "Responsive Design", "Lead Form", "CSS Animations", "Tailwind CSS", "Cloudflare"] },
  { id: 10, title: "FIXORA", type: "Service Management", price: 1500, tone: "fixora", desc: "Sistem operațional pentru administrarea completă a unui service auto", stack: ["React", "TypeScript", "Vite", "LocalStorage", "CSV Export", "Dashboard", "Responsive UI", "Tailwind CSS", "Cloudflare"] },
  { id: 9, title: "iQ CALENDAR", type: "Calendar & Events", price: 800, tone: "iqcalendar", desc: "Calendar social pentru evenimente, parteneri și grupuri", stack: ["React", "TypeScript", "Firebase Auth", "Realtime Database", "Google Sign-In", "Telegram Bot API", "DeepL API", "Netlify Functions", "Firebase Admin", "Esbuild"] },
  { id: 8, title: "CONTOR ACASĂ", type: "Utility Management", price: 2900, tone: "contor", desc: "Platformă pentru administrarea inteligentă a comunităților", stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase Auth", "Realtime Database", "Firebase Storage", "Firebase Admin", "Leaflet", "OpenStreetMap", "Netlify Functions", "Lucide Icons"] },
  { id: 7, title: "MICORA", type: "Beauty", price: 350, tone: "micora", desc: "Experiență digitală premium pentru salon de frumusețe", stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Lucide Icons", "Unsplash", "Cloudflare", "Vinext", "Netlify"] },
];
const filters = ["Toate", "Equipment Rental", "Beauty & Academy", "Service Management", "Calendar & Events", "Utility Management", "Beauty"];
const categorySlugs: Record<string, string> = {
  "Equipment Rental": "equipment-rental",
  "Beauty & Academy": "beauty-academy",
  "Service Management": "service-management",
  "Calendar & Events": "calendar-events",
  "Utility Management": "utility-management",
  Beauty: "beauty",
};

const projectDetails: Record<number, {
  summary: string;
  demo?: string;
  sections: Array<{ title: string; items: string[] }>;
}> = {
  12: {
    summary: "RentTech este o platformă full-stack pentru companii care închiriază utilaje și echipamente profesionale. Combină un catalog comercial rapid cu un panou securizat în care administratorul poate actualiza prețurile afișate clienților.",
    sections: [
      { title: "Ideea și publicul", items: ["Creat pentru firme de închiriere utilaje, echipamente de șantier și generatoare", "Prezintă oferta într-un format profesionist, cu tarife zilnice transparente", "Conectează rapid clientul cu echipa de vânzări prin solicitări și apel telefonic"] },
      { title: "Catalogul public", items: ["Catalog cu excavatoare, nacele, compactoare, generatoare și echipamente de iluminat", "Filtrare după Construcții, Energie și Lucru la înălțime", "Căutare instant după denumirea utilajului", "Etichete de disponibilitate, specificații, tarif zilnic și opțiune de solicitare", "Secțiuni comerciale cu beneficii, statistici și procesul de închiriere în trei pași"] },
      { title: "Administrare și date", items: ["Panou separat pentru catalog și prețuri", "Actualizarea tarifelor direct din interfața de administrare", "API REST pentru citirea și modificarea echipamentelor", "Persistență în Cloudflare D1 prin Drizzle ORM", "Date implicite de rezervă dacă baza de date nu este disponibilă"] },
      { title: "Acces și tehnologie", items: ["Panou de administrare securizat", "Next.js, React și TypeScript", "Cloudflare D1, Drizzle ORM, Vinext și infrastructură Cloudflare", "Design responsive pentru telefon, tabletă și desktop"] },
      { title: "Ce primește cumpărătorul", items: ["Codul sursă complet pentru site, API și panoul de administrare", "Schema bazei de date și date demo pentru catalog", "Structură pregătită pentru branding, echipamente și tarife reale", "Bază extensibilă pentru rezervări, disponibilitate și plăți online"] },
    ],
  },
  11: {
    summary: "Élan este un website premium care unește două direcții de business într-o singură experiență: serviciile unui studio de manichiură și vânzarea cursurilor printr-o academie profesională.",
    sections: [
      { title: "Ideea și poziționarea", items: ["Potrivit pentru nail artiști, saloane premium și academii de beauty", "Identitate editorială elegantă, construită pentru diferențiere și încredere", "Prezintă experiența, rezultatele și standardele studioului într-un parcurs coerent"] },
      { title: "Servicii pentru cliente", items: ["Prezentare pentru manichiură BIAB, gel și arhitectură, plus nail art editorial", "Durată, preț de pornire și descriere pentru fiecare serviciu", "Trasee clare către programare", "Programul, locația și datele necesare înaintea unei vizite"] },
      { title: "Academie și cursuri", items: ["Oferte distincte pentru nivel începător, intermediar și avansat", "Durată, kit, certificat, dimensiunea grupei și preț pentru fiecare curs", "Secțiune dedicată metodei, siguranței și educației aplicate", "Indicatori de încredere, rezultate și testimonial"] },
      { title: "Conversie și experiență", items: ["Formular interactiv pentru servicii, cursuri și solicitări personalizate", "Confirmare vizuală după trimiterea cererii", "Meniu responsive și navigare fluidă pe o singură pagină", "React, TypeScript, Vite și animații CSS"] },
      { title: "Ce primește cumpărătorul", items: ["Cod sursă complet și design responsive", "Structura pentru servicii, cursuri, poveste, testimonial și contact", "Conținut centralizat, simplu de personalizat", "Bază pregătită pentru integrarea unei programări online sau a unui CRM"] },
    ],
  },
  10: {
    summary: "FIXORA Service OS este un sistem de management pentru ateliere auto. Centralizează activitatea zilnică, lucrările, programările, relația cu clienții, devizele, piesele, echipa și indicatorii financiari într-un singur dashboard.",
    sections: [
      { title: "Ideea și publicul", items: ["Conceput pentru service-uri auto independente și rețele de ateliere", "Înlocuiește tabelele și evidența fragmentată cu un flux operațional unic", "Oferă managerului o imagine imediată asupra capacității și activității atelierului"] },
      { title: "Centru de lucru", items: ["Dashboard cu programările zilei, mașinile în lucru și venitul estimat", "Flux vizual pentru fiecare comandă, client, vehicul, lucrare, mecanic și progres", "Filtrare după status și căutare după client sau mașină", "Alerte pentru devize, piese întârziate și clienți care trebuie notificați", "Agenda următoarelor programări și evidența automatizărilor active"] },
      { title: "Module operaționale", items: ["Programări cu oră, vehicul, serviciu și status", "Clienți și mașini cu date de contact, ultima vizită și valoare totală", "Devize cu aprobare, facturare și valoare", "Stoc de piese cu prag minim, furnizor și alerte", "Echipă cu roluri, specializări, sarcini și eficiență"] },
      { title: "Rapoarte și funcții", items: ["Venit lunar, marjă brută, valoare medie și clienți recurenți", "Grafic pentru evoluția veniturilor și clasamentul serviciilor profitabile", "Adăugare, căutare, vizualizare și ștergere de înregistrări", "Persistență locală a datelor și export CSV pentru fiecare modul", "Interfață responsive construită cu React, TypeScript și Vite"] },
      { title: "Ce primește cumpărătorul", items: ["Cod sursă complet pentru dashboard și toate modulele", "Date demo realiste și interacțiuni funcționale", "Arhitectură pregătită pentru conectarea la o bază de date și autentificare", "Bază solidă pentru notificări, facturare, plăți și aplicație pentru clienți"] },
    ],
  },
  9: {
    summary: "Un calendar social colaborativ construit pentru oamenii care vor să transforme intențiile în momente petrecute împreună. iQ Calendar combină planificarea, rețeaua de parteneri și notificările într-o experiență simplă și personală.",
    demo: "https://papaya-lokum-7fc2a9.netlify.app/index.html",
    sections: [
      { title: "Ideea și publicul", items: ["Potrivit pentru cupluri, familii, prieteni și grupuri mici", "Centralizează evenimentele comune și reduce discuțiile repetitive despre dată și oră", "Experiență personalizabilă, optimizată pentru telefon și desktop"] },
      { title: "Planificare și calendar", items: ["Selectare vizuală a datei și orei", "Activități predefinite sau activitate personalizată", "Vizualizare calendar și listă, evenimente viitoare și arhivă", "Editarea, ștergerea și deschiderea directă a unui eveniment", "Mesaje, detalii și remindere configurabile pentru fiecare plan"] },
      { title: "Colaborare socială", items: ["Profil personal cu nickname unic", "Cereri de parteneriat și listă de contacte", "Grupuri reutilizabile pentru invitații rapide", "Propuneri de modificare cu acceptare sau refuz", "Notificări în aplicație și remindere manuale către participanți"] },
      { title: "Conturi și integrări", items: ["Autentificare Google prin Firebase Auth", "Firebase Realtime Database și Firebase Admin", "Notificări Telegram prin Telegram Bot API și scheduler dedicat", "Traduceri asistate prin DeepL API și Netlify Functions", "React, TypeScript și build modular cu Esbuild"] },
      { title: "Ce primește cumpărătorul", items: ["Codul sursă complet și editabil", "Structura pentru utilizatori, evenimente, parteneri, grupuri și notificări", "Configurarea integrărilor și fluxurilor automate", "Bază pregătită pentru branding, monetizare și extindere"] },
    ],
  },
  8: {
    summary: "O platformă completă de Utility Management pentru asociații și comunități rezidențiale. Digitalizează colectarea indicilor, verificarea dovezilor, calculul consumului, datoriile, achitările și comunicarea cu locatarii.",
    sections: [
      { title: "Ideea și publicul", items: ["Creat pentru asociații locative, sectoare de vile și administratori de comunități", "Înlocuiește tabelele, mesajele dispersate și colectarea manuală a datelor", "Arhitectură multi-zonă pentru operarea mai multor comunități din același sistem"] },
      { title: "Portalul consumatorului", items: ["Transmiterea lunară a indicilor de apă și energie", "Dovadă foto pentru fiecare citire", "Calcul automat al consumului și costurilor", "Situația achitărilor, datoriilor și contribuțiilor recurente", "Istoric de plăți, proiecte comunitare și mesaje", "Interfață în română, engleză și rusă"] },
      { title: "Panoul administratorului", items: ["Aprobarea și gestionarea conturilor", "Verificarea citirilor și fotografiilor", "Configurarea tarifelor și înregistrarea achitărilor", "Administrarea proiectelor, cotizațiilor și taxelor pentru deșeuri", "Rapoarte financiare și statistici publice", "Mesagerie segmentată și hartă interactivă a consumatorilor"] },
      { title: "Controlul sistemului", items: ["Rol separat de System Admin", "Crearea și administrarea zonelor", "Administratori dedicați pentru fiecare zonă", "Activarea funcțiilor prin feature flags", "Mutarea conturilor și administrarea drepturilor"] },
      { title: "Tehnologie și automatizări", items: ["Next.js, React, TypeScript și Tailwind CSS", "Firebase Auth, Realtime Database, Storage și Firebase Admin", "Leaflet și OpenStreetMap pentru hartă", "Netlify Scheduled Functions pentru remindere automate", "Arhitectură securizată pe roluri și reguli Firebase"] },
      { title: "Ce primește cumpărătorul", items: ["Cod sursă complet pentru interfață și administrare", "Modele de date, reguli Firebase și scripturi de inițializare", "Fluxuri pentru consumatori, administratori și system admin", "Bază SaaS extensibilă pentru alte tipuri de utilități și comunități"] },
    ],
  },
  7: {
    summary: "Un website premium pentru salon de frumusețe, construit ca experiență editorială și instrument de conversie. Micora pune serviciile, atmosfera și programarea în centrul unei identități vizuale rafinate.",
    sections: [
      { title: "Ideea și publicul", items: ["Potrivit pentru saloane de beauty, studiouri și specialiști independenți", "Poziționare premium prin design editorial și storytelling", "Conceput pentru a transforma vizitatorii în cereri de programare"] },
      { title: "Pagini și conținut", items: ["Homepage animat cu prezentare memorabilă de brand", "Servicii interactive pentru păr, unghii, îngrijirea pielii și sprâncene", "Pagină dedicată poveștii și filosofiei salonului", "Galerie vizuală extinsă", "Contact, telefon, email și formular de programare"] },
      { title: "Experiență și conversie", items: ["Română, rusă și engleză incluse", "Navigare responsive pentru telefon și desktop", "Animații premium și tranziții Framer Motion", "Conținut centralizat, ușor de personalizat", "Butoane și trasee clare către programare"] },
      { title: "Tehnologie și livrare", items: ["Next.js, React și TypeScript", "Tailwind CSS, Framer Motion și Lucide Icons", "Imagistică Unsplash integrată", "Build compatibil Cloudflare/Vinext și Netlify", "SEO și imagine socială Open Graph personalizată"] },
      { title: "Ce primește cumpărătorul", items: ["Codul sursă complet și editabil", "Design responsive și toate paginile prezentate", "Structură trilingvă pregătită pentru conținut real", "Bază rapidă pentru rebranding și lansarea unui salon"] },
    ],
  },
};

function ProjectVisual({ project }: { project: (typeof projects)[number] }) {
  return <div className={`visual visual-${project.tone}`}>
    {project.id === 12 && <><div className="renttech-mark">RT <span>RENTTECH</span></div><div className="renttech-machine">🏗️</div><div className="renttech-price"><small>UTILAJ DISPONIBIL</small><b>2 400 MDL<em>/ zi</em></b></div><div className="renttech-line"/></>}
    {project.id === 11 && <><div className="elan-mark">ÉLAN<small>NAIL STUDIO & ACADEMY</small></div><div className="elan-arch"><span>É</span></div><div className="elan-copy">BEAUTY<br/><i>meets craft.</i></div></>}
    {project.id === 10 && <><div className="fixora-mark"><b>F</b> FIXORA <small>SERVICE OS</small></div><div className="fixora-panel"><span>CAPACITATE ATELIER</span><strong>78%</strong><i><em/></i><div><b>12</b> PROGRAMĂRI <b>6</b> ÎN LUCRU</div></div><div className="fixora-status">● LIVE OPERATIONS</div></>}
    {project.id === 9 && <><div className="iq-brand"><b>iQ</b> Calendar</div><div className="iq-window"><div className="iq-head"><span>August 2026</span><i>•••</i></div><div className="iq-week"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div className="iq-days">{[10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map(day=><i className={day===19?"selected":day===23?"event":""} key={day}>{day}</i>)}</div><div className="iq-event"><span>18:30</span><b>🍷 Cină împreună</b><small>2 participanți</small></div></div><div className="iq-float">♥ +3</div><div className="iq-badge">PLANIFICĂ · INVITĂ · CONECTEAZĂ</div></>}
    {project.id === 8 && <><div className="contor-brand">◉ CONTOR ACASĂ</div><div className="contor-ui"><div className="contor-side"><i/><i/><i/><i/></div><div className="contor-main"><small>BUNĂ, CRISTIAN</small><strong>2.840 <em>MDL</em></strong><span>SPRE ACHITARE</span><div className="contor-bars"><i/><i/><i/><i/><i/></div></div><div className="contor-card"><b>+128</b><span>CONSUMATORI</span></div></div><div className="contor-badge">MULTI-ZONĂ · 3 ROLURI</div></>}
      {project.id === 7 && <img className="micora-cover" src="/projects/micora-cover.png" alt="Micora — site premium pentru salon de frumusețe"/>}
    <div className="visual-top"><span>0{project.id}</span><span>{project.type}</span></div>
    {project.id === 1 && <><div className="orb"/><div className="nexus-word">NEXUS</div><div className="mini-pill">AI POWERED WORKSPACE</div></>}
    {project.id === 2 && <><div className="arch-shape"/><div className="arch-copy">FORM<br/>FOLLOWS<br/><i>feeling.</i></div></>}
    {project.id === 3 && <><div className="pulse-circle">P</div><div className="pulse-copy">MOVE<br/>DIFFERENT.</div></>}
    {project.id === 4 && <><div className="chart"><i/><i/><i/><i/><i/></div><div className="chart-stat">+24.8%<small> GROWTH</small></div></>}
    {project.id === 5 && <><div className="moon"/><div className="night-copy">NOCTURNE<br/><i>after dark</i></div></>}
    {project.id === 6 && <><div className="kinetic-ring"/><div className="kinetic-copy">BREATHE.<br/>MOVE. LIVE.</div></>}
  </div>;
}

export default function Home() {
  const [active, setActive] = useState("Toate");
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null);
  const visible = active === "Toate" ? projects : projects.filter((p) => p.type === active);
  const selectedDetail = selected ? projectDetails[selected.id] : null;
  useEffect(() => {
    const syncFromUrl = () => {
      const slug = new URL(window.location.href).searchParams.get("categorie");
      const category = Object.entries(categorySlugs).find(([, value]) => value === slug)?.[0];
      setActive(category ?? "Toate");
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);
  const selectCategory = (category: string) => {
    setActive(category);
    const url = new URL(window.location.href);
    if (category === "Toate") url.searchParams.delete("categorie");
    else url.searchParams.set("categorie", categorySlugs[category]);
    url.hash = "proiecte";
    window.history.pushState({}, "", url);
  };
  return <main>
    <nav className="nav shell"><a className="logo" href="#top">M<span>O</span>NO/DEV</a><div className="nav-links"><a href="#proiecte">Proiecte</a><a href="#proces">Proces</a><a href="#contact">Contact</a></div><a className="nav-cta" href="#proiecte"><ShoppingBag size={16}/> Cumpără un proiect</a><button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Deschide meniul">{menu ? <X/> : <Menu/>}</button></nav>
    <AnimatePresence>{menu && <motion.div className="mobile-menu" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}}><a href="#proiecte" onClick={()=>setMenu(false)}>Proiecte</a><a href="#proces" onClick={()=>setMenu(false)}>Proces</a><a href="#contact" onClick={()=>setMenu(false)}>Contact</a></motion.div>}</AnimatePresence>
    <section className="hero shell" id="top"><motion.div className="eyebrow" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}><span/> PROIECTE DIGITALE. GATA DE LANSARE.</motion.div><motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.08}}>IDEI MARI.<br/><em>DEJA CONSTRUITE.</em></motion.h1><motion.div className="hero-bottom" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}}><p>Site-uri și produse digitale premium, construite cu grijă și pregătite să devină următoarea ta afacere.</p><a href="#proiecte" className="circle-arrow" aria-label="Vezi proiectele"><ArrowRight/></a></motion.div><div className="marquee"><div>DESIGN CARE VINDE <Sparkles/> COD CURAT <Zap/> LIVRARE RAPIDĂ <Sparkles/> DESIGN CARE VINDE <Zap/> COD CURAT <Sparkles/> LIVRARE RAPIDĂ</div></div></section>
    <section className="projects shell" id="proiecte"><div className="section-head"><div><span className="kicker">/ CATALOG 2026</span><h2>ALEGE URMĂTORUL<br/>TĂU <i>PROIECT.</i></h2></div><div className="count">{String(visible.length).padStart(2,"0")}<span>PROIECTE<br/>DISPONIBILE</span></div></div><div className="filters">{filters.map((filter)=><button key={filter} onClick={()=>selectCategory(filter)} className={active===filter ? "active" : ""}>{filter}</button>)}</div><motion.div layout className="grid"><AnimatePresence mode="popLayout">{visible.map((project)=><motion.article layout key={project.id} className="card" role="button" tabIndex={0} aria-label={`Vezi detalii ${project.title}`} onClick={()=>setSelected(project)} onKeyDown={(event)=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();setSelected(project)}}} initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.95}} whileHover={{y:-6}}><ProjectVisual project={project}/><div className="card-info"><div><span className="type">{project.type}</span><h3>{project.title}</h3><p>{project.desc}</p></div><div className="price"><small>DE LA</small>€{project.price}</div></div><div className="tags">{project.stack.map(x=><span key={x}>{x}</span>)}</div></motion.article>)}</AnimatePresence></motion.div></section>
    <section className="process" id="proces"><div className="shell"><span className="kicker light">/ CUM FUNCȚIONEAZĂ</span><h2>DE LA CLICK<br/>LA <i>LAUNCH.</i></h2><div className="steps">{[["01","ALEGI","Explorezi catalogul și găsești proiectul potrivit ideii tale."],["02","PERSONALIZĂM","Adaptăm brandul, culorile și conținutul pentru afacerea ta."],["03","LANSĂM","Primești proiectul complet, configurat și gata să producă."]].map(([n,t,d])=><div className="step" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><ArrowRight/></div>)}</div></div></section>
    <section className="why shell"><div className="why-main"><span className="kicker">/ DE CE MONO/DEV</span><h2>NU VINDEM<br/>DOAR <i>PIXELI.</i></h2><p>Fiecare proiect este construit să arate impecabil, să se miște rapid și, cel mai important, să transforme vizitatorii în clienți.</p><a href="mailto:hello@monodev.ro">Hai să vorbim <ArrowRight size={18}/></a></div><div className="metrics"><div><strong>100%</strong><span>COD CURAT<br/>ȘI EDITABIL</span></div><div><strong>48H</strong><span>PÂNĂ LA<br/>PREDARE</span></div><div><strong>30</strong><span>ZILE SUPORT<br/>INCLUS</span></div></div></section>
    <footer id="contact"><div className="shell footer-top"><p>AI GĂSIT CE CĂUTAI?</p><a href="mailto:hello@monodev.ro">SĂ ÎNCEPEM <ArrowRight/></a></div><div className="shell footer-bottom"><div className="logo">M<span>O</span>NO/DEV</div><div><a href="#">Instagram</a><a href="#">Behance</a><a href="#">LinkedIn</a></div><span>© 2026 MONO/DEV</span></div></footer>
    <AnimatePresence>{selected && selectedDetail && <motion.div className="modal-wrap" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)}><motion.div className="modal modal-detailed" initial={{y:30,scale:.97}} animate={{y:0,scale:1}} exit={{y:20,opacity:0}} onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)} aria-label="Închide detaliile"><X/></button><ProjectVisual project={selected}/><div className="modal-content"><span className="kicker">{selected.type} / LICENȚĂ COMPLETĂ</span><div className="modal-title-row"><h2>{selected.title}</h2><div className="modal-price"><small>PREȚ COMPLET</small>€{selected.price}</div></div><p className="modal-summary">{selectedDetail.summary}</p><div className="detail-sections">{selectedDetail.sections.map(section=><section key={section.title}><h3>{section.title}</h3><ul>{section.items.map(item=><li key={item}><Check/>{item}</li>)}</ul></section>)}</div><div className="modal-actions">{selectedDetail.demo ? <a className="demo-link" href={selectedDetail.demo} target="_blank" rel="noreferrer">Deschide proiectul <ExternalLink/></a> : <a className="demo-link" href={`mailto:hello@monodev.ro?subject=Solicit acces demo pentru ${selected.title}`}>Solicită acces demo <ExternalLink/></a>}<a className="buy-link" href={`mailto:hello@monodev.ro?subject=Interesat de ${selected.title}`}>Cumpără pentru €{selected.price} <ArrowRight/></a></div></div></motion.div></motion.div>}</AnimatePresence>
  </main>;
}
