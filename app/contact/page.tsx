"use client";

import { ArrowLeft, ArrowUpRight, Check, Copy, Mail, MapPin, Phone, Terminal } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { contactCopy, Locale, locales } from "../i18n";
import { BrandLogo } from "../brand-logo";
import "./contact.css";
import "../page-language-switch.css";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [locale, setLocale] = useState<Locale>("ro");
  const [message, setMessage] = useState("");
  const c = contactCopy[locale];
  const backHref = locale === "ro" ? "/" : `/?lang=${locale}`;
  const [catalogRequest, setCatalogRequest] = useState({ project: "", option: "" });
  const contactCode = [
    ["const", " contact", " = {"], ["  phone:", " \"+373 78 868 996\"", ","],
    ["  email:", " \"monodev@gmail.com\"", ","], ["  location:", " \"Moldova\"", ","],
    ["  response:", " \"≤ 12h\"", ","], ["  status:", " true", ""], ["};", "", ""],
  ];

  useEffect(() => {
    const urlLocale = new URL(window.location.href).searchParams.get("lang");
    const savedLocale = localStorage.getItem("mono-locale");
    const nextLocale = locales.includes(urlLocale as Locale) ? urlLocale as Locale : locales.includes(savedLocale as Locale) ? savedLocale as Locale : "ro";
    setLocale(nextLocale);
    document.documentElement.lang = nextLocale;
    const project = new URL(window.location.href).searchParams.get("project") ?? "";
    const option = new URL(window.location.href).searchParams.get("option") ?? "";
    setCatalogRequest({ project, option });
    if (project) setMessage(`Sunt interesat(ă) de ${option === "rental" ? "arendarea" : "cumpărarea"} proiectului ${project}.`);
  }, []);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("monodev@gmail.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const changeLocale = (nextLocale: Locale) => {
    localStorage.setItem("mono-locale", nextLocale);
    const url = new URL(window.location.href);
    if (nextLocale === "ro") url.searchParams.delete("lang");
    else url.searchParams.set("lang", nextLocale);
    window.history.replaceState({}, "", url);
    document.documentElement.lang = nextLocale;
    setLocale(nextLocale);
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
      catalogRequest.project ? `Catalog: ${catalogRequest.project} (${catalogRequest.option === "rental" ? "arendă" : "cumpărare"})` : "",
      "",
      String(data.get("message")),
    ].join("\n");
    setSent(true);
    window.location.href = `mailto:monodev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return <main className="contact-page">
    <div className="contact-noise" aria-hidden="true"/>
    <header className="contact-nav">
      <BrandLogo className="contact-logo" href={backHref} inverse />
      <div className="contact-runtime"><i/> {c.systemOnline} <b>v2.6.0</b></div>
      <div className="page-nav-tools">
        <div className="page-language-switch" aria-label="Limbă">
          {locales.map((language) => <button key={language} className={locale === language ? "active" : ""} onClick={() => changeLocale(language)} lang={language}>{language.toUpperCase()}</button>)}
        </div>
        <a className="contact-back" href={backHref}><ArrowLeft/> {c.back}</a>
      </div>
    </header>

    <section className="contact-hero">
      <div className="contact-heading">
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
        <div className="availability-card"><span><i/> {c.available}</span><p>{c.availability} <b>2027</b>.</p><small>STATUS_CODE: 200_OK</small></div>
      </aside>

      <div className="brief-panel">
        <div className="brief-head"><div><p className="contact-label">{c.newRequest}</p><h2>{c.brief[0]}<br/><em>{c.brief[1]}</em></h2></div><span>POST<br/>/api/hello</span></div>
        {sent ? <div className="request-success"><div><Check/></div><p>{c.accepted}</p><h3>{c.emailReady}</h3><span>{c.emailFallback}</span><button onClick={()=>setSent(false)}>{c.another}</button></div> : <form onSubmit={submit} className="contact-form">
          <label><span><b>01</b> name: string</span><input name="name" required placeholder={c.namePlaceholder}/></label>
          <label><span><b>02</b> email: string</span><input name="email" type="email" required placeholder={c.emailPlaceholder}/></label>
          <label><span><b>03</b> project: enum</span><select name="project" required defaultValue=""><option value="" disabled>{c.selectType}</option>{c.projectTypes.map(type=><option key={type}>{type}</option>)}</select></label>
          <label><span><b>04</b> budget: enum</span><select name="budget" required defaultValue=""><option value="" disabled>{c.selectBudget}</option><option>350 — 700 €</option><option>700 — 1.500 €</option><option>1.500 — 3.000 €</option><option>3.000 € +</option></select></label>
          <label className="form-wide"><span><b>05</b> message: string</span><textarea name="message" required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={c.messagePlaceholder}/></label>
          <button className="contact-submit" type="submit"><span>{c.submit}</span><ArrowUpRight/></button>
        </form>}
      </div>
    </section>

    <footer className="contact-footer"><span>© 2026 MONO/DEV</span><p>{c.footer}</p><a href="mailto:monodev@gmail.com">monodev@gmail.com <ArrowUpRight/></a></footer>
  </main>;
}
