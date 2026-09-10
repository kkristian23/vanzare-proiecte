import projectPrices from "../project-prices.json";
import { gardenProjects } from "../garden-projects";
import { newProjectDetails } from "../new-project-details";
import { newProjectTranslations } from "../new-project-translations";
import { localDescription, localType, type Locale } from "../i18n";
import { localePath } from "./site-config";
import { legacyProjectDetails } from "./legacy-project-translations";
import { projectImages } from "./project-images";

export type Platform = "web" | "mobile" | "games";
export type MobileOS = "all" | "android" | "ios";
export type PaymentMode = "installments" | "rental";
export type RentalServiceTier = "with-services" | "without-services";
export type Project = {
  id: number; title: string; type: string; price: number; tone: string; seoEnabled: boolean;
  desc: string; stack: string[]; platform?: Platform;
  mobileOS?: ("android" | "ios")[];
};

export const monthlyRentalPrice = (price: number) => Number((price / 18).toFixed(2));
export const annualInstallmentPrice = (price: number) => Math.ceil(price / 12 / 5) * 5;
export const installmentPlans = [
  { months: 3, surcharge: 0 },
  { months: 6, surcharge: 0.05 },
  { months: 12, surcharge: 0.08 },
] as const;

export const projectCatalog: Project[] = [
  ...gardenProjects.map((project) => ({
    id: project.id,
    seoEnabled: project.seoEnabled,
    title: project.title,
    type: "Gardens & Landscaping",
    price: project.price,
    tone: project.slug,
    desc: project.copy.ro.description,
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "React Hook Form", "Zod"],
  })),
  {
    id: 66,
    seoEnabled: false,
    title: "EVENTORA",
    type: "Calendar & Events",
    price: 650,
    tone: "eventora",
    desc: "Afișe de concerte și catalog de bilete.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 65,
    seoEnabled: false,
    title: "SCENA CITY",
    type: "Calendar & Events",
    price: 650,
    tone: "scena-city",
    desc: "Ghid cultural editorial cu agendă cronologică.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 64,
    seoEnabled: false,
    title: "PULSE TICKETS",
    type: "Calendar & Events",
    price: 650,
    tone: "pulse-tickets",
    desc: "Consolă pentru organizatori și registru de participanți.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 63,
    seoEnabled: false,
    title: "CLINICA NOVA",
    type: "Clinics & Medical",
    price: 950,
    tone: "clinica-nova",
    desc: "Prezentare de clinică, specialități și echipă.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 62,
    seoEnabled: false,
    title: "LABORIS",
    type: "Clinics & Medical",
    price: 950,
    tone: "laboris",
    desc: "Catalog de analize cu listă de recoltare.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 61,
    seoEnabled: false,
    title: "DOCTOR APROAPE",
    type: "Clinics & Medical",
    price: 950,
    tone: "doctor-aproape",
    desc: "Director de medici cu disponibilitate pe zile.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 60,
    seoEnabled: false,
    title: "MEDSLOT",
    type: "Clinics & Medical",
    price: 950,
    tone: "med-slot",
    desc: "Selecție ghidată de consultații în trei pași.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 59,
    seoEnabled: false,
    title: "LEADPILOT",
    type: "CRM & Sales",
    price: 1200,
    tone: "lead-pilot",
    desc: "Panou de oportunități pe etape comerciale.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 58,
    seoEnabled: false,
    title: "GROWTHDESK",
    type: "CRM & Sales",
    price: 1200,
    tone: "growth-desk",
    desc: "Bază de contacte și segmentare pentru marketing.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 57,
    seoEnabled: false,
    title: "CLOSEFLOW",
    type: "CRM & Sales",
    price: 1200,
    tone: "closeflow",
    desc: "Inbox comercial cu conversații și fișe de contact.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 56,
    seoEnabled: false,
    title: "PARTMATCH",
    type: "E-commerce & Auto",
    price: 850,
    tone: "partmatch",
    desc: "Magazin de piese cu selecție dependentă de vehicul.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 55,
    seoEnabled: false,
    title: "GARAGEBOX",
    type: "E-commerce & Auto",
    price: 850,
    tone: "garage-box",
    desc: "Banc de lucru pentru atelier și inventar OEM.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 54,
    seoEnabled: false,
    title: "MOTORSUPPLY",
    type: "E-commerce & Auto",
    price: 850,
    tone: "motor-supply",
    desc: "Aprovizionare angro prin tabel și deviz.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 53,
    seoEnabled: false,
    title: "AUTOGRID",
    type: "E-commerce & Auto",
    price: 850,
    tone: "auto-grid",
    desc: "Comparație de kituri aftermarket și service.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 52,
    seoEnabled: false,
    title: "LUMA SUITES",
    type: "Hotels & Travel",
    price: 900,
    tone: "park-suites-demo",
    desc: "Prezentare arhitecturală de apartamente urbane.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 51,
    seoEnabled: false,
    title: "URBAN HAVEN",
    type: "Hotels & Travel",
    price: 900,
    tone: "urban-haven",
    desc: "Hotel cu experiențe de cazare, spa și restaurant.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 50,
    seoEnabled: false,
    title: "NEST COLLECTION",
    type: "Hotels & Travel",
    price: 900,
    tone: "nest-collection",
    desc: "Colecție de apartamente cu galerie asimetrică.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 49,
    seoEnabled: false,
    title: "MOLDOVA ESCAPE",
    type: "Hotels & Travel",
    price: 900,
    tone: "moldova-escape",
    desc: "Planificator de escapade și itinerar.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 48,
    seoEnabled: false,
    title: "BAZAR LOCAL",
    type: "Marketplace",
    price: 1000,
    tone: "bazar-local",
    desc: "Anunțuri locale pe categorii și localități.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 47,
    seoEnabled: false,
    title: "PREȚ BUN",
    type: "Marketplace",
    price: 1000,
    tone: "pret-bun",
    desc: "Comparator de oferte și istoric de preț.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 46,
    seoEnabled: false,
    title: "LOCALCRAFT",
    type: "Marketplace",
    price: 1000,
    tone: "local-craft",
    desc: "Piață de artizanat cu povești și personalizare.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 45,
    seoEnabled: false,
    title: "SKILLUP",
    type: "Online Education",
    price: 750,
    tone: "skillup",
    desc: "Studio de cursuri practice și lecții de probă.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 44,
    seoEnabled: false,
    title: "CIVICLEARN",
    type: "Online Education",
    price: 750,
    tone: "civic-learn",
    desc: "Portal instituțional cu program și evaluare.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 43,
    seoEnabled: false,
    title: "MENTORCLOUD",
    type: "Online Education",
    price: 750,
    tone: "mentor-cloud",
    desc: "Trasee de carieră cu exerciții și mentorat.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 42,
    seoEnabled: false,
    title: "CASACHECK",
    type: "Real Estate",
    price: 900,
    tone: "casa-check",
    desc: "Catalog de proprietăți și dosare comparative.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 41,
    seoEnabled: false,
    title: "DIRECTHOME",
    type: "Real Estate",
    price: 900,
    tone: "direct-home",
    desc: "Locuințe direct de la proprietar și agendă.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 40,
    seoEnabled: false,
    title: "AREA INSIGHT",
    type: "Real Estate",
    price: 900,
    tone: "area-insight",
    desc: "Atlas interactiv de cartiere și indicatori.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 39,
    seoEnabled: false,
    title: "TABLEFLOW",
    type: "Restaurants & Food",
    price: 700,
    tone: "table-flow",
    desc: "Restaurante și plan interactiv de sală.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 38,
    seoEnabled: false,
    title: "FOODROUTE",
    type: "Restaurants & Food",
    price: 700,
    tone: "food-route",
    desc: "Meniu de livrare cu coș lateral și urmărire.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 37,
    seoEnabled: false,
    title: "MENU STUDIO",
    type: "Restaurants & Food",
    price: 700,
    tone: "menu-studio",
    desc: "Bistro editorial și meniu sezonier.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 36,
    seoEnabled: false,
    title: "MYUTILITY",
    type: "Utility Management",
    price: 1100,
    tone: "my-utility",
    desc: "Cont de consumator pentru facturi și contor.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 35,
    seoEnabled: false,
    title: "BLOCKADMIN",
    type: "Utility Management",
    price: 1100,
    tone: "block-admin",
    desc: "Comunitate de bloc, avizier și participare.",
    stack: ["Next.js 15","React 19","TypeScript 5.9","CSS responsive","Stocare locală"],
  },
  {
    id: 34,
    seoEnabled: false,
    title: "AUTOFLOW PARTNER",
    type: "Service Management",
    price: 1300,
    tone: "autoflow",
    desc: "Platformă operațională multi-tenant pentru service-uri auto, cu programări, lucrări, clienți, stoc, parteneri și rapoarte într-un singur sistem",
    stack: ["Next.js", "React", "TypeScript", "NestJS", "PostgreSQL", "Prisma", "Multi-tenant", "RBAC", "PWA", "Inventory Ledger"],
  },
  {
    id: 33,
    seoEnabled: false,
    title: "DRIVOLT",
    type: "E-commerce & Auto",
    price: 500,
    tone: "drivolt",
    desc: "Magazin online auto cu catalog, promoții, căutare, favorite, coș, branduri și servicii de instalare într-o experiență responsive",
    stack: ["React", "Vite", "JavaScript", "E-commerce", "Product Search", "Shopping Cart", "Responsive Design", "Interactive UI"],
  },
  {
    id: 32,
    seoEnabled: false,
    title: "FLOW CRM",
    type: "CRM & Sales",
    price: 1000,
    tone: "flowcrm",
    desc: "Workspace SaaS pentru lead-uri, clienți, pipeline, oferte, automatizări și raportarea completă a vânzărilor",
    stack: ["Next.js", "React", "TypeScript", "Supabase", "Multi-tenant", "RBAC", "Sales Pipeline", "Automations", "AI Assistant"],
  },
  {
    id: 31,
    seoEnabled: false,
    title: "ACADEMIA",
    type: "Online Education",
    price: 600,
    tone: "academia",
    desc: "Platformă LMS premium cu programe de studiu, cursuri, lecții, progres, quiz-uri și experiențe pentru instructori",
    stack: ["Next.js", "React", "TypeScript", "LMS", "Course Player", "Progress Tracking", "Quizzes", "Certificates", "Responsive Design"],
  },
  {
    id: 30,
    seoEnabled: false,
    title: "STAYNEST",
    type: "Hotels & Travel",
    price: 1200,
    tone: "staynest",
    desc: "Experiență digitală pentru boutique hotel, cu proprietăți, camere, disponibilitate, tarife și rezervare directă",
    stack: ["Next.js", "React", "TypeScript", "Booking Engine", "Room Inventory", "Dynamic Rates", "Stripe", "Supabase", "RO / RU / EN"],
  },
  {
    id: 29,
    seoEnabled: false,
    title: "TABLEO",
    type: "Restaurants & Food",
    price: 800,
    tone: "tableo",
    desc: "Platformă premium pentru restaurant cu meniu digital, rezervări, comenzi online, checkout și mod operațional",
    stack: ["Next.js", "React", "TypeScript", "Digital Menu", "Reservations", "Online Orders", "Stripe", "QR Menu", "Responsive Design"],
  },
  {
    id: 28,
    seoEnabled: false,
    title: "MEDORA CLINIC",
    type: "Clinics & Medical",
    price: 1300,
    tone: "medora",
    desc: "Website medical premium cu specialități, medici, prețuri transparente și programare ghidată în șapte pași",
    stack: ["Next.js", "React", "TypeScript", "Drizzle ORM", "Booking Flow", "Medical Services", "RBAC", "RO / RU / EN", "Responsive Design"],
  },
  {
    id: 27,
    seoEnabled: false,
    title: "IMOBILIA ONE",
    type: "Real Estate",
    price: 700,
    tone: "imobilia",
    desc: "Platformă imobiliară premium cu proprietăți, căutare avansată, cartiere, favorite, vizionări și administrare",
    stack: ["Next.js", "React", "TypeScript", "Supabase", "Property Search", "Mapbox", "Saved Searches", "Admin Panel", "RO / RU / EN"],
  },
  {
    id: 26,
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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
    seoEnabled: false,
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

export const projects: Project[] = projectCatalog.map((project) => ({
  ...project,
  price: pricesByProjectId.get(project.id) ?? project.price,
}));

export const hiddenCategories = new Set(["AI Website Factory"]);
export const unavailableProjectIds = new Set<number>();

export const projectSlugs: Record<number, string> = {
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

export const projectPaths: Record<number, string> = {
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

export const launchProjectIds = new Set(Array.from({ length: 40 }, (_, index) => 27 + index));

export const projectDetails: Record<
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

export const projectCurrency = "EUR" as const;
export const categoryServiceSlugs: Record<string, string> = { "Clinics & Medical": "clinic-websites", "Restaurants & Food": "restaurant-websites", "Real Estate": "real-estate-websites", "E-commerce & Auto": "ecommerce", "Mobilă": "ecommerce", "Marketplace": "ecommerce", "CRM & Sales": "web-applications", "Service Management": "web-applications", "Utility Management": "web-applications", "Calendar & Events": "web-applications", "Online Education": "web-applications", "Equipment Rental": "web-applications", "Interior Design": "web-design" };
export const publicProjects = projects.filter((project) =>
  !hiddenCategories.has(project.type) && !unavailableProjectIds.has(project.id),
).map((project) => ({ ...project, slug: projectSlugs[project.id], available: true, currency: projectCurrency }));

export const projectHref = (locale: Locale, id: number) => localePath(locale, `projects/${projectSlugs[id]}`);

/** Localized view of the same catalog used by cards, modal, pages and sitemap. */
export function getProject(locale: Locale, slug: string) {
  const project = publicProjects.find((entry) => entry.slug === slug);
  if (!project) return undefined;
  const description = localDescription(project.id, project.desc, locale);
  const detail = locale === "ro"
    ? newProjectDetails[project.id] ?? projectDetails[project.id]
    : newProjectTranslations[locale].newProjectDetails[project.id] ?? legacyProjectDetails(locale, project);
  if (!detail) throw new Error(`Missing project detail: ${locale}/${slug}`);
  const image = projectImages[slug];
  return {
    ...project, description, detail,
    category: localType(project.type, locale),
    demo: projectPaths[project.id],
    image: image ? { ...image, alt: `${{ ro: "Captură", ru: "Снимок экрана", en: "Screenshot" }[locale]} ${project.title} — ${description}` } : undefined,
  };
}
