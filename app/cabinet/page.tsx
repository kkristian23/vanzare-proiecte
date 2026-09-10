"use client";

import { ArrowLeft, BellRing, Clock3, LockKeyhole, Rocket, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Locale, locales } from "../i18n";
import { BrandLogo } from "../brand-logo";
import "./cabinet.css";

const content = {
  ro: { back: "Înapoi la catalog", label: "ZONĂ PERSONALĂ / ÎN DEZVOLTARE", title: ["Cabinetul tău", "prinde contur."], text: "Pregătim un spațiu personal pentru programatori și clienți: publicarea lucrărilor, gestionarea portofoliului și urmărirea proiectelor, într-un singur loc.", status: "VA FI DISPONIBIL ÎN CURÂND", features: ["Publică-ți lucrările", "Gestionează portofoliul", "Urmărește proiectele"], note: "Îți mulțumim pentru răbdare. Revenim foarte curând cu accesul." },
  ru: { back: "Назад к каталогу", label: "ЛИЧНЫЙ КАБИНЕТ / В РАЗРАБОТКЕ", title: ["Ваш кабинет", "уже создаётся."], text: "Мы готовим личное пространство для разработчиков и клиентов: публикация работ, управление портфолио и отслеживание проектов — в одном месте.", status: "СКОРО БУДЕТ ДОСТУПНО", features: ["Публикуйте работы", "Управляйте портфолио", "Отслеживайте проекты"], note: "Спасибо за терпение. Доступ появится совсем скоро." },
  en: { back: "Back to catalogue", label: "PERSONAL AREA / IN DEVELOPMENT", title: ["Your personal area", "is taking shape."], text: "We are preparing a personal space for developers and clients: publishing work, managing a portfolio and tracking projects — all in one place.", status: "COMING SOON", features: ["Publish your work", "Manage your portfolio", "Track your projects"], note: "Thank you for your patience. Access will be available very soon." },
} as const;

export default function CabinetPage() {
  const [locale, setLocale] = useState<Locale>("ro");
  useEffect(() => { const value = new URLSearchParams(window.location.search).get("lang"); if (value && locales.includes(value as Locale)) setLocale(value as Locale); }, []);
  const c = content[locale];
  const changeLocale = (language: Locale) => { setLocale(language); const url = new URL(window.location.href); language === "ro" ? url.searchParams.delete("lang") : url.searchParams.set("lang", language); window.history.replaceState({}, "", url); };
  const catalogHref = locale === "ro" ? "/" : `/?lang=${locale}`;
  return <main className="cabinet-page"><div className="cabinet-noise" aria-hidden="true" /><header className="cabinet-nav"><BrandLogo className="cabinet-logo" href={catalogHref} inverse /><div className="cabinet-languages">{locales.map(language => <button key={language} className={locale === language ? "active" : ""} onClick={() => changeLocale(language)}>{language.toUpperCase()}</button>)}</div><a className="cabinet-back" href={catalogHref}><ArrowLeft /> {c.back}</a></header><section className="cabinet-hero"><div className="cabinet-copy"><p className="cabinet-label"><i /> {c.label}</p><h1>{c.title[0]}<br /><em>{c.title[1]}</em></h1><p className="cabinet-description">{c.text}</p><div className="cabinet-status"><Clock3 /> {c.status}</div></div><div className="cabinet-card"><div className="cabinet-card-bar"><span><i /><i /><i /></span><b>personal-area.tsx</b><LockKeyhole /></div><div className="cabinet-avatar"><UserRound /><span>+</span></div><p>MONO/DEV</p><h2>{c.status}</h2><div className="cabinet-progress"><i /></div><small>BUILD 01 / 03</small></div></section><section className="cabinet-roadmap">{c.features.map((feature, index) => <article key={feature}><span>0{index + 1}</span><Rocket /><p>{feature}</p></article>)}</section><footer className="cabinet-footer"><BellRing /> {c.note}</footer></main>;
}
