import ServicesView from "./view";
import { notFound } from "next/navigation";

import { isLocale, locales, pageMetadata } from "../../lib/site-config";
import { serviceLabels } from "../../lib/services";

type Props = { params: Promise<{ locale: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = serviceLabels[locale];
  return pageMetadata(locale, "services", copy.title, copy.description);
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ServicesView locale={locale} />;
}
