"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  copy,
  Locale,
  locales,
  localDescription,
  localizedDetail,
  localType,
  showcaseCopy,
  visualCopy,
} from "./i18n";

const projects = [
  {
    id: 26,
    title: "NEO BOOKING",
    type: "Service Management",
    price: 1000,
    tone: "neobooking",
    desc: "Sistem universal de programări pentru servicii, echipe și disponibilitate, personalizat automat pentru fiecare companie",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Multi-tenant",
      "Booking Flow",
      "Theme Scanner",
      "Embeddable Widget",
      "Appointments API",
      "Responsive Design",
    ],
  },
  {
    id: 25,
    title: "AUDIO RENTAL MD",
    type: "Equipment Rental",
    price: 1500,
    tone: "audiorental",
    desc: "Platformă universală de închirieri cu inventar, disponibilitate, prețuri, depozite și managementul complet al rezervărilor",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Zod",
      "Dynamic Pricing",
      "Risk Engine",
      "Inventory Management",
      "RO / RU / EN",
    ],
  },
  {
    id: 24,
    title: "FORGE",
    type: "AI Website Factory",
    price: 5000,
    tone: "forge",
    desc: "Platformă locală pentru generarea, testarea și îmbunătățirea automată a website-urilor, cu toate serviciile incluse gratuit în primul an",
    stack: [
      "TypeScript",
      "Node.js",
      "Codex CLI",
      "Playwright",
      "Vitest",
      "Multi-agent Workflow",
      "Automated QA",
      "Local Dashboard",
      "Git Automation",
    ],
  },
  {
    id: 23,
    title: "STUDIO VELORA",
    type: "Interior Design",
    price: 700,
    tone: "studiovelora",
    desc: "Website luxury multipagină pentru arhitectură și design interior, cu proiecte, servicii și jurnal editorial",
    stack: [
      "React",
      "TypeScript",
      "Vinext",
      "Tailwind CSS",
      "Multi-page",
      "Project Portfolio",
      "Dynamic Routes",
      "Editorial Journal",
      "Responsive Design",
    ],
  },
  {
    id: 22,
    title: "STUDIO FORMA",
    type: "Interior Design",
    price: 500,
    tone: "studioforma",
    desc: "Website expresiv pentru studio de design interior, cu proiecte, laborator cromatic și formular interactiv",
    stack: [
      "React",
      "TypeScript",
      "Vinext",
      "Tailwind CSS",
      "Color Lab",
      "Interactive Palettes",
      "Portfolio",
      "Lead Form",
      "Responsive Design",
    ],
  },
  {
    id: 21,
    title: "NOMA",
    type: "Interior Design",
    price: 350,
    tone: "noma",
    desc: "Website editorial pentru studio de design interior, cu portofoliu, proces, materiale și cereri de proiect",
    stack: [
      "React",
      "TypeScript",
      "Vinext",
      "Tailwind CSS",
      "Portfolio Filters",
      "Before / After",
      "Interactive Materials",
      "Lead Form",
      "Responsive Design",
    ],
  },
  {
    id: 20,
    title: "POPHAUS",
    type: "Mobilă",
    price: 600,
    tone: "pophaus",
    desc: "Concept store trilingv pentru mobilier contemporan, colecții expresive și instrumente interactive",
    stack: [
      "React",
      "TypeScript",
      "Vinext",
      "Framer Motion",
      "Zustand",
      "Next Intl",
      "Room Mixer",
      "Style Quiz",
      "Netlify Forms",
    ],
  },
  {
    id: 19,
    title: "NORD & OAK",
    type: "Mobilă",
    price: 800,
    tone: "nordoak",
    desc: "Magazin editorial pentru mobilier sustenabil, artizani, materiale și obiecte cu trasabilitate",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Next Intl",
      "Framer Motion",
      "GSAP",
      "MDX",
      "Zod",
    ],
  },
  {
    id: 18,
    title: "FORMA LIVING",
    type: "Mobilă",
    price: 500,
    tone: "formaliving",
    desc: "Platformă premium de mobilier modular cu configuratoare vizuale pentru canapele și biblioteci",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "React Three Fiber",
      "Three.js",
      "Zustand",
      "Framer Motion",
      "Next Intl",
      "Tailwind CSS",
    ],
  },
  {
    id: 17,
    title: "ARCHICONTRACT",
    type: "Mobilă",
    price: 500,
    tone: "archicontract",
    desc: "Platformă B2B pentru mobilier contract, specificații profesionale, proiecte și cereri de ofertă",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "TanStack Table",
      "Zustand",
      "React Hook Form",
      "Zod",
      "Next Intl",
      "Tailwind CSS",
    ],
  },
  {
    id: 16,
    title: "ATELIER NOIRE",
    type: "Mobilă",
    price: 400,
    tone: "ateliernoire",
    desc: "Experiență editorială trilingvă pentru mobilier premium, colecții, proiecte și servicii",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Framer Motion",
      "Next Intl",
      "React Hook Form",
      "Zod",
      "Tailwind CSS",
      "Netlify",
    ],
  },
  {
    id: 15,
    title: "MARKET9000",
    type: "Marketplace",
    price: 1000,
    tone: "market9000",
    desc: "Platformă completă de anunțuri pentru cumpărare, vânzare și promovarea companiilor",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Firebase Auth",
      "Realtime Database",
      "Admin Panel",
      "User Accounts",
      "Responsive Design",
      "Netlify",
    ],
  },
  {
    id: 14,
    title: "NEO BARBER CLUB",
    type: "Beauty & Academy",
    price: 350,
    tone: "neo",
    desc: "Website premium pentru barber shop, servicii, portofoliu și academie profesională",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Motion",
      "GSAP",
      "Responsive Design",
      "Booking Flow",
      "Tailwind CSS",
    ],
  },
  {
    id: 12,
    title: "RENTECH",
    type: "Equipment Rental",
    price: 800,
    tone: "renttech",
    desc: "Platformă completă pentru închirierea utilajelor și echipamentelor profesionale",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Cloudflare D1",
      "Drizzle ORM",
      "REST API",
      "Admin Panel",
      "Tailwind CSS",
      "Vinext",
      "Cloudflare",
    ],
  },
  {
    id: 11,
    title: "ÉLAN",
    type: "Beauty & Academy",
    price: 400,
    tone: "elan",
    desc: "Website editorial pentru salon de unghii, servicii premium și cursuri profesionale",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Responsive Design",
      "Lead Form",
      "CSS Animations",
      "Tailwind CSS",
      "Cloudflare",
    ],
  },
  {
    id: 10,
    title: "FIXORA",
    type: "Service Management",
    price: 1000,
    tone: "fixora",
    desc: "Sistem operațional pentru administrarea completă a unui service auto",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "LocalStorage",
      "CSV Export",
      "Dashboard",
      "Responsive UI",
      "Tailwind CSS",
      "Cloudflare",
    ],
  },
  {
    id: 9,
    title: "iQ CALENDAR",
    type: "Calendar & Events",
    price: 800,
    tone: "iqcalendar",
    desc: "Calendar social pentru evenimente, parteneri și grupuri",
    stack: [
      "React",
      "TypeScript",
      "Firebase Auth",
      "Realtime Database",
      "Google Sign-In",
      "Telegram Bot API",
      "DeepL API",
      "Netlify Functions",
      "Firebase Admin",
      "Esbuild",
    ],
  },
  {
    id: 8,
    title: "CONTOR ACASĂ",
    type: "Utility Management",
    price: 2900,
    tone: "contor",
    desc: "Platformă pentru administrarea inteligentă a comunităților",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Firebase Auth",
      "Realtime Database",
      "Firebase Storage",
      "Firebase Admin",
      "Leaflet",
      "OpenStreetMap",
      "Netlify Functions",
      "Lucide Icons",
    ],
  },
  {
    id: 7,
    title: "MICORA",
    type: "Beauty & Academy",
    price: 350,
    tone: "micora",
    desc: "Experiență digitală premium pentru salon de frumusețe",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Lucide Icons",
      "Unsplash",
      "Cloudflare",
      "Vinext",
      "Netlify",
    ],
  },
];
const filters = [
  "Toate",
  "AI Website Factory",
  "Interior Design",
  "Mobilă",
  "Marketplace",
  "Equipment Rental",
  "Beauty & Academy",
  "Service Management",
  "Calendar & Events",
  "Utility Management",
];
// Păstrăm proiectele și categoriile în cod, dar le putem retrage temporar din catalog.
const hiddenCategories = new Set(["AI Website Factory"]);
const unavailableProjectIds = new Set([26]);
const filterCopy = {
  ro: {
    search: "CautÄƒ proiecte, categorii sau tehnologii",
    sort: "Cele mai noi",
    low: "PreÈ› crescÄƒtor",
    high: "PreÈ› descrescÄƒtor",
    more: "Mai multe",
    categories: "Toate categoriile",
    less: "Ascunde categoriile",
    empty: "Nu am gÄƒsit proiecte pentru aceste filtre.",
  },
  ru: {
    search:
      "ÐŸÐ¾Ð¸ÑÐº Ð¿Ð¾ Ð¿Ñ€Ð¾ÐµÐºÑ‚Ð°Ð¼, ÐºÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸ÑÐ¼ Ð¸ Ñ‚ÐµÑ…Ð½Ð¾Ð»Ð¾Ð³Ð¸ÑÐ¼",
    sort: "Ð¡Ð°Ð¼Ñ‹Ðµ Ð½Ð¾Ð²Ñ‹Ðµ",
    low: "Ð¦ÐµÐ½Ð° Ð¿Ð¾ Ð²Ð¾Ð·Ñ€Ð°ÑÑ‚Ð°Ð½Ð¸ÑŽ",
    high: "Ð¦ÐµÐ½Ð° Ð¿Ð¾ ÑƒÐ±Ñ‹Ð²Ð°Ð½Ð¸ÑŽ",
    more: "Ð•Ñ‰Ñ‘",
    empty: "ÐŸÑ€Ð¾ÐµÐºÑ‚Ñ‹ Ð¿Ð¾ ÑÑ‚Ð¸Ð¼ Ñ„Ð¸Ð»ÑŒÑ‚Ñ€Ð°Ð¼ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½Ñ‹.",
  },
  en: {
    search: "Search projects, categories or technologies",
    sort: "Newest first",
    low: "Price: low to high",
    high: "Price: high to low",
    more: "More",
    empty: "No projects match these filters.",
  },
} as const;

// Unicode escapes keep localized copy stable across Windows tools that may
// otherwise interpret UTF-8 text using a legacy code page.
const cleanFilterCopy = {
  ro: {
    search: "Caut\u0103 proiecte, categorii sau tehnologii",
    sort: "Cele mai noi",
    low: "Pre\u021b cresc\u0103tor",
    high: "Pre\u021b descresc\u0103tor",
    more: "Mai multe",
    empty: "Nu am g\u0103sit proiecte pentru aceste filtre.",
  },
  ru: {
    search:
      "\u041f\u043e\u0438\u0441\u043a \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432, \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0439 \u0438\u043b\u0438 \u0442\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u0439",
    sort: "\u0421\u043d\u0430\u0447\u0430\u043b\u0430 \u043d\u043e\u0432\u044b\u0435",
    low: "\u0426\u0435\u043d\u0430: \u043f\u043e \u0432\u043e\u0437\u0440\u0430\u0441\u0442\u0430\u043d\u0438\u044e",
    high: "\u0426\u0435\u043d\u0430: \u043f\u043e \u0443\u0431\u044b\u0432\u0430\u043d\u0438\u044e",
    more: "\u0415\u0449\u0451",
    categories:
      "\u0412\u0441\u0435 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438",
    less: "\u0421\u043a\u0440\u044b\u0442\u044c \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438",
    empty:
      "\u041f\u0440\u043e\u0435\u043a\u0442\u044b \u043f\u043e \u044d\u0442\u0438\u043c \u0444\u0438\u043b\u044c\u0442\u0440\u0430\u043c \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b.",
  },
  en: {
    ...filterCopy.en,
    categories: "All categories",
    less: "Hide categories",
  },
} as const;

const categorySlugs: Record<string, string> = {
  "AI Website Factory": "ai-website-factory",
  "Interior Design": "interior-design",
  Mobilă: "mobila",
  Marketplace: "marketplace",
  "Equipment Rental": "equipment-rental",
  "Beauty & Academy": "beauty-academy",
  "Service Management": "service-management",
  "Calendar & Events": "calendar-events",
  "Utility Management": "utility-management",
};
const projectSlugs: Record<number, string> = {
  26: "neo-booking",
  25: "audio-rental-md",
  24: "forge-ai-website-factory",
  23: "studio-velora",
  22: "studio-forma",
  21: "noma",
  20: "pophaus",
  19: "nord-and-oak",
  18: "forma-living",
  17: "archicontract",
  16: "atelier-noire",
  15: "market9000",
  14: "neo-barber-club",
  12: "rentech",
  11: "elan",
  10: "fixora",
  9: "iq-calendar",
  8: "contor-acasa",
  7: "micora",
};

const projectPaths: Record<number, string> = {
  26: "/neo-booking/",
  25: "/audio-rental-md/",
  24: "/forge/",
  23: "/studio-velora/",
  22: "/studio-forma/",
  21: "/noma/",
  20: "/pophaus/",
  19: "/nord-and-oak/",
  18: "/forma-living/",
  17: "/archicontract/",
  16: "/atelier-noire/",
  15: "/market9000/",
  14: "/neobarberclub/",
  12: "/rentech/",
  11: "/elan/",
  10: "/fixora/",
  9: "/iqcalendar/",
  8: "/contor-acasa/",
  7: "/micora/",
};

const projectDetails: Record<
  number,
  {
    summary: string;
    demo?: string;
    sections: Array<{ title: string; items: string[] }>;
  }
> = {
  26: {
    summary:
      "Neo Booking este o platformă universală de programări care adaptează automat experiența la identitatea fiecărei companii. Sistemul reunește configurarea serviciilor și echipei, disponibilitatea în timp real, rezervarea în mai mulți pași și integrarea în orice website printr-un widget dedicat.",
    sections: [
      {
        title: "Programări complete",
        items: [
          "Flux ghidat pentru alegerea serviciului, specialistului, datei și orei",
          "Verificarea intervalelor ocupate și confirmarea programării",
          "Date de contact, observații și sumar complet înainte de confirmare",
        ],
      },
      {
        title: "Configurare multi-companie",
        items: [
          "Companii independente cu URL, servicii, specialiști și program propriu",
          "Onboarding self-service pentru publicarea rapidă a unei noi pagini de rezervări",
          "Administrarea duratei, prețului și eligibilității specialiștilor pentru fiecare serviciu",
        ],
      },
      {
        title: "Personalizare automată",
        items: [
          "Scanarea website-ului companiei pentru extragerea culorilor și logo-ului",
          "Preview live și temă vizuală adaptată fără modificarea codului",
          "Template NEO protejat pentru tipografie, forme, umbre și spațiere coerentă",
        ],
      },
      {
        title: "Integrare",
        items: [
          "Widget JavaScript integrabil în orice website printr-un singur fragment de cod",
          "Redimensionare automată a iframe-ului și experiență responsive",
          "API-uri pentru companii, teme, programări și disponibilitate",
        ],
      },
      {
        title: "Tehnologie și livrare",
        items: [
          "Next.js 16, React 19 și TypeScript",
          "Arhitectură multi-tenant și stocare structurată pentru programări",
          "Cod sursă complet, pregătit pentru baze de date, autentificare și notificări",
        ],
      },
    ],
  },
  25: {
    summary:
      "Audio Rental MD, construit ca NEXA RENTAL, este o platformă universală pentru închirierea bunurilor fizice. Arhitectura gestionează atât produse serializate, cât și stocuri cantitative, combinând disponibilitatea reală cu reguli avansate de preț, depozit, risc și operațiuni de predare-retur.",
    sections: [
      {
        title: "Catalog universal",
        items: [
          "Categorii ierarhice, atribute și filtre dinamice configurate din date",
          "Conținut complet în română, rusă și engleză",
          "Produse pentru audio, camere, scule, biciclete, mobilier și categorii viitoare",
        ],
      },
      {
        title: "Inventar și disponibilitate",
        items: [
          "Inventar serializat pentru unități individuale și inventar cantitativ pentru stocuri",
          "Disponibilitate calculată după perioadă, locație, mentenanță, hold-uri și buffer",
          "Alocarea unităților separată de rezervarea comercială",
        ],
      },
      {
        title: "Pricing și risc",
        items: [
          "Tarife orare, zilnice, de weekend, săptămânale și lunare",
          "Depozite fixe, procentuale, per unitate, per comandă sau bazate pe risc",
          "Motor de risc explicabil raportat la tranzacție și valoarea de înlocuire",
        ],
      },
      {
        title: "Operațiuni de închiriere",
        items: [
          "Fluxuri pentru rezervare, alocare, pickup, retur și constatarea daunelor",
          "Checklist-uri, mentenanță, accesorii, bundle-uri și add-on-uri",
          "State machine pentru controlul sigur al ciclului unei rezervări",
        ],
      },
      {
        title: "Tehnologie și livrare",
        items: [
          "Next.js, React, TypeScript, Prisma și PostgreSQL",
          "Validare Zod, motoare de domeniu testate și migrare de bază de date",
          "Cod sursă complet și arhitectură pregătită pentru RBAC, checkout și mai multe locații",
        ],
      },
    ],
  },
  24: {
    summary:
      "Forge este o fabrică locală de website-uri care transformă un brief într-un proiect independent, testat și pregătit pentru lansare. Orchestratorul coordonează agenți Codex specializați, verificări automate și un dashboard pentru urmărirea întregului flux de producție. Achiziția include absolut toate serviciile gratuit în primul an, iar după această perioadă continuitatea serviciilor este asigurată printr-un abonament lunar.",
    sections: [
      {
        title: "Generare asistată",
        items: [
          "Brief unic transformat într-un plan și într-un website complet",
          "Agenți separați pentru planificare, dezvoltare, review și corecții",
          "Proiecte independente create cu repository Git și stare persistentă",
        ],
      },
      {
        title: "Control și automatizare",
        items: [
          "Dashboard local pentru creare, îmbunătățire și monitorizare",
          "Coadă persistentă cu maximum două operațiuni executate simultan",
          "Comenzi validate și execuție izolată în directoarele proiectelor",
        ],
      },
      {
        title: "QA integrat",
        items: [
          "Build, typecheck și teste rulate automat în flux",
          "Verificare Playwright pe desktop, tabletă și mobil",
          "Review structurat, corecții iterative și rapoarte de calitate",
        ],
      },
      {
        title: "Tehnologie",
        items: [
          "TypeScript, Node.js, Codex CLI și Playwright",
          "Vitest pentru testele orchestratorului și proceselor",
          "Dashboard responsive, configurare prin mediu și loguri locale",
        ],
      },
      {
        title: "Servicii și abonament",
        items: [
          "Primul an include absolut toate serviciile, fără niciun cost suplimentar",
          "În această perioadă sunt acoperite suportul, mentenanța și serviciile necesare operării platformei",
          "După primul an gratuit, serviciile continuă prin achitarea unui abonament lunar",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Codul sursă complet al platformei și dashboardului",
          "Fluxul multi-agent pentru generare, QA, review și îmbunătățire",
          "Documentație de instalare, configurare și operare locală",
        ],
      },
    ],
  },
  23: {
    summary:
      "Studio Velora este un website luxury multipagină pentru un studio de arhitectură și design interior cu prezență în București, Paris și Milano. Experiența combină portofoliul de reședințe cu servicii complete, conținut editorial și o poziționare premium coerentă.",
    sections: [
      {
        title: "Brand și experiență",
        items: [
          "Direcție vizuală luxury construită în jurul proporției, luminii și materialelor",
          "Hero cinematic cu trei imagini rotative și tranziții ambientale",
          "Mesaj editorial pentru reședințe premium și proiecte internaționale",
        ],
      },
      {
        title: "Portofoliu complet",
        items: [
          "Pagină dedicată proiectelor și rute dinamice pentru fiecare studiu de caz",
          "Galerii, locații, suprafețe și povești individuale pentru proiecte",
          "Selecție de proiecte prezentată direct pe pagina principală",
        ],
      },
      {
        title: "Servicii și autoritate",
        items: [
          "Arhitectură interioară, decorare, mobilier la comandă și art curation",
          "Pagini pentru studio, istorie, recenzii, servicii și întrebări frecvente",
          "Indicatori de experiență, premii, țări și proiecte finalizate",
        ],
      },
      {
        title: "Conținut și conversie",
        items: [
          "Jurnal editorial cu articole despre artă, materiale și iluminat",
          "Pagină de contact și trasee clare din proiecte și servicii",
          "Structură pregătită pentru conținut real și extinderea portofoliului",
        ],
      },
      {
        title: "Tehnologie și livrare",
        items: [
          "React 19, TypeScript, Vinext și Tailwind CSS",
          "Arhitectură multipagină, rute dinamice și componente reutilizabile",
          "Cod sursă complet și design responsive pentru toate ecranele",
        ],
      },
    ],
  },
  22: {
    summary:
      "Studio Forma este un website de design interior cu o identitate curajoasă și energică. Conceptul transformă portofoliul într-o experiență memorabilă prin contraste puternice, tipografie expresivă și un laborator cromatic interactiv.",
    sections: [
      {
        title: "Identitate și poziționare",
        items: [
          "Direcție vizuală neconvențională pentru interioare cu personalitate",
          "Hero manifest cu animație orbitală, portal vizual și ticker continuu",
          "Mesaj construit pentru clienți care caută spații expresive, nu soluții de catalog",
        ],
      },
      {
        title: "Proiecte și manifest",
        items: [
          "Portofoliu selectat pentru rezidențial, apartamente și HoReCa",
          "Prezentări ample cu imagini, locații și categorii",
          "Manifest de brand, rezultate și proces creativ în patru etape",
        ],
      },
      {
        title: "Laborator cromatic",
        items: [
          "Trei palete interactive: Acid Dream, Night Swim și Hot Clay",
          "Compoziție vizuală care se schimbă instant după selecția paletei",
          "Descrieri dinamice pentru atmosfera și energia fiecărei direcții",
        ],
      },
      {
        title: "Conversie",
        items: [
          "Formular interactiv pentru oraș, tipul spațiului și nivelul de curaj",
          "Mesaj de confirmare integrat după trimitere",
          "Trasee directe din navigație, proiecte și footer către contact",
        ],
      },
      {
        title: "Tehnologie și livrare",
        items: [
          "React 19, TypeScript, Vinext și Tailwind CSS",
          "Interacțiuni native, navigare mobilă și layout responsive",
          "Cod sursă complet, pregătit pentru branding, imagini și formulare reale",
        ],
      },
    ],
  },
  21: {
    summary:
      "NOMA este un website editorial pentru un atelier de design interior din Chișinău. Experiența pune în valoare spațiile calme, materialele tactile și procesul studioului, conducând vizitatorul natural de la inspirație la o cerere de proiect.",
    sections: [
      {
        title: "Poziționare și portofoliu",
        items: [
          "Identitate premium pentru un studio de design interior din Chișinău și Europa",
          "Portofoliu filtrabil pentru proiecte rezidențiale, apartamente și spații comerciale",
          "Prezentări editoriale cu locație, an și trasee directe spre contact",
        ],
      },
      {
        title: "Experiențe interactive",
        items: [
          "Comparație înainte și după controlată printr-un slider vizual",
          "Bibliotecă tactilă de materiale cu selecție și descrieri dinamice",
          "Oră locală și disponibilitate pentru proiecte actualizate automat",
        ],
      },
      {
        title: "Conținut și proces",
        items: [
          "Filosofia studioului, indicatori de experiență și proces în patru etape",
          "Jurnal editorial cu ghiduri, materiale și povești despre lumină",
          "Structură completă pentru servicii, proiecte și consolidarea brandului",
        ],
      },
      {
        title: "Conversie",
        items: [
          "Formular pentru cereri de proiect cu tipul spațiului și buget estimativ",
          "Mesaj de confirmare integrat după trimiterea cererii",
          "Date de contact și apeluri la acțiune distribuite în punctele-cheie",
        ],
      },
      {
        title: "Tehnologie și livrare",
        items: [
          "React 19, TypeScript, Vinext și Tailwind CSS",
          "Interfață responsive, navigare mobilă și componente interactive",
          "Cod sursă complet, pregătit pentru imagini proprii, formulare reale și publicare",
        ],
      },
    ],
  },
  20: {
    summary:
      "PopHaus este un concept store digital pentru un brand de mobilier contemporan cu personalitate. Catalogul trilingv combină shopping-ul clasic cu instrumente ludice care ajută clientul să-și descopere stilul și să compună o cameră completă.",
    sections: [
      {
        title: "Magazin și produse",
        items: [
          "Catalog cu 24 de obiecte, categorii, căutare și sortare după preț",
          "Pagini de produs cu galerie, materiale, dimensiuni, culori și disponibilitate",
          "Favorite, recomandări pentru completarea camerei și colecții editoriale",
        ],
      },
      {
        title: "Instrumente interactive",
        items: [
          "Room Mixer pentru combinarea produselor și schimbarea culorii pereților",
          "Moodboard persistent cu notițe, reordonare și export pentru print",
          "Quiz de stil cu recomandări personalizate și paletă cromatică",
        ],
      },
      {
        title: "Conținut și localizare",
        items: [
          "Română, rusă și engleză pe toate rutele importante",
          "Lookbook, blog, servicii, colaborări, FAQ și politici",
          "Formulare de contact și newsletter pregătite pentru Netlify Forms",
        ],
      },
      {
        title: "Tehnologie",
        items: [
          "React, TypeScript, Vinext și Framer Motion",
          "Zustand pentru favorite, cameră, moodboard și notițe persistente",
          "Next Intl, validare Zod și design responsive",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Cod sursă complet, catalog și imagini locale optimizate",
          "Toate experiențele interactive și structura trilingvă",
          "Bază pregătită pentru checkout, CMS, stocuri și plăți reale",
        ],
      },
    ],
  },
  19: {
    summary:
      "Nord & Oak este un magazin editorial dedicat mobilierului sustenabil și obiectelor construite pentru a rezista. Experiența conectează produsele cu materialele, artizanii, serviciile de reparație și povestea fiecărei piese.",
    sections: [
      {
        title: "Catalog responsabil",
        items: [
          "Catalog filtrabil cu mobilier din lemn, stoc și termene de livrare",
          "Pagini detaliate cu finisaje, caracteristici și cerere de ofertă",
          "Pașaport de produs cu proveniență, materiale și informații de întreținere",
        ],
      },
      {
        title: "Brand și conținut",
        items: [
          "Poveste vizuală despre traseul obiectului de la material la locuință",
          "Pagini pentru materiale, artizani, sustenabilitate și atelier",
          "Jurnal MDX localizat cu articole editoriale și ghiduri",
        ],
      },
      {
        title: "Servicii circulare",
        items: [
          "Fluxuri pentru reparații, preluarea mobilierului vechi și mentenanță",
          "Formulare validate pentru ofertă, contact și solicitări de service",
          "Conținut clar pentru garanție, livrare și programul profesional",
        ],
      },
      {
        title: "Tehnologie",
        items: [
          "Next.js, React, TypeScript, Tailwind CSS și Framer Motion",
          "Next Intl pentru română, rusă și engleză",
          "GSAP, MDX, React Hook Form și Zod",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Website multipagină complet și catalog editabil",
          "Sistem editorial, formulare și conținut localizat",
          "Structură pregătită pentru produse reale, CMS și integrare comercială",
        ],
      },
    ],
  },
  18: {
    summary:
      "Forma Living este o platformă digitală pentru mobilier modular, construită în jurul personalizării. Clienții pot explora catalogul, proiectele de interior și configura vizual canapele sau biblioteci adaptate spațiului lor.",
    sections: [
      {
        title: "Catalog modular",
        items: [
          "Catalog de produse cu filtre, camere și pagini detaliate",
          "Galerii cu imagini originale WebP, specificații și module disponibile",
          "Favorite persistente și recomandări pentru amenajare",
        ],
      },
      {
        title: "Configuratoare",
        items: [
          "Configurator dedicat canapelelor modulare",
          "Configurator pentru biblioteci și compoziții de depozitare",
          "Actualizarea vizuală a configurației, opțiunilor și estimării",
        ],
      },
      {
        title: "Experiență vizuală",
        items: [
          "Scene 3D cu React Three Fiber, Drei și Three.js",
          "Animații Framer Motion și interfață responsive",
          "Proiecte, ghiduri, camere și formulare pentru cereri de ofertă",
        ],
      },
      {
        title: "Tehnologie",
        items: [
          "Next.js 16, React 19 și TypeScript",
          "Zustand pentru configurator și favorite",
          "Next Intl, React Hook Form, Zod și Tailwind CSS",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Codul complet, imaginile originale și catalogul demonstrativ",
          "Două experiențe de configurare și structură trilingvă",
          "Bază pregătită pentru prețuri dinamice, comenzi și producție la comandă",
        ],
      },
    ],
  },
  17: {
    summary:
      "ArchiContract este o platformă B2B pentru producători și furnizori de mobilier contract. Organizează catalogul tehnic, proiectele de referință, selecțiile profesionale și cererile complexe de ofertă pentru arhitecți și echipe de achiziții.",
    sections: [
      {
        title: "Catalog profesional",
        items: [
          "Catalog filtrabil cu tabel avansat TanStack și vizualizare pe carduri",
          "Fișe de produs cu specificații, finisaje, prețuri orientative și documente",
          "Referințe CAD/BIM și mod de print pentru documentație",
        ],
      },
      {
        title: "Project Board",
        items: [
          "Selecție persistentă de produse pentru fiecare proiect",
          "Cantități, variante și estimarea totalului",
          "Transfer direct al selecției într-o cerere de ofertă",
        ],
      },
      {
        title: "Vânzare B2B",
        items: [
          "Flux RFQ în mai mulți pași cu validare",
          "Soluții dedicate pentru hoteluri și spații comerciale",
          "Studii de caz, resurse profesionale și formulare Netlify",
        ],
      },
      {
        title: "Tehnologie",
        items: [
          "Next.js, React, TypeScript și Tailwind CSS",
          "TanStack Table, Zustand, React Hook Form și Zod",
          "Next Intl și Framer Motion pentru experiență trilingvă",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Platformă B2B completă, catalog și Project Board",
          "Structură pentru produse, proiecte, resurse și cereri RFQ",
          "Bază extensibilă pentru CRM, ofertare automată și conturi profesionale",
        ],
      },
    ],
  },
  16: {
    summary:
      "Atelier Noire este un website editorial pentru un brand de mobilier premium. Direcția vizuală sofisticată pune în valoare colecțiile, obiectele, proiectele de interior și serviciile personalizate într-o experiență trilingvă.",
    sections: [
      {
        title: "Catalog premium",
        items: [
          "Catalog cu filtre, sortare și produse prezentate editorial",
          "Pagini individuale cu galerie, finisaje, dimensiuni și detalii de execuție",
          "Colecții tematice și recomandări de obiecte complementare",
        ],
      },
      {
        title: "Portofoliu și inspirație",
        items: [
          "Proiecte de interior cu poveste, galerie și produse utilizate",
          "Jurnal cu articole despre materiale, design și meșteșug",
          "Pagini dedicate atelierului, procesului și serviciilor",
        ],
      },
      {
        title: "Conversie",
        items: [
          "Cereri de ofertă și contact prin formulare validate",
          "Trasee clare din catalog, colecții și proiecte spre ofertare",
          "Formulare pregătite pentru Netlify cu protecție honeypot",
        ],
      },
      {
        title: "Tehnologie",
        items: [
          "Next.js, React, TypeScript strict și Tailwind CSS",
          "Framer Motion, Next Intl, React Hook Form și Zod",
          "Română, rusă și engleză, metadata și sitemap localizat",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Cod sursă complet, catalog, colecții, proiecte și jurnal",
          "Design responsive și conținut trilingv",
          "Bază pregătită pentru CMS, produse reale și integrarea unui CRM",
        ],
      },
    ],
  },
  15: {
    summary:
      "Market9000 este o platformă completă de anunțuri pentru piața din Moldova. Reunește catalogul public, conturile utilizatorilor, paginile companiilor și un panou amplu de administrare într-o aplicație pregătită pentru lansare și extindere.",
    demo: "https://market9000.netlify.app/",
    sections: [
      {
        title: "Ideea și publicul",
        items: [
          "Creat pentru marketplace-uri locale, portaluri de anunțuri și directoare comerciale",
          "Acoperă categorii precum imobiliare, auto, servicii, electronice și produse pentru casă",
          "Interfață familiară și rapidă, optimizată pentru publicarea și descoperirea ofertelor",
        ],
      },
      {
        title: "Catalog și anunțuri",
        items: [
          "Căutare, categorii, anunțuri VIP și rezultate filtrate",
          "Pagini individuale cu galerie, preț, descriere și date de contact",
          "Afișarea controlată a numărului de telefon și trasee clare spre vânzător",
          "Secțiuni dedicate companiilor verificate și serviciilor oferite",
        ],
      },
      {
        title: "Conturi și comunitate",
        items: [
          "Autentificare și înregistrare prin Firebase",
          "Profil personal cu istoric, favorite, mesaje și administrarea anunțurilor",
          "Statusuri de cont și protecție pe roluri pentru utilizatori și administratori",
          "Fluxuri pregătite pentru publicare, promovare și moderare",
        ],
      },
      {
        title: "Panou de administrare",
        items: [
          "Gestionarea anunțurilor, utilizatorilor, companiilor și categoriilor",
          "Administrarea taxelor, bannerelor, mesajelor, notificărilor și conținutului informativ",
          "Arhivare, moderare, căutare și navigare prin module operaționale",
          "Structură extensibilă pentru reclame, concursuri, widgeturi și feedback",
        ],
      },
      {
        title: "Tehnologie și livrare",
        items: [
          "Next.js 16, React 19 și TypeScript",
          "Firebase Authentication și infrastructură pregătită pentru date persistente",
          "Design responsive pentru telefon, tabletă și desktop",
          "Configurare Netlify și suită extinsă de teste Playwright",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Codul sursă complet și editabil",
          "Interfața publică, conturile utilizatorilor și panoul de administrare",
          "Structura pentru categorii, anunțuri, companii, promovări și conținut",
          "Bază pregătită pentru rebranding, integrarea plăților și lansare comercială",
        ],
      },
    ],
  },
  14: {
    summary:
      "NEO Barber Club este o experiență digitală premium pentru un barber shop contemporan din Chișinău. Site-ul combină prezentarea serviciilor, portofoliul vizual și o academie profesională într-o identitate cinematografică construită pentru poziționare și rezervări.",
    sections: [
      {
        title: "Ideea și poziționarea",
        items: [
          "Creat pentru barber shop-uri premium, studiouri de grooming și master barberi",
          "Identitate elegantă în tonuri espresso, auriu și champagne",
          "Mesaj editorial centrat pe precizie, ritual și stil personal",
          "Experiență de brand coerentă de la primul contact până la rezervare",
        ],
      },
      {
        title: "Servicii și conversie",
        items: [
          "Prezentare pentru Signature Cut, Cut & Beard Ritual, Royal Shave și Father & Son",
          "Tarif și beneficii afișate clar pentru fiecare serviciu",
          "Trasee directe către rezervare din navigație, hero și profilul barberului",
          "Integrare pregătită cu o platformă externă de programări",
        ],
      },
      {
        title: "Portofoliu și echipă",
        items: [
          "Galerie editorială pentru lucrări, stiluri și transformări",
          "Carduri animate pentru Modern Texture, Sharp Identity și Classic Refined",
          "Profil dedicat master barberului, specializări, rating și recenzii",
          "Program, adresă, contact și legături sociale integrate",
        ],
      },
      {
        title: "Academia NEO",
        items: [
          "Secțiune comercială separată pentru cursuri profesionale",
          "Program intensiv de șase săptămâni, 80% practică și grupe restrânse",
          "Poziționare potrivită atât pentru începători, cât și pentru module avansate",
          "Call-to-action dedicat programului academiei",
        ],
      },
      {
        title: "Experiență și tehnologie",
        items: [
          "Intro cinematografic cu animație de tăiere și tranziții premium",
          "Efecte de scroll, apariții animate și microinteracțiuni",
          "Meniu mobil fullscreen și layout complet responsive",
          "Next.js, React, TypeScript, Motion, GSAP, Tailwind CSS și Lucide Icons",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Codul sursă complet și editabil",
          "Design responsive, animații și toate secțiunile prezentate",
          "Conținut centralizat pentru servicii, tarife, lucrări și echipă",
          "Bază pregătită pentru rebranding, rezervări reale, mai mulți barberi și cursuri",
        ],
      },
    ],
  },
  12: {
    summary:
      "RentTech este o platformă full-stack pentru companii care închiriază utilaje și echipamente profesionale. Combină un catalog comercial rapid cu un panou securizat în care administratorul poate actualiza prețurile afișate clienților.",
    demo: "https://chirie-tehnica.netlify.app/",
    sections: [
      {
        title: "Ideea și publicul",
        items: [
          "Creat pentru firme de închiriere utilaje, echipamente de șantier și generatoare",
          "Prezintă oferta într-un format profesionist, cu tarife zilnice transparente",
          "Conectează rapid clientul cu echipa de vânzări prin solicitări și apel telefonic",
        ],
      },
      {
        title: "Catalogul public",
        items: [
          "Catalog cu excavatoare, nacele, compactoare, generatoare și echipamente de iluminat",
          "Filtrare după Construcții, Energie și Lucru la înălțime",
          "Căutare instant după denumirea utilajului",
          "Etichete de disponibilitate, specificații, tarif zilnic și opțiune de solicitare",
          "Secțiuni comerciale cu beneficii, statistici și procesul de închiriere în trei pași",
        ],
      },
      {
        title: "Administrare și date",
        items: [
          "Panou separat pentru catalog și prețuri",
          "Actualizarea tarifelor direct din interfața de administrare",
          "API REST pentru citirea și modificarea echipamentelor",
          "Persistență în Cloudflare D1 prin Drizzle ORM",
          "Date implicite de rezervă dacă baza de date nu este disponibilă",
        ],
      },
      {
        title: "Acces și tehnologie",
        items: [
          "Panou de administrare securizat",
          "Next.js, React și TypeScript",
          "Cloudflare D1, Drizzle ORM, Vinext și infrastructură Cloudflare",
          "Design responsive pentru telefon, tabletă și desktop",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Codul sursă complet pentru site, API și panoul de administrare",
          "Schema bazei de date și date demo pentru catalog",
          "Structură pregătită pentru branding, echipamente și tarife reale",
          "Bază extensibilă pentru rezervări, disponibilitate și plăți online",
        ],
      },
    ],
  },
  11: {
    summary:
      "Élan este un website premium care unește două direcții de business într-o singură experiență: serviciile unui studio de manichiură și vânzarea cursurilor printr-o academie profesională.",
    demo: "https://ellann.netlify.app/",
    sections: [
      {
        title: "Ideea și poziționarea",
        items: [
          "Potrivit pentru nail artiști, saloane premium și academii de beauty",
          "Identitate editorială elegantă, construită pentru diferențiere și încredere",
          "Prezintă experiența, rezultatele și standardele studioului într-un parcurs coerent",
        ],
      },
      {
        title: "Servicii pentru cliente",
        items: [
          "Prezentare pentru manichiură BIAB, gel și arhitectură, plus nail art editorial",
          "Durată, preț de pornire și descriere pentru fiecare serviciu",
          "Trasee clare către programare",
          "Programul, locația și datele necesare înaintea unei vizite",
        ],
      },
      {
        title: "Academie și cursuri",
        items: [
          "Oferte distincte pentru nivel începător, intermediar și avansat",
          "Durată, kit, certificat, dimensiunea grupei și preț pentru fiecare curs",
          "Secțiune dedicată metodei, siguranței și educației aplicate",
          "Indicatori de încredere, rezultate și testimonial",
        ],
      },
      {
        title: "Conversie și experiență",
        items: [
          "Formular interactiv pentru servicii, cursuri și solicitări personalizate",
          "Confirmare vizuală după trimiterea cererii",
          "Meniu responsive și navigare fluidă pe o singură pagină",
          "React, TypeScript, Vite și animații CSS",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Cod sursă complet și design responsive",
          "Structura pentru servicii, cursuri, poveste, testimonial și contact",
          "Conținut centralizat, simplu de personalizat",
          "Bază pregătită pentru integrarea unei programări online sau a unui CRM",
        ],
      },
    ],
  },
  10: {
    summary:
      "FIXORA Service OS este un sistem de management pentru ateliere auto. Centralizează activitatea zilnică, lucrările, programările, relația cu clienții, devizele, piesele, echipa și indicatorii financiari într-un singur dashboard.",
    demo: "https://fixora-service.netlify.app/",
    sections: [
      {
        title: "Ideea și publicul",
        items: [
          "Conceput pentru service-uri auto independente și rețele de ateliere",
          "Înlocuiește tabelele și evidența fragmentată cu un flux operațional unic",
          "Oferă managerului o imagine imediată asupra capacității și activității atelierului",
        ],
      },
      {
        title: "Centru de lucru",
        items: [
          "Dashboard cu programările zilei, mașinile în lucru și venitul estimat",
          "Flux vizual pentru fiecare comandă, client, vehicul, lucrare, mecanic și progres",
          "Filtrare după status și căutare după client sau mașină",
          "Alerte pentru devize, piese întârziate și clienți care trebuie notificați",
          "Agenda următoarelor programări și evidența automatizărilor active",
        ],
      },
      {
        title: "Module operaționale",
        items: [
          "Programări cu oră, vehicul, serviciu și status",
          "Clienți și mașini cu date de contact, ultima vizită și valoare totală",
          "Devize cu aprobare, facturare și valoare",
          "Stoc de piese cu prag minim, furnizor și alerte",
          "Echipă cu roluri, specializări, sarcini și eficiență",
        ],
      },
      {
        title: "Rapoarte și funcții",
        items: [
          "Venit lunar, marjă brută, valoare medie și clienți recurenți",
          "Grafic pentru evoluția veniturilor și clasamentul serviciilor profitabile",
          "Adăugare, căutare, vizualizare și ștergere de înregistrări",
          "Persistență locală a datelor și export CSV pentru fiecare modul",
          "Interfață responsive construită cu React, TypeScript și Vite",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Cod sursă complet pentru dashboard și toate modulele",
          "Date demo realiste și interacțiuni funcționale",
          "Arhitectură pregătită pentru conectarea la o bază de date și autentificare",
          "Bază solidă pentru notificări, facturare, plăți și aplicație pentru clienți",
        ],
      },
    ],
  },
  9: {
    summary:
      "Un calendar social colaborativ construit pentru oamenii care vor să transforme intențiile în momente petrecute împreună. iQ Calendar combină planificarea, rețeaua de parteneri și notificările într-o experiență simplă și personală.",
    demo: "https://iqcalendar.netlify.app/",
    sections: [
      {
        title: "Ideea și publicul",
        items: [
          "Potrivit pentru cupluri, familii, prieteni și grupuri mici",
          "Centralizează evenimentele comune și reduce discuțiile repetitive despre dată și oră",
          "Experiență personalizabilă, optimizată pentru telefon și desktop",
        ],
      },
      {
        title: "Planificare și calendar",
        items: [
          "Selectare vizuală a datei și orei",
          "Activități predefinite sau activitate personalizată",
          "Vizualizare calendar și listă, evenimente viitoare și arhivă",
          "Editarea, ștergerea și deschiderea directă a unui eveniment",
          "Mesaje, detalii și remindere configurabile pentru fiecare plan",
        ],
      },
      {
        title: "Colaborare socială",
        items: [
          "Profil personal cu nickname unic",
          "Cereri de parteneriat și listă de contacte",
          "Grupuri reutilizabile pentru invitații rapide",
          "Propuneri de modificare cu acceptare sau refuz",
          "Notificări în aplicație și remindere manuale către participanți",
        ],
      },
      {
        title: "Conturi și integrări",
        items: [
          "Autentificare Google prin Firebase Auth",
          "Firebase Realtime Database și Firebase Admin",
          "Notificări Telegram prin Telegram Bot API și scheduler dedicat",
          "Traduceri asistate prin DeepL API și Netlify Functions",
          "React, TypeScript și build modular cu Esbuild",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Codul sursă complet și editabil",
          "Structura pentru utilizatori, evenimente, parteneri, grupuri și notificări",
          "Configurarea integrărilor și fluxurilor automate",
          "Bază pregătită pentru branding, monetizare și extindere",
        ],
      },
    ],
  },
  8: {
    summary:
      "O platformă completă de Utility Management pentru asociații și comunități rezidențiale. Digitalizează colectarea indicilor, verificarea dovezilor, calculul consumului, datoriile, achitările și comunicarea cu locatarii.",
    demo: "https://colectarea.netlify.app/",
    sections: [
      {
        title: "Ideea și publicul",
        items: [
          "Creat pentru asociații locative, sectoare de vile și administratori de comunități",
          "Înlocuiește tabelele, mesajele dispersate și colectarea manuală a datelor",
          "Arhitectură multi-zonă pentru operarea mai multor comunități din același sistem",
        ],
      },
      {
        title: "Portalul consumatorului",
        items: [
          "Transmiterea lunară a indicilor de apă și energie",
          "Dovadă foto pentru fiecare citire",
          "Calcul automat al consumului și costurilor",
          "Situația achitărilor, datoriilor și contribuțiilor recurente",
          "Istoric de plăți, proiecte comunitare și mesaje",
          "Interfață în română, engleză și rusă",
        ],
      },
      {
        title: "Panoul administratorului",
        items: [
          "Aprobarea și gestionarea conturilor",
          "Verificarea citirilor și fotografiilor",
          "Configurarea tarifelor și înregistrarea achitărilor",
          "Administrarea proiectelor, cotizațiilor și taxelor pentru deșeuri",
          "Rapoarte financiare și statistici publice",
          "Mesagerie segmentată și hartă interactivă a consumatorilor",
        ],
      },
      {
        title: "Controlul sistemului",
        items: [
          "Rol separat de System Admin",
          "Crearea și administrarea zonelor",
          "Administratori dedicați pentru fiecare zonă",
          "Activarea funcțiilor prin feature flags",
          "Mutarea conturilor și administrarea drepturilor",
        ],
      },
      {
        title: "Tehnologie și automatizări",
        items: [
          "Next.js, React, TypeScript și Tailwind CSS",
          "Firebase Auth, Realtime Database, Storage și Firebase Admin",
          "Leaflet și OpenStreetMap pentru hartă",
          "Netlify Scheduled Functions pentru remindere automate",
          "Arhitectură securizată pe roluri și reguli Firebase",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Cod sursă complet pentru interfață și administrare",
          "Modele de date, reguli Firebase și scripturi de inițializare",
          "Fluxuri pentru consumatori, administratori și system admin",
          "Bază SaaS extensibilă pentru alte tipuri de utilități și comunități",
        ],
      },
    ],
  },
  7: {
    summary:
      "Un website premium pentru salon de frumusețe, construit ca experiență editorială și instrument de conversie. Micora pune serviciile, atmosfera și programarea în centrul unei identități vizuale rafinate.",
    demo: "https://micoraa.netlify.app/",
    sections: [
      {
        title: "Ideea și publicul",
        items: [
          "Potrivit pentru saloane de beauty, studiouri și specialiști independenți",
          "Poziționare premium prin design editorial și storytelling",
          "Conceput pentru a transforma vizitatorii în cereri de programare",
        ],
      },
      {
        title: "Pagini și conținut",
        items: [
          "Homepage animat cu prezentare memorabilă de brand",
          "Servicii interactive pentru păr, unghii, îngrijirea pielii și sprâncene",
          "Pagină dedicată poveștii și filosofiei salonului",
          "Galerie vizuală extinsă",
          "Contact, telefon, email și formular de programare",
        ],
      },
      {
        title: "Experiență și conversie",
        items: [
          "Română, rusă și engleză incluse",
          "Navigare responsive pentru telefon și desktop",
          "Animații premium și tranziții Framer Motion",
          "Conținut centralizat, ușor de personalizat",
          "Butoane și trasee clare către programare",
        ],
      },
      {
        title: "Tehnologie și livrare",
        items: [
          "Next.js, React și TypeScript",
          "Tailwind CSS, Framer Motion și Lucide Icons",
          "Imagistică Unsplash integrată",
          "Build compatibil Cloudflare/Vinext și Netlify",
          "SEO și imagine socială Open Graph personalizată",
        ],
      },
      {
        title: "Ce primește cumpărătorul",
        items: [
          "Codul sursă complet și editabil",
          "Design responsive și toate paginile prezentate",
          "Structură trilingvă pregătită pentru conținut real",
          "Bază rapidă pentru rebranding și lansarea unui salon",
        ],
      },
    ],
  },
};

function ProjectVisual({
  project,
  locale,
}: {
  project: (typeof projects)[number];
  locale: Locale;
}) {
  const v = visualCopy[locale];
  const s = showcaseCopy[locale];
  return (
    <div className={`visual visual-${project.tone}`}>
      {project.id === 26 && (
        <>
          <div className="nbook-brand">
            <b>N</b>
            <span>
              NEO BOOKING<small>{s.universalAppointments}</small>
            </span>
          </div>
          <div className="nbook-panel">
            <div className="nbook-steps">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <small>{s.step}</small>
            <strong>
              {s.chooseDate[0]}
              <br />
              <em>{s.chooseDate[1]}</em>
            </strong>
            <div className="nbook-days">
              <i>12</i>
              <i>13</i>
              <i>14</i>
              <i>15</i>
            </div>
            <div className="nbook-times">
              <span>10:00</span>
              <span>11:30</span>
              <span>14:00</span>
            </div>
          </div>
          <div className="nbook-live">
            <i /> {s.bookingLive}
          </div>
        </>
      )}
      {project.id === 25 && (
        <>
          <div className="arent-brand">
            <b>NEXA</b>
            <span>RENTAL</span>
          </div>
          <div className="arent-wave">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="arent-product">
            <i />
            <span>JBL</span>
            <b>PRX ONE</b>
          </div>
          <div className="arent-copy">
            <small>{s.inventoryAvailable}</small>
            <strong>
              {s.rentCycle[0]}
              <br />
              <em>{s.rentCycle[1]}</em>
              <br />
              {s.rentCycle[2]}
            </strong>
          </div>
          <div className="arent-stock">
            <i /> {s.units}
          </div>
        </>
      )}
      {project.id === 24 && (
        <>
          <div className="forge-brand">
            <b>F</b>
            <span>
              FORGE<small>AI WEBSITE FACTORY</small>
            </span>
          </div>
          <div className="forge-window">
            <div className="forge-sidebar">
              <i />
              <i />
              <i />
            </div>
            <div className="forge-main">
              <small>{s.newProject}</small>
              <strong>
                {s.buildCycle[0]}
                <br />
                <em>{s.buildCycle[1]}</em>
                <br />
                {s.buildCycle[2]}
              </strong>
              <div className="forge-progress">
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="forge-status">
              <i /> {s.systemActive}
            </div>
          </div>
        </>
      )}
      {project.id === 23 && (
        <>
          <div className="velora-brand">
            STUDIO <b>VELORA</b>
          </div>
          <div className="velora-portal">
            <i />
            <span>V</span>
          </div>
          <div className="velora-copy">
            <small>{s.veloraKicker}</small>
            <b>
              {s.veloraTitle[0]}
              <br />
              <em>{s.veloraTitle[1]}</em>
            </b>
          </div>
          <div className="velora-index">EST. 2012</div>
        </>
      )}
      {project.id === 22 && (
        <>
          <div className="sforma-brand">
            STUDIO<span> FORMA</span>
          </div>
          <div className="sforma-orbit">
            <i />
            <i />
            <b>F</b>
          </div>
          <div className="sforma-copy">
            <small>{s.formaKicker}</small>
            <b>
              {s.formaTitle[0]}
              <br />
              <em>{s.formaTitle[1]}</em>
            </b>
          </div>
          <div className="sforma-swatches">
            <i />
            <i />
            <i />
          </div>
        </>
      )}
      {project.id === 21 && (
        <>
          <div className="noma-brand">
            NOMA<sup>®</sup>
          </div>
          <div className="noma-arch">
            <i />
            <span>01</span>
          </div>
          <div className="noma-copy">
            <small>{s.nomaKicker}</small>
            <b>
              {s.nomaTitle[0]}
              <br />
              <em>{s.nomaTitle[1]}</em>
            </b>
          </div>
          <div className="noma-materials">
            <i />
            <i />
            <i />
          </div>
        </>
      )}
      {project.id === 20 && (
        <>
          <div className="pophaus-logo">
            POP<span>HAUS</span>
          </div>
          <div className="pophaus-orbit">
            <i />
            <i />
            <b>
              GOOD
              <br />
              MOOD
            </b>
          </div>
          <div className="pophaus-sofa">
            <i />
            <i />
            <span />
          </div>
          <div className="pophaus-copy">
            {s.mood[0]}
            <br />
            <b>{s.mood[1]}</b>
          </div>
        </>
      )}
      {project.id === 19 && (
        <>
          <div className="nord-logo">
            NORD <i>&</i> OAK
          </div>
          <div className="nord-arch">
            <span />
            <b>01</b>
          </div>
          <div className="nord-copy">
            <small>{s.nordKicker}</small>
            <strong>
              {s.nordTitle[0]}
              <br />
              <i>{s.nordTitle[1]}</i>
            </strong>
          </div>
          <div className="nord-seed">✶</div>
        </>
      )}
      {project.id === 18 && (
        <>
          <div className="forma-logo">
            FORMA <b>LIVING</b>
          </div>
          <div className="forma-room">
            <div className="forma-sofa">
              <i />
              <i />
              <i />
            </div>
            <span />
          </div>
          <div className="forma-tools">
            <i />
            <i />
            <i />
          </div>
          <div className="forma-label">{v.configurable}</div>
        </>
      )}
      {project.id === 17 && (
        <>
          <div className="archi-logo">
            ARCHI<span>CONTRACT</span>
          </div>
          <div className="archi-grid">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="archi-chair">
            <i />
            <i />
            <span />
          </div>
          <div className="archi-spec">
            <small>{s.projectSpec}</small>
            <b>AC—24</b>
            <em>{s.readyRfq}</em>
          </div>
        </>
      )}
      {project.id === 16 && (
        <>
          <div className="noire-logo">
            ATELIER <i>NOIRE</i>
          </div>
          <div className="noire-frame">
            <span />
            <i />
          </div>
          <div className="noire-copy">
            <small>{s.collection}</small>
            <b>
              {s.quietBeauty[0]}
              <br />
              {s.quietBeauty[1]}
            </b>
          </div>
          <div className="noire-number">N° 16</div>
        </>
      )}
      {project.id === 15 && (
        <>
          <div className="market-brand">
            <span>market</span>
            <b>9000</b>
          </div>
          <div className="market-search">
            {v.search}
            <i>⌕</i>
          </div>
          <div className="market-categories">
            <span>
              🏠<b>{v.estate}</b>
            </span>
            <span>
              🚗<b>{v.auto}</b>
            </span>
            <span>
              🛠️<b>{v.services}</b>
            </span>
            <span>
              📱<b>{v.electronics}</b>
            </span>
          </div>
          <div className="market-listing">
            <small>
              <i /> {v.active}
            </small>
            <strong>
              9K<sup>+</sup>
            </strong>
            <em>{v.opportunities}</em>
          </div>
          <div className="market-publish">{v.publish}</div>
        </>
      )}
      {project.id === 14 && (
        <>
          <div className="neo-mark">
            <b>NEO</b>
            <span>BARBER CLUB</span>
          </div>
          <div className="neo-blade">
            <i />
            <i />
            <span>
              {s.precision[0]}
              <br />
              {s.precision[1]}
            </span>
          </div>
          <div className="neo-service">
            <small>{s.signatureCut}</small>
          </div>
          <div className="neo-seal">
            EST.
            <br />
            <b>2026</b>
          </div>
        </>
      )}
      {(project.id === 26 || project.id === 24) && (
        <div className="coming-soon">
          <span>{v.coming}</span>
        </div>
      )}
      {project.id === 12 && (
        <>
          <div className="renttech-mark">
            RT <span>RENTTECH</span>
          </div>
          <div className="renttech-machine">🏗️</div>
          <div className="renttech-price">
            <small>{v.available}</small>
          </div>
          <div className="renttech-line" />
        </>
      )}
      {project.id === 11 && (
        <>
          <div className="elan-mark">
            ÉLAN<small>{s.nailStudio}</small>
          </div>
          <div className="elan-arch">
            <span>É</span>
          </div>
          <div className="elan-copy">
            {s.beautyCraft[0]}
            <br />
            <i>{s.beautyCraft[1]}</i>
          </div>
        </>
      )}
      {project.id === 10 && (
        <>
          <div className="fixora-mark">
            <b>F</b> FIXORA <small>{s.serviceOs}</small>
          </div>
          <div className="fixora-panel">
            <span>{v.capacity}</span>
            <strong>78%</strong>
            <i>
              <em />
            </i>
            <div>
              <b>12</b> {v.appointments} <b>6</b> {v.working}
            </div>
          </div>
          <div className="fixora-status">{s.liveOperations}</div>
        </>
      )}
      {project.id === 9 && (
        <>
          <div className="iq-brand">
            <b>iQ</b> Calendar
          </div>
          <div className="iq-window">
            <div className="iq-head">
              <span>{s.month}</span>
              <i>•••</i>
            </div>
            <div className="iq-week">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
            <div className="iq-days">
              {[
                10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
                26, 27, 28, 29, 30,
              ].map((day) => (
                <i
                  className={
                    day === 19 ? "selected" : day === 23 ? "event" : ""
                  }
                  key={day}
                >
                  {day}
                </i>
              ))}
            </div>
            <div className="iq-event">
              <span>18:30</span>
              <b>{v.dinner}</b>
              <small>{v.participants}</small>
            </div>
          </div>
          <div className="iq-float">♥ +3</div>
          <div className="iq-badge">{v.connect}</div>
        </>
      )}
      {project.id === 8 && (
        <>
          <div className="contor-brand">◉ CONTOR ACASĂ</div>
          <div className="contor-ui">
            <div className="contor-side">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="contor-main">
              <small>{v.hello}</small>
              <div className="contor-bars">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="contor-card">
              <b>500K+</b>
              <span>{v.consumers}</span>
            </div>
          </div>
          <div className="contor-badge">{v.roles}</div>
        </>
      )}
      {project.id === 7 && (
        <img
          className="micora-cover"
          src="/projects/micora-cover.png"
          alt={`${project.title} — ${localDescription(project.id, project.desc, locale)}`}
        />
      )}
      <div className="visual-top">
        <span>{localType(project.type, locale)}</span>
      </div>
      {project.id === 1 && (
        <>
          <div className="orb" />
          <div className="nexus-word">NEXUS</div>
          <div className="mini-pill">AI POWERED WORKSPACE</div>
        </>
      )}
      {project.id === 2 && (
        <>
          <div className="arch-shape" />
          <div className="arch-copy">
            FORM
            <br />
            FOLLOWS
            <br />
            <i>feeling.</i>
          </div>
        </>
      )}
      {project.id === 3 && (
        <>
          <div className="pulse-circle">P</div>
          <div className="pulse-copy">
            MOVE
            <br />
            DIFFERENT.
          </div>
        </>
      )}
      {project.id === 4 && (
        <>
          <div className="chart">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="chart-stat">
            +24.8%<small> GROWTH</small>
          </div>
        </>
      )}
      {project.id === 5 && (
        <>
          <div className="moon" />
          <div className="night-copy">
            NOCTURNE
            <br />
            <i>after dark</i>
          </div>
        </>
      )}
      {project.id === 6 && (
        <>
          <div className="kinetic-ring" />
          <div className="kinetic-copy">
            BREATHE.
            <br />
            MOVE. LIVE.
          </div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const categoryMenuRef = useRef<HTMLDetailsElement>(null);
  const sortMenuRef = useRef<HTMLDetailsElement>(null);
  const filterRowRef = useRef<HTMLDivElement>(null);
  const filterMeasureRef = useRef<HTMLDivElement>(null);
  const [visibleFilterCount, setVisibleFilterCount] = useState(6);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [menu, setMenu] = useState(false);
  const [locale, setLocale] = useState<Locale>("ro");
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(
    null,
  );
  const c = copy[locale];
  const fc = cleanFilterCopy[locale];
  const sortOptions = [
    { value: "newest", label: fc.sort },
    { value: "low", label: fc.low },
    { value: "high", label: fc.high },
  ];
  const selectedSortLabel = sortOptions.find((option) => option.value === sort)?.label ?? fc.sort;
  const listedProjects = projects.filter(
    (project) => !hiddenCategories.has(project.type),
  );
  const sortedFilters = [
    filters[0],
    ...filters
      .slice(1)
      .filter((filter) => !hiddenCategories.has(filter))
      .sort((a, b) =>
        localType(a, locale).localeCompare(localType(b, locale), locale, {
          sensitivity: "base",
        }),
      ),
  ];
  const primaryFilters = sortedFilters.slice(0, visibleFilterCount);
  const secondaryFilters = sortedFilters.slice(visibleFilterCount);
  const activeSecondaryFilters = secondaryFilters.filter((filter) =>
    activeCategories.includes(filter),
  );
  const categoryLimitReached = activeCategories.length >= 3;
  const isCategoryActive = (filter: string) =>
    filter === "Toate"
      ? activeCategories.length === 0
      : activeCategories.includes(filter);
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const visible = listedProjects
    .filter(
      (project) =>
        activeCategories.length === 0 || activeCategories.includes(project.type),
    )
    .filter((project) => {
      if (!normalizedQuery) return true;
      return [
        project.title,
        localType(project.type, locale),
        localDescription(project.id, project.desc, locale),
        ...project.stack,
      ]
        .join(" ")
        .toLocaleLowerCase(locale)
        .includes(normalizedQuery);
    })
    .toSorted((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : b.id - a.id,
    );
  const categoryCount = (filter: string) =>
    filter === "Toate"
      ? listedProjects.length
      : listedProjects.filter((project) => project.type === filter).length;
  const contactHref = locale === "ro" ? "/contact" : `/contact?lang=${locale}`;
  const selectedDetail = selected
    ? locale === "ro"
      ? projectDetails[selected.id]
      : localizedDetail(locale, selected)
    : null;
  useEffect(() => {
    const syncFromUrl = () => {
      const url = new URL(window.location.href);
      const categorySlugsFromUrl = url.searchParams.getAll("categorie").slice(0, 3);
      const projectSlug = url.searchParams.get("proiect");
      const urlLocale = url.searchParams.get("lang");
      const categories = categorySlugsFromUrl
        .map(
          (slug) =>
            Object.entries(categorySlugs).find(([, value]) => value === slug)?.[0],
        )
        .filter((category): category is string => Boolean(category));
      const projectId = Object.entries(projectSlugs).find(
        ([, value]) => value === projectSlug,
      )?.[0];
      setActiveCategories([...new Set(categories)]);
      setSelected(
        projectId
          ? (projects.find((project) => project.id === Number(projectId)) ??
              null)
          : null,
      );
      const savedLocale = localStorage.getItem("mono-locale");
      const nextLocale = locales.includes(urlLocale as Locale)
        ? (urlLocale as Locale)
        : locales.includes(savedLocale as Locale)
          ? (savedLocale as Locale)
          : "ro";
      setLocale(nextLocale);
      document.documentElement.lang = nextLocale;
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useLayoutEffect(() => {
    const row = filterRowRef.current;
    const measure = filterMeasureRef.current;
    if (!row || !measure) return;

    const calculateVisibleFilters = () => {
      const widths = Array.from(
        measure.children,
        (element) => (element as HTMLElement).getBoundingClientRect().width,
      );
      const gap = 8;
      const rowsNeeded = (itemWidths: number[], availableWidth: number) => {
        let line = 1;
        let usedWidth = 0;
        for (const width of itemWidths) {
          if (usedWidth > 0 && usedWidth + gap + width > availableWidth) {
            line += 1;
            usedWidth = 0;
          }
          usedWidth = usedWidth ? usedWidth + gap + width : width;
        }
        return line;
      };

      let nextCount = filters.length;
      if (rowsNeeded(widths, row.clientWidth) > 2) {
        const moreWidth =
          categoryMenuRef.current?.getBoundingClientRect().width ?? 150;
        nextCount = 1;
        for (let count = filters.length - 1; count >= 1; count -= 1) {
          if (
            rowsNeeded(
              [...widths.slice(0, count), moreWidth],
              row.clientWidth,
            ) <= 2
          ) {
            nextCount = count;
            break;
          }
        }
      }
      setVisibleFilterCount((current) =>
        current === nextCount ? current : nextCount,
      );
    };

    calculateVisibleFilters();
    const observer = new ResizeObserver(calculateVisibleFilters);
    observer.observe(row);
    return () => observer.disconnect();
  }, [locale]);
  useEffect(() => {
    const closeDropdowns = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      [categoryMenuRef.current, sortMenuRef.current].forEach((details) => {
        if (details?.open && !details.contains(event.target)) details.removeAttribute("open");
      });
    };
    const closeDropdownsWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        categoryMenuRef.current?.removeAttribute("open");
        sortMenuRef.current?.removeAttribute("open");
      }
    };
    document.addEventListener("pointerdown", closeDropdowns);
    document.addEventListener("keydown", closeDropdownsWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeDropdowns);
      document.removeEventListener("keydown", closeDropdownsWithEscape);
    };
  }, []);
  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    localStorage.setItem("mono-locale", nextLocale);
    const url = new URL(window.location.href);
    if (nextLocale === "ro") url.searchParams.delete("lang");
    else url.searchParams.set("lang", nextLocale);
    window.history.replaceState({}, "", url);
  };
  const selectCategory = (category: string) => {
    const nextCategories =
      category === "Toate"
        ? []
        : activeCategories.includes(category)
          ? activeCategories.filter((item) => item !== category)
          : categoryLimitReached
            ? activeCategories
            : [...activeCategories, category];
    setActiveCategories(nextCategories);
    const url = new URL(window.location.href);
    url.searchParams.delete("categorie");
    nextCategories.forEach((item) =>
      url.searchParams.append("categorie", categorySlugs[item]),
    );
    url.hash = "proiecte";
    window.history.pushState({}, "", url);
  };
  const openProject = (project: (typeof projects)[number]) => {
    setSelected(project);
    const url = new URL(window.location.href);
    url.searchParams.set("proiect", projectSlugs[project.id]);
    url.hash = "proiecte";
    window.history.pushState({}, "", url);
  };
  const closeProject = () => {
    setSelected(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("proiect");
    window.history.replaceState({}, "", url);
  };
  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0)
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSelected(null);
      const url = new URL(window.location.href);
      url.searchParams.delete("proiect");
      window.history.replaceState({}, "", url);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);
  return (
    <main>
      <div className="edge-rail edge-rail-left code-rail" aria-hidden="true">
        <div className="code-grid" />
        <div className="code-stream">
          {[0, 1].map((copyIndex) => (
            <div className="code-stream-loop" key={copyIndex}>
              <span>
                <b>const</b> idea = <em>&quot;bold&quot;</em>;
              </span>
              <span>
                <b>while</b> (curious) build();
              </span>
              <span>
                <i>&lt;Launch</i> ready=<em>true</em> /&gt;
              </span>
              <span>
                git commit -m <em>&quot;ship&quot;</em>
              </span>
            </div>
          ))}
        </div>
        <div className="code-core">
          <i>{`{`}</i>
          <span>&lt;/&gt;</span>
          <i>{`}`}</i>
        </div>
        <div className="terminal-chip">
          <b>●</b>
          <span>BUILDING</span>
          <i>_</i>
        </div>
      </div>
      <div className="edge-rail edge-rail-right code-rail" aria-hidden="true">
        <div className="code-grid" />
        <div className="binary-rain">
          <span>
            01001101
            <br />
            11001010
            <br />
            00110101
            <br />
            10100110
          </span>
          <span>
            10110100
            <br />
            00101101
            <br />
            11010010
            <br />
            01011001
          </span>
          <span>
            01101001
            <br />
            10010110
            <br />
            01001101
            <br />
            11100010
          </span>
        </div>
        <div className="git-branch">
          <i />
          <i />
          <i />
          <i />
          <span>main</span>
          <b>HEAD</b>
        </div>
        <div className="deploy-chip">
          <i />
          DEPLOYED <b>200</b>
        </div>
      </div>
      <nav className="nav shell">
        <a className="logo" href="#top">
          M<span>O</span>NO/DEV
        </a>
        <div className="nav-links">
          <a href="#proiecte">{c.nav[0]}</a>
          <a href="#proces">{c.nav[1]}</a>
          <a href={contactHref}>{c.nav[2]}</a>
        </div>
        <div className="language-switch" aria-label={c.language}>
          {locales.map((language) => (
            <button
              key={language}
              className={locale === language ? "active" : ""}
              onClick={() => changeLocale(language)}
              lang={language}
            >
              {language.toUpperCase()}
            </button>
          ))}
        </div>
        <a className="nav-cta" href={contactHref}>
          <ShoppingBag size={16} /> {c.buyProject}
        </a>
        <button
          className="menu-btn"
          onClick={() => setMenu(!menu)}
          aria-label={c.openMenu}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </nav>
      <AnimatePresence>
        {menu && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <a href="#proiecte" onClick={() => setMenu(false)}>
              {c.nav[0]}
            </a>
            <a href="#proces" onClick={() => setMenu(false)}>
              {c.nav[1]}
            </a>
            <a href={contactHref} onClick={() => setMenu(false)}>
              {c.nav[2]}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <section className="hero shell" id="top">
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span /> {c.eyebrow}
        </motion.div>
        <motion.p
          className="hero-intro-copy"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {c.heroText}
        </motion.p>
        <div className="hero-code-backdrop" aria-hidden="true">
          <div className="hero-code-glow" />
          <div className="hero-code-matrix">
            <span>101101</span><span>011010</span><span>110001</span><span>001101</span>
            <span>010110</span><span>100101</span><span>111000</span><span>001011</span>
          </div>
          <div className="hero-quantum-core">
            <div className="quantum-rings"><i /><i /><i /></div>
            <div className="quantum-center"><span>AI</span><b>ONLINE</b></div>
            <em>01</em><em>10</em><em>11</em>
          </div>
          <div className="hero-code-ribbon ribbon-one">
            <span>DESIGN</span><b>→</b><span>BUILD</span><b>→</b><span>LAUNCH</span>
          </div>
          <div className="hero-code-ribbon ribbon-two">
            <span>REACT</span><b>+</b><span>AI</span><b>+</b><span>IMAGINATION</span>
          </div>
          <div className="hero-code-window">
            <div className="hero-code-bar">
              <span><i /><i /><i /></span>
              <b>mono-dev / launch.ts</b>
              <em>⌁</em>
            </div>
            <div className="hero-code-lines">
              <span><b>01</b><code><i>const</i> idea = <em>&quot;viitor&quot;</em>;</code></span>
              <span><b>02</b><code><i>await</i> build(idea);</code></span>
              <span><b>03</b><code>design.<strong>push</strong>(<em>&quot;wow&quot;</em>);</code></span>
              <span><b>04</b><code><i>if</i> (ready) launch();</code></span>
              <span><b>05</b><code>status = <em>&quot;ONLINE&quot;</em>;</code></span>
            </div>
            <div className="hero-code-status">
              <span><i /> LIVE</span>
              <b>BUILD 100%</b>
            </div>
          </div>
          <div className="hero-code-orbit"><span>{`{ }`}</span><i /><i /><i /></div>
          <div className="hero-code-particles">
            {Array.from({ length: 14 }, (_, index) => <i key={index} />)}
          </div>
        </div>
        <motion.h1 className="hero-title" initial="hidden" animate="visible">
          <motion.span
            className="hero-title-line"
            variants={{
              hidden: { opacity: 0, y: 70, rotateX: -18, filter: "blur(12px)" },
              visible: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {c.heroA}
          </motion.span>
          <motion.span
            className="hero-title-line hero-title-accent"
            variants={{
              hidden: { opacity: 0, y: 82, rotateX: -20, filter: "blur(14px)" },
              visible: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <em>{c.heroB}</em>
          </motion.span>
        </motion.h1>
        <div className="marquee">
          <div>
            {c.marquee[0]} <Sparkles /> {c.marquee[1]} <Zap /> {c.marquee[2]}{" "}
            <Sparkles /> {c.marquee[0]} <Zap /> {c.marquee[1]} <Sparkles />{" "}
            {c.marquee[2]}
          </div>
        </div>
      </section>
      <section className="projects shell" id="proiecte">
        <div className="section-head">
          <div>
            <span className="kicker">{c.catalog}</span>
            <h2>
              {c.chooseA}
              <br />
              {c.chooseB} <i>{c.chooseC}</i>
            </h2>
          </div>
          <div className="count">
            {String(visible.length).padStart(2, "0")}
            <span>
              {c.projectsAvailable[0]}
              <br />
              {c.projectsAvailable[1]}
            </span>
          </div>
        </div>
        <div className="filter-toolbar">
          <label className="project-search">
            <Search size={18} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={fc.search}
              aria-label={fc.search}
            />
          </label>
          <details ref={sortMenuRef} className="project-sort">
            <summary aria-label={fc.sort}>
              <span>{selectedSortLabel}</span>
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <div className="filter-menu sort-menu">
              {sortOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={sort === option.value ? "active" : ""}
                  aria-pressed={sort === option.value}
                  onClick={(event) => {
                    setSort(option.value);
                    event.currentTarget.closest("details")?.removeAttribute("open");
                  }}
                >
                  <span>{option.label}</span>
                  {sort === option.value && <Check size={15} aria-hidden="true" />}
                </button>
              ))}
            </div>
          </details>
        </div>
        <div ref={filterRowRef} className="filter-row">
          <div
            ref={filterMeasureRef}
            className="filters primary-filters filter-measure"
            aria-hidden="true"
          >
            {sortedFilters.map((filter) => (
              <button key={filter} tabIndex={-1}>
                {filter === "Toate" ? c.all : localType(filter, locale)}{" "}
                <span>{categoryCount(filter)}</span>
              </button>
            ))}
          </div>
          <div className="filters primary-filters">
            {primaryFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => selectCategory(filter)}
                className={isCategoryActive(filter) ? "active" : ""}
                disabled={
                  filter !== "Toate" &&
                  categoryLimitReached &&
                  !activeCategories.includes(filter)
                }
              >
                {filter === "Toate" ? c.all : localType(filter, locale)}{" "}
                <span>{categoryCount(filter)}</span>
              </button>
            ))}
          </div>
          {secondaryFilters.length > 0 && (
            <details ref={categoryMenuRef} className="filter-more">
              <summary
                className={activeSecondaryFilters.length > 0 ? "active" : ""}
              >
                <span className="filter-more-label">
                  {activeSecondaryFilters.length === 1
                    ? localType(activeSecondaryFilters[0], locale)
                    : fc.categories}
                </span>
                <b aria-hidden="true">
                  {activeSecondaryFilters.length > 0
                    ? `${activeSecondaryFilters.length}/3`
                    : `+${secondaryFilters.length}`}
                </b>
                <ChevronDown size={15} aria-hidden="true" />
              </summary>
              <div className="filter-menu">
                {secondaryFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      selectCategory(filter);
                    }}
                    className={isCategoryActive(filter) ? "active" : ""}
                    disabled={
                      categoryLimitReached && !activeCategories.includes(filter)
                    }
                  >
                    <span>{localType(filter, locale)}</span>
                    <b>{categoryCount(filter)}</b>
                  </button>
                ))}
              </div>
            </details>
          )}
        </div>
        <motion.div layout className="grid">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.article
                layout
                key={project.id}
                className="card"
                role="button"
                tabIndex={0}
                aria-label={`${c.viewDetails} ${project.title}`}
                onClick={() => openProject(project)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openProject(project);
                  }
                }}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
              >
                <ProjectVisual project={project} locale={locale} />
                <div className="card-info">
                  <div>
                    <span className="type">
                      {localType(project.type, locale)}
                    </span>
                    <h3>{project.title}</h3>
                    <p>{localDescription(project.id, project.desc, locale)}</p>
                  </div>
                  <div className="price">
                    <small>{c.from}</small>€{project.price}
                  </div>
                </div>
                <div className="tags">
                  {project.stack.map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
        {!visible.length && <p className="projects-empty">{fc.empty}</p>}
      </section>
      <section className="process" id="proces">
        <div className="shell">
          <span className="kicker light">{c.processKicker}</span>
          <h2>
            {c.processA}
            <br />
            {c.processB} <i>{c.processC}</i>
          </h2>
          <div className="steps">
            {c.steps.map(([title, description], index) => (
              <div className="step" key={title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="why shell">
        <div className="why-main">
          <span className="kicker">{c.whyKicker}</span>
          <h2>
            {c.whyA}
            <br />
            {c.whyB} <i>{c.whyC}</i>
          </h2>
          <p>{c.whyText}</p>
          <a href="mailto:monodev@gmail.com">
            {c.talk} <ArrowRight size={18} />
          </a>
        </div>
        <div className="metrics">
          <div>
            <strong>100%</strong>
            <span>
              {c.metrics[0][0]}
              <br />
              {c.metrics[0][1]}
            </span>
          </div>
          <div>
            <strong>12H</strong>
            <span>
              {c.metrics[1][0]}
              <br />
              {c.metrics[1][1]}
            </span>
          </div>
          <div>
            <strong>30</strong>
            <span>
              {c.metrics[2][0]}
              <br />
              {c.metrics[2][1]}
            </span>
          </div>
        </div>
      </section>
      <footer>
        <div className="shell footer-main">
          <a className="footer-brand" href="#top" aria-label="MONO/DEV">
            M<span>O</span>NO/DEV
          </a>
          <nav className="footer-actions" aria-label={c.footer.navigation}>
            <a href="#proiecte">{c.footer.projects}</a>
            <a href="mailto:monodev@gmail.com">{c.footer.email}</a>
            <a className="footer-cta" href={contactHref}>
              {c.footer.contact}
              <ArrowRight />
            </a>
          </nav>
        </div>
        <div className="shell footer-bottom">
          <p>{c.footer.legal}</p>
          <span>© 2026 MONO/DEV</span>
        </div>
      </footer>
      <AnimatePresence>
        {selected && selectedDetail && (
          <motion.div
            className="modal-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProject}
          >
            <motion.div
              className="modal modal-detailed"
              initial={{ y: 30, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={closeProject}
                aria-label={c.close}
              >
                <X />
              </button>
              <ProjectVisual project={selected} locale={locale} />
              <div className="modal-content">
                <span className="kicker">
                  {localType(selected.type, locale)} / {c.fullLicense}
                </span>
                <div className="modal-title-row">
                  <h2>{selected.title}</h2>
                  <div className="modal-price">
                    <small>{c.fullPrice}</small>€{selected.price}
                  </div>
                </div>
                <p className="modal-summary">{selectedDetail.summary}</p>
                <div className="detail-sections">
                  {selectedDetail.sections.map((section) => (
                    <section key={section.title}>
                      <h3>{section.title}</h3>
                      <ul>
                        {section.items.map((item) => (
                          <li key={item}>
                            <Check />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
                <div className="modal-actions">
                  {unavailableProjectIds.has(selected.id) ? (
                    <button
                      type="button"
                      className="demo-link-disabled"
                      disabled
                    >
                      {c.openProject} · {visualCopy[locale].coming}
                    </button>
                  ) : projectPaths[selected.id] ? (
                    <a className="demo-link" href={projectPaths[selected.id]}>
                      {c.openProject} <ExternalLink />
                    </a>
                  ) : "demo" in selectedDetail && selectedDetail.demo ? (
                    <a
                      className="demo-link"
                      href={selectedDetail.demo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {c.openProject} <ExternalLink />
                    </a>
                  ) : null}
                  <a className="buy-link" href={contactHref}>
                    {c.buyFor} €{selected.price} <ArrowRight />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
