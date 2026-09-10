"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { analyticsConsentKey, trackEvent, type AnalyticsEvent } from "../lib/analytics";
import { isLocale, localePath, siteConfig } from "../lib/site-config";
import "../analytics-consent.css";
const text = {
  ro: { title: "Măsurarea vizitelor", body: "Cu acordul tău, folosim Google Analytics pentru a înțelege vizitele și solicitările. Poți refuza sau schimba alegerea oricând.", accept: "Accept", reject: "Refuz", settings: "Preferințe cookies", policy: "Detalii" },
  ru: { title: "Статистика посещений", body: "С вашего согласия Google Analytics помогает нам понимать посещения и обращения. Вы можете отказаться или изменить выбор в любое время.", accept: "Разрешить", reject: "Отказаться", settings: "Настройки cookies", policy: "Подробнее" },
  en: { title: "Visit measurement", body: "With your permission, Google Analytics helps us understand visits and enquiries. You can decline or change your choice at any time.", accept: "Accept", reject: "Decline", settings: "Cookie preferences", policy: "Details" },
};
export function AnalyticsConsent({ measurementId }: { measurementId: string }) {
  const [choice, setChoice] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const path = usePathname() ?? "/ro";
  const segment = path.split("/")[1];
  const locale = isLocale(segment) ? segment : "ro";
  const c = text[locale];
  const configured = /^G-[A-Z0-9]+$/.test(measurementId) && path.replace(/\/+$/, "") !== "/cabinet";
  useEffect(() => {
    const frame = requestAnimationFrame(() => { try { setChoice(localStorage.getItem(analyticsConsentKey)); } catch { /* Stay unconsented. */ } });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    const gaWindow = window as unknown as Record<string, unknown>;
    if (!configured || choice !== "accepted") {
      // Stop a previously loaded runtime on private routes or after consent changes.
      gaWindow[`ga-disable-${measurementId}`] = true;
      return;
    }
    gaWindow[`ga-disable-${measurementId}`] = false;
    window.dataLayer ??= [];
    window.gtag ??= function gtag() {
      // Google's command queue expects the Arguments object from its documented snippet.
      // eslint-disable-next-line prefer-rest-params -- Preserve the vendor's queue protocol.
      window.dataLayer?.push(arguments);
    };
    if (!document.getElementById("mono-ga")) window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    if (!document.getElementById("mono-ga")) {
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: `${siteConfig.url}${path}`, page_referrer: "" });
      const script = document.createElement("script"); script.id = "mono-ga"; script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`; document.head.appendChild(script);
    }
    // Exclude prefilled enquiries and filters from collected page URLs.
    window.gtag("set", { page_location: `${siteConfig.url}${path}`, page_referrer: "" });
    window.gtag("event", "page_view", { page_location: `${siteConfig.url}${path}`, page_title: document.title, page_referrer: "" });
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-analytics-event], a[href^='mailto:'], a[href^='tel:']") : null;
      if (!target) return;
      const name = target.dataset.analyticsEvent ?? (target.getAttribute("href")?.startsWith("tel:") ? "phone_click" : "email_click");
      const fields: Record<string, string> = {};
      for (const key of ["project", "option", "language"]) if (target.dataset[key]) fields[key] = target.dataset[key]!;
      trackEvent(name as AnalyticsEvent, fields);
    };
    document.addEventListener("click", click, true);
    return () => document.removeEventListener("click", click, true);
  }, [choice, configured, measurementId, path]);
  const choose = (value: "accepted" | "declined") => {
    try { localStorage.setItem(analyticsConsentKey, value); } catch { return; }
    setChoice(value); setSettingsOpen(false);
    if (value === "declined") {
      (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
      window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      document.getElementById("mono-ga")?.remove();
      for (const cookie of document.cookie.split(";")) { const name = cookie.split("=")[0].trim(); if (/^_ga(?:_|$)/.test(name)) for (const domain of ["", `;domain=${location.hostname}`, `;domain=.${location.hostname}`]) document.cookie = `${name}=;max-age=0;path=/${domain};SameSite=Lax`; }
      // A reload discards the already loaded vendor runtime after withdrawal.
      if (window.gtag) window.location.reload();
    }
  };
  if (!configured) return null;
  return <>{choice && !settingsOpen ? <button className="cookie-settings" onClick={() => setSettingsOpen(true)}>{c.settings}</button> : <aside className="cookie-consent" aria-label={c.title}><strong>{c.title}</strong><p>{c.body} <a href={localePath(locale, "cookies")}>{c.policy}</a></p><div><button onClick={() => choose("accepted")}>{c.accept}</button><button onClick={() => choose("declined")}>{c.reject}</button></div></aside>}</>;
}
