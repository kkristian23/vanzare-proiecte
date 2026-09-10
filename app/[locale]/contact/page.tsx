import { notFound } from "next/navigation";
import ContactPage from "../../contact/contact-client";
import { isLocale, localePath, locales, pageMetadata } from "../../lib/site-config";
import { breadcrumbSchema, JsonLd } from "../../components/json-ld";
const copy = { ro: { title: "Contact pentru proiectul tău web", description: "Discută un site, un magazin online sau personalizarea unui proiect MONO/DEV. Contact direct prin email și telefon, în Moldova și internațional." }, ru: { title: "Обсудим ваш веб-проект", description: "Свяжитесь с MONO/DEV по email или телефону: создание сайта, интернет-магазина или адаптация проекта для бизнеса в Молдове и за рубежом." }, en: { title: "Contact us about your web project", description: "Discuss a website, online store or project customization with MONO/DEV. Contact us directly by email or phone for local and international collaboration." } };
export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return isLocale(locale) ? pageMetadata(locale, "contact", copy[locale].title, copy[locale].description) : {}; }
export default async function Contact({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <><ContactPage initialLocale={locale} /><JsonLd data={breadcrumbSchema([{ name: "MONO/DEV", url: localePath(locale) }, { name: copy[locale].title, url: localePath(locale, "contact") }])} /></>; }
