import type { Metadata } from "next";
export const locales = ["ro", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const seoLocales = { ro: "ro-MD", ru: "ru-MD", en: "en" } as const;
export const siteConfig = { name: "MONO/DEV", url: "https://monodev.md", email: "monodev@gmail.com", phone: "+37378868996", country: "Moldova", locales, defaultLocale: "ro" as Locale, socialProfiles: [] as string[], ogImage: "/og.png", ogWidth: 1731, ogHeight: 909 } as const;
export const defaultCopy = {
  ro: { title: "Creare site-uri în Moldova și catalog web | MONO/DEV", description: "MONO/DEV creează site-uri, magazine online și platforme web pentru Moldova. Explorează catalogul, personalizarea, cumpărarea în rate sau închirierea unui site." },
  ru: { title: "Создание сайтов в Молдове и каталог проектов | MONO/DEV", description: "MONO/DEV создаёт сайты, интернет-магазины и веб-платформы для бизнеса в Молдове. Выберите проект, обсудите адаптацию, покупку в рассрочку или аренду сайта." },
  en: { title: "Web development in Moldova & website catalog | MONO/DEV", description: "MONO/DEV builds websites, online stores and web applications in Moldova. Explore projects, customization, purchase, installments and website rental options." },
} as const;
export function isLocale(value: unknown): value is Locale { return locales.includes(value as Locale); }
export function localePath(locale: Locale, path = "") { const clean = path.replace(/^\/+|\/+$/g, ""); return `/${locale}${clean ? `/${clean}` : ""}`; }
export function absoluteUrl(path = "") { return new URL(path || "/", siteConfig.url).href; }
export function canonicalUrl(locale: Locale, path = "") { return absoluteUrl(localePath(locale, path)); }
export function alternateLanguages(path = "") { return { "ro-MD": canonicalUrl("ro", path), "ru-MD": canonicalUrl("ru", path), en: canonicalUrl("en", path), "x-default": canonicalUrl("en", path) }; }
export function pageMetadata(locale: Locale, path = "", title?: string, description?: string, image: string = siteConfig.ogImage): Metadata {
  const pageTitle = title ? `${title.replace(/\s*[|—]\s*MONO\/DEV$/, "")} | MONO/DEV` : defaultCopy[locale].title;
  const summary = description ?? defaultCopy[locale].description;
  const imageUrl = absoluteUrl(image);
  return { title: { absolute: pageTitle }, description: summary, alternates: { canonical: canonicalUrl(locale, path), languages: alternateLanguages(path) },
    openGraph: { type: "website", siteName: siteConfig.name, title: pageTitle, description: summary, url: canonicalUrl(locale, path), locale: { ro: "ro_MD", ru: "ru_MD", en: "en_US" }[locale], alternateLocale: locales.filter(value => value !== locale).map(value => ({ ro: "ro_MD", ru: "ru_MD", en: "en_US" })[value]), images: [{ url: imageUrl, ...(image === siteConfig.ogImage ? { width: siteConfig.ogWidth, height: siteConfig.ogHeight } : {}), alt: pageTitle }] },
    twitter: { card: "summary_large_image", title: pageTitle, description: summary, images: [imageUrl] } };
}
