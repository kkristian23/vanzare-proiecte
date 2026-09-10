import { notFound } from "next/navigation";
import { isLocale, locales } from "../lib/site-config";
export const dynamicParams = false;
export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) { if (!isLocale((await params).locale)) notFound(); return children; }
