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
import { FooterLinks } from "./components/seo-shell";
import { gardenProjects } from "./garden-projects";
import { projects, publicProjects, projectSlugs, projectPaths, hiddenCategories, unavailableProjectIds, launchProjectIds, getProject, projectHref, monthlyRentalPrice, annualInstallmentPrice, installmentPlans, type Platform, type MobileOS, type PaymentMode, type RentalServiceTier } from "./lib/project-catalog";
import { localePath } from "./lib/site-config";
import "./globals.css";
import "./why-section.css";
import "./launch-visuals.css";
import "./project-pages.css";
import "./home-hero.css";
import {
  copy,
  Locale,
  locales,
  localDescription,
  localType,
  showcaseCopy,
  visualCopy,
} from "./i18n";

const platformCopy = {
  ro: {"label":"Alege platforma","web":"Proiecte Web","mobile":"Aplica\u021bii Mobile","webDesc":"Site-uri, magazine online \u0219i platforme web","mobileDesc":"Aplica\u021bii pentru Android \u0219i iOS","soon":"\u00cen cur\u00e2nd","all":"Toate","empty":"Urm\u0103toarea idee \u00eencape \u00een buzunar.","detail":"Proiectele mobile pentru Android \u0219i iOS vor ap\u0103rea aici. Ai deja o idee de aplica\u021bie? Hai s\u0103 o discut\u0103m.","contact":"Discut\u0103m aplica\u021bia ta","available":"proiecte","os":"Sistem de operare"},
  en: { label: "Choose a platform", web: "Web Projects", mobile: "Mobile Apps", webDesc: "Websites, online stores and web platforms", mobileDesc: "Apps for Android and iOS", soon: "Coming soon", all: "All", empty: "Your next idea fits in your pocket.", detail: "Mobile projects for Android and iOS will appear here. Already have an app idea? Let's talk.", contact: "Let's discuss your app", available: "projects", os: "Operating system" },
  ru: {"label":"\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0443","web":"\u0412\u0435\u0431-\u043f\u0440\u043e\u0435\u043a\u0442\u044b","mobile":"\u041c\u043e\u0431\u0438\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f","webDesc":"\u0421\u0430\u0439\u0442\u044b, \u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043c\u0430\u0433\u0430\u0437\u0438\u043d\u044b \u0438 \u0432\u0435\u0431-\u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u044b","mobileDesc":"\u041f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u0434\u043b\u044f Android \u0438 iOS","soon":"\u0421\u043a\u043e\u0440\u043e","all":"\u0412\u0441\u0435","empty":"\u0412\u0430\u0448\u0430 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0430\u044f \u0438\u0434\u0435\u044f \u2014 \u0432 \u043a\u0430\u0440\u043c\u0430\u043d\u0435.","detail":"\u0417\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043c\u043e\u0431\u0438\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b \u0434\u043b\u044f Android \u0438 iOS. \u0423\u0436\u0435 \u0435\u0441\u0442\u044c \u0438\u0434\u0435\u044f \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f? \u0414\u0430\u0432\u0430\u0439\u0442\u0435 \u043e\u0431\u0441\u0443\u0434\u0438\u043c.","contact":"\u041e\u0431\u0441\u0443\u0434\u0438\u0442\u044c \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435","available":"\u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432","os":"\u041e\u043f\u0435\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u0430"},
};
const gamesPlatformCopy = {
  ro: { empty: "Următorul tău joc începe aici.", detail: "Jocurile pentru Android și iOS vor apărea aici. Ai o idee de joc? Hai să o discutăm.", contact: "Discutăm jocul tău", collection: "GAME COLLECTION", caption: "SMALL SCREEN. BIG ADVENTURES." },
  en: { empty: "Your next game starts here.", detail: "Games for Android and iOS will appear here. Already have a game idea? Let's talk.", contact: "Let's discuss your game", collection: "GAME COLLECTION", caption: "SMALL SCREEN. BIG ADVENTURES." },
  ru: { empty: "Ваша следующая игра начинается здесь.", detail: "Здесь появятся игры для Android и iOS. Уже есть идея игры? Давайте обсудим.", contact: "Обсудить вашу игру", collection: "GAME COLLECTION", caption: "SMALL SCREEN. BIG ADVENTURES." },
};
const filters = [
  "Toate",
  ...new Set(projects.map((project) => project.type)),
];
// Păstrăm proiectele și categoriile în cod, dar le putem retrage temporar din catalog.
function readPreference(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function writePreference(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ }
}
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
    search: "Search projects, categories or technologies",
    sort: "Newest first",
    low: "Price: low to high",
    high: "Price: high to low",
    more: "More",
    empty: "No projects match these filters.",
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
      {hasLivePreview && <StaticProjectPreview slug={projectSlugs[project.id]} title={project.title} description={localDescription(project.id, project.desc, locale)} />}
      {hasProjectPreview && !hasLivePreview && <StaticProjectPreview slug={projectSlugs[project.id]} title={project.title} description={localDescription(project.id, project.desc, locale)} />}
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
          width={800} height={667} loading="lazy" decoding="async"
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

export default function Home({ initialLocale = "ro" }: { initialLocale?: Locale }) {
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
  const [recommendedOrder, setRecommendedOrder] = useState<number[] | null>(null);
  useEffect(() => {
    const openings = Number.parseInt(readPreference(recommendedOpeningStorageKey) ?? "0", 10) || 0;
    writePreference(recommendedOpeningStorageKey, String(openings + 1));
    const frame = window.requestAnimationFrame(() => {
      if ((openings + 1) % 3 === 0) setRecommendedOrder(shuffledProjectIds());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const [visibleProjectCount, setVisibleProjectCount] = useState(PROJECT_PAGE_SIZE);
  const [menu, setMenu] = useState(false);
  const [activeNav, setActiveNav] = useState<"proiecte" | "proces" | null>(null);
  const locale = initialLocale;
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
  const platformLabels = {
    web: { title: "WEB", description: pc.webDesc, devices: "WEB / BROWSER" },
    mobile: { title: "MOBILE", description: pc.mobileDesc, devices: "ANDROID / iOS" },
    games: { title: locale === "ro" ? "JOCURI" : locale === "ru" ? "\u0418\u0413\u0420\u042b" : "GAMES", description: locale === "ro" ? "Jocuri pentru Android \u0219i iOS" : locale === "ru" ? "\u0418\u0433\u0440\u044b \u0434\u043b\u044f Android \u0438 iOS" : "Games for Android and iOS", devices: "ANDROID / iOS" },
  };
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
  const contactHref = localePath(locale, "contact");
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
    ? `${contactHref}?${new URLSearchParams({ project: selected.title, option: `installments-${installmentMonths}-months` })}`
    : contactHref;
  const rentalHref = selected
    ? `${contactHref}?${new URLSearchParams({ project: selected.title, option: `site-rental-${rentalServiceTier}` })}`
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
  const selectedDetail = selected ? getProject(locale, projectSlugs[selected.id])?.detail : null;
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
      // Route locale is authoritative; browser storage never rewrites page language.
      writePreference("mono-locale", locale);
      if (projectId && publicProjects.some((project) => project.id === Number(projectId))) {
        window.location.replace(projectHref(locales.includes(urlLocale as Locale) ? urlLocale as Locale : locale, Number(projectId)));
      } else if (locales.includes(urlLocale as Locale) && urlLocale !== locale) {
        url.pathname = localePath(urlLocale as Locale);
        url.searchParams.delete("lang");
        window.location.replace(url);
      }
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, [locale]);
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
  const rememberLocale = (nextLocale: Locale, event: React.MouseEvent<HTMLAnchorElement>) => {
    writePreference("mono-locale", nextLocale);
    const target = new URL(window.location.href);
    target.pathname = localePath(nextLocale);
    target.searchParams.delete("lang");
    if (Object.values(projectSlugs).includes(target.searchParams.get("proiect") ?? "")) target.searchParams.delete("proiect");
    event.currentTarget.href = target.href;
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
    url.searchParams.delete("proiect");
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
              <a
                href={localePath(language)}
                key={language}
                className={locale === language ? "active" : ""}
                onClick={(event) => rememberLocale(language, event)}
                data-analytics-event="language_change" data-language={language}
                lang={language}
                aria-label={`${c.language}: ${language.toUpperCase()}`}
                aria-current={locale === language ? "page" : undefined}
              >
                {locale === language && (
                  <motion.span
                    className="rail-language-active"
                    layoutId="rail-language-active"
                    transition={{ type: "spring", stiffness: 460, damping: 30 }}
                  />
                )}
                <span>{language.toUpperCase()}</span>
              </a>
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
          <a href={localePath(locale, "intrebari")}>{c.questions}</a>
          <a href={contactHref}>{c.nav[2]}</a>
        </div>
        <div className="language-switch" aria-label={c.language}>
          {locales.map((language) => (
            <a
              href={localePath(language)}
              key={language}
              className={locale === language ? "active" : ""}
              onClick={(event) => rememberLocale(language, event)}
                data-analytics-event="language_change" data-language={language}
              lang={language}
            >
              {language.toUpperCase()}
            </a>
          ))}
        </div>
        <a
          className="account-link"
          href={"/cabinet"}
          aria-label={{ ro: "Cabinet personal", ru: "Личный кабинет", en: "Personal area" }[locale]}
          title={{ ro: "Cabinet personal", ru: "Личный кабинет", en: "Personal area" }[locale]}
        >
          <UserRound size={20} />
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
            <a href={localePath(locale, "intrebari")} onClick={() => setMenu(false)}>
              {c.questions}
            </a>
            <a href={contactHref} onClick={() => setMenu(false)}>
              {c.nav[2]}
            </a>
            <a
              className="mobile-account-link"
              href={"/cabinet"}
              onClick={() => setMenu(false)}
              aria-label={{ ro: "Cabinet personal", ru: "Личный кабинет", en: "Personal area" }[locale]}
              title={{ ro: "Cabinet personal", ru: "Личный кабинет", en: "Personal area" }[locale]}
            >
              <UserRound size={20} />
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
        <h1 className="hero-title">
          <span className="hero-title-line">{c.heroA}</span>
          <span className="hero-title-line hero-title-accent"><em>{c.heroB}</em></span>
        </h1>
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
        <div className="platform-picker" role="group" aria-label={pc.label}>
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
                aria-label={locale === "ro" ? "\u0218terge c\u0103utarea" : locale === "ru" ? "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c \u043f\u043e\u0438\u0441\u043a" : "Clear search"}
                title={locale === "ro" ? "\u0218terge c\u0103utarea" : locale === "ru" ? "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c \u043f\u043e\u0438\u0441\u043a" : "Clear search"}
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
                      const clicks = Number.parseInt(readPreference(recommendedClickStorageKey) ?? "0", 10) || 0;
                      const nextClicks = clicks + 1;
                      writePreference(recommendedClickStorageKey, String(nextClicks));
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
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
              >
                <button
                  type="button"
                  className="project-preview-trigger"
                  aria-labelledby={`project-preview-label-${project.id} project-card-title-${project.id}`}
                  data-analytics-event="project_open" data-project={projectSlugs[project.id]}
                  onClick={() => openProject(project)}
                ><span className="sr-only" id={`project-preview-label-${project.id}`}>{c.viewDetails}</span></button>
                <ProjectVisual project={project} locale={locale} />
                <div className="card-info">
                  <div>
                    <span className="type">
                      {localType(project.type, locale)}
                    </span>
                    <h3 id={`project-card-title-${project.id}`}>{project.title}</h3>
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
                <a className="project-page-link" href={projectHref(locale, project.id)} data-analytics-event="project_open" data-project={projectSlugs[project.id]}>
                  {c.viewDetails} - {project.title} <ArrowRight size={15} aria-hidden="true" />
                </a>
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
      <aside className="partner-strip" id="parteneri" aria-label="Parteneri">
        <a
          className="partner-strip-logo partner-strip-market9000"
          href="https://market9000.md/"
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label="Market9000.md"
        >
          <strong>market9000<span>.md</span></strong>
        </a>
        <a
          className="partner-strip-logo partner-strip-micora"
          href="/micora/"
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label="Micora"
        >
          <strong>MICORA</strong>
        </a>
      </aside>
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
        <FooterLinks locale={locale} />
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
                      <button type="button" className={paymentMode === "installments" ? "is-active" : ""} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option="installments" onClick={() => setPaymentMode("installments")} role="radio" aria-checked={paymentMode === "installments"}>
                        {locale === "ro" ? "Cumpără în rate" : locale === "ru" ? "В рассрочку" : "Installments"}
                      </button>
                      <button type="button" className={paymentMode === "rental" ? "is-active" : ""} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option="rental" onClick={() => setPaymentMode("rental")} role="radio" aria-checked={paymentMode === "rental"}>
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
                            return <button key={plan.months} type="button" className={plan.months === installmentMonths ? "is-active" : ""} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option={`installments-${plan.months}-months`} onClick={() => setInstallmentMonths(plan.months)} role="radio" aria-checked={plan.months === installmentMonths}><b>{label}</b></button>;
                          })}
                        </div>
                        <div className="installment-result" aria-live="polite"><div><span>{locale === "ro" ? "Rata lunara" : locale === "ru" ? "Ваш ежемесячный платёж" : "Your monthly payment"}</span><strong>€{rentalPrice.toFixed(2)}<em>{c.perMonth}</em></strong></div><p>{locale === "ro" ? "Total:" : locale === "ru" ? "Итого:" : "Total:"} <b>€{installmentTotal}</b></p></div>
                      </>
                    ) : (
                      <>
                        <div className="rental-service-options" role="radiogroup" aria-label={locale === "ro" ? "Servicii pentru chirie" : locale === "ru" ? "Услуги для аренды" : "Rental services"}>
                          <div className="rental-service-choice">
                            <button type="button" className={`rental-service-option ${rentalServiceTier === "with-services" ? "is-active" : ""}`} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option="site-rental-with-services" onClick={() => setRentalServiceTier("with-services")} role="radio" aria-checked={rentalServiceTier === "with-services"}>
                              <b>{locale === "ro" ? "Cu servicii suplimentare" : locale === "ru" ? "С дополнительными услугами" : "With additional services"}</b>
                              <span className="rental-service-supplement">+€40{c.perMonth}</span>
                            </button>
                            <div className="rental-services-info" onMouseEnter={() => setRentalServicesInfoOpen("with-services")} onMouseLeave={() => setRentalServicesInfoOpen(null)}>
                              <button type="button" className="rental-services-info-button" aria-label={locale === "ro" ? "Vezi serviciile incluse" : locale === "ru" ? "Посмотреть включённые услуги" : "View included services"} aria-expanded={rentalServicesInfoOpen === "with-services"} aria-describedby={rentalServicesInfoOpen === "with-services" ? "with-services-tooltip" : undefined} onClick={() => setRentalServicesInfoOpen("with-services")} onFocus={() => setRentalServicesInfoOpen("with-services")} onBlur={() => setRentalServicesInfoOpen(null)}>i</button>
                              {rentalServicesInfoOpen === "with-services" && <div id="with-services-tooltip" className="rental-services-tooltip" role="tooltip"><strong>{locale === "ro" ? "Incluse în abonament" : locale === "ru" ? "Включено в подписку" : "Included in the subscription"}</strong><span>{locale === "ro" ? "Găzduire web — €10" : locale === "ru" ? "Веб-хостинг — €10" : "Web hosting — €10"}</span><span>{locale === "ro" ? "Mentenanță tehnică — €20" : locale === "ru" ? "Техническая поддержка — €20" : "Technical maintenance — €20"}</span><span>{locale === "ro" ? "Securitate și backup — €10" : locale === "ru" ? "Безопасность и резервные копии — €10" : "Security and backups — €10"}</span></div>}
                            </div>
                          </div>
                          <div className="rental-service-choice">
                            <button type="button" className={`rental-service-option ${rentalServiceTier === "without-services" ? "is-active" : ""}`} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option="site-rental-without-services" onClick={() => setRentalServiceTier("without-services")} role="radio" aria-checked={rentalServiceTier === "without-services"}>
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
                    <a className="demo-link" href={projectPaths[selected.id]} data-analytics-event="demo_open" data-project={projectSlugs[selected.id]}>
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
                  <a className="project-page-link" href={projectHref(locale, selected.id)} data-analytics-event="project_open" data-project={projectSlugs[selected.id]}>{c.viewDetails} - {selected.title}</a>
                  <a className="buy-link" href={`${contactHref}?${new URLSearchParams({ project: selected.title, option: "purchase" })}`} data-analytics-event="project_request" data-project={projectSlugs[selected.id]}>
                    {c.buyFor} €{selected.price} <ArrowRight />
                  </a>
                  <a className="rent-link" href={paymentHref} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option={paymentMode}>
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
