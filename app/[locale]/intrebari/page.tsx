import { notFound } from "next/navigation";
import QuestionsPage from "../../intrebari/faq-client";
import { isLocale, localePath, locales, pageMetadata } from "../../lib/site-config";
import { faqUi } from "../../lib/faq-ui";
import { breadcrumbSchema, JsonLd } from "../../components/json-ld";
export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return isLocale(locale) ? pageMetadata(locale, "intrebari", faqUi[locale].title, faqUi[locale].lead) : {}; }
export default async function Questions({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <><QuestionsPage initialLocale={locale} /><JsonLd data={breadcrumbSchema([{ name: "MONO/DEV", url: localePath(locale) }, { name: faqUi[locale].title, url: localePath(locale, "intrebari") }])} /></>; }
