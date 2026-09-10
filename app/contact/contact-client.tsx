"use client";

import { ArrowLeft, ArrowUpRight, Check, Copy, Mail, MapPin, Phone, Terminal } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { contactCopy, Locale, locales } from "../i18n";
import { BrandLogo } from "../brand-logo";
import { localePath, siteConfig } from "../lib/site-config";
import { FooterLinks } from "../components/seo-shell";
import { trackEvent } from "../lib/analytics";
import { contactOptionLabel, contactRequestMessage } from "../lib/contact-request";
import "./contact.css";
import "../page-language-switch.css";

export default function ContactPage({ initialLocale = "ro" }: { initialLocale?: Locale }) {
  const started = useRef(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const locale = initialLocale;
  const [message, setMessage] = useState("");
  const [catalogRequest, setCatalogRequest] = useState({ project: "", option: "" });
  useEffect(() => {
    const url = new URL(window.location.href);
    const project = url.searchParams.get("project") ?? "";
    const option = url.searchParams.get("option") ?? "";
    const frame = requestAnimationFrame(() => {
      setCatalogRequest({ project, option });
      if (project) setMessage(contactRequestMessage(locale, project, option));
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);
  const c = contactCopy[locale];
  const intro = {
    ro: {
      eyebrow: "Din Moldova către oriunde",
      title: "Site-uri pentru afaceri din Moldova și dincolo de granițe",
      text: "MONO/DEV construiește site-uri, magazine online și platforme web. Poți porni de la un proiect demonstrativ din catalog sau discuta o soluție personalizată. Alegem împreună funcțiile, adaptăm conținutul și verificăm proiectul înainte de lansare, pentru colaborări în Moldova și internațional.",
    },
    ru: {
      eyebrow: "Из Молдовы — в любую точку мира",
      title: "Сайты для бизнеса в Молдове и за её пределами",
      text: "MONO/DEV создаёт сайты, интернет-магазины и веб-платформы. Вы можете выбрать демонстрационный проект из каталога или обсудить индивидуальную разработку. Вместе определяем функции, адаптируем контент и проверяем проект перед запуском — для бизнеса в Молдове и международных заказчиков.",
    },
    en: {
      eyebrow: "From Moldova to anywhere",
      title: "Websites for businesses in Moldova and around the world",
      text: "MONO/DEV builds websites, online stores and web platforms. Start with a demonstration project from the catalog or discuss a custom solution. We agree on the features, adapt the content and check the project before launch, working with businesses in Moldova and internationally.",
    },
  }[locale];
  const backHref = localePath(locale);
  const contactCode = [
    ["const", " contact", " = {"], ["  phone:", " \"+373 78 868 996\"", ","],
    ["  email:", " \"monodev@gmail.com\"", ","], ["  location:", " \"Moldova\"", ","],
    ["  response:", " \"≤ 12h\"", ","], ["  status:", " true", ""], ["};", "", ""],
  ];

  const copyEmail = async () => {
    await navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `${c.mailSubject} — ${data.get("project")}`;
    const body = [
      `${c.mailName}: ${data.get("name")}`,
      `${c.mailEmail}: ${data.get("email")}`,
      `${c.mailProject}: ${data.get("project")}`,
      `${c.mailBudget}: ${data.get("budget")}`,
      catalogRequest.project ? `${locale === "ru" ? "Каталог" : locale === "en" ? "Catalogue" : "Catalog"}: ${catalogRequest.project} (${contactOptionLabel(locale, catalogRequest.option)})` : "",
      "",
      String(data.get("message")),
    ].join("\n");
    trackEvent("form_submit", { method: "mailto_handoff" });
    setSent(true);
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return <main className="contact-page">
    <div className="contact-noise" aria-hidden="true"/>
    <header className="contact-nav">
      <BrandLogo className="contact-logo" href={backHref} inverse />
      <div className="contact-runtime"><i/> {c.systemOnline} <b>v2.6.0</b></div>
      <div className="page-nav-tools">
        <nav className="page-language-switch" aria-label={locale === "ru" ? "Язык" : locale === "en" ? "Language" : "Limbă"}>
          {locales.map((language) => <a key={language} className={locale === language ? "active" : ""} href={localePath(language, "contact")} onClick={() => { try { localStorage.setItem("mono-locale", language); } catch { /* Optional preference. */ } }} data-analytics-event="language_change" data-language={language} hrefLang={language} lang={language}>{language.toUpperCase()}</a>)}
        </nav>
      </div>
    </header>

    <section className="contact-hero">
      <div className="contact-heading">
        <a className="contact-back contact-hero-back" href={backHref}><ArrowLeft/> {c.back}</a>
        <p><span>01</span> {c.initialize}</p>
        <h1>{c.hero[0]}<br/><em>{c.hero[1]}</em><br/>{c.hero[2]} <i>{c.hero[3]}</i></h1>
        <div className="contact-command"><Terminal/><span>mono@dev:~$</span><b>start --project</b><i>_</i></div>
      </div>

      <div className="contact-code-card">
        <div className="code-title"><span><i/><i/><i/></span><b>contact.ts</b><em>TypeScript</em></div>
        <ol>{contactCode.map((line,index)=><li key={index}><span>{String(index+1).padStart(2,"0")}</span><code><b>{line[0]}</b><i>{line[1]}</i>{line[2]}</code></li>)}</ol>
        <div className="code-status"><Check/> {c.compiled} <span>42ms</span></div>
      </div>
    </section>

    <section className="contact-workspace">
      <aside className="contact-sidebar">
        <p className="contact-label">{c.connectionDetails}</p>
        <article><Phone/><div><small>{c.phone}</small><a href="tel:+37378868996">+373 78 868 996</a></div></article>
        <article><Mail/><div><small>{c.email}</small><a href="mailto:monodev@gmail.com">monodev@gmail.com</a></div><button onClick={copyEmail} aria-label={copied ? c.copiedEmail : c.copyEmail}>{copied?<Check/>:<Copy/>}</button></article>
        <article><MapPin/><div><small>{c.location}</small><strong>Moldova</strong></div></article>
        <article><Terminal/><div><small>{c.responseTime}</small><strong>{c.response}</strong></div></article>
        <div className="availability-card"><span><i/> {c.available}</span><p>{c.availability} <b>2026</b>.</p><small>STATUS_CODE: 200_OK</small></div>
      </aside>

      <div className="brief-panel">
        <div className="brief-head"><div><p className="contact-label">{c.newRequest}</p><h2>{c.brief[0]}<br/><em>{c.brief[1]}</em></h2></div><span>EMAIL<br/>mailto:</span></div>
        {sent ? <div className="request-success"><div><Check/></div><p>{c.accepted}</p><h3>{c.emailReady}</h3><span>{c.emailFallback}</span><button onClick={()=>setSent(false)}>{c.another}</button></div> : <form onSubmit={submit} onFocus={() => { if (!started.current) { trackEvent("form_start"); started.current = true; } }} className="contact-form">
          <label><span><b>01</b> name: string</span><input name="name" required placeholder={c.namePlaceholder}/></label>
          <label><span><b>02</b> email: string</span><input name="email" type="email" required placeholder={c.emailPlaceholder}/></label>
          <label><span><b>03</b> project: enum</span><select name="project" required defaultValue=""><option value="" disabled>{c.selectType}</option>{c.projectTypes.map(type=><option key={type}>{type}</option>)}</select></label>
          <label><span><b>04</b> budget: enum</span><select name="budget" required defaultValue=""><option value="" disabled>{c.selectBudget}</option><option>350 — 700 €</option><option>700 — 1.500 €</option><option>1.500 — 3.000 €</option><option>3.000 € +</option></select></label>
          <label className="form-wide"><span><b>05</b> message: string</span><textarea name="message" required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={c.messagePlaceholder}/></label>
          <button className="contact-submit" type="submit"><span>{c.submit}</span><ArrowUpRight/></button>
        </form>}
      </div>
    </section>

    <section className="contact-intro" aria-labelledby="contact-intro-title">
      <div className="contact-intro-marker" aria-hidden="true"><span>MD</span><i /></div>
      <div className="contact-intro-copy">
        <p className="contact-label"><span>03</span> {intro.eyebrow}</p>
        <h2 id="contact-intro-title">{intro.title}</h2>
        <p>{intro.text}</p>
      </div>
      <div className="contact-intro-orbit" aria-hidden="true"><i /><i /><i /></div>
    </section>
    <footer className="contact-footer"><div className="contact-footer-main"><span>© 2026 MONO/DEV</span><p>{c.footer}</p><a href="mailto:monodev@gmail.com">monodev@gmail.com <ArrowUpRight/></a></div><FooterLinks locale={locale} /></footer>
  </main>;
}
