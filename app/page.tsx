"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ExternalLink, Menu, ShoppingBag, Sparkles, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const projects = [
  { id: 9, title: "iQ CALENDAR", type: "Calendar & Events", price: 1490, tone: "iqcalendar", desc: "Calendar social pentru evenimente, parteneri și grupuri", stack: ["React", "TypeScript", "Firebase Auth", "Realtime Database", "Google Sign-In", "Telegram Bot API", "DeepL API", "Netlify Functions", "Firebase Admin", "Esbuild"] },
  { id: 8, title: "CONTOR ACASĂ", type: "Utility Management", price: 2490, tone: "contor", desc: "Platformă pentru administrarea inteligentă a comunităților", stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Firebase Auth", "Realtime Database", "Firebase Storage", "Firebase Admin", "Leaflet", "OpenStreetMap", "Netlify Functions", "Lucide Icons"] },
  { id: 7, title: "MICORA", type: "Beauty", price: 790, tone: "micora", desc: "Experiență digitală premium pentru salon de frumusețe", stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Lucide Icons", "Unsplash", "Cloudflare", "Vinext", "Netlify"] },
];
const filters = ["Toate", "Calendar & Events", "Utility Management", "Beauty"];
const categorySlugs: Record<string, string> = {
  "Calendar & Events": "calendar-events",
  "Utility Management": "utility-management",
  Beauty: "beauty",
};

function ProjectVisual({ project }: { project: (typeof projects)[number] }) {
  return <div className={`visual visual-${project.tone}`}>
    {project.id === 9 && <><div className="iq-brand"><b>iQ</b> Calendar</div><div className="iq-window"><div className="iq-head"><span>August 2026</span><i>•••</i></div><div className="iq-week"><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div className="iq-days">{[10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map(day=><i className={day===19?"selected":day===23?"event":""} key={day}>{day}</i>)}</div><div className="iq-event"><span>18:30</span><b>🍷 Cină împreună</b><small>2 participanți</small></div></div><div className="iq-float">♥ +3</div><div className="iq-badge">PLANIFICĂ · INVITĂ · CONECTEAZĂ</div></>}
    {project.id === 8 && <><div className="contor-brand">◉ CONTOR ACASĂ</div><div className="contor-ui"><div className="contor-side"><i/><i/><i/><i/></div><div className="contor-main"><small>BUNĂ, CRISTIAN</small><strong>2.840 <em>MDL</em></strong><span>SPRE ACHITARE</span><div className="contor-bars"><i/><i/><i/><i/><i/></div></div><div className="contor-card"><b>+128</b><span>CONSUMATORI</span></div></div><div className="contor-badge">MULTI-ZONĂ · 3 ROLURI</div></>}
    {project.id === 7 && <><img className="micora-cover" src="/projects/micora-cover.png" alt="Micora — site premium pentru salon de frumusețe"/><div className="micora-badge">PROIECT REAL · 2026</div></>}
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
    <section className="projects shell" id="proiecte"><div className="section-head"><div><span className="kicker">/ CATALOG 2026</span><h2>ALEGE URMĂTORUL<br/>TĂU <i>PROIECT.</i></h2></div><div className="count">{String(visible.length).padStart(2,"0")}<span>PROIECTE<br/>DISPONIBILE</span></div></div><div className="filters">{filters.map((filter)=><button key={filter} onClick={()=>selectCategory(filter)} className={active===filter ? "active" : ""}>{filter}</button>)}</div><motion.div layout className="grid"><AnimatePresence mode="popLayout">{visible.map((project)=><motion.article layout key={project.id} className="card" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.95}} whileHover={{y:-6}}><ProjectVisual project={project}/><div className="card-info"><div><span className="type">{project.type}</span><h3>{project.title}</h3><p>{project.desc}</p></div><div className="price"><small>DE LA</small>€{project.price}</div></div><div className="tags">{project.stack.map(x=><span key={x}>{x}</span>)}<button onClick={()=>setSelected(project)} aria-label={`Detalii ${project.title}`}><ArrowRight/></button></div></motion.article>)}</AnimatePresence></motion.div></section>
    <section className="process" id="proces"><div className="shell"><span className="kicker light">/ CUM FUNCȚIONEAZĂ</span><h2>DE LA CLICK<br/>LA <i>LAUNCH.</i></h2><div className="steps">{[["01","ALEGI","Explorezi catalogul și găsești proiectul potrivit ideii tale."],["02","PERSONALIZĂM","Adaptăm brandul, culorile și conținutul pentru afacerea ta."],["03","LANSĂM","Primești proiectul complet, configurat și gata să producă."]].map(([n,t,d])=><div className="step" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><ArrowRight/></div>)}</div></div></section>
    <section className="why shell"><div className="why-main"><span className="kicker">/ DE CE MONO/DEV</span><h2>NU VINDEM<br/>DOAR <i>PIXELI.</i></h2><p>Fiecare proiect este construit să arate impecabil, să se miște rapid și, cel mai important, să transforme vizitatorii în clienți.</p><a href="mailto:hello@monodev.ro">Hai să vorbim <ArrowRight size={18}/></a></div><div className="metrics"><div><strong>100%</strong><span>COD CURAT<br/>ȘI EDITABIL</span></div><div><strong>48H</strong><span>PÂNĂ LA<br/>PREDARE</span></div><div><strong>30</strong><span>ZILE SUPORT<br/>INCLUS</span></div></div></section>
    <footer id="contact"><div className="shell footer-top"><p>AI GĂSIT CE CĂUTAI?</p><a href="mailto:hello@monodev.ro">SĂ ÎNCEPEM <ArrowRight/></a></div><div className="shell footer-bottom"><div className="logo">M<span>O</span>NO/DEV</div><div><a href="#">Instagram</a><a href="#">Behance</a><a href="#">LinkedIn</a></div><span>© 2026 MONO/DEV</span></div></footer>
    <AnimatePresence>{selected && <motion.div className="modal-wrap" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)}><motion.div className="modal" initial={{y:30,scale:.97}} animate={{y:0,scale:1}} exit={{y:20,opacity:0}} onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)}><X/></button><ProjectVisual project={selected}/><span className="kicker">{selected.type} / LICENȚĂ COMPLETĂ</span><h2>{selected.title}</h2><p>{selected.id === 9 ? "Calendar social colaborativ pentru cupluri, prieteni și grupuri. Utilizatorii planifică evenimente, invită participanți, trimit sugestii, primesc confirmări și notificări și își organizează toate momentele într-o experiență comună." : selected.id === 8 ? "Platformă SaaS pentru asociații și comunități rezidențiale. Automatizează colectarea indicilor de apă și energie, verificarea fotografiilor, calculul plăților și datoriilor, comunicarea cu locatarii și administrarea mai multor zone dintr-un singur sistem." : selected.id === 7 ? "Site premium pentru salon de frumusețe, cu identitate editorială delicată, experiență trilingvă, prezentare interactivă a serviciilor, galerie și formular de programare. Conceput pentru a transforma vizitatorii în programări." : `${selected.desc}. Primești codul sursă complet, documentație și ajutor la lansare.`}</p><ul><li><Check/> Cod sursă complet și editabil</li><li><Check/> {selected.id === 9 ? "Parteneri, grupuri și evenimente colaborative" : selected.id === 8 ? "Consumator, administrator și system admin" : selected.id === 7 ? "Română, rusă și engleză incluse" : "Personalizare de bază inclusă"}</li><li><Check/> {selected.id === 9 ? "Firebase, Google Auth și notificări Telegram" : selected.id === 8 ? "Firebase, rapoarte, mesagerie și remindere" : selected.id === 7 ? "Servicii, galerie și programări" : "30 de zile de suport"}</li></ul><a href={`mailto:hello@monodev.ro?subject=Interesat de ${selected.title}`}>Cumpără pentru €{selected.price} <ExternalLink/></a></motion.div></motion.div>}</AnimatePresence>
  </main>;
}
