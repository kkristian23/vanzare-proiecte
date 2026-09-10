import { BrandLogo } from "../brand-logo";
import { localePath, locales, type Locale } from "../lib/site-config";
import { breadcrumbSchema, JsonLd } from "./json-ld";
import "../seo-pages.css";
const labels = {
  ro: { home: "Proiecte", services: "Servicii", contact: "Contact", about: "Despre", process: "Proces", faq: "Întrebări", privacy: "Confidențialitate", terms: "Termeni", cookies: "Cookies", language: "Limbă", nav: "Navigare" },
  ru: { home: "Проекты", services: "Услуги", contact: "Контакты", about: "О нас", process: "Процесс", faq: "Вопросы", privacy: "Конфиденциальность", terms: "Условия", cookies: "Cookies", language: "Язык", nav: "Навигация" },
  en: { home: "Projects", services: "Services", contact: "Contact", about: "About", process: "Process", faq: "Questions", privacy: "Privacy", terms: "Terms", cookies: "Cookies", language: "Language", nav: "Navigation" },
};
export function SeoLinks({ locale }: { locale: Locale }) { const c = labels[locale]; return <nav className="seo-links" aria-label={c.nav}>{([['services', c.services], ['about', c.about], ['process', c.process], ['intrebari', c.faq], ['contact', c.contact], ['privacy', c.privacy], ['terms', c.terms], ['cookies', c.cookies]] as const).map(([path, name]) => <a key={path} href={localePath(locale, path)}>{name}</a>)}</nav>; }
export function FooterLinks({ locale }: { locale: Locale }) { return <div className="footer-seo-links"><SeoLinks locale={locale} /></div>; }
export function SeoShell({ locale, path, title, description, children }: { locale: Locale; path: string; title: string; description?: string; children: React.ReactNode }) {
  const c = labels[locale];
  const crumbs = [{ name: c.home, url: localePath(locale) }, ...(path.startsWith("services/") ? [{ name: c.services, url: localePath(locale, "services") }] : []), { name: title, url: localePath(locale, path) }];
  return <div className="seo-page"><header className="seo-nav"><BrandLogo href={localePath(locale)} inverse /><nav aria-label={c.nav}><a href={localePath(locale)}>{c.home}</a><a href={localePath(locale, "services")}>{c.services}</a><a href={localePath(locale, "contact")}>{c.contact}</a></nav><nav className="seo-languages" aria-label={c.language}>{locales.map(language => <a key={language} href={localePath(language, path)} hrefLang={language} lang={language} aria-current={language === locale ? "page" : undefined} data-analytics-event="language_change" data-language={language}>{language.toUpperCase()}</a>)}</nav></header>
    <main><nav className="seo-breadcrumbs" aria-label={{ ro: "Traseul paginii", ru: "Путь к странице", en: "Breadcrumb" }[locale]}>{crumbs.map((item, index) => index === crumbs.length - 1 ? <span key={item.url} aria-current="page">{item.name}</span> : <a key={item.url} href={item.url}>{item.name}</a>)}</nav><header className="seo-hero"><p className="seo-eyebrow">MONO/DEV</p><h1>{title}</h1>{description && <p>{description}</p>}</header>{children}</main>
    <footer className="seo-footer"><p>MONO/DEV · Moldova · {locale === "ru" ? "Международное сотрудничество" : locale === "ro" ? "Colaborare internațională" : "International collaboration"}</p><FooterLinks locale={locale} /></footer><JsonLd data={breadcrumbSchema(crumbs)} /></div>;
}
