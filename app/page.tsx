"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  Gamepad2,
  Menu,
  Monitor,
  Smartphone,
  Search,
  ShoppingBag,
  Sparkles,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { StaticProjectPreview } from "./live-project-preview";
import { BrandLogo } from "./brand-logo";
import { newProjectDetails } from "./new-project-details";
import { newProjectTranslations } from "./new-project-translations";
import projectPrices from "./project-prices.json";
import { gardenProjects } from "./garden-projects";
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

type Platform = "web" | "mobile" | "games";
type MobileOS = "all" | "android" | "ios";
type PaymentMode = "installments" | "rental";
type RentalServiceTier = "with-services" | "without-services";
type Project = {
  id: number; title: string; type: string; price: number; tone: string;
  desc: string; stack: string[]; platform?: Platform;
  mobileOS?: ("android" | "ios")[];
};
const platformCopy = {
  ro: {"label":"Alege platforma","web":"Proiecte Web","mobile":"Aplica\u021bii Mobile","webDesc":"Site-uri, magazine online \u0219i platforme web","mobileDesc":"Aplica\u021bii pentru Android \u0219i iOS","soon":"\u00cen cur\u00e2nd","all":"Toate","empty":"Urm\u0103toarea idee \u00eencape \u00een buzunar.","detail":"Proiectele mobile pentru Android \u0219i iOS vor ap\u0103rea aici. Ai deja o idee de aplica\u021bie? Hai s\u0103 o discut\u0103m.","contact":"Discut\u0103m aplica\u021bia ta","available":"proiecte","os":"Sistem de operare"},
  en: { label: "Choose a platform", web: "Web Projects", mobile: "Mobile Apps", webDesc: "Websites, online stores and web platforms", mobileDesc: "Apps for Android and iOS", soon: "Coming soon", all: "All", empty: "Your next idea fits in your pocket.", detail: "Mobile projects for Android and iOS will appear here. Already have an app idea? Let's talk.", contact: "Let's discuss your app", available: "projects", os: "Operating system" },
  ru: {"label":"\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0443","web":"\u0412\u0435\u0431-\u043f\u0440\u043e\u0435\u043a\u0442\u044b","mobile":"\u041c\u043e\u0431\u0438\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f","webDesc":"\u0421\u0430\u0439\u0442\u044b, \u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043c\u0430\u0433\u0430\u0437\u0438\u043d\u044b \u0438 \u0432\u0435\u0431-\u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u044b","mobileDesc":"\u041f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u0434\u043b\u044f Android \u0438 iOS","soon":"\u0421\u043a\u043e\u0440\u043e","all":"\u0412\u0441\u0435","empty":"\u0412\u0430\u0448\u0430 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0430\u044f \u0438\u0434\u0435\u044f \u2014 \u0432 \u043a\u0430\u0440\u043c\u0430\u043d\u0435.","detail":"\u0417\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043c\u043e\u0431\u0438\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b \u0434\u043b\u044f Android \u0438 iOS. \u0423\u0436\u0435 \u0435\u0441\u0442\u044c \u0438\u0434\u0435\u044f \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f? \u0414\u0430\u0432\u0430\u0439\u0442\u0435 \u043e\u0431\u0441\u0443\u0434\u0438\u043c.","contact":"\u041e\u0431\u0441\u0443\u0434\u0438\u0442\u044c \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435","available":"\u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432","os":"\u041e\u043f\u0435\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u0430"},
};
const monthlyRentalPrice = (price: number) => Number((price / 18).toFixed(2));
const annualInstallmentPrice = (price: number) => Math.ceil(price / 12 / 5) * 5;
const installmentPlans = [
  { months: 3, surcharge: 0 },
  { months: 6, surcharge: 0.05 },
  { months: 12, surcharge: 0.08 },
] as const;
const gamesPlatformCopy = {
  ro: { empty: "Următorul tău joc începe aici.", detail: "Jocurile pentru Android și iOS vor apărea aici. Ai o idee de joc? Hai să o discutăm.", contact: "Discutăm jocul tău", collection: "GAME COLLECTION", caption: "SMALL SCREEN. BIG ADVENTURES." },
  en: { empty: "Your next game starts here.", detail: "Games for Android and iOS will appear here. Already have a game idea? Let's talk.", contact: "Let's discuss your game", collection: "GAME COLLECTION", caption: "SMALL SCREEN. BIG ADVENTURES." },
  ru: { empty: "Ваша следующая игра начинается здесь.", detail: "Здесь появятся игры для Android и iOS. Уже есть идея игры? Давайте обсудим.", contact: "Обсудить вашу игру", collection: "GAME COLLECTION", caption: "SMALL SCREEN. BIG ADVENTURES." },
};
const platformLabels: Record<Platform, { title: string; description: string; devices: string }> = {
  web: { title: "WEB", description: "Site-uri, magazine online și platforme web", devices: "WEB / BROWSER" },
  mobile: { title: "MOBILE", description: "Aplicații pentru Android și iOS", devices: "ANDROID / iOS" },
  games: { title: "JOCURI", description: "Jocuri pentru Android și iOS", devices: "ANDROID / iOS" },
};
const projectCatalog: Project[] = [
  ...gardenProjects.map((project) => ({
    id: project.id,
    title: project.title,
    type: "Gardens & Landscaping",
    price: project.price,
    tone: project.slug,
    desc: project.copy.ro.description,
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "React Hook Form", "Zod"],
  })),
  {
    id: 66,
    title: "EVENTORA",
    type: "Calendar & Events",
    price: 650,
    tone: "eventora",
    desc: "Afișe de concerte și catalog de bilete.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 65,
    title: "SCENA CITY",
    type: "Calendar & Events",
    price: 650,
    tone: "scena-city",
    desc: "Ghid cultural editorial cu agendă cronologică.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 64,
    title: "PULSE TICKETS",
    type: "Calendar & Events",
    price: 650,
    tone: "pulse-tickets",
    desc: "Consolă pentru organizatori și registru de participanți.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 63,
    title: "CLINICA NOVA",
    type: "Clinics & Medical",
    price: 950,
    tone: "clinica-nova",
    desc: "Prezentare de clinică, specialități și echipă.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 62,
    title: "LABORIS",
    type: "Clinics & Medical",
    price: 950,
    tone: "laboris",
    desc: "Catalog de analize cu listă de recoltare.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 61,
    title: "DOCTOR APROAPE",
    type: "Clinics & Medical",
    price: 950,
    tone: "doctor-aproape",
    desc: "Director de medici cu disponibilitate pe zile.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 60,
    title: "MEDSLOT",
    type: "Clinics & Medical",
    price: 950,
    tone: "med-slot",
    desc: "Selecție ghidată de consultații în trei pași.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 59,
    title: "LEADPILOT",
    type: "CRM & Sales",
    price: 1200,
    tone: "lead-pilot",
    desc: "Panou de oportunități pe etape comerciale.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 58,
    title: "GROWTHDESK",
    type: "CRM & Sales",
    price: 1200,
    tone: "growth-desk",
    desc: "Bază de contacte și segmentare pentru marketing.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 57,
    title: "CLOSEFLOW",
    type: "CRM & Sales",
    price: 1200,
    tone: "closeflow",
    desc: "Inbox comercial cu conversații și fișe de contact.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 56,
    title: "PARTMATCH",
    type: "E-commerce & Auto",
    price: 850,
    tone: "partmatch",
    desc: "Magazin de piese cu selecție dependentă de vehicul.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 55,
    title: "GARAGEBOX",
    type: "E-commerce & Auto",
    price: 850,
    tone: "garage-box",
    desc: "Banc de lucru pentru atelier și inventar OEM.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 54,
    title: "MOTORSUPPLY",
    type: "E-commerce & Auto",
    price: 850,
    tone: "motor-supply",
    desc: "Aprovizionare angro prin tabel și deviz.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 53,
    title: "AUTOGRID",
    type: "E-commerce & Auto",
    price: 850,
    tone: "auto-grid",
    desc: "Comparație de kituri aftermarket și service.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 52,
    title: "LUMA SUITES",
    type: "Hotels & Travel",
    price: 900,
    tone: "park-suites-demo",
    desc: "Prezentare arhitecturală de apartamente urbane.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 51,
    title: "URBAN HAVEN",
    type: "Hotels & Travel",
    price: 900,
    tone: "urban-haven",
    desc: "Hotel cu experiențe de cazare, spa și restaurant.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 50,
    title: "NEST COLLECTION",
    type: "Hotels & Travel",
    price: 900,
    tone: "nest-collection",
    desc: "Colecție de apartamente cu galerie asimetrică.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 49,
    title: "MOLDOVA ESCAPE",
    type: "Hotels & Travel",
    price: 900,
    tone: "moldova-escape",
    desc: "Planificator de escapade și itinerar.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 48,
    title: "BAZAR LOCAL",
    type: "Marketplace",
    price: 1000,
    tone: "bazar-local",
    desc: "Anunțuri locale pe categorii și localități.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 47,
    title: "PREȚ BUN",
    type: "Marketplace",
    price: 1000,
    tone: "pret-bun",
    desc: "Comparator de oferte și istoric de preț.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 46,
    title: "LOCALCRAFT",
    type: "Marketplace",
    price: 1000,
    tone: "local-craft",
    desc: "Piață de artizanat cu povești și personalizare.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 45,
    title: "SKILLUP",
    type: "Online Education",
    price: 750,
    tone: "skillup",
    desc: "Studio de cursuri practice și lecții de probă.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 44,
    title: "CIVICLEARN",
    type: "Online Education",
    price: 750,
    tone: "civic-learn",
    desc: "Portal instituțional cu program și evaluare.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 43,
    title: "MENTORCLOUD",
    type: "Online Education",
    price: 750,
    tone: "mentor-cloud",
    desc: "Trasee de carieră cu exerciții și mentorat.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 42,
    title: "CASACHECK",
    type: "Real Estate",
    price: 900,
    tone: "casa-check",
    desc: "Catalog de proprietăți și dosare comparative.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 41,
    title: "DIRECTHOME",
    type: "Real Estate",
    price: 900,
    tone: "direct-home",
    desc: "Locuințe direct de la proprietar și agendă.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 40,
    title: "AREA INSIGHT",
    type: "Real Estate",
    price: 900,
    tone: "area-insight",
    desc: "Atlas interactiv de cartiere și indicatori.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 39,
    title: "TABLEFLOW",
    type: "Restaurants & Food",
    price: 700,
    tone: "table-flow",
    desc: "Restaurante și plan interactiv de sală.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 38,
    title: "FOODROUTE",
    type: "Restaurants & Food",
    price: 700,
    tone: "food-route",
    desc: "Meniu de livrare cu coș lateral și urmărire.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 37,
    title: "MENU STUDIO",
    type: "Restaurants & Food",
    price: 700,
    tone: "menu-studio",
    desc: "Bistro editorial și meniu sezonier.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 36,
    title: "MYUTILITY",
    type: "Utility Management",
    price: 1100,
    tone: "my-utility",
    desc: "Cont de consumator pentru facturi și contor.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 35,
    title: "BLOCKADMIN",
    type: "Utility Management",
    price: 1100,
    tone: "block-admin",
    desc: "Comunitate de bloc, avizier și participare.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 34,
    title: "AUTOFLOW PARTNER",
    type: "Service Management",
    price: 1300,
    tone: "autoflow",
    desc: "Platformă operațională multi-tenant pentru service-uri auto, cu programări, lucrări, clienți, stoc, parteneri și rapoarte într-un singur sistem",
    stack: ["Next.js", "React", "TypeScript", "NestJS", "PostgreSQL", "Prisma", "Multi-tenant", "RBAC", "PWA", "Inventory Ledger"],
  },
  {
    id: 33,
    title: "DRIVOLT",
    type: "E-commerce & Auto",
    price: 500,
    tone: "drivolt",
    desc: "Magazin online auto cu catalog, promoții, căutare, favorite, coș, branduri și servicii de instalare într-o experiență responsive",
    stack: ["React", "Vite", "JavaScript", "E-commerce", "Product Search", "Shopping Cart", "Responsive Design", "Interactive UI"],
  },
  {
    id: 32,
    title: "FLOW CRM",
    type: "CRM & Sales",
    price: 1000,
    tone: "flowcrm",
    desc: "Workspace SaaS pentru lead-uri, clienți, pipeline, oferte, automatizări și raportarea completă a vânzărilor",
    stack: ["Next.js", "React", "TypeScript", "Supabase", "Multi-tenant", "RBAC", "Sales Pipeline", "Automations", "AI Assistant"],
  },
  {
    id: 31,
    title: "ACADEMIA",
    type: "Online Education",
    price: 600,
    tone: "academia",
    desc: "Platformă LMS premium cu programe de studiu, cursuri, lecții, progres, quiz-uri și experiențe pentru instructori",
    stack: ["Next.js", "React", "TypeScript", "LMS", "Course Player", "Progress Tracking", "Quizzes", "Certificates", "Responsive Design"],
  },
  {
    id: 30,
    title: "STAYNEST",
    type: "Hotels & Travel",
    price: 1200,
    tone: "staynest",
    desc: "Experiență digitală pentru boutique hotel, cu proprietăți, camere, disponibilitate, tarife și rezervare directă",
    stack: ["Next.js", "React", "TypeScript", "Booking Engine", "Room Inventory", "Dynamic Rates", "Stripe", "Supabase", "RO / RU / EN"],
  },
  {
    id: 29,
    title: "TABLEO",
    type: "Restaurants & Food",
    price: 800,
    tone: "tableo",
    desc: "Platformă premium pentru restaurant cu meniu digital, rezervări, comenzi online, checkout și mod operațional",
    stack: ["Next.js", "React", "TypeScript", "Digital Menu", "Reservations", "Online Orders", "Stripe", "QR Menu", "Responsive Design"],
  },
  {
    id: 28,
    title: "MEDORA CLINIC",
    type: "Clinics & Medical",
    price: 1300,
    tone: "medora",
    desc: "Website medical premium cu specialități, medici, prețuri transparente și programare ghidată în șapte pași",
    stack: ["Next.js", "React", "TypeScript", "Drizzle ORM", "Booking Flow", "Medical Services", "RBAC", "RO / RU / EN", "Responsive Design"],
  },
  {
    id: 27,
    title: "IMOBILIA ONE",
    type: "Real Estate",
    price: 700,
    tone: "imobilia",
    desc: "Platformă imobiliară premium cu proprietăți, căutare avansată, cartiere, favorite, vizionări și administrare",
    stack: ["Next.js", "React", "TypeScript", "Supabase", "Property Search", "Mapbox", "Saved Searches", "Admin Panel", "RO / RU / EN"],
  },
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
    price: 900,
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

const pricesByProjectId = new Map(
  projectPrices.map(({ id, price }) => [id, price]),
);

const projects: Project[] = projectCatalog.map((project) => ({
  ...project,
  price: pricesByProjectId.get(project.id) ?? project.price,
}));

const filters = [
  "Toate",
  ...new Set(projects.map((project) => project.type)),
];
// Păstrăm proiectele și categoriile în cod, dar le putem retrage temporar din catalog.
const hiddenCategories = new Set(["AI Website Factory"]);
const unavailableProjectIds = new Set<number>();
const recommendedClickStorageKey = "mono-recommended-clicks";
const recommendedOpeningStorageKey = "mono-recommended-openings";

const shuffledProjectIds = () => {
  const ids = projects.map((project) => project.id);
  for (let index = ids.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [ids[index], ids[randomIndex]] = [ids[randomIndex], ids[index]];
  }
  return ids;
};

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
    moreCategories: "Mai multe categorii",
    categories: "Toate categoriile",
    less: "Ascunde categoriile",
    search: "Caut\u0103 proiecte",
    recommended: "Recomandate",
    sort: "Cele mai noi",
    low: "Pre\u021b cresc\u0103tor",
    high: "Pre\u021b descresc\u0103tor",
    more: "Mai multe",
    empty: "Nu exist\u0103 proiect cu a\u0219a nume.",
  },
  ru: {
    moreCategories: "Ещё категории",
    search:
      "\u041f\u043e\u0438\u0441\u043a \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432, \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0439 \u0438\u043b\u0438 \u0442\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u0439",
    recommended: "\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u0435\u043c\u044b\u0435",
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
    recommended: "Recommended",
    moreCategories: "More categories",
    categories: "All categories",
    less: "Hide categories",
  },
} as const;

const categorySlugs: Record<string, string> = {
  "Gardens & Landscaping": "gardens-landscaping",
  "E-commerce & Auto": "ecommerce-auto",
  "Real Estate": "real-estate",
  "Clinics & Medical": "clinics-medical",
  "Restaurants & Food": "restaurants-food",
  "Hotels & Travel": "hotels-travel",
  "Online Education": "online-education",
  "CRM & Sales": "crm-sales",
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
  71: "aquaverde",
  70: "terraforma",
  69: "gazonpro",
  68: "ecohabitat",
  67: "yardcraft",
  66: "01-eventora",
  65: "02-scena-city",
  64: "03-pulse-tickets",
  63: "04-clinica-nova",
  62: "05-laboris",
  61: "06-doctor-aproape",
  60: "07-med-slot",
  59: "08-lead-pilot",
  58: "09-growth-desk",
  57: "10-closeflow",
  56: "11-partmatch",
  55: "12-garage-box",
  54: "13-motor-supply",
  53: "14-auto-grid",
  52: "15-park-suites-demo",
  51: "16-urban-haven",
  50: "17-nest-collection",
  49: "18-moldova-escape",
  48: "19-bazar-local",
  47: "20-pret-bun",
  46: "21-local-craft",
  45: "22-skillup",
  44: "23-civic-learn",
  43: "24-mentor-cloud",
  42: "25-casa-check",
  41: "26-direct-home",
  40: "27-area-insight",
  39: "28-table-flow",
  38: "29-food-route",
  37: "30-menu-studio",
  36: "31-my-utility",
  35: "32-block-admin",
  34: "autoflow-partner",
  33: "drivolt",
  32: "flow-crm",
  31: "academia",
  30: "staynest",
  29: "tableo",
  28: "medora-clinic",
  27: "imobilia-one",
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
  71: "/aquaverde/",
  70: "/terraforma/",
  69: "/gazonpro/",
  68: "/ecohabitat/",
  67: "/yardcraft/",
  66: "/01-eventora/",
  65: "/02-scena-city/",
  64: "/03-pulse-tickets/",
  63: "/04-clinica-nova/",
  62: "/05-laboris/",
  61: "/06-doctor-aproape/",
  60: "/07-med-slot/",
  59: "/08-lead-pilot/",
  58: "/09-growth-desk/",
  57: "/10-closeflow/",
  56: "/11-partmatch/",
  55: "/12-garage-box/",
  54: "/13-motor-supply/",
  53: "/14-auto-grid/",
  52: "/15-park-suites-demo/",
  51: "/16-urban-haven/",
  50: "/17-nest-collection/",
  49: "/18-moldova-escape/",
  48: "/19-bazar-local/",
  47: "/20-pret-bun/",
  46: "/21-local-craft/",
  45: "/22-skillup/",
  44: "/23-civic-learn/",
  43: "/24-mentor-cloud/",
  42: "/25-casa-check/",
  41: "/26-direct-home/",
  40: "/27-area-insight/",
  39: "/28-table-flow/",
  38: "/29-food-route/",
  37: "/30-menu-studio/",
  36: "/31-my-utility/",
  35: "/32-block-admin/",
  34: "/autoflow-partner/",
  33: "/drivolt/",
  32: "/flow-crm/",
  31: "/academia/",
  30: "/staynest/",
  29: "/tableo/",
  28: "/medora-clinic/",
  27: "/imobilia-one/",
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

const launchProjectIds = new Set(Array.from({ length: 40 }, (_, index) => 27 + index));

const projectDetails: Record<
  number,
  {
    summary: string;
    demo?: string;
    sections: Array<{ title: string; items: string[] }>;
  }
> = {
  34: {
    summary: "AUTOFLOW PARTNER este un sistem complet de operare pentru service-uri și companii de servicii auto. Platforma unește planificarea, execuția lucrărilor, relația cu clienții, stocul și indicatorii de management într-un workspace multi-tenant.",
    sections: [
      { title: "Operațiuni zilnice", items: ["Dashboard cu programări, lucrări active, încasări și alerte de stoc", "Calendar vizual pentru echipă și resurse", "Comenzi de lucru urmărite de la recepție până la predare"] },
      { title: "Clienți și parteneri", items: ["Profiluri pentru clienți, automobile și istoricul vizitelor", "Furnizori și colaboratori administrați centralizat", "Roluri separate pentru owner, manager, recepție, specialist și depozit"] },
      { title: "Stoc și control", items: ["Ledger de inventar, rezervări și praguri de reaprovizionare", "Rapoarte operaționale și financiare", "Izolare multi-tenant, audit și permisiuni verificate în backend"] },
      { title: "Tehnologie și livrare", items: ["Next.js, NestJS, TypeScript, Prisma și PostgreSQL", "Aplicație responsive/PWA și API documentat", "Infrastructură Docker, seed demonstrativ și suită de teste"] },
    ],
  },
  33: {
    summary: "DRIVOLT este un magazin digital de tehnologie și accesorii auto, construit în jurul unei identități electrice și contemporane. Proiectul combină un catalog vizual bogat cu funcții interactive de căutare, favorite și coș.",
    sections: [
      { title: "Catalog auto", items: ["Categorii vizuale pentru multimedia, audio, alarme și accesorii", "Produse demonstrative cu disponibilitate și prețuri", "Căutare instantanee și navigare rapidă în catalog"] },
      { title: "Experiență de cumpărare", items: ["Favorite și coș interactive", "Slider promoțional automat și oferte evidențiate", "Interfață optimizată pentru desktop și mobil"] },
      { title: "Brand și servicii", items: ["Identitate electrică proprie în verde volt, cyan și petrol", "Secțiune pentru branduri, instalare și contact", "Program de lucru și legături directe"] },
      { title: "Ce primește cumpărătorul", items: ["Cod sursă React și Vite complet editabil", "Active locale și build static pentru producție", "Bază pregătită pentru conectarea unui catalog și checkout real"] },
    ],
  },
  32: {
    summary: "FLOW CRM este un workspace SaaS complet pentru echipe de vânzări. Reunește contactele, companiile, oportunitățile, activitățile, ofertele și automatizările într-o interfață rapidă, multi-tenant și pregătită pentru extindere.",
    sections: [
      { title: "Pipeline și relații", items: ["Pipeline Kanban configurabil cu drag-and-drop", "Contacte, companii și oportunități conectate", "Timeline complet pentru fiecare relație comercială"] },
      { title: "Productivitate", items: ["Taskuri, întâlniri, inbox demonstrativ și comandă rapidă", "Oferte comerciale și produse configurabile", "Import, export, filtre și acțiuni în masă"] },
      { title: "Automatizare și AI", items: ["Automatizări cu trigger, condiție, acțiune și jurnal", "Rezumate, acțiuni și drafturi AI controlate de utilizator", "Rapoarte pentru conversie, forecast și performanță"] },
      { title: "Ce primește cumpărătorul", items: ["Aplicație SaaS responsive cu roluri și organizații izolate", "Schema Supabase, politici RLS, seed și teste", "Mod showcase și documentație de producție"] },
    ],
  },
  31: {
    summary: "ACADEMIA este o platformă modernă de educație online, construită în jurul învățării practice. Include catalog, trasee, pagină de curs, experiență de lecție și progres memorat.",
    sections: [
      { title: "Catalog educațional", items: ["12 cursuri demonstrative din design, business și tehnologie", "Căutare, filtre și trasee de învățare", "Pagini editoriale pentru cursuri și instructori"] },
      { title: "Experiența cursantului", items: ["Player de lecții și navigare între module", "Progres local, stări completate și feedback vizibil", "Curs gratuit complet pentru demonstrație"] },
      { title: "Administrare și creștere", items: ["Arhitectură pregătită pentru roluri, plăți și certificate", "Conținut modular și extensibil", "Experiență responsive și accesibilă"] },
      { title: "Ce primește cumpărătorul", items: ["Codul complet al platformei LMS", "Catalog și conținut demonstrativ inclus", "Build pentru producție și mod showcase"] },
    ],
  },
  30: {
    summary: "STAYNEST este o experiență hotelieră premium pentru rezervări directe. Prezintă două proprietăți boutique, camere, experiențe și un flux clar de la disponibilitate la confirmare.",
    sections: [
      { title: "Descoperire", items: ["Proprietăți urbane și în natură cu prezentare editorială", "Camere, facilități, experiențe și oferte", "Galerii și conținut local bogat"] },
      { title: "Motor de rezervare", items: ["Căutare după perioadă, oaspeți și proprietate", "Inventar, tarife și opțiuni suplimentare", "Checkout și confirmare pregătite pentru Stripe"] },
      { title: "Operațiuni", items: ["Structură pentru rezervări, oaspeți și inventar zilnic", "Roluri pentru recepție, manager și administrator", "Strategie anti-overbooking și integrare channel manager"] },
      { title: "Ce primește cumpărătorul", items: ["Website și motor de rezervare complet", "Schema de date, seed și teste de preț", "Export static pentru prezentarea în catalog"] },
    ],
  },
  29: {
    summary: "TABLEO transformă website-ul unui restaurant într-un canal direct de vânzare. Meniul, rezervările și comenzile online sunt reunite într-o experiență rapidă și memorabilă.",
    sections: [
      { title: "Meniu și brand", items: ["Meniu digital cu preparate, categorii și alergeni", "Fotografie culinară și identitate editorială", "Experiență optimizată pentru mobil și QR"] },
      { title: "Rezervări", items: ["Selectarea datei, orei, numărului de persoane și zonei", "Capacitate și prevenirea suprarezervării", "Confirmare și administrarea solicitărilor"] },
      { title: "Comenzi", items: ["Coș, variante, note și total transparent", "Pickup sau livrare cu interval selectabil", "Checkout pregătit pentru plăți și statusuri operaționale"] },
      { title: "Ce primește cumpărătorul", items: ["Platformă restaurant completă și responsive", "Meniu demonstrativ bogat și funcții interactive", "Build standalone și export showcase"] },
    ],
  },
  28: {
    summary: "MEDORA CLINIC este un website medical premium cu informație clară și programări rapide. Proiectul prezintă specialități, medici și prețuri, într-un flux sigur și empatic.",
    sections: [
      { title: "Prezentare medicală", items: ["Specialități, servicii și prețuri transparente", "Profiluri demonstrative pentru medici și locații", "Conținut de siguranță și delimitări medicale clare"] },
      { title: "Programare ghidată", items: ["Flux în șapte pași pentru alegerea consultației", "Medic, locație, dată, oră și consimțământ", "Confirmare fără transmiterea datelor în modul demo"] },
      { title: "Arhitectură", items: ["Model de date pentru medici, programe și programări", "Roluri pregătite pentru pacient, recepție și admin", "Confidențialitate și validare orientate spre producție"] },
      { title: "Ce primește cumpărătorul", items: ["Website clinică și sistem de programare", "Conținut, imagini și date demonstrative", "Export showcase compatibil cu MONO/DEV"] },
    ],
  },
  27: {
    summary: "IMOBILIA ONE este o platformă imobiliară premium pentru Chișinău și România. Catalogul include proprietăți demonstrative, cartiere, servicii și instrumente pentru găsirea locuinței potrivite.",
    sections: [
      { title: "Catalog imobiliar", items: ["24 de proprietăți demonstrative cu imagini reale", "Filtre, căutare și pagini detaliate", "Cartiere, specificații și proprietăți similare"] },
      { title: "Conversie", items: ["Programarea vizionărilor și cereri de evaluare", "Favorite și căutări salvate", "Contact direct cu agentul potrivit"] },
      { title: "Administrare", items: ["Structură pentru proprietăți, agenți, media și lead-uri", "Supabase, RLS, roluri și audit log", "Import, export și stări editoriale"] },
      { title: "Ce primește cumpărătorul", items: ["Platformă trilingvă și responsive", "Date seed, migrații și imagini documentate", "Build producție și showcase static"] },
    ],
  },
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
  const hasLivePreview = (project.id >= 35 && project.id <= 66) || gardenProjects.some((item) => item.id === project.id);
  const hasProjectPreview = launchProjectIds.has(project.id) || hasLivePreview;
  return (
    <div className={`visual-frame${hasProjectPreview ? " visual-frame-preview" : ""}`}>
      <div className={`visual visual-${project.tone}${hasProjectPreview ? " visual-with-preview" : ""}`}>
      {hasLivePreview && <StaticProjectPreview slug={projectSlugs[project.id]} title={project.title} />}
      {hasProjectPreview && !hasLivePreview && (
        <img
          className="launch-project-preview"
          src={`/project-previews/${projectSlugs[project.id]}.png`}
          alt={`Preview real al proiectului ${project.title}`}
          loading="lazy"
        />
      )}
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
    </div>
  );
}

function AutoFitProjectTitle({ title }: { title: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const heading = titleRef.current;
    const row = heading?.parentElement;
    if (!heading || !row) return;

    let frame = 0;
    let active = true;
    const fitTitle = () => {
      if (!active) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        heading.style.removeProperty("font-size");
        const naturalSize = Number.parseFloat(getComputedStyle(heading).fontSize);

        if (heading.scrollWidth > heading.clientWidth) {
          const fittedSize = Math.max(
            14,
            naturalSize * (heading.clientWidth / heading.scrollWidth),
          );
          heading.style.fontSize = `${fittedSize}px`;
        }
      });
    };

    fitTitle();
    const observer = new ResizeObserver(fitTitle);
    observer.observe(row);
    void document.fonts.ready.then(fitTitle);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [title]);

  return (
    <h2 id="project-modal-title" ref={titleRef}>
      {title}
    </h2>
  );
}

// Keep each initial batch even so the two-column catalog never ends on a lone card.
const PROJECT_PAGE_SIZE = 8;

export default function Home() {
  const categoryMenuRef = useRef<HTMLDetailsElement>(null);
  const sortMenuRef = useRef<HTMLDetailsElement>(null);
  const filterRowRef = useRef<HTMLDivElement>(null);
  const filterMeasureRef = useRef<HTMLDivElement>(null);
  const [visibleFilterCount, setVisibleFilterCount] = useState(6);
  const [categoriesDiscovered, setCategoriesDiscovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform>("web");
  const [mobileOS, setMobileOS] = useState<MobileOS>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [recommendedOrder, setRecommendedOrder] = useState<number[] | null>(() => {
    if (typeof window === "undefined") return null;
    const openings = Number.parseInt(localStorage.getItem(recommendedOpeningStorageKey) ?? "0", 10) || 0;
    const nextOpenings = openings + 1;
    localStorage.setItem(recommendedOpeningStorageKey, String(nextOpenings));
    return nextOpenings % 3 === 0 ? shuffledProjectIds() : null;
  });
  const [visibleProjectCount, setVisibleProjectCount] = useState(PROJECT_PAGE_SIZE);
  const [menu, setMenu] = useState(false);
  const [activeNav, setActiveNav] = useState<"proiecte" | "proces" | null>(null);
  const [locale, setLocale] = useState<Locale>("ro");
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(
    null,
  );
  const [installmentMonths, setInstallmentMonths] = useState<3 | 6 | 12>(12);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("installments");
  const [rentalServiceTier, setRentalServiceTier] = useState<RentalServiceTier>("with-services");
  const [rentalServicesInfoOpen, setRentalServicesInfoOpen] = useState<RentalServiceTier | null>(null);
  useEffect(() => {
    const removeNetlifyBadge = () => document.getElementById("nl-badge")?.remove();
    removeNetlifyBadge();

    const observer = new MutationObserver(removeNetlifyBadge);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
  const c = copy[locale];
  const fc = cleanFilterCopy[locale];
  const pc = platformCopy[locale];
  const gc = gamesPlatformCopy[locale];
  const supportsMobileOS = platform === "mobile" || platform === "games";
  const launchCopy = platform === "games" ? gc : { empty: pc.empty, detail: pc.detail, contact: pc.contact, collection: "MOBILE COLLECTION", caption: "SMALL SCREEN. BIG POSSIBILITIES." };
  const sortOptions = [
    { value: "recommended", label: fc.recommended },
    { value: "newest", label: fc.sort },
    { value: "low", label: fc.low },
    { value: "high", label: fc.high },
  ];
  const selectedSortLabel = sortOptions.find((option) => option.value === sort)?.label ?? fc.recommended;
  const recommendedRanks = new Map(recommendedOrder?.map((id, index) => [id, index]));
  const publicProjects = projects.filter((project) => !hiddenCategories.has(project.type));
  const platformCount = (value: Platform) => publicProjects.filter((project) => (project.platform ?? "web") === value).length;
  const listedProjects = publicProjects.filter((project) =>
    (project.platform ?? "web") === platform &&
    (!supportsMobileOS || mobileOS === "all" || project.mobileOS?.includes(mobileOS)),
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
    activeCategory === filter,
  );
  const isCategoryActive = (filter: string) =>
    filter === "Toate"
      ? activeCategory === null
      : activeCategory === filter;
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const matchingProjects = listedProjects
    .filter(
      (project) =>
        activeCategory === null || activeCategory === project.type,
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
          : sort === "recommended" && recommendedOrder
            ? (recommendedRanks.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (recommendedRanks.get(b.id) ?? Number.MAX_SAFE_INTEGER)
          : b.id - a.id,
    );
  const visible = activeCategory === null
    ? matchingProjects.slice(0, visibleProjectCount)
    : matchingProjects;
  const hasMoreProjects = activeCategory === null && visible.length < matchingProjects.length;
  const categoryCount = (filter: string) =>
    filter === "Toate"
      ? listedProjects.length
      : listedProjects.filter((project) => project.type === filter).length;
  const contactHref = locale === "ro" ? "/contact" : `/contact?lang=${locale}`;
  const selectedInstallmentPlan = installmentPlans.find(
    (plan) => plan.months === installmentMonths,
  ) ?? installmentPlans[1];
  const installmentTotal = selected
    ? Math.ceil(selected.price * (1 + selectedInstallmentPlan.surcharge))
    : 0;
  const rentalPrice = installmentTotal / installmentMonths;
  const siteRentalPrice = selected ? monthlyRentalPrice(selected.price) : 0;
  const rentalServicesFee = { min: 40, max: 40 };
  const rentalPriceWithServices = {
    min: siteRentalPrice + rentalServicesFee.min,
    max: siteRentalPrice + rentalServicesFee.max,
  };
  const rentalMonthlyPriceLabel = rentalServiceTier === "with-services"
    ? `€${rentalPriceWithServices.min.toFixed(2)}`
    : `€${siteRentalPrice.toFixed(2)}`;
  const rentalServicesSummary = rentalServiceTier === "with-services"
    ? {
        title: locale === "ro" ? "Incluse în abonament" : locale === "ru" ? "Включено в подписку" : "Included in the subscription",
        items: locale === "ro"
          ? ["Găzduire web — €10", "Mentenanță tehnică — €20", "Securitate și backup — €10"]
          : locale === "ru"
            ? ["Веб-хостинг — €10", "Техническая поддержка — €20", "Безопасность и резервные копии — €10"]
            : ["Web hosting — €10", "Technical maintenance — €20", "Security and backups — €10"],
      }
    : {
        title: locale === "ro" ? "Nu sunt incluse" : locale === "ru" ? "Не включено" : "Not included",
        items: locale === "ro"
          ? ["Găzduire web", "Mentenanță tehnică", "Securitate și backup"]
          : locale === "ru"
            ? ["Веб-хостинг", "Техническая поддержка", "Безопасность и резервные копии"]
            : ["Web hosting", "Technical maintenance", "Security and backups"],
      };
  const installmentHref = selected
    ? `/contact?${new URLSearchParams({ project: selected.title, option: `installments-${installmentMonths}-months`, ...(locale === "ro" ? {} : { lang: locale }) })}`
    : contactHref;
  const rentalHref = selected
    ? `/contact?${new URLSearchParams({ project: selected.title, option: `site-rental-${rentalServiceTier}`, ...(locale === "ro" ? {} : { lang: locale }) })}`
    : contactHref;
  const paymentHref = paymentMode === "installments" ? installmentHref : rentalHref;
  const paymentIncludes = paymentMode === "rental"
    ? rentalServiceTier === "with-services"
      ? locale === "ro"
        ? ["Găzduire web", "Mentenanță tehnică", "Securitate și backup"]
        : locale === "ru"
          ? ["Веб-хостинг", "Техническая поддержка", "Безопасность и резервные копии"]
          : ["Web hosting", "Technical maintenance", "Security and backups"]
      : locale === "ro"
        ? ["Site pregătit pentru utilizare", "Fără găzduire și mentenanță incluse", "Îți alegi propriul furnizor de servicii", "Poți activa serviciile ulterior"]
        : locale === "ru"
          ? ["Сайт готов к использованию", "Хостинг и техподдержка не включены", "Вы выбираете своего поставщика услуг", "Услуги можно подключить позже"]
          : ["Website ready to use", "Hosting and maintenance not included", "Choose your own service provider", "Services can be activated later"]
    : locale === "ro"
      ? ["Devii proprietarul siteului", "Găzduire gratuită primele 2 luni", "Mentenanță tehnică lunară gratuită primele 2 luni", "Plată flexibilă în rate"]
      : locale === "ru"
        ? ["Сайт становится вашей собственностью", "Запуск и хостинг включены", "Ежемесячная техподдержка", "Гибкая оплата в рассрочку"]
        : ["You own the website", "Launch and hosting included", "Monthly technical care", "Flexible installment payments"];
  const selectedDetail = selected
    ? locale === "ro"
      ? newProjectDetails[selected.id] ?? projectDetails[selected.id] ?? {
          summary: selected.desc,
          sections: [
            { title: "Produsul", items: ["Interfață completă și responsive", "Experiență demonstrativă pregătită pentru personalizare", "Conținut și structură originale"] },
            { title: "Funcționalități", items: ["Căutare, filtrare și favorite", "Formulare validate și notificări", "Temă luminoasă și întunecată"] },
            { title: "Tehnologii", items: selected.stack },
            { title: "Ce primește cumpărătorul", items: ["Cod sursă complet editabil", "Build static pentru prezentare", "Configurație Firebase opțională"] },
          ],
        }
      : newProjectTranslations[locale].newProjectDetails[selected.id] ?? localizedDetail(locale, selected)
    : null;
  useEffect(() => {
    const syncFromUrl = () => {
      const url = new URL(window.location.href);
      const categorySlugsFromUrl = url.searchParams.getAll("categorie");
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
      const urlPlatform = url.searchParams.get("platforma");
      setPlatform(urlPlatform === "mobile" || urlPlatform === "games" ? urlPlatform : "web");
      const os = url.searchParams.get("os");
      setMobileOS(os === "android" || os === "ios" ? os : "all");
      setActiveCategory(categories[0] ?? null);
      setVisibleProjectCount(PROJECT_PAGE_SIZE);
      if (projectId) setInstallmentMonths(12);
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
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    let frame = 0;
    const updateActiveNav = () => {
      frame = 0;
      const projectsSection = document.getElementById("proiecte");
      const processSection = document.getElementById("proces");
      if (!projectsSection || !processSection) return;

      const activationLine = Math.min(160, window.innerHeight * 0.28);
      const nextActive =
        processSection.getBoundingClientRect().top <= activationLine
          ? "proces"
          : projectsSection.getBoundingClientRect().top <= activationLine
            ? "proiecte"
            : null;
      setActiveNav((current) => current === nextActive ? current : nextActive);
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveNav);
    };

    updateActiveNav();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", requestUpdate);
    };
  }, []);
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
      const isMobile = window.matchMedia("(max-width: 800px)").matches;
      if (isMobile) {
        while (nextCount > 1 && rowsNeeded(widths.slice(0, nextCount), row.clientWidth) > 3) {
          nextCount -= 1;
        }
      } else if (rowsNeeded(widths, row.clientWidth) > 3) {
        const moreWidth =
          categoryMenuRef.current?.getBoundingClientRect().width ?? 150;
        const filtersWidth = Math.max(0, row.clientWidth - moreWidth - gap);
        nextCount = 1;
        for (let count = filters.length - 1; count >= 1; count -= 1) {
          if (rowsNeeded(widths.slice(0, count), filtersWidth) <= 3) {
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
    observer.observe(measure);
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) calculateVisibleFilters();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [locale]);
  useEffect(() => {
    const closeDropdowns = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      [categoryMenuRef.current, sortMenuRef.current].forEach((details) => {
        if (details?.open && !details.contains(target)) details.removeAttribute("open");
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
  const selectPlatform = (nextPlatform: Platform, nextOS: MobileOS = "all", scrollToProjects = false) => {
    setPlatform(nextPlatform);
    setMobileOS(nextOS);
    setActiveCategory(null);
    setQuery("");
    setVisibleProjectCount(PROJECT_PAGE_SIZE);
    const url = new URL(window.location.href);
    url.searchParams.set("platforma", nextPlatform);
    url.searchParams.delete("categorie");
    url.searchParams.delete("os");
    if ((nextPlatform === "mobile" || nextPlatform === "games") && nextOS !== "all") url.searchParams.set("os", nextOS);
    url.hash = "proiecte";
    window.history.pushState({}, "", url);
    if (scrollToProjects) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document.getElementById(nextPlatform === "mobile" || nextPlatform === "games" ? "mobile-projects-start" : "project-grid")?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
            block: "start",
          });
        });
      });
    }
  };
  const selectCategory = (category: string) => {
    const nextCategory = category === "Toate" ? null : category;
    setActiveCategory(nextCategory);
    setVisibleProjectCount(PROJECT_PAGE_SIZE);
    const url = new URL(window.location.href);
    url.searchParams.delete("categorie");
    if (nextCategory) {
      url.searchParams.set("categorie", categorySlugs[nextCategory]);
    }
    url.hash = "proiecte";
    window.history.pushState({}, "", url);
  };
  const openProject = (project: (typeof projects)[number]) => {
    setInstallmentMonths(12);
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
      <div className="edge-rail edge-rail-right code-rail">
        <div className="rail-language-switch" aria-label={c.language} role="group">
          <span className="rail-language-label" aria-hidden="true">LANG</span>
          <div className="rail-language-options">
            {locales.map((language) => (
              <button
                type="button"
                key={language}
                className={locale === language ? "active" : ""}
                onClick={() => changeLocale(language)}
                lang={language}
                aria-label={`${c.language}: ${language.toUpperCase()}`}
                aria-pressed={locale === language}
              >
                {locale === language && (
                  <motion.span
                    className="rail-language-active"
                    layoutId="rail-language-active"
                    transition={{ type: "spring", stiffness: 460, damping: 30 }}
                  />
                )}
                <span>{language.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="code-grid" aria-hidden="true" />
        <div className="binary-rain" aria-hidden="true">
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
        <div className="git-branch" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <span>main</span>
          <b>HEAD</b>
        </div>
        <div className="deploy-chip" aria-hidden="true">
          <i />
          DEPLOYED <b>200</b>
        </div>
      </div>
      <nav className="nav shell">
        <BrandLogo className="logo" href="#top" />
        <div className="nav-links">
          <a
            href="#proiecte"
            className={activeNav === "proiecte" ? "active" : ""}
            aria-current={activeNav === "proiecte" ? "location" : undefined}
          >
            {activeNav === "proiecte" && (
              <motion.span
                className="nav-active-pill"
                layoutId="nav-active-pill"
                transition={{ type: "spring", stiffness: 420, damping: 27, mass: 0.72 }}
              >
                <motion.i
                  key="proiecte"
                  initial={{ y: 7, scale: 0.82, rotate: -3 }}
                  animate={{ y: [7, -13, 2, 0], scale: [0.82, 1.08, 0.97, 1], rotate: [-3, 2, 0] }}
                  transition={{ duration: 0.52, ease: [0.2, 0.85, 0.25, 1] }}
                />
              </motion.span>
            )}
            <span>{c.nav[0]}</span>
          </a>
          <a
            href="#proces"
            className={activeNav === "proces" ? "active" : ""}
            aria-current={activeNav === "proces" ? "location" : undefined}
          >
            {activeNav === "proces" && (
              <motion.span
                className="nav-active-pill"
                layoutId="nav-active-pill"
                transition={{ type: "spring", stiffness: 420, damping: 27, mass: 0.72 }}
              >
                <motion.i
                  key="proces"
                  initial={{ y: 7, scale: 0.82, rotate: 3 }}
                  animate={{ y: [7, -13, 2, 0], scale: [0.82, 1.08, 0.97, 1], rotate: [3, -2, 0] }}
                  transition={{ duration: 0.52, ease: [0.2, 0.85, 0.25, 1] }}
                />
              </motion.span>
            )}
            <span>{c.nav[1]}</span>
          </a>
          <a href={locale === "ro" ? "/intrebari" : `/intrebari?lang=${locale}`}>{c.questions}</a>
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
        <a className="account-link" href={locale === "ro" ? "/cabinet" : `/cabinet?lang=${locale}`}>
          <UserRound size={15} /> {{ ro: "Cabinet personal", ru: "Личный кабинет", en: "Personal area" }[locale]}
        </a>
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
            <a href={locale === "ro" ? "/intrebari" : `/intrebari?lang=${locale}`} onClick={() => setMenu(false)}>
              {c.questions}
            </a>
            <a href={contactHref} onClick={() => setMenu(false)}>
              {c.nav[2]}
            </a>
            <a className="mobile-account-link" href={locale === "ro" ? "/cabinet" : `/cabinet?lang=${locale}`} onClick={() => setMenu(false)}>
              <UserRound size={16} /> {{ ro: "Cabinet personal", ru: "Личный кабинет", en: "Personal area" }[locale]}
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
        <motion.a
          href="#proiecte"
          className="circle-arrow hero-scroll-cue"
          aria-label={c.viewProjects}
          initial={{ opacity: 0, scale: 0.72, rotate: 45 }}
          animate={{ opacity: 1, scale: 1, rotate: 45 }}
          transition={{ duration: 0.65, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <ArrowRight />
        </motion.a>
        <div className="marquee">
          <div className="marquee-track">
            {Array.from({ length: 6 }, (_, index) => (
              <span className="marquee-group" aria-hidden={index > 0 ? "true" : undefined} key={index}>
                {c.marquee[0]} <Sparkles /> {c.marquee[1]} <Zap /> {c.marquee[2]} <Sparkles />
              </span>
            ))}
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
        </div>
        <div className="platform-picker" role="group" aria-label="Alege categoria">
          {(["web", "mobile", "games"] as const).map((value) => (
            <button type="button" key={value} className={`platform-option platform-${value}${platform === value ? " is-selected" : ""}`} aria-pressed={platform === value} aria-controls="project-grid" onClick={() => selectPlatform(value, "all", true)}>
              <span className="platform-art" aria-hidden="true">
                {value === "web" ? <span className="platform-browser"><span className="browser-chrome"><i /><i /><i /><b>mono.dev</b></span><span className="browser-body"><span className="browser-sidebar"><i /><i /><i /></span><span className="browser-content"><b>Make it<br />happen<span>.</span></b><i /><span className="browser-tiles"><i /><i /><i /></span></span></span><span className="browser-code">&lt;/&gt;</span></span> : value === "mobile" ? <span className="platform-phones"><span className="platform-phone phone-back"><i /><span className="phone-orbit" /><b>iOS</b></span><span className="platform-phone phone-front"><i /><span className="phone-app-icon"><Zap size={22} /></span><b>Go beyond.</b><span className="phone-app-lines"><i /><i /></span><span className="phone-app-button">Let&apos;s go <ArrowRight size={10} /></span></span><span className="phone-float-icon"><Sparkles size={18} /></span></span> : <span className="platform-games-art"><Gamepad2 size={106} /><i /><i /><b>PLAY</b></span>}
              </span>
              <span className="platform-icon">{value === "web" ? <Monitor aria-hidden="true" /> : value === "mobile" ? <Smartphone aria-hidden="true" /> : <Gamepad2 aria-hidden="true" />}</span>
              <span className="platform-text"><strong>{platformLabels[value].title}</strong><span>{platformLabels[value].description}</span><span className="platform-devices">{platformLabels[value].devices}</span></span>
              {platform === value && <span className="platform-status"><b>{String(platformCount(value)).padStart(2, "0")}</b> {pc.available}</span>}
            </button>
          ))}
        </div>
        {supportsMobileOS && <div id="mobile-projects-start" className="mobile-os" role="group" aria-label={pc.os}>
          {(["all", "android", "ios"] as const).map((os) => <button type="button" key={os} aria-pressed={mobileOS === os} onClick={() => selectPlatform(platform, os)}><span className="os-filter-icon" aria-hidden="true">{os === "all" ? <Sparkles size={15} /> : os === "android" ? <Smartphone size={15} /> : <span className="ios-filter-mark">i</span>}</span><span>{os === "all" ? pc.all : os === "android" ? "Android" : "iOS"}</span>{mobileOS === os && <span className="os-selected-dot" aria-hidden="true" />}</button>)}
        </div>}
        <div className="catalog-controls" hidden={platform !== "web" && platformCount(platform) === 0}>
        <div className="filter-toolbar">
          <div className="project-search">
            <Search size={18} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleProjectCount(PROJECT_PAGE_SIZE);
              }}
              placeholder={fc.search}
              aria-label={fc.search}
            />
            {query && (
              <button
                type="button"
                className="project-search-clear"
                onClick={() => {
                  setQuery("");
                  setVisibleProjectCount(PROJECT_PAGE_SIZE);
                }}
                aria-label="\u0218terge c\u0103utarea"
                title="\u0218terge c\u0103utarea"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>
          <details ref={sortMenuRef} className="project-sort">
            <summary aria-label={selectedSortLabel}>
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
                    if (option.value === "recommended") {
                      const clicks = Number.parseInt(localStorage.getItem(recommendedClickStorageKey) ?? "0", 10) || 0;
                      const nextClicks = clicks + 1;
                      localStorage.setItem(recommendedClickStorageKey, String(nextClicks));
                      if (nextClicks % 3 === 0) setRecommendedOrder(shuffledProjectIds());
                    }
                    setVisibleProjectCount(PROJECT_PAGE_SIZE);
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
                aria-pressed={isCategoryActive(filter)}
              >
                {filter === "Toate" ? c.all : localType(filter, locale)}{" "}
                <span>{categoryCount(filter)}</span>
              </button>
            ))}
          </div>
          {secondaryFilters.length > 0 && (
            <details
              ref={categoryMenuRef}
              className={`filter-more${categoriesDiscovered ? "" : " filter-more-discover"}`}
              onToggle={(event) => {
                if (event.currentTarget.open) setCategoriesDiscovered(true);
              }}
            >
              <summary
                className={activeSecondaryFilters.length > 0 ? "active" : ""}
              >
                <span className="filter-more-label">
                  {fc.moreCategories}
                </span>
                {activeSecondaryFilters.length > 0 && (
                  <b>{activeSecondaryFilters.length}</b>
                )}
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
                    aria-pressed={isCategoryActive(filter)}
                  >
                    <span>{localType(filter, locale)}</span>
                    <b>{categoryCount(filter)}</b>
                  </button>
                ))}
              </div>
            </details>
          )}
        </div>
        </div>
        <motion.div layout className="grid" id="project-grid">
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
                    <span className="price-sale">
                      <small>{c.from}</small>
                      <strong className="price-main">€{project.price}</strong>
                    </span>
                    <span className="price-option-separator" aria-hidden="true">
                      {locale === "ro" ? "sau" : locale === "ru" ? "или" : "or"}
                    </span>
                    <span
                      className="price-rental"
                      aria-label={locale === "ro" ? "Rată lunară pentru plata în 12 luni" : locale === "ru" ? "Ежемесячный платёж на 12 месяцев" : "Monthly payment over 12 months"}
                    >
                      <b>€{annualInstallmentPrice(project.price)}<em>{c.perMonth}</em></b>
                    </span>
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
        {hasMoreProjects && (
          <div className="projects-load-more">
            <button
              type="button"
              aria-controls="project-grid"
              onClick={() => setVisibleProjectCount((count) => count + PROJECT_PAGE_SIZE)}
            >
              <span>{fc.more}</span>
              <span className="projects-load-more-icon" aria-hidden="true">
                <ChevronDown size={18} />
              </span>
            </button>
          </div>
        )}
        {supportsMobileOS && platformCount(platform) === 0 ? (
          <div className="mobile-coming-soon" role="status">
            <div className="mobile-launch-copy">
              <span className="launch-status"><span />{pc.soon}<span className="launch-status-divider" />{launchCopy.collection}</span>
              <h3>{launchCopy.empty}</h3><p>{launchCopy.detail}</p>
              <a href={contactHref}>{launchCopy.contact}<span><ArrowRight size={18} /></span></a>
              <div className="launch-platforms"><span><Smartphone size={14} />Android</span><i /> <span><span className="ios-filter-mark">i</span>iOS</span><span className="launch-platform-line" /></div>
            </div>
            <div className="mobile-preview-art launch-art" aria-hidden="true">
              <span className="launch-orbit orbit-one" /><span className="launch-orbit orbit-two" /><span className="launch-orbit orbit-three" />
              <span className="launch-art-caption">{launchCopy.caption}</span>
              <div className="launch-device">
                <div className="launch-device-top"><span>9:41</span><i /><span>100%</span></div>
                <div className="launch-app-header"><span>mono<span>/</span>mobile</span><span className="launch-app-avatar">m.</span></div>
                <div className="launch-app-greeting">YOUR NEXT BIG THING</div>
                <strong className="launch-app-title">Dream it.<br /><em>Launch it.</em></strong>
                <div className="launch-app-feature"><span className="launch-feature-orb" /><Sparkles size={20} /><span>Built for<br /><b>your everyday.</b></span><span className="launch-feature-arrow"><ArrowRight size={16} /></span></div>
                <div className="launch-app-widgets"><span><Zap size={17} /><b>Fast.</b><i /></span><span><span className="launch-widget-dots"><i /><i /><i /><i /></span><b>Intuitive.</b><i /></span></div>
                <div className="launch-app-nav"><span /><span /><span /><span /></div><span className="launch-home-indicator" />
              </div>
              <div className="launch-float float-android"><Smartphone size={20} /><span>Android<small>MADE TO CONNECT</small></span></div>
              <div className="launch-float float-ios"><span className="launch-ios-symbol">i</span><span>iOS<small>DESIGNED TO FEEL</small></span></div>
              <span className="launch-spark"><Sparkles size={27} /></span>
            </div>
          </div>
        ) : !visible.length && <p className="projects-empty" role="status">{fc.empty}</p>}
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
          <BrandLogo className="footer-brand" href="#top" inverse ariaLabel="mono/dev" />
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
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
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
                <div className="modal-toolbar">
                  <span className="kicker">{localType(selected.type, locale)}</span>
                  <span className="modal-status"><i />{locale === "ro" ? "DISPONIBIL" : locale === "ru" ? "ЛИЦЕНЗИЯ ДОСТУПНА" : "LICENSE AVAILABLE"}</span>
                </div>
                <div className="modal-title-row">
                  <AutoFitProjectTitle title={selected.title} />
                  <div className="modal-price">
                    <small>{c.fullPrice}</small>€{selected.price}
                  </div>
                </div>
                <p className="modal-summary">{selectedDetail.summary}</p>
                <aside className="rental-offer" aria-label={c.rentalLabel}>
                  <div className="installment-side">
                    <div className="installment-heading">
                      <span>{locale === "ro" ? "ALEGE MODALITATEA" : locale === "ru" ? "ВЫБЕРИТЕ ВАРИАНТ" : "CHOOSE YOUR OPTION"}</span>
                      <strong>{paymentMode === "installments"
                        ? locale === "ro" ? "Cumpără în rate" : locale === "ru" ? "Купить в рассрочку" : "Buy in installments"
                        : c.rentalLabel}</strong>
                    </div>
                    {paymentMode === "rental" && (
                      <div className={`rental-services-summary ${rentalServiceTier === "without-services" ? "is-excluded" : ""}`} aria-live="polite">
                        <b>{rentalServicesSummary.title}</b>
                        <ul>
                          {rentalServicesSummary.items.map((item) => (
                            <li key={item}><span aria-hidden="true">{rentalServiceTier === "with-services" ? "✓" : "×"}</span>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="installment-calculator">
                    <div className="payment-mode-options" role="radiogroup" aria-label={locale === "ro" ? "Modalitate de plată" : locale === "ru" ? "Способ оплаты" : "Payment option"}>
                      <button type="button" className={paymentMode === "installments" ? "is-active" : ""} onClick={() => setPaymentMode("installments")} role="radio" aria-checked={paymentMode === "installments"}>
                        {locale === "ro" ? "Cumpără în rate" : locale === "ru" ? "В рассрочку" : "Installments"}
                      </button>
                      <button type="button" className={paymentMode === "rental" ? "is-active" : ""} onClick={() => setPaymentMode("rental")} role="radio" aria-checked={paymentMode === "rental"}>
                        {c.rentalLabel}
                      </button>
                    </div>
                    {paymentMode === "installments" ? (
                      <>
                        <div className="installment-options" role="radiogroup" aria-label={locale === "ro" ? "Perioada de plată" : locale === "ru" ? "Срок оплаты" : "Payment term"}>
                          {installmentPlans.map((plan) => {
                            const label = locale === "ro"
                              ? `${plan.months} luni`
                              : locale === "ru"
                                ? plan.months === 12 ? "1 год" : `${plan.months} мес.`
                                : plan.months === 12 ? "1 year" : `${plan.months} months`;
                            return <button key={plan.months} type="button" className={plan.months === installmentMonths ? "is-active" : ""} onClick={() => setInstallmentMonths(plan.months)} role="radio" aria-checked={plan.months === installmentMonths}><b>{label}</b></button>;
                          })}
                        </div>
                        <div className="installment-result" aria-live="polite"><div><span>{locale === "ro" ? "Rata lunara" : locale === "ru" ? "Ваш ежемесячный платёж" : "Your monthly payment"}</span><strong>€{rentalPrice.toFixed(2)}<em>{c.perMonth}</em></strong></div><p>{locale === "ro" ? "Total:" : locale === "ru" ? "Итого:" : "Total:"} <b>€{installmentTotal}</b></p></div>
                      </>
                    ) : (
                      <>
                        <div className="rental-service-options" role="radiogroup" aria-label={locale === "ro" ? "Servicii pentru chirie" : locale === "ru" ? "Услуги для аренды" : "Rental services"}>
                          <div className="rental-service-choice">
                            <button type="button" className={`rental-service-option ${rentalServiceTier === "with-services" ? "is-active" : ""}`} onClick={() => setRentalServiceTier("with-services")} role="radio" aria-checked={rentalServiceTier === "with-services"}>
                              <b>{locale === "ro" ? "Cu servicii suplimentare" : locale === "ru" ? "С дополнительными услугами" : "With additional services"}</b>
                              <span className="rental-service-supplement">+€40{c.perMonth}</span>
                            </button>
                            <div className="rental-services-info" onMouseEnter={() => setRentalServicesInfoOpen("with-services")} onMouseLeave={() => setRentalServicesInfoOpen(null)}>
                              <button type="button" className="rental-services-info-button" aria-label={locale === "ro" ? "Vezi serviciile incluse" : locale === "ru" ? "Посмотреть включённые услуги" : "View included services"} aria-expanded={rentalServicesInfoOpen === "with-services"} aria-describedby={rentalServicesInfoOpen === "with-services" ? "with-services-tooltip" : undefined} onClick={() => setRentalServicesInfoOpen("with-services")} onFocus={() => setRentalServicesInfoOpen("with-services")} onBlur={() => setRentalServicesInfoOpen(null)}>i</button>
                              {rentalServicesInfoOpen === "with-services" && <div id="with-services-tooltip" className="rental-services-tooltip" role="tooltip"><strong>{locale === "ro" ? "Incluse în abonament" : locale === "ru" ? "Включено в подписку" : "Included in the subscription"}</strong><span>{locale === "ro" ? "Găzduire web — €10" : locale === "ru" ? "Веб-хостинг — €10" : "Web hosting — €10"}</span><span>{locale === "ro" ? "Mentenanță tehnică — €20" : locale === "ru" ? "Техническая поддержка — €20" : "Technical maintenance — €20"}</span><span>{locale === "ro" ? "Securitate și backup — €10" : locale === "ru" ? "Безопасность и резервные копии — €10" : "Security and backups — €10"}</span></div>}
                            </div>
                          </div>
                          <div className="rental-service-choice">
                            <button type="button" className={`rental-service-option ${rentalServiceTier === "without-services" ? "is-active" : ""}`} onClick={() => setRentalServiceTier("without-services")} role="radio" aria-checked={rentalServiceTier === "without-services"}>
                              <b>{locale === "ro" ? "Fără servicii suplimentare" : locale === "ru" ? "Без дополнительных услуг" : "Without additional services"}</b>
                            </button>
                            <div className="rental-services-info" onMouseEnter={() => setRentalServicesInfoOpen("without-services")} onMouseLeave={() => setRentalServicesInfoOpen(null)}>
                              <button type="button" className="rental-services-info-button" aria-label={locale === "ro" ? "Vezi serviciile neincluse" : locale === "ru" ? "Посмотреть услуги, которые не включены" : "View services not included"} aria-expanded={rentalServicesInfoOpen === "without-services"} aria-describedby={rentalServicesInfoOpen === "without-services" ? "without-services-tooltip" : undefined} onClick={() => setRentalServicesInfoOpen("without-services")} onFocus={() => setRentalServicesInfoOpen("without-services")} onBlur={() => setRentalServicesInfoOpen(null)}>i</button>
                              {rentalServicesInfoOpen === "without-services" && <div id="without-services-tooltip" className="rental-services-tooltip" role="tooltip"><strong>{locale === "ro" ? "Nu sunt incluse" : locale === "ru" ? "Не включено" : "Not included"}</strong><span>{locale === "ro" ? "Găzduire web" : locale === "ru" ? "Веб-хостинг" : "Web hosting"}</span><span>{locale === "ro" ? "Mentenanță tehnică" : locale === "ru" ? "Техническая поддержка" : "Technical maintenance"}</span><span>{locale === "ro" ? "Securitate și backup" : locale === "ru" ? "Безопасность и резервные копии" : "Security and backups"}</span></div>}
                            </div>
                          </div>
                        </div>
                        <div className="installment-result rental-result" aria-live="polite"><div><span>{locale === "ro" ? "Chiria ta lunară" : locale === "ru" ? "Ваша ежемесячная аренда" : "Your monthly rental"}</span><strong>{rentalMonthlyPriceLabel}<em>{c.perMonth}</em></strong></div></div>
                      </>
                    )}
                  </div>
                  {paymentMode !== "rental" && <ul>
                    {paymentIncludes.map((item) => <li key={item}><Check />{item}</li>)}
                  </ul>}
                </aside>
                <div className="detail-sections" aria-label={locale === "ro" ? "Ce primești" : locale === "ru" ? "Что входит" : "What is included"}>
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
                  ) : "demo" in selectedDetail && typeof selectedDetail.demo === "string" && selectedDetail.demo ? (
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
                  <a className="rent-link" href={paymentHref}>
                    <span>{paymentMode === "installments" ? `${locale === "ro" ? "Cumpără în rate de la" : locale === "ru" ? "Купить в рассрочку от" : "Buy in installments from"} €${rentalPrice.toFixed(2)}` : `${c.rentFor} ${rentalMonthlyPriceLabel}`}<small>{c.perMonth}</small></span> <ArrowRight />
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
