import { notFound } from "next/navigation";
import { isLocale, localePath, pageMetadata, siteConfig } from "../lib/site-config";
import { trustContent, type TrustPath } from "../lib/trust-content";
import { SeoShell } from "./seo-shell";

export type TrustPageProps = { params: Promise<{ locale: string }> };
export async function trustMetadata({ params }: TrustPageProps, path: TrustPath) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = trustContent[locale][path];
  return pageMetadata(locale, path, copy.title, copy.description);
}
export async function TrustPage({ params, path }: TrustPageProps & { path: TrustPath }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = trustContent[locale][path];
  const labels = { ro: { contact: "Discută proiectul", services: "Servicii web", projects: "Explorează proiectele", sources: "Informații de la furnizori", google: "Google Analytics: utilizarea cookies", netlify: "Netlify: politica de confidențialitate" }, ru: { contact: "Обсудить проект", services: "Веб-услуги", projects: "Посмотреть проекты", sources: "Информация провайдеров", google: "Google Analytics: использование cookies", netlify: "Netlify: политика конфиденциальности" }, en: { contact: "Discuss your project", services: "Web services", projects: "Explore projects", sources: "Provider information", google: "Google Analytics cookie usage", netlify: "Netlify privacy policy" } }[locale];
  return <SeoShell locale={locale} path={path} title={copy.title} description={copy.description}>
    {copy.sections.map((section) => <section className="seo-section" key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
    {(path === "cookies" || path === "privacy") && <section className="seo-section"><h2>{labels.sources}</h2><ul><li><a href="https://support.google.com/analytics/answer/11397207">{labels.google}</a></li>{path === "privacy" && <li><a href="https://www.netlify.com/privacy/">{labels.netlify}</a></li>}</ul></section>}
    <section className="seo-section seo-cta"><h2>{labels.contact}</h2><p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p><nav className="seo-links" aria-label={labels.contact}><a href={localePath(locale, "contact")}>{labels.contact}</a><a href={localePath(locale, "services")}>{labels.services}</a><a href={localePath(locale)}>{labels.projects}</a></nav></section>
  </SeoShell>;
}
