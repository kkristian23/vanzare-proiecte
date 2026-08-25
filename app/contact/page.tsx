"use client";

import { ArrowLeft, ArrowUpRight, Check, Copy, Mail, MapPin, Phone, Terminal } from "lucide-react";
import { FormEvent, useState } from "react";
import "./contact.css";

const contactCode = [
  ["const", " contact", " = {"],
  ["  phone:", " \"+373 78 868 996\"", ","],
  ["  email:", " \"monodev@gmail.com\"", ","],
  ["  location:", " \"Moldova\"", ","],
  ["  response:", " \"≤ 12h\"", ","],
  ["  status:", " true", ""],
  ["};", "", ""],
];

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("monodev@gmail.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Brief proiect — ${data.get("project")}`;
    const body = [
      `Nume: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Tip proiect: ${data.get("project")}`,
      `Buget: ${data.get("budget")}`,
      "",
      String(data.get("message")),
    ].join("\n");
    setSent(true);
    window.location.href = `mailto:monodev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return <main className="contact-page">
    <div className="contact-noise" aria-hidden="true"/>
    <header className="contact-nav">
      <a className="contact-logo" href="/">M<span>O</span>NO/DEV</a>
      <div className="contact-runtime"><i/> SYSTEM ONLINE <b>v2.6.0</b></div>
      <a className="contact-back" href="/"><ArrowLeft/> Înapoi la proiecte</a>
    </header>

    <section className="contact-hero">
      <div className="contact-heading">
        <p><span>01</span> / INITIALIZE CONTACT</p>
        <h1>HAI SĂ<br/><em>CONSTRUIM</em><br/>CEVA <i>RAR.</i></h1>
        <div className="contact-command"><Terminal/><span>mono@dev:~$</span><b>start --project</b><i>_</i></div>
      </div>

      <div className="contact-code-card">
        <div className="code-title"><span><i/><i/><i/></span><b>contact.ts</b><em>TypeScript</em></div>
        <ol>{contactCode.map((line,index)=><li key={index}><span>{String(index+1).padStart(2,"0")}</span><code><b>{line[0]}</b><i>{line[1]}</i>{line[2]}</code></li>)}</ol>
        <div className="code-status"><Check/> compiled successfully <span>42ms</span></div>
      </div>
    </section>

    <section className="contact-workspace">
      <aside className="contact-sidebar">
        <p className="contact-label">/ CONNECTION DETAILS</p>
        <article><Phone/><div><small>PHONE</small><a href="tel:+37378868996">+373 78 868 996</a></div></article>
        <article><Mail/><div><small>PRIMARY_ENDPOINT</small><a href="mailto:monodev@gmail.com">monodev@gmail.com</a></div><button onClick={copyEmail} aria-label="Copiază adresa de email">{copied?<Check/>:<Copy/>}</button></article>
        <article><MapPin/><div><small>LOCATION</small><strong>Moldova</strong></div></article>
        <article><Terminal/><div><small>RESPONSE_TIME</small><strong>maximum 12 hours</strong></div></article>
        <div className="availability-card"><span><i/> AVAILABLE</span><p>Acceptăm proiecte noi pentru <b>2027</b>.</p><small>STATUS_CODE: 200_OK</small></div>
      </aside>

      <div className="brief-panel">
        <div className="brief-head"><div><p className="contact-label">/ NEW_PROJECT.REQUEST</p><h2>Trimite-ne<br/><em>brief-ul.</em></h2></div><span>POST<br/>/api/hello</span></div>
        {sent ? <div className="request-success"><div><Check/></div><p>REQUEST ACCEPTED</p><h3>Clientul tău de email este pregătit.</h3><span>Dacă nu s-a deschis automat, scrie-ne direct la monodev@gmail.com.</span><button onClick={()=>setSent(false)}>Creează alt request</button></div> : <form onSubmit={submit} className="contact-form">
          <label><span><b>01</b> name: string</span><input name="name" required placeholder="Cum te numești?"/></label>
          <label><span><b>02</b> email: string</span><input name="email" type="email" required placeholder="tu@companie.md"/></label>
          <label><span><b>03</b> project: enum</span><select name="project" required defaultValue=""><option value="" disabled>Selectează tipul</option><option>Website de prezentare</option><option>Magazin online</option><option>Platformă / aplicație</option><option>Personalizare proiect existent</option><option>Alt proiect digital</option></select></label>
          <label><span><b>04</b> budget: enum</span><select name="budget" required defaultValue=""><option value="" disabled>Selectează bugetul</option><option>350 — 700 €</option><option>700 — 1.500 €</option><option>1.500 — 3.000 €</option><option>3.000 € +</option></select></label>
          <label className="form-wide"><span><b>05</b> message: string</span><textarea name="message" required rows={5} placeholder="Descrie ideea, obiectivul și ce ai vrea să lansăm..."/></label>
          <button className="contact-submit" type="submit"><span>RUN REQUEST</span><ArrowUpRight/></button>
        </form>}
      </div>
    </section>

    <footer className="contact-footer"><span>© 2026 MONO/DEV</span><p>DESIGN → CODE → LAUNCH</p><a href="mailto:monodev@gmail.com">monodev@gmail.com <ArrowUpRight/></a></footer>
  </main>;
}
