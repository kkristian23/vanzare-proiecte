import { contactMeta as copy } from "../../lib/contact-meta";
import { notFound } from "next/navigation";
import ContactPage from "../../contact/contact-client";
import { isLocale, localePath, locales, pageMetadata } from "../../lib/site-config";
import { breadcrumbSchema, JsonLd } from "../../components/json-ld";

export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return isLocale(locale) ? pageMetadata(locale, "contact", copy[locale].title, copy[locale].description) : {}; }
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <><ContactPage initialLocale={locale} /><JsonLd data={breadcrumbSchema([{ name: "MONO/DEV", url: localePath(locale) }, { name: copy[locale].title, url: localePath(locale, "contact") }])} /></>; }
