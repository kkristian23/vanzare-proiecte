import { notFound } from "next/navigation";
import Home from "../home-client";
import { isLocale, pageMetadata } from "../lib/site-config";
import { JsonLd, websiteSchema } from "../components/json-ld";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return isLocale(locale) ? pageMetadata(locale) : {}; }
export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <><Home initialLocale={locale} /><JsonLd data={websiteSchema(locale)} /></>; }
