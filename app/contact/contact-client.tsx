"use client";
import { cmsContent, cmsText } from "../lib/cms-store";
import { useCms } from "../components/cms-live";
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
  useCms();
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
  const intro = cmsContent("contact-client-intro", {
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
  })[locale];
  const backHref = localePath(locale);
  const contactCode = [
    ["const", " contact", " = {"], ["  phone:", ` "${siteConfig.phone}"`, ","],
    ["  email:", ` "${siteConfig.email}"`, ","], ["  location:", ` "${siteConfig.country}"`, ","],
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
      catalogRequest.project ? `${locale === "ru" ? cmsText("contact-client", "literal-d0ef3540b088bbf6", "Каталог") : locale === "en" ? cmsText("contact-client", "literal-103451395067d389", "Catalogue") : cmsText("contact-client", "literal-3877d14889a9909b", "Catalog")}: ${catalogRequest.project} (${contactOptionLabel(locale, catalogRequest.option)})` : "",
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
      <div className="contact-runtime"><i/> {c.systemOnline} <b>{cmsText("contact-client", "literal-c072f14cdd73a6e3", "v2.6.0")}</b></div>
      <div className="page-nav-tools">
        <nav className="page-language-switch" aria-label={locale === "ru" ? cmsText("contact-client", "literal-5bd57038dbadd651", "Язык") : locale === "en" ? cmsText("contact-client", "literal-a4fe65264ef7dbb3", "Language") : cmsText("contact-client", "literal-2a533ab0d1730ecf", "Limbă")}>
          {locales.map((language) => <a key={language} className={locale === language ? "active" : ""} href={localePath(language, "contact")} onClick={() => { try { localStorage.setItem("mono-locale", language); } catch { /* Optional preference. */ } }} data-analytics-event="language_change" data-language={language} hrefLang={language} lang={language}>{language.toUpperCase()}</a>)}
        </nav>
      </div>
    </header>

    <section className="contact-hero">
      <div className="contact-heading">
        <a className="contact-back contact-hero-back" href={backHref}><ArrowLeft/> {c.back}</a>
        <p><span>{cmsText("contact-client", "literal-938db8c9f82c8cb5", "01")}</span> {c.initialize}</p>
        <h1>{c.hero[0]}<br/><em>{c.hero[1]}</em><br/>{c.hero[2]} <i>{c.hero[3]}</i></h1>
        <div className="contact-command"><Terminal/><span>{cmsText("contact-client", "literal-df6e8f48e874ed3a", "mono@dev:~$")}</span><b>{cmsText("contact-client", "literal-629a6e9dc9528fac", "start --project")}</b><i>{cmsText("contact-client", "literal-d2e2adf7177b7a8a", "_")}</i></div>
      </div>

      <div className="contact-code-card">
        <div className="code-title"><span><i/><i/><i/></span><b>{cmsText("contact-client", "literal-0132e7262985de35", "contact.ts")}</b><em>{cmsText("contact-client", "literal-ed0504f70a48ffe9", "TypeScript")}</em></div>
        <ol>{contactCode.map((line,index)=><li key={index}><span>{String(index+1).padStart(2,"0")}</span><code><b>{line[0]}</b><i>{line[1]}</i>{line[2]}</code></li>)}</ol>
        <div className="code-status"><Check/> {c.compiled} <span>{cmsText("contact-client", "literal-875cdff1a95ab157", "42ms")}</span></div>
      </div>
    </section>

    <section className="contact-workspace">
      <aside className="contact-sidebar">
        <p className="contact-label">{c.connectionDetails}</p>
        <article><Phone/><div><small>{c.phone}</small><a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a></div></article>
        <article><Mail/><div><small>{c.email}</small><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div><button onClick={copyEmail} aria-label={copied ? c.copiedEmail : c.copyEmail}>{copied?<Check/>:<Copy/>}</button></article>
        <article><MapPin/><div><small>{c.location}</small><strong>{siteConfig.country}</strong></div></article>
        <article><Terminal/><div><small>{c.responseTime}</small><strong>{c.response}</strong></div></article>
        <div className="availability-card"><span><i/> {c.available}</span><p>{c.availability} <b>{cmsText("contact-client", "literal-158a323a7ba44870", "2026")}</b>{cmsText("contact-client", "literal-cdb4ee2aea69cc6a", ".")}</p><small>{cmsText("contact-client", "literal-775cd17ee415e711", "STATUS_CODE: 200_OK")}</small></div>
      </aside>

      <div className="brief-panel">
        <div className="brief-head"><div><p className="contact-label">{c.newRequest}</p><h2>{c.brief[0]}<br/><em>{c.brief[1]}</em></h2></div><span>{cmsText("contact-client", "literal-72d90af393d61072", "EMAIL")}<br/>{cmsText("contact-client", "literal-de1eaa596f93759e", "mailto:")}</span></div>
        {sent ? <div className="request-success"><div><Check/></div><p>{c.accepted}</p><h3>{c.emailReady}</h3><span>{c.emailFallback}</span><button onClick={()=>setSent(false)}>{c.another}</button></div> : <form onSubmit={submit} onFocus={() => { if (!started.current) { trackEvent("form_start"); started.current = true; } }} className="contact-form">
          <label><span><b>{cmsText("contact-client", "literal-938db8c9f82c8cb5", "01")}</b> {cmsText("contact-client", "literal-014143066c409f1d", " name: string")}</span><input name="name" required placeholder={c.namePlaceholder}/></label>
          <label><span><b>{cmsText("contact-client", "literal-a953f09a1b6b6725", "02")}</b> {cmsText("contact-client", "literal-19cca481d198ba96", " email: string")}</span><input name="email" type="email" required placeholder={c.emailPlaceholder}/></label>
          <label><span><b>{cmsText("contact-client", "literal-0b8efa5a3bf10441", "03")}</b> {cmsText("contact-client", "literal-c7d77f60d8fd6461", " project: enum")}</span><select name="project" required defaultValue=""><option value="" disabled>{c.selectType}</option>{c.projectTypes.map(type=><option key={type}>{type}</option>)}</select></label>
          <label><span><b>{cmsText("contact-client", "literal-6cd5b6e51936a442", "04")}</b> {cmsText("contact-client", "literal-73beb43aa586891d", " budget: enum")}</span><select name="budget" required defaultValue=""><option value="" disabled>{c.selectBudget}</option><option>{cmsText("contact-client", "literal-4b5144f016479c76", "350 — 700 €")}</option><option>{cmsText("contact-client", "literal-6249baa640bb0bef", "700 — 1.500 €")}</option><option>{cmsText("contact-client", "literal-78604b04e224f385", "1.500 — 3.000 €")}</option><option>{cmsText("contact-client", "literal-84f7abc032892aa0", "3.000 € +")}</option></select></label>
          <label className="form-wide"><span><b>{cmsText("contact-client", "literal-c97550ce8213ef5c", "05")}</b> {cmsText("contact-client", "literal-54671566230051a4", " message: string")}</span><textarea name="message" required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={c.messagePlaceholder}/></label>
          <button className="contact-submit" type="submit"><span>{c.submit}</span><ArrowUpRight/></button>
        </form>}
      </div>
    </section>

    <section className="contact-intro" aria-labelledby="contact-intro-title">
      <div className="contact-intro-marker" aria-hidden="true"><span>{cmsText("contact-client", "literal-7abcf6dac49247ef", "MD")}</span><i /></div>
      <div className="contact-intro-copy">
        <p className="contact-label"><span>{cmsText("contact-client", "literal-0b8efa5a3bf10441", "03")}</span> {intro.eyebrow}</p>
        <h2 id="contact-intro-title">{intro.title}</h2>
        <p>{intro.text}</p>
      </div>
      <div className="contact-intro-orbit" aria-hidden="true"><i /><i /><i /></div>
    </section>
    <footer className="contact-footer"><div className="contact-footer-main"><span>{cmsText("contact-client", "literal-b17f48f4917456d7", "© 2026 MONO/DEV")}</span><p>{c.footer}</p><a href="mailto:monodev@gmail.com">{cmsText("contact-client", "literal-a6ff24aaadfcdcbb", "monodev@gmail.com ")}<ArrowUpRight/></a></div><FooterLinks locale={locale} /></footer>
  </main>;
}
