"use client";
import { CatalogPrice } from "./components/catalog-price";
import { CmsMedia } from "./components/cms-media";
import { paymentSettings, projectPrice, slotImages } from "./lib/cms-store";
import { siteConfig } from "./lib/site-config";
import { cmsContent, cmsText } from "./lib/cms-store";
import { useCms } from "./components/cms-live";
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

const platformCopy = cmsContent("home-client-platformCopy", {
  ro: {"label":"Alege platforma","web":"Proiecte Web","mobile":"Aplica\u021bii Mobile","webDesc":"Site-uri, magazine online \u0219i platforme web","mobileDesc":"Aplica\u021bii pentru Android \u0219i iOS","soon":"\u00cen cur\u00e2nd","all":"Toate","empty":"Urm\u0103toarea idee \u00eencape \u00een buzunar.","detail":"Proiectele mobile pentru Android \u0219i iOS vor ap\u0103rea aici. Ai deja o idee de aplica\u021bie? Hai s\u0103 o discut\u0103m.","contact":"Discut\u0103m aplica\u021bia ta","available":"proiecte","os":"Sistem de operare"},
  en: { label: "Choose a platform", web: "Web Projects", mobile: "Mobile Apps", webDesc: "Websites, online stores and web platforms", mobileDesc: "Apps for Android and iOS", soon: "Coming soon", all: "All", empty: "Your next idea fits in your pocket.", detail: "Mobile projects for Android and iOS will appear here. Already have an app idea? Let's talk.", contact: "Let's discuss your app", available: "projects", os: "Operating system" },
  ru: {"label":"\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u0443","web":"\u0412\u0435\u0431-\u043f\u0440\u043e\u0435\u043a\u0442\u044b","mobile":"\u041c\u043e\u0431\u0438\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f","webDesc":"\u0421\u0430\u0439\u0442\u044b, \u0438\u043d\u0442\u0435\u0440\u043d\u0435\u0442-\u043c\u0430\u0433\u0430\u0437\u0438\u043d\u044b \u0438 \u0432\u0435\u0431-\u043f\u043b\u0430\u0442\u0444\u043e\u0440\u043c\u044b","mobileDesc":"\u041f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u0434\u043b\u044f Android \u0438 iOS","soon":"\u0421\u043a\u043e\u0440\u043e","all":"\u0412\u0441\u0435","empty":"\u0412\u0430\u0448\u0430 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0430\u044f \u0438\u0434\u0435\u044f \u2014 \u0432 \u043a\u0430\u0440\u043c\u0430\u043d\u0435.","detail":"\u0417\u0434\u0435\u0441\u044c \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f \u043c\u043e\u0431\u0438\u043b\u044c\u043d\u044b\u0435 \u043f\u0440\u043e\u0435\u043a\u0442\u044b \u0434\u043b\u044f Android \u0438 iOS. \u0423\u0436\u0435 \u0435\u0441\u0442\u044c \u0438\u0434\u0435\u044f \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f? \u0414\u0430\u0432\u0430\u0439\u0442\u0435 \u043e\u0431\u0441\u0443\u0434\u0438\u043c.","contact":"\u041e\u0431\u0441\u0443\u0434\u0438\u0442\u044c \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435","available":"\u043f\u0440\u043e\u0435\u043a\u0442\u043e\u0432","os":"\u041e\u043f\u0435\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u0430\u044f \u0441\u0438\u0441\u0442\u0435\u043c\u0430"},
});
const gamesPlatformCopy = cmsContent("home-client-gamesPlatformCopy", {
  ro: { empty: "Următorul tău joc începe aici.", detail: "Jocurile pentru Android și iOS vor apărea aici. Ai o idee de joc? Hai să o discutăm.", contact: "Discutăm jocul tău", collection: "GAME COLLECTION", caption: "SMALL SCREEN. BIG ADVENTURES." },
  en: { empty: "Your next game starts here.", detail: "Games for Android and iOS will appear here. Already have a game idea? Let's talk.", contact: "Let's discuss your game", collection: "GAME COLLECTION", caption: "SMALL SCREEN. BIG ADVENTURES." },
  ru: { empty: "Ваша следующая игра начинается здесь.", detail: "Здесь появятся игры для Android и iOS. Уже есть идея игры? Давайте обсудим.", contact: "Обсудить вашу игру", collection: "GAME COLLECTION", caption: "SMALL SCREEN. BIG ADVENTURES." },
});
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
const cleanFilterCopy = cmsContent("home-client-cleanFilterCopy", {
  ro: {
    moreCategories: "Mai multe categorii",
    categories: "Toate categoriile",
    less: "Ascunde categoriile",
    search: "Caut\u0103 proiecte",
    recommended: "Recomandate",
    discounts: "Reduceri",
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
    discounts: "\u0421\u043a\u0438\u0434\u043a\u0438",
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
    discounts: "Discounts",
    moreCategories: "More categories",
    categories: "All categories",
    less: "Hide categories",
  },
} as const);

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
  useCms();
  if (slotImages(`catalog-${projectSlugs[project.id]}`) !== undefined) return <div className="visual-frame visual-frame-preview"><div className="visual visual-with-preview"><CmsMedia slot={`catalog-${projectSlugs[project.id]}`} className="cms-card-cover" /></div></div>;
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
            <b>{cmsText("home-client", "literal-8ce86a6ae65d3692", "N")}</b>
            <span>
              {cmsText("home-client", "literal-9ffd4e2ce5e895e2", "NEO BOOKING")}<small>{s.universalAppointments}</small>
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
              <i>{cmsText("home-client", "literal-6b51d431df5d7f14", "12")}</i>
              <i>{cmsText("home-client", "literal-3fdba35f04dc8c46", "13")}</i>
              <i>{cmsText("home-client", "literal-8527a891e2241369", "14")}</i>
              <i>{cmsText("home-client", "literal-e629fa6598d73276", "15")}</i>
            </div>
            <div className="nbook-times">
              <span>{cmsText("home-client", "literal-90e1062f1578fa30", "10:00")}</span>
              <span>{cmsText("home-client", "literal-092ddb31314c3ecf", "11:30")}</span>
              <span>{cmsText("home-client", "literal-fb4506210213175c", "14:00")}</span>
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
            <b>{cmsText("home-client", "literal-0d6893699df7c545", "NEXA")}</b>
            <span>{cmsText("home-client", "literal-b8ccf6673f538364", "RENTAL")}</span>
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
            <span>{cmsText("home-client", "literal-98a2e62a422d751f", "JBL")}</span>
            <b>{cmsText("home-client", "literal-c8c3ef95290fab28", "PRX ONE")}</b>
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
            <b>{cmsText("home-client", "literal-f67ab10ad4e4c531", "F")}</b>
            <span>
              {cmsText("home-client", "literal-1b36eeed3b6bef2d", "FORGE")}<small>{cmsText("home-client", "literal-d55c4544d716ab67", "AI WEBSITE FACTORY")}</small>
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
            {cmsText("home-client", "literal-9afe6b7d258eac78", "STUDIO ")}<b>{cmsText("home-client", "literal-cc842085f135f5fe", "VELORA")}</b>
          </div>
          <div className="velora-portal">
            <i />
            <span>{cmsText("home-client", "literal-de5a6f78116eca62", "V")}</span>
          </div>
          <div className="velora-copy">
            <small>{s.veloraKicker}</small>
            <b>
              {s.veloraTitle[0]}
              <br />
              <em>{s.veloraTitle[1]}</em>
            </b>
          </div>
          <div className="velora-index">{cmsText("home-client", "literal-b0c52dd5ae43781d", "EST. 2012")}</div>
        </>
      )}
      {project.id === 22 && (
        <>
          <div className="sforma-brand">
            {cmsText("home-client", "literal-d6db93dd3031ab51", "STUDIO")}<span> {cmsText("home-client", "literal-3dfc44817dd6f207", " FORMA")}</span>
          </div>
          <div className="sforma-orbit">
            <i />
            <i />
            <b>{cmsText("home-client", "literal-f67ab10ad4e4c531", "F")}</b>
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
            {cmsText("home-client", "literal-02450e8c4b2f4251", "NOMA")}<sup>{cmsText("home-client", "literal-987e9568b2cad16c", "®")}</sup>
          </div>
          <div className="noma-arch">
            <i />
            <span>{cmsText("home-client", "literal-938db8c9f82c8cb5", "01")}</span>
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
            {cmsText("home-client", "literal-52e740adf6668a80", "POP")}<span>{cmsText("home-client", "literal-26853a14026f153b", "HAUS")}</span>
          </div>
          <div className="pophaus-orbit">
            <i />
            <i />
            <b>
              {cmsText("home-client", "literal-278f14e96cc67489", "GOOD")}<br />
              {cmsText("home-client", "literal-d5e11f353b4f561b", "MOOD")}</b>
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
            {cmsText("home-client", "literal-5cc73b86cdc1bcfa", "NORD ")}<i>{cmsText("home-client", "literal-951dcee3a7a4f3aa", "&")}</i> {cmsText("home-client", "literal-c5642952701df8a9", " OAK")}</div>
          <div className="nord-arch">
            <span />
            <b>{cmsText("home-client", "literal-938db8c9f82c8cb5", "01")}</b>
          </div>
          <div className="nord-copy">
            <small>{s.nordKicker}</small>
            <strong>
              {s.nordTitle[0]}
              <br />
              <i>{s.nordTitle[1]}</i>
            </strong>
          </div>
          <div className="nord-seed">{cmsText("home-client", "literal-e1b63228c6f361cd", "✶")}</div>
        </>
      )}
      {project.id === 18 && (
        <>
          <div className="forma-logo">
            {cmsText("home-client", "literal-fa57ccd5801fe208", "FORMA ")}<b>{cmsText("home-client", "literal-bf03bc369503fe42", "LIVING")}</b>
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
            {cmsText("home-client", "literal-0e22c9d21ed688fc", "ARCHI")}<span>{cmsText("home-client", "literal-fef812ed2bf63e7e", "CONTRACT")}</span>
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
            <b>{cmsText("home-client", "literal-6d7ee17bf3884e7f", "AC—24")}</b>
            <em>{s.readyRfq}</em>
          </div>
        </>
      )}
      {project.id === 16 && (
        <>
          <div className="noire-logo">
            {cmsText("home-client", "literal-d3da266dd84fcee3", "ATELIER ")}<i>{cmsText("home-client", "literal-c7301cedfeb51320", "NOIRE")}</i>
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
          <div className="noire-number">{cmsText("home-client", "literal-9e9bdeda6db58906", "N° 16")}</div>
        </>
      )}
      {project.id === 15 && (
        <>
          <div className="market-brand">
            <span>{cmsText("home-client", "literal-e4d693d24e646cb7", "market")}</span>
            <b>{cmsText("home-client", "literal-c4fe6b6dbe94790f", "9000")}</b>
          </div>
          <div className="market-search">
            {v.search}
            <i>{cmsText("home-client", "literal-c19732df495ef97e", "⌕")}</i>
          </div>
          <div className="market-categories">
            <span>
              {cmsText("home-client", "literal-a1965d92323ade25", "🏠")}<b>{v.estate}</b>
            </span>
            <span>
              {cmsText("home-client", "literal-3a3fbeedf9e3ad42", "🚗")}<b>{v.auto}</b>
            </span>
            <span>
              {cmsText("home-client", "literal-dfe7a8cc7286d32f", "🛠️")}<b>{v.services}</b>
            </span>
            <span>
              {cmsText("home-client", "literal-2566561f81db7a7c", "📱")}<b>{v.electronics}</b>
            </span>
          </div>
          <div className="market-listing">
            <small>
              <i /> {v.active}
            </small>
            <strong>
              {cmsText("home-client", "literal-143424d04ea8d7c1", "9K")}<sup>{cmsText("home-client", "literal-a318c24216defe20", "+")}</sup>
            </strong>
            <em>{v.opportunities}</em>
          </div>
          <div className="market-publish">{v.publish}</div>
        </>
      )}
      {project.id === 14 && (
        <>
          <div className="neo-mark">
            <b>{cmsText("home-client", "literal-1a259dba25660062", "NEO")}</b>
            <span>{cmsText("home-client", "literal-17ab25fce35797b2", "BARBER CLUB")}</span>
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
            {cmsText("home-client", "literal-7d60c737e1af6e4e", "EST.")}<br />
            <b>{cmsText("home-client", "literal-158a323a7ba44870", "2026")}</b>
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
            {cmsText("home-client", "literal-57c566a66a0ebbf4", "RT ")}<span>{cmsText("home-client", "literal-65e53b284c74fc62", "RENTTECH")}</span>
          </div>
          <div className="renttech-machine">{cmsText("home-client", "literal-b7d2c696bd0bf0dd", "🏗️")}</div>
          <div className="renttech-price">
            <small>{v.available}</small>
          </div>
          <div className="renttech-line" />
        </>
      )}
      {project.id === 11 && (
        <>
          <div className="elan-mark">
            {cmsText("home-client", "literal-59e7bf99efc4e435", "ÉLAN")}<small>{s.nailStudio}</small>
          </div>
          <div className="elan-arch">
            <span>{cmsText("home-client", "literal-a755f65d4e5201d9", "É")}</span>
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
            <b>{cmsText("home-client", "literal-f67ab10ad4e4c531", "F")}</b> {cmsText("home-client", "literal-3b41b606cecd9337", " FIXORA ")}<small>{s.serviceOs}</small>
          </div>
          <div className="fixora-panel">
            <span>{v.capacity}</span>
            <strong>{cmsText("home-client", "literal-99281a0b144cddda", "78%")}</strong>
            <i>
              <em />
            </i>
            <div>
              <b>{cmsText("home-client", "literal-6b51d431df5d7f14", "12")}</b> {v.appointments} <b>{cmsText("home-client", "literal-e7f6c011776e8db7", "6")}</b> {v.working}
            </div>
          </div>
          <div className="fixora-status">{s.liveOperations}</div>
        </>
      )}
      {project.id === 9 && (
        <>
          <div className="iq-brand">
            <b>{cmsText("home-client", "literal-d01983062ddedd61", "iQ")}</b> {cmsText("home-client", "literal-28c3ae266c3a2b2b", " Calendar")}</div>
          <div className="iq-window">
            <div className="iq-head">
              <span>{s.month}</span>
              <i>{cmsText("home-client", "literal-04f9d502b9430f29", "•••")}</i>
            </div>
            <div className="iq-week">
              <span>{cmsText("home-client", "literal-08f271887ce94707", "M")}</span>
              <span>{cmsText("home-client", "literal-e632b7095b0bf32c", "T")}</span>
              <span>{cmsText("home-client", "literal-fcb5f40df9be6bae", "W")}</span>
              <span>{cmsText("home-client", "literal-e632b7095b0bf32c", "T")}</span>
              <span>{cmsText("home-client", "literal-f67ab10ad4e4c531", "F")}</span>
              <span>{cmsText("home-client", "literal-8de0b3c47f112c59", "S")}</span>
              <span>{cmsText("home-client", "literal-8de0b3c47f112c59", "S")}</span>
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
              <span>{cmsText("home-client", "literal-292d4ab496b20cb4", "18:30")}</span>
              <b>{v.dinner}</b>
              <small>{v.participants}</small>
            </div>
          </div>
          <div className="iq-float">{cmsText("home-client", "literal-4330b93f70a03584", "♥ +3")}</div>
          <div className="iq-badge">{v.connect}</div>
        </>
      )}
      {project.id === 8 && (
        <>
          <div className="contor-brand">{cmsText("home-client", "literal-b62052139abbdf63", "◉ CONTOR ACASĂ")}</div>
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
              <b>{cmsText("home-client", "literal-a8c349e75773bb2f", "500K+")}</b>
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
          <div className="nexus-word">{cmsText("home-client", "literal-52b797a276d825aa", "NEXUS")}</div>
          <div className="mini-pill">{cmsText("home-client", "literal-5067f015b202f238", "AI POWERED WORKSPACE")}</div>
        </>
      )}
      {project.id === 2 && (
        <>
          <div className="arch-shape" />
          <div className="arch-copy">
            {cmsText("home-client", "literal-12bfcd8d63d7f480", "FORM")}<br />
            {cmsText("home-client", "literal-f734af59044aecea", "FOLLOWS")}<br />
            <i>{cmsText("home-client", "literal-614223c3d80730c2", "feeling.")}</i>
          </div>
        </>
      )}
      {project.id === 3 && (
        <>
          <div className="pulse-circle">{cmsText("home-client", "literal-5c62e091b8c0565f", "P")}</div>
          <div className="pulse-copy">
            {cmsText("home-client", "literal-fa865b0f430f4527", "MOVE")}<br />
            {cmsText("home-client", "literal-9c402d842f01231a", "DIFFERENT.")}</div>
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
            {cmsText("home-client", "literal-e7e1c93142800501", "+24.8%")}<small> {cmsText("home-client", "literal-8dd0ea9e86c3a1e4", " GROWTH")}</small>
          </div>
        </>
      )}
      {project.id === 5 && (
        <>
          <div className="moon" />
          <div className="night-copy">
            {cmsText("home-client", "literal-af489bee820d1940", "NOCTURNE")}<br />
            <i>{cmsText("home-client", "literal-8af8577cba0ce839", "after dark")}</i>
          </div>
        </>
      )}
      {project.id === 6 && (
        <>
          <div className="kinetic-ring" />
          <div className="kinetic-copy">
            {cmsText("home-client", "literal-9f321d3e762bfddc", "BREATHE.")}<br />
            {cmsText("home-client", "literal-4679e5b117149519", "MOVE. LIVE.")}</div>
        </>
      )}
      </div>
    </div>
  );
}

function AutoFitProjectTitle({ title }: { title: string }) {
  useCms();
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
  useCms();
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
  const [installmentMonths, setInstallmentMonths] = useState<number>(
    () => installmentPlans().at(-1)?.months ?? 12,
  );
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
  const platformLabels = cmsContent("home-client-platformLabels", {
    web: { title: cmsText("home-client-additional", "literal-9dcfaae14b398686", "WEB"), description: pc.webDesc, devices: cmsText("home-client-additional", "literal-72e7bed066ada5c2", "WEB / BROWSER") },
    mobile: { title: cmsText("home-client-additional", "literal-55e4deb9e4fa1a71", "MOBILE"), description: pc.mobileDesc, devices: cmsText("home-client-additional", "literal-25bc3fb05dbffb73", "ANDROID / iOS") },
    games: { title: locale === "ro" ? cmsText("home-client-additional", "literal-59ea72daa6d62985", "JOCURI") : locale === "ru" ? cmsText("home-client-additional", "literal-0d5cf9738c291c92", "ИГРЫ") : cmsText("home-client-additional", "literal-819936ea935ea89a", "GAMES"), description: locale === "ro" ? cmsText("home-client-additional", "literal-43a17eb7663e8beb", "Jocuri pentru Android și iOS") : locale === "ru" ? cmsText("home-client-additional", "literal-83b8637d0476f562", "Игры для Android и iOS") : cmsText("home-client-additional", "literal-d6551c8f50061573", "Games for Android and iOS"), devices: cmsText("home-client-additional", "literal-25bc3fb05dbffb73", "ANDROID / iOS") },
  });
  const supportsMobileOS = platform === "mobile" || platform === "games";
  const launchCopy = platform === "games" ? gc : cmsContent("home-mobile-launch", { empty: pc.empty, detail: pc.detail, contact: pc.contact, collection: "MOBILE COLLECTION", caption: "SMALL SCREEN. BIG POSSIBILITIES." });
  const sortOptions = [
    { value: "recommended", label: fc.recommended },
    { value: "discounts", label: fc.discounts },
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
    .filter((project) => sort !== "discounts" || projectPrice(project.id, project.price).enabled)
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
  const availableInstallmentPlans = installmentPlans();
  const paymentTerms = paymentSettings();
  const activeInstallmentMonths = availableInstallmentPlans.some(
    ({ months }) => months === installmentMonths,
  )
    ? installmentMonths
    : availableInstallmentPlans.at(-1)!.months;
  const selectedInstallmentPlan = availableInstallmentPlans.find(
    (plan) => plan.months === activeInstallmentMonths,
  ) ?? availableInstallmentPlans.at(-1)!;
  const installmentTotal = selected
    ? Math.ceil(selected.price * (1 + selectedInstallmentPlan.surcharge))
    : 0;
  const rentalPrice = Math.floor(installmentTotal / activeInstallmentMonths);
  const siteRentalPrice = selected ? monthlyRentalPrice(selected.price) : 0;
  const rentalServicesFee = Object.values(paymentTerms.rentalServices).reduce(
    (total, service) => total + service.price,
    0,
  );
  const rentalPriceWithServices = {
    min: siteRentalPrice + rentalServicesFee,
    max: siteRentalPrice + rentalServicesFee,
  };
  const rentalMonthlyPriceLabel = rentalServiceTier === "with-services"
    ? `€${rentalPriceWithServices.min}`
    : `€${siteRentalPrice}`;
  const rentalServiceLabel = (label: string, price: number) =>
    `${label.replace(/\s*—\s*€\d+(?:[.,]\d+)?$/, "")} — €${price}`;
  const rentalServicesSummary = cmsContent("home-client-rentalServicesSummary", rentalServiceTier === "with-services"
    ? {
        title: locale === "ro" ? cmsText("home-client-additional", "literal-7e771d2d8e7ec5fe", "Incluse în abonament") : locale === "ru" ? cmsText("home-client-additional", "literal-ef0655bc65bbfd31", "Включено в подписку") : cmsText("home-client-additional", "literal-fff8d28f494b45b0", "Included in the subscription"),
        items: paymentTerms.rentalServices.map((service) => rentalServiceLabel(service.name, service.price)),
      }
    : {
        title: locale === "ro" ? cmsText("home-client-additional", "literal-8bcabf3e625f7013", "Nu sunt incluse") : locale === "ru" ? cmsText("home-client-additional", "literal-d1145403ace8fdf1", "Не включено") : cmsText("home-client-additional", "literal-b665bfc292d96e31", "Not included"),
        items: locale === "ro"
          ? [cmsText("home-client-additional", "literal-3b90e7abb80b566d", "Găzduire web"), cmsText("home-client-additional", "literal-3e37f49b3f415f2d", "Mentenanță tehnică"), cmsText("home-client-additional", "literal-abb847d5572d9f38", "Securitate și backup")]
          : locale === "ru"
            ? [cmsText("home-client-additional", "literal-a99b34044d2a3c88", "Веб-хостинг"), cmsText("home-client-additional", "literal-62e0297b30d43e13", "Техническая поддержка"), cmsText("home-client-additional", "literal-d15b6166fae907a2", "Безопасность и резервные копии")]
            : [cmsText("home-client-additional", "literal-c1e27c03a08ad138", "Web hosting"), cmsText("home-client-additional", "literal-b2fec04acfcc0490", "Technical maintenance"), cmsText("home-client-additional", "literal-391de9842bc91490", "Security and backups")],
      });
  const installmentHref = selected
    ? `${contactHref}?${new URLSearchParams({ project: selected.title, option: `installments-${activeInstallmentMonths}-months` })}`
    : contactHref;
  const rentalHref = selected
    ? `${contactHref}?${new URLSearchParams({ project: selected.title, option: `site-rental-${rentalServiceTier}` })}`
    : contactHref;
  const paymentHref = paymentMode === "installments" ? installmentHref : rentalHref;
  const paymentIncludes = cmsContent("home-client-paymentIncludes", paymentMode === "rental"
    ? rentalServiceTier === "with-services"
      ? locale === "ro"
        ? [cmsText("home-client-additional", "literal-3b90e7abb80b566d", "Găzduire web"), cmsText("home-client-additional", "literal-3e37f49b3f415f2d", "Mentenanță tehnică"), cmsText("home-client-additional", "literal-abb847d5572d9f38", "Securitate și backup")]
        : locale === "ru"
          ? [cmsText("home-client-additional", "literal-a99b34044d2a3c88", "Веб-хостинг"), cmsText("home-client-additional", "literal-62e0297b30d43e13", "Техническая поддержка"), cmsText("home-client-additional", "literal-d15b6166fae907a2", "Безопасность и резервные копии")]
          : [cmsText("home-client-additional", "literal-c1e27c03a08ad138", "Web hosting"), cmsText("home-client-additional", "literal-b2fec04acfcc0490", "Technical maintenance"), cmsText("home-client-additional", "literal-391de9842bc91490", "Security and backups")]
      : locale === "ro"
        ? [cmsText("home-client-additional", "literal-39ef1cf9253fe3f3", "Site pregătit pentru utilizare"), cmsText("home-client-additional", "literal-705851740ba168c6", "Fără găzduire și mentenanță incluse"), cmsText("home-client-additional", "literal-50e44245098a6bf9", "Îți alegi propriul furnizor de servicii"), cmsText("home-client-additional", "literal-d8c3c0c85987769a", "Poți activa serviciile ulterior")]
        : locale === "ru"
          ? [cmsText("home-client-additional", "literal-9da2bfd870d19088", "Сайт готов к использованию"), cmsText("home-client-additional", "literal-db33faaf3a09c193", "Хостинг и техподдержка не включены"), cmsText("home-client-additional", "literal-14c64973201ec7bb", "Вы выбираете своего поставщика услуг"), cmsText("home-client-additional", "literal-fdd0ff60dacd1659", "Услуги можно подключить позже")]
          : [cmsText("home-client-additional", "literal-086c0978e1173db5", "Website ready to use"), cmsText("home-client-additional", "literal-59afb7ae35589cdc", "Hosting and maintenance not included"), cmsText("home-client-additional", "literal-ca58391c39a94f8f", "Choose your own service provider"), cmsText("home-client-additional", "literal-b5bfc44e943447ba", "Services can be activated later")]
    : locale === "ro"
      ? [cmsText("home-client-additional", "literal-ec2e58c4b21f3c1e", "Devii proprietarul siteului"), cmsText("home-client-additional", "literal-43a71f023d817fb3", "Găzduire gratuită primele 2 luni"), cmsText("home-client-additional", "literal-51dac56b76b364d5", "Mentenanță tehnică lunară gratuită primele 2 luni"), cmsText("home-client-additional", "literal-cd6af79f54852d31", "Plată flexibilă în rate")]
      : locale === "ru"
        ? [cmsText("home-client-additional", "literal-f5393886251ea2f6", "Сайт становится вашей собственностью"), cmsText("home-client-additional", "literal-e99c7a858e21c227", "Запуск и хостинг включены"), cmsText("home-client-additional", "literal-50390b97cf1a1c37", "Ежемесячная техподдержка"), cmsText("home-client-additional", "literal-981e741779adadec", "Гибкая оплата в рассрочку")]
        : [cmsText("home-client-additional", "literal-033e056a0c1f9d6e", "You own the website"), cmsText("home-client-additional", "literal-78785c3fc3e6312a", "Launch and hosting included"), cmsText("home-client-additional", "literal-ec32d3134c1dfb9d", "Monthly technical care"), cmsText("home-client-additional", "literal-a8a40c1a3f19c659", "Flexible installment payments")]);
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
      if (projectId) {
        setPaymentMode("installments");
        setInstallmentMonths(installmentPlans().at(-1)?.months ?? 12);
      }
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
    setPaymentMode("installments");
    setInstallmentMonths(installmentPlans().at(-1)?.months ?? 12);
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
                <b>{cmsText("home-client", "literal-f75c659650787893", "const")}</b> {cmsText("home-client", "literal-291fa8215a885230", " idea = ")}<em>{cmsText("home-client", "literal-8db60df4d3db1a0d", "&quot;bold&quot;")}</em>{cmsText("home-client", "literal-41b805ea7ac014e2", ";")}</span>
              <span>
                <b>{cmsText("home-client", "literal-07a8750738828ffd", "while")}</b> {cmsText("home-client", "literal-780ecc5349360456", " (curious) build();")}</span>
              <span>
                <i>{cmsText("home-client", "literal-bf3b579efe99647e", "<Launch")}</i> {cmsText("home-client", "literal-13251deeed5cba66", " ready=")}<em>{cmsText("home-client", "literal-b5bea41b6c623f7c", "true")}</em> {cmsText("home-client", "literal-8c72844c3ba86188", " />")}</span>
              <span>
                {cmsText("home-client", "literal-6762ab23a5bafecd", "git commit -m ")}<em>{cmsText("home-client", "literal-4d2012974f316a8a", "&quot;ship&quot;")}</em>
              </span>
            </div>
          ))}
        </div>
        <div className="code-core">
          <i>{`{`}</i>
          <span>{cmsText("home-client", "literal-8d37c41fc6693c69", "</>")}</span>
          <i>{`}`}</i>
        </div>
        <div className="terminal-chip">
          <b>{cmsText("home-client", "literal-5f9e6a3696c4a7c2", "●")}</b>
          <span>{cmsText("home-client", "literal-c236f6547313d5ff", "BUILDING")}</span>
          <i>{cmsText("home-client", "literal-d2e2adf7177b7a8a", "_")}</i>
        </div>
      </div>
      <div className="edge-rail edge-rail-right code-rail">
        <div className="rail-language-switch" aria-label={c.language} role="group">
          <span className="rail-language-label" aria-hidden="true">{cmsText("home-client", "literal-0d5d4ebd6f3086e7", "LANG")}</span>
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
            {cmsText("home-client", "literal-d9e2362ab9ca4846", "01001101")}<br />
            {cmsText("home-client", "literal-f9575c93165b44a9", "11001010")}<br />
            {cmsText("home-client", "literal-db06c4343c304f69", "00110101")}<br />
            {cmsText("home-client", "literal-a5aa69003c8318cf", "10100110")}</span>
          <span>
            {cmsText("home-client", "literal-cbe6833b876463cf", "10110100")}<br />
            {cmsText("home-client", "literal-c3ef09f566f31d86", "00101101")}<br />
            {cmsText("home-client", "literal-4d13ce97be204256", "11010010")}<br />
            {cmsText("home-client", "literal-6d2b32d887aeca06", "01011001")}</span>
          <span>
            {cmsText("home-client", "literal-f615873a351b1771", "01101001")}<br />
            {cmsText("home-client", "literal-154f085c4221f2c6", "10010110")}<br />
            {cmsText("home-client", "literal-d9e2362ab9ca4846", "01001101")}<br />
            {cmsText("home-client", "literal-f958406b12f1ceba", "11100010")}</span>
        </div>
        <div className="git-branch" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <span>{cmsText("home-client", "literal-0d6e4079e36703eb", "main")}</span>
          <b>{cmsText("home-client", "literal-b5180223165af358", "HEAD")}</b>
        </div>
        <div className="deploy-chip" aria-hidden="true">
          <i />
          {cmsText("home-client", "literal-9d575964d1806399", "DEPLOYED ")}<b>{cmsText("home-client", "literal-27badc983df1780b", "200")}</b>
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
            <span>{cmsText("home-client", "literal-e13733d9305592cb", "101101")}</span><span>{cmsText("home-client", "literal-acc494ea40d1e917", "011010")}</span><span>{cmsText("home-client", "literal-f4972d45b42830d1", "110001")}</span><span>{cmsText("home-client", "literal-df6f03cf66c3cc59", "001101")}</span>
            <span>{cmsText("home-client", "literal-68dc36a76717efa5", "010110")}</span><span>{cmsText("home-client", "literal-9273c499a75ff31f", "100101")}</span><span>{cmsText("home-client", "literal-91a80f17981c411f", "111000")}</span><span>{cmsText("home-client", "literal-01949ad79c88b74c", "001011")}</span>
          </div>
          <div className="hero-quantum-core">
            <div className="quantum-rings"><i /><i /><i /></div>
            <div className="quantum-center"><span>{cmsText("home-client", "literal-11fb682be0a0233d", "AI")}</span><b>{cmsText("home-client", "literal-ac7e24813998d31d", "ONLINE")}</b></div>
            <em>{cmsText("home-client", "literal-938db8c9f82c8cb5", "01")}</em><em>{cmsText("home-client", "literal-4a44dc15364204a8", "10")}</em><em>{cmsText("home-client", "literal-4fc82b26aecb47d2", "11")}</em>
          </div>
          <div className="hero-code-ribbon ribbon-one">
            <span>{cmsText("home-client", "literal-195059f59e3a4fec", "DESIGN")}</span><b>{cmsText("home-client", "literal-161660030aa6c9e3", "→")}</b><span>{cmsText("home-client", "literal-3053677e4333a96b", "BUILD")}</span><b>{cmsText("home-client", "literal-161660030aa6c9e3", "→")}</b><span>{cmsText("home-client", "literal-9612769f08f06e72", "LAUNCH")}</span>
          </div>
          <div className="hero-code-ribbon ribbon-two">
            <span>{cmsText("home-client", "literal-cc55e7418055d2dd", "REACT")}</span><b>{cmsText("home-client", "literal-a318c24216defe20", "+")}</b><span>{cmsText("home-client", "literal-11fb682be0a0233d", "AI")}</span><b>{cmsText("home-client", "literal-a318c24216defe20", "+")}</b><span>{cmsText("home-client", "literal-874980b16e0f5ea1", "IMAGINATION")}</span>
          </div>
          <div className="hero-code-window">
            <div className="hero-code-bar">
              <span><i /><i /><i /></span>
              <b>{cmsText("home-client", "literal-b3257a6d800c5337", "mono-dev / launch.ts")}</b>
              <em>{cmsText("home-client", "literal-873555c740fe42b7", "⌁")}</em>
            </div>
            <div className="hero-code-lines">
              <span><b>{cmsText("home-client", "literal-938db8c9f82c8cb5", "01")}</b><code><i>{cmsText("home-client", "literal-f75c659650787893", "const")}</i> {cmsText("home-client", "literal-291fa8215a885230", " idea = ")}<em>{cmsText("home-client", "literal-7858c07c233f6207", "&quot;viitor&quot;")}</em>{cmsText("home-client", "literal-41b805ea7ac014e2", ";")}</code></span>
              <span><b>{cmsText("home-client", "literal-a953f09a1b6b6725", "02")}</b><code><i>{cmsText("home-client", "literal-1aefe47e20eb91fa", "await")}</i> {cmsText("home-client", "literal-ff59215bc8a89a03", " build(idea);")}</code></span>
              <span><b>{cmsText("home-client", "literal-0b8efa5a3bf10441", "03")}</b><code>{cmsText("home-client", "literal-aa5ca6bb3f42dd45", "design.")}<strong>{cmsText("home-client", "literal-d107ea3629c32671", "push")}</strong>{cmsText("home-client", "literal-32ebb1abcc1c601c", "(")}<em>{cmsText("home-client", "literal-5e3ca026059a9324", "&quot;wow&quot;")}</em>{cmsText("home-client", "literal-9d8b2b5670d18da8", ");")}</code></span>
              <span><b>{cmsText("home-client", "literal-6cd5b6e51936a442", "04")}</b><code><i>{cmsText("home-client", "literal-935f68319d4f227e", "if")}</i> {cmsText("home-client", "literal-e2121b85b15b1927", " (ready) launch();")}</code></span>
              <span><b>{cmsText("home-client", "literal-c97550ce8213ef5c", "05")}</b><code>{cmsText("home-client", "literal-f3ccfb93f2c06c5f", "status = ")}<em>{cmsText("home-client", "literal-532f6c44eac568e9", "&quot;ONLINE&quot;")}</em>{cmsText("home-client", "literal-41b805ea7ac014e2", ";")}</code></span>
            </div>
            <div className="hero-code-status">
              <span><i /> {cmsText("home-client", "literal-f3ab2bf76c32c511", " LIVE")}</span>
              <b>{cmsText("home-client", "literal-6ebd5673818d676a", "BUILD 100%")}</b>
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
                {value === "web" ? <span className="platform-browser"><span className="browser-chrome"><i /><i /><i /><b>{cmsText("home-client", "literal-9477e82235ad81ef", "mono.dev")}</b></span><span className="browser-body"><span className="browser-sidebar"><i /><i /><i /></span><span className="browser-content"><b>{cmsText("home-client", "literal-4ce7dbfb92847f55", "Make it")}<br />{cmsText("home-client", "literal-9ecfb3a042a271f4", "happen")}<span>{cmsText("home-client", "literal-cdb4ee2aea69cc6a", ".")}</span></b><i /><span className="browser-tiles"><i /><i /><i /></span></span></span><span className="browser-code">{cmsText("home-client", "literal-8d37c41fc6693c69", "</>")}</span></span> : value === "mobile" ? <span className="platform-phones"><span className="platform-phone phone-back"><i /><span className="phone-orbit" /><b>{cmsText("home-client", "literal-355f5e74848522db", "iOS")}</b></span><span className="platform-phone phone-front"><i /><span className="phone-app-icon"><Zap size={22} /></span><b>{cmsText("home-client", "literal-e57e8090dffdbe80", "Go beyond.")}</b><span className="phone-app-lines"><i /><i /></span><span className="phone-app-button">{cmsText("home-client", "literal-1d4f82bec4cd7e79", "Let&apos;s go ")}<ArrowRight size={10} /></span></span><span className="phone-float-icon"><Sparkles size={18} /></span></span> : <span className="platform-games-art"><Gamepad2 size={106} /><i /><i /><b>{cmsText("home-client", "literal-f53a7ab988e2f462", "PLAY")}</b></span>}
              </span>
              <span className="platform-icon">{value === "web" ? <Monitor aria-hidden="true" /> : value === "mobile" ? <Smartphone aria-hidden="true" /> : <Gamepad2 aria-hidden="true" />}</span>
              <span className="platform-text"><strong>{platformLabels[value].title}</strong><span>{platformLabels[value].description}</span><span className="platform-devices">{platformLabels[value].devices}</span></span>
              {platform === value && <span className="platform-status"><b>{String(platformCount(value)).padStart(2, "0")}</b> {pc.available}</span>}
            </button>
          ))}
        </div>
        {supportsMobileOS && <div id="mobile-projects-start" className="mobile-os" role="group" aria-label={pc.os}>
          {(["all", "android", "ios"] as const).map((os) => <button type="button" key={os} aria-pressed={mobileOS === os} onClick={() => selectPlatform(platform, os)}><span className="os-filter-icon" aria-hidden="true">{os === "all" ? <Sparkles size={15} /> : os === "android" ? <Smartphone size={15} /> : <span className="ios-filter-mark">{cmsText("home-client", "literal-de7d1b721a1e0632", "i")}</span>}</span><span>{os === "all" ? pc.all : os === "android" ? cmsText("home-client", "literal-6d612a86bee4b0a6", "Android") : cmsText("home-client-additional", "literal-355f5e74848522db", "iOS")}</span>{mobileOS === os && <span className="os-selected-dot" aria-hidden="true" />}</button>)}
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
                aria-label={locale === "ro" ? cmsText("home-client", "literal-1201f5024543a6c2", "Șterge căutarea") : locale === "ru" ? cmsText("home-client", "literal-6e1f7baa472fcfbb", "Очистить поиск") : cmsText("home-client", "literal-3b7ea51793e9d906", "Clear search")}
                title={locale === "ro" ? cmsText("home-client", "literal-1201f5024543a6c2", "Șterge căutarea") : locale === "ru" ? cmsText("home-client", "literal-6e1f7baa472fcfbb", "Очистить поиск") : cmsText("home-client", "literal-3b7ea51793e9d906", "Clear search")}
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
                      <strong className="price-main"><CatalogPrice id={project.id} fallback={project.price} /></strong>
                    </span>
                    <span className="price-option-separator" aria-hidden="true">
                      {locale === "ro" ? cmsText("home-client-additional", "literal-dfb3c9aac79bac44", "sau") : locale === "ru" ? cmsText("home-client", "literal-bcacbff7a5638016", "или") : cmsText("home-client-additional", "literal-7175517a370b5cd2", "or")}
                    </span>
                    <span
                      className="price-rental"
                      aria-label={locale === "ro" ? `Rată lunară pentru plata în ${availableInstallmentPlans.at(-1)!.months} luni` : locale === "ru" ? `Ежемесячный платёж на ${availableInstallmentPlans.at(-1)!.months} месяцев` : `Monthly payment over ${availableInstallmentPlans.at(-1)!.months} months`}
                    >
                      <b>{cmsText("home-client", "literal-c4cc90ed3d26f12d", "€")}{annualInstallmentPrice(project.price)}<em>{c.perMonth}</em></b>
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
              <div className="launch-platforms"><span><Smartphone size={14} />{cmsText("home-client", "literal-6d612a86bee4b0a6", "Android")}</span><i /> <span><span className="ios-filter-mark">{cmsText("home-client", "literal-de7d1b721a1e0632", "i")}</span>{cmsText("home-client", "literal-355f5e74848522db", "iOS")}</span><span className="launch-platform-line" /></div>
            </div>
            <div className="mobile-preview-art launch-art" aria-hidden="true">
              <span className="launch-orbit orbit-one" /><span className="launch-orbit orbit-two" /><span className="launch-orbit orbit-three" />
              <span className="launch-art-caption">{launchCopy.caption}</span>
              <div className="launch-device">
                <div className="launch-device-top"><span>{cmsText("home-client", "literal-27192114f254950c", "9:41")}</span><i /><span>{cmsText("home-client", "literal-32e48995f98ce3b7", "100%")}</span></div>
                <div className="launch-app-header"><span>{cmsText("home-client", "literal-d7de34b17b4691aa", "mono")}<span>{cmsText("home-client", "literal-8a5edab282632443", "/")}</span>{cmsText("home-client", "literal-d524c1a0811da495", "mobile")}</span><span className="launch-app-avatar">{cmsText("home-client", "literal-e28f287437f2222f", "m.")}</span></div>
                <div className="launch-app-greeting">{cmsText("home-client", "literal-0accb7c971428951", "YOUR NEXT BIG THING")}</div>
                <strong className="launch-app-title">{cmsText("home-client", "literal-925b686d52443329", "Dream it.")}<br /><em>{cmsText("home-client", "literal-32cc119c859db107", "Launch it.")}</em></strong>
                <div className="launch-app-feature"><span className="launch-feature-orb" /><Sparkles size={20} /><span>{cmsText("home-client", "literal-0ae12b05cf0fd9ca", "Built for")}<br /><b>{cmsText("home-client", "literal-ed22427bdf6c335e", "your everyday.")}</b></span><span className="launch-feature-arrow"><ArrowRight size={16} /></span></div>
                <div className="launch-app-widgets"><span><Zap size={17} /><b>{cmsText("home-client", "literal-f227b5be59fac652", "Fast.")}</b><i /></span><span><span className="launch-widget-dots"><i /><i /><i /><i /></span><b>{cmsText("home-client", "literal-316a39e023ae7ecd", "Intuitive.")}</b><i /></span></div>
                <div className="launch-app-nav"><span /><span /><span /><span /></div><span className="launch-home-indicator" />
              </div>
              <div className="launch-float float-android"><Smartphone size={20} /><span>{cmsText("home-client", "literal-6d612a86bee4b0a6", "Android")}<small>{cmsText("home-client", "literal-0a759002d3566b4d", "MADE TO CONNECT")}</small></span></div>
              <div className="launch-float float-ios"><span className="launch-ios-symbol">{cmsText("home-client", "literal-de7d1b721a1e0632", "i")}</span><span>{cmsText("home-client", "literal-355f5e74848522db", "iOS")}<small>{cmsText("home-client", "literal-4b22f7112c306f26", "DESIGNED TO FEEL")}</small></span></div>
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
                <span>{cmsText("home-client", "literal-5feceb66ffc86f38", "0")}{index + 1}</span>
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
          <a href={`mailto:${siteConfig.email}`}>
            {c.talk} <ArrowRight size={18} />
          </a>
        </div>
        <div className="metrics">
          <div>
            <strong>{cmsText("home-client", "literal-32e48995f98ce3b7", "100%")}</strong>
            <span>
              {c.metrics[0][0]}
              <br />
              {c.metrics[0][1]}
            </span>
          </div>
          <div>
            <strong>{cmsText("home-client", "literal-850b8b29350a471f", "12H")}</strong>
            <span>
              {c.metrics[1][0]}
              <br />
              {c.metrics[1][1]}
            </span>
          </div>
          <div>
            <strong>{cmsText("home-client", "literal-624b60c58c9d8bfb", "30")}</strong>
            <span>
              {c.metrics[2][0]}
              <br />
              {c.metrics[2][1]}
            </span>
          </div>
        </div>
      </section>
      <aside className="partner-strip" id="parteneri" aria-label={cmsText("home-client", "literal-472f4e33e752619a", "Parteneri")}>
        <a
          className="partner-strip-logo partner-strip-market9000"
          href="https://market9000.md/"
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label={cmsText("home-client", "literal-a30ca49fe501955d", "Market9000.md")}
        >
          <strong>{cmsText("home-client", "literal-5b64a2bfa66a598c", "market9000")}<span>{cmsText("home-client", "literal-d42178eb0df4b055", ".md")}</span></strong>
        </a>
        <a
          className="partner-strip-logo partner-strip-micora"
          href="/micora/"
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label={cmsText("home-client", "literal-a44371f771bfe711", "Micora")}
        >
          <strong>{cmsText("home-client", "literal-2794a9233aacb0d0", "MICORA")}</strong>
        </a>
      </aside>
      <footer>
        <div className="shell footer-main">
          <BrandLogo className="footer-brand" href="#top" inverse ariaLabel="mono/dev" />
          <nav className="footer-actions" aria-label={c.footer.navigation}>
            <a href="#proiecte">{c.footer.projects}</a>
            <a href={`mailto:${siteConfig.email}`}>{c.footer.email}</a>
            <a className="footer-cta" href={contactHref}>
              {c.footer.contact}
              <ArrowRight />
            </a>
          </nav>
        </div>
        <div className="shell footer-bottom">
          <p>{c.footer.legal}</p>
          <span>{cmsText("home-client", "literal-b17f48f4917456d7", "© 2026 MONO/DEV")}</span>
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
                  <span className="modal-status"><i />{locale === "ro" ? cmsText("home-client", "literal-83aa745f4bcc3887", "DISPONIBIL") : locale === "ru" ? cmsText("home-client", "literal-8de93ea4a6052cf2", "ЛИЦЕНЗИЯ ДОСТУПНА") : cmsText("home-client", "literal-db45ed279748337a", "LICENSE AVAILABLE")}</span>
                </div>
                <div className="modal-title-row">
                  <AutoFitProjectTitle title={selected.title} />
                  <div className="modal-price">
                    <small>{c.fullPrice}</small><CatalogPrice id={selected.id} fallback={selected.price} />
                  </div>
                </div>
                <p className="modal-summary">{selectedDetail.summary}</p>
                <aside className="rental-offer" aria-label={c.rentalLabel}>
                  <div className="installment-side">
                    <div className="installment-heading">
                      <span>{locale === "ro" ? cmsText("home-client", "literal-96d1efc56ea963cc", "ALEGE MODALITATEA") : locale === "ru" ? cmsText("home-client", "literal-0011a9ac8a2cc27f", "ВЫБЕРИТЕ ВАРИАНТ") : cmsText("home-client", "literal-04b1babe45f79801", "CHOOSE YOUR OPTION")}</span>
                      <strong>{paymentMode === "installments"
                        ? locale === "ro" ? cmsText("home-client", "literal-ac364cc3fb06c6e2", "Cumpără în rate") : locale === "ru" ? cmsText("home-client", "literal-c91d2163b5b370c1", "Купить в рассрочку") : cmsText("home-client", "literal-154dcfdfccde08ea", "Buy in installments")
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
                    <div className="payment-mode-options" role="radiogroup" aria-label={locale === "ro" ? cmsText("home-client", "literal-a8d93a994a4db1f9", "Modalitate de plată") : locale === "ru" ? cmsText("home-client", "literal-3df3da628153a6b7", "Способ оплаты") : cmsText("home-client", "literal-9de316fab48d0b7d", "Payment option")}>
                      <button type="button" className={paymentMode === "installments" ? "is-active" : ""} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option="installments" onClick={() => setPaymentMode("installments")} role="radio" aria-checked={paymentMode === "installments"}>
                        {locale === "ro" ? cmsText("home-client", "literal-ac364cc3fb06c6e2", "Cumpără în rate") : locale === "ru" ? cmsText("home-client", "literal-8e7eae10e0c4cd91", "В рассрочку") : cmsText("home-client", "literal-1a888d4eb6bc04e8", "Installments")}
                      </button>
                      <button type="button" className={paymentMode === "rental" ? "is-active" : ""} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option="rental" onClick={() => setPaymentMode("rental")} role="radio" aria-checked={paymentMode === "rental"}>
                        {c.rentalLabel}
                      </button>
                    </div>
                    {paymentMode === "installments" ? (
                      <>
                        <div className="installment-options" role="radiogroup" aria-label={locale === "ro" ? cmsText("home-client", "literal-1285f94087c8a79e", "Perioada de plată") : locale === "ru" ? cmsText("home-client", "literal-408cb8e04c1bb4a0", "Срок оплаты") : cmsText("home-client", "literal-ab81dffb41a0d7f7", "Payment term")}>
                          {availableInstallmentPlans.map((plan) => {
                            const label = locale === "ro"
                              ? `${plan.months} luni`
                              : locale === "ru"
                                ? plan.months === 12 ? cmsText("home-client", "literal-b4061c863603e7cf", "1 год") : `${plan.months} мес.`
                                : plan.months === 12 ? cmsText("home-client", "literal-91647badc37b9309", "1 year") : `${plan.months} months`;
                            return <button key={plan.months} type="button" className={plan.months === activeInstallmentMonths ? "is-active" : ""} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option={`installments-${plan.months}-months`} onClick={() => setInstallmentMonths(plan.months)} role="radio" aria-checked={plan.months === activeInstallmentMonths}><b>{label}</b></button>;
                          })}
                        </div>
                        <div className="installment-result" aria-live="polite"><div><span>{locale === "ro" ? cmsText("home-client", "literal-210c08dfafd670f6", "Rata lunara") : locale === "ru" ? cmsText("home-client", "literal-ec6908254574e258", "Ваш ежемесячный платёж") : cmsText("home-client", "literal-d67da9c4b7a7c17d", "Your monthly payment")}</span><strong>{cmsText("home-client", "literal-c4cc90ed3d26f12d", "€")}{rentalPrice}<em>{c.perMonth}</em></strong></div><p>{locale === "ro" ? cmsText("home-client-additional", "literal-18e872be2359d76e", "Total:") : locale === "ru" ? cmsText("home-client", "literal-d6d27f2716ff7fa2", "Итого:") : cmsText("home-client-additional", "literal-18e872be2359d76e", "Total:")} <b>{cmsText("home-client", "literal-c4cc90ed3d26f12d", "€")}{installmentTotal}</b></p></div>
                      </>
                    ) : (
                      <>
                        <div className="rental-service-options" role="radiogroup" aria-label={locale === "ro" ? cmsText("home-client", "literal-aeaaf778585f833b", "Servicii pentru chirie") : locale === "ru" ? cmsText("home-client", "literal-71343aeee81ae574", "Услуги для аренды") : cmsText("home-client", "literal-c0e6aa0eae54d096", "Rental services")}>
                          <div className="rental-service-choice">
                            <button type="button" className={`rental-service-option ${rentalServiceTier === "with-services" ? "is-active" : ""}`} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option="site-rental-with-services" onClick={() => setRentalServiceTier("with-services")} role="radio" aria-checked={rentalServiceTier === "with-services"}>
                              <b>{locale === "ro" ? cmsText("home-client", "literal-1c2c88993436936a", "Cu servicii suplimentare") : locale === "ru" ? cmsText("home-client", "literal-147e34efad0f5280", "С дополнительными услугами") : cmsText("home-client", "literal-ed39c059d4593c55", "With additional services")}</b>
                              <span className="rental-service-supplement">+€{rentalServicesFee}{c.perMonth}</span>
                            </button>
                            <div className="rental-services-info" onMouseEnter={() => setRentalServicesInfoOpen("with-services")} onMouseLeave={() => setRentalServicesInfoOpen(null)}>
                              <button type="button" className="rental-services-info-button" aria-label={locale === "ro" ? cmsText("home-client", "literal-eadbfe78b8209303", "Vezi serviciile incluse") : locale === "ru" ? cmsText("home-client", "literal-4c3a3f8fbb0821f9", "Посмотреть включённые услуги") : cmsText("home-client", "literal-1db1490817e2289c", "View included services")} aria-expanded={rentalServicesInfoOpen === "with-services"} aria-describedby={rentalServicesInfoOpen === "with-services" ? "with-services-tooltip" : undefined} onClick={() => setRentalServicesInfoOpen("with-services")} onFocus={() => setRentalServicesInfoOpen("with-services")} onBlur={() => setRentalServicesInfoOpen(null)}>{cmsText("home-client", "literal-de7d1b721a1e0632", "i")}</button>
                              {rentalServicesInfoOpen === "with-services" && <div id="with-services-tooltip" className="rental-services-tooltip" role="tooltip"><strong>{rentalServicesSummary.title}</strong>{rentalServicesSummary.items.map((item) => <span key={item}>{item}</span>)}</div>}
                            </div>
                          </div>
                          <div className="rental-service-choice">
                            <button type="button" className={`rental-service-option ${rentalServiceTier === "without-services" ? "is-active" : ""}`} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option="site-rental-without-services" onClick={() => setRentalServiceTier("without-services")} role="radio" aria-checked={rentalServiceTier === "without-services"}>
                              <b>{locale === "ro" ? cmsText("home-client", "literal-04a071dc72b2c4df", "Fără servicii suplimentare") : locale === "ru" ? cmsText("home-client", "literal-08856cd9b44a71f3", "Без дополнительных услуг") : cmsText("home-client", "literal-d26f63a5570967fc", "Without additional services")}</b>
                            </button>
                            <div className="rental-services-info" onMouseEnter={() => setRentalServicesInfoOpen("without-services")} onMouseLeave={() => setRentalServicesInfoOpen(null)}>
                              <button type="button" className="rental-services-info-button" aria-label={locale === "ro" ? cmsText("home-client", "literal-ef7a3ecd101914a8", "Vezi serviciile neincluse") : locale === "ru" ? cmsText("home-client", "literal-2e9549b5ce4186a1", "Посмотреть услуги, которые не включены") : cmsText("home-client", "literal-8a1ff80a7b860c1f", "View services not included")} aria-expanded={rentalServicesInfoOpen === "without-services"} aria-describedby={rentalServicesInfoOpen === "without-services" ? "without-services-tooltip" : undefined} onClick={() => setRentalServicesInfoOpen("without-services")} onFocus={() => setRentalServicesInfoOpen("without-services")} onBlur={() => setRentalServicesInfoOpen(null)}>{cmsText("home-client", "literal-de7d1b721a1e0632", "i")}</button>
                              {rentalServicesInfoOpen === "without-services" && <div id="without-services-tooltip" className="rental-services-tooltip" role="tooltip"><strong>{locale === "ro" ? cmsText("home-client", "literal-8bcabf3e625f7013", "Nu sunt incluse") : locale === "ru" ? cmsText("home-client", "literal-d1145403ace8fdf1", "Не включено") : cmsText("home-client", "literal-b665bfc292d96e31", "Not included")}</strong><span>{locale === "ro" ? cmsText("home-client", "literal-3b90e7abb80b566d", "Găzduire web") : locale === "ru" ? cmsText("home-client", "literal-a99b34044d2a3c88", "Веб-хостинг") : cmsText("home-client", "literal-c1e27c03a08ad138", "Web hosting")}</span><span>{locale === "ro" ? cmsText("home-client", "literal-3e37f49b3f415f2d", "Mentenanță tehnică") : locale === "ru" ? cmsText("home-client", "literal-62e0297b30d43e13", "Техническая поддержка") : cmsText("home-client", "literal-b2fec04acfcc0490", "Technical maintenance")}</span><span>{locale === "ro" ? cmsText("home-client", "literal-abb847d5572d9f38", "Securitate și backup") : locale === "ru" ? cmsText("home-client", "literal-d15b6166fae907a2", "Безопасность и резервные копии") : cmsText("home-client", "literal-391de9842bc91490", "Security and backups")}</span></div>}
                            </div>
                          </div>
                        </div>
                        <div className="installment-result rental-result" aria-live="polite"><div><span>{locale === "ro" ? cmsText("home-client", "literal-a9a59b72f690a630", "Chiria ta lunară") : locale === "ru" ? cmsText("home-client", "literal-1c3a9bfde9fabeff", "Ваша ежемесячная аренда") : cmsText("home-client", "literal-b4db5f306825ae61", "Your monthly rental")}</span><strong>{rentalMonthlyPriceLabel}<em>{c.perMonth}</em></strong></div><p>{locale === "ro" ? `Perioada contractului: ${paymentTerms.rentalMonths} luni` : locale === "ru" ? `Срок договора: ${paymentTerms.rentalMonths} мес.` : `Contract term: ${paymentTerms.rentalMonths} months`}</p></div>
                      </>
                    )}
                  </div>
                  {paymentMode !== "rental" && <ul>
                    {paymentIncludes.map((item) => <li key={item}><Check />{item}</li>)}
                  </ul>}
                </aside>
                <div className="detail-sections" aria-label={locale === "ro" ? cmsText("home-client", "literal-9882686a75fa8d6c", "Ce primești") : locale === "ru" ? cmsText("home-client", "literal-f1cfb2b145a7be01", "Что входит") : cmsText("home-client", "literal-06cec1523c69f02c", "What is included")}>
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
                      {c.openProject} {cmsText("home-client", "literal-588da410532073f8", " · ")}{visualCopy[locale].coming}
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
                  <a className="project-page-link" href={projectHref(locale, selected.id)} data-analytics-event="project_open" data-project={projectSlugs[selected.id]}>
                    <span>{c.viewDetails} {cmsText("home-client", "literal-d3150495ce4f5d1a", " - ")}{selected.title}</span>
                    <ArrowRight aria-hidden="true" />
                  </a>
                  <a className="buy-link" href={`${contactHref}?${new URLSearchParams({ project: selected.title, option: "purchase" })}`} data-analytics-event="project_request" data-project={projectSlugs[selected.id]}>
                    {c.buyFor} <CatalogPrice id={selected.id} fallback={selected.price} hideOriginal /> <ArrowRight />
                  </a>
                  <a className="rent-link" href={paymentHref} data-analytics-event="payment_option" data-project={projectSlugs[selected.id]} data-option={paymentMode}>
                    <span>{paymentMode === "installments" ? `${locale === "ro" ? cmsText("home-client", "literal-fa4bd2bb877cb496", "Cumpără în rate la") : locale === "ru" ? cmsText("home-client", "literal-7c562ae69ba6c7dd", "Купить в рассрочку от") : cmsText("home-client", "literal-86de4377c6aa39bf", "Buy in installments from")} €${rentalPrice}` : `${c.rentFor} ${rentalMonthlyPriceLabel}`}<small>{c.perMonth}</small></span> <ArrowRight />
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
